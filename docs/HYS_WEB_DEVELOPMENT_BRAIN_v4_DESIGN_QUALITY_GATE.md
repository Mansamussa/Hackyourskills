# HYS Web Development Brain — Design Quality Gate v4
Date: 2026-10-09
Source inspiration: https://github.com/emilkowalski/skills (MIT). Adapted HYS standard, not an Apple endorsement.

## Mandatory build protocol
1. Read client brief, brand, assets, business objective, previous corrections and rejected styling. Preserve those decisions.
2. Analyze requested reference websites with measured hierarchy: desktop/mobile viewport composition, grid, spacing, type, image crop, nav, transitions, story flow, CTA. Mark unverified assumptions.
3. Define art direction BEFORE coding: distinctive visual thesis, hero composition, photography strategy, type scale, rhythm, palette, conversion path. When ambiguous, compare two or three materially different compositions internally and select the strongest.
4. Build a deliberate mobile composition as well as desktop. Test 360, 390, 430, 768, 1024, 1440 widths. Preserve HYS desktop 67% composition heuristic; keep CTA above intended fold where appropriate. No diagonal/slanted arrows.
5. Apply Apple-inspired principles selectively: instant input feedback, interruptible spring movement for gesture interactions, velocity continuity, symmetric interaction paths, anchored origins, restrained materials, typographic optical sizing/tracking/leading. No default glass navbar; use translucency only when legible and justified.
6. Apply Emil motion criteria: animate only to provide feedback, state, explanation, spatial consistency or a meaningful narrative. Prefer transform/opacity, fast controls, purposeful long-form marketing scroll; respect reduced-motion and reduced-transparency; do not trap scroll.
7. Break UI deliberately: extended copy, absent images, slow loads, 200% zoom, keyboard, touch, long translations, browser viewport chrome, safe areas, broken links and invalid forms.
8. Run browser-level visual QA and screenshot comparison at specified widths, inspect actual rendered pixels, and use Playwright/browser tests when accessible. Never report tests that were not run.
9. Fix all hard failures before presenting a polished first pass. Log evidence, screenshots, scoring and unresolved risks.
10. For existing sites, perform a read-only audit first; do not redesign or deploy changes without a site-specific request.

## QA scoring (internal design rubric)
- Art direction, brand specificity, reference fidelity: 25
- Composition, photography, typography, spacing: 20
- Mobile and responsive: 20
- Business clarity, truthful content, conversion journey: 15
- Motion, touch and accessibility: 10
- Functional and technical reliability: 10
Target >=90/100 and ALL hard gates passed before labeling build polished; if live render cannot be reviewed, mark UNVERIFIED rather than assigning pass.
Hard fail: wrong identity, broken mobile or image, unusable CTA, deceptive claims, exposed secrets, inaccessible core journey, trapped scrolling, missing reduced-motion fallback for intensive movement.

## Delivery
Provide what changed, relevant reference decisions, screenshots/viewport checks if actually captured, QA findings with evidence, remaining risks and next actions. Do not replace client-specific design language with a uniform Apple aesthetic.

## Skill priority
Always: apple-design, emil-design-eng, prototype, mobile-native, break-ui, Taste, Impeccable/Awesome Design, UI/UX Pro Max, existing HYS design specifications.
When needed: Scroll Craft, animate, review-animations, improve-animations, find-animation-opportunities, Playwright.
