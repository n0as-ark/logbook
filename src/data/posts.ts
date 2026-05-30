export interface Post {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  readTime: string;
}

export const ALL_TAGS = ["C++", "Network", "Data Structure", "Operating Systems", "Linux", "Cryptography"] as const;

export const posts: Post[] = [
  {
    title: "A Password Lock Isn't Real Encryption",
    slug: "xor-cipher-excel-password-intro",
    date: "2026-05-14",
    tags: ["Cryptography", "Python"],
    excerpt: "A lot of organizations still lock down sensitive files with nothing more than an Excel or Word password. In this post, I look at why that falls short of real encryption - and walk through a small project I built to make that gap visible.",
    readTime: "4 min",
    content: `Across many industries, sensitive data like employee records, financial documents, personal identifiers often gets shared as Excel or Word files protected only by a simple password.

At first glance, it feels secure. You set a password, the file locks, and you're done.

But what does that password actually do, and how secure is it really?<br>I wanted to find out, so I decided to build an encryption tool from scratch to understand what's really happening on the backend.

## What Is Encryption, Really?

At its core, encryption is a way to scramble data so that only someone with the right key can read it.

Think of it like a combination lock:
- The **plaintext** is the message you want to protect.
- The **key** is the combination.
- The **ciphertext** is the locked (scrambled) result.

The strength of encryption depends entirely on how hard it is to guess the combination.

## The Problem with Simple Passwords

In modern Office, your password is used to derive an encryption key for the file. Older versions used very weak protection schemes - in some cases little more than a single-byte XOR - where the entire "lock" has only **256 possible combinations**.

A computer can try all 256 in milliseconds.

## What I'm Building

Over the next few weeks, I'm building a PII-aware file encryption tool in Python as a learning project. Instead of jumping straight to modern algorithms like AES, I'm starting with XOR - the weakest possible "encryption" - to show, step by step, how an insecure design collapses.

In the next post, I'll implement XOR encryption from scratch, walk through exactly how it works, and explain why it should never be relied upon to protect real sensitive data.`,
  },
  {title: "XOR Encryption: A Simple Cipher That Breaks Very Easily",
   slug: "xor-cipher-basics",
   date:"2026-05-18",
   tags: ["Cryptography", "Python"],
   excerpt: "Before jumping into modern cryptography, I want to start with XOR - the weakest possible cipher. Not because it is secure, but because it is the clearest way to see how plaintext becomes ciphertext, and how a weak design can fail very quickly.",
   readTime: "5 min",
   content: `In the last post, I talked about how a password prompt does not automatically mean strong protection. In modern Office files, a password is usually used to derive a real encryption key for algorithms like AES. But older protection methods could be much weaker, which makes XOR a useful place to start if the goal is to understand what encryption is actually doing behind the scenes. So instead of jumping straight into modern cryptography, I want to begin with XOR. Not because it is secure, but because it is one of the clearest ways to see how plaintext becomes ciphertext, and how a weak design can fail very quickly.
## What is XOR?
XOR stands for *exclusive or*. It is a bitwise operation that compares two bits and returns \`1\` if they are different, and \`0\` if they are the same.
| A | B | A XOR B |
|---|---|---------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |
What makes XOR interesting is that it is reversible. If you apply XOR to a value with the same key twice, you get the original value back. That means the same operation can be used for both encryption and decryption.
\`\`\`python
5 ^ 3  # 6
6 ^ 3  # 5
\`\`\`
Simple and elegant. But in this case, that simplicity is also the weakness.`,
  },
];
