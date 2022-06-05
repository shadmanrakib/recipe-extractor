import { Recipe } from "../models/recipe";
import mergeArrayOfObjects from "./mergeArrayOfObjects";
import { load, Element } from "cheerio";
import { fromUrl, parseDomain, ParseResultType } from "parse-domain";

// const fromUrl = (urlLike: string) =>  import("parse-domain").then(({ fromUrl }) => fromUrl(urlLike));
// const parseDomain = (hostname: string | typeof NO_HOSTNAME, options?: ParseDomainOptions | undefined) =>  import("parse-domain").then(({ parseDomain }) => parseDomain(hostname, options));

export default async function parseRFDa(recipe: Recipe, microdata: Element | Element[]): Promise<Recipe> {
    const out = { ...recipe };

    if (Array.isArray(microdata)) {
        const toMerge: Partial<Recipe>[] = [out];

        for (let i = 0; i < microdata.length; i++) {
            const microdataElement = microdata[i];

            toMerge.push(await parseRFDa(out, microdataElement));
        }

        const merged = mergeArrayOfObjects(toMerge);

        const newRecipe: Recipe = {
            ...out,
            ...merged
        }

        return newRecipe;
    } else {
        const $ = load(microdata);

        if (microdata.attribs["typeof"] === "Recipe") {

            console.log("isRecipe")

            const ingredientElements: Element[] = $("[property='recipeIngredient'], [property='ingredients']").toArray();

            if (ingredientElements.length > 0) {
                out.ingredients = ingredientElements.map(e => ($(e).text() || "").replace(/\n/g, " ").trim());
            }

            const directionElements: Element[] = $("[property='recipeInstructions']").toArray();

            if (directionElements.length > 0) {
                out.directions = directionElements.map(e => ($(e).text() || "").replace(/\n/g, " ").trim());
            }

            const nameElements: Element[] = $("[property='name']").toArray();

            if (nameElements.length > 0) {
                out.name = ($(nameElements[0]).text() || "").replace(/\n/g, " ").trim();
            }

            const recipeCategoryElements: Element[] = $("[property='recipeCategory']").toArray();

            if (recipeCategoryElements.length > 0) {
                out.category = ($(recipeCategoryElements[0]).text() || "").replace(/\n/g, " ").trim();
            }

            const recipeCuisineElements: Element[] = $("[property='recipeCuisine']").toArray();

            if (recipeCuisineElements.length > 0) {
                out.cuisine = ($(recipeCuisineElements[0]).text() || "").replace(/\n/g, " ").trim();
            }

            const descriptionElements: Element[] = $("[property='description']").toArray();

            if (descriptionElements.length > 0) {
                out.description = ($(descriptionElements[0]).text() || "").replace(/\n/g, " ").trim();
            }

            const prepTimeElements: Element[] = $("[property='prepTime']").toArray();

            if (prepTimeElements.length > 0) {
                out.prepTime = ($(prepTimeElements[0]).text() || "").replace(/\n/g, " ").trim();
            }

            const cookTimeElements: Element[] = $("[property='cookTime']").toArray();

            if (cookTimeElements.length > 0) {
                out.cookTime = ($(cookTimeElements[0]).text() || "").replace(/\n/g, " ").trim();
            }

            const totalTimeElements: Element[] = $("[property='totalTime']").toArray();

            if (totalTimeElements.length > 0) {
                out.totalTime = ($(totalTimeElements[0]).text() || "").replace(/\n/g, " ").trim();
            }

            const yieldElements: Element[] = $("[property='recipeYield'], [property='yield']").toArray();

            if (yieldElements.length > 0) {
                out.yield = ($(yieldElements[0]).text() || "").replace(/\n/g, " ").trim();
            }

            const authorElements: Element[] = $("[property='author']").toArray();
            const authorNameElements: Element[] = $("[property='author'] > [property='name']").toArray();

            if (authorNameElements.length > 0) {
                out.author = ($(authorNameElements[0]).text() || "").replace(/\n/g, " ").trim();
            } else if (authorElements.length > 0) {
                out.author = ($(authorElements[0]).text() || "").replace(/\n/g, " ").trim();
            }


            const imageElements: Element[] = $("img[property='image']").toArray();
            if (imageElements.length > 0) {
                const imgAttr = imageElements[0].attribs || {};

                if (imgAttr["src"]) {
                    let imgUrl = imgAttr["src"];
                    if (!(imgUrl.startsWith("https") || imgUrl.startsWith("http"))) {
                        const parsedImgUrlDomain = parseDomain(imgUrl);
                        switch (parsedImgUrlDomain.type) {
                            case ParseResultType.Ip:
                                break
                            case ParseResultType.Listed:
                                break;
                            default:
                                const parsedBaseUrl = parseDomain(fromUrl(recipe.url));
                                if (parsedBaseUrl.type === ParseResultType.Listed) {
                                    imgUrl = `https://${parsedBaseUrl.hostname}/${imgUrl}`
                                };
                                break;
                        }
                    }

                    out.image = (imgUrl).replace(/\n/g, " ").trim();
                }
            }
        }

        return out;
    }
}