import { Cheerio, CheerioAPI, Element } from "cheerio";
import { Recipe } from "src/models/recipe";
import isDirection from "./isDirection";
import isIngredient from "./isIngredient";
import similarity from "fast-levenshtein";

export default function extractManually(parsed: Recipe, $: CheerioAPI) {
    const out = { ...parsed };

    if (!parsed.name) {
        out.name = ($("title").text() || "").trim();
    }

    if ((!parsed.ingredients || parsed.ingredients.length == 0) || (!parsed.directions || parsed.directions.length == 0)) {
        let children: Cheerio<Element>[] = [];
        const ings : string[] = [];
        const dirs : string[] = [];

        function bfs(elem: Cheerio<Element>) {
            const currentElemChildren = elem.children().toArray();

            if (currentElemChildren.length === 0) {
                const dirHint = elem.parent() && (elem.hasClass("direction") || elem.hasClass("step") || elem.hasClass("instruction") || elem.parent().text().includes("Method") || elem.parent().text().includes("Directions") || elem.parent().text().includes("Instructions") || elem.parent().text().includes("Steps") || elem.parent().hasClass("method") || elem.parent().hasClass("directions") || elem.parent().hasClass("instructions") || elem.parent().hasClass("steps") )
                const ingHint = elem.parent() && (elem.hasClass("ingredient") || elem.parent().text().includes("Ingredients") || elem.parent().hasClass("ingredients"))

                if (isIngredient(elem.text() || "", ingHint ? 0.5 : 0)) {
                    if (!(elem.parent() && similarity.get(elem.text().trim(), elem.parent().text().trim()) < 3 && (elem.parent().text().trim().endsWith(":") || elem.parent().text().trim().endsWith(";") || elem.parent().text().trim().endsWith("."))))
                        ings.push(elem.text());
                } else if (isDirection(elem.text() || "", dirHint ? 5 : 0)) {
                    dirs.push(elem.text());
                }
            }

            for (let i = 0; i < currentElemChildren.length; i++) {
                const child = currentElemChildren[i];
                children.push($(child));
            }

            const childrenToLoopOver = children;
            children = [];

            for (let i = 0; i < childrenToLoopOver.length; i++) {
                const child = childrenToLoopOver[i];
                bfs($(child));
            }
        }

        const bodyElement = $("body");

        if (bodyElement) {
            bfs(bodyElement);

            if (!parsed.ingredients || parsed.ingredients.length === 0) {
                out.ingredients = ings;
            }

            if (!parsed.directions || parsed.directions.length === 0) {
                out.directions = dirs;
            }
        };
    }

    return out;
}