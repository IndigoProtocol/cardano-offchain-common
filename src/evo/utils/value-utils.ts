import {
  addAssets,
  Assets,
  fromHex,
  toHex,
  toUnit,
  Unit,
} from '@lucid-evolution/lucid';
import { AssetClass } from '../types.js';
import { match, P } from 'ts-pattern';

export const adaAssetClass: AssetClass = {
  currencySymbol: fromHex(''),
  tokenName: fromHex(''),
};

export function mkLovelacesOf(amount: bigint): Assets {
  return { lovelace: amount };
}

export function assetClassToUnit(
  ac: AssetClass,
  /**
   * The default `lovelace` is based on the lucid convention.
   * If you're using it outside of lucid, you can specify your own unit for ADA here.
   */
  config: { adaUnit: string } = { adaUnit: 'lovelace' },
): Unit {
  const policy = toHex(ac.currencySymbol);
  const name = toHex(ac.tokenName);

  if (policy === '') {
    if (name !== '') {
      throw new Error('Expected empty asset name for lovelace.');
    }

    return config.adaUnit;
  }

  return toUnit(policy, name);
}

export function isSameAssetClass(ac1: AssetClass, ac2: AssetClass): boolean {
  return (
    toHex(ac1.tokenName) === toHex(ac2.tokenName) &&
    toHex(ac1.currencySymbol) === toHex(ac2.currencySymbol)
  );
}

export function mkAssetsOf(assetClass: AssetClass, amount: bigint): Assets {
  return {
    [assetClassToUnit(assetClass)]: amount,
  };
}

export function lovelacesAmt(assets: Assets): bigint {
  return assets['lovelace'] ?? 0n;
}

export function assetClassValueOf(
  assets: Assets,
  assetClass: AssetClass,
): bigint {
  return assets[assetClassToUnit(assetClass)] ?? 0n;
}

export function negateAssets(assets: Assets): Assets {
  return Object.fromEntries(
    Object.entries(assets).map(([asset, amt]) => [asset, -amt]),
  );
}

export function noAdaValue(assets: Assets): Assets {
  return addAssets(assets, negateAssets(mkLovelacesOf(lovelacesAmt(assets))));
}

export function isAssetsZero(assets: Assets): boolean {
  return Object.entries(assets).every(([_, amt]) => amt === 0n);
}

export function unitToAssetClass(
  asset: string,
  /**
   * The default `lovelace` is based on the lucid convention.
   * If you're using it outside of lucid, you can specify your own unit for ADA here.
   */
  config: { adaUnit: string } = { adaUnit: 'lovelace' },
): AssetClass {
  if (asset === config.adaUnit) {
    return adaAssetClass;
  }

  return match(asset.split('.'))
    .returnType<AssetClass>()
    .with([P.string, P.string], ([policy, asset]) => {
      return { currencySymbol: fromHex(policy), tokenName: fromHex(asset) };
    })
    .otherwise(() => {
      throw new Error(`Unknown asset format. Asset: ${asset}`);
    });
}

/**
 * Partition the assets to positive and negative amounts. Omit zero amounts.
 */
export function partitionAssetsBySign(assets: Assets): {
  positive: Assets;
  negative: Assets;
} {
  const positive: Assets = {};
  const negative: Assets = {};

  for (const [unit, amt] of Object.entries(assets)) {
    if (amt > 0n) {
      positive[unit] = amt;
    } else if (amt < 0n) {
      negative[unit] = amt;
    }
  }

  return { positive, negative };
}
