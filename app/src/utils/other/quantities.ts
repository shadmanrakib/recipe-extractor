const numberFractionRegex = /^[-]?((((\d+(\.\d+)?)|(\d+\/\d+))?)|(\d+((\.\d+)|(\s\d+\/\d+))?))$/;

export const isValidQuantity = (qty: string) => {
  if (!qty) return true;
  if (qty === "") return true;
  return numberFractionRegex.test(qty);
}

export const quantityParser = (qty: string) => {
  if (isValidQuantity(qty)) {
    const tokens = qty ? (qty + "").split(" ") : [];

    if (tokens.length > 0) {
      if (tokens.length > 1) {
        const firstToken = tokens[0];
        const firstTokenValue = Number.parseFloat(firstToken);

        const secondToken = tokens[1];
        const secondTokenSplit = secondToken.split("/");

        if (secondTokenSplit.length === 2) {
          const numerator = Number.parseFloat(secondTokenSplit[0]);
          const denominator = Number.parseFloat(secondTokenSplit[1]);

          return "" + (Math.abs(firstTokenValue) + (numerator / denominator)) * (firstTokenValue < 0 ? - 1 : 1);
        } else {
          throw new Error("Not valid quantity");
        }
      } else {
        const token = tokens[0];
        const tokenSplit = token.split("/");

        if (tokenSplit.length === 1) {
          return "" + Number.parseFloat(tokenSplit[0])
        } else if (tokenSplit.length === 2) {
          const numerator = Number.parseFloat(tokenSplit[0]);
          const denominator = Number.parseFloat(tokenSplit[1]);

          return "" + (numerator / denominator)
        } else {
          throw new Error("Not valid quantity");
        }
      }
    } else {
      return "";
    }
  } else {
    throw new Error("Not valid quantity");
  }
}

export function extractQty(original: string) : string {
  let qty: string | null = "";

  const tokens = original.split(" ");

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (numberFractionRegex.test(token)) {
      qty = token;

      for (let j = i + 1; j < tokens.length; j++) {
        const next = tokens[j];

        if (numberFractionRegex.test(qty + " " + next)) {
          qty = qty + " " + next;
        } else {
          break;
        }
      }

      break;
    }
  }

  return qty;
}