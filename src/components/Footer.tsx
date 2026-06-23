const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">© 2026</span>
        <a
          href="https://github.com/n0as-ark"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          github
        </a>
      </div>
    </footer>
  );
};

export default Footer;
