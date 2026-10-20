type P = { size?: number; className?: string; strokeWidth?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: "false" as const,
});

export function IconHome({ size = 20, strokeWidth = 1.3 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />
    </svg>
  );
}

export function IconGrid({ size = 20, strokeWidth = 1.3 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </svg>
  );
}

export function IconHeart({ size = 20, strokeWidth = 1.3, filled = false }: P & { filled?: boolean }) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} fill={filled ? "currentColor" : "none"}>
      <path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 3C19.5 15.4 12 20 12 20z" />
    </svg>
  );
}

export function IconSparkle({ size = 20, strokeWidth = 1.3 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 3.5c.6 4.4 2.6 6.4 7 7-4.4.6-6.4 2.6-7 7-.6-4.4-2.6-6.4-7-7 4.4-.6 6.4-2.6 7-7z" />
    </svg>
  );
}

export function IconSearch({ size = 20, strokeWidth = 1.3 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export function IconBag({ size = 20, strokeWidth = 1.3 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M5.5 8h13l-1 12h-11z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  );
}

export function IconBagLines({ size = 20, strokeWidth = 1.3 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M6 8h12l-.9 11.5h-10.2z" />
      <path d="M9.2 8V6.2a2.8 2.8 0 0 1 5.6 0V8" />
      <path d="M9.4 12.4v3.2M14.6 12.4v3.2" />
    </svg>
  );
}

export function IconMenu({ size = 20, strokeWidth = 1.3 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 8h16M4 16h16" />
    </svg>
  );
}

export function IconClose({ size = 20, strokeWidth = 1.3 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconArrowRight({ size = 16, strokeWidth = 1.4 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconArrowUpRight({ size = 16, strokeWidth = 1.4 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function IconArrowLeft({ size = 16, strokeWidth = 1.4 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M20 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function IconPlus({ size = 16, strokeWidth = 1.4 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconMinus({ size = 16, strokeWidth = 1.4 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function IconChevronDown({ size = 14, strokeWidth = 1.4 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function IconCheck({ size = 18, strokeWidth = 1.6 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="m5 12.5 4.5 4.5L19 6.5" />
    </svg>
  );
}

export function IconStar({ size = 14 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      <path d="m12 3 2.7 5.9 6.3.7-4.7 4.3 1.3 6.1-5.6-3.2-5.6 3.2 1.3-6.1L3 9.6l6.3-.7z" />
    </svg>
  );
}

export function IconTrash({ size = 16, strokeWidth = 1.3 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4.5 7h15M9 7V5h6v2M6.5 7l.8 13h9.4l.8-13" />
    </svg>
  );
}

export function IconPhone({ size = 18, strokeWidth = 1.3 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5z" />
    </svg>
  );
}

export function IconWhatsapp({ size = 18 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      <path d="M12.04 2A9.9 9.9 0 0 0 3.6 16.9L2 22l5.25-1.56A9.9 9.9 0 0 0 22 12.04 9.95 9.95 0 0 0 12.04 2zm0 1.8a8.15 8.15 0 0 1 8.14 8.16 8.14 8.14 0 0 1-12.2 7.04l-.36-.22-3.03.9.92-2.96-.24-.38a8.14 8.14 0 0 1 6.77-12.54zm-3.1 3.9c-.2 0-.5.07-.76.35-.26.28-.98.96-.98 2.34 0 1.39 1 2.72 1.14 2.9.14.19 1.94 3.1 4.75 4.22 2.33.93 2.8.74 3.31.7.5-.05 1.63-.67 1.86-1.32.23-.65.23-1.2.16-1.32-.07-.11-.26-.18-.54-.32-.28-.14-1.63-.8-1.88-.9-.25-.09-.44-.14-.62.14-.19.28-.72.9-.88 1.09-.16.18-.32.2-.6.07-.28-.14-1.17-.43-2.23-1.38-.82-.73-1.38-1.63-1.54-1.91-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.16.19-.28.28-.46.09-.19.05-.35-.02-.49-.07-.14-.62-1.5-.85-2.05-.22-.53-.45-.46-.62-.47z" />
    </svg>
  );
}

export function IconInstagram({ size = 18, strokeWidth = 1.3 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconTelegram({ size = 18, strokeWidth = 1.3 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="m21 4.5-3.2 15.2-5.1-3.9-2.6 2.7-.5-4.4L18.4 6 8.4 13.3 4 11.5z" />
    </svg>
  );
}

export function IconFilter({ size = 18, strokeWidth = 1.3 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 7h16M7 12h10M10 17h4" />
    </svg>
  );
}

export function IconPin({ size = 18, strokeWidth = 1.3 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 21s6.5-6 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

export function IconClock({ size = 18, strokeWidth = 1.3 }: P) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function IconDensity({ size = 18, columns }: P & { columns: number }) {
  const w = 24 / columns;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      {Array.from({ length: columns }).map((_, i) => (
        <rect key={i} x={i * w + 1} y="4" width={w - 2.5} height="16" rx="1" />
      ))}
    </svg>
  );
}
