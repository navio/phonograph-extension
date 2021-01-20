export enum COLORS {
  black = "black",
  white = "white",
}

export type IColor = [r: number, g: number, b: number];

export const contrastColor = (color: IColor) => {
  const [red, green, blue] = color;
  const total = red * 0.299 + green * 0.587 + blue * 0.114;
  return total > 186 ? COLORS.black : COLORS.white;
};

export const getRGB = (color: IColor) =>
  `rgb(${color[0]},${color[1]},${color[2]})`;

export const getRGBA = (color: IColor, a: number = 0.8) =>
  `rgba(${color[0]},${color[1]},${color[2]}, ${a})`;
