const TAIWAN_OFFSET_MS = 8 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function taiwanDay(d: Date): number {
  return Math.floor((d.valueOf() + TAIWAN_OFFSET_MS) / DAY_MS);
}

export function isPublished(date: Date): boolean {
  return taiwanDay(date) <= taiwanDay(new Date());
}
