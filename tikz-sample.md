# TikZJax Sample

A few diagrams rendered with `tikz` fenced blocks.

---

## Simple Triangle

```tikz
\begin{tikzpicture}
  \draw (0,0) -- (3,0) -- (1.5,2.5) -- cycle;
  \node[below left]  at (0,0)     {$A$};
  \node[below right] at (3,0)     {$B$};
  \node[above]       at (1.5,2.5) {$C$};
\end{tikzpicture}
```

---

## Unit Circle with Axes

```tikz
\begin{tikzpicture}
  \draw[->] (-1.5,0) -- (1.5,0) node[right] {$x$};
  \draw[->] (0,-1.5) -- (0,1.5) node[above] {$y$};
  \draw (0,0) circle (1);
  \filldraw (0.866,0.5) circle (1.5pt) node[above right] {$(\cos\theta,\,\sin\theta)$};
  \draw[dashed] (0.866,0.5) -- (0.866,0) node[below] {$\cos\theta$};
  \draw[dashed] (0.866,0.5) -- (0,0.5)   node[left]  {$\sin\theta$};
  \draw[->] (0.3,0) arc (0:30:0.3) node[midway, right] {$\theta$};
\end{tikzpicture}
```

---

## Flowchart

```tikz
\usetikzlibrary{shapes.geometric, arrows.meta, positioning}
\begin{tikzpicture}[
    node distance=1.4cm,
    box/.style={draw, rectangle, minimum width=2.6cm, minimum height=0.8cm, align=center},
    decision/.style={draw, diamond, minimum width=2.6cm, minimum height=0.8cm, align=center, aspect=2},
    arr/.style={-{Stealth}}
  ]
  \node[box]      (start)  {Start};
  \node[box,      below=of start]   (input)  {Read input};
  \node[decision, below=of input]   (check)  {Valid?};
  \node[box,      below=of check]   (proc)   {Process};
  \node[box,      right=2cm of check] (err)  {Show error};
  \node[box,      below=of proc]    (done)   {End};

  \draw[arr] (start)  -- (input);
  \draw[arr] (input)  -- (check);
  \draw[arr] (check)  -- node[left]  {Yes} (proc);
  \draw[arr] (check)  -- node[above] {No}  (err);
  \draw[arr] (err)    |- (input);
  \draw[arr] (proc)   -- (done);
\end{tikzpicture}
```

---

## Inline Math alongside TikZ

The Pythagorean theorem states $a^2 + b^2 = c^2$. The right triangle below illustrates it:

```tikz
\begin{tikzpicture}
  \draw[thick] (0,0) -- (4,0) -- (4,3) -- cycle;
  \draw (3.7,0) -- (3.7,0.3) -- (4,0.3);
  \node[below] at (2,0)   {$a = 4$};
  \node[right] at (4,1.5) {$b = 3$};
  \node[above left] at (2,1.5) {$c = 5$};
\end{tikzpicture}
```

And a block math check:

$$
c = \sqrt{a^2 + b^2} = \sqrt{16 + 9} = \sqrt{25} = 5
$$
