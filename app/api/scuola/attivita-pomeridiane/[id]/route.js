import { NextResponse } from "next/server";
import { updateState } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  let trovata = false;
  const state = await updateState((s) => {
    const a = (s.scuola?.attivitaPomeridiane || []).find((x) => x.id === id);
    if (!a) return s;
    trovata = true;
    if (typeof body?.nome === "string" && body.nome.trim()) a.nome = body.nome.trim().slice(0, 80);
    if (typeof body?.giorno === "string") a.giorno = body.giorno.trim().slice(0, 20);
    if (typeof body?.orario === "string") a.orario = body.orario.trim().slice(0, 20);
    if (typeof body?.luogo === "string") a.luogo = body.luogo.trim().slice(0, 100);
    if (typeof body?.note === "string") a.note = body.note.trim().slice(0, 200);
    return s;
  });
  if (!trovata) return NextResponse.json({ error: "Attività non trovata" }, { status: 404 });
  return NextResponse.json({ attivita: state.scuola.attivitaPomeridiane });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const state = await updateState((s) => {
    s.scuola.attivitaPomeridiane = (s.scuola?.attivitaPomeridiane || []).filter((a) => a.id !== id);
    return s;
  });
  return NextResponse.json({ attivita: state.scuola.attivitaPomeridiane });
}
