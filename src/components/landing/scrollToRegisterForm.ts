/**
 * Scrolls so the bottom registration card is fully visible (same math as hero waitlist handoff).
 */
export function scrollToRegisterForm(reduceMotion: boolean): void {
  if (typeof window === "undefined") {
    return;
  }
  const form = document.getElementById("register-form");
  const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";
  if (form == null) {
    document.getElementById("register")?.scrollIntoView({
      behavior,
      block: "start",
    });
    return;
  }
  const r = form.getBoundingClientRect();
  const docTop = r.top + window.scrollY;
  const docBottom = r.bottom + window.scrollY;
  const vh = window.innerHeight;
  const headerReserve = 88;
  const bottomPad = 40;
  const formH = docBottom - docTop;
  const pinTop = docTop - headerReserve;
  const fitsWithMargins = formH + headerReserve + bottomPad <= vh;
  const y = fitsWithMargins
    ? pinTop
    : Math.max(0, docBottom - vh + bottomPad);
  window.scrollTo({ top: Math.max(0, y), behavior });
}
