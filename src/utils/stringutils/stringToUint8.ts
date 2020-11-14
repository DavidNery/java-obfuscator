export const stringToUint8 = (string: string): number[] => {
  let bytes = [];

  for (var i = 0; i < string.length; ++i)
    bytes = [...bytes, string.charCodeAt(i)];

  return bytes;
}