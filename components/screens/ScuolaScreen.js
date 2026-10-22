import AgendaDocenteCard from "../cards/AgendaDocenteCard";
import OrarioClassiCard from "../cards/OrarioClassiCard";
import ClassiCard from "../cards/ClassiCard";
import AttivitaPomeridianeCard from "../cards/AttivitaPomeridianeCard";

// Scuola, versione docente: l'agenda del giorno divisa per classe (dall'orario)
// sopra, l'orario compatto, le classi (con i link Teams) e le attività
// pomeridiane (corsi di recupero, progetti, sportelli...) sotto.
export default function ScuolaScreen() {
  return (
    <div className="screen-scuola">
      <AgendaDocenteCard />
      <OrarioClassiCard />
      <ClassiCard />
      <AttivitaPomeridianeCard />
    </div>
  );
}
