export const obfuscatedString = (minSize = 5, maxSize = 10) => {
  let obfuscated = '';

  const stringLen = Math.floor((Math.random() * maxSize) + minSize);
  for(let i = 0; i < stringLen; i++)
    obfuscated += (Math.random() <= 0.5 ? 'l' : "I");

  return obfuscated;
};