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
      "A from-scratch Python implementation exploring why weak ciphers fail, built as the first step toward understanding modern cryptography.",
  },
];

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">About</h1>
      <div className="space-y-6 mb-16 max-w-5xl">
        <p className="text-muted-foreground leading-relaxed">
          I've been interested in programming since high school, but ended up studying actuarial science and going into financial consulting. The interest never really went away though.
          If anything, spending a few years working made me realize how much I actually wanted to pursue cybersecurity — so here I am.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          This is where I write through what I'm learning. Systems programming and security are new territory for me, but I'm not starting from zero. Partly to keep track, partly because explaining something is the fastest way to find out if you actually understand it.
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
              <h3 className="text-sm font-medium text-foreground mb-1">{project.title}</h3>
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
