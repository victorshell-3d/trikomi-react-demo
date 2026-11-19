/** Product colors shared by the renderer and editor. */
export const jewelryPalette = {
  gold: "#d8be87",
  silver: "#d7d8e4",
  roseGold: "#c98e82",
  platinum: "#bfc5cc",
  brass: "#bd9b4e",
  stone: "#b8e1d7",
  pink: "#ed5c77",
  lilac: "#be7cff",
  blue: "#4f83ff",
  teal: "#35c9b1",
  pearl: "#f5f5f5",
} as const;
export const jewelrySwatches = [
  jewelryPalette.gold,
  jewelryPalette.silver,
  jewelryPalette.roseGold,
  jewelryPalette.pink,
  jewelryPalette.lilac,
  jewelryPalette.blue,
  jewelryPalette.teal,
  jewelryPalette.pearl,
].map((value) => value.toUpperCase());
export const jewelryMetals = [
  { name: "Gold", color: jewelryPalette.gold, finish: "Satin" },
  { name: "Silver", color: jewelryPalette.silver, finish: "Chrome" },
  { name: "Platinum", color: jewelryPalette.platinum, finish: "Satin" },
  { name: "Rose gold", color: jewelryPalette.roseGold, finish: "Satin" },
  { name: "Brass", color: jewelryPalette.brass, finish: "Matte" },
];
