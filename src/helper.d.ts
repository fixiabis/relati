type Length<L extends any[]> = L["length"];

type ZeroBasedOrdinalRange<End extends number, Acc extends number[] = []> = Length<Acc> extends End
  ? Acc
  : ZeroBasedOrdinalRange<End, [...Acc, Length<Acc>]>;

type ZeroBasedOrdinalRangeNumber<End extends number> = ZeroBasedOrdinalRange<End>[number];

type Add<N extends number, M extends number = 1> = Length<[...ZeroBasedOrdinalRange<N>, ...ZeroBasedOrdinalRange<M>]>;

type Sub<N extends number, M extends number = 1> = ZeroBasedOrdinalRange<N> extends [
  ...ZeroBasedOrdinalRange<M>,
  ...infer U
]
  ? Length<U>
  : never;

type RangeNumber<Start extends number, End extends number> = Exclude<
  ZeroBasedOrdinalRangeNumber<End>,
  ZeroBasedOrdinalRangeNumber<Start>
>;

type RepeatedString<T extends string, N extends number> = N extends 0
  ? ""
  : `${T}${RepeatedString<T, [-1, ...ZeroBasedOrdinalRange<N>][N]>}`;

type UnionOfRepeatedString<T extends string, N extends number> = N extends 0
  ? ""
  : RepeatedString<T, N> | UnionOfRepeatedString<T, Sub<N>>;
