import BigNumber from 'bignumber.js';

// Configure BigNumber for financial calculations
BigNumber.config({
  DECIMAL_PLACES: 2,
  ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
  EXPONENTIAL_AT: [-7, 20],
});

export class MoneyUtil {
  /**
   * Safely adds two monetary amounts
   */
  static add(a: string | number, b: string | number): string {
    return new BigNumber(a).plus(new BigNumber(b)).toFixed(2);
  }

  /**
   * Safely subtracts b from a
   */
  static subtract(a: string | number, b: string | number): string {
    return new BigNumber(a).minus(new BigNumber(b)).toFixed(2);
  }

  /**
   * Safely multiplies amount by multiplier (e.g. rate or percentage)
   */
  static multiply(a: string | number, multiplier: string | number): string {
    return new BigNumber(a).multipliedBy(new BigNumber(multiplier)).toFixed(2);
  }

  /**
   * Compares two amounts. Returns:
   *  1 if a > b
   * -1 if a < b
   *  0 if a === b
   */
  static compare(a: string | number, b: string | number): number {
    return new BigNumber(a).comparedTo(new BigNumber(b)) ?? 0;
  }

  /**
   * Checks if a is greater than or equal to b
   */
  static isGreaterThanOrEqual(a: string | number, b: string | number): boolean {
    return new BigNumber(a).isGreaterThanOrEqualTo(new BigNumber(b));
  }

  /**
   * Checks if an amount is strictly positive (> 0)
   */
  static isPositive(a: string | number): boolean {
    return new BigNumber(a).isGreaterThan(0);
  }

  /**
   * Converts GHS or other major currency unit to minor unit (pesewas/kobo/cents).
   * Paystack expects amounts in minor currency units (e.g. 10.50 GHS = 1050 pesewas).
   */
  static toMinorUnit(amount: string | number): number {
    return new BigNumber(amount).multipliedBy(100).integerValue().toNumber();
  }

  /**
   * Converts minor currency unit (pesewas/cents) to major unit string (e.g. 1050 -> "10.50").
   */
  static fromMinorUnit(minor: number | string): string {
    return new BigNumber(minor).dividedBy(100).toFixed(2);
  }

  /**
   * Validates if string or number is a valid positive financial amount format
   */
  static isValidAmount(amount: unknown): boolean {
    if (typeof amount !== 'string' && typeof amount !== 'number') return false;
    const bn = new BigNumber(amount);
    return !bn.isNaN() && bn.isFinite() && bn.isGreaterThan(0);
  }
}
