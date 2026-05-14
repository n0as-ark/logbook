const currentlyLearning = [
  "C++",
  "Data Structures",
  "Operating Systems",
  "Networking",
  "Linux",
  "Cryptography",
];

const skills = [
  "Python", "Java", "C++", "Git",
];

const About = () => {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">About</h1>
      <div className="space-y-6 mb-16">
        <p className="text-muted-foreground leading-relaxed">
          I'm a student who got into CS because of cybersecurity — and now I'm building my way there. That means a lot of C++, data structures, operating systems, and networking before the fun stuff.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          This is where I keep track of what I'm learning. Partly for myself, partly in case it's useful to someone else.
        </p>
      </div>
      {/* Currently learning */}
      <section className="mb-16">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-6">
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
      {/* Skills */}
      <section>
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Skills & Topics
        </h2>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {skills.map((skill) => (
            <span key={skill} className="font-mono text-xs text-muted-foreground">
              {skill}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
