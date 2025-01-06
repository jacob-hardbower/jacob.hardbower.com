# The Personal Website of Jacob Hardbower

This site showcases my accomplishments, skills, and personality through its rendered contents and underlying codebase.

Due to NDAs and intellectual property rights, I'm unable to openly share the repositories of my most representative work. In lieu of those projects I've built this site to showcase how I might architect and work within a more complex and dynamic web app. I would typically build a content-driven site like this with an SSG like 11ty or Astro.

## Process

### Establish a vision

I need a website that communicates my personality, skills, and accomplishments. I want it to be beautiful, concise, and clever.

### Gather resources

Content is queen, which is why I always start a project like this by compiling all of the text, links, and media I want to showcase. Natural groupings of information form which will become sections or pages depending on their volume.

For this site, I've gathered some small blurbs about my hobbies and skills, collected blogs and links to projects, and compiled a list of technical skills I want to demonstrate.

Here's a sampling of those hobbies and interests:

- Rock climbing
- DIY and crafts
- Dogs (My dogs!)
- Music
- Gaming
- Stuff with wheels
- TV & Movies
- Art & Design
- Learning (German, currently)

### Design (Planning)

The next step is to devise an elegant package for the content. I'll need to brainstorm a clever way to communicate the content while also demonstrating a breadth of technical proficiencies. In plain terms, I need to show off, but not too obviously.

Idea one is to pair a section of text about myself with something interactive. This would require some extra creativity.

Idea two is a little more explicit — naming my proficiencies and presenting an example. Easier, but not as cool.

I'll spend some time on some POCs and see what feels right. In this case, I think there's enough promise to execute idea one, so let's continue!

### Design (Structure)

I now have an idea of the scope, and my focus turns towards the packaging.

During the planning phase, I established the shape of my data: introductory blurb + interactive showcase. I'd like to make at least four examples of this pattern. Establishing a shared design and layout creates consistency and cohesion on the page, and allows for additional interests as I creep into new hobbies!

After thinking about concrete design implementations, I select the four ideas that feel the most similar. In no particular order, these are my top picks:

- Rock climbing + Route grader
- Dogs + Crossword puzzle
- Music + Sequencer
- TV/Movies + Recommendation quiz

The end result of this process is a draft of the text and a basic wireframe of the showcase. I want each showcase to take up roughly the same amount of space, which is why I've chosen these four ideas out of the bunch.

### Design (Visual)

I'm always inclined to experiment with visual styles when presented with the opportunity — Working in a corporate setting will have that effect! Because I have wireframes, I can reign in my imagination to find a visual language that works for and with the content.

I'll take an hour or two to seek inspiration, looking at other front-end-folks' sites (usually focusing on layout), print design, and illustrations. Recently, I've put time limits on this step because it can lead to analysis paralysis and more derivative designs. Creativity can be a very rare and precious resource, so I try to take advantage of it when I can.

I love to start with type, color, and shape pairings to find the vibe. From there, I slowly build out a visual language of shape, spacing, and scale. The final result of this step is a complete Figma design of the website. While it's nice to have a phone-sized design, It's much easier to translate a desktop design into mobile than to go the other direction. For this reason, I tend to only make a desktop design in Figma.

### Development (Planning)

Because I have a high-fidelity design, I'm able to make informed decisions about the architecture and structure of the site. I'll start with just the homepage, but but plan to have a blog shortly after. There are sections to be templatized and visual styles to be genericized. There's a lot of interactivity involved in the four modules, so managing complexity and state will be important.

As stated at the beginning of this document, I'd like to use this site to demonstrate the skills I use most in professional settings, so I will be using Vite, Vue.js, and Tailwind. Vite handles local development and building the project. Vue.js is used for easy component development and reactivity. Tailwind provides utility classes and (in my opnion) makes development faster, CSS easier to maintain, and components less cumbersome to write.

### Development (Implementation)

I'll start implementation by getting all the tooling working together — the end result being a hosted build of a Hello World page. Having a working baseline that covers every surface of the project ASAP is key in mitigating headaches down the line.

From here, I build the layout with placeholders for the interactive aspects. I write the HTML based on my desktop-oriented Figma design, as the layouts for desktop tend to be more complex and require more nested structures. I write CSS mobile-first, as it's much more straightforward to move from a columnized design into the grid-like nature of desktop designs.

When approaching the interactive modules, I start by making a static version with HTML and CSS, including all potential states which I'll manually toggle. I can now start thinking about the logic of the modules without having to keep switching contexts between visual and logical.

The end result of this process is the fully implemented design, functioning and hosted.

### Development (Retrospective)

Looking back, I bit off quite a bit of work for the three weeks I gave myself to complete the site, but I met the deadline. I worked with a few new technologies — I'd never touched any audio API before — and I discovered a Chromium bug along the way. While I always have accessibility top-of-mind, there are some areas that I'm sure could be better. I tread on some personally-new ground, so I couldn't always fall back on experience to determine the best approach.

In the end, I'm happy with the product, and reasonably happy with the code. I'd like to spend a bit more time tidying things up. My experience with TypeScript was somewhat limited up to this point, but I feel like this project helped me get a handle on a lot of things I had inklings about.

## Extras: Technical Details of this Website

### Run this site locally

Clone this repository and then install the dependencies.

```sh
npm install
```

Compile and enable hot-reload for development

```sh
npm run dev
```
