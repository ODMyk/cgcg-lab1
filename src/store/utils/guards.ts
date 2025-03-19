export const checkProp = <T extends string | number>(
  input: unknown,
  prop: T,
): input is {[t in T]: unknown} => {
  return typeof input === 'object' && input !== null && prop in input;
};
