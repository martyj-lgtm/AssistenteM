import NutritionCard from "../cards/NutritionCard";
import WorkoutsCard from "../cards/WorkoutsCard";
import AcquaCard from "../cards/AcquaCard";

export default function SaluteScreen() {
  return (
    <div className="screen-salute">
      <AcquaCard />
      <NutritionCard />
      <WorkoutsCard />
    </div>
  );
}
