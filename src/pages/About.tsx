const currentlyLearning = [
  "OSCP preparation",
  "Active Directory exploitation",
  "Malware analysis fundamentals",
  "Cloud security (AWS)",
];

const skills = [
  "Linux", "Networking", "Web Security", "Python", "Bash",
  "Nmap", "Burp Suite", "Wireshark", "Metasploit", "Ghidra",
  "Docker", "Git", "CTF", "OWASP Top 10",
];

const About = () => {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">About</h1>

      <div className="space-y-6 mb-16">
        <p className="text-muted-foreground leading-relaxed">
          I'm a cybersecurity enthusiast documenting the process of learning offensive and defensive security. This journal exists as a technical reference — for my future self and for anyone following a similar path.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          My approach is methodical: understand the fundamentals, practice in controlled environments, document everything. I believe that the ability to clearly explain a technique is the truest measure of understanding it.
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
