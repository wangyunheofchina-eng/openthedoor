export default function Logo({
  size = 56,
  withText = true,
}: {
  size?: number;
  withText?: boolean;
}) {
  return (
    <div className="flex items-center gap-5 text-current">
      {/* 开门 Logo（门板空心） */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        aria-hidden
      >
        {/* 门框（实心，稳定） */}
        <rect
          x="5"
          y="3"
          width="7"
          height="18"
          rx="2"
          fill="currentColor"
        />

        {/* 打开的门板（空心，更轻） */}
        <polygon
          points="12,5 20,9 20,15 12,19"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>

      {/* 文字 Logo */}
      {withText && (
        <span className="text-[17px] tracking-[0.28em] font-medium">
          OPENTHEDOOR
        </span>
      )}
    </div>
  );
}
