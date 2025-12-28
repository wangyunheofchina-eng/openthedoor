export default function LogoOpenTheDoor({ size = 88 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", color: "var(--fg)" }}>
      <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect
          x="44"
          y="32"
          width="72"
          height="136"
          rx="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        />
        <rect
          x="120"
          y="40"
          width="26"
          height="120"
          rx="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        />
      </svg>

      <span
        style={{
          fontSize: "20px",
          letterSpacing: "0.14em",
          fontWeight: 500,
          color: "currentColor",
          whiteSpace: "nowrap",
        }}
      >
        OPENTHEDOOR
      </span>
    </div>
  );
}
