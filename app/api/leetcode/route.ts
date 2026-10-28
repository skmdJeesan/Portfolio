import { NextResponse } from 'next/server'

const QUERY = `
query userProfile($username: String!) {
  allQuestionsCount { difficulty count }
  matchedUser(username: $username) {
    username
    profile { realName userAvatar ranking }
    submitStatsGlobal { acSubmissionNum { difficulty count } }
    badges { displayName icon }
    userCalendar { totalActiveDays submissionCalendar }
  }
  userContestRanking(username: $username) {
    rating
    globalRanking
    totalParticipants
    attendedContestsCount
    topPercentage
  }
}`

type Count = { difficulty: string; count: number }
const pick = (arr: Count[] | undefined, d: string) => arr?.find((x) => x.difficulty === d)?.count ?? 0

export async function GET(req: Request) {
  const username = new URL(req.url).searchParams.get('username') ?? ''
  if (!/^[A-Za-z0-9_-]{1,40}$/.test(username)) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 })
  }

  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0 (compatible; portfolio-stats)',
      },
      body: JSON.stringify({ query: QUERY, variables: { username } }),
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`LeetCode responded ${res.status}`)

    const { data } = await res.json()
    const user = data?.matchedUser
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const solved = user.submitStatsGlobal?.acSubmissionNum as Count[] | undefined
    const totals = data.allQuestionsCount as Count[] | undefined
    const contest = data.userContestRanking

    // calendar keys are unix seconds -> convert to YYYY-MM-DD (UTC)
    const raw = JSON.parse(user.userCalendar?.submissionCalendar || '{}') as Record<string, number>
    const submissions: Record<string, number> = {}
    for (const [ts, count] of Object.entries(raw)) {
      submissions[new Date(Number(ts) * 1000).toISOString().slice(0, 10)] = Number(count)
    }

    const body = {
      username: user.username,
      realName: user.profile?.realName ?? user.username,
      avatar: user.profile?.userAvatar ?? '',
      ranking: user.profile?.ranking ?? 0,
      solved: {
        all: pick(solved, 'All'),
        easy: pick(solved, 'Easy'),
        medium: pick(solved, 'Medium'),
        hard: pick(solved, 'Hard'),
      },
      totals: {
        easy: pick(totals, 'Easy'),
        medium: pick(totals, 'Medium'),
        hard: pick(totals, 'Hard'),
      },
      contest: contest
        ? {
            rating: Math.round(contest.rating),
            globalRanking: contest.globalRanking,
            totalParticipants: contest.totalParticipants,
            attended: contest.attendedContestsCount,
            topPercentage: contest.topPercentage ?? 0,
          }
        : null,
      badges: (user.badges ?? []).map((b: { displayName: string; icon: string }) => ({
        name: b.displayName,
        icon: b.icon?.startsWith('http') ? b.icon : `https://leetcode.com${b.icon}`,
      })),
      calendar: { totalActiveDays: user.userCalendar?.totalActiveDays ?? 0, submissions },
    }

    return NextResponse.json(body, {
      headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' },
    })
  } catch (err) {
    console.error('leetcode fetch failed:', err)
    return NextResponse.json({ error: 'Failed to fetch LeetCode stats' }, { status: 502 })
  }
}