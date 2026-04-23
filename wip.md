# todo: items to be completed

- [ ] go through each md file - line breaks, formatting
  - [x] jan
  - [x] feb
  - [ ] mar
  - [x] apr
  - [ ] may
  - [ ] jun
  - [ ] jul
  - [ ] aug
  - [ ] sep
  - [ ] oct
  - [ ] nov
  - [ ] dec
  - [ ] correct AI generated content mistakes
    - [ ] search `*` - the ai's way of italics
    - [ ] ~~`well` vs `we'll` - ai removed~~
    - [ ] `-` ai does not put spaces before and/or after these - use regex to find and review them
- [x] sitemap
- [x] robots
- [ ] favicon?
- [ ] about, etc
- [ ] make it look more like the book?
- [ ] i18n/l10n
  - [ ] see also: src/meditations/meditations.11tydata.js
  - [ ] spell check (en-US to start)
    - [ ] grammar check? but not to change content - for things like `well` vs `we'll` (as ai removed some)
  - [ ] translations
  - [ ] aria-label
  - [ ] page slugs (en: getting-needs-met-march-29, es: ??, de: ??)
- [ ] github stuff
  - [ ] readme
    - [ ] include details of `.env` for local dev vs deployed
  - [ ] landing page details
  - [x] licence
    - [ ] beattie
  - [x] minify etc
  - [ ] add to digital scrapbook
  - [x] seeing new `Benchmark    886ms  62% 135056× (Configuration) "url" Nunjucks Filter` line in build process - investigate
- [ ] ux
  - [ ] review html semantics, main, article, aside
  - [ ] images etc
  - [ ] favicon
- [ ] aria/a11y stuff
- [ ] feats
  - [ ] like/share etc? <https://www.aa.org/daily-reflections>
  - [ ] search
  - [ ] index, like the book, but also with dates
    - [ ] bibliography - quotes

---

Yes. The clearest duplicate is the adjacent-meditation navigation logic we now have in both:

src/layouts/meditation.njk
src/index.njk
That duplication includes:

the meditation-nav markup
the JSON data block for meditation nav items
the leap-year-aware previous/next selection logic
the DOM rendering for the nav links
There’s also a smaller duplicate in date-slug generation:

src/meditations/meditations.11tydata.js
scripts/sync-meditation-title-aliases.js
Both turn MM.DD into the same lowercase month-day slug format.

I didn’t spot widespread duplication beyond that. If you want, I can do a quick cleanup pass next and extract the nav into a shared include plus move the date-slug helper into one reusable module.
