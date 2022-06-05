import { Recipe } from "../models/recipe";
import mergeArrayOfObjects from "./mergeArrayOfObjects";
import { load, Element } from "cheerio";
import { fromUrl, parseDomain, ParseResultType } from "parse-domain";

// const fromUrl = (urlLike: string) =>  import("parse-domain").then(({ fromUrl }) => fromUrl(urlLike));
// const parseDomain = (hostname: string | typeof NO_HOSTNAME, options?: ParseDomainOptions | undefined) =>  import("parse-domain").then(({ parseDomain }) => parseDomain(hostname, options));

export default async function parseMicrodata(recipe: Recipe, microdata: Element | Element[]): Promise<Recipe> {
    const out = { ...recipe };

    if (Array.isArray(microdata)) {
        const toMerge: Partial<Recipe>[] = [out];

        for (let i = 0; i < microdata.length; i++) {
            const microdataElement = microdata[i];

            toMerge.push(await parseMicrodata(out, microdataElement));
        }

        const merged = mergeArrayOfObjects(toMerge);

        const newRecipe: Recipe = {
            ...out,
            ...merged
        }

        return newRecipe;
    } else {
        const $ = load(microdata);

        if (microdata.attribs["itemtype"] === "https://schema.org/Recipe") {

            console.log("isRecipe")

            const ingredientElements : Element[] = $("[itemprop='recipeIngredient'], [itemprop='ingredients']").toArray();

            if (ingredientElements.length > 0) {
                out.ingredients = ingredientElements.map(e => ($(e).text() || "").replace(/\n/g, " ").trim());
            }

            const directionElements : Element[] = $("[itemprop='recipeInstructions']").toArray();

            if (directionElements.length > 0) {
                out.directions = directionElements.map(e => ($(e).text() || "").replace(/\n/g, " ").trim());
            }

            const nameElements : Element[] = $("[itemprop='name']").toArray();

            if (nameElements.length > 0) {
                out.name = ($(nameElements[0]).text() || "").replace(/\n/g, " ").trim();
            }

            const recipeCategoryElements : Element[] = $("[itemprop='recipeCategory']").toArray();

            if (recipeCategoryElements.length > 0) {
                out.category = ($(recipeCategoryElements[0]).text() || "").replace(/\n/g, " ").trim();
            }

            const recipeCuisineElements : Element[] = $("[itemprop='recipeCuisine']").toArray();

            if (recipeCuisineElements.length > 0) {
                out.cuisine = ($(recipeCuisineElements[0]).text() || "").replace(/\n/g, " ").trim();
            }

            const descriptionElements : Element[] = $("[itemprop='description']").toArray();

            if (descriptionElements.length > 0) {
                out.description = ($(descriptionElements[0]).text() || "").replace(/\n/g, " ").trim();
            }

            const prepTimeElements : Element[] = $("[itemprop='prepTime']").toArray();

            if (prepTimeElements.length > 0) {
                out.prepTime = ($(prepTimeElements[0]).text() || "").replace(/\n/g, " ").trim();
            }

            const cookTimeElements : Element[] = $("[itemprop='cookTime']").toArray();

            if (cookTimeElements.length > 0) {
                out.cookTime = ($(cookTimeElements[0]).text() || "").replace(/\n/g, " ").trim();
            }

            const totalTimeElements : Element[] = $("[itemprop='totalTime']").toArray();

            if (totalTimeElements.length > 0) {
                out.totalTime = ($(totalTimeElements[0]).text() || "").replace(/\n/g, " ").trim();
            }

            const yieldElements : Element[] = $("[itemprop='recipeYield'], [itemprop='yield']").toArray();

            if (yieldElements.length > 0) {
                out.yield = ($(yieldElements[0]).text() || "").replace(/\n/g, " ").trim();
            }

            const authorElements : Element[] = $("[itemprop='author']").toArray();
            const authorNameElements : Element[] = $("[itemprop='author'] > [itemprop='name']").toArray();

            if (authorNameElements.length > 0) {
                out.author = ($(authorNameElements[0]).text() || "").replace(/\n/g, " ").trim();
            } else if (authorElements.length > 0) {
                out.author = ($(authorElements[0]).text() || "").replace(/\n/g, " ").trim();
            } 


            const imageElements : Element[] = $("img[itemprop='image']").toArray();
            if (imageElements.length > 0) {
                const imgAttr = imageElements[0].attribs ||{};
                
                if (imgAttr["src"]) {
                    let imgUrl = imgAttr["src"];
                    if (!(imgUrl.startsWith("https") || imgUrl.startsWith("http"))) {
                        console.log(fromUrl(imgUrl))
                    }

                    out.image = (imgUrl).replace(/\n/g, " ").trim();
                }
            } 

            // if (parsedSchema.image) {
            //     const image = parsedSchema.image as URL | ImageObject | (URL | ImageObject)[];

            //     if (typeof image === "string") {
            //         out.image = image;
            //     } else if (Array.isArray(image)) {
            //         if (image.length > 0) {
            //             if (typeof image[0] === "string") {
            //                 out.image = image[0]
            //             } else if (typeof image[0]?.url === "string") {
            //                 out.image = image[0].url;
            //             }
            //         }
            //     } else if (typeof image["url"] === "string") {
            //         out.image = image.url;
            //     }
            // }
        }

        return out;
    }
}