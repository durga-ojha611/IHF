/**
 * Precision Dimension Parser for Custom Curtains
 * Supports standard decimal inches, integer inches, and US customary fractional inches (e.g. 54 1/2", 96 3/8, 108 3/4).
 */

export const VALID_FRACTION_VALUES = {
  '': 0,
  '0': 0,
  '1/8': 0.125,
  '1/4': 0.25,
  '3/8': 0.375,
  '1/2': 0.5,
  '5/8': 0.625,
  '3/4': 0.75,
  '7/8': 0.875
};

/**
 * Parse an inch input into a verified decimal and clean formatted string.
 * @param {string|number|object} input - Dimension input (e.g., "54 1/2\"", 54.5, { whole: 54, fraction: "1/2" })
 * @returns {{ decimal: number, formatted: string, whole: number, fraction: string }}
 */
export function parseInches(input) {
  if (input === undefined || input === null || input === '') {
    throw new Error('Measurement value is required');
  }

  let whole = 0;
  let fraction = '';
  let fractionDecimal = 0;

  if (typeof input === 'number') {
    if (isNaN(input) || input <= 0) {
      throw new Error(`Invalid measurement: ${input}`);
    }
    whole = Math.floor(input);
    const remainder = Math.round((input - whole) * 1000) / 1000;
    
    // Map closest fraction
    let closestFraction = '';
    let minDiff = 1;
    for (const [frac, dec] of Object.entries(VALID_FRACTION_VALUES)) {
      if (dec === 0) continue;
      const diff = Math.abs(remainder - dec);
      if (diff < minDiff && diff <= 0.065) {
        minDiff = diff;
        closestFraction = frac;
        fractionDecimal = dec;
      }
    }
    fraction = remainder < 0.065 ? '' : closestFraction;
    const decimal = whole + fractionDecimal;
    const formatted = fraction && fraction !== '0' ? `${whole} ${fraction}"` : `${whole}"`;
    return { decimal, formatted, whole, fraction: fraction === '0' ? '' : fraction };
  }

  if (typeof input === 'object' && input !== null) {
    whole = parseInt(input.whole, 10);
    fraction = (input.fraction || '').toString().trim().replace(/["']/g, '');
    if (isNaN(whole) || whole <= 0) {
      throw new Error(`Invalid whole inches: ${input.whole}`);
    }
    if (fraction && !(fraction in VALID_FRACTION_VALUES)) {
      throw new Error(`Invalid fraction: ${fraction}. Allowed fractions: 1/8, 1/4, 3/8, 1/2, 5/8, 3/4, 7/8`);
    }
    fractionDecimal = VALID_FRACTION_VALUES[fraction] || 0;
    const decimal = whole + fractionDecimal;
    const formatted = fraction && fraction !== '0' ? `${whole} ${fraction}"` : `${whole}"`;
    return { decimal, formatted, whole, fraction: fraction === '0' ? '' : fraction };
  }

  if (typeof input === 'string') {
    // Strip quotes, double quotes, inch marks, trim whitespace
    let clean = input.replace(/["'”’in]/gi, '').trim();

    // Check if it's already a decimal number string like "54.5"
    if (/^\d+(\.\d+)?$/.test(clean)) {
      const num = parseFloat(clean);
      return parseInches(num);
    }

    // Match "54 1/2" or "54-1/2" or "1/2"
    const match = clean.match(/^(\d+)?[\s\-]?(\d+\/\d+)?$/);
    if (!match || (!match[1] && !match[2])) {
      throw new Error(`Invalid inch measurement format: "${input}". Example formats: 54, 54.5, 54 1/2", 108 3/4`);
    }

    whole = match[1] ? parseInt(match[1], 10) : 0;
    fraction = match[2] ? match[2].trim() : '';

    if (fraction && !(fraction in VALID_FRACTION_VALUES)) {
      throw new Error(`Invalid fraction: ${fraction}. Allowed fractions: 1/8, 1/4, 3/8, 1/2, 5/8, 3/4, 7/8`);
    }

    fractionDecimal = VALID_FRACTION_VALUES[fraction] || 0;
    const decimal = whole + fractionDecimal;

    if (decimal <= 0) {
      throw new Error(`Measurement must be greater than 0: "${input}"`);
    }

    const formatted = fraction && fraction !== '0' ? (whole > 0 ? `${whole} ${fraction}"` : `${fraction}"`) : `${whole}"`;
    return { decimal, formatted, whole, fraction: fraction === '0' ? '' : fraction };
  }

  throw new Error(`Unsupported dimension type: ${typeof input}`);
}

export default {
  parseInches,
  VALID_FRACTION_VALUES
};
