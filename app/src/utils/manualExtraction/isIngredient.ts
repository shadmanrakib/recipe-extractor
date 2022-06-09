/*
What makes an ingredient?
Ingredients have qtys, units, and names.
Ex: 1 tsp sugar, 1 : qty, tsp: unit, sugar: name
All ingredients must have names, but qty, and units are not necessary. 
Still, they are great indicators.
We use heuristics to determine whether something is an ingredient.
*/

import { extractQty, quantityParser } from "../other/quantities";
import replaceVulgarFractions from "../other/replaceVulgarFractions";
import { commonIngredientTokens, highPriorityIngredientTokens, lowPriorityIngredientTokens, stopwords } from "../other/keywords";
import UNITS from "../other/units";

export default function isIngredient(str: string, bias: number = 0): boolean {
    let score = 0 + bias;
    let normalized = replaceVulgarFractions(str.trim().toLowerCase());
    let qty: string = "";
    let unit: string = "";
    let name: string = "";

    if (normalized.endsWith(":")) { score -= 10 };
    const extractedQty = extractQty(normalized);

    if (extractedQty != "") {
        qty = extractedQty;
        score += 0.75;

        if (normalized.indexOf(extractedQty) == 0) {
            score += 0.75;
        }
    }

    const unitAndName = normalized.replace(extractedQty, "");

    const tokens = unitAndName.split(" ").map((s) => s.trim().endsWith(",") ? s.trim().substring(0, s.length - 1) : s.trim()).filter((s) => s);

    if (tokens.length > 0 && UNITS[tokens[0]]) {
        unit = tokens[0];
        score += 2;
    }

    if (!unit) {
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (UNITS[token]) {
                unit = token;
                score += 0.75;
            }
        }
    }

    name = unitAndName.replace(unit, "");
    const nameTokens = name.split(" ").map((s) => s.trim().endsWith(",") ? s.trim().substring(0, s.length - 1) : s.trim()).filter((s) => s);
    const usefulNameTokens = nameTokens.filter((s) => !stopwords.has(s));

    if (usefulNameTokens.length > 0) {
        score += 0.75;
    }

    let numOfKeywords = 0;
    let numOfHighKeywords = 0;
    let numOfLowKeywords = 0;

    for (let i = 0; i < usefulNameTokens.length; i++) {
        const token = usefulNameTokens[i];
        if (commonIngredientTokens.has(token)) {
            numOfKeywords++;
        }
        if (highPriorityIngredientTokens.has(token)) {
            numOfHighKeywords++;
        }
        if (lowPriorityIngredientTokens.has(token)) {
            numOfLowKeywords++;
        }
    }

    score += Math.log(numOfHighKeywords + 1) * 1.5;
    score += Math.log(numOfLowKeywords + 1) * 0.5;

    score -= Math.log(nameTokens.length + 1) * 0.25 // penalize long strings
    score -= Math.log(nameTokens.length - numOfKeywords + 1) * 0.75 // penalize strings with unknown words

    if (nameTokens.length > 7) {
        score -= Math.log(10)
    }

    if (normalized.endsWith(".") || normalized.endsWith(":") || normalized.endsWith("?") || normalized.endsWith("!")) {
        score -= 3;
    }

    if (nameTokens.length > 3) {
        score -= (nameTokens.length - numOfKeywords) * 0.25;
    }

    // console.log(normalized, score, score >= 1.2)

    return score >= 1.3;
}