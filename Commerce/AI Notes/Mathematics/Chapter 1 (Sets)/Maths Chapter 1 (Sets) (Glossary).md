# 📖 CHAPTER 1 — GLOSSARY & TERMINOLOGY
> **Sets** | All terms alphabetically arranged with precise mathematical definitions, examples, and exam relevance tags.

---

## A

> [!info] **Absorption Law** *(Board/JEE)*
> A pair of identities showing that a set "absorbs" the result of combining it with a subset operation:
>
> $$A \cup (A \cap B) = A \qquad A \cap (A \cup B) = A$$
>
> *Intuition:* If you take $A$ and add to it only the part of $B$ that overlaps $A$, you get $A$ back. Useful in simplification problems.

---

> [!note] **Associative Law**
> A property of $\cup$ and $\cap$ stating that the grouping of sets does not affect the result:
>
> $$(A \cup B) \cup C = A \cup (B \cup C)$$
> $$(A \cap B) \cap C = A \cap (B \cap C)$$
>
> *Unlike subtraction and difference, set union and intersection are associative.*

---

## C

> [!important] **Cardinality** *(Board/JEE/CUET)*
> The **number of elements** in a set. Denoted $n(A)$ or $|A|$.
>
> | Set | Cardinality |
> |:---:|:---:|
> | $\phi$ | $n(\phi) = 0$ |
> | $\{a\}$ | $n = 1$ |
> | $\{1, 2, 3\}$ | $n = 3$ |
> | $\mathbb{N}$ | Infinite — $n$ not defined finitely |
>
> > ⚠️ Exam Trap: $n(\{\phi\}) = 1$ because the set contains one element (the empty set). Do NOT write $n(\{\phi\}) = 0$.

---

