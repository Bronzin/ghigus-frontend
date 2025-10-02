import * as React from "react";
import { Link } from "react-router-dom";
import ghigo from "@/assets/ghigo.png";

export default function Landing() {
  return (
    <section
      aria-labelledby="ghigus-hero"
      className="min-h-[70vh] relative overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900"
    >
      {/* decorazioni tenui */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_220px_at_0%_0%,rgba(59,130,246,.08),transparent),radial-gradient(520px_200px_at_100%_0%,rgba(56,189,248,.06),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Sinistra: immagine */}
          <div className="flex justify-center md:justify-start">
            <div className="relative aspect-square max-w-[480px] w-full">
              <img
                src={ghigo}
                alt="Logo Ghigus (cane)"
                loading="eager"
                className="w-full h-full object-cover rounded-full ring-2 ring-slate-600 shadow-2xl"
              />
            </div>
          </div>

          {/* Destra: testo + CTA */}
          <div className="text-center md:text-left">
            <h1
              id="ghigus-hero"
              className="text-5xl md:text-6xl font-extrabold tracking-tight gh-gradient-text"
            >
              GHIGUS
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-300 max-w-prose md:pr-8">
              un software semplice per la creazione e rielaborazione del tuo prossimo CNC
            </p>
            <div className="mt-8">
              <Link
                to="/new"
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
  );
}
