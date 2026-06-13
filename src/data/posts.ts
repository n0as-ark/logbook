export interface Post {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  readTime: string;
}

export const ALL_TAGS = ["C++", "Python", "Linux", "Network", "Data Structure", "Operating Systems", "Cryptography"] as const;

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
   date:"2026-05-24",
   tags: ["Cryptography", "Python"],
   excerpt: "Before jumping into modern cryptography, I want to start with XOR - the weakest possible cipher. Not because it is secure, but because it is the clearest way to see how plaintext becomes ciphertext, and how a weak design can fail very quickly.",
   readTime: "8 min",
   content: `In the last post, I talked about how a password prompt does not automatically mean strong protection. In modern Office files, a password is usually used to derive a real encryption key for algorithms like AES. But older protection methods could be much weaker, which makes XOR a useful place to start if the goal is to understand what encryption is actually doing behind the scenes.
So instead of jumping straight into modern cryptography, I want to begin with XOR. Not because it is secure, but because it is one of the clearest ways to see how plaintext becomes ciphertext, and how a weak design can fail very quickly.
## What is XOR?
XOR stands for *exclusive or*. It is a bitwise operation that compares two bits and returns \`1\` if they are different, and \`0\` if they are the same.
| A | B | A XOR B |
|---|---|---------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |
For example, if we write 5 and 3 in binary:
- 5 is **101**
- 3 is **011**
Now we apply XOR bit by bit:
\`\`\`
5 → 101
3 → 011
────────
6 → 110
\`\`\`
The result **110** in binary is 6 in decimal, so 5 XOR 3 = 6.
What makes XOR interesting is that it is reversible. If you apply XOR to a value with the same key twice, you get the original value back. That means the same operation can be used for both encryption and decryption.
\`\`\`python
5 ^ 3  # 6
6 ^ 3  # 5
\`\`\`
Simple and elegant. But in this case, that simplicity is also the weakness.
## Building XOR encryption in Python
Here's the most basic version: take each byte of a message and XOR it with a single-byte key.
\`\`\`python
def xor_encrypt(plaintext: bytes, key: int) -> bytes:
  return bytes(byte ^ key for byte in plaintext)

xor_decrypt = xor_encrypt

message = b"Hello, World!"
key = 13

ciphertext = xor_encrypt(message, key)
recovered = xor_decrypt(ciphertext, key)

print(ciphertext)
print(recovered)
\`\`\`
This works exactly as expected. The original message turns into unreadable bytes, and applying the same key again restores it. At a mechanical level, that is encryption.
### Why it falls apart
The problem is the size of the key space. A single byte key only has 256 possible values, which means an attacker can simply try every possible key and check which output looks like real text.
\`\`\`python
def brute_force(ciphertext: bytes) -> None:
  for key in range(256):
      attempt = xor_decrypt(ciphertext, key)
      try:
          text = attempt.decode("utf-8")
          if " " in text:
              print(f"Key {key}: {text}")
      except UnicodeDecodeError:
          pass
\`\`\`
This version makes a very simple assumption: the original plaintext is a normal English sentence, so the brute force loop treats any decoded output that contains a space as "interesting." That is enough for a quick demo, but it is only a heuristic, not a general solution. If the plaintext were something else, such as a numeric PIN or a password with letters, numbers, and a small set of symbols, the \`if\` condition inside \`brute_force\` would need to be updated to match that expected format instead.
The important part is not the exact heuristic, but the fact that every possible key can be tested quickly.
That is why single byte XOR is not something you would rely on for real world protection. It is useful as a teaching tool, but not as a serious security design.
There is another weakness too: if part of the original plaintext is predictable, for example a file header or a standard phrase, XOR can leak the key very quicky. That kind of weakness is one reason real encryption systems need more than a simple reversible operation.
### Why learn it anyway?
Even though XOR is weak on its own, it is not useless. XOR still appears inside modern cryptographic algorithms, but there is only one small component inside a much larger design with strong keys, multiple rounds, and carefully constructed transformations.
That is exactly why I think it is worth building from scratch. If you understand how a simple scheme like XOR works, it becomes much easier to see why modern encryption needs things like large key sizes, key derivation, and stronger cipher structure.
> → **Next up:** We'll look at multi-byte XOR with a repeating key - a step up from single-byte, but still breakable with a technique called frequency analysis.`,
  },
  {title: "Pointers and Dynamic Memory in C++: Part 1",
   slug: "pointers-and-dynamic-memory-in-cpp-part1",
   date:"2026-05-30",
   tags: ["C++"],
   excerpt: "Pointers, heap allocation, dynamic arrays, and pointer arithmetic were some of the challenging topics when I learned C++. This post walks through each topic in detail - mostly for my own benefit, but hopefully useful for anyone struggling with them as well.",
   readTime: "10 min",
   content: `For a lot of people learning C++, pointers are the first concept that really feels "tricky." That reputation is well-earned, but once the mental model clicks, they become one of the most powerful tools in the language. This first part covers what pointers are, how they live in memory, how they interact with the heap allocation, and how dynamic arrays work in practice.
## What is a Pointer?
A pointer is a variable that stores the memory address of another object. Why do we need them? Three main reasons:
- To store a reference to an object, so multiple parts of a program can access the same data without copying it.
- To allocate large amounts of memory on the heap, independent of any function's lifetime.
- To link objects together, which is the foundation of data structures like linked lists and trees.
**Declaring a pointer**
\`\`\`c++
int* ptr;    // preferred by many
int *ptr;    // also valid
int * ptr;   // also valid
\`\`\`
All three mean the same thing. The \`*\` is what makes it a pointer, it declares that \`ptr\` holds an address of an \`int\`, not an \`int\` itself.
In memory, a pointer value behaves like an address. Its size is fixed per platform, typically 8 bytes on a 64 bit system, regardless of what type it points to.
## Making a Pointer point to something
To make a pointer point at a variable, you use the address of operator \`&\`:
\`\`\`c++
int x = 100;
int* ptr;
ptr = &x;    // ptr now holds the address of x
\`\`\`
You can read \`&x\` as asking where in memory \`x\` lives. The answer, a memory address, gets stored in \`ptr\`.
**Dereferencing: getting the value back**
Storing an address is only useful if the program can follow it to the data. Dereferencing does exactly that, using the \`*\` operator:
\`\`\`c++
int x = 100;
int* ptr = &x;
cout << *ptr;    // outputs 100, reads the value at the address ptr holds
*ptr = 20;       // writes 20 to that address, x is now 20
\`\`\`
\`ptr\` is the address, and \`*ptr\` is the value living at that address.
**What if a pointer should not point to anything?**
A pointer may point to a valid object, hold a special null value, or contain an indeterminate value if it is uninitialized. When a pointer is not pointing to anything valid on purpose, it should be set to \`nullptr\`:
\`\`\`c++
int* ptr = nullptr;
\`\`\`
Dereferencing a null pointer is undefined behavior, and in practice it often results in a crash. That is actually helpful, because a hard failure is easier to detect than silent memory corruption.
**Defining multiple pointers on one line**
The \`*\` binds to the variable name, not the type. This trips people up:
\`\`\`c++
int *ptr1, x;       // ptr1 is a pointer, x is a plain int
int *ptr2, *ptr3;    // both are pointers
\`\`\`
## Pointers in Memory
Let's trace what happens in memory with a concrete example. The exact addresses are illustrative, real programs are free to lay things out differently, but the relationships are what matter.
\`\`\`c++
int main() {
    int x;        // imagine this lives at address 1000
    int *px;      // imagine this lives at address 1004
    x = 5;
    px = &x;
    
    cout << x << endl;    // 5, the value of x
    cout << px << endl;   // 1000, the address px holds (where x lives)
    cout << *px << endl;  // 5, dereference: value at address 1000
    cout << &px << endl;  // 1004, the address of px itself
    
    x = 10;        // x is now 10, px still points to x
    *px = 15;      // writes 15 to address 1000, so x is now 15
    
    cout << x << endl;    // 15
    cout << *px << endl;  // 15
    cout << px << endl;   // 1000, px has not moved
}
\`\`\`
The key insight is that \`x\` and \`*px\` refer to the same memory cell. Changing one changes the other, because they are the same thing viewed two different ways.
## Pointers and the Heap, Dynamic Memory Allocation
So far, every variable we have used lives on the stack. That is memory that is automatically managed as functions are called and return. Stack variables vanish when their function ends.

The heap, also called the free store, is different. When you use raw \`new\` and \`delete\`, memory is requested and released explicitly by the programmer.
**Allocating with \`new\`**
\`\`\`c++
int* ptr = new int;          // allocate one int on the heap
int* arr = new int[10];      // allocate an array of 10 ints on the heap
\`\`\`
\`new\` returns a pointer to the allocated memory. The memory itself has no name, and the only way to reach it is through that pointer.
Key properties of heap memory when it's managed manually:
- It persists across function calls, it will not disappear when the current function returns.
- It stays allocated until it is explicitly freed, or the program ends.
- If the last pointer to it is lost without freeing, that memory becomes inaccessible, which is a **memory leak**.
**Deallocating with \`delete\`**
\`\`\`c++
delete ptr;        // free a single object
delete[] arr;      // free an array
ptr = nullptr;     // good practice, reset after deleting
\`\`\`
Rules to remember when using \`new\` and \`delete\`:
- Every \`new\` should have exactly one matching \`delete\`, and every \`new[]\` should have exactly one matching \`delete[]\`.
- Forgetting \`delete\` leads to a memory leak.
- Calling \`delete\` twice on the same non null pointer is undefined behavior.
- Deleting \`nullptr\` is safe and has no effect, so resetting pointers after deletion can help avoid accidental reuse.
## Dynamic Arrays
One practical use of heap allocation is creating arrays whose size is not known until runtime:
\`\`\`c++
int size;
cin >> size;
int* arr = new int[size];        // size determined at runtime

for (int i = 0; i < size; i++) {
    arr[i] = i * 2;
}

delete[] arr;        // freeing arr
arr = nullptr;
\`\`\`
With a heap array, the size can be based on runtime input, not just compile time constants. Once created, that particular array cannot grow on its own. Because it is accessed through a pointer, you can allocate a new larger array, copy the data over, and delete the old one. This is the basic idea behind how resizable arrays are implemented under the hood.
## What Comes Next
This first part focuses on the fundamentals: what pointers are, how they behave on the stack, and how they interact with heap allocation and dynamic arrays. The next part covers \`std::vector\`, pointer arithmetic, and the role of pointers in function interfaces and double pointers.`,
  },
  {title: "Pointers and Dynamic Memory in C++: Part 2",
   slug: "pointers-and-dynamic-memory-in-cpp-part2",
   date:"2026-06-07",
   tags: ["C++"],
   excerpt: "This second part looks at how std::vector builds on raw pointers and dynamic arrays, how pointer arithmetic really works, and how pointers are used in function parameters and double pointers.",
   readTime: "10 min",
   content: `The first part covered basic pointers, stack and heap memory, and raw dynamic arrays. This second part looks at how \`std::vector\` builds on those ideas, how pointer arithmetic actually works, and how pointers are used in function interfaces and double pointers.
## Vectors, the Standard Library Solution
Manually managing resizable arrays is error prone. The C++ Standard Library provides \`std::vector\`, which handles dynamic storage management automatically:
\`\`\`c++
#include <vector>
using namespace std;

int main() {
    vector<int> v;

    for (int i = 0; i < 100; i++) {
        v.push_back(i * 100);      // appends to the vector, resizes automatically
    }

    for (int i = 0; i < v.size(); i++) {
        cout << v[i] << endl;
    }

    for (int val : v) {
        cout << val << endl;
    }
}
\`\`\`
Vectors provide dynamic resizing, convenient iteration, and automatic cleanup when they go out of scope. In modern C++, \`std::vector\` is usually the default choice over raw dynamic arrays unless a very specific reason exists to do otherwise.
## Pointer Arithmetic
C++ allows arithmetic on pointers to elements in an array. Adding 1 to a pointer does not add 1 byte; it advances by the size of the type being pointed to:

\`\`\`
Target Address = Base Address + (element size  index)
\`\`\`
For a \`double\` array, which is 8 bytes per element, starting at address 1000:
\`\`\`c++
     double * arr = new double[3];        // suppose arr points to address 1000
// arr + 1 would conceptually be 1000 + 8*1 = 1008, the next element
double* x = arr + 1;

cout << x - arr << endl;        // outputs 1, difference in elements, not bytes
\`\`\`
Pointer subtraction between two pointers into the same array gives the distance in elements, not bytes. This also explains array indexing. \`arr[i]\` is exactly equivalent to \`*(arr + i)\`, and they compile down to the same thing.
| Expression | Equivalent | Meaning |
|------------|------------|---------|
| \`arr\` | \`&arr[0]\` | base address |
| \`arr + 2\` | \`&arr[2]\` | address of element 2 |
| \`arr[0]\` | \`*arr\` | first element |
| \`arr[5]\` | \`*(arr+5)\` | sixth element |
`,
  },
];
