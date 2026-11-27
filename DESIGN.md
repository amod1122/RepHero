# RepHero Design

## Visual Direction

The RepHero site uses an editorial, high-contrast visual language inspired by the attached reference site: near-black navy, cobalt light, generous white space, and restrained typography. The homepage hero is a full-bleed WebGL Beams canvas with the message set directly over the light. Product information sits in a bright white body with thin rules, large serif headings, and minimal interface chrome.

## Colors

| Role | Value |
| --- | --- |
| Deep navy | `#030816` |
| Navy | `#071A36` |
| Cobalt | `#4B9CFF` |
| Ink | `#050A14` |
| White | `#FFFFFF` |
| Ice | `#F6F8FB` |
| Pale blue | `#DBEAFF` |
| Blush | `#F7DCE8` |
| Peach | `#FFE6DD` |
| Slate | `#667085` |
| Rule | `#DCE3EC` |

## Typography

Cormorant Garamond is the display face for editorial headlines and large figures. DM Sans is used for navigation, body copy, labels, forms, and controls. Letter spacing remains neutral.

## Layout

The desktop container is 1440px with 64px gutters. The hero is full-bleed and approximately one viewport tall. Editorial sections use asymmetrical 12-column grids, full-width rules, and generous vertical spacing. Mobile layouts collapse to one column with 16px gutters.

## Motion

The hero Beams canvas runs its authored intro and responds to pointer movement. Scroll entrances use restrained, critically damped springs with no bounce. Motion is reduced when `prefers-reduced-motion` is active. Material transparency is removed when `prefers-reduced-transparency` is active.

## Interaction and Accessibility

Controls have visible keyboard focus. Interactive targets are at least 44px tall. FAQ and calculator behavior remains available without animation, and booking forms continue to warn visitors not to submit protected health information.
