import { Assets, toHex, toUnit, Unit } from '@lucid-evolution/lucid';
import { AssetClass } from '../types.js';

export function mkLovelacesOf(amount: bigint): Assets {
  return { lovelace: amount };
}

export function assetClassToUnit(ac: AssetClass): Unit {
  const policy = toHex(ac.currencySymbol);
  const name = toHex(ac.tokenName);

  if (policy === '') {
    if (name !== '') {
      throw new Error('Expected empty asset name for lovelace.');
    }

    return 'lovelace';
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
  return assets.lovelace ?? 0n;
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

export function isAssetsZero(assets: Assets): boolean {
  return Object.entries(assets).every(([_, amt]) => amt === 0n);
}
