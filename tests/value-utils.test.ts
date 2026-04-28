import { describe, expect, test } from 'vitest';
import { adaAssetClass, AssetClass, unitToAssetClass } from '../src/index.js';
import { fromHex } from '@lucid-evolution/lucid';

describe('Value utils', () => {
  describe('unitToAssetClass', () => {
    test('1', () => {
      expect(unitToAssetClass('')).toEqual(adaAssetClass);
      expect(
        unitToAssetClass(
          'ed541fe294f313fa9dc1131ef094adabcc58aa1570643e406461afa7.4e49474854',
        ),
      ).toEqual({
        currencySymbol: fromHex(
          'ed541fe294f313fa9dc1131ef094adabcc58aa1570643e406461afa7',
        ),
        tokenName: fromHex('4e49474854'),
      } satisfies AssetClass);
    });
  });
});
