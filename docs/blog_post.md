This document is an outline for writing a blog post for the FiQCI website. The document covers the most common
formatting and syntax topics and explains technical aspects to know when writing a blog. Also use old blogs as a reference.
E.g. [Circuit-Knitting-Blog.md](../src/content/publications/2024-08-27-Circuit-Knitting-Blog.md),
[Topology.md](../src/content/publications/2024-08-29-Topology.md) are good examples since not all old blogs exactly follow the principles
outlined here.

## Contents

- [Contents](#contents)
- [Filename](#filename)
- [Metadata](#metadata)
- [Author](#author)
- [Abstract](#abstract)
- [Headings](#headings)
- [Images](#images)
- [Tables](#tables)
- [Code blocks](#code-blocks)
- [LaTex](#latex)
- [References](#references)
- [Previewing the post](#previewing-the-post)
- [Other important remarks](#other-important-remarks)

## Filename

Have the filename of the post begin with the publication date in yyyy-mm-dd. The filename should then be
"yyyy-mm-dd-Blog-Title.md". The file should be placed in `/src/content/publications/`.

The filename becomes the address of the post: `2024-08-27-Circuit-Knitting-Blog.md` is published at
`/publications/2024-08-27-Circuit-Knitting-Blog.html`. Don't rename a post after publishing it, as that changes its address.

## Metadata

Below is a code block containing example metadata for a blog. This is included at the top of each post
(wrapped with the "---" separator). Each field has comments explaining it and listing possible values if applicable.

```yml
---
title: 'The main title of the post' #Blog title
date: yyyy-mm-dd #the date of publication as yyyy-mm-dd
header: #thumbnail image for the post
  teaser: /assets/images/{path to teaser image of your blog} #e.g /assets/images/topology/thumbnail.webp
published: true #set to false to leave the post out of the site entirely
author: author name #name of the author, must match an entry in src/data/authors.yml
tags: #keywords related to the topic of the blog, e.g Q20, Quantum, etc
  - tag_1
  - tag_2
  - etc
filters: #choose appropriate filters from the commented options. If multiple separate with a comma
  Skill level: Beginner # Beginner, Advanced
  Type: Blog # Blog, Instructions, News, Resource Call
  Theme: Technical # Technical, Algorithm, Programming, HPC+QC+AI
---
```

Optional fields:

- `description: ...` a one-sentence summary used for the page description and link previews.
- `hidden: true` keeps the post out of the blog listings, the "Read next" list and search, while it is still reachable by its address.

The `collection` and `layout` fields found in older posts are no longer needed and can be left out.

If the metadata is invalid (for example a missing `title` or a malformed `date`), the build fails with an error naming the file and the field.

## Author

The `author` field must match a name in `src/data/authors.yml`, which provides the author's name, bio and avatar shown next to the post.
Add yourself there if you are a new author:

```yml
Firstname Lastname:
  name        : "Firstname Lastname"
  bio         : "Your title at your organisation"
  avatar      : "/assets/images/authors/Firstname_Lastname.webp"
```

## Abstract
Begin the blog with a short abstract and wrap it with "*" for italics:
```markdown
*Short abstract in italics*
```

If the post has a teaser image (`header.teaser`) and begins with an italic abstract, the teaser image is shown
automatically right after the abstract.

## Headings

You can add different levels of headers with markdown as:
```markdown
## Header 2
### Header 3
#### Header 4
##### Header 5
###### Header 6 etc
```

To avoid clashing with the main title, use `## Header 2` as the biggest heading in the blog text.

**NOTE**: Do not add a separate header for your main title. It'll be automatically displayed from the title field in metadata.

## Images

Images are stored under `/public/assets/images/`, preferably in a folder named after your blog, and are referred to
without the `/public` part. You can add images in markdown like:
```markdown
![alt text goes here](/assets/images/{path to your image})
```

**NOTE**: Images will not display on VS Code's markdown preview. For the preview to work, use
`![alt text goes here](../../../public/assets/images/{path to your image})` just remember to change before publishing.

e.g:
```markdown
![Example on how circuit changes when a wire is cut](/assets/images/Circuit-Knitting-Blog/circuit-knitting-general-example.webp)
```

You can also use HTML for more fine-grained layout control:
```html
<figure style="define styles here in css">
    <img src="/assets/images/{path to your image}" alt="alt text goes here" style="more css">
</figure>
```


e.g
```html
<figure style="display: inline-block; text-align: left; margin: 0; padding: 0;">
    <img src="/assets/images/topology/grid.webp" alt="Qubit grid" style="width: 70%">
</figure>
```

For consistent styles, use markdown syntax when possible. Prefer `.webp` images to keep the pages fast.

## Tables

Markdown:
```markdown
| Title 1     | Title 2   | Title 3      |
|-------------|-----------|--------------|
| wow         | look      | at           |
| this        | amazing   | table        |
```

If the table needs to be centred HTML is needed:
```html
<div align="center">
  <table>
    <thead>
      <tr>
        <th>Title 1</th>
        <th>Title 2</th>
        <th>Title 3</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>wow</td>
        <td>look</td>
        <td>at</td>
      </tr>
      <tr>
        <td>this</td>
        <td>amazing</td>
        <td>table</td>
      </tr>
    </tbody>
  </table>
</div>
```

NOTE: Always wrap html tables in a `<div>` element like above (centering is optional), so wide tables can scroll sideways on small screens.

## Code blocks

Code blocks can be added with: `` `code goes here` `` for inline code or for multiline code
````
```language e.g python
Code goes here
```
````

Always give the language (`python`, `bash`, `yaml`, ...) so the code gets syntax highlighting.

## LaTex

Equations special characters etc can be added with latex. Use `$ latex here $` for inline and for multiline
```latex

$$
latex here
$$

```

Note that the multiline block needs to be separated from the main text with an empty line e.g.
```markdown
some text

$$
latex block
$$

some more text
```

`$$ latex here $$` written inside a sentence is also shown inline. The equations are rendered with MathJax in the browser.

## References

If your blog has references, use the exact formatting as below. This ensures that the formatting will
work once deployed to the website. You can refer to a specific reference using `[[1]](#references)`.
This will show up as [[1]](#references).

```markdown
## References

1. Reference 1
2. Reference 2
3. etc
```

The `## References` heading must be followed directly by the numbered list. The list is shown in a collapsible
"References" section at the end of the post.

## Previewing the post

Run `npm run dev` and open `http://localhost:4321/publications/{your filename without .md}.html`. The page reloads
automatically as you edit. See the [README](../README.md) for setting up the development environment.

New posts show up in site search only after running `npm run build`, as the search index is built from the built site.

## Other important remarks

Do not add:

```markdown
## Give feedback!

Feedback is greatly appreciated! You can send feedback directly to [fiqci-feedback@postit.csc.fi](mailto:fiqci-feedback@postit.csc.fi).
```

to the end of the blog. It is added automatically.

Resource calls (`Type: Resource Call`) are handled specially: only the newest one is shown in the blog listings, it is
listed first in search results when it matches, and the address `/resource-call` always redirects to it.

For other syntax etc have a look at [Circuit-Knitting-Blog.md](../src/content/publications/2024-08-27-Circuit-Knitting-Blog.md),
[Topology.md](../src/content/publications/2024-08-29-Topology.md), and [markdown guide](https://www.markdownguide.org/basic-syntax/)
