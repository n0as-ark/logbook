import { Link } from "react-router-dom";

const currentlyLearning = [
  "C++",
  "Data Structures",
  "Operating Systems",
  "Networking",
  "Linux",
  "Cryptography",
];

const programmingSkills = [
  "Python", "Java", "C++", "Git",
];
const studyingSkills = ["C++", "Data Structures", "Networking", "OS", "Cryptography"];
const priorSkills = ["Actuarial Science", "Statistics", "Risk Modeling"];
const projects = [
  {
    title: "XOR Encryption Tool",
    description:
      "A from-scratch Python implementation of XOR encryption and the attacks that break it, built as a first step toward understanding modern cryptography.",
    href: "/blog/xor-cipher-excel-password-intro",
  },
  {
    title: "Credential Risk Analyzer",
    description:
      "A Python command-line tool exploring why strong-looking passwords still get breached, combining entropy with real breach data into a single risk score.",
    href: "/blog/is-a-strong-password-actually-safe",
  },
];

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">About</h1>
      <div className="space-y-6 mb-16 max-w-5xl">
        <p className="text-muted-foreground leading-relaxed">
          I've been interested in programming and cybersecurity since high school. I studied actuarial science and statistics at university, then worked in financial consulting after graduation, but that interest never went away.
          After a few years in the industry, it became clear how much I wanted to pursue cybersecurity.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          This blog is where I share what I'm learning. I picked up some programming skills at school, but systems programming and security are both new to me. Most of my posts will cover what I learn in those areas, along with related topics and personal projects I'm working on.
        </p>
      </div>
      {/* Currently learning */}
      <section className="mb-16">
        <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground mb-6">
          Currently learning
        </h2>
        <ul className="space-y-2">
          {currentlyLearning.map((item) => (
            <li key={item} className="text-sm text-foreground/85 flex items-start gap-2">
              <span className="text-muted-foreground mt-1.5 block w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>
      {/* Projects */}
      <section className="mb-16">
        <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground mb-6">
          Projects
        </h2>
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.title}>
              <h3 className="text-sm font-medium text-foreground mb-1">
                {project.href ? (
                  <Link to={project.href} className="hover:underline underline-offset-4">
                    {project.title}
                  </Link>
                ) : (
                  project.title
                )}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </section>
      {/* Skills */}
      <section>
        <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground mb-6">
          Skills & Background
        </h2>
        <div className="space-y-4">
          <div>
            <p className="font-mono text-xs text-muted-foreground/60 uppercase tracking-wider mb-2">
              Programming
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {programmingSkills.map((skill) => (
                <span key={skill} className="font-mono text-xs text-muted-foreground">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-xs text-muted-foreground/60 uppercase tracking-wider mb-2">
              Currently studying
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {studyingSkills.map((skill) => (
                <span key={skill} className="font-mono text-xs text-muted-foreground">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-xs text-muted-foreground/60 uppercase tracking-wider mb-2">
              Prior background
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {priorSkills.map((skill) => (
                <span key={skill} className="font-mono text-xs text-muted-foreground">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
