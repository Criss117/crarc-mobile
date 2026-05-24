import { SearchField } from "heroui-native/search-field";
import { useExercisesFilters } from "./provider";

export function ExercisesSearchBar() {
  const { dispatch, filters } = useExercisesFilters();

  return (
    <SearchField
      value={filters.query}
      onChange={(v) => dispatch({ type: "set-query", payload: v })}
    >
      <SearchField.Group>
        <SearchField.SearchIcon />
        <SearchField.Input />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  );
}
