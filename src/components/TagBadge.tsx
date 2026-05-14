interface TagBadgeProps {
  tag: string;
  active?: boolean;
  onClick?: () => void;
}

const TagBadge = ({ tag, active = false, onClick }: TagBadgeProps) => {
  const base = "font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer";
  const color = active ? "text-primary" : "text-muted-foreground hover:text-foreground";

  return (
    <button onClick={onClick} className={`${base} ${color}`}>
      {tag}
    </button>
  );
};

export default TagBadge;
