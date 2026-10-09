# HYS Historical Websites — v4 Retrospective QA Register
Audit created: 2026-10-09.
Status: preliminary issue register based on known HYS project feedback. NOT screenshot/browser verified. No site is awarded a v4 score or claimed fixed.

## Priority and known historical issues
| Project | Evidence from previous build feedback | v4 rule to enforce | Status |
| --- | --- | --- | --- |
| Austin Roofing | Previous mobile composition imbalance and broken image links; concept must display clear independent-concept notice and booking route | Mobile visual QA at 360/390/430; link/image check; 67% desktop fold; verify CTAs | Audit pending |
| AS4Less Landscaping | Previously reported awkward mobile layout and broken image links; user reverted an unsuccessful design reduction | Responsive QA and image integrity; preserve selected concept version | Audit pending |
| Encourager / Queer Parenthood | Repeated navigation alignment, typography inconsistency, text density, hero video/silhouette scroll-grab problems; multiple rejected glass nav iterations | Reference analysis, single-family type system, visual balance, gentle scroll motion, reversal + reduced-motion, nav and mobile checks | Audit pending |
| Anjano Safaris | Scroll-grab video cropping/oversized subjects, incorrect colors, nav persistence/transition complaints | Bound subject/video dimensions, preview every motion state, test scroll interruption and reverse, validate brand palette and all pages | Audit pending |
| HYS own site | Images and deployment consistency previously problematic; GA4 added | Verify build/package assets, every image, preview/deployment parity, navigation, GA consent and page links | Audit pending |
| Regillio's Hair | Hero model realism and sharpness requested; logo/title corrected to Regillio's Hair | High-res source fidelity, mobile focal subject crop, brand identity | Audit pending |
| Verschoma | Prior font/visual and header/nav revisions; round CTAs rejected | Preserve approved styling, cross-width screenshot composition and CTA consistency | Audit pending |
| ZAMAR Muziekschool | Scroll-grab hero video and navbar text legibility requests | Test motion, contrast, responsive navbar, reduced-motion | Audit pending |
| Alpha Omega Rotterdam | Diagonal-arrow prohibition, multi-page structure | Test client-specific identity and icon geometry, complete site navigation | Audit pending |
| Kynd Hair | Parallax and pinned quote section height revisions | Preserve precise section proportions, keyboard-safe scroll, reduced motion | Audit pending |
| Mirada Intelligence | Interactive cards, typography and all image hover requirements | Validate repeatable, consistent pointer interaction without touch hover traps | Audit pending |

## Mandatory follow-up to close audit
1. Retrieve/build each actual source and review rendered desktop/mobile screenshots using Playwright or browser tools.
2. Record evidence URL/commit, screenshot widths, timestamp, broken links/assets and console errors.
3. Score six HYS v4 dimensions only after observation. No invented scores.
4. Rank by risk: broken CTA/images/mobile and accessibility > brand/reference mismatch > animation polish > decorative details.
5. Preserve approved brand decisions; seek client-specific change approval before modifying live websites.
6. Fix with branch/PR and rerun QA; deployment separately authorized.
