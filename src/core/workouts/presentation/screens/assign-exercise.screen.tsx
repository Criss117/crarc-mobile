import { SkeletonGroup } from "heroui-native/skeleton-group";
import { FlatList, View } from "react-native";

import { useFindManyExercises } from "@/core/exercises/application/hooks/use-find-exercises";
import { ExercisesMuscleSelector } from "@/core/exercises/presentation/components/exercises-filters/muscle-selector";
import { useExercisesFilters } from "@/core/exercises/presentation/components/exercises-filters/provider";
import { ExercisesSearchBar } from "@/core/exercises/presentation/components/exercises-filters/search-bar";
import {
  ExercisesItemSkeleton,
  SelectableExercisesItem,
} from "@/core/exercises/presentation/components/exercises-item";
import { Text } from "@/core/shared/components/text";
import { EXERCISES_ITEM_WIDTH } from "@/core/shared/utils/constanst";

interface Props {
  selectedExercises: string[];
  handleSelectExercise: (exercise: {
    id: string;
    name: string;
    muscles: string[];
    image: string | null;
  }) => void;
}

export function AssingExercisesScreen({
  handleSelectExercise,
  selectedExercises,
}: Props) {
  const { filters } = useExercisesFilters();
  const { data, fetchNextPage, hasNextPage } = useFindManyExercises({
    filters: { muscleTypeId: filters.muscleTypeId, searchQuery: filters.query },
  });

  const isSelected = (exercise: string) => selectedExercises.includes(exercise);

  return (
    <View className="px-2 flex-1 gap-y-4">
      <View className="flex gap-y-4">
        <ExercisesSearchBar />
        <ExercisesMuscleSelector />
      </View>
      <FlatList
        numColumns={2}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        getItemLayout={(_, index) => ({
          length: EXERCISES_ITEM_WIDTH,
          offset: EXERCISES_ITEM_WIDTH * Math.floor(index / 2),
          index,
        })}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SelectableExercisesItem
            exercise={item}
            isSelected={isSelected(item.id)}
            handleSelectExercise={(exercise) =>
              handleSelectExercise({
                id: exercise.id,
                name: exercise.name,
                muscles: exercise.muscles.map((m) => m.name),
                image: exercise.image,
              })
            }
          />
        )}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 16,
        }}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 124 }}
        showsVerticalScrollIndicator={false}
        className="flex-1 "
        ListEmptyComponent={<Text>No hay ejercicios disponibles</Text>}
        onEndReachedThreshold={0.5}
        onEndReached={() => fetchNextPage()}
        ListFooterComponent={
          <View className="items-center">
            {!hasNextPage && <Text>No hay más ejercicios disponibles</Text>}
          </View>
        }
      />
    </View>
  );
}

export function ExercisesScreenSkeleton() {
  return (
    <View
      className="px-2 flex-1 gap-y-4"
      accessibilityRole="none"
      accessibilityLabel="Cargando contenido"
    >
      <SkeletonGroup variant="shimmer" className="gap-y-4">
        <SkeletonGroup.Item className="h-10 w-full rounded-xl" />

        <View className="flex-row gap-x-3">
          <SkeletonGroup.Item className="h-8 w-16 rounded-full" />
          <SkeletonGroup.Item className="h-8 w-20 rounded-full" />
          <SkeletonGroup.Item className="h-8 w-24 rounded-full" />
          <SkeletonGroup.Item className="h-8 w-14 rounded-full" />
        </View>
      </SkeletonGroup>

      <View className="gap-y-4">
        <ExercisesItemSkeleton />
        <ExercisesItemSkeleton />
        <ExercisesItemSkeleton />
        <ExercisesItemSkeleton />
      </View>
    </View>
  );
}
