# Validation

- All four HTML routes retained, including the confirmation quiz and legal drafts.
- Main-page pricing text matches the supplied original exactly.
- Original form provider and POST action preserved. Main form gets persistent field labels and a same-version confirmation destination.
- JavaScript syntax passes for both new scripts and all retained inline scripts.
- Internal HTML links, fragment targets, aria-controls, image variants, and CSS asset references checked.
- CSS local URL checking excludes data URIs and encoded fragment references.
- Optimized delivery imagery totals 708,448 bytes. Supplied originals remain available in the source.
- Reduced motion makes all entry content visible and disables translated imagery. Motion does not capture scroll or pointer input.
- Browser visual checks and actual form submissions were not performed. The Sites environment does not allow browser QA for this request. Provider acceptance and mail delivery remain unconfirmed.
- Existing privacy and terms pages remain drafts with their original wording and placeholders; this task does not validate their legal contents.
- Optional Scrollcraft generation prerequisites are absent (Chrome diagnostic executable, Kie key). No generation was needed; supplied imagery was reused.

## Image-strip revision

Restored three equal desktop columns, equal image heights, original over-image green captions and vertical caption rules. Mobile uses the original single-column arrangement. Replaced this strip’s independent parallax with a reversible 20px scroll-linked fade using untransformed offsets. Motion reverses through the entry interval on upward scrolling. Reduced-motion and no-JavaScript states leave the cards visible. JavaScript syntax, whitespace checks and all three local image references pass. Browser visual checks were not run.

## Hover restoration

Restored the original 6px card lift, 1.05 image zoom, stronger shadow, subtle overlay tint, and 8px caption-text movement. Hover uses a separate translate property so the scroll transform stays intact. Fine-pointer hover only; reduced-motion remains static. Markup and whitespace checks pass. No browser visual checks performed.

## Objective highlight

Applied a dark-green background, 4px signal-green left border, rounded right corners, green Objective label, and a separator above each of the three service objective blocks. Mobile padding and typography adjusted. All three existing blocks share the same styling; copy is unchanged. Whitespace and element-count checks pass. No browser visual checks performed.

## Methodology initials

Replaced 01–04 with L, F, T, C for Leak, Fix, Thinking and Changes. The four-column green band now uses large initials, fine separators, stronger headings, supporting text, subtle hover lifts, animated underline accents and staggered entry reveals. Tablet and phone use two equal columns. Reduced-motion and no-JavaScript content remains visible. Letter mapping, list markup and whitespace checks pass. Browser visual checks were not performed.

## Eight-stage hero line animation

Reuses the supplied hero image in five masked layers: funnel, connecting signal, upper-right orbit, lower-right block and growth line. The sequence follows eight continuous scroll stages and reverses at the same positions. Desktop uses a native sticky stage with 1,400–2,400px of scroll travel; smaller screens use a shorter unpinned sequence. Copy taller than the viewport and reduced-motion preferences disable pinning. On phones the complete artwork fits horizontally. No wheel handlers, scroll capture, looping animation, new imagery or dependencies were added. The original background remains the image-loading/no-JavaScript fallback. Headline, navigation and CTA remain semantic HTML.

Source-level checks cover eight timeline boundaries, reverse traversal, overscroll clamping, reduced-motion changes, shorter mobile timing and the oversized-content guard. JavaScript syntax, hero nesting, local assets, duplicate IDs and whitespace checks pass. The scroll and hover behavior elsewhere is retained. Browser visual checks were not performed under the Sites environment's rules; appearance has not been visually verified.

## Hero green-line refinement

Tinted the existing hero line masks with the brand's exact #ADDB66 via an SVG filter. A persistent green base keeps the shapes visible before their brighter scroll reveal. Replaced screen blending with normal alpha compositing so the white source strokes do not wash out the green. Increased peak reveal opacity to 1, settling to .88. The eight-stage timing and responsive pinning rules are unchanged.

Stroke weight targets 1.25x alpha coverage for nominal one-source-pixel lines, using a dilated alpha mask blended at a size-dependent weight. This is an approximation for the supplied flattened image, which has varying line widths and antialiasing. The artwork itself is neither enlarged nor redrawn. JavaScript syntax, filter references, theme color, asset references and whitespace checked. Browser appearance was not visually verified.

## Correction: color only the scroll tracing light

Restored the unfiltered original hero image at its previous desktop .86 and mobile .72 opacity. The #ADDB66 filter and approximately 25% stroke-weight adjustment now apply exclusively to the five scroll-controlled tracing layers. Removed the persistent green treatment from the background. At the initial scroll position and with reduced motion, only the original artwork appears. The scroll timeline and all other sections are unchanged. Source checks confirm that the color filter is scoped only to .hero-trace. Browser appearance was not visually verified.

## Restore first white tracing effect; reveal hero copy on scroll

