import { TSchema, Data } from '@evolution-sdk/evolution';

export const OutputReferenceSchema = TSchema.Struct({
  txHash: TSchema.ByteArray,
  outputIndex: TSchema.Integer,
});

export type OutputReference = typeof OutputReferenceSchema.Type;

export function serialiseOutputReference(d: OutputReference): string {
  return Data.withSchema(OutputReferenceSchema).toCBORHex(d);
}

const CredentialSchema = TSchema.Union(
  TSchema.Struct(
    { PublicKeyCredential: TSchema.ByteArray },
    { flatInUnion: true },
  ),
  TSchema.Struct(
    { ScriptCredential: TSchema.ByteArray },
    { flatInUnion: true },
  ),
);

export type CredentialD = typeof CredentialSchema.Type;

export const StakeCredentialSchema = TSchema.Union(
  TSchema.Struct({ Inline: CredentialSchema }, { flatInUnion: true }),
  TSchema.Struct(
    {
      Pointer: TSchema.Struct({
        slotNumber: TSchema.Integer,
        transactionIndex: TSchema.Integer,
        certificateIndex: TSchema.Integer,
      }),
    },
    { flatInUnion: true },
  ),
);

export type StakeCredentialD = typeof StakeCredentialSchema.Type;

export const AddressSchema = TSchema.Struct({
  paymentCredential: CredentialSchema,
  stakeCredential: TSchema.NullOr(StakeCredentialSchema),
});

export type AddressD = typeof AddressSchema.Type;

export function serialiseAddressD(d: AddressD): string {
  return Data.withSchema(AddressSchema).toCBORHex(d);
}

export const AssetClassSchema = TSchema.Struct({
  currencySymbol: TSchema.ByteArray,
  tokenName: TSchema.ByteArray,
});

export type AssetClass = typeof AssetClassSchema.Type;

export function serialiseAssetClass(ac: AssetClass): string {
  return Data.withSchema(AssetClassSchema).toCBORHex(ac);
}
