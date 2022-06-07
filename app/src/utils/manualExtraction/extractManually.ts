import { CheerioAPI } from "cheerio";
import { Recipe } from "src/models/recipe";

export default function extractManually(parsed: Recipe, $: CheerioAPI) {
    const out = {...parsed};
    
    const ings = [];
    const dirs = [];

    if (!parsed.name) {
        out.name = ($("title").text() || "").trim();
    }

    return out;
}