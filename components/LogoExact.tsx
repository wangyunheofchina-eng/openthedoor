export default function LogoExact({
  size = 180,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 主圆 */}
      <circle
        cx="150"
        cy="150"
        r="115"
        fill="none"
        stroke="#111"
        strokeWidth="3"
      />

      {/* 右上小圆（粗描边，贴边） */}
      <circle
        cx="225"
        cy="95"
        r="28"
        fill="none"
        stroke="#111"
        strokeWidth="8"
      />

      {/* 底部有机流体块 */}
      <path
        d="
          M95 195
          C115 225, 185 230, 210 195
          C190 205, 140 205, 95 195
          Z
        "
        fill="#111"
      />
    </svg>
  );
}
