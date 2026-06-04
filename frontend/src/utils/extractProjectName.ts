/**
 * Extracts a human-readable project name from an AWS account name
 * by stripping environment suffixes (Non-Prod, Prod, NonProd).
 *
 * Examples:
 *   "Dealer Sales Portal Non-Prod" → "Dealer Sales Portal"
 *   "Dealer Sales Portal Prod" → "Dealer Sales Portal"
 *   "GoodyearCare Non-Prod" → "GoodyearCare"
 *   "GoodyearCare" → "GoodyearCare"
 */
export function extractProjectName(accountName: string): string {
  return accountName
    .replace(/\s*(Non-?Prod|Prod)\s*$/i, '')
    .trim();
}
