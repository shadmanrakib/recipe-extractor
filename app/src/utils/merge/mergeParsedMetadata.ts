import { Recipe } from "src/models/recipe";

export default function mergeParsedMetadata(jsonld: Recipe, microdata: Recipe, rfda: Recipe) : Recipe {
    const merged = {...rfda, ...microdata, ...jsonld};

    if (jsonld.ingredients && jsonld.ingredients.length > 0) {
        merged.ingredients = jsonld.ingredients;
    } else if (microdata.ingredients && microdata.ingredients.length) {
        merged.ingredients = microdata.ingredients;
    } else if (rfda.ingredients && rfda.ingredients.length) {
        merged.ingredients = rfda.ingredients;
    }

    if (jsonld.directions && jsonld.directions.length > 0) {
        merged.directions = jsonld.directions;
    } else if (microdata.directions && microdata.directions.length) {
        merged.directions = microdata.directions;
    } else if (rfda.directions && rfda.directions.length) {
        merged.directions = rfda.directions;
    }

    if (typeof jsonld.name !== "undefined" && jsonld.name != "") {
        merged.name = jsonld.name;
    } else if (typeof microdata.name !== "undefined" && microdata.name != "") {
        merged.name = microdata.name;
    } else if (typeof rfda.name !== "undefined" && rfda.name != "") {
        merged.name = rfda.name;
    }

    if (typeof jsonld.author !== "undefined" && jsonld.author != "") {
        merged.author = jsonld.author;
    } else if (typeof microdata.author !== "undefined" && microdata.author != "") {
        merged.author = microdata.author;
    } else if (typeof rfda.author !== "undefined" && rfda.author != "") {
        merged.author = rfda.author;
    }

    if (typeof jsonld.image !== "undefined" && jsonld.image != "") {
        merged.image = jsonld.image;
    } else if (typeof microdata.image !== "undefined" && microdata.image != "") {
        merged.image = microdata.image;
    } else if (typeof rfda.image !== "undefined" && rfda.image != "") {
        merged.image = rfda.image;
    }

    if (typeof jsonld.yield !== "undefined" && jsonld.yield != "") {
        merged.yield = jsonld.yield;
    } else if (typeof microdata.yield !== "undefined" && microdata.yield != "") {
        merged.yield = microdata.yield;
    } else if (typeof rfda.yield !== "undefined" && rfda.yield != "") {
        merged.yield = rfda.yield;
    }

    if (typeof jsonld.totalTime !== "undefined" && jsonld.totalTime != "") {
        merged.totalTime = jsonld.totalTime;
    } else if (typeof microdata.totalTime !== "undefined" && microdata.totalTime != "") {
        merged.totalTime = microdata.totalTime;
    } else if (typeof rfda.totalTime !== "undefined" && rfda.totalTime != "") {
        merged.totalTime = rfda.totalTime;
    }

    if (typeof jsonld.cookTime !== "undefined" && jsonld.cookTime != "") {
        merged.cookTime = jsonld.cookTime;
    } else if (typeof microdata.cookTime !== "undefined" && microdata.cookTime != "") {
        merged.cookTime = microdata.cookTime;
    } else if (typeof rfda.cookTime !== "undefined" && rfda.cookTime != "") {
        merged.cookTime = rfda.cookTime;
    }

    if (typeof jsonld.prepTime !== "undefined" && jsonld.prepTime != "") {
        merged.prepTime = jsonld.prepTime;
    } else if (typeof microdata.prepTime !== "undefined" && microdata.prepTime != "") {
        merged.prepTime = microdata.prepTime;
    } else if (typeof rfda.prepTime !== "undefined" && rfda.prepTime != "") {
        merged.prepTime = rfda.prepTime;
    }

    if (typeof jsonld.description !== "undefined" && jsonld.description != "") {
        merged.description = jsonld.description;
    } else if (typeof microdata.description !== "undefined" && microdata.description != "") {
        merged.cookTime = microdata.description;
    } else if (typeof rfda.description !== "undefined" && rfda.description != "") {
        merged.cookTime = rfda.description;
    }

    if (typeof jsonld.category !== "undefined" && jsonld.category != "") {
        merged.category = jsonld.category;
    } else if (typeof microdata.category !== "undefined" && microdata.category != "") {
        merged.category = microdata.category;
    } else if (typeof rfda.category !== "undefined" && rfda.category != "") {
        merged.category = rfda.category;
    }

    if (typeof jsonld.cuisine !== "undefined" && jsonld.cuisine != "") {
        merged.cuisine = jsonld.cuisine;
    } else if (typeof microdata.cuisine !== "undefined" && microdata.cuisine != "") {
        merged.cuisine = microdata.cuisine;
    } else if (typeof rfda.category !== "undefined" && rfda.cuisine != "") {
        merged.cuisine = rfda.cuisine;
    }

    return merged;
}