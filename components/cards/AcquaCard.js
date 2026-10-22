"use client";

import { useEffect, useState } from "react";

// Un bicchiere standard è conteggiato come 250 ml.
const ML_PER_BICCHIERE = 250;

// Messaggi di incoraggiamento in base alla percentuale di acqua bevuta
// rispetto all'obiettivo del giorno: l'ultimo che "passa" la soglia vince.
const MESSAGGI = [
  { soglia: 0, testo: "Comincia la giornata con un bicchiere d'acqua! 💧" },
  { soglia: 0.01, testo: "Bravo, continua così: un bicchiere ogni ora è un buon ritmo." },
  { soglia: 0.5, testo: "A metà strada! Ancora qualche bicchiere e sei quasi all'obiettivo." },
  { soglia: 0.99, testo: "Ci sei quasi, manca pochissimo!" },
  { soglia: 1, testo: "Obiettivo raggiunto: giornata idratata! 🎉" },
];

function messaggioPer(pct) {
  let scelto = MESSAGGI[0].testo;
  for (const m of MESSAGGI) {
    if (pct >= m.soglia) scelto = m.testo;
  }
  return scelto;
}

export default function AcquaCard() {
  const [data, setData] = useState(null); // { abitudini, log }
  const [creando, setCreando] = useState(false);

  function carica() {
    fetch("/api/habits").then((r) => r.json()).then(setData);
  }

  useEffect(carica, []);

  // L'acqua è un'abitudine come le altre (vedi schermata Abitudini): se non
  // esiste ancora (assistente nuovo o abitudine rimossa a mano) la si crea
  // con un obiettivo standard di 8 bicchieri al giorno.
  async function attivaAcqua() {
    setCreando(true);
    try {
      await fetch("/api/habits/definizioni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: "Acqua", tipo: "contatore", obiettivo: 8, colore: "#2c9d9d" }),
      });
      carica();
    } finally {
      setCreando(false);
    }
  }

  if (!data) {
    return (
      <section id="section-acqua" className="card">
        <h3>Acqua</h3>
      </section>
    );
  }

  const habit = data.abitudini.find(
    (h) => h.tipo === "contatore" && h.nome.trim().toLowerCase() === "acqua"
  );

  if (!habit) {
    return (
      <section id="section-acqua" className="card">
        <h3>Acqua</h3>
        <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 10 }}>
          Tieni traccia di quanta acqua bevi durante la giornata e ricevi un piccolo incoraggiamento.
        </p>
        <button
          type="button"
          onClick={attivaAcqua}
          disabled={creando}
          style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontWeight: 700, cursor: "pointer" }}
        >
          {creando ? "…" : "Attiva"}
        </button>
      </section>
    );
  }

  const bicchieri = data.log[habit.id] || 0;
  const obiettivo = habit.obiettivo || 8;
  const ml = bicchieri * ML_PER_BICCHIERE;
  const obiettivoMl = obiettivo * ML_PER_BICCHIERE;
  const pct = Math.min(1, bicchieri / obiettivo);
  const completato = bicchieri >= obiettivo;

  async function segnaBicchiere() {
    // Aggiornamento ottimistico: la vista cambia subito, la scrittura parte dietro.
    const ottimistico = completato ? 0 : bicchieri + 1;
    setData((d) => ({ ...d, log: { ...d.log, [habit.id]: ottimistico } }));
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId: habit.id }),
      });
      if (!res.ok) throw new Error("scrittura fallita");
      const fresh = await res.json();
      setData((d) => ({ ...d, log: fresh.log }));
    } catch {
      carica();
    }
  }

  return (
    <section id="section-acqua" className="card">
      <h3>Acqua</h3>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 10, minHeight: 32 }}>
        {messaggioPer(pct)}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {Array.from({ length: obiettivo }).map((_, i) => (
          <span key={i} style={{ fontSize: 20, opacity: i < bicchieri ? 1 : 0.25, transition: "opacity 0.2s ease" }}>
            💧
          </span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
          {ml} / {obiettivoMl} ml
        </span>
        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
          ({bicchieri} / {obiettivo} bicchieri)
        </span>
        <button
          type="button"
          onClick={segnaBicchiere}
          style={{
            marginLeft: "auto",
            padding: "6px 12px",
            borderRadius: 8,
            border: completato ? "1px solid var(--border)" : "none",
            background: completato ? "var(--surface-alt)" : "var(--accent)",
            color: completato ? "var(--text)" : "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {completato ? "Ricomincia" : `+ ${ML_PER_BICCHIERE} ml`}
        </button>
      </div>
    </section>
  );
}
