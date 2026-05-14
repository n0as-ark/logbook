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
    date: "2026-05-19",
    tags: ["Cryptography", "Python"],
    excerpt: "A lot of organizations still lock down sensitive files with nothing more than an Excel or Word password. In this post, I look at why that falls short of real encryption - and walk through a small project I built to make that gap visible.",
    readTime: "4 min",
    content: `Across many industries, sensitive data - employee records, financial documents, personal identifiers - gets shared as Excel or Word files protected by a simple password.

It feels secure. You set a password, the file locks, done.

But what does that password actually do - and how secure is it really?
I wanted to find out, so I decided to build an encryption tool from scratch to understand what's really going on under the hood.

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

In the next post, I'll implement XOR encryption from scratch and walk through exactly how it works - and why you should never rely on anything like it to protect real sensitive data.`,
  }
];
