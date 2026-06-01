/**
 * Converts hex color string to HSL hue rotation (0-360 degrees)
 * @param hexColor - Hex color string in format "#rrggbb"
 * @returns Hue value in degrees (0-360)
*/
export function hexToHue(hexColor: string): number {
  const { red, green, blue } = hexToRgb(hexColor);
  return rgbToHue(red, green, blue);
}

/**
 * Converts hex color string to RGB components
 * @param hexColor - Hex color string in format "#rrggbb" or "rrggbb"
 * @returns Object with red, green, blue components (0-255)
 */
export function hexToRgb(hexColor: string): { red: number; green: number; blue: number } {
  // Remove # if present
  const hex = hexColor.replace("#", "");
  
  const red = parseInt(hex.substring(0, 2), 16);
  const green = parseInt(hex.substring(2, 4), 16);
  const blue = parseInt(hex.substring(4, 6), 16);
  
  return { red, green, blue };
}

/**
 * Converts RGB color to HSL hue rotation
 * @returns Hue rotation in degrees (0-360)
 */
export function rgbToHue(red: number, green: number, blue: number): number {
  // Normalize RGB to 0-1 range
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let hue = 0;

  if (delta !== 0) {
    if (max === r) {
      hue = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
    } else if (max === g) {
      hue = ((b - r) / delta + 2) * 60;
    } else {
      hue = ((r - g) / delta + 4) * 60;
    }
  }

  return hue;
}
