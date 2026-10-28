describe('Campaign Code Sequential Generator Pattern', () => {
  function computeNextCode(
    existingCodes: string[],
    recentCodes: string[] = existingCodes
  ): string {
    let lastCodeNumber: number | null = null;
    for (const code of recentCodes) {
      const trimmed = code?.trim();
      if (trimmed && /^\d{4}$/.test(trimmed)) {
        const num = parseInt(trimmed, 10);
        if (!isNaN(num) && num >= 1000 && num <= 9999) {
          lastCodeNumber = num;
          break;
        }
      }
    }

    const set = new Set(existingCodes.map((c) => c?.trim()).filter(Boolean));
    const all4Digit = Array.from(set)
      .filter((c): c is string => !!c && /^\d{4}$/.test(c))
      .map((c) => parseInt(c, 10))
      .filter((n) => !isNaN(n) && n >= 1000 && n <= 9999);

    const maxCode = all4Digit.length > 0 ? Math.max(...all4Digit) : 1000;
    let candidate = lastCodeNumber !== null ? lastCodeNumber + 1 : (maxCode >= 1001 ? maxCode + 1 : 1001);

    while (set.has(candidate.toString())) {
      candidate++;
    }

    return candidate.toString();
  }

  it('should start with 1001 when there are no existing campaigns', () => {
    expect(computeNextCode([])).toBe('1001');
  });

  it('should return 1002 when last campaign code is 1001', () => {
    expect(computeNextCode(['1001'], ['1001'])).toBe('1002');
  });

  it('should return 1003 when last campaign code is 1002', () => {
    expect(computeNextCode(['1001', '1002'], ['1002', '1001'])).toBe('1003');
  });

  it('should increment accurately from the last campaign code pattern', () => {
    expect(computeNextCode(['1001', '1002', '1003'], ['1003', '1002', '1001'])).toBe('1004');
  });

  it('should skip any already taken codes to prevent collision', () => {
    // If 1002 is already taken for some reason, next code after 1001 should be 1003
    expect(computeNextCode(['1001', '1002'], ['1001'])).toBe('1003');
  });
});

