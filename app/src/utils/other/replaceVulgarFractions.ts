export default function replaceVulgarFractions (str: string) : string {
    let out = str;
  
    const replacements : Record<string, string> = {
      "¼": "1/4",
      "½": "1/2",
      "¾": "3/4",
      "⅐": "1/7",
      "⅑": "1/9",
      "⅒": "1/10",
      "⅓": "1/3",
      "⅔": "2/3",
      "⅕": "1/5",
      "⅖": "2/5",
      "⅗": "3/5",
      "⅘": "4/5",
      "⅙": "1/6",
      "⅚": "5/6",
      "⅛": "1/8",
      "⅜": "3/8",
      "⅝": "5/8",
      "⅞": "7/8",
      "⅟": "1/",
      "↉": "0/3",
    }
  
    const vulgar = Object.keys(replacements);
  
    for (let i = 0; i < vulgar.length; i++) {
      const key = vulgar[i];
      out = out.replace(key, replacements[key])
    }
  
    return out;
  }