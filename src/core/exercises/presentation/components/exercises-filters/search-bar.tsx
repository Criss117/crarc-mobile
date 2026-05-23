import { MaterialIcons } from "@/core/shared/components/icons";
import { InputGroup } from "heroui-native";
import { useExercisesFilters } from "./provider";

export function ExercisesSearchBar() {
  const { dispatch, filters } = useExercisesFilters();

  return (
    <InputGroup>
      <InputGroup.Prefix>
        <MaterialIcons name="search" size={24} className="text-muted" />
      </InputGroup.Prefix>
      <InputGroup.Input
        placeholder="Buscar ejercicios"
        value={filters.query}
        onChangeText={(text) => dispatch({ type: "set-query", payload: text })}
      />
      <InputGroup.Suffix>
        <MaterialIcons
          name="close"
          className="text-muted"
          size={24}
          onPress={() => dispatch({ type: "set-query", payload: "" })}
        />
      </InputGroup.Suffix>
    </InputGroup>
  );
}
