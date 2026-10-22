import SaluteRiassuntoBar from "../cards/SaluteRiassuntoBar";
import NutritionCard from "../cards/NutritionCard";
import HealthCard from "../cards/HealthCard";
import WeightCard from "../cards/WeightCard";
import WorkoutsCard from "../cards/WorkoutsCard";
import AcquaCard from "../cards/AcquaCard";

export default function SaluteScreen() {
  return (
    <div className="screen-salute">
      <SaluteRiassuntoBar />
      <AcquaCard />
      <NutritionCard />
      <WeightCard />
      <WorkoutsCard />
      <HealthCard />
    </div>
  );
}
