# Google Scholar Query Builder Operators.

---

Google Scholar has two parts:

1. Search operators (typed inside the search box).
2. URL parameters (added after “?q=” in the link).

---

**1. Core Boolean operators**

* `AND` means all terms must appear. Example: `AI AND healthcare`.
* `OR` (must be uppercase) means any term may appear. Example: `AI OR ML`.
* `-` excludes a term. Example: `AI -ethics`.
* Quotation marks `" "` make an exact phrase. Example: `"deep learning"`.
* `*` is a wildcard for one word, used inside quotes only. Example: `"Joseph * Biden"`.
* `AROUND(n)` limits how far apart two words can be. Example: `"data" AROUND(5) "privacy"`.

Spaces act like AND automatically.
Scholar reads AND before OR. Parentheses do not reliably change that order. They are mostly for readability.
`AI OR ML cyber` is treated as `(AI OR ML) AND cyber`.

---

**2. Field-specific operators**

* `author:` limits to authors. Example: `author:"Geoffrey Hinton"`. Use quotes for names with spaces.
* `intitle:` limits to title words. Example: `intitle:"transfer learning"`.
* `allintitle:` requires all listed words in the title. Example: `allintitle:deep reinforcement learning`.
* `intext:` limits to body text. Example: `intext:"energy efficiency"`.
* `allintext:` requires all listed words in text. Example: `allintext:genetic algorithm optimization`.
* `source:` filters by journal name. Example: `source:"Nature"`.
* `site:` filters by website or domain. Example: `site:arxiv.org deep learning`.
* `filetype:` or `ext:` filters by file type. Example: `"quantum computing" filetype:pdf`.

You must repeat the field operator for each OR condition.
Wrong: `intitle:"AI" OR "cybersecurity"`
Right: `intitle:"AI" OR intitle:"cybersecurity"`

---

**3. Year and filter parameters (in URL only)**

* `as_ylo=2018` sets the earliest year.
* `as_yhi=2023` sets the latest year.
* `start=40` skips the first 40 results (used for pagination).
* `num=20` shows 20 results per page.
* `scisbd=2` sorts by date (`0` = relevance, `2` = newest).
* `hl=en` sets interface language.

Example URL:

```
https://scholar.google.com/scholar?q=intitle:%22quantum%20computing%22+author:%22A%20Zewail%22&as_ylo=2015&as_yhi=2020&start=40&num=20&scisbd=2&hl=en
```

---

**4. Rules for combining operators**

* Always use uppercase AND/OR.
* Repeat field operators on both sides of OR.
* Use quotes around multi-word terms.
* No space after a minus sign when excluding terms.
* Parentheses are optional; Scholar often ignores them.
* Scholar executes: exclusions → phrases → AND → OR (in that order).
* You cannot nest parentheses reliably.
* For automation, treat parentheses as cosmetic only.

---

**5. URL encoding**

When building URLs:

* Space = `%20` or `+`
* Quote `"` = `%22`
* Colon `:` = `%3A`
* Left parenthesis `(` = `%28`
* Right parenthesis `)` = `%29`
* Pipe `|` = `%7C`

Example:
`intitle:"deep learning"` becomes `intitle%3A%22deep%20learning%22`.

---

**6. Correct vs. incorrect examples**

| Type         | Incorrect                    | Correct                         | Reason                      |
| ------------ | ---------------------------- | ------------------------------- | --------------------------- |
| Phrase       | quantum computing algorithms | "quantum computing algorithms"  | Quotes needed for phrase    |
| Author       | John Doe author              | author:"John Doe"               | Must use author: operator   |
| Exclusion    | virus - case                 | virus -case                     | No space after minus        |
| OR grouping  | intitle:"AI" OR "ML"         | intitle:"AI" OR intitle:"ML"    | Repeat field                |
| Year range   | since:2019                   | &as_ylo=2019                    | since: not valid in Scholar |
| URL encoding | intitle:"deep learning"      | intitle%3A%22deep%20learning%22 | Encode special chars        |

---

**7. Example of complete query**

Search box version:
`-intitle:"information system" (intitle:"AI" OR intitle:"cybersecurity") author:"Jane Doe" filetype:pdf`

Encoded URL version:

```
https://scholar.google.com/scholar?q=-intitle%3A%22information%20system%22+(intitle%3A%22AI%22+OR+intitle%3A%22cybersecurity%22)+author%3A%22Jane%20Doe%22+filetype%3Apdf
```

---

**8. Best practices**

* Always quote multi-word terms.
* Use field operators for precision.
* Repeat context (like intitle:) on each OR side.
* Encode everything if generating URLs.
* Use `as_ylo` and `as_yhi` for year limits.
* Keep each query short (under ten operators).
* Test complex logic manually first.

---

**9. Quick lookup**

| Purpose     | Operator              | Example                          |
| ----------- | --------------------- | -------------------------------- |
| Author      | author:               | author:"Andrew Ng"               |
| Title       | intitle:, allintitle: | intitle:"deep learning"          |
| Text        | intext:, allintext:   | intext:"carbon emissions"        |
| Publication | source:               | source:"Science"                 |
| File type   | filetype:             | "quantum computing" filetype:pdf |
| Domain      | site:                 | site:arxiv.org                   |
| Year        | as_ylo, as_yhi        | as_ylo=2020&as_yhi=2023          |
| Proximity   | AROUND(n)             | "AI" AROUND(5) "ethics"          |
| Exclude     | -                     | -review                          |
| Wildcard    | *                     | "Joseph * Biden"                 |

---

This is the full operational rule set for constructing, combining, and encoding Google Scholar search queries for human or automated use.
