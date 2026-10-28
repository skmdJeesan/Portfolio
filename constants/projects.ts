export const projects = [
  {
    slug: "soen",
    title: "SOEN - Collaborative AI Code Editor",
    description: "A browser-based, real-time collaborative code editor where multiple developers write, run and preview code together, with an integrated AI assistant that can scaffold and modify project files on request.",
    images: [
      '/soen-home.png',
      '/soen-project.png',
      '/soen-preview.png',
      '/soen-register.png'
    ],
    technologies: ["React", "Node.js", "Express.js", "MongoDB", "Redis", "Socket.IO", "WebContainer", "Groq API"],
    liveUrl: "https://soen-frontend-2x42.onrender.com/",
    githubUrl: "https://github.com/skmdJeesan/SOEN",
    features: [
      "Real-time collaborative editing with Monaco and Socket.IO",
      "In-browser execution, terminal and live preview via WebContainer",
      "@soen AI assistant that generates and edits project file trees",
      "JWT auth with Redis sessions and email verification"
    ]
  },
  {
    slug: "soenchat",
    title: "SOENCHAT - AI Multi-Agent Platform",
    description: "A microservice-based AI platform inspired by ChatGPT and DeepSeek, with intelligent agent routing, web search, document and images generation, and subscription billing, deployed on AWS.",
    images: [
      '/soenchat-landing.png',
      '/soenchat-chat.png',
      '/soenchat-code.png',
      '/soenchat-code-preview.png',
      '/soenchat-billing.png',
      '/soenchat-web.png',
      '/soenchat-auth.png'
    ],
    technologies: ["React", "Redux Toolkit", "Node.js", "MongoDB", "Redis", "Docker", "AWS ECS", "GitHub Actions"],
    liveUrl: "https://d2sxx6hi1j69nt.cloudfront.net/",
    githubUrl: "https://github.com/skmdJeesan/SOENCHAT",
    features: [
      "Separate auth, chat, agent and billing services behind an API gateway",
      "Agent routing with web search, PDF/PPT and images generation",
      "Google Sign-In, JWT auth and Razorpay subscriptions",
      "CI/CD to ECS, S3 and CloudFront with GitHub Actions"
    ]
  },
  {
    slug: "convolution",
    title: "Convolution 2026 Website",
    description: "Official website of Convolution, the annual tech fest organised by the Department of Electrical Engineering, Jadavpur University, covering 9 types of events.",
    images: [
      '/convolution-home.png',
      '/convolution-events.png',
      '/convolution-register.png',
      '/convolution-profile.png'
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://convolutionjuee.com",
    githubUrl: "https://github.com/skmdJeesan/Convolution-XI",
    features: [
      "Live in production for the 2026 fest",
      "Pages for 9 different event categories",
      "Built collaboratively in a team of 4",
      "448+ commits of iterative development"
    ]
  },
  {
    slug: "snapcart",
    title: "SnapCart - Grocery Delivery Platform",
    description: "A production-ready, full-stack grocery delivery app covering the whole journey from browsing and checkout to real-time delivery tracking, with an admin dashboard for catalog and order management.",
    images: [
      '/snapcart-home.png',
      '/snapcart-store.png',
      '/snapcart-cart.png',
      '/snapcart-checkout.png',
      '/snapcart-start.png',
      '/snapcart-register.png'
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Redux Toolkit", "MongoDB", "Socket.IO", "Stripe", "Leaflet"],
    liveUrl: "https://snapcart-gamma-henna.vercel.app",
    githubUrl: "https://github.com/skmdJeesan/SnapCart",
    features: [
      "Google OAuth and email/password auth with NextAuth",
      "Stripe payments with delivery slot selection",
      "Live delivery tracking on a map and customer-agent chat",
      "Admin dashboard with Cloudinary images uploads"
    ]
  },
  {
    slug: "linkedin",
    title: "LinkedIn Clone",
    description: "A LinkedIn-style professional networking app built with the MERN stack.",
    images: [
      '/linkedin-landing.png',
      '/linkedin-register.png',
      '/linkedin-profile.png',
      '/linkedin-profile-edit.png',
      '/linkedin-posting.png',
      '/linkedin-comments.png',
      '/linkedin-posts.png',
    ],
    technologies: ["MongoDB", "Express.js", "React", "Node.js"],
    liveUrl: "https://linkedin-client-pe4j.onrender.com/",
    githubUrl: "https://github.com/skmdJeesan/LinkedIn",
    features: [
      // TODO: this repo has no README, so replace these with what you actually built
      "Full-stack MERN architecture",
      "Secure JWT based authentication with gmail verification and reset password feature",
      "REST API backed by MongoDB",
      "Deployed on Render"
    ]
  },
  {
    slug: "support-ai",
    title: "Support AI - Chatbot SaaS",
    description: "A SaaS platform that lets any business add an AI support chatbot to its website in under a minute by pasting a single script tag.",
    images: [
      '/support-dashboard.png',
      '/support-embeded.png',
      '/support-landing.png',
      '/support-login.png'
    ],
    technologies: ["Next.js", "TypeScript", "Node.js", "Gemini API", "JavaScript"],
    liveUrl: "https://support-ai-six-nu.vercel.app",
    githubUrl: "https://github.com/skmdJeesan/support-ai",
    features: [
      "Zero-setup embed through a single script tag",
      "Chatbot grounded in each business's own details",
      "Powered by Google Gemini for fast replies",
      "Embeddable vanilla JS widget that works on any website"
    ]
  }
];