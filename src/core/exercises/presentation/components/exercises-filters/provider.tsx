import { createContext, use, useReducer } from "react";

type State = {
  query: string;
  muscleTypeId: string;
};

type Action =
  | { type: "set-query"; payload: string }
  | { type: "set-muscle-type"; payload: string }
  | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "set-query":
      return { ...state, query: action.payload };
    case "set-muscle-type":
      return { ...state, muscleTypeId: action.payload };
    case "reset":
      return { query: "", muscleTypeId: "all" };
    default:
      throw new Error("Unknown action type");
  }
}
interface Context {
  filters: State;
  dispatch: React.Dispatch<Action>;
}

const ExercisesFilters = createContext<Context | null>(null);

export function useExercisesFilters() {
  const context = use(ExercisesFilters);
  if (!context)
    throw new Error(
      "useExercisesFilters must be used within a ExercisesFiltersProvider.",
    );

  return context;
}

export function ExercisesFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [filters, dispatch] = useReducer(reducer, {
    query: "",
    muscleTypeId: "all",
  });

  return (
    <ExercisesFilters.Provider value={{ filters, dispatch }}>
      {children}
    </ExercisesFilters.Provider>
  );
}
