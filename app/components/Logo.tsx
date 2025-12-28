export function Logo({
  size = 28,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Openthedoor Logo"
    >
      {/* Door frame */}
      <rect
        x="6"
        y="4"
        width="12"
        height="24"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Open door */}
      <path
        d="M18 6L26 8V24L18 26V6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
