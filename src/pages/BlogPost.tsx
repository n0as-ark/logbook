import { useParams, Link } from "react-router-dom";
import { posts } from "@/data/posts";
import { ArrowLeft } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-muted-foreground">Post not found.</p>
        <Link to="/blog" className="text-primary text-sm hover:underline underline-offset-4 mt-4 inline-block">
          ← Back to blog
        </Link>
      </div>
    );
  }

  // Simple markdown-like rendering for the content
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let key = 0;

    const flush = () => {
      if (codeLines.length > 0) {
        elements.push(
          <pre key={key++}>
            <code>{codeLines.join("\n")}</code>
          </pre>
        );
        codeLines = [];
      }
    };

    for (const line of lines) {
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          flush();
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      if (line.startsWith("## ")) {
        elements.push(<h2 key={key++}>{line.slice(3)}</h2>);
      } else if (line.startsWith("### ")) {
        elements.push(<h3 key={key++}>{line.slice(4)}</h3>);
      } else if (line.trim() === "") {
        continue;
      } else {
        // Handle inline code and bold
        const html = line
          .replace(/`([^`]+)`/g, '<code>$1</code>')
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        elements.push(
          <p key={key++} dangerouslySetInnerHTML={{ __html: html }} />
        );
      }
    }
    flush();
    return elements;
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        Back
      </Link>

      <header className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight mb-3">{post.title}</h1>
        <div className="flex items-center gap-3 mb-4">
          <time className="font-mono text-xs text-muted-foreground">{post.date}</time>
          <span className="text-muted-foreground/40">·</span>
          <span className="font-mono text-xs text-muted-foreground">{post.readTime}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {post.tags.map((tag) => (
            <span key={tag} className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="prose-blog">{renderContent(post.content)}</div>
    </div>
  );
};

export default BlogPost;
