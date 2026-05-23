import { FlatList, View } from "react-native";

import { useFindExercises } from "@/core/exercises/application/queries/use-find-exercises";
import { Text } from "@/core/shared/components/text";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { ExercisesMuscleSelector } from "../components/exercises-filters/muscle-selector";
import { useExercisesFilters } from "../components/exercises-filters/provider";
import { ExercisesSearchBar } from "../components/exercises-filters/search-bar";
import { ExercisesItem } from "../components/exercises-item";

export function ExercisesScreen() {
  const bottomTabBarHeight = useBottomTabBarHeight();
  const { filters } = useExercisesFilters();
  const { data } = useFindExercises({
    muscleTypeId: filters.muscleTypeId,
    searchQuery: filters.query,
  });

  return (
    <View className="px-2 flex-1 gap-y-4">
      <View className="flex gap-y-4">
        <ExercisesSearchBar />
        <ExercisesMuscleSelector />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ExercisesItem exercise={item} />}
        ItemSeparatorComponent={<View className="h-4" />}
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: bottomTabBarHeight }}
        ListEmptyComponent={<Text>No hay ejercicios disponibles</Text>}
      />
    </View>
  );
}

export function ExercisesScreenSkeleton() {
  return <Text>Loading...</Text>;
}
