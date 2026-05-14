import { ALL_TAGS } from "@/data/posts";
import TagBadge from "./TagBadge";

interface TagFilterProps {
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
}

const TagFilter = ({ activeTag, onTagChange }: TagFilterProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <TagBadge tag="All" active={activeTag === null} onClick={() => onTagChange(null)} />
      {ALL_TAGS.map((tag) => (
        <TagBadge
          key={tag}
          tag={tag}
          active={activeTag === tag}
          onClick={() => onTagChange(activeTag === tag ? null : tag)}
        />
      ))}
    </div>
  );
};

export default TagFilter;
