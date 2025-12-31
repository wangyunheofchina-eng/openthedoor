import LogoOpenTheDoor from "../components/LogoOpenTheDoor";

export default function Home() {
  return (
    <main className="home">
      <header className="homeHeader">
        <div className="brand">
          <div className="logo" aria-hidden>
            <LogoOpenTheDoor size={40} showText={false} />
          </div>
          <div className="name">OPENTHEDOOR</div>
        </div>
      </header>

      <section className="homeHero">
        <h1 className="title">尽有，将有</h1>
        <p className="slogan">ALL THAT IS. ALL TO COME.</p>
      </section>
    </main>
  );
}
