# Contents

- [Contents](#contents)
- [Editing and adding content](#editing-and-adding-content)
  - [New announcement](#new-announcement)
  - [New alert](#new-alert)
  - [New Quantum Computer](#new-quantum-computer)
  - [New tool](#new-tool)
  - [New page](#new-page)
  - [New / edited text content](#new--edited-text-content)
- [Structure](#structure)
  - [Home](#home)
  - [Access](#access)
  - [About](#about)
  - [Status](#status)
  - [Cookies](#cookies)
  - [Accessibility](#accessibility)
  - [Others](#others)

# Editing and adding content

Most of the static (constant) content of the site is read from `src/data/constants.yml`.
Therefore to edit the content of the website one edits the constants.yml file.
This file describes the basic structure of the constants.yml file and explains how to make changes to the content on the site.

With `npm run dev` running, changes to `constants.yml` show up in the browser after a reload.
Blog posts and events are separate Markdown files, see [Adding a blog](blog_post.md) and [Adding an event](event.md).


## New announcement

In constants edit:
```yml
"/":
  hero:
    announcement: #the orange announcement box on the front page
      text: Access to VTT Q50 for accepted projects now open! #Announcement text
      link:
        title: How to access Q50, instructions #Link display text
        href: "#" #Link address
```

## New alert

The status page and the access page show alerts from the `alerts` list of their section in constants.
Alerts are grouped by `type` into separate "Alerts" (`error`), "Warnings" (`warning`) and "Information" (`info`) sections,
shown in that order. A section without alerts is hidden, and nothing is shown if the list is empty. An alert without a
`type` is shown as information.

```yml
"/status/":
  alerts:
    - text: Aalto Q20 is currently down for maintenance. #Alert text
      type: warning #error, warning or info
    - text: For estimating the runtime of a quantum job try out the FiQCI QPU resource estimator.
      type: info
      link: "https://fiqci.fi/resource-estimator" #Optional, makes the alert a link
    - text: Check out the new "Tools" section for FiQCI tools and example notebooks.
      type: info
      link: "#tools" #Links can also point to a section on the same page
```

The same format is used under `"/access/"`. To show alerts on another page, add an `alerts` list to that page's section
and render it with the `Alerts` component (`src/components/Alerts.jsx`), e.g. in an `.astro` page:

```astro
---
import { Alerts } from '../../components/Alerts.jsx'
import { constants } from '../../lib/constants.js'
---
<Alerts alerts={constants['/my-page/'].alerts} />
```

## New Quantum Computer

Add the quantum computer to the lists at:
```yml
"/status/":
  quantum-computers:
    - name: Aalto Q20
      qubits: 20
      basis: "PRX, CZ"
      topology: "Square grid"
      pulse: "True"
      device_id: "Q20" #id of the device in the FiQCI status backend
    ...
```

and

```yml
"/access/":
  quantum_resources:
    - name: Aalto Q20
      desc: |-
        Aalto Q20 is an IQM superconducting quantum computer with 20 qubits in a square grid topology. It is operated by Aalto University.
      image: "/assets/images/aalto-qc/aalto-q20.webp"
      links:
        - link: "/resource-call"
          teaser: "Apply for access to Aalto Q20"
        - link: "https://docs.csc.fi/computing/quantum-computing/running-quantum-jobs/"
          teaser: "How to access Aalto Q20, instructions"
          icon: mdiArrowRight
    ...
```

The latter applies also for new supercomputer and emulation resources (`supercomputer_resources`, `emulation_resources`).

## New tool

Tools are listed in the "Tools" section of the status page:
```yml
"/status/":
  tools:
    - name: QCut
      description: Quantum circuit-knitting package. Cut large circuits into smaller subcircuits that fit on current devices and reconstruct the result.
      href: https://fiqci.fi/QCut
    ...
```

## New page

Every file in `src/pages/` becomes a page, named after its path. A page at `/my-page/` is added by creating
`src/pages/my-page/index.astro`. If the page is only static content, the file should look something like:

```astro
---
import PageLayout from '../../layouts/PageLayout.astro'
import { constants } from '../../lib/constants.js'
import { pageByUrl } from '../../lib/pages.js'

const page = pageByUrl('/my-page/')
const data = constants['/my-page/']
---
<PageLayout title={page.title}>
  <div class="my-[24px] text-on-white">
    <p>{data.desc}</p>
  </div>
</PageLayout>
```

`PageLayout` adds the navigation bar, the banner with the page title, the breadcrumbs and the footer.

If the page needs a React component (assuming it is defined in `src/components/MyComponent.jsx`), import it and add it to the page:

```astro
---
import PageLayout from '../../layouts/PageLayout.astro'
import { MyComponent } from '../../components/MyComponent.jsx'
import { constants } from '../../lib/constants.js'
import { pageByUrl } from '../../lib/pages.js'

const page = pageByUrl('/my-page/')
---
<PageLayout title={page.title}>
  <p class="text-on-white">a bunch of content here</p>

  <MyComponent client:load {...constants['/my-page/']} />

  <p class="text-on-white">more content here</p>
</PageLayout>
```

The `client:` directive decides how the component runs in the browser:

- no directive: the component is rendered to plain HTML when the site is built and ships no JavaScript. Use this for components without any interactivity.
- `client:load`: the component is rendered when the site is built and becomes interactive in the browser. Use this by default for interactive components.
- `client:only="react"`: the component is rendered only in the browser. Use this for components that use `window`, `document` or `localStorage` while rendering, or that show data fetched in the browser.

Then register the page in `src/lib/pages.js`, which gives it its title (used in the banner, breadcrumbs and browser tab) and lets the navigation bar link to it:

```js
{ path: 'pages/my-page.md', url: '/my-page/', title: 'My Page Title' },
```

To make the page show up in the navigation bar add it to:
```yml
header_nav:
  - title: Home
    page: pages/home.md
  ...
  - title: My Page
    page: pages/my-page.md #the path given in src/lib/pages.js
```

in constants.yml. Additionally add any needed constants to constants.yml under a new section titled `"/my-page/"`.
Pages using `PageLayout` are added to site search automatically, and the texts in that section are what search finds the page by.

## New / edited text content

To add new text sections simply go to the relevant section in `constants.yml` and add a new field. Then refer to this field in the relevant React component in `src/components` or the relevant page in `src/pages` depending on what page is being edited.


# Structure

The file begins with some global constants used e.g. for the footer, cookie banner, and the navigation bar.
If new pages are added to the site they need to be added here to the header_nav section for them to show up in the navigation bar.

```yml
title: FiQCI
author: The FiQCI Consortium
copyright: © 2024 The FiQCI Consortium
...

header_nav:
  - title: Home
    page: pages/home.md
  - title: About FiQCI
    page: pages/about.md
  ...

cookie_consent:
  title: We Use Cookies
  chapters:
  ...
```

After the global constants the contents are split so that each page has its own section denoted by page url:

```yml
"/":
  ...

"/access/":
  ...

"/about/":
  ...

"/status/":
  ...

...
```

Each section contains static text content, link urls, image paths, etc. that the page is using.

## Home

```yml
"/":
  hero: #content of the hero component (the initial content visible on the main page)
    tagline: Making the power of quantum computing accessible
    subtitle: FiQCI – Finnish quantum-computing infrastructure
    announcement: #the orange announcement box
      text: Access to the Aalto Q20 Quantum Computer is currently being rolled out! See the CSC Quantum Computing docs for more info.
      link:
        title: CSC Quantum Computing docs
        href: "https://docs.csc.fi/computing/quantum-computing/overview/"
    buttons: #navigation buttons under the announcement
      - title: How to get access
        href: "/access"
      - title: Blogs and Instructions
        href: /publications
      - title: About FiQCI
        href: "#about"

  mission: #Links for the FiQCI mission section. Note that the mission text on the main page is the same as on the about page and hence comes from /about/ section of this file
    links:
      about:
        title: Read more about FiQCI
        href: /about
      access:
        title: How to get access
        href: /access

  access_cards: #resource access cards under the hero content
    - title: Quantum computers
      href: /access/#quantum
      teaser: /assets/images/vtt-images/VTT_lab-2.webp
      description: |-
        The Finnish quantum-computing infrastructure (FiQCI) provides access to quantum computers
        through the LUMI supercomputer environment. ...
      links:
        - title: Quantum computer resources
          href: /access/#quantum
    ...
```

The "Blogs and Instructions" and "Events" cards on the front page show the newest publications and events automatically.

## Access

```yml
"/access/":
  getting_started: #text and link at the top of the page
    text: |-
      For getting started see the
    link:
      title: CSC Quantum Computing docs.
      href: https://docs.csc.fi/computing/quantum-computing/overview/

  alerts: #see New alert
    - text: |-
        Access to LUMI-Q VLQ is coming soon!
      type: info

  quantum_resources: #list of the available quantum computers, see New Quantum Computer
    - name: Aalto Q20
      ...

  supercomputer_resources: #list of the available supercomputer resources
    - name: LUMI
      desc: |-
        Presently the backbone of the classical HPC and AI resources in FiQCI. ...
      image: "/assets/images/FiQCI-banner.webp"
      links:
        - link: "https://docs.lumi-supercomputer.eu/"
          teaser: "How to access Lumi"
          icon: mdiArrowRight
        - link: "https://www.lumi-supercomputer.eu/"
          teaser: "Read more about LUMI (LUMI website)"
          icon: mdiOpenInNew

  emulation_resources: #list of the available emulation / simulation resources
    - name: Quantum emulation with LUMI
      ...
```

## About

```yml
"/about/": #static text for the about page
  desc: |-
    The Finnish Quantum-Computing Infrastructure (FiQCI) was established in 2020, ...

  mission: |- #also shown on the front page
    The mission of FiQCI is to provide state-of-the-art quantum-computing services ...

  maintain: |- #also shown on the front page
    FiQCI is jointly maintained, operated, and developed by VTT, Aalto University, and
    CSC - IT Center for Science.

  advisory-group: #advisory group
    desc: |-
      The Scientific and Technical Advisory Group (STAG) provides input for the operation
      of the infrastructure. The current (2023) members of the STAG are:
    people:
      - name: Dr. Valeria Bartsch
        institution: Fraunhofer Institute for Industrial Mathematics
        country: Germany
      ...

    management:
      people:
        - name: Dr. Mikael Johansson
          institution: CSC
          title: FiQCI director
        ...

    acknowledgement:
      desc: |-
        When publishing the results that utilise the FiQCI infrastructure, users should acknowledge ...
      acknowledge-link-url: /resource-call
      acknowledge-link-text: see here
```

## Status

```yml
"/status/":
  info: Here you can find the status of the Quantum Computers connected to LUMI.
  lumi:
    desc: Additionally you can view upcoming LUMI service breaks
    link:
      title: here
      href: https://www.lumi-supercomputer.eu/lumi-service-status/
  alerts: #see New alert
    - text: Check out the new "Tools" section for FiQCI tools and example notebooks.
      type: info
      link: "#tools"
  tools: #see New tool
    - name: FiQCI-EMS
      ...
  quantum-computers: #devices shown on the status page, see New Quantum Computer
    - name: VTT Q50
      qubits: 53
      basis: "PRX, CZ"
      topology: "Square grid"
      pulse: "True"
      device_id: "Q50"
    ...
```

The live status and calibration data of the devices is fetched in the browser from the FiQCI status backend.

## Cookies

```yml
"/cookies/": #cookie policy of FiQCI
  title: Cookie Policy
  ...
```

The site currently has no cookie policy page, so this section is not shown anywhere.

## Accessibility

```yml
"/accessibility/": # Accessibility statement
  title: Accessibility Statement
  desc: |-
    This is the accessibility statement for FiQCI, accessible from /accessibility/.
    Updated on 19.6.2025

  general:
    - The FiQCI website is designed to be accessible to all users. ...

  status:
    title: Compliance Status
    desc: |-
      Meets all critical accessibility requirements.

  complaint: #info on how to complain
    title: Reporting Accessibility Issues
    desc: |-
      If you notice accessibility problems on the website, ...
    link: #Traficom contact link
      title: Regional State Administrative Agency for Southern Finland
      href: https://www.saavutettavuusvaatimukset.fi/en/user-rights/submit-complaint-web-accessibility-or-request-clarification

    contact: #Traficom contact info
      title: Supervisory Authority Contact Information
      info:
        name: Liikenne- ja viestintävirasto Traficom
        division: Digitaalisen esteettömyyden ja saavutettavuuden valvontayksikkö
        web: www.saavutettavuusvaatimukset.fi
        email: saavutettavuus@traficom.fi
        phone: 029 534 5000
```

## Others

If content is not in the constants.yml file it is either in a relevant React component in `src/components` or in a page file in `src/pages`.