> [!important] **Complement of a Set** *(Board/JEE/CUET)*
> The complement of $A$ with respect to universal set $U$ is the set of all elements in $U$ that are NOT in $A$.
>
> $$A' = U - A = \{x : x \in U,\ x \notin A\}$$
>
> **Key identities:**
> $$A \cup A' = U \qquad A \cap A' = \phi \qquad (A')' = A \qquad U' = \phi \qquad \phi' = U$$

---

> [!note] **Commutative Law**
> A property stating that the order of operands does not matter:
>
> $$A \cup B = B \cup A \qquad A \cap B = B \cap A$$
>
> > ⚠️ Set difference is NOT commutative: $A - B \neq B - A$ in general.

---

## D

> [!important] **De Morgan's Laws** *(Board/JEE/CUET — most tested law)*
> Two fundamental identities relating complement to union and intersection:
>
> $$\boxed{(A \cup B)' = A' \cap B'} \qquad \boxed{(A \cap B)' = A' \cup B'}$$
>
> **How to remember:** Taking the complement **flips** the operation ($\cup \leftrightarrow \cap$) and complements each set.
>
> **Proof sketch of Law 1:** $x \in (A \cup B)' \Rightarrow x \notin A \cup B \Rightarrow x \notin A$ and $x \notin B \Rightarrow x \in A'$ and $x \in B' \Rightarrow x \in A' \cap B'$.
>
> > ⚠️ De Morgan's Laws extend to any finite number of sets:
> > $(A \cup B \cup C)' = A' \cap B' \cap C'$

---

> [!important] **Difference of Sets** *(Board/JEE)*
> $A - B$ (read "A minus B") is the set of elements in $A$ but NOT in $B$:
>
> $$A - B = \{x : x \in A,\ x \notin B\} = A \cap B'$$
>
> **Cardinality:** $n(A - B) = n(A) - n(A \cap B)$
>
> > ⚠️ $A - B \neq B - A$ unless $A = B$. Set difference is not commutative.
>
> *Example:* $A = \{1,2,3,4\}$, $B = \{3,4,5\}$: $A - B = \{1,2\}$, $B - A = \{5\}$

---

> [!important] **Disjoint Sets** *(Board/JEE)*
> Two sets $A$ and $B$ are **disjoint** if they share no common elements:
>
> $$A \cap B = \phi$$
>
> For disjoint sets: $n(A \cup B) = n(A) + n(B)$
>
> *Venn diagram:* Two circles with no overlap.

---

> [!note] **Distributive Law** *(Board/JEE)*
> Set union distributes over intersection and vice versa:
>
> $$A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$$
> $$A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$$
>
> *Analogous to:* $a(b + c) = ab + ac$ in arithmetic — but notice BOTH directions work for sets, unlike arithmetic.

---

## E

> [!important] **Element / Member** *(Board)*
> An object that belongs to a set.
>
> $$a \in A \quad \text{(a belongs to A)} \qquad b \notin A \quad \text{(b does not belong to A)}$$
>
> Elements of a set must be distinct (no repetition) and the set must be well-defined.

---

> [!important] **Empty Set (Null Set / Void Set)** *(Board/JEE/CUET)*
> A set containing **no elements**.
>
> $$\phi = \{\} \qquad n(\phi) = 0$$
>
> **Critical properties:**
> - $\phi$ is a subset of every set: $\phi \subseteq A$ for all $A$
> - $\phi$ is unique — there is only one empty set
> - $\phi \cup A = A$ and $\phi \cap A = \phi$
>
> > ⚠️ $\{\phi\}$ is NOT empty — it has one element. $\{0\}$ is NOT empty — it has one element (zero).

---

> [!note] **Equal Sets** *(Board)*
> Sets $A$ and $B$ are equal if they have exactly the same elements:
>
> $$A = B \iff (A \subseteq B \text{ and } B \subseteq A)$$
>
> Order and repetition do not matter: $\{1,2,3\} = \{3,2,1\} = \{1,1,2,3\}$

---

> [!note] **Equivalent Sets** *(Board)*
> Sets with the same number of elements (same cardinality):
>
> $$A \sim B \iff n(A) = n(B)$$
>
> > ⚠️ Equal sets are always equivalent. Equivalent sets are NOT necessarily equal.
> > *Example:* $\{1,2,3\} \sim \{a,b,c\}$ — equivalent but not equal.

---

## F

> [!note] **Finite Set** *(Board)*
> A set with a definite (countable) number of elements. $n(A)$ is a non-negative integer.
>
> *Examples:* $\{1,2,3\}$, the set of vowels, the set of months in a year.

---

## I

> [!important] **Idempotent Law** *(Board/JEE)*
> Any set operated with itself under $\cup$ or $\cap$ returns itself:
>
> $$A \cup A = A \qquad A \cap A = A$$

---

> [!important] **Inclusion-Exclusion Principle** *(Board/JEE/CUET — practical problems)*
> The formula for the cardinality of a union, correcting for over-counting:
>
> **Two sets:**
> $$n(A \cup B) = n(A) + n(B) - n(A \cap B)$$
>
> **Three sets:**
> $$n(A \cup B \cup C) = n(A) + n(B) + n(C) - n(A \cap B) - n(B \cap C) - n(A \cap C) + n(A \cap B \cap C)$$
>
> *Pattern:* Add individual → Subtract pairwise → Add triple.

---

> [!note] **Infinite Set** *(Board)*
> A set whose elements cannot be listed completely — there is no last element.
>
> *Examples:* $\mathbb{N}, \mathbb{Z}, \mathbb{Q}, \mathbb{R}$, the set of all even numbers.

---

> [!important] **Intersection of Sets** *(Board/JEE/CUET)*
> $A \cap B$ is the set of elements common to both $A$ and $B$:
>
> $$A \cap B = \{x : x \in A \text{ and } x \in B\}$$
>
> **Properties:** Commutative, associative, $A \cap U = A$, $A \cap \phi = \phi$, $A \cap A = A$, $A \cap A' = \phi$.

---

> [!note] **Interval** *(JEE/CUET)*
> A set of real numbers lying between two endpoints. Written in bracket notation:
>
> | Type | Notation | Meaning |
> |:---:|:---:|:---|
> | Open | $(a, b)$ | $a < x < b$ — endpoints excluded |
> | Closed | $[a, b]$ | $a \leq x \leq b$ — endpoints included |
> | Half-open | $(a, b]$ or $[a, b)$ | One endpoint included |
>
> > ⚠️ $(a, b)$ in set context means an open interval, NOT an ordered pair.

---

## N

> [!note] **Natural Numbers ($\mathbb{N}$)**
> $\mathbb{N} = \{1, 2, 3, 4, \ldots\}$
>
> > ⚠️ In NCERT Class XI, $\mathbb{N}$ starts from 1, NOT 0. Zero is included in whole numbers ($\mathbb{W}$).

---

## P

> [!important] **Power Set** *(Board/JEE/CUET)*
> The power set $P(A)$ is the collection of ALL subsets of $A$ (including $\phi$ and $A$ itself):
>
> $$P(A) = \{S : S \subseteq A\}$$
>
> **Cardinality:** $n(P(A)) = 2^{n(A)}$
>
> | $n(A)$ | $n(P(A))$ |
> |:---:|:---:|
> | 0 | 1 |
> | 1 | 2 |
> | 2 | 4 |
> | 3 | 8 |
> | $n$ | $2^n$ |
>
> > ⚠️ $P(A)$ is a **set of sets** — its elements are sets (subsets of $A$), not the elements of $A$ themselves.

---

> [!important] **Proper Subset** *(Board/JEE)*
> $A$ is a proper subset of $B$ if $A \subseteq B$ but $A \neq B$:
>
> $$A \subset B$$
>
> Number of proper subsets of a set with $n$ elements $= 2^n - 1$
>
> > ⚠️ Every set is a subset of itself but NOT a proper subset of itself.

---

## R

> [!note] **Roster Form (Tabular Form)** *(Board)*
> A method of representing a set by listing all its elements within curly braces, separated by commas.
>
> *Rules:* Each element appears only once; order does not matter.
>
> *Example:* Set of natural numbers less than 6: $\{1, 2, 3, 4, 5\}$

---

## S

> [!important] **Set** *(Board/JEE/CUET)*
> A **well-defined collection of distinct objects**.
>
> - "Well-defined" = given any object, we can clearly determine if it belongs or not
> - "Distinct" = no element is repeated
>
> Denoted by capital letters: $A, B, C, \ldots$

---

> [!important] **Set-Builder Form (Rule Form)** *(Board/JEE)*
> A method of representing a set by specifying a property that all its elements satisfy:
>
> $$A = \{x : P(x)\} \quad \text{or} \quad A = \{x \mid P(x)\}$$
>
> Read: "A is the set of all x such that x satisfies property P."

---

> [!note] **Singleton Set** *(Board)*
> A set containing exactly one element: $n(A) = 1$.
>
> *Examples:* $\{5\}$, $\{0\}$, $\{\phi\}$
>
> Note: $\{\phi\}$ is a singleton set containing the empty set as its only element.

---

> [!important] **Subset** *(Board/JEE/CUET)*
> $A$ is a subset of $B$ ($A \subseteq B$) if every element of $A$ is also an element of $B$:
>
> $$A \subseteq B \iff (x \in A \Rightarrow x \in B)$$
>
> **Key facts:**
> - $\phi \subseteq A$ for every set $A$
> - $A \subseteq A$ for every set $A$
> - $A \subseteq B$ and $B \subseteq A$ $\Rightarrow$ $A = B$
> - If $A \subseteq B$ and $B \subseteq C$, then $A \subseteq C$ (transitivity)

---

> [!note] **Superset** *(Board)*
> $B$ is a superset of $A$ if $A \subseteq B$. Denoted $B \supseteq A$.

---

## U

> [!important] **Union of Sets** *(Board/JEE/CUET)*
> $A \cup B$ is the set of all elements that belong to $A$ or $B$ or both:
>
> $$A \cup B = \{x : x \in A \text{ or } x \in B\}$$
>
> **Properties:** Commutative, associative, $A \cup \phi = A$, $A \cup U = U$, $A \cup A = A$, $A \cup A' = U$.

---

> [!important] **Universal Set** *(Board/JEE)*
> The set $U$ (or $\xi$) that contains all elements relevant to the current problem. All other sets in the discussion are subsets of $U$.
>
> $$U' = \phi \qquad \phi' = U \qquad A \subseteq U \text{ for all } A$$

---

## V

> [!note] **Venn Diagram** *(Board/JEE)*
> A visual representation of sets using circles within a rectangle (the rectangle represents $U$). Overlapping circles represent sets with common elements.
>
> | Region | What it Represents |
> |:---:|:---|
> | Only inside circle $A$ | Elements in $A$ but not in $B$ — $A - B$ |
> | Only inside circle $B$ | Elements in $B$ but not in $A$ — $B - A$ |
> | Overlap | $A \cap B$ |
> | Either circle | $A \cup B$ |
> | Outside both circles | $(A \cup B)'$ — elements in neither |

---

## W

> [!important] **Well-Defined** *(Board — conceptual)*
> A collection is well-defined if, for every object, we can definitively determine whether it belongs to the collection.
>
> | Collection | Well-Defined? |
> |:---|:---:|
> | All prime numbers less than 20 | ✅ Yes |
> | All beautiful paintings | ❌ No — "beautiful" is subjective |
> | All odd integers | ✅ Yes |
> | All honest people | ❌ No — "honest" is subjective |

---

*Total terms defined: 32 | End of Glossary — Maths Ch. 1: Sets*
