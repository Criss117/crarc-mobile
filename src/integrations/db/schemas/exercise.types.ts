export const categorieTypes = ["waist","upper legs","back","lower legs","chest","upper arms","cardio","shoulders","lower arms","neck"] as const;

    export type CategorieTypes = (typeof categorieTypes)[number];
    
    export const equipmentTypes = ["body weight","cable","leverage machine","assisted","medicine ball","stability ball","band","barbell","rope","dumbbell","ez barbell","sled machine","upper body ergometer","kettlebell","olympic barbell","weighted","bosu ball","resistance band","roller","skierg machine","hammer","smith machine","wheel roller","stationary bike","tire","trap bar","elliptical machine","stepmill machine"] as const;

    export type EquipmentTypes = (typeof equipmentTypes)[number];
    
    export const targetTypes = ["abs","quads","lats","calves","pectorals","glutes","hamstrings","adductors","triceps","cardiovascular system","spine","upper back","biceps","delts","forearms","traps","serratus anterior","abductors","levator scapulae"] as const;

    export type TargetTypes = (typeof targetTypes)[number];

    export const muscleExerciseTypes = ["primary","secondary"] as const;

    export type MuscleExerciseType = (typeof muscleExerciseTypes)[number];
    