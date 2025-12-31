export default function LogoOpenTheDoor({
  size = 48,
  showText = true,
}: {
  size?: number;
  showText?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        color: "var(--fg)",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* 外框：系统容器 */}
        <rect
          x="14"
          y="14"
          width="92"
          height="92"
          rx="18"
          stroke="currentColor"
          strokeWidth="4"
        />

        {/* 门板 */}
        <rect
          x="34"
          y="26"
          width="32"
          height="68"
          rx="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        />

        {/* 门缝：入口感 */}
        <path
          d="M74 30 V90"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.35"
        />
      </svg>

      {showText && (
        <div style={{ lineHeight: 1 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.18em",
              whiteSpace: "nowrap",
            }}
          >
            OPENTHEDOOR
          </div>
        </div>
      )}
    </div>
  );
}
