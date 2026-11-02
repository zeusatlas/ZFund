import { isReservedSlug, slugify } from '../../src/common/utils/slug';

describe('Slug Utility & Public Portal Routing', () => {
  it('converts host names and campaign titles into clean URL-safe slugs', () => {
    expect(slugify('Koranteng Kessie')).toBe('koranteng-kessie');
    expect(slugify('Emergency Surgery for Baby Kofi (2026)!')).toBe('emergency-surgery-for-baby-kofi-2026');
    expect(slugify('Holy Trinity Church - Harvest & Outreach')).toBe('holy-trinity-church-harvest-outreach');
    expect(slugify('   Multiple    Spaces   And---Dashes   ')).toBe('multiple-spaces-and-dashes');
  });

  it('correctly identifies and blocks reserved system slugs', () => {
    expect(isReservedSlug('admin')).toBe(true);
    expect(isReservedSlug('host')).toBe(true);
    expect(isReservedSlug('login')).toBe(true);
    expect(isReservedSlug('api')).toBe(true);
    expect(isReservedSlug('settings')).toBe(true);
    expect(isReservedSlug('contact')).toBe(true);

    expect(isReservedSlug('koranteng-kessie')).toBe(false);
    expect(isReservedSlug('holy-trinity')).toBe(false);
    expect(isReservedSlug('emergency-fund')).toBe(false);
  });

  it('matches campaigns by slugified name fallback when DB slug is null', () => {
    const campaigns = [
      { id: 'uuid-1', name: 'Emergency Surgery for Baby Kofi', slug: null, eventCode: '1002' },
      { id: 'uuid-2', name: 'Holy Trinity Church Project', slug: 'holy-trinity-church', eventCode: '1001' },
    ];

    const targetSlug = 'emergency-surgery-for-baby-kofi';
    const matched = campaigns.find(
      (c) =>
        c.slug === targetSlug ||
        slugify(c.name) === targetSlug ||
        c.eventCode === targetSlug ||
        c.id === targetSlug
    );

    expect(matched).toBeDefined();
    expect(matched?.id).toBe('uuid-1');
  });
});
