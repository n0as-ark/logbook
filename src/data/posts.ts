export interface Post {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  readTime: string;
  snippet?: string;
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
    snippet: `# older XOR-based "encryption"
key = 0x0D
ciphertext = bytes(
  b ^ key for b in plaintext
)
# 256 possible keys - breakable
# in milliseconds`,
    content: `Across many industries, sensitive data like employee records, financial documents, personal identifiers often gets shared as Excel or Word files protected only by a simple password.

At first glance, it feels secure. You set a password, the file locks, and you're done.

But what does that password actually do, and how secure is it really?<br>I wanted to find out, so I decided to build an encryption tool from scratch to understand what's really happening on the backend.

## What Is Encryption, Really?

At its core, encryption is a way to scramble data so that only someone with the right key can read it.

Like a combination lock:
- The **plaintext** is the message you want to protect.
- The **key** is the combination.
- The **ciphertext** is the locked (scrambled) result.

The strength of encryption depends entirely on how hard it is to guess the combination.

## The Problem with Simple Passwords

In modern Office, your password is used to derive an encryption key for the file. Older versions used very weak protection schemes - in some cases little more than a single-byte XOR - where the entire "lock" has only **256 possible combinations**.

A computer can try all 256 in milliseconds.

## What I'm Building

Over the next few weeks, I'm building a PII-aware file encryption tool in Python as a learning project. Instead of jumping straight to modern algorithms like AES, I'm starting with XOR - the weakest possible "encryption" - to show, step by step, how an insecure design collapses.

In the next post, I'll implement XOR encryption from scratch, walk through exactly how it works, and explain why it should never be relied upon to protect real sensitive data.
> → **Next up:** [XOR Encryption: A Simple Cipher That Breaks Very Easily](https://n0as-ark.github.io/logbook/blog/xor-cipher-basics)`,
  },
  {title: "XOR Encryption: A Simple Cipher That Breaks Very Easily",
   slug: "xor-cipher-basics",
   date:"2026-05-24",
   tags: ["Cryptography", "Python"],
   excerpt: "Before jumping into modern cryptography, I want to start with XOR - the weakest possible cipher. Not because it is secure, but because it is the clearest way to see how plaintext becomes ciphertext, and how a weak design can fail very quickly.",
   readTime: "8 min",
   snippet: `def xor_encrypt(plaintext: bytes, key: int) -> bytes:
  return bytes(byte ^ key for byte in plaintext)

  xor_decrypt = xor_encrypt

  ciphertext = xor_encrypt(message, 13)
  recovered  = xor_decrypt(ciphertext, 13)`,
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
This works exactly as expected. 
| Plaintext | H | e | l | o | , | (space) | W | r | d | ! |
|-----------|---|---|---|---|---|---------|---|---|---|---|
| Key | 13 | 13 | 13 | 13 | 13 | 13 | 13 | 13 | 13 | 13 |
| Result | E | h | a | b | ! | - | Z | \\x7f | i | , |
The original message turns into unreadable bytes (b'Ehaab!-Zb\\x7fai,'), and applying the same key again restores it. At a mechanical level, that is encryption.
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

In the next post, we will look at multi-byte XOR with a repeating key. It's a step up from single-byte, but still breakable with a technique called frequency analysis.
> 🔗 **Code:** The full implementation is available on [GitHub](https://github.com/n0as-ark/XOR-Encryption-In-Python/blob/main/src).
> → **Next up:** [Multi-Byte XOR Encryption: Why a Longer Key Still Breaks](https://n0as-ark.github.io/logbook/blog/multi-byte-xor)`,
  },
  {title: "Pointers and Dynamic Memory in C++: Part 1",
   slug: "pointers-and-dynamic-memory-in-cpp-part1",
   date:"2026-05-30",
   tags: ["C++"],
   excerpt: "Pointers, heap allocation, dynamic arrays, and pointer arithmetic were some of the challenging topics when I learned C++. This post walks through each topic in detail - mostly for my own benefit, but hopefully useful for anyone struggling with them as well.",
   readTime: "10 min",
   snippet: `int* p = new int(42);
if (p) {
  std::cout << *p << '\\n'; // use
  delete p;               // free
  p = nullptr;            // avoid dangling
}`,
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
   snippet: `vector<int> v;
for (int i = 0; i < 100; i++)
  v.push_back(i * 100);

for (int val : v)
  cout << val << endl;`,
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
C++ allows arithmetic on pointers to array elements. Adding 1 to a pointer does not add 1 byte; it advances by the size of the type being pointed to:

\`\`\`
Target Address = Base Address + (element size x index)
\`\`\`
For a \`double\` array, which is 8 bytes per element, starting at address 1000:
\`\`\`c++
double* arr = new double[3];        // suppose arr points to address 1000
// arr + 1 would conceptually be 1000 + 8*1 = 1008, the next element
double* x = arr + 1;

cout << x - arr << endl;        // outputs 1, difference in elements, not bytes

delete[] arr;
arr = nullptr;
\`\`\`
Pointer subtraction between two pointers into the same array gives the distance in elements, not bytes. This also explains array indexing. \`arr[i]\` is exactly equivalent to \`*(arr + i)\`, and they compile down to the same thing.
| Expression | Equivalent | Meaning |
|------------|------------|---------|
| arr | &arr[0] | base address |
| arr + 2 | &arr[2] | address of element 2 |
| arr[0] | *arr | first element |
| arr[5] | *(arr+5) | sixth element |
## Pointers and Functions
Pointers unlock the ability to modify variables in the caller, something you cannot do with plain pass by value.
**Pass by value (no effect on original)**
\`\`\`c++
void func1(int n) {
    n = n + 1;      // modifies a local copy, caller sees nothing
}

int main() {
    int n = 5;
    func1(n);
    cout << n << endl;  //still 5
}
\`\`\`
**Pass by reference (modifies original, cleaner syntax)**
\`\`\`c++
void func2(int &n) {
    n = n + 1;      // n is an alias for the caller's variable
}

int main() {
    int n = 5;
    func2(n);
    cout << n << endl;  // 6
}
\`\`\`
**Pass by pointer (modifies original, explicit)**
\`\`\`c++
void func3(int* ptr) {
    *ptr = *ptr + 1;    // dereference to reach the original variable
}

int main() {
    int n = 5;
    func3(&n);          // pass the address of n
    cout << n << endl;  // 6
}
\`\`\`
Both pass by reference and pass by pointer can modify the original object, but they feel different at the call site. References are syntactically cleaner, while pointers make the indirection explicit and can also be null.
Use references when:
- The argument must always exist, and null should not be allowed.
- The binding should not be reseated to refer to a different object.
- Simpler syntax is preferred at the call site.
Use pointers when:
- The argument is optional, and you need to represent no object via \`nullptr\`.
- You may want to reseat the pointer to another object.
## Double Pointers
A pointer can point to another pointer. This is a double pointer, declared with \`**\`:
\`\`\`c++
int n = 5;
int* pt = &n;
int** doublePtr = &ptr;
\`\`\`
If, for example, \`n\` is at address 1000, \`ptr\` is at 1004, and \`doublePtr\` is at 1012:
\`\`\`c++
cout << n << endl;            // 5
cout << &n << endl;           // 1000, address of n
cout << ptr << endl;          // 1000, what ptr holds
cout << &ptr << endl;         // 1004, address of ptr
cout << *ptr << endl;         // 5, dereference ptr
cout << doublePtr << endl;    // 1004, what doublePtr holds
cout << *doublePtr << endl;   // 1000, dereference once to get ptr's value
cout << **doublePtr << endl;  // 5, dereference twice to get n's value
cout << &doublePtr << endl;   // 1012, address of doublePtr
\`\`\`
Double pointers show up when you need to modify a pointer itself from inside a function or when working with 2D dynamic arrays implemented as a pointer to pointer.
## Wrapping Up
Pointers are one of those topics where the definition is simple but the implications are everywhere.
- A pointer holds an address, and dereferencing with \`*\` to get the value.
- The operator \`&\` provides the address of a variable.
- Heap memory allocated with \`new\` lives until it is released with \`delete\`.
- Resetting pointers to \`nullptr\` after deletion can help avoid double delete and dangling pointer bugs.
- Pointer arithmetic moves in units of the pointed to type, not bytes, and is only defined within an array plus one past the end.
- References suit cases where null is not allowed and reseating is not needed; pointers suit cases where optionality or explicit indirection is required.
- In modern C++, prefer \`std::vector\` and other containers over raw dynamic arrays for most use cases.`,
  },
  {title: "Multi-Byte XOR Encryption: Why a Longer Key Still Breaks",
  slug: "multi-byte-xor",
  date: "2026-06-12",
  tags: ["Cryptography", "Python"],
  excerpt: "A longer XOR key looks like a fix, with billions of possibilities instead of just 256. But once that multi-byte key repeats, it leaves patterns in the ciphertext that we can attack. In this post I walk through how multi-byte XOR works, how to guess the key length with Hamming distance, and how to recover the key column by column using simple frequency analysis, showing that key length alone does not make this toy cipher secure.",
  readTime: "6 min",
  snippet: `def xor_encrypt(plaintext: bytes, key: bytes) -> bytes:
    return bytes(
        byte ^ key[i % len(key)]
        for i, byte in enumerate(plaintext)
    )

xor_decrypt = xor_encrypt
ciphertext = xor_encrypt(message, b"SECRET")
recovered  = xor_decrypt(ciphertext, b"SECRET")`,
  content: `After breaking single-byte XOR in the last post, my first instinct was, **"What if the key were just longer?"** One byte gives 256 combinations. Four bytes gives 256⁴ ≈ 4.3 billion. That felt like a real improvement, at least against brute force.
It took me a while to understand why that thinking misses the point. The number of possible keys is not what determines security. The structure of the cipher is. And once I saw how repeating a key leaves patterns in the ciphertext, it became clear that multi-byte XOR is still fundamentally broken, just in a less obvious way.
## How it works
Single-byte XOR uses one number as the key for every byte. Multi-byte XOR uses a sequence of numbers instead, and repeats it across the message.
If your key is \`[3, 7, 1]\`, the first byte gets XORed with \`3\`, the second with \`7\`, the third with \`1\`, and then it starts over. The fourth byte gets \`3\` again, the fifth gets \`7\`.
The way the code handles this is just \`i % len(key)\`. Position 0 goes to key byte 0. Position 3 goes to key byte 0 again. Position 4 goes to key byte 1. That one line is the whole repeating mechanism.
Here is what that looks like with a real example, encrypting \`"Hello!"\` with the key \`"KEY"\`. Each character is shown as its ASCII value in hex, so \`H\` is \`0x48\` and \`K\` is \`0x4B\`:
|           | 0 | 1 | 2 | 3 | 4 | 5 |
|-----------|---|---|---|---|---|---|
| Plaintext | H | e | l | l | o | ! |
| Key (repeating) | K | E | Y | K | E | Y |
| Ciphertext | · | $ | 5 | ' | * | x |
Positions 0 and 3 were both XORed with \`K\`. Positions 1 and 4 with \`E\`. Positions 2 and 5 with \`Y\`. That repetition is the problem.
The implementation is almost identical to the single-byte version. The only real change is that the key is now a \`bytes\` object and \`i % len(key)\` handles the cycling:
\`\`\`python
def xor_encrypt(plaintext: bytes, key: bytes) -> bytes:
    return bytes(
        byte ^ key[i % len(key)]
        for i, byte in enumerate(plaintext)
    )
 
xor_decrypt = xor_encrypt
 
key     = b"SECRET"
message = b"Hello, World! This is a longer message."
 
ciphertext = xor_encrypt(message, key)
recovered  = xor_decrypt(ciphertext, key)
 
print(recovered)  # b'Hello, World! This is a longer message.'
\`\`\`
## Guessing the key length
Before breaking the cipher, we need to know how long the key is. One way to figure this out is the Hamming distance test - the Hamming distance between two byte sequences is the count of bit positions where they differ. 
The idea relies on a property of XOR: if two ciphertext bytes were encrypted with the same key byte, XORing them cancels the key out and leaves just the XOR of the original plaintext bytes. Natural language bytes — letters, spaces, punctuation — share a similar structure at the bit level, so XORing any two of them tends to flip only a few bits. Bytes from different key positions do not share a key byte, so the key does not cancel out, leaving a more random result with more bits flipped on average.
By comparing chunks of ciphertext at different guessed key lengths and finding the length with the smallest average distance, we get a good estimate of the real key length without trying a single key.
Here is how it works step by step, using the key \`"CAT"\` (3 bytes) as an example. For each candidate key length, we take two consecutive chunks of ciphertext and measure their Hamming distance. If the guessed key length matches the real key length, the key cancels out when we XOR the chunks:
\`\`\`
ciphertext[0] = plaintext[0] ^ C
ciphertext[3] = plaintext[3] ^ C
ciphertext[0] ^ ciphertext[3] = plaintext[0] ^ plaintext[3]   # C cancels out
\`\`\`
But if we guess the wrong length, say 2, the key bytes at those positions are different and do not cancel:
\`\`\`
ciphertext[0] = plaintext[0] ^ C
ciphertext[2] = plaintext[2] ^ T
ciphertext[0] ^ ciphertext[2] = plaintext[0] ^ plaintext[2] ^ C ^ T   # key stays in
\`\`\`
The leftover \`C ^ T\` makes the result more random, increasing the distance. We average this over multiple chunk pairs and repeat for every candidate key length. The one with the smallest average distance is the most likely real key length.

\`\`\`python
def hamming_distance(a: bytes, b: bytes) -> int:
    return sum(
        bin(x ^ y)   # XOR the two bytes to find differing bits
        .count("1")  # count how many bits are different
        for x, y in zip(a, b)  # pair up corresponding bytes
    )
 
def guess_key_length(ciphertext: bytes, max_len: int = 40) -> int:
    scores = []
    for klen in range(2, max_len + 1):
        a = ciphertext[:klen]        # first chunk of guessed key length
        b = ciphertext[klen:klen*2]  # second chunk right after
        score = hamming_distance(a, b) / klen  # normalize by key length
        scores.append((score, klen))
    return min(scores)[1]  # key length with smallest distance is most likely correct

# example
a = b"Hello"
b = b"World"
print(hamming_distance(a, b))  # 14
 
# this implementation works best with longer keys (4+ bytes) and long, non-repeating plaintext
# shorter keys like 2-3 bytes may not be detected reliably due to statistical noise
message = b"In cryptography, a cipher is an algorithm for performing encryption or decryption. When we encrypt data with a repeating key, the key cycles through the plaintext. This creates a pattern that can be detected using statistical analysis."
ciphertext = xor_encrypt(message, b"SECRET")
print(guess_key_length(ciphertext))  # 6
\`\`\`
One limitation of this approach is that it needs a reasonably long ciphertext to work reliably. The Hamming distance test is a statistical method, meaning the more data it has, the more confident the estimate. It also tends to struggle with short keys (2 to 3 bytes), since multiples of the key length produce similarly low distances, making it hard to identify the true key length.
For short messages or short keys, a simpler approach works better. If the key is short (say 1 to 4 bytes), we can just brute force it — try every possible key and check if the result looks like readable text. A 3-byte key has 256³ = 16 million combinations, which a modern computer can go through in seconds.

## Breaking it column by column
Once the key length is known, the attack reduces to something we already covered. If the key is six bytes long, then positions 0, 6, 12, 18... in the ciphertext were all encrypted with the same byte. Pull those out as a column and it is just single-byte XOR again, breakable with the same frequency analysis from the last post.
\`\`\`python
def break_single_byte(data: bytes) -> int:
    best_score, best_key = -1, 0
    for k in range(256):  # try every possible single-byte key
        decrypted = bytes(b ^ k for b in data)
        score = sum(
            1 for b in decrypted
            if chr(b).lower() in "etaoin shrdlu"  # count common English characters
        )
        if score > best_score:
            best_score, best_key = score, k  # keep the key that produces the most readable text
    return best_key  # most likely key byte
 
def break_repeating_xor(ciphertext: bytes, key_len: int) -> bytes:
    return bytes(
        break_single_byte(ciphertext[i::key_len])  # slice out every nth byte (same key position)
        for i in range(key_len)  # repeat for each key position
    )
\`\`\`
The slice \`ciphertext[i::key_len]\` pulls out exactly the bytes that share a key position. Do this for every column and the full key falls out.
## What this taught me
The thing I kept coming back to was how the attack never needed to try every possible key. It just needed the structure of the cipher to leak information, and a repeating key always does that no matter how long it is.
That is when it started making sense why real encryption does not just use a longer XOR key. AES applies multiple rounds of substitution, permutation, and mixing so that no single output byte has a simple relationship to any single input byte. There is no column to isolate, no pattern to exploit at that level.
Building this made the gap between a toy cipher and a real one feel concrete in a way that reading about it did not.
> 🔗 **Code:** The full implementation is available on [GitHub](https://github.com/n0as-ark/XOR-Encryption-In-Python/blob/main/src/multi_byte_xor.py).`,
  },
  {title: "Study Notes: Introduction to Computer Networking",
  slug: "introduction-to-computer-networking",
  date: "2026-09-01",
  tags: ["Network"],
  excerpt: "Core fundamentals of computer networking: Internet structure, protocols, packet switching, delay, and the OSI/TCP-IP models.",
  readTime: "7 min",
  snippet: "7  Application   HTTP, DNS\n6  Presentation\n5  Session\n4  Transport     TCP, UDP\n3  Network       IPv4, IPv6\n2  Data-Link     Ethernet\n1  Physical      Fiber, Wi-Fi",
  content: `## 1. What the Internet Is
 
The Internet is a worldwide collection of smaller networks that have been linked into one system.
Billions of devices take part in it, and every exchange of data relies on the following key components: 
- **Hosts**: the devices at either end of a conversation, sending or receiving data
- **Applications**: the programs that create or consume the data
- **Protocols**: the agreed rules that make communication understandable
- **Switching and routing**: the mechcanisms that move data from one place to another
- **Links**: the physical/wireless medium that carries the signals

Open standards, including published protocol specifications and documents are called **Request for Comments (RFCs)**, are what let equipment from different vendors working together. A programmer building an app doesn't need to understand cables or routing tables, because the network exposes a simple interface and absorbs the difficult part internally.

## 2. Protocols: The Rules of Communication
 
**Protocol**: a shared agreement on what messages look like, what they mean, and who speaks when.
 
**Human vs. Computer protocols:**
 
| Human Protocol | Computer Protocol |
|---|---|
| "Hi" ↔ "Hi" | DNS Request ↔ DNS Response |
| "Do you know where the nearest gas station is?" ↔ "Yes, it's on Bedford Street!" | DHCP Discover ↔ DHCP Offer |
 
Networks are also grouped by how much ground they cover:
- **PAN (Personal Area Network)**: a few meters around one person
- **LAN (Local Area Network)**: a home, office, or single building
- **MAN (Metropolitan Area Network)**: a city or campus region
- **WAN (Wide Area Network)**: multiple cities or countries
- **GAN (Global Area Network)**: the whole planet

## 3. How the Internet is Built
 
Three conceptual layers:
 
- **Network Edge**: the devices people actually use - personal computers, phones, smart appliances, company machines, and the servers in data centers
- **Access Networks**: home routers, mobile towers, and company networks that connect edge devices to the wider system
- **Core Networks**: the high-capacity backbone operated by large ISPs. It carries traffic between access networks over long distances.
 
**Equipment**
- **Endpoints:** computers, servers, phones,and IoT devices
- **Infrastructure:** wireless access points, routers, switches, and the links between them
 
**Physical media:**
- **Twisted pair**: typically 8 copper wires arranged in twisted pairs, which cancels out much of the electrical interference
- **Coaxial cable**: a copper core surrounded by a braided copper shield that blocks outside noise
- **Fiber optic**: glass strands carrying pulses of light with very few transmission errors
- **Wireless** — Wi-Fi, cellular, Bluetooth, microwave, and satellite signals

## 4. Packet Switching
 
**Packets**
The sender divides a large file or stream into **packets**, and each packet receives a destination address. Many networks restrict pacekt length, with **1500 bytes** being a typical ceiling.
 
**Circuit switching vs. Packet switching:**
|   | Circuit Switching | Pacekt Switching |
|---|--—|---|
| Path | One dedicated route is reserved before data flows | Each packet is routed on its own |
| Order of travel | Everything follows the same route | Packets from one message may take different routes |
| When a link fails | The connection breaks | Traffic is steered around the failure |

 The Internet relies mostly on **packet switching**, mainly because of its resilience.
 
**Store and Forward:** a router cannot start passing a packet along until the entire packet has arrived and been checked. Transmission speed is always capped by the link's bandwidth.
 
**Queueing** 
When packets arrive faster than the outgoing link can send them, the router holds the extras in a buffer, usually in its RAM. A full buffer forces the router to drop new arrivals.
 
**Bandwidth:**
- the maximum rate at which a link can carry data, measured in bits per second (**bps**)
- Time to transmit N bytes over bandwidth R = **N / R**

## 5. How Providers Connect

Rough hierarchy:
 
\`\`\`
End users -> Local/regional ISP -> Upper-tier ISP -> Tier 1 ISP <-> Tier 1 ISP (peering)
\`\`\`

 The Tier 1 providers exchange traffic with each other as equals through **peering agreements**, in which each side agrees to carry the other's traffic.
 A single packet commonly crosses **15+ routers**, along with many switches, and several different ISPs handle it before it arrives. No one organization controls the entire route, so each router simply makes its best effort.

## 6. Delay
 
Each node a packet passes through adds a small wait, called **nodal delay**.
It has 4 components:

\`\`\`
d_node = d_proc + d_queue + d_trans + d_prop
\`\`\`

| Component | What it measures |
|---|---|
| Processing delay | Inspecting the packet for errors and determining the outgoing port |
| Queueing delay | Time waiting in the buffer until the link is free |
| Transmission delay | Time placing all of the packet's bits onto the link |
| Propagation delay | The signal's physical travel time to the next node |

**Total delay** = sum of nodal delay (∑d_node) across all nodes in the path

**Terminology check:**
 
| Term | Meaning |
|------|---------|
| Node | A device/point in the path (router, switch, host) |
| Link | The connection/hop between two nodes |
| Line | The physical medium the link runs over |

## 7. OSI Model
 
The International Organization for Standardization (ISO) developed the **Open Systems Interconnection (OSI)** model in the late 1970s–1980s to classify protocols by responsibility. TCP/IP became dominant due to the Internet's growth, so OSI today is used mainly as a **reference model**.
 
Each layer communicates with the layer directly below it (via OS function calls); it passes information indirectly to its peer layer on the other device.
 
| Layer | Responsibility |
|-------|----------------|
| 7. Application | Shapes data into the form a specific application expects |
| 6. Presentation | Describes data in a format independent of any one system |
| 5. Session | Combines multiple conversations over a single connection |
| 4. Transport | Provides delivery that is either connection-based or connectionless |
| 3. Network | Handles worldwide addressing and route selection |
| 2. Data-Link | Handles local addressing and access to the shared medium |
| 1. Physical | Sends the raw bits over the medium |
 
**TCP/IP mapping:**
 
| Layer | TCP/IP Protocols |
|-------|------------------|
| 7. Application | HTTP, DNS, Skype |
| 6. Presentation | *not implemented* |
| 5. Session | *not implemented* |
| 4. Transport | TCP, UDP |
| 3. Network | IPv4, IPv6 |
| 2. Data-Link | Ethernet and other diverse protocols |
| 1. Physical | Fiber, copper, Wi-Fi, etc. |
 
**Encapsulation**
As a message moves down the stack on the sending machine, every layer **wraps it with its own header** containing instructions for its counterpart on the receiving machine. 

\`\`\`
Application layer:        [        Message         ]
Transport layer:      [  Ht  |      Message         ]
Network layer:     [  Hn  |  Ht  |      Message         ]
Link layer:      [  Hl  |  Hn  |  Ht  |      Message         ]
\`\`\`

Headers are stripped in **reverse order** as data moves up the stack on the receiving machine.
 
---

## Key Points to Remember
 
- Internet = network of interconnected smaller networks; no single entity controls the full path.
- Packet switching (vs. circuit switching) enables resilience and efficient rerouting.
- Bandwidth = bps; transmission time = N/R.
- Nodal delay = processing + queueing + transmission + propagation.
- Propagation delay has a physical floor set by the speed of light.
- OSI = 7-layer reference model; TCP/IP implements 5 of the 7 layers in practice.
- Encapsulation wraps data with headers layer by layer going down the stack, unwraps going up.`,
  },
  {title: "Study Notes: Application Layer - Network App Fundamentals",
slug: "application-layer-network-app-fundamentals",
date: "2026-09-03",
tags: ["Network"],
excerpt: "Client-server vs. P2P architectures, sockets and addressing, what an application-layer protocol defines, and the transport service requirements behind TCP, UDP, and TLS.",
readTime: "10 min read",
snippet: `Identifying a process:
IP address + port number
 
HTTP server  ->  port 80
Mail server  ->  port 25
 
www.example.com : 108.138.85.55 : 80`,
content: `## 1. Where Network Applications Run
 
A network application consists of programs, each living on a different end system. Routers and switches in the middle of the network only forward traffic, and none of them executes application code. 
This division of labor has a practical payoff - a new app only needs to be installed on end systems, with no changes required to the network core.

## 2. Two Architectural Styles

### Client-server
- **Server**: **always-on** host with a permanent IP address, and often sits in data centers for scaling
- **Clients**: machines that contact and communicate with the server, may have a different IP addresse on each connection, and never talk directly to another client
- Examples: HTTP (client: browser; server: web server), IMAP (client: mail app; server: mail server), FTP (client: FTP client; server: FTP server)
 
### Peer-to-peer (P2P)
- No dedicated, always-on server; arbitrary end systems **exchange data with each other directly**
- Peers request service from other peers and provide service in return. This gives **self-scalability**: a newcomer adds demand, but also adds upload bandwidth for others to use
- Tradeoff: keeping track of who holds what is harder than administering a handful of servers
- Example: P2P file sharing (BitTorrent)
 
## 3. Processes and Their Roles

A process is **a program in execution**. Two processes on the same host communicate via inter-process communication; processes on different machines share no memory, so they communicate by exchanging **messages** across the network instead.
- Client process: the one that opens the conversation
- Service (server) process: waits to be contacted
- Note: applications with P2P architectures still have both client and server processes internally - the same peer acts as a client while requesting a chunk of data and as a server while another peer is requesting a chunk from it
 
## 4. What an Application-Layer Protocol Defines

Two processes can only cooperate if they agree on a shared language.
An application-layer protocol specifies:
- **Message types** (e.g., request, response)
- **Message syntax**:what fields a message contains and how those boundaries between fields are marked
- **Message semantics**: what the content of each field means
- **Rules of engagement**: for when and how processes send and respond to messages
 
**Open protocols** are defined in public documents called RFCs. With the specification available to everyone, any company or developer can build software that **interoperates** correctly, which is why any browser can talk to any web server. Examples: HTTP, SMTP.
 
**Proprietary protocols** are owned/controlled by a specific company, and the exact details of their operation are not published in the same open way. Examples: Skype, Zoom.

## 5. Sockets: The Doorway to the Network
 
A process sends and receives messages through its **socket**, which acts like a doorway: the sending process pushes a message through its door and relies on the transport infrastructure beyond the door to carry the message to the socket at the receiving process. Every conversation involves **two sockets**, one on each end. 

Responsibility splits cleanly at that door:
 
- **Application side:** the developer controls message contents, protocol logic, the choice of transport service, and perhaps a few tuning parameters
- **Below the door:** the operating system runs the transport, network, and link layers. Routing and retransmission are never the application's job

The sockets are created and controlled from the application layer, but the heavy lifting behind them happens entirely in the lower layers.

## 6. Addressing a Process

**Addressing processes:** an IP address alone identifies a *host*, not a specific process on that host. One host typically runs many processes at the same time, so another identifier that can identify a process - the **port number**, a 16-bit value from 0 to 65535, does this job. The pair of IP address and port number singles out exactly one process.
 
Example port numbers:
- HTTP server: port 80
- Mail server: port 25
 
To send an HTTP message to \`www.example.org\`: IP address \`203.0.113.10\`, port number \`80\`.

The client side has a port as well. A client's operating system picks a temporary, unused port (an **ephemeral** port) for each new connection. Replies then find the correct socket, and two connections from the same machine never get mixed up.

## 7. Transport Service Requirements
 
What an application needs from the transport layer:
- **Data integrity**: whether the app can tolerate losing data; some apps (file transfer, web transactions) require 100% reliable transfer since a single missing or damaged byte can corrupt the entire file. Other apps (streaming audio) can usually tolerate some loss.
- **Timing**: how much delay the app can tolerate; interactive services like Internet telephony and interactive games becomes unusable when delay grows.
- **Throughput**: how much bandwidth/data rate the app needs to function well; some multimedia services need a minimum data rate to work correctly; "elastic apps" (file downloads, e-mail) simply use whatever rate is available. Throughput is the *actual* rate data is successfully transferred, which is different from bandwidth, the theoretical maximum capacity of a link.
- **Security**: encryption, data integrity guarantees, etc.

## 8. The Two Internet Transport Services
 
**TCP (Transmission Control Protocol) service:**
- **Connection-oriented**: requires a connection setup between client and server before data flows
- **Reliable in-order transport**: guarantees that bytes arrive complete and in sequence
- **Flow control**:  makes sure the sender **doesn't overwhelm the receiver**
- **Congestion control**: the sender backs off automatically whenever the network is overloaded
- Not provided: timing guarantees, minimum throughput, or encryption
 
**UDP (User Datagram Protocol) service:**
- Unreliable, **minimal** transfer between sending and receiving processes
- Not provided: delivery guarantee, reliability, flow control, congestion control, timing, throughput guarantees, encryption, or connection setup
Nearly everything TCP does is stripped away in exchange for low overhead and speed. Applications that need some of TCP's features on top of UDP must build them on their own, which is exactly the route QUIC takes (covered in the HTTP post).
 
Plain TCP and UDP sockets deliver bytes exactly as written. A password sent into the socket therefore traverse the Internet in readable form. 
**Transport Layer Security (TLS)** closes that gap by providing encrypted connections, integrity checking, and end-point authentication. Despite the name, TLS is **implemented at the application layer**. A program writes plaintext into a TLS library, the library encrypts it, and the ciphertext goes into an ordinary TCP socket. From the network's perspective, only scrambled bytes ever travel.
 
---
 
## Key Points to Remember
 
- Network applications run entirely on end systems; the core just moves bits — this is what makes rapid, permissionless app development possible.
- Client-server: always-on server, intermittently-connected clients. P2P: no always-on server, peers serve each other, self-scaling but harder to manage.
- A socket is the interface an application uses to hand data to (and receive data from) the transport layer.
- A host needs both an IP address and a port number to fully identify a specific process.
- Open protocols (RFC-defined) enable interoperability; proprietary protocols don't.
- TCP trades speed for reliability, flow control, and congestion control; UDP is minimal and fast but guarantees nothing.
- TLS adds encryption, integrity, and authentication on top of TCP at the application layer.`,
  },
  {title: "Study Notes: Application Layer - HTTP",
slug: "application-layer-http",
date: "2026-09-04",
tags: ["Network"],
excerpt: "HTTP request/response mechanics, persistent vs. non-persistent connections, cookies, how HTTP/3 (QUIC)replaces TCP+TLS with a single faster handshake.",
readTime: "9 min read",
snippet: `HTTP/2 over TCP                   HTTP/3 (QUIC)
----------------                    ----------------
+--------+---------+                +-----------+--------+
| HTTP/2 |   TLS   |   Application  | H2 (slim) |  QUIC  |
+--------+---------+                +-----------+--------+
|        TCP       |    Transport   |         UDP        |
+------------------+                +--------------------+
|        IP        |    Network     |         IP         |
+------------------+                +--------------------+`,
content: `## 1. Anatomy of a Web Page
 
A web page consists of objects (an HTML file, JPEG images, a Java applet, audio files, etc.), which can be stored across different web servers. 
Each object is reachable through a **URL** (Uniform Resource Locator), which combines a host name with a path:
\`\`\`
http://www.example.org/gallery/cat.jpg
       └─────┬───────┘└──────┬───────┘
          host name        path name
\`\`\`

## 2. Clients, Servers, and TCP
 
**HTTP (HyperText Transfer Protocol)** is the Web's application-layer protocol that governs how browsers and web servers converse, and it follows the **client-server model**. The client (browser) requests, receives, and displays web objects using HTTP while the server (web server software, e.g. Apache) sends objects in response to those requests.
 
HTTP rides on top of TCP, so evrey exchange begins with **a connection**: 
1. The client **initiates a TCP connection**, which creates a socket, to the server on **port 80**. Encrypted HTTPS uses port 443 instead.
2. The **server accepts** the connection.
3. Request and response messages travel back and forth.
4. The **connection is closed** afterward.
 
**HTTP is stateless**: the server keeps no memory of past client requests. This keeps the protocol simple: 
- There's no need to track state across a multi-step exchange
- Every request is **independent**, and there's no need to recover from a transaction that partially completed but never finished
- Tradeoff: any protocol that *does* maintain state is inherently more complex. History has to be tracked, and if the client or server crashes, their two views of that state may become inconsistent and need to be reconciled.

## 3. Request Messages

HTTP request messages are **plain ASCII** (human-readable format), for example:
 
\`\`\`
GET /gallery/index.html HTTP/1.1
Host: www.example.org
User-Agent: ExampleBrowser/12.0
Accept: text/html
Accept-Language: en-ca
Connection: keep-alive
\`\`\`
 
The general layout has three zones, with a carriage return and line feed (CRLF) ending every line:
\`\`\`
┌────────────────────────────────────────────┐
│  method   SP   URL   SP   version   CRLF   │  ← request line
├────────────────────────────────────────────┤
│  header-name : value                CRLF   │  ⎫
│  header-name : value                CRLF   │  ⎬ header lines
│  ...                                       │  ⎪
│  header-name : value                CRLF   │  ⎭
├────────────────────────────────────────────┤
│  CRLF                                      │  ← blank line (end of headers)
├────────────────────────────────────────────┤
│  entity body (optional)                    │
└────────────────────────────────────────────┘
\`\`\`

**HTTP methods:**
- **GET**: the most common method; small amounts of data can ride along inside the URL after a \`?\` (e.g. \`www.somesite.com/search?q=lighthouse&sort=new\`).
- **POST**: The user's input travels in the entity body instead of the URL, so it stays out of browser history and server logs that record URLs.
- **HEAD**: requests only the headers that would be returned for a GET on that URL, with no body attached. It is a cheap way to inspect a file's size or modification date without downloading the file.
- **PUT**: uploads a new object to the server, completely replacing whatever file already exists at that URL, with the new content carried in the entity body.

## 4. Response Messages and Status Codes

A response mirrors the structure of a request: a status line, header lines, a blank line, and then the body.
 
\`\`\`
HTTP/1.1 200 OK
Date: Tue, 06 Oct 2026 14:02:11 GMT
Server: ExampleServer/2.4
Content-Type: text/html; charset=utf-8
Content-Length: 1456
 
<!doctype html>
<html> ... </html>
\`\`\`
 
The three-digit **status code** on the first line summarizes the outcome. The leading digit identifies the family: 2xx for success, 3xx for redirection, 4xx for a problem on the client's side, and 5xx for a problem on the server's side. Common codes:
- **200 OK**: the request succeeded, and the requested object follows in the message
- **301 Moved Permanently**: the requested object now lives elsewhere, and the new address is given later in the message (\`Location:\` field)
- **400 Bad Request**: the server couln't understand the request
- **404 Not Found**: the requested document wasn't found on this server
- **505 HTTP Version Not Supported**: the server does not speak the protocol version the client used

## 5. Non-persistent vs. persistent HTTP

**RTT (Round-Trip Time)** measures how long a small packet takes to reach the server and return.

**Non-persistent HTTP** response time per object breaks down into: 
- **one RTT** to initiate the TCP connection
- **one RTT** for the HTTP request
- the first few bytes of the response to come back
- the actual object/file transmission time
Each object costs **two round trips** plus the object's own transmission time. Operating-system resources are also consumed for every connection opened. Browsers compensate by opening several connections in parallel, which hides some of the delay but adds even more overhead.

**Persistent HTTP** *leaves the connection open* after the response. Later requests between the same pair of hosts reuse it, so the setup cost is paid **once**, cutting response time roughly in half.

| | Non-persistent HTTP | Persistent HTTP (HTTP/1.1) |
|---|---|---|
| Connection | Opened, at most one object sent, then closed | Opened once; stays open |
| Objects per connection | One | Multiple objects over the same connection |
| Result | Downloading multiple objects requires multiple connections | Client sends new requests as soon as it encounters a new referenced object |

## 6. Statelessness and Cookies

A web server running plain HTTP remembers nothing about earlier requests, because the protocol is **stateless**. Every request stands alone; no multi-step exchange has to be tracked, and nothing has to be repaired if a transaction is abandoned halfway. Protocols that do keep state are more complicated, because history has to be stored and because a crash on either side can leave the two parties with conflicting views that must be reconciled.

The drawback is obvious for services that need continuity across many requests.  **Cookies** supply it by carrying a small piece of state inside the messages themselves:
- a \`Set-Cookie\` header line in the HTTP response
- a \`Cookie\` header line in subsequent HTTP requests
- a small cookie file that the browser stores on the visitor's computer
- a database on the website's back end
On a user's first visit, the site creates **a unique ID (the cookie)** and a matching entry in its backend database; every later request from that user to the same site carries the cookie value in its header, letting the site "recognize" the user.
 
Cookies are used for authorization, shopping carts, recommendations, and maintaining session state (e.g., webmail). The underlying challenge cookies solve is keeping state at the protocol endpoints across multiple transactions, using the messages themselves as the carrier.
 
A related privacy note: **third-party (tracking) cookies** set by a domain the user did not directly choose to visit, such as an ad network embedded in a page, let that third party recognize the same browser across many unrelated sites, effectively tracking browsing behavior and enabling targeted ads based on that history. A **first-party cookie**, by contrast, comes from the site the user actually navigated to.

## 7. From HTTP/2 to HTTP/3 (QUIC)

**What HTTP/2 improves**
- Many requests and responses share one TCP connection, each tagged with a stream ID so the pieces can be told apart (**multiplexing**).
- Objects no longer queue one behind another, as they did in HTTP/1.1.
 
**What is still wrong**
- Every stream depends on a single TCP connection, which delivers bytes strictly in order.
- One lost packet freezes all streams until the retransmission arrives. Data from other streams that already got through sits in a buffer, undelivered. This effect is called **stalling** (or head-of-line blocking).
- Browsers keep opening several parallel connections to limit the damage, the same workaround used under HTTP/1.1.
- HTTP/2 has no encryption of its own. Security comes from running TLS over plain TCP.

**HTTP/3: the fix**
- HTTP/3 runs on **QUIC** (Quick UDP Internet Connections), a protocol built into applications and carried over UDP.
- QUIC supplies reliability, congestion control, authentication, and encryption itself, handled separately for each stream.
- A lost packet delays only its own stream, and the others keep flowing.
- Google uses it widely, for example in Chrome and the mobile YouTube app.

\`\`\`
  HTTP/2 over TCP                       HTTP/3 (QUIC)
 ----------------                     ----------------
+--------+--------+                +-----------+--------+
| HTTP/2 |  TLS   |   Application  | H2 (slim) |  QUIC  |
+--------+--------+                +-----------+--------+
|       TCP       |    Transport   |          UDP       |
+-----------------+                +--------------------+
|        IP       |    Network     |          IP        |
+-----------------+                +--------------------+
 
TLS + TCP  -->  merged into QUIC, which now sits on UDP instead of TCP
\`\`\`

**Faster connection setup**
- TCP with TLS needs two handshakes in sequence, one for transport and one for security, before any data moves.
- QUIC combines them into a single handshake, so data can flow after one round trip (**1-RTT**).
- On a repeat visit, the client reuses a stored session ticket from the earlier connection. Encryption and authentication are already settled, so the first packet can carry data (**0-RTT**).

\`\`\`
  TCP + TLS handshake                        QUIC handshake
  --------------------                     --------------------
Client            Server                 Client            Server
  |                  |                     |                  |
  |------ SYN ------>|                     |---- Initial ---->|
  |                  |                     |                  |
  |<---- SYN-ACK ----|      RTT 1          |<- Handshake done -|      RTT 1
  |                  |                     |                  |
  |-- ClientHello -->|                     |----- Data ------>|
  |                  |
  |<- ServerHello, --|      RTT 2
  |    Finished -----|
  |                  |
  |----- Data ------>|
 
Total: 2 RTTs before data                Total: 1 RTT before data
\`\`\`
 
**Quick comparison**
 
| | HTTP/2 | HTTP/3 |
|---|---|---|
| Transport | TCP | UDP (through QUIC) |
| Effect of one lost packet | Stalls all streams | Stalls one stream |
| Setup before data | 2 handshakes (TCP, then TLS) | 1 round trip (0 on a repeat visit) |
| Encryption | Added separately with TLS | Built into QUIC |
 
---

## Key Points to Remember
 
- HTTP is stateless by design; cookies are the mechanism sites use to layer state back on top of it.
- Persistent HTTP (HTTP/1.1) cuts connection overhead versus non-persistent HTTP by reusing one TCP connection for multiple objects.
- HTTP/3 (QUIC, over UDP) removes head-of-line blocking across streams and shortens the handshake to 1-RTT (or 0-RTT on reconnect).
`},
  {title: "Study Notes: Application Layer - E-Mail (SMTP and IMAP)",
slug: "application-layer-email-smtp-imap",
date: "2026-09-05",
tags: ["Network"],
excerpt: "How SMTP pushes mail between servers, why it has no built-in authentication, and how IMAP is what actually lets a device retrieve mail afterward.",
readTime: "5 min",
snippet: `S: 220 burgerplace.com
C: HELO crepes.fr
S: 250  Hello crepes.fr, pleased to meet you
C: MAIL FROM: <alice@crepes.fr>
S: 250 alice@crepes.fr... Sender ok
C: RCPT TO: <bob@burgerplace.com>
S: 250 bob@burgerplace.com ... Recipient ok`,
content: `## 1. The Moving Parts of E-Mail
 
E-mail has three major components working together:
- **User agents**: the programs people use to write, edit, and read messages (e.g., Outlook, Gmail, an iPhone mail client); outgoing and incoming messages are stored on the server, not just on the device.
- **Mail servers**: hold a **mailbox** for each user, where incoming messages accumulate, and an outgoing **queue** for outbound mail waits for its turn.
- **SMTP (Simple Mail Transfer Protocol)**: the protocol mail servers use to send messages to one another.

**Scenario — Noa sends an e-mail to Danny:**
1. Noa composes a message in her user agent, addressed to \`danny@example.com\`.
2. Noa's user agent passes the message to her own mail server using SMTP; it's placed in the outgoing message queue.
3. Noa's mail server, acting as SMTP client, opens a TCP connection to Danny's server.
4. The SMTP client sends Noa's message over that connection.
5. Danny's mail server places the message into his mailbox.
6. Danny opens his user agent later and reads the message.
\n

The transfer in step 4 is **direct**: the sending server connects straight to the receiving server, with no intermediate relay in the standard picture. The sending server plays the SMTP *client*, and the receiving server plays the SMTP *server*

## 2. How SMTP Works

**SMTP (specified in RFC 5321)** uses TCP to reliably transfer a message from a client (the mail server initiating the connection) to a server, on **port 25**. 
There are three phases: 
- **Handshaking**: a greeting in which the two servers introduce themselves
- **Transfer**: one or more messages are delivered
- **Closure**: the session ends
Like HTTP, it's a command/response interaction. Commands are sent as ASCII text, and each respons carries a three-digit status code followed by a text a phrase. Notably, there is **no authentication** between servers.

**Sample SMTP interaction:**
\`\`\`
S: 220 burgerplace.com
C: HELO crepes.fr
S: 250  Hello crepes.fr, pleased to meet you
C: MAIL FROM: <noa@crepes.fr>
S: 250 noa@crepes.fr... Sender ok
C: RCPT TO: <danny@burgerplace.com>
S: 250 danny@burgerplace.com ... Recipient ok
C: DATA
S: 354 Enter mail, end with "." on a line by itself
C: Do you like ketchup?
C: How about pickles?
C: .
S: 250 Message accepted for delivery
C: QUIT
S: 221 burgerplace.com closing connection
\`\`\`
\n

What each step accomplishes:
- \`HELO\` identifies the connecting server.
- \`MAIL FROM\` names the sender, and \`RCPT TO\` names a recipient.
- \`DATA\` announces that the message content follows. A line consisting solely of a period marks its end.
- \`QUIT\` closes the session.

## 3. The Message Itself: Content versus Envelope

- RFC 5321 describes the SMTP **protocol** that servers use to exchange mail
- RFC 5322 (the successor to the older RFC 2822) describes the **format of the e-mail message**, much as HTML defines syntax for web documents)

Every message has a **header** block (with lines such as \`To:\`, \`From:\`, \`Subject:\`), then an empty line, then the **body** (the actual message, ASCII characters only). 
These header lines live *inside* the body of what SMTP transmits, so they are different from the SMTP-level \`MAIL FROM:\` / \`RCPT TO:\` commands used during the handshake.

## 4. Reading Mail: Access Protocols

SMTP stops once a message is stored on the *recipient's* mail server. Pulling messages down to a phone or laptop is a different job, handled by a **mail access protocol**:
- **IMAP (Internet Mail Access Protocol, RFC 3501)**: messages stay on the server, while the user agent handles retrieval, deletion, and folder management for messages.
- **HTTP-based webmail** (Gmail, Hotmail, and Yahoo!Mail): shows mail through a web page. Behind the page, SMTP handles sending, and IMAP or POP handles retrieval.

## 5. SMTP Compared with HTTP

| Aspect | HTTP | SMTP |
|---|---|---|
| Direction of data flow | Client **pulls** objects from a server | Client **pushes** a message to a server |
| Interaction style | ASCII commands, replies with status codes | ASCII commands, replies with status codes |
| Several objects | Each object travels in its own response | Everything travels together in one multipart message |
| Connections | Persistent or non-persistent | Persistent |
| Content format | Any data | Header and body restricted to 7-bit ASCII |
| End of message | Length or connection signals | A line with only a period (\`CRLF.CRLF\`) |

**Problems with SMTP:**
- Communication happens between servers; client-to-server communication is left undefined by the protocol itself.
- There's **no authentication** between servers.
- A single \`MAIL FROM\` can be paired with multiple \`RCPT TO\` commands.
- The **envelope** (the SMTP-level sender/recipient info) differs from the message's own header content — this is how BCC works, since a BCC'd recipient is in the envelope but not shown in any header seen by other recipients.
- The end of the \`DATA\` section is marked by a line containing only a period — which raises the question of what happens if a user's actual message needs to contain a line that's just a period.
- SMTP was designed to carry ASCII text, not binary data, so non-text content like photos and videos has to be encoded into text and wrapped using MIME, which specifies the data type being carried.
 
---

## Key Points to Remember
 
- SMTP pushes mail server-to-server; this is the opposite of HTTP's client-pull model.
- There's no authentication built into SMTP's server-to-server handshake.
- A separate access protocol (IMAP, or HTTP-based webmail) is needed to actually retrieve mail down to a device — SMTP only handles delivery to the receiver's server.
`},
  {title: "Study Notes: Application Layer - DNS",
slug: "application-layer-dns",
date: "2026-09-07",
tags: ["Network"],
excerpt: "The DNS hierarchy, iterated versus recursive lookups, caching, and resource records",
readTime: "8 min",
snippet: `
             Root name servers
          /          |         \\
  .com servers  .org servers  .net servers
    /    \\            \\          \\
shp.com  exam.com  study.org    example.net`,
content: `## 1. Why Names Need Translating
 
Hosts and routers on the Internet carry two kinds of identifiers. An **IP address** (32 bits in IPv4) is what the network actually uses to deliver datagrams. A **hostname** such as \`www.example.org\` is what people can remember and type. A service must convert one into the other, in either direction, at enormous volume. That something is the **Domain Name System (DNS)**.
 
DNS is really two things at once:
- A **distributed database** layered across numerous name servers
- An **application-layer protocol** that hosts and name servers use to ask questions and return answers
 
Name resolution is a core Internet function, yet it is implemented as an ordinary application-layer protocol. The complexity lives at the network's edge, and the core stays simple.
  
## 2. What DNS Provides
 
- **Hostname-to-address translation**, the headline service
- **Host aliasing:** one machine can answer to several names. Every alias simply points back to the single **canonical** name
- **Mail server aliasing:** a domain's mail can be handled by a differently named host
- **Load distribution:** a busy site with replicated servers can map one name to many IP addresses, rotating through them so that traffic spreads out

## 3. Why One Central Server Cannot Work

- **Single point of failure:** if that server went down, name resolution for the entire Internet would stop
- **Traffic volume:** one machine would have to absorb every query on the planet
- **Distance:** users far from the server would suffer long delays on every lookup
- **Maintenance:** one database would need constant updates from every organization in the world

## 4. A Hierarchy of Servers
 
The answer is a tree of servers, each responsible for one slice of the namespace:
 
\`\`\`
                   Root name servers
              /            |            \\
      .com servers    .org servers   .net servers      <- TLD servers
        /     \\            |            /      \\
  shop.com  ebooks.com  study.org  example.net  exam.net    <- authoritative servers
\`\`\`

### Root name servers
- When a server is stumped by a name, the root gets the question
- There are 13 logical root server identities, each replicated in hundreds of locations around the world.
- **Internet Corporation for Assigned Names and Numbers (ICANN)** administers the root servers.

### Top-level domain (TLD) servers
- Handle \`.com\`, \`.org\`, \`.net\`, \`.edu\`, and the rest, along with every country-code domain such as \`.ca\`, \`.fr\`, or \`.jp\`. 
- Specialized registries operate them. 
- Network Solutions maintains the official registry behind \`.com\` and \`.net\`, while Educause handles \`.edu\`.

### Authoritative servers
- Belong to an organization (or to a hosting provider acting on its behalf).
- Store the official name-to-address records for the machines the organization names.

### Local DNS servers
- A helper layer rather than part of the tree. 
- A host's queries always go to its local server first, which is usually operated by the ISP. 
- On macOS, \`scutil --dns\` reveals which resolver is configured; on Windows, \`ipconfig /all\` does the same.

## 5. Resolving a Name Step by Step
 
Suppose a browser needs the address of \`www.harborbooks.com\`. A simplified version of the lookup:
 
1. The host asks its local DNS server.
2. On a cache miss, the local server asks a root server, which points to the \`.com\` TLD servers.
3. A \`.com\` TLD server points to the authoritative server for \`harborbooks.com\`.
4. That authoritative server returns the IP address of \`www.harborbooks.com\`.
5. The local server hands the answer to the host and remembers it.
 
**Iterated query:** a contacted server either answers or hands back a referral to the *next* server to try. The local server follows every referral on its own, stepping from server to server.
 
**Recursive query:** the server that receives it takes over completely, chasing the name down and returning only the final result. Work shifts onto that server, so heavy use near the top of the tree risks overloading it.
 
**Caching** is what keeps the system fast. Local servers keep recent answers, each valid for a time limit (the *ttl* field of a record). Cached TLD server addresses let them skip the root for most lookups. The tradeoff is that a cached answer can be out of date until its time limit expires.

## 6. Resource Records
 
Every record is a four-field tuple: \`(name, value, type, ttl)\`. The type determines how the first two fields are read:
 
| Type | Meaning of \`name\` | Meaning of \`value\` |
|---|---|---|
| **A** | A hostname | Its IP address |
| **CNAME** | An alias | The canonical (real) name, for example \`www.example.org\` really being \`webfarm-east.hosting.example\` |
| **MX** | A domain | The mail server that accepts e-mail for the domain (Mail Exchanger) |
| **NS** | A domain, such as \`lanternworks.example\` | The hostname of a server with the final word on that domain |
 
A fictional startup, Lantern Works, registers \`lanternworks.example\` through a DNS registrar. The company supplies the hostnames and IP addresses of its two authoritative servers, a primary and a backup. The registrar then inserts two records into the TLD server for the parent zone:
 
\`\`\`
(lanternworks.example, ns1.lanternworks.example, NS)
(ns1.lanternworks.example, 198.51.100.7, A)
\`\`\`
 
Next, the company runs its own authoritative server at \`198.51.100.7\` and fills it with records for its services: an A record for \`www.lanternworks.example\`, and an MX record for \`lanternworks.example\` that directs incoming e-mail to the right mail host.
 
## 8. Attacks on DNS and Defenses
 
### DDoS against root servers
- **Flooding the roots with traffic** so that legitimate queries cannot get through
- Traffic filtering helps, and local servers cache TLD addresses, so most lookups bypass the roots anyway
- Flooding TLD servers is potentially more dangerous

### Spoofing
- **Intercepting a query** and returning a forged reply, or poisoning a resolver's cache with bogus records
- **DNSSEC** (RFC 4033) counters this by adding authentication and message integrity to DNS data

---
 
## Key Points to Remember
 
- DNS answers lookups using a tree of servers (root, then TLD, then authoritative) plus aggressive caching.
- A central design could not handle the query volume, the distances involved, or the reliability requirements.
- Local servers sit in front of the hierarchy and answer from cache whenever they can.
- Iterated queries return a referral to the next server, while recursive queries make the contacted server finish the job.
- Resource records (A, CNAME, MX, NS) carry the actual data.
- DNSSEC defends against forged answers by adding authentication.
`},
  {title: "Study Notes: Transport Layer - Multiplexing, UDP, and Reliable Data Transfer",
slug: "transport-layer-multiplexing-udp-rdt",
date: "2026-09-09",
tags: ["Network"],
excerpt: "Multiplexing and demultiplexing, UDP's no-frills header and checksum, and the rdt1.0-3.0 progression through Go-Back-N and Selective Repeat pipelining.",
readTime: "11 min",
snippet: `Go-Back-N: Sender
[A][A][S][S][S][S][U][U][ ]
      ^send_base  ^nextseqnum
 
Go-Back-N: Receiver
[A][A][ ][X][X][X][ ][ ][ ]
      ^rcv_base
 
A=ACKed S=sent U=usable X=out-of-order`,
content: `## 1. Transport Services and Protocols
 
- Provides **logical communication** between application processes on different hosts; end-to-end from the application's point of view, even though data physically passes through every router in between.
- **Sender**: **breaks** application messages **into segments**, passes them to the network layer.
- **Receiver**: **reassembles** segments **into messages**, passes them up to the application layer.
- Two transport protocols available to Internet applications: **TCP** and **UDP**.
- Sender-side steps: message arrives from application → header fields determined (ports, etc.) → segment created → handed to IP.
- Receiver-side steps: segment arrives from IP → header checked → application message extracted → demultiplexed up to the correct socket.
 
---

## 2. Multiplexing and Demultiplexing
 
- **Demultiplexing** — sorting incoming data to the correct process/socket on the receiving side.
- **Multiplexing** — combining multiple sessions/streams from different sockets onto one connection on the sending side.
- Every IP datagram carries source/destination IP addresses; every segment inside carries source/destination port numbers. Both together route a segment to the correct socket.

\`\`\`
                32 bits
+------------------+------------------+
|  source port #   |    dest port #   |
+------------------+------------------+
|         other header fields         |
+-------------------------------------+
|                                     |
|      application data (payload)     |
|                                     |
+-------------------------------------+
         TCP/UDP segment format
\`\`\`

**Connectionless demultiplexing (UDP):**
- Socket identified by just the local (IP, port) pair — \`socket(AF_INET, SOCK_DGRAM)\`, then \`.bind(myaddr, port)\`.
- Sending requires specifying a destination IP and port.
- **Destination IP + destination port** is the *only* thing that decides which socket gets a segment — different source IPs/ports with the same destination still land in the same socket.
 
**Connection-oriented demultiplexing (TCP):**
- Socket identified by a full **4-tuple**: **source IP, source port, dest IP, dest port**.
- One listening port can serve many simultaneous sockets, each tied to a different client via its own 4-tuple.
- Example: three segments all addressed to the same server IP/port can still demux to three different sockets, since the full 4-tuples differ.

\`SOCK_DGRAM\` = UDP, \`SOCK_STREAM\` = TCP. Binding = assigning a socket its local (IP, port)

---

## 3. Connectionless Transport: UDP
 
- RFC 768 (1980) — "no frills," **best-effort service**, **no delivery guarantee**.
- Segments may be lost or delivered out of order.
- **Connectionless**: no handshaking, each segment handled independently.
 
**Why UDP exists:**
- No connection setup → **no extra RTT delay** before data flows.
- Simple — no connection state at sender or receiver. (**Connection state** = sequence/ACK numbers, unACKed data, the advertised receive window, buffered out-of-order segments, and active timers that both sides track for the life of a connection — TCP keeps this; UDP skips it entirely.)
- Small header → less overhead.
- No congestion control — sends as **fast** as the app wants, keeps working under congestion.
 
**Typical uses:** streaming multimedia (loss-tolerant, rate-sensitive), DNS, SNMP, HTTP/3. Reliability/congestion control for these gets added at the **application layer**, not the transport layer.
 
**UDP header fields:**
 
\`\`\`
                32 bits
+------------------+------------------+
|  source port #   |    dest port #   |
+------------------+------------------+
|      length      |     checksum     |
+-------------------------------------+
|                                     |
|      application data (payload)     |
|                                     |
+-------------------------------------+
            UDP segment format
 
length   = bytes in the segment, including header
checksum = detects bit errors
\`\`\`
 
**Internet checksum:**
- Sender treats the segment (header + IP addresses) as a sequence of 16-bit integers, adds them (one's-complement sum), stores the result in the checksum field.
- Receiver repeats the addition and compares to the checksum field.
- Mismatch → error detected, segment discarded. Match → probably fine, but not a guarantee (some error patterns can cancel out).
 
---

## 4. Principles of Reliable Data Transfer (RDT)
 
- Applications hand data to a "reliable channel" abstraction; the real channel (built on IP) offers no delivery, ordering, or duplication guarantee.
- Protocol complexity depends on how the channel misbehaves — loses data, corrupts data, reorders it?
- Sender and receiver don't know each other's state directly — has to be communicated via messages.
 
\`\`\`
| Version | Channel assumption | What it adds | Key detail |
|---|---|---|---|
| rdt1.0 | Perfect channel: no errors, no loss | Nothing; sender sends, receiver reads | Baseline only; fails silently on a real channel |
| rdt2.0 | Bits can be corrupted | Checksum; ACK ("got it OK") / NAK ("had errors, resend"); stop-and-wait (send one packet, wait for the response before the next) | Fatal flaw: a corrupted ACK/NAK leaves the sender unsure, and blind resends risk duplicates |
| rdt2.1 | Same, but ACKs/NAKs can be corrupted too | Sequence numbers (0/1, alternating; enough since only one packet is in flight) | Garbled reply → resend; receiver discards duplicates by seq number; doubles the states each side tracks; receiver never knows if its last ACK/NAK arrived, but seq numbers make that harmless |
| rdt2.2 | Same as 2.1 | NAK-free: ACKs only | Receiver re-ACKs the last good packet's seq number; a duplicate ACK triggers a resend, like a NAK (TCP's approach) |
| rdt3.0 | Packets (data or ACKs) can be corrupted **or lost** | Countdown timer; resend if no ACK within a "reasonable" time | Delayed-not-lost packets still work, since seq numbers catch duplicates. Scenarios: no loss; data lost (timeout + resend); ACK lost (redundant resend, no double delivery); premature timeout (duplicate ACK ignored) |
\`\`\`
 
**Performance (stop-and-wait):**
- Transmission time = Packet Size (in bits) / Link Bandwidth (in bps)
- Utilization time = fraction of time the sender is actually transmitting = (L/R) / (RTT + L/R)
- Link sits idle almost the whole time — the protocol itself is the bottleneck.
 
**Pipelining:**
- Allows **multiple in-flight, unACKed packets at once** instead of stopping after each one.
- Needs a larger sequence-number range and buffering at sender/receiver.
- 3-packet pipelining triples utilization (~0.00081 in the example above) — better, but still far from saturating the link.
 
**Go-Back-N (GBN):**
- can have up to **N unacknowledged packets in flight at once**; N is the window size.
- ACKs are **cumulative**: ACK(n) covers everything up through n; window slides to n+1 on receipt of ACK(n).
- One timer for the oldest in-flight packet; on timeout, resend packet n *and everything after it* in the window.
- Receiver: ACKs the highest in-order sequence number so far (duplicates possible); out-of-order packets are either discarded or buffered, but never delivered to the application out of order.
- Example (N=4): losing packet 2 causes repeated ACK-1 responses as 3/4/5 arrive and get discarded; timeout on packet 2 resends 2 through 5, even though 3–5 already arrived once.
 
**Selective Repeat (SR):**
- Also a pipelined protocol with a window of N packets, but it fixes Go-Back-N's weakness.
- Sender resends only the packets that were **actually lost**.
- Receiver **individually ACKs** every correctly received packet and **buffers out-of-order ones** for in-order delivery later.
- Each packet gets its own timer, unlike GBN with a single timer; timeout resends only that one packet.
- Sender logic: send if next seq # is in window; on timeout(n), resend only n; on ACK(n) in window, mark received, slide window base forward if n was the smallest unACKed.
- Receiver logic: packet in [rcvbase, rcvbase+N-1] → ACK it, buffer if out of order or deliver (plus any buffered ones) if it fills the gap; packet in [rcvbase-N, rcvbase-1] → re-ACK (covers a possibly-lost prior ACK); anything else → ignore.
- Example (N=4): losing packet 2 causes 3/4/5 to get buffered individually (ack3, ack4, ack5); once 2 finally arrives, 2 through 5 all deliver at once.
- Tradeoff vs. GBN: SR needs receiver buffering for up to N packets but avoids re-sending packets that already arrived.
- Cumulative ACKs are more resilient to ACK loss in general — one ACK implicitly confirms everything up to that point.
 
---
## Key Points to Remember
 
- Ports identify processes; sockets are the live (IP, port)-bound objects processes read/write through.
- UDP demultiplexes on destination (IP, port); TCP demultiplexes on the full 4-tuple.
- UDP trades reliability for speed/simplicity — no handshake, no state, no congestion control.
- RDT builds up piece by piece: **checksums catch corruption, sequence numbers catch duplicates, ACKs/NAKs report status, timeouts catch loss**.
- Stop-and-wait wastes bandwidth; **pipelining (GBN or SR) keeps multiple packets in flight to improve utilization**.
- GBN: cumulative ACKs, simple receiver, **resends everything after a loss**.
- SR: individual ACKs + buffering, **resends only what's lost**.
`},
  {title: "Study Notes: Transport Layer - TCP and QUIC",
slug: "transport-layer-tcp-quic",
date: "2026-09-14",
tags: ["Network"],
excerpt: "TCP segment structure, sequence/ACK numbers, RTT and retransmission, flow control, the three-way handshake and connection close, plus a QUIC comparison.",
readTime: "8 min",
snippet: `
TCP + TLS handshake            QUIC handshake
--------------------        --------------------
 Client      Server          Client      Server
  |              |             |            |
  |---- SYN ---->|             |- Initial ->|
  |<-- SYNACK ---|  RTT 1      |<-- done ---|  RTT 1
  |-ClientHello->|             |--- Data -->|
  |<-ServerHello-|  RTT 2
  |---- Data --->|`,
content: `## 1. Connection-Oriented Transport: TCP
 
TCP's behavior is defined across RFCs 793, 1122, 2018, 5681, and 7323. 
Core characteristics:
- **Point-to-point**: one sender, one receiver
- **Reliable, in-order byte stream** — no "message boundaries"
- **Full duplex**: data flows both ways over one connection; Maximum Segment Size (MSS) caps segment size
- **Pipelined**: doesn't wait for an ACK before sending the next chunk of data; congestion/flow control set the sender's window size
- **Cumulative ACKs**
- **Connection-oriented**: handshake before data, explicit termination after
- **Flow controlled** — sender can't overwhelm the receiver
 
**Segment structure:**
 
| Field | Purpose |
|---|---|
| Source/dest port # | Socket identification |
| Sequence number | Counts *bytes* into the stream, not segments |
| Acknowledgement number | Next expected byte; ACK bit marks a valid ACK |
| Header length | Length of the TCP header |
| C, E bits | Congestion notification |
| RST, SYN, FIN bits | Connection management (restart / start / finish) |
| Receive window (rwnd) | Flow control — bytes receiver can accept |
| Checksum | Internet checksum |
| Options | Variable-length options |
| Application data | Payload |

**Sequence numbers and ACKs:**
- **Sequence number** = byte-stream number of the **first byte in a segment** (e.g., seq 0 + 100 bytes → next segment starts at seq 100)
- **ACK number** = **next expected byte**, cumulative
- Out-of-order handling is left to the implementor by spec
- Telnet example: Host A sends 'C' at seq # 42, ACK # 79; Host B echoes 'C' at seq # 79, ACK # 43; Host A ACKs at seq # 43 \`(= seq # 42 + 1 byte for 'C')\`, ACK # 80
- Each direction gets its own **random initial sequence number**; numbering never crosses between directions
 
**RTT and timeout:**
- Timeout must exceed RTT, but RTT varies. 
  - Too short → premature timeouts (timer expiring before the ACK arrives, even though nothing was actually lost)
  - Too long → slow reaction to real loss
- **SampleRTT** = time from segment sent to its ACK received (retransmissions excluded)
- **EstimatedRTT** smooths SampleRTT by **averaging recent measurements** rather than reacting to one sample
 
**TCP sender (simplified):**
- Data from application → create segment with seq #, start timer if not running (tracks oldest unACKed segment), expiration = TimeOutInterval
- Timeout → retransmit the segment that timed out, restart timer
- ACK received → update what's ACKed; restart timer if segments remain unACKed
 
**TCP receiver — ACK generation (RFC 5681):**
| Event | Action |
|---|---|
| In-order segment, nothing else pending | Delayed ACK — wait up to 500ms, then ACK |
| In-order segment, one other pending | Send one cumulative ACK for both |
| Out-of-order (gap detected) | Immediate duplicate ACK for next expected byte |
| Segment fills a gap | Immediate ACK, if it starts at the gap's lower end |

**Retransmission scenarios:**
- Lost ACK → sender's timer expires, resends; receiver re-ACKs the duplicate
- Premature timeout → a later cumulative ACK covers the resent data anyway; SendBase advances, further duplicate ACKs get ignored
- Cumulative ACK covering an earlier lost ACK → the loss becomes irrelevant once a later ACK covers the same ground
 
**Fast retransmit:**
- Upon receiving three additional duplicate ACKs (four total with the same number) → strong signal of loss, even before timeout
- Sender immediately resends the smallest unACKed sequence number, skipping the wait for timeout

**Flow control:**
- Problem: network layer could deliver data faster than the application reads it out, overflowing the receiver's buffer
- Receiver advertises free buffer space via **rwnd (receive window)** in every TCP header
- **RcvBuffer** size set by OS/socket options (e.g., 4096 bytes)
- Sender limits unACKed in-flight data to **rwnd** bytes
- Application draining the buffer frees space, growing rwnd again over time — dynamically matches transmission rate to receiver capacity
 
**Connection management — three-way handshake:**
1. Client picks initial seq *x*, sends SYNbit=1, Seq=x
2. Server picks initial seq *y*, replies SYNbit=1, Seq=y, ACKbit=1, ACKnum=x+1 (SYNACK; the SYN itself consumes one sequence number)
3. Client replies ACKbit=1, ACKnum=y+1 — may already carry data
Note: Sequence number 0 is never actually used as a real initial value
 
**Closing a connection:**
- Each side sends a segment with **FIN bit = 1** to close its own direction
- A received FIN gets ACKed; that ACK can combine with the receiver's own FIN ("FINACK") if it's also ready to close
- Simultaneous FIN exchanges from both sides are handled correctly
 
---

## 2. QUIC: A Reliable Transport Built on UDP
 
- Developed by Google (2012), later standardized by the Internet Engineering Task Force (IETF)
- **Runs over UDP**, adds **TCP-level reliability**, **TLS encryption**, and **stream multiplexing**
 
| TCP + TLS limitation | QUIC improvement |
|---|---|
| Setup needs multiple round trips (separate TCP + TLS handshakes) | 1- or 0-RTT handshake |
| One lost packet delays every stream | Streams are independent — loss in one doesn't block others |
| TCP lives in the OS kernel — slow to update | QUIC lives in user space — easy to evolve |
| TLS runs above TCP as a separate layer | TLS 1.3 encryption built in |
 
Motivation: TCP resends data on any detected loss, sometimes unnecessarily; QUIC's independent streams and faster handshake cut down that overhead
 
---

## Key Points to Remember
- TCP sequence numbers **count bytes**, not segments; ACKs are cumulative and NAK-free
- Triple duplicate ACKs trigger fast retransmit, skipping the timeout wait
- Flow control (rwnd) **protects the receiver's buffer**
- Congestion control **protects the network itself**
- Three-way handshake **opens a TCP connection**; independent FIN exchanges close it
- QUIC reimplements TCP-like reliability over UDP, trading kernel-level stability for faster handshakes and per-stream loss isolation
`},
  {title: "Study Notes: Network Layer - Data Plane",
slug: "network-layer-data-plane",
date: "2026-09-16",
tags: ["Network"],
excerpt: "Forwarding vs. routing, router architecture, switching fabrics, queuing and scheduling, IP addressing, DHCP, NAT, and IPv6",
readTime: "x min",
snippet: `
Arriving         DHCP Server 
 Client         (192.168.1.1)
   │                   │
   │── DHCP Discover ─▶│  (broadcast)
   │                   │
   │◀─── DHCP Offer ───│  (offers 192.168.1.42)
   │                   │
   │── DHCP Request ──▶│  (request to use offered address)
   │                   │
   │◀──── DHCP ACK ────│  (confirms)
   │                   │`,
content: `## Overview
 
- Network layer moves segments from sending host to receiving host; every host and router runs network layer protocols
- **Encapsulation**: application data becomes a segment (transport layer, adds ports), then a datagram (network layer, adds IP addresses), then a frame (link layer, adds a header). The frame wrapper survives only one hop; the datagram survives the whole trip
- **Forwarding**: moving a packet from input port to output port (like navigating one interchange); local, per router action
- **Routing**: computing the path from source to destination (like planning a trip); end to end
- **Data plane**: local, hardware, nanosecond scale; **decides how an arriving datagram is forwarded**
- **Control plane**: network wide, software, millisecond scale; *decides the **end to end route***. Implemented via traditional routing algorithms in each router, or SDN (logic placed on remote servers)
- **Service model**: the Internet uses **best effort**: <u>no guarantees</u> on delivery, order, timing, or bandwidth
- Best effort service's mechanism is simple and easy to deploy; sufficient bandwidth makes real time apps "good enough" most of the time; CDNs and datacenters replicate services near clients; congestion control in elastic apps helps overall behavior

## Inside a Router
\`\`\`
                      Input Port
┌───────────────┐  ┌───────────────┐  ┌─────────────────────┐   │
│     Line      │  │   Link Layer  │  │                     │   │
│  Termination  │─▶│    Protocol   │─▶│  Lookup, Forwarding │─▶ │  Switching
│   (physical   │  │(e.g.,Ethernet)│  │     & Queueing      │   │    Fabric
│    layer)     │  │               │  │                     │   │
└───────────────┘  └───────────────┘  └─────────────────────┘   │
\`\`\`
- Architecture: input ports feed a switching fabric which feeds output ports, all coordinated by a routing processor
- **Decentralized switching**: each input port has its own copy of the forwarding table and does the lookup itself, locally. No central processor is involved per packet
- **Destination based forwarding**: forwards based on destination IP only (traditional)
- **Generalized forwarding**: forwards based on any header fields

## Switching Fabrics
- **Switching rate**: **how quickly packets can move** through the fabric from inputs to outputs, typically expressed as a multiple of a single port's line speed
- **Line rate**: the speed of an individual physical link connected to one port
- Switching rate ideally reaches **N × Line Rate** for N inputs
- **Fabric types**:
  - **Via memory**: CPU controlled, packet copied into system memory; throughput capped by memory bandwidth since each datagram crosses the bus twice (once from input port to memory, once from memory to output port); adequate for small scale
  - **Via bus**: **shared bus** links input and output memory; limited by bus bandwidth (contention); example: a 32 Gbps bus in the Cisco 5600
  - **Via interconnection network**: crossbar and Clos multistage switches; **can fragment datagrams into cells, switch them in parallel, and reassemble at the exit**; speeding up and scaling using multiple parallel switching planes (Cisco CRS uses 8 planes, reaching hundreds of Tbps)
- **Longest prefix matching**: when multiple table entries match, <u>pick the most specific (longest) prefix</u>. Implemented via ternary content addressable memories (TCAMs), giving **constant time lookup** regardless of table size (about 1M entries on Cisco Catalyst).

## Queuing
- **Input queuing**: occurs if the fabric is slower than the combined input rate, causing delay and loss
- **Head-of-the-Line (HOL) blocking**: a blocked packet at the front of a queue **stalls every packet behind it**, even ones headed to a free output
- **Output queuing**: occurs if the arrival rate via the fabric exceeds the output link rate, causing delay and loss
- **Buffering** is required when datagrams arrive from the fabric faster than the link transmission rate; datagrams can be lost due to congestion when no buffer space remains
- Buffer sizing rule of thumb (RFC 3439): **RTT (about 250ms) × link capacity C**. Too much buffering causes excess delay and a slow TCP response
- **Drop policies**: tail drop (drop arriving packet); priority based drop
- **Marking**: instead of dropping a packet outright, the router marks a field in its header **to signal that congestion is building**; the receiving endpoint **can then react and slow down before real loss occurs**. RED (Random Early Detection) decides probabilistically which packets to mark as the queue starts to fill, while ECN (Explicit Congestion Notification) is the header bit actually used to carry that signal

## Packet Scheduling Disciplines
 1. **FCFS / FIFO**: transmit in arrival order
 2. **Priority**: classified and queued by class, always serve the highest nonempty priority queue, FCFS within a class
 3. **Round robin**: cycle through class queues, sending one packet per class per turn
 4. **Weighted fair queuing (WFQ)**: extends round robin by giving each class a service share proportional to its assigned weight, so every class is **assured some minimum bandwidth**

## Internet Protocol (IP)
- The IP protocol defines datagram format, addressing, and packet handling; Internet Control Message Protocol (ICMP) handles error reporting and router signaling
- Datagram header fields: IP protocol version, header length, type of service, total length, fragmentation fields (identifier, flags, offset), **time to live (decremented at each hop, drops the packet at zero to guard against loops)**, upper layer protocol (TCP or UDP), header checksum, source and destination address, options, payload
 
## IP Addressing
- An IP address is **a 32 bit identifier** tied to an **interface (connection between host/router and physical link)**, not a device Routers typically have multiple interfaces; hosts usually have one or two.
- **Subnet**: a group of interfaces that can communicate directly, with no router in between. An address splits into a subnet portion (shared upper bits within the group) and a host portion (remaining lower bits that pick out one device)
- Subnet mask (for example /26) states how many high order bits mark the subnet part.
- The **network address (all host bits zero)** and **broadcast address (all host bits one)** are reserved and not assignable to a device
- **Classless InterDomain Routing (CIDR)**: address written as a.b.c.d/x, where x is the number of bits in the subnet mask, also called the prefix length (arbitrary, not tied to fixed classes)

## Obtaining an IP Address
- Host part: assigned manually **by hard coding**, or **dynamically via** **Dynamic Host Configuration Protocol (DHCP)** ("plug and play")
- DHCP addresses are leased for a period; automatically assigns IP addresses and other network configuration details to devices on a network; renewal typically begins around half the lease time; the DHCP server is often located inside a router
- DHCP exchange has four steps: **discover, offer, request, ack** (discover and offer can be skipped if the host reuses a remembered address, per RFC 2131)
 
\`\`\`
Arriving Client                    DHCP Server (192.168.1.1)
      │                                    │
      │──────── DHCP Discover ────────────▶│  (broadcast: any DHCP server out there?)
      │                                    │
      │◀─────────  DHCP Offer  ────────────│  (offers 192.168.1.42, lifetime 3600s)
      │                                    │
      │──────── DHCP Request ─────────────▶│  (client asks to use offered address)
      │                                    │
      │◀──────────   DHCP ACK   ───────────│  (confirms: address is yours)
      │                                    │
\`\`\`
 
- DHCP can also supply the **first hop router address**, **a DNS server**, and **a network mask** (indicating network vs. host portion of address)
- Unlike hosts which get their address via hard coding or DHCP, a **network itself gets the subnet part of its address through its provider ISP's address space**
 
## Route Aggregation
- Hierarchical addressing lets an **ISP advertise one aggregated block** (such as a /20) instead of many small ones
- If an organization switches ISPs, the new ISP advertises a more specific route just for that organization's block
- Routers **always prefer the longest, most specific prefix match** when forwarding
- **Internet Corporation for Assigned Names and Numbers (ICANN)** allocates address blocks through **five regional registries** and also manages the DNS root zone and TLD delegation
- The IPv4 pool is exhausted: ICANN allocated its last block in 2011. Two responses are **NAT (stretching existing space)** and **IPv6 (a new 128 bit space)**

## Network Address Translation (NAT)
* Local network devices **share one public IPv4 address** and are **distinguished externally by port number**
* Private address ranges, never publicly routed (RFC 1918): **10/8, 172.16/12, 192.168/16**
* Advantages: **only one public address is needed**; internal addresses can change freely; the ISP can change without renumbering internal devices; **internal devices are not directly addressable or visible externally (security)**
* Mechanism: outgoing datagrams are rewritten to **(NAT IP address, new port #)**; the mapping is **stored in a NAT translation table**; incoming datagrams are rewritten back using that table
* Criticism: it touches port numbers at a layer 3 device, seen as **breaking the end to end argument**; it is a workaround rather than a true fix for address scarcity; it complicates NAT traversal for inbound connections
* Still used widely: home and institutional networks, 4G and 5G

## IPv6
- Motivation: IPv4 exhaustion, plus faster processing through a fixed 40 byte header, plus support for per flow treatment
- Header adds: a priority field (identifies priority among datagrams flow), a flow label (identifies datagrams in the same flow), and 128 bit source and destination addresses
- Removed compared with IPv4: checksum, in-network fragmentation and reassembly, and the options field (moved to a next header chain instead)
- Over 25 years since introduction and adoption is still incomplete, showing how much harder infrastructure change is than application layer change
`},
];
