import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const MILISECONDS = 1;
export const SECONDS = 1000 * MILISECONDS;
export const MINUTES = 60 * SECONDS;
export const HOURS = 60 * MINUTES;

export const IMAGES = {
  placeholder: require("../../../assets/images/placeholder.png"),
} as const;

export const EXERCISES_ITEM_WIDTH = (width - 12 * 3) / 2; // 48 = padding + gaps
export const EXERCISES_ITEM_HEIGHT = EXERCISES_ITEM_WIDTH * 1.5;
