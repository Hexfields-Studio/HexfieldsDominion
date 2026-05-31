/**
 * Converts RGB color to HSL hue rotation (0-360 degrees)
 * @param red - Red component (0-255)
 * @param green - Green component (0-255)
 * @param blue - Blue component (0-255)
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

/**
 * Generates a CSS hue-rotation filter value based on RGB color
 * @param red - Red component (0-255)
 * @param green - Green component (0-255)
 * @param blue - Blue component (0-255)
 * @returns CSS filter string for hue rotation, or grayscale filter for default fallback
 */
export function getHueRotateFilter(red: number, green: number, blue: number): string {
  // If color is essentially black (0,0,0), use grayscale fallback
  if (red === 0 && green === 0 && blue === 0) {
    return "saturate(0)"; // Zero saturation = grayscale
  }

  const hue = rgbToHue(red, green, blue);
  // Rotate from red (0 degrees) to the target hue
  // Since structures are initially red, we need to rotate from red hue (0) to target
  const hueRotate = hue;
  
  return `hue-rotate(${hueRotate}deg)`;
}
