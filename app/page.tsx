import LogoOpenTheDoor from "../components/LogoOpenTheDoor";
import ThemeToggle from "../components/ThemeToggle";
import SearchBar from "../components/SearchBar";
import ToolCarousel from "../components/ToolCarousel";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh" }}>
      {/* 左上角品牌区 */}
      <header style={{ position: "absolute", top: "40px", left: "48px" }}>
        <LogoOpenTheDoor size={88} />
      </header>

      {/* 右上角主题切换 */}
      <div style={{ position: "absolute", top: "40px", right: "48px" }}>
        <ThemeToggle />
      </div>

      {/* Hero：视觉中心 */}
      <section
        style={{
          position: "absolute",
          top: "48%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>
          <h1
            style={{
              fontSize: "40px",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              color: "var(--fg)",
              margin: 0,
            }}
          >
            尽有，将有
          </h1>

          <p
            style={{
              marginTop: "12px",
              fontSize: "11px",
              letterSpacing: "0.22em",
              color: "var(--muted)",
            }}
          >
            ALL THAT IS. ALL TO COME.
          </p>

          <SearchBar />

          {/* 工具轮播画廊 */}
          <ToolCarousel />
        </div>
      </section>
    </main>
  );
}
