type LogoIconProps = {
  size?: number;
};

export default function LogoIcon({ size = 24 }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* 门框 */}
      <rect
        x="8"
        y="6"
        width="20"
        height="36"
        rx="2"
        stroke="#111"
        strokeWidth="2.5"
      />
      {/* 打开的门 */}
      <path
        d="M28 8 L38 12 V36 L28 40 Z"
        stroke="#111"
        strokeWidth="2.5"
        fill="none"
      />
    </svg>
  );
}
