import { SearchField } from "heroui-native/search-field";
import { useEffect, useState } from "react";

import { useExercisesFilters } from "@/core/exercises/presentation/components/exercises-filters/provider";
import { useDebounce } from "@/core/shared/hooks/use-debunce";

export function ExercisesSearchBar() {
  const { dispatch, filters } = useExercisesFilters();
  const [query, setQuery] = useState<string>(filters.query);
  const debouncedQuery = useDebounce<string>(query, 500);

  useEffect(() => {
    dispatch({ type: "set-query", payload: debouncedQuery });
  }, [debouncedQuery]);

  return (
    <SearchField value={query} onChange={setQuery}>
      <SearchField.Group>
        <SearchField.SearchIcon />
        <SearchField.Input
          placeholder="Buscar ejercicios"
          className="font-regular"
        />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  );
}
