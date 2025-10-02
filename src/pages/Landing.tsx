import * as React from "react";
import { Link } from "react-router-dom";
import ghigo from "@/assets/ghigo.png";
import ParticlesNet from "@/components/ParticlesNet";

export default function Landing() {
  return (
    <main className="relative min-h-screen h-dvh overflow-hidden">
      {/* --- BASE GRADIENT (sotto a tutto) --- */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900" />

      {/* --- STARS FAR (pattern rado) --- */}
      <div
        className="fixed inset-0 z-10 opacity-35"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'><g fill='white' fill-opacity='0.18'><circle cx='20' cy='30' r='1.1'/><circle cx='80' cy='60' r='1.0'/><circle cx='150' cy='40' r='1.2'/><circle cx='190' cy='120' r='1.1'/><circle cx='60' cy='170' r='1.0'/><circle cx='30' cy='200' r='1.1'/><circle cx='170' cy='90' r='1.05'/><circle cx='110' cy='130' r='1.1'/></g></svg>\")",
          backgroundSize: "220px 220px",
        }}
      />

      {/* --- STARS NEAR (più dense) con twinkle leggero --- */}
      <div
        className="fixed inset-0 z-20 opacity-50 animate-pulse"
        style={{
          animationDuration: "4s",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'><g fill='white' fill-opacity='0.24'><circle cx='12' cy='18' r='1.2'/><circle cx='36' cy='62' r='1.0'/><circle cx='70' cy='28' r='1.1'/><circle cx='118' cy='88' r='1.15'/><circle cx='52' cy='116' r='1.0'/><circle cx='24' cy='134' r='1.1'/><circle cx='100' cy='44' r='1.05'/><circle cx='84' cy='98' r='1.1'/></g></svg>\")",
          backgroundSize: "140px 140px",
        }}
      />

      {/* --- PARTICLES NETWORK (pallozzi + linee) --- */}
		<ParticlesNet
	  className="fixed inset-0 z-30 pointer-events-none"
	  // rete
	  linkDist={170}
	  maxSpeed={1.5}
	  // dimensioni / distribuzione
	  minR={1.4}
	  maxR={1.7}
	  bigRatio={0.14}
	  bigScale={3.6}
	  // coesione
	  attract
	  attractRadius={240}
	  attractStrength={0.0001}
	  // “sbalzo” al passaggio mouse
	  retreatMode="burst"
	  retreatRadius={260}
	  burstIntensity={18}   // ↑ per più “sparo” (18–26)
	  burstMaxSpeed={3.2}  // velocità massima durante il burst
	  // resa
	  dprCap={2}
	  useGlow
	  useScreenBlend
		/>


      {/* --- LOGO GHIGUS (sempre → /dashboard) --- */}
      <header className="absolute left-6 top-5 z-50">
        <Link to="/dashboard" className="flex items-baseline gap-2 group">
          <span className="text-4xl md:text-5xl font-extrabold tracking-tight gh-gradient-text">
            GHIGUS
          </span>
          <span className="text-[10px] leading-none px-1.5 py-[2px] rounded-full border border-slate-700 text-slate-300 group-hover:border-slate-500 transition">
            Beta
          </span>
        </Link>
      </header>

      {/* --- HERO centrata --- */}
      <section aria-labelledby="ghigus-hero" className="relative z-40 h-full">
        <div className="h-full mx-auto max-w-7xl px-6">
          <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Sinistra: immagine cane in cerchio + glow */}
            <div className="flex justify-center md:justify-start">
              <div className="relative aspect-square max-w-[480px] w-full">
                <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle_at_40%_30%,rgba(139,92,246,.22),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(56,189,248,.18),transparent_60%)] blur-3xl" />
                <img
                  src={ghigo}
                  alt="Logo Ghigus (cane)"
                  loading="eager"
                  className="w-full h-full object-cover rounded-full ring-2 ring-slate-600 shadow-2xl"
                />
              </div>
            </div>

            {/* Destra: titolo + copy + powered + CTA */}
            <div className="text-center md:text-left">
              <h1
                id="ghigus-hero"
                className="text-6xl md:text-7xl lg:text-9xl font-extrabold tracking-tight gh-gradient-text"
              >
                GHIGUS
              </h1>

              <div className="mt-3 h-1 w-24 md:w-28 bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-300 rounded-full mx-auto md:mx-0" />

              <p className="mt-6 text-lg md:text-3xl text-slate-200/95 max-w-[48ch] md:pr-10 mx-auto md:mx-0 leading-relaxed">
                <span className="text-white font-semibold">Un software semplice per la </span>
                <span className="text-white font-semibold">creazione e </span>
                <span className="text-white font-semibold">rielaborazione del tuo prossimo CNC</span>
              </p>

              <div className="mt-3">
                <span className="inline-block text-[11px] md:text-xs uppercase tracking-[0.18em] text-sky-300/90">
                  Powered by AI
                </span>
              </div>

              <div className="mt-8">
                <Link
                  to="/dashboard"
                  aria-label="Avvia la prova"
                  className="btn-primary inline-flex justify-center min-w-[220px]"
                >
                  AVVIA LA PROVA
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
