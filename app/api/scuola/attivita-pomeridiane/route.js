import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { readState, updateState } from "@/lib/store";

export const dynamic = "force-dynamic";

// Le attività pomeridiane del docente: corsi di recupero, progetti,
// sportelli, colloqui ecc. che si tengono nel pomeriggio, fuori dall'orario
// scolastico normale.
export async function GET() {
  const state = await readState();
  return NextResponse.json({ attivita: state.scuola?.attivitaPomeridiane || [] });
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const nome = typeof body?.nome === "string" ? body.nome.trim().slice(0, 80) : "";
  const giorno = typeof body?.giorno === "string" ? body.giorno.trim().slice(0, 20) : "";
  const orario = typeof body?.orario === "string" ? body.orario.trim().slice(0, 20) : "";
  const luogo = typeof body?.luogo === "string" ? body.luogo.trim().slice(0, 100) : "";
  const note = typeof body?.note === "string" ? body.note.trim().slice(0, 200) : "";
  if (!nome) return NextResponse.json({ error: "Nome dell'attività mancante" }, { status: 400 });

  const state = await updateState((s) => {
    if (!s.scuola) s.scuola = {};
    if (!Array.isArray(s.scuola.attivitaPomeridiane)) s.scuola.attivitaPomeridiane = [];
    s.scuola.attivitaPomeridiane.push({
      id: randomUUID(),
      nome,
      giorno,
      orario,
      luogo,
      note,
      dataCreazione: new Date().toISOString(),
    });
    return s;
  });
  return NextResponse.json({ attivita: state.scuola.attivitaPomeridiane }, { status: 201 });
}
