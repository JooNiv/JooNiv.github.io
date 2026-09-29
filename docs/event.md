This document is an outline for adding an event to the FiQCI website. The document covers the most common
formatting/syntax topics and explains technical aspects to know when adding an event. Also use old events as a reference.

## Contents

- [Contents](#contents)
- [Filename](#filename)
- [Metadata](#metadata)
- [Content](#content)
- [How events are shown](#how-events-are-shown)


## Filename

Have the filename of the event begin with the date of the event in yyyy-mm-dd. The file should then be
"yyyy-mm-dd-Event-name.md". The file should be placed in `/src/content/events/`

## Metadata

Below is a code block containing example metadata for an event. This is included at the top of each event file
(wrapped with the "---" separator). Each field has comments explaining it and listing possible values if applicable.

```markdown
---
title: 'Title of the Event' #Event name
date: yyyy-mm-dd #date of the event (first day) as yyyy-mm-dd
published: true #leave as is
link: https://the-event.fi/info/signup #link to event page
tags: #keywords related to the event, e.g Q20, Quantum, etc
  - tag_1
  - tag_2
  - etc
filters: #choose appropriate filters from the commented options. If multiple separate with a comma
  Pricing: Free of charge # Free of charge, or empty if paid
  Skill level: Beginner # Beginner, Advanced
  Type: Online # Online, Hybrid, Onsite
  Theme: Course/Workshop # Course/Workshop, HPC+QC+AI, Programming, Webinar/Lecture
---
```

`title`, `date` and `link` are required; the build fails with an error naming the file if one is missing.
The `type: Event` and `header` fields found in older events are not used and can be left out.

## Content
The content of the event file should simply be the days when the event takes place followed by a short description (separated by a ":")
```
dd-dd month_name_spelled_out: Description.
```
E.g.
```
25-26 November: Two-day introductory course on quantum computers and the basic quantum algorithms that control them.
```

## How events are shown

- The `date` decides whether the event is listed under "Upcoming events" or "Past events" on the events page. Events
  dated after today are upcoming; an event moves to past events on its date.
- The newest events are shown on the front page.
- Events do not have a page of their own: `/events/{filename without .md}.html` redirects to the event's `link`,
  and event cards and search results link there directly.
- New events show up in site search after running `npm run build`.
