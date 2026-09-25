import type { SVGProps } from "react";

const paths = {
  "arrow-right": "M4 12h16m-6-6 6 6-6 6",
  "arrow-up-right": "M6 18 18 6M6 6h12v12",
  "chevron-right": "m9 5 7 7-7 7",
  "chevron-left": "m15 5-7 7 7 7",
  "chevron-down": "m5 9 7 7 7-7",
  check: "m5 12 4 4L19 6",
  clock: "M12 8v4l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  message: "M21 11.5a8.5 8.5 0 0 1-8.5 8.5H3l1.5-4A8.5 8.5 0 1 1 21 11.5ZM8 10h8m-8 4h5",
  sparkles: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4m-2-2h4",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm4-3.87a4 4 0 0 1 0 7.75",
  calendar: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 10h2m4 0h2m-8 4h2",
  shield: "m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-5",
  refresh: "M3 10a9 9 0 0 1 15-6l3 3M21 3v4h-4m4 7a9 9 0 0 1-15 6l-3-3m0 4v-4h4",
  search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  mail: "m3 5 9 7 9-7M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
  phone: "M8 3H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-4l-5-2-2 3a14 14 0 0 1-7-7l3-2-2-5Z",
  grid: "M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z",
  sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0",
  moon: "M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z",
  close: "m6 6 12 12M6 18 18 6",
  plus: "M12 5v14M5 12h14",
  "check-circle": "m7 12 3 3 7-7M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, ...props }: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d={paths[name]} />
    </svg>
  );
}
