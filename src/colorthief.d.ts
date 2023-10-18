declare module 'colorthief' {
  type Color = [number, number, number];
  export default class ColorThief {
    static getColor: (img: HTMLImageElement | null) => Color;
    static getPalette: (img: HTMLImageElement | null) => Color[];
  }
}