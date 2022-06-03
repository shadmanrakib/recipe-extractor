import { Recipe } from "src/models/recipe";
import mergeArrayOfObjects from "./mergeArrayOfObjects";
import { load, Element } from "cheerio";

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
        const attr = $().attr() || {};

        if (attr["itemtype"] === "https://schema.org/Recipe") {

            const ingredientElements = $("[itemprop='recipeIngredient'], [itemprop='ingredients']").toArray();

            if (ingredientElements.length > 0) {
                out.ingredients = ingredientElements.map(e => ($(e).text() || "").trim());
            }


            const directionElements = $("[itemprop='recipeInstructions']").toArray();

            if (directionElements.length > 0) {
                out.directions = directionElements.map(e => ($(e).text() || "").trim());
            }

            const nameElements = $("[itemprop='name']").toArray();

            if (nameElements.length > 0) {
                out.name = ($(nameElements[0]).text() || "").trim();
            }

            const recipeCategoryElements = $("[itemprop='recipeCategory']").toArray();

            if (recipeCategoryElements.length > 0) {
                out.category = ($(recipeCategoryElements[0]).text() || "").trim();
            }

            const recipeCuisineElements = $("[itemprop='recipeCuisine']").toArray();

            if (recipeCuisineElements.length > 0) {
                out.cuisine = ($(recipeCuisineElements[0]).text() || "").trim();
            }

            const descriptionElements = $("[itemprop='description']").toArray();

            if (descriptionElements.length > 0) {
                out.description = ($(descriptionElements[0]).text() || "").trim();
            }

            const prepTimeElements = $("[itemprop='prepTime']").toArray();

            if (prepTimeElements.length > 0) {
                out.prepTime = ($(prepTimeElements[0]).text() || "").trim();
            }

            const cookTimeElements = $("[itemprop='cookTime']").toArray();

            if (cookTimeElements.length > 0) {
                out.cookTime = ($(cookTimeElements[0]).text() || "").trim();
            }


            // if (parsedSchema.author && typeof parsedSchema.author === "string") {
            //     out.author = parsedSchema.author;
            // } else if (Array.isArray(parsedSchema.author)) {
            //     const authorArr = parsedSchema.author as (Organization | Person)[];
            //     out.author = authorArr.map((v) => typeof v == "string" ? v : v.name).join(", ")
            // } else if (parsedSchema.author) {

            // }

            // if (parsedSchema.totalTime && (typeof parsedSchema.totalTime === "string" || typeof parsedSchema.totalTime === "number")) {
            //     out.totalTime = parsedSchema.totalTime;
            // }

            // if (parsedSchema.recipeYield && (typeof parsedSchema.recipeYield === "string" || typeof parsedSchema.recipeYield === "number")) {
            //     out.yield = parsedSchema.recipeYield;
            // } else if (parsedSchema.yield && (typeof parsedSchema.yield === "string" || typeof parsedSchema.yield === "number")) {
            //     out.yield = parsedSchema.yield;
            // }

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