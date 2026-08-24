/**
 * Formats currency in paise to standard Indian Rupee format.
 * e.g. 185000 paise -> "₹1,850.00"
 */
export function formatPaise(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

/**
 * Parses rupee amount to paise.
 * e.g. 1850 -> 185000
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}
