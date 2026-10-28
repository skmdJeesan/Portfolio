import {
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiMongodb,
} from "react-icons/si";
import { FaReact } from "react-icons/fa";
import { Code2, Terminal } from "lucide-react";

type FloatingIcon = {
  Icon: React.ElementType;
  position: string; // where it sits (percentages, so it scales with the screen)
  visibility: string; // which breakpoints show it
  color: string;
  x: number; // drift distance in px
  y: number;
  rotate: number;
  duration: number;
  delay: number;
};

export const floating_icons: FloatingIcon[] = [
  {
    Icon: FaReact,
    position: "top-[16%] left-[6%]",
    visibility: "",
    color: "text-amber-400/30",
    x: 14,
    y: -22,
    rotate: 10,
    duration: 7,
    delay: 0,
  },
  {
    Icon: SiNextdotjs,
    position: "top-[20%] right-[7%]",
    visibility: "",
    color: "text-white/20",
    x: -12,
    y: 20,
    rotate: -8,
    duration: 8,
    delay: 0.6,
  },
  {
    Icon: SiTypescript,
    position: "bottom-[16%] left-[9%]",
    visibility: "",
    color: "text-white/20",
    x: 16,
    y: 18,
    rotate: -10,
    duration: 9,
    delay: 1.1,
  },
  {
    Icon: SiNodedotjs,
    position: "bottom-[20%] right-[8%]",
    visibility: "",
    color: "text-amber-400/30",
    x: -14,
    y: -20,
    rotate: 8,
    duration: 7.5,
    delay: 0.3,
  },
  {
    Icon: Code2,
    position: "top-[46%] left-[3%]",
    visibility: "hidden sm:block",
    color: "text-amber-400/25",
    x: 10,
    y: -26,
    rotate: 6,
    duration: 10,
    delay: 0.9,
  },
  {
    Icon: Terminal,
    position: "top-[40%] right-[3%]",
    visibility: "hidden sm:block",
    color: "text-white/15",
    x: -10,
    y: 24,
    rotate: -6,
    duration: 9.5,
    delay: 1.4,
  },
  {
    Icon: SiMongodb,
    position: "bottom-[8%] left-[44%]",
    visibility: "hidden md:block",
    color: "text-white/15",
    x: 20,
    y: -14,
    rotate: 8,
    duration: 11,
    delay: 0.5,
  },
];

export const technologies = [
  { name: "C", logo: "https://icon.icepanel.io/Technology/svg/C.svg" },
  { name: "C++", logo: "https://www.svgrepo.com/show/452183/cpp.svg" },
  { name: "Java", logo: "https://www.svgrepo.com/show/75601/java-logo.svg" },
  { name: "Python", logo: "https://www.svgrepo.com/show/452091/python.svg" },
  {
    name: "HTML",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  {
    name: "CSS",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css/css-original.svg",
  },
  {
    name: "JavaScript",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    name: "React",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Redux",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
  },
  {
    name: "TypeScript",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "Next.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  },
  {
    name: "Tailwind CSS",
    logo: "https://www.svgrepo.com/show/374118/tailwind.svg",
  },
  {
    name: "GSAP",
    logo: "/gsap.svg",
  },
  {
    name: "Framer Motion",
    logo: "/motion.svg",
  },
  {
    name: "Postman",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
  },
  {
    name: "Node.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "Express.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  },
  {
    name: "Firebase",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
  },
  {
    name: "REST API",
    logo: "https://www.svgrepo.com/show/447473/rest-api.svg",
  },
  {
    name: "GraphQL",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
  },
  {
    name: "MySQL",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
  {
    name: "PostgreSQL",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  {
    name: "MongoDB",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  {
    name: "Redis",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
  },
  {
    name: "Qdrant",
    logo: "/qdrant.svg",
  },
  {
    name: "Git",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  {
    name: "LangChain",
    logo: "https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/logos/langchain-ipuhh4qo1jz5ssl4x0g2a.png/langchain-dp1uxj2zn3752pntqnpfu2.png?_a=DATAiZAAZAA0",
  },
  {
    name: "Docker",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
  {
    name: "Kubernetes",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
  },
  { name: "AWS", logo: "https://www.svgrepo.com/show/448266/aws.svg" },
  { name: "Vercel", logo: "/vercel.svg" },
  {
    name: "Render",
    logo: "/render.svg",
  },
];
