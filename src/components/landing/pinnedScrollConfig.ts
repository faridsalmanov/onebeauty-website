/**
 * Scroll choreography for PinnedScrollStory (GSAP ScrollTrigger + scrub).
 *
 * - `SCROLL_PIN_DISTANCE_MULTIPLIER`: viewport heights mapped to timeline 0→1 while pinned.
 * - Keep `PIN_MEET_IN_START` ≥ `PIN_PROBLEM_FADE_START` + problem fade duration + gap
 *   so Meet never fades in over half-visible “The reality” copy.
 */
export const SCROLL_PIN_DISTANCE_MULTIPLIER = 1.82;

/** Tools start leaving earlier so scroll feels responsive. */
export const PIN_TOOL_EXIT_START = 0.12;

/** Problem block fade — starts after tools are partly in motion. */
export const PIN_PROBLEM_FADE_START = 0.22;

/**
 * Meet block — must start **after** problem tween ends (see problem `duration` in component).
 * ~0.22 + 0.3 + 0.06 gap ≈ 0.58
 */
export const PIN_MEET_IN_START = 0.58;
