export interface HomeScrollState {
  /** 0 at the top of the page, 1 once the hero has scrolled away. */
  heroProgress: number;
  /** 0..1 through the pinned range section. */
  rangeProgress: number;
  /** Continuous product index (0 = first product centred, 2 = last). */
  cursor: number;
  onRangeLeave?: (left: boolean) => void;
}

/** Each product owns an equal slice of the range scroll; the first 30% of a slice is the hand-over. */
export function cursorFromProgress(p: number, n: number): number {
  const slice = 1 / n;
  const i = Math.min(n - 1, Math.floor(p / slice));
  if (i === 0) return 0;
  const local = (p - i * slice) / slice;
  const x = Math.min(1, Math.max(0, local / 0.3));
  const eased = x * x * (3 - 2 * x);
  return i - 1 + eased;
}
