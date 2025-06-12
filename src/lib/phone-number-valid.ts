// lib/phone-number-valid.ts

/**
 * Validate and normalize a Chinese mobile phone number.
 *
 * @param {string} rawInput - User input in any of the accepted formats.
 * @returns {string|null} - Normalized 11-digit phone number or null if invalid.
 */
export function validatePhoneNumber(rawInput: string): string | null {
  if (typeof rawInput !== 'string') return null;

  try {
    // 1. Remove all non-digit characters
    let digitsOnly = rawInput.replace(/\D/g, '');

    // 2. Remove international prefixes like 0086 or 86
    if (digitsOnly.startsWith('0086')) {
      digitsOnly = digitsOnly.slice(4);
    } else if (digitsOnly.startsWith('86')) {
      digitsOnly = digitsOnly.slice(2);
    }

    // 3. Now should be a standard 11-digit Chinese number
    if (/^1\d{10}$/.test(digitsOnly)) {
      return digitsOnly;
    }

    return null;
  } catch (err) {
    console.error('Phone number validation error:', err);
    return null;
  }
}
