import { Link } from "react-router-dom";
import type { Post } from "@/data/posts";

interface PostCardProps {
  post: Post;
  redacted?: boolean;
}

const PostCard = ({ post, redacted = false }: PostCardProps) => {
  return (
    <article
      className={`border border-border rounded-lg overflow-hidden transition-all duration-150 ${
        redacted ? "opacity-20 grayscale" : "opacity-100"
      }`}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="group flex rounded-sm overflow-hidden transition-shadow hover:ring-1 hover:ring-border"
      >
        {/* Code snippet panel */}
        {post.snippet && (
          <div className="w-56 shrink-0 bg-zinc-950 dark:bg-zinc-900 p-4 hidden sm:block">
            <pre className="text-xs text-zinc-300 leading-relaxed overflow-hidden font-mono whitespace-pre-wrap break-words">
              {post.snippet}
            </pre>
          </div>
        )}

        {/* Post info */}
        <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs uppercase tracking-wider text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-base font-semibold mb-2 text-foreground group-hover:text-primary transition-colors leading-snug">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {post.excerpt}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground font-mono">
            <time>{post.date}</time>
            <span className="text-muted-foreground/40">·</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default PostCard;
