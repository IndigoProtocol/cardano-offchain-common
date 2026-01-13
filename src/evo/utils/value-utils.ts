import { Assets, toHex, toUnit, Unit } from '@lucid-evolution/lucid';
import { AssetClass } from '../types.js';

export function mkLovelacesOf(amount: bigint): Assets {
  return { lovelace: amount };
}

export function assetClassToUnit(ac: AssetClass): Unit {
  return toUnit(toHex(ac.currencySymbol), toHex(ac.tokenName));
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
