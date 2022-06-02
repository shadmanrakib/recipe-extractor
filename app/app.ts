import { load } from "cheerio";
import fetch from "node-fetch";

import { Organization, Person, Recipe as RecipeSchemaOrg } from "schema-dts";
import { Recipe } from "./models/recipe";

import * as express from "express";

const app = express();
const router = express.Router();
var path = __dirname + '/views/';

async function parseJSONLD(recipe: Recipe, jsonObj: any[] | { [key: string]: any }): Promise<Recipe | null> {
  if (Array.isArray(jsonObj)) {
    const toMerge: any[] = [];

    for (let i = 0; i < jsonObj.length; i++) {
      const jsonObj2 = jsonObj[i];

      toMerge.push(parseJSONLD(recipe, jsonObj2));
    }

    const merged = mergeArrayOfObjects(toMerge);

    const newRecipe: Recipe = {
      ...recipe,
      ...merged
    }

    return newRecipe;
  } else {
    if (jsonObj["@type"] === "Recipe") {
      const parsedSchema: RecipeSchemaOrg = jsonObj as RecipeSchemaOrg;

      if (parsedSchema.recipeIngredient) {
        if (Array.isArray(parsedSchema.recipeIngredient)) {
          recipe.ingredients = parsedSchema.recipeIngredient.map(val => val.trim());
        } else if (typeof parsedSchema.recipeIngredient === "string") {
          if ((parsedSchema.recipeIngredient.match(/,/g) || []).length > 2) {
            recipe.ingredients = parsedSchema.recipeIngredient.split(",").map((s) => s.trim());
          } else {
            recipe.ingredients = [parsedSchema.recipeIngredient.trim()];
          }
        }
      } else if (parsedSchema.ingredients) {
        if (Array.isArray(parsedSchema.ingredients)) {
          recipe.ingredients = parsedSchema.ingredients.map(val => val.trim());
        } else if (typeof parsedSchema.ingredients === "string") {
          if ((parsedSchema.ingredients.match(/,/g) || []).length > 2) {
            recipe.ingredients = parsedSchema.ingredients.split(",").map((s) => s.trim());
          } else {
            recipe.ingredients = [parsedSchema.ingredients.trim()];
          }
        }
      }

      if (parsedSchema.recipeInstructions) {
        if (Array.isArray(parsedSchema.recipeInstructions)) {
          recipe.directions = parsedSchema.recipeInstructions.map((inst) => {
            if (typeof inst === "string") {
              return inst.trim();
            } else if (inst["text"]) {
              return inst["text"].trim();
            } else {
              return null;
            }
          }).filter((val) => val);
        } else if (typeof parsedSchema.recipeInstructions === "string") {
          if ((parsedSchema.recipeInstructions.match(/,/g) || []).length > 2) {
            recipe.directions = parsedSchema.recipeInstructions.split(",").map((s) => s.trim());
          } else {
            recipe.directions = [parsedSchema.recipeInstructions.trim()];
          }
        }
      }

      if (parsedSchema.name && typeof parsedSchema.name === "string") {
        recipe.name = parsedSchema.name;
      } else if (parsedSchema.alternateName && typeof parsedSchema.alternateName === "string") {
        recipe.name = parsedSchema.alternateName;
      }

      if (parsedSchema.recipeCategory && typeof parsedSchema.recipeCategory === "string") {
        recipe.category = parsedSchema.recipeCategory;
      }

      if (parsedSchema.recipeCuisine && typeof parsedSchema.recipeCuisine === "string") {
        recipe.cuisine = parsedSchema.recipeCuisine;
      }

      if (parsedSchema.description && typeof parsedSchema.description === "string") {
        recipe.description = parsedSchema.description;
      }

      if (parsedSchema.author && typeof parsedSchema.author === "string") {
        recipe.author = parsedSchema.author;
      } else if (Array.isArray(parsedSchema.author)) {
        const authorArr = parsedSchema.author as (Organization | Person)[];
        recipe.author = authorArr.map((v) => typeof v == "string" ? v : v.name).join(", ")
      } else if (parsedSchema.author) {

      }

      if (parsedSchema.prepTime && (typeof parsedSchema.prepTime === "string" || typeof parsedSchema.prepTime === "number")) {
        recipe.prepTime = parsedSchema.prepTime;
      }

      if (parsedSchema.cookTime && (typeof parsedSchema.cookTime === "string" || typeof parsedSchema.cookTime === "number")) {
        recipe.cookTime = parsedSchema.cookTime;
      }

      if (parsedSchema.totalTime && (typeof parsedSchema.totalTime === "string" || typeof parsedSchema.totalTime === "number")) {
        recipe.totalTime = parsedSchema.totalTime;
      }

      if (parsedSchema.recipeYield && (typeof parsedSchema.recipeYield === "string" || typeof parsedSchema.recipeYield === "number")) {
        recipe.yield = parsedSchema.recipeYield;
      } else if (parsedSchema.yield && (typeof parsedSchema.yield === "string" || typeof parsedSchema.yield === "number")) {
        recipe.yield = parsedSchema.yield;
      }

      // not complete
      if (parsedSchema.image) {
        if (typeof parsedSchema.image === "string") {
          recipe.image = parsedSchema.image;
        } else if (Array.isArray(parsedSchema.image) && parsedSchema.image.length > 0) {
          if (typeof parsedSchema.image[0] === "string") {
            recipe.image = parsedSchema.image[0]
          }
        }
      }
    }

    return recipe;
  }
}

function mergeArrayOfObjects(arr: { [key: string]: any }[]): { [key: string]: any } {
  return arr.reduce(function (result, current) {
    if (current) {
      const keys = Object.keys(current);

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (!result[key]) {
          result[key] = current[key];
        } else if (Array.isArray(result[key])) {
          if (Array.isArray(current[key])) {
            result[key] = [...result[key], ...current[key]];
          } else {
            result[key] = [...result[key], current[key]];
          }
        }
      }
    }

    return result;
  }, {});
}

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

router.use(function (req, res, next) {
  console.log("/" + req.method);
  next();
});

router.get("/", async function (req: express.Request<{url?: string}>, res) {
  // res.sendFile(path + "index.html");
  const recipe: Recipe = {
    name: "",
    url: "",
    ingredients: [],
    directions: [],
  }

  const url : string = (req?.query && typeof req.query["url"] == "string") ? req.query["url"] : "https://www.allrecipes.com/recipe/283347/air-fryer-stuffed-chicken-thighs/";

  recipe.url = url; // will be replaced later

  const html = await (await fetch(url)).text()
  const $ = load(html)

  const JSONLDs: any[] = $('script[type="application/ld+json"]').toArray().map((e) => JSON.parse($(e).text()));

  res.json(await parseJSONLD(recipe, JSONLDs));
});

// app.use(express.static(path));
app.use("/", router);

app.listen(PORT, function () {
  console.log("listening...")
})