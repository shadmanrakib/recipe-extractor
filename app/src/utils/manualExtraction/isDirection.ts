import { commonDirectionKeywords, commonIngredientTokens, commonToolTokens, stopwords } from "../other/keywords";

export default function isDirection(str: string, bias: number = 0) : boolean {
    let score = 0 + bias;

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

    if (str.length <= 100) {
        score += Math.log(str.length + 1) * 0.5;
    } else if (str.length <= 2000) {
        score += Math.log(100 + 1) * 0.5;
    } else {
        score -= 200000;
    }

    const lower = trimmed.toLowerCase();
    const tokens = lower.split(" ").map((s) => s.trim().endsWith(",") || s.trim().endsWith(".") || s.trim().endsWith(";") || s.trim().endsWith("!") ? s.trim().substring(0, s.length - 1) : s.trim()).filter((s) => s);
    const usefulTokens = tokens.filter((s) => !stopwords.has(s));
    const usefulConcat = usefulTokens.join(" ");


    let ing = 0;
    let tool = 0;
    let dir = 0;

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i].replace(/[;,-]/g, " ");
        if (commonIngredientTokens.has(token)) {
            ing++;
        } else if (commonToolTokens.has(token)) {
            tool++;
        } else if (commonDirectionKeywords.has(token)) {
            dir++;
        }
    }

    score += 0.4 * 0.35 * 0.35 * (ing * ing)
    score += 0.4 * 0.65 * 0.65 * (tool * tool) + (tool / usefulTokens.length)
    score += 0.5 * 0.95 * 0.95 * (dir * dir) + (Math.pow((dir / usefulTokens.length), 3)) * (Math.pow(7, (-1 * 0.5 * usefulTokens.length)) + 1) * 80

    score += (usefulConcat.length / 2 + ing + tool + dir) * 0.03

    score -= (usefulConcat.length - ing - tool - dir) * 0.01;

    // console.log(str.substring(0,20), score, score >= 10)

    return score >= 10;
}