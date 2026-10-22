"use client";

import { useEffect, useState } from "react";

const GIORNI = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];

// Le attività che si tengono nel pomeriggio, fuori dall'orario scolastico
// normale: corsi di recupero, progetti, sportelli didattici, colloqui...
export default function AttivitaPomeridianeCard() {
  const [attivita, setAttivita] = useState(null);
  const [nome, setNome] = useState("");
  const [giorno, setGiorno] = useState("");
  const [orario, setOrario] = useState("");
  const [luogo, setLuogo] = useState("");
  const [note, setNote] = useState("");
  const [inviando, setInviando] = useState(false);
  const [errore, setErrore] = useState(null);
  const [modificaId, setModificaId] = useState(null);
  const [bozza, setBozza] = useState({ nome: "", giorno: "", orario: "", luogo: "", note: "" });

  function carica() {
    fetch("/api/scuola/attivita-pomeridiane")
      .then((r) => r.json())
      .then((d) => setAttivita(d.attivita || []))
      .catch(() => setAttivita([]));
  }

  useEffect(carica, []);

  async function aggiungi(e) {
    e.preventDefault();
    if (!nome.trim()) return;
    setInviando(true);
    setErrore(null);
    try {
      const res = await fetch("/api/scuola/attivita-pomeridiane", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome.trim(), giorno, orario: orario.trim(), luogo: luogo.trim(), note: note.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrore(json.error || "Aggiunta non riuscita");
      } else {
        setAttivita(json.attivita);
        setNome("");
        setGiorno("");
        setOrario("");
        setLuogo("");
        setNote("");
      }
    } finally {
      setInviando(false);
    }
  }

  async function salvaModifica(id) {
    const res = await fetch(`/api/scuola/attivita-pomeridiane/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bozza),
    });
    const json = await res.json();
    if (res.ok) {
      setAttivita(json.attivita);
      setModificaId(null);
    }
  }

  async function elimina(id) {
    const res = await fetch(`/api/scuola/attivita-pomeridiane/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (res.ok) setAttivita(json.attivita);
  }

  if (!attivita) {
    return (
      <section id="section-scuola-attivita-pomeridiane" className="card span-2">
        <h3>Attività pomeridiane</h3>
      </section>
    );
  }

  return (
    <section id="section-scuola-attivita-pomeridiane" className="card span-2">
      <h3>Attività pomeridiane</h3>
      <div className="classi-lista">
        {attivita.length === 0 && (
          <p className="review-hint">Nessuna attività pomeridiana ancora: aggiungi corsi di recupero, progetti, sportelli o colloqui.</p>
        )}
        {attivita.map((a) =>
          modificaId === a.id ? (
            <form
              key={a.id}
              className="classi-form"
              onSubmit={(e) => {
                e.preventDefault();
                salvaModifica(a.id);
              }}
            >
              <input type="text" value={bozza.nome} onChange={(e) => setBozza((b) => ({ ...b, nome: e.target.value }))} placeholder="Attività" />
              <select value={bozza.giorno} onChange={(e) => setBozza((b) => ({ ...b, giorno: e.target.value }))}>
                <option value="">Giorno</option>
                {GIORNI.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <input type="text" value={bozza.orario} onChange={(e) => setBozza((b) => ({ ...b, orario: e.target.value }))} placeholder="Orario (es. 14:30-16:00)" />
              <input type="text" value={bozza.luogo} onChange={(e) => setBozza((b) => ({ ...b, luogo: e.target.value }))} placeholder="Luogo (facoltativo)" />
              <input type="text" value={bozza.note} onChange={(e) => setBozza((b) => ({ ...b, note: e.target.value }))} placeholder="Nota (facoltativa)" />
              <div className="scuola-giorno-form-azioni">
                <button type="submit">Salva</button>
                <button type="button" onClick={() => setModificaId(null)}>Annulla</button>
              </div>
            </form>
          ) : (
            <div key={a.id} className="classi-riga">
              <button
                type="button"
                className="classi-nome"
                onClick={() => {
                  setModificaId(a.id);
                  setBozza({ nome: a.nome, giorno: a.giorno || "", orario: a.orario || "", luogo: a.luogo || "", note: a.note || "" });
                }}
                title="Modifica"
              >
                {a.nome}
              </button>
              <span className="classi-nota">
                {[a.giorno, a.orario, a.luogo].filter(Boolean).join(" · ") || "—"}
              </span>
              <button type="button" className="scuola-todo-elimina" onClick={() => elimina(a.id)} aria-label="Elimina">✕</button>
            </div>
          )
        )}
      </div>

      <form onSubmit={aggiungi} className="classi-form">
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nuova attività (es. Corso di recupero)" />
        <select value={giorno} onChange={(e) => setGiorno(e.target.value)}>
          <option value="">Giorno</option>
          {GIORNI.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <input type="text" value={orario} onChange={(e) => setOrario(e.target.value)} placeholder="Orario (es. 14:30-16:00)" />
        <input type="text" value={luogo} onChange={(e) => setLuogo(e.target.value)} placeholder="Luogo (facoltativo)" />
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nota (facoltativa)" />
        <button type="submit" disabled={inviando}>Aggiungi attività</button>
      </form>
      {errore && <p className="review-errore">{errore}</p>}
    </section>
  );
}
