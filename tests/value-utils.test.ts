import { describe, expect, test } from 'vitest';
import {
  adaAssetClass,
  AssetClass,
  assetClassToUnit,
  partitionAssetsBySign,
  unitToAssetClass,
} from '../src/index.js';
import { fromHex } from '@lucid-evolution/lucid';

describe('Value utils', () => {
  describe('assetClassToUnit', () => {
    test('1', () => {
      expect(
        assetClassToUnit({
          currencySymbol: fromHex(
            'ed541fe294f313fa9dc1131ef094adabcc58aa1570643e406461afa7',
          ),
          tokenName: fromHex('4e49474854'),
        }),
      ).toEqual(
        'ed541fe294f313fa9dc1131ef094adabcc58aa1570643e406461afa74e49474854',
      );
    });
  });

  describe('unitToAssetClass', () => {
    test('1', () => {
      expect(unitToAssetClass('', { adaUnit: '' })).toEqual(adaAssetClass);
      expect(unitToAssetClass('lovelace', { adaUnit: 'lovelace' })).toEqual(
        adaAssetClass,
      );
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

  describe('partitionAssetsBySign', () => {
    test('splits positive and negative amounts', () => {
      expect(
        partitionAssetsBySign({
          lovelace: 100n,
          tokenA: -50n,
          tokenB: 25n,
          tokenC: -1n,
        }),
      ).toEqual({
        positive: { lovelace: 100n, tokenB: 25n },
        negative: { tokenA: -50n, tokenC: -1n },
      });
    });

    test('omits zero amounts', () => {
      expect(
        partitionAssetsBySign({
          lovelace: 0n,
          tokenA: 10n,
          tokenB: -10n,
        }),
      ).toEqual({
        positive: { tokenA: 10n },
        negative: { tokenB: -10n },
      });
    });

    test('returns empty objects for empty input', () => {
      expect(partitionAssetsBySign({})).toEqual({
        positive: {},
        negative: {},
      });
    });

    test('returns empty objects when all amounts are zero', () => {
      expect(partitionAssetsBySign({ lovelace: 0n, tokenA: 0n })).toEqual({
        positive: {},
        negative: {},
      });
    });
  });
});
