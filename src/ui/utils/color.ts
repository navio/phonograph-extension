export enum COLORS {
  black = "black",
  white = "white",
}

export type IColor = [r: number, g: number, b: number];

export const contrastColor = (color: IColor, dark = COLORS.black, white = COLORS.white ) => 
  isAClearColor(color) ? dark : white;

export const isFontReadable = (font: IColor, backgroundColor: string) => {
  const isBackgroundLight = isAClearColor(hexToColor(backgroundColor));
  const isFontLight = isAClearColor(font);
  return isFontLight !== isBackgroundLight;
}


export const isAClearColor = (color: IColor) => {
  const [red, green, blue] = color;
  const total = red * 0.299 + green * 0.587 + blue * 0.114;
  return total > 186;
}

export const hexToColor = (col: string): IColor => {
  
  let hex   = col.replace(/#/, '');
  hex = hex.length === 3 ? hex + hex : hex;
  const r     = parseInt(hex.substring(0, 2), 16);
  const g     = parseInt(hex.substring(2, 4), 16);
  const b     = parseInt(hex.substring(4, 2), 16);
  return [r,g,b];
}

export const getRGB = (color: IColor) =>
  `rgb(${color[0]},${color[1]},${color[2]})`;

export const getRGBA = (color: IColor, a: number = 0.8) =>
  `rgba(${color[0]},${color[1]},${color[2]}, ${a})`;

export const getDynamicContrast = (colors: IColor[], background: string ) =>
{  const selected = colors.find((color) => isFontReadable(color, background)) 
          || (isAClearColor(hexToColor(background)) ? [0,0,0] : [256,256,256] )
  return getRGB(selected);
}
