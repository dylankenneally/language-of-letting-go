# Plan

The attached PDF contains 366 meditations, one for each day of the year, including leap years.

I would like you to check my assumptions about the structure of the PDF: I believe each meditation:

- starts with a date
- and then a title
- some, but not all, of the meditations then have a quote - which is shown in italics
- then the main content of the meditation is found
- then each meditation ends with a focal point - which is shown in italics

Note that the PDF has text content about page numbers that can be shown in the daily meditations, such as "Page 4" - these should not be in the meditations themselves. I am not interested in the content before the first meditation (January 1st), or after the last meditation (December 31st)

Are my assumptions on the structure correct?

If my assumptions are not correct, can you provide me with insight on the structure?

---

Great, thank you for defining the structure of the PDF.

Next, I would like you to generate 366 markdown files, one for each daily meditation. With the exception of removing the "`Page N` artifacts mid-content" and the "Page breaks within meditations", do not alter the meditation content in any way. I do not need the "Month header pages", TOC or Index - just the 366 daily meditations.

The markdown files should contain front-matter, which should include: `date: <the date>` and `title: <the title>` (in that order). The date & title should only be in the front-matter.

If the daily meditation includes an opening quote, it should be wrapped in a span tag with a class name of "quote". That span should include another span for the quotes attribution with the class name of "quote-attribution". Do not include the em-dash for the attribution. Do not include formatting (such as italics) for either the quote content of the quote attribution. I.e. the quote output should be in the following format

 `<span class="quote">
 the quote content
 <span class="quote-attribution">
 the quote attribution
 </span>
 </span>
`

The focal point should also be in a span tag, with a class name of "focal-point". Do not include formatting (such as italics) for the focal point.

If the main body content of each meditation includes formatting, such as italics or bold, you should maintain the formatting in the generated markdown files.

Each markdown file should be named by the meditation date, in the format `MM.DD.md` where MM is the month (January = 01, December = 12) and DD is the day number.

Please place all 366 markdown files in to a single compressed zip file for me to download.

---

## todo: listed here

- [ ] go through each md file - line breaks, formatting
  - [x] jan
  - [x] feb
  - [ ] mar
  - [ ] apr
  - [ ] may
  - [ ] jun
  - [ ] jul
  - [ ] aug
  - [ ] sep
  - [ ] oct
  - [ ] nov
  - [ ] dec
  - [x] search 'Page '
  - [ ] search `''` - replace with `"`
  - [ ] search `*` - the ai's way of italics
  - [ ] `. . .` ?
  - [ ] `AlAnon` to `Al-Anon` - ai removed
- [ ] markdown formatting is not being respected in nested elements
  - [ ] spans for focal point and quote
  - [ ] is using spans the write approach here?
  - [ ] nb: when resolved, watch out for ux style below - may want to invert italics/non italics, example 0202.md
- [x] next/prev navigation
- [ ] 404 page - with gh pages? - surely it has that feature?
- [ ] sitemap
- [ ] calendar widget
- [x] auto show today
- [ ] slugs are shit
  - [x] remove `meditations`
  - [x] make real date?
  - [ ] have title - redirect?
- [ ] css overall
  - [ ] all css is in base - but sometimes only index or meditation needs it - so its a waste, move css to where it is used? or use a css file
  - [ ] inlined css is in the include files too - why?
- [ ] minify etc
- [ ] light/dark
- [ ] mobile
- [ ] about, etc
- [ ] make it look more like the book?
- [ ] like/share etc?
- [ ] search
- [ ] index, like the book, but also with dates
  - [ ] bibliography - quotes
- [ ] i18n/l10n
  - [ ] see also: src/meditations/meditations.11tydata.js
  - [ ] translations
  - [ ] aria-label
- [ ] github stuff
  - [ ] readme
    - [ ] include details of `.env` for local dev vs deployed
  - [ ] landing page details
  - [x] licence
    - [ ] beattie
  - [x] ci/cd
  - [ ] minify etc
  - [ ] add to digital scrapbook
  - [ ] seeing new `Benchmark    886ms  62% 135056× (Configuration) "url" Nunjucks Filter` line in build process - investigate
- [ ] ux
  - [ ] review html semantics, main, article, aside
  - [ ] images etc
  - [ ] font - bbc app font?
  - [ ] paragraphs - leading gap, not first para
    - [ ] line spacing between them
  - [ ] focal point
    - [ ]  looks like an admonition block, make look like book (italics)
  - [ ] quote
    - [ ] indent sides, italics, quote it caps, right aligned
    - [ ] starting dash
  - [ ] prev/next nav styling
- [ ] arial/a11y stuff
