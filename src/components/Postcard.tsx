import { Link } from "react-router-dom";
import type { Post } from "@/data/posts";

interface PostCardProps {
  post: Post;
  redacted?: boolean;
}

const PostCard = ({ post, redacted = false }: PostCardProps) => {
  return (
    <article
      className={`border-b border-border py-6 transition-all duration-150 ${
        redacted ? "opacity-20 grayscale" : "opacity-100"
      }`}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="group block rounded-sm -mx-4 px-4 -my-2 py-2 transition-shadow hover:ring-1 hover:ring-border"
      >
        <div className="flex items-center gap-3 mb-2">
          <time className="font-mono text-xs text-muted-foreground">{post.date}</time>
          <span className="text-muted-foreground/40">·</span>
          <span className="font-mono text-xs text-muted-foreground">{post.readTime}</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{post.excerpt}</p>
        <div className="flex flex-wrap gap-3">
          {post.tags.map((tag) => (
            <span key={tag} className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </article>
  );
};

export default PostCard;
