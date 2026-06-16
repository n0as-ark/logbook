import { Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus} from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Post } from "@/data/posts";

interface PostCardProps {
  post: Post;
  redacted?: boolean;
}

const getLanguage = (tags: string[]) => {
  if (tags.includes("C++")) return "cpp";
  if (tags.includes("Python")) return "python";
  return "text";
};

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
          <div className="w-52 shrink-0 hidden sm:block overflow-hidden">
            <SyntaxHighlighter
              language={getLanguage(post.tags)}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: "1rem",
                fontSize: "11px",
                lineHeight: "1.6",
                height: "100%",
                background: "#1e1e1e",
                borderRadius: 0,
              }}
              wrapLongLines
            >
              {post.snippet}
            </SyntaxHighlighter>
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
