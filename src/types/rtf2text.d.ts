declare module "rtf2text" {
  const rtf2text: {
    string: (rtf: string, cb: (err: Error | null, result: string) => void) => void;
  };
  export default rtf2text;
}
