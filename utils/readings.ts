/**
 * Utility functions to convert between string and array formats for on/kun readings
 */

/**
 * Converts a comma-separated string to an array of trimmed strings
 * @param readings - Comma-separated string like "ダイ, タイ"
 * @returns Array of trimmed strings like ["ダイ", "タイ"]
 */
export function parseReadings(readings: string): string[] {
  if (!readings || readings.trim() === "") {
    return [""];
  }
  return readings.split(",").map((r) => r.trim());
}

/**
 * Converts an array of strings to a comma-separated string
 * @param readings - Array of strings like ["ダイ", "タイ"]
 * @returns Comma-separated string like "ダイ, タイ"
 */
export function stringifyReadings(readings: string[]): string {
  return readings.filter((r) => r.trim() !== "").join(", ");
}

/**
 * Validates if a reading string is properly formatted
 * @param readings - Reading string to validate
 * @returns true if valid, false otherwise
 */
export function isValidReadingString(readings: string): boolean {
  if (!readings) return false;
  const parsed = parseReadings(readings);
  return parsed.length > 0 && parsed.every((r) => r.length > 0);
}

/**
 * Validates if a reading array is properly formatted
 * @param readings - Reading array to validate
 * @returns true if valid, false otherwise
 */
export function isValidReadingArray(readings: string[]): boolean {
  return readings.length > 0 && readings.some((r) => r.trim().length > 0);
}
