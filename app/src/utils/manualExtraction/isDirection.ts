import { commonDirectionKeywords, commonIngredientTokens, commonToolTokens, stopwords } from "../other/keywords";

export default function isDirection(str: string) : boolean {
    let score = 0;

    const trimmed = str.trim();

    const directionLabelMatches = trimmed.match(/(\d+)((\))|(\.\s))/g) || [];

    if (directionLabelMatches?.length > 0 && trimmed.startsWith(directionLabelMatches[0])) {
        score += 6;
    }

    if (trimmed.endsWith(".")) {
        score += 0.2;
    }
    
    if (trimmed.endsWith("!")) {
        score += 0.1;
    }

    if (trimmed.endsWith(":")) {
        score -= 1;
    }

    if (trimmed.length > 0 && (/[A-Z]/).test(trimmed.charAt(0))) {
        score += 0.2;
    }

    score += Math.log(str.length + 1) * 0.5;

    const lower = trimmed.toLowerCase();
    const tokens = lower.split(" ").map((s) => s.trim().endsWith(",") ? s.trim().substring(0, s.length - 1) : s.trim()).filter((s) => s);
    const usefulTokens = tokens.filter((s) => !stopwords.has(s));
    const usefulConcat = usefulTokens.join(" ");


    let ing = 0;
    let tool = 0;
    let dir = 0;

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (commonIngredientTokens.has(token)) {
            ing++;
        }
        if (commonToolTokens.has(token)) {
            tool++;
        }
        if (commonDirectionKeywords.has(token)) {
            dir++;
        }
    }

    score += 0.1 * 0.4 * 0.4 * (ing * ing)
    score += 0.2 * 0.50 * 0.50 * (tool * tool) + (tool / usefulTokens.length)
    score += 0.5 * 0.75 * 0.75 * (dir * dir) + (Math.pow((dir / usefulTokens.length), 3)) * (Math.pow(7, (-1 * 0.5 * usefulTokens.length)) + 1) * 80

    score += usefulConcat.length * 0.03

    console.log(str, score, score >= 10)

    return score >= 10;
}