Restored the exact background, masks, screen blending, brightness and contrast from version 10 (17a9e0d), removing the green filter and thickness adjustments. The same eight-stage scroll timeline now reveals the eyebrow, each of the three headline lines, every naturally wrapped supporting-text line, reassurance and footnotes with staggered fades and small upward movement. Supporting lines are measured again when fonts or viewport dimensions change, preserving the original text and paragraph semantics.

The audit CTA enters from 48px left; a secondary “See how I find the leak” link to the existing scenarios section enters from 48px right. Phone travel is 32px. Both reverse with scrolling. Keyboard focus immediately exposes either button; unrevealed controls ignore pointer input. No-JavaScript and reduced-motion states show all content. Short desktop screens use tighter hero padding and type to accommodate the sequence; oversized copy still disables pinning.

Source-level checks passed for ordered text entrances, complete final visibility, left/right button movement, exact reverse traversal, reduced motion, mobile line rewrapping, text preservation, original white-effect CSS equality, link destinations, local assets and syntax. Browser visual checks were not performed.

## Centered HYS opening (selected option 3)

Added the supplied high-resolution transparent HYS logo and its existing embedded tagline at the center of the opening hero, with a small “Scroll to explore” cue and a thin vertical rule below. Logo width is capped at 680px on desktop and uses 88% of the phone width. The introduction fades and contracts by 2.5% during the first scroll beat. The existing text sequence follows it and finishes within the same eight-stage span; the white tracing sequence and opposing button entrances are retained.

The brand introduction is decorative and does not intercept input. With reduced motion or without the motion script, the normal complete hero remains readable. Source-level checks confirm visible opening branding, the fade into the headline, full final copy/button visibility, reversal at the top, the reduced-motion fallback, local assets and the unchanged white tracing timeline. Browser visual checks were not performed.

## Restore dark methodology cards

Restored the reference's dark strip and four rounded dark cards, white headings and muted supporting text. The numbered badges remain removed. Each card has a theme-green #ADDB66 underline that fills with native scrolling and reverses upward; hover completes the line and adds a small lift, scale and shadow. Existing entry fades are retained. Desktop has four columns, tablet two, and phones one. Reduced motion displays full static underlines.

Source checks passed for the four original titles, absence of numbers, green underline styling, forward/reverse progress at four/two/one-column layouts, reduced motion and JavaScript syntax. The approved hero HTML, script and styles are unchanged. Browser visual checks were not performed.

## Methodology hover-bar correction

Removed the scroll-progress controller that left the first cards filled and the final card partly filled. All four bars now have zero scale and zero opacity at rest, then extend to the full card width on hover with a 480ms eased sweep and a restrained green glow. Mouse leave returns the bar to its hidden state. Reduced motion uses the same hidden/resting and visible/hover states with the existing global near-instant transitions. Card styling, entry reveals and the approved hero are retained. Source checks confirm a single shared zero-to-full hover rule, no remaining method-line controller and unchanged hero files/styles. Browser visual checks were not performed.

## Smooth single-open FAQ

Each FAQ list now allows one open answer at a time. Opening a question closes the previous one; selecting the active question closes it. Answers expand and collapse using a 440ms grid-row transition with natural content height, a restrained opacity fade, and a 360ms plus-icon rotation. The implementation reverses CSS transitions on rapid input without animation timers or guessed maximum heights. Reduced motion removes the answer transition. Progressive enhancement retains the existing no-JavaScript answer fallback.

Question buttons retain native keyboard operation and aria-controls/label relationships. aria-expanded, aria-hidden and inert are synchronized with the selected answer. Layout measurements refresh when the height transition completes. Checks passed for initial state, exclusive opening, closing the active item, rapid switching, hidden-answer accessibility state and all seven question/answer relationships. The approved hero and methodology cards are unchanged. Browser visual checks were not performed.

## Softer service-panel opening and closing

The three service panels now expand and collapse over 700ms with a gentle acceleration and deceleration, replacing the immediate display toggle. Content fades in over 560ms after a 60ms delay and fades out over 480ms. The arrow turns over the same 700ms as the panel. A clipped inner wrapper preserves the existing content grid, mobile spacing and objective highlight while allowing the panel to collapse completely to zero height.

One service remains open at a time; clicking the active service closes it. Native CSS transitions reverse during rapid input without timers or fixed maximum heights. Expanded, hidden and inert states stay synchronized, and ScrollCraft measurements refresh when the sizing transition finishes. Reduced motion removes these transitions; no-JavaScript content remains available.

Source checks passed for initial state, exclusive opening, closing, rapid switching, independent accordion groups, accessibility relationships, final layout refresh and the three preserved content blocks. JavaScript syntax and whitespace checks passed. Other page markup and the hero, FAQ and methodology styles remain unchanged. Browser visual checks were not performed.
