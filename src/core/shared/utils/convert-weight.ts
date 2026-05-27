export function convertWeight(weight: number, displayUnit: "kg" | "lb") {
  return weight / (displayUnit === "kg" ? 1000 : 453.6);
}
