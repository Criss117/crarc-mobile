export interface Exercise {
  id: string;
  name: string;
  category: BodyPart;
  body_part: BodyPart;
  equipment: Equipment;
  instructions: Instructions;
  instruction_steps: InstructionSteps;
  muscle_group: MuscleGroup;
  secondary_muscles: MuscleGroup[];
  target: Target;
  image: string;
  gif_url: string;
  created_at: Date;
}

export enum BodyPart {
  Back = "back",
  Cardio = "cardio",
  Chest = "chest",
  LowerArms = "lower arms",
  LowerLegs = "lower legs",
  Neck = "neck",
  Shoulders = "shoulders",
  UpperArms = "upper arms",
  UpperLegs = "upper legs",
  Waist = "waist",
}

export enum Equipment {
  Assisted = "assisted",
  Band = "band",
  Barbell = "barbell",
  BodyWeight = "body weight",
  BosuBall = "bosu ball",
  Cable = "cable",
  Dumbbell = "dumbbell",
  EllipticalMachine = "elliptical machine",
  EzBarbell = "ez barbell",
  Hammer = "hammer",
  Kettlebell = "kettlebell",
  LeverageMachine = "leverage machine",
  MedicineBall = "medicine ball",
  OlympicBarbell = "olympic barbell",
  ResistanceBand = "resistance band",
  Roller = "roller",
  Rope = "rope",
  SkiergMachine = "skierg machine",
  SledMachine = "sled machine",
  SmithMachine = "smith machine",
  StabilityBall = "stability ball",
  StationaryBike = "stationary bike",
  StepmillMachine = "stepmill machine",
  Tire = "tire",
  TrapBar = "trap bar",
  UpperBodyErgometer = "upper body ergometer",
  Weighted = "weighted",
  WheelRoller = "wheel roller",
}

export interface InstructionSteps {
  en: string[];
  it: string[];
  tr: string[];
}

export interface Instructions {
  en: string;
  it: string;
  tr: string;
}

export enum MuscleGroup {
  Abdominals = "abdominals",
  AnkleStabilizers = "ankle stabilizers",
  Ankles = "ankles",
  Back = "back",
  Biceps = "biceps",
  Brachialis = "brachialis",
  Calves = "calves",
  Chest = "chest",
  Core = "core",
  Deltoids = "deltoids",
  Feet = "feet",
  Forearms = "forearms",
  Glutes = "glutes",
  GripMuscles = "grip muscles",
  Groin = "groin",
  Hamstrings = "hamstrings",
  Hands = "hands",
  HipFlexors = "hip flexors",
  InnerThighs = "inner thighs",
  LatissimusDorsi = "latissimus dorsi",
  Lats = "lats",
  LowerAbs = "lower abs",
  LowerBack = "lower back",
  Obliques = "obliques",
  Quadriceps = "quadriceps",
  RearDeltoids = "rear deltoids",
  Rhomboids = "rhomboids",
  RotatorCuff = "rotator cuff",
  Shins = "shins",
  Shoulders = "shoulders",
  Soleus = "soleus",
  Sternocleidomastoid = "sternocleidomastoid",
  Trapezius = "trapezius",
  Traps = "traps",
  Triceps = "triceps",
  UpperBack = "upper back",
  UpperChest = "upper chest",
  WristExtensors = "wrist extensors",
  WristFlexors = "wrist flexors",
  Wrists = "wrists",
}

export enum Target {
  Abductors = "abductors",
  Abs = "abs",
  Adductors = "adductors",
  Biceps = "biceps",
  Calves = "calves",
  CardiovascularSystem = "cardiovascular system",
  Delts = "delts",
  Forearms = "forearms",
  Glutes = "glutes",
  Hamstrings = "hamstrings",
  Lats = "lats",
  LevatorScapulae = "levator scapulae",
  Pectorals = "pectorals",
  Quads = "quads",
  SerratusAnterior = "serratus anterior",
  Spine = "spine",
  Traps = "traps",
  Triceps = "triceps",
  UpperBack = "upper back",
}
