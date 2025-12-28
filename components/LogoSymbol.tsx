export default function LogoSymbol({
  size = 160,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 主圆 */}
      <circle
        cx="100"
        cy="100"
        r="78"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />

      {/* 右上小圆 */}
      <circle
        cx="138"
        cy="58"
        r="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
      />

      {/* 底部不规则流体块 */}
      <path
        d="
          M70 125
          C85 145, 115 150, 135 130
          C120 135, 95 135, 70 125
          Z
        "
        fill="currentColor"
      />
    </svg>
  );
}
