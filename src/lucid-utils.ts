import {
  Assets,
  calculateMinLovelaceFromUTxO,
  Data,
  Datum,
  LucidEvolution,
  OutRef,
  ProtocolParameters,
  Script,
  TxBuilder,
  UTxO,
} from '@lucid-evolution/lucid';
import { OutputDatumD } from './lucid/types.js';
import { match, P } from 'ts-pattern';

export function isSameOutRef(a: OutRef, b: OutRef): boolean {
  return a.outputIndex === b.outputIndex && a.txHash === b.txHash;
}

/**
 * Returns the inline datum.
 * Throws when the UTXO doesn't have an inline datum
 * (i.e. in case it has hash datum or no datum).
 */
export function getInlineDatumOrThrow(utxo: UTxO): Datum {
  if (utxo.datum) {
    return utxo.datum;
  }

  throw new Error(
    'Expected an inline datum for OutRef: ' +
      JSON.stringify({
        txHash: utxo.txHash,
        outputIndex: utxo.outputIndex,
      } as OutRef),
  );
}

/**
 * Estimate the min lovelace for a UTXO so it can be created.
 */
export function estimateUtxoMinLovelace(
  protocolParameters: ProtocolParameters,
  destinationAddr: string,
  assets: Assets,
  destinationDatum: OutputDatumD | undefined = undefined,
  scriptRef: Script | undefined = undefined,
): bigint {
  return calculateMinLovelaceFromUTxO(protocolParameters.coinsPerUtxoByte, {
    address: destinationAddr,
    datumHash: match(destinationDatum)
      .with({ DatumHash: { hash: P.select() } }, (dHash) => dHash)
      .otherwise(() => null),
    datum: match(destinationDatum)
      .with({ InlineDatum: { datum: P.select() } }, (data) => Data.to(data))
      .otherwise(() => null),
    assets: assets,
    // Use dummy tx hash and out idx
    txHash: '0000000000000000000000000000000000000000000000000000000000000000',
    outputIndex: 0,
    scriptRef: scriptRef ?? null,
  });
}

export async function balanceSignSubmitAndAwaitTx(
  lucid: LucidEvolution,
  transaction: Promise<TxBuilder>,
): Promise<string> {
  const txHash = await transaction
    .then((tx) => tx.complete())
    .then((tx) => tx.sign.withWallet().complete())
    .then((tx) => tx.submit());

  await lucid.awaitTx(txHash);
  return txHash;
}
