import { MoneyUtil } from '../../src/common/utils/decimal';

describe('MoneyUtil (Decimal-safe financial calculations)', () => {
  it('should accurately add monetary values without floating-point inaccuracy', () => {
    // 0.1 + 0.2 in standard JS IEEE 754 is 0.30000000000000004
    const result = MoneyUtil.add('0.10', '0.20');
    expect(result).toBe('0.30');

    const large = MoneyUtil.add('1500000.50', '2500000.75');
    expect(large).toBe('4000001.25');
  });

  it('should accurately subtract monetary values', () => {
    const result = MoneyUtil.subtract('100.00', '35.45');
    expect(result).toBe('64.55');
  });

  it('should compare amounts correctly', () => {
    expect(MoneyUtil.compare('50.00', '10.00')).toBe(1);
    expect(MoneyUtil.compare('10.00', '50.00')).toBe(-1);
    expect(MoneyUtil.compare('25.50', '25.50')).toBe(0);

    expect(MoneyUtil.isGreaterThanOrEqual('100.00', '50.00')).toBe(true);
    expect(MoneyUtil.isGreaterThanOrEqual('50.00', '50.00')).toBe(true);
    expect(MoneyUtil.isGreaterThanOrEqual('49.99', '50.00')).toBe(false);
  });

  it('should convert major units to minor units (pesewas/cents) for payment gateways', () => {
    // 10.50 GHS = 1050 pesewas
    expect(MoneyUtil.toMinorUnit('10.50')).toBe(1050);
    expect(MoneyUtil.toMinorUnit(10.5)).toBe(1050);
    expect(MoneyUtil.toMinorUnit('0.05')).toBe(5);
    expect(MoneyUtil.toMinorUnit('1000.00')).toBe(100000);
  });

  it('should convert minor units to major units string correctly', () => {
    // 1050 pesewas = "10.50" GHS
    expect(MoneyUtil.fromMinorUnit(1050)).toBe('10.50');
    expect(MoneyUtil.fromMinorUnit(5)).toBe('0.05');
    expect(MoneyUtil.fromMinorUnit('250000')).toBe('2500.00');
  });

  it('should validate financial amount strings and numbers', () => {
    expect(MoneyUtil.isValidAmount('50.00')).toBe(true);
    expect(MoneyUtil.isValidAmount(100)).toBe(true);
    expect(MoneyUtil.isValidAmount('0')).toBe(false);
    expect(MoneyUtil.isValidAmount('-15.00')).toBe(false);
    expect(MoneyUtil.isValidAmount('invalid_amount')).toBe(false);
    expect(MoneyUtil.isValidAmount(null)).toBe(false);
  });
});
