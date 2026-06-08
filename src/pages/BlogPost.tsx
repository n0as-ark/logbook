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

  const renderInline = (text: string) =>
    text
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let currentLang = "";
    let listItems: JSX.Element[] = [];
    let tableLines: string[] = [];
    let key = 0;

    const highlight = (code: string) => {
      return code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\b(def|return|import|from|as|if|else|elif|for|in|while|class|with|pass|break|continue|and|or|not|is|None|True|False|lambda|yield|try|except|finally|raise)\b/g, '<span style="color:#569CD6">$1</span>')
        .replace(/(b?&quot;[^&]*&quot;)/g, '<span style="color:#CE9178">$1</span>')
        .replace(/(#[^\n]*)/g, '<span style="color:#6A9955">$1</span>')
        .replace(/\b(\d+)\b/g, '<span style="color:#B5CEA8">$1</span>');
    };

    const flush = () => {
      if (codeLines.length > 0) {
        const raw = codeLines.join("\n");
        const content = currentLang ? highlight(raw) : raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        elements.push(
          <pre key={key++} style={{ background: "#1E1E1E", padding: "1rem", borderRadius: "4px", overflowX: "auto", marginBottom: "1.5rem" }}>
            <code style={{ fontFamily: "monospace", fontSize: "0.875rem", lineHeight: "1.6", color: "#D4D4D4" }}
              dangerouslySetInnerHTML={{ __html: content }} />
          </pre>
        );
        codeLines = [];
        currentLang = "";
      }
    };

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(<ul key={key++} className="prose-blog list-disc pl-5 space-y-1 mb-4">{listItems}</ul>);
        listItems = [];
      }
    };

    const flushTable = () => {
      if (tableLines.length < 2) { tableLines=[]; return; }
      const parseRow = (row) =>
        row.split("|").map(c=>c.trim()).filter(Boolean);
      const headers = parseRow(tableLines[0]);
      const body = tableLines.slice(2);
      elements.push(
        <table key={key++} className="w-full text-sm border-collapse mb-6 mt-2">
          <thead><tr>
            {headers.map((h,i) => (
              <th key={i} className="border border-border px-4 py-2 text-center font-medium text-muted-foreground bg-muted/40">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri}>
                {parseRow(row).map((cell, ci) => (
                  <td key={ci} className="border border-border px-4 py-2 text-center">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
      tableLines = [];
    };
  
    for (const line of lines) {
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          flush();
          inCodeBlock = false;
        } else {
          flushList();
          flushTable();
          inCodeBlock = true;
          currentLang = line.slice(3).trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      if(line.trim().startsWith("|")) {
        flushList();
        tableLines.push(line);
        continue;
      } else if (tableLines.length > 0 ) {
        flushTable();
      }
      
      if (line.startsWith("## ")) {
        flushList();
        elements.push(<h2 key={key++} className="prose-blog">{line.slice(3)}</h2>);
      } else if (line.startsWith("### ")) {
        flushList();
        elements.push(<h3 key={key++} className="prose-blog">{line.slice(4)}</h3>);
      } else if (line.startsWith("- ")) {
        listItems.push(
          <li dangerouslySetInnerHTML=
            {{__html: renderInline(line.slice(2))}} />
          );
      } else if (line.trim() === "") {
        flushList();
        continue;
      } else {
        flushList();
        elements.push(
          <p dangerouslySetInnerHTML={{ __html: renderInline(line)}} />
        );
      }
    }
    flushList();
    flushTable();
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
