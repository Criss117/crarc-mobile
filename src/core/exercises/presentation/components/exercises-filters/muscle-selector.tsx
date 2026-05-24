import { Button } from "heroui-native";
import { FlatList } from "react-native";

import { useFindMuscles } from "@/core/exercises/application/hooks/use-find-muscles";
import { useExercisesFilters } from "./provider";

interface MuscleSelectorButtonProps {
  id: string;
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

function ExerciseSelectorButton({
  id,
  label,
  isSelected,
  onPress,
}: MuscleSelectorButtonProps) {
  if (isSelected)
    return (
      <Button key={id + "selected"} onPress={onPress}>
        {label}
      </Button>
    );

  return (
    <Button variant="outline" onPress={onPress} key={id}>
      {label}
    </Button>
  );
}

export function ExercisesMuscleSelector() {
  const { dispatch, filters } = useExercisesFilters();
  const { data: muscles } = useFindMuscles();

  return (
    <FlatList
      data={muscles}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={() => (
        <ExerciseSelectorButton
          id={"all"}
          label={"Todos"}
          isSelected={filters.muscleTypeId === "all"}
          onPress={() => dispatch({ type: "set-muscle-type", payload: "all" })}
        />
      )}
      renderItem={({ item }) => (
        <ExerciseSelectorButton
          id={item.id}
          label={item.name}
          isSelected={filters.muscleTypeId === item.id}
          onPress={() =>
            dispatch({ type: "set-muscle-type", payload: item.id })
          }
        />
      )}
      contentContainerClassName="gap-x-3"
      showsHorizontalScrollIndicator={false}
      horizontal
    />
  );
}
