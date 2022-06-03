import { Recipe } from "src/models/recipe";
import { ImageObject, Organization, Person, Recipe as RecipeSchemaOrg, URL } from "schema-dts";
import mergeArrayOfObjects from "./mergeArrayOfObjects";

export default async function parseJSONLD(recipe: Recipe, jsonObj: any[] | { [key: string]: any }): Promise<Recipe> {
    const out = {...recipe};

    if (Array.isArray(jsonObj)) {
      const toMerge: any[] = [out];
  
      for (let i = 0; i < jsonObj.length; i++) {
        const jsonObj2 = jsonObj[i];
  
        toMerge.push(await parseJSONLD(out, jsonObj2));
      }
  
      const merged = mergeArrayOfObjects(toMerge);

      const newRecipe: Recipe = {
        ...out,
        ...merged
      }
  
      return newRecipe;
    } else {
      if (jsonObj["@type"] === "Recipe") {
        const parsedSchema: RecipeSchemaOrg = jsonObj as RecipeSchemaOrg;
  
        if (parsedSchema.recipeIngredient) {
          if (Array.isArray(parsedSchema.recipeIngredient)) {
            out.ingredients = parsedSchema.recipeIngredient.map(val => val.trim());
          } else if (typeof parsedSchema.recipeIngredient === "string") {
            if ((parsedSchema.recipeIngredient.match(/,/g) || []).length > 2) {
                out.ingredients = parsedSchema.recipeIngredient.split(",").map((s) => s.trim());
            } else {
                out.ingredients = [parsedSchema.recipeIngredient.trim()];
            }
          }
        } else if (parsedSchema.ingredients) {
          if (Array.isArray(parsedSchema.ingredients)) {
            out.ingredients = parsedSchema.ingredients.map(val => val.trim());
          } else if (typeof parsedSchema.ingredients === "string") {
            if ((parsedSchema.ingredients.match(/,/g) || []).length > 2) {
              out.ingredients = parsedSchema.ingredients.split(",").map((s) => s.trim());
            } else {
              out.ingredients = [parsedSchema.ingredients.trim()];
            }
          }
        }
  
        if (parsedSchema.recipeInstructions) {
          if (Array.isArray(parsedSchema.recipeInstructions)) {
            out.directions = parsedSchema.recipeInstructions.map((inst) => {
              if (typeof inst === "string") {
                return inst.trim();
              } else if (inst["text"]) {
                return inst["text"].trim();
              } else {
                return null;
              }
            }).filter((val) => val);
          } else if (typeof parsedSchema.recipeInstructions === "string") {
            // if ((parsedSchema.recipeInstructions.match(/./g) || []).length > 3) {
            //   out.directions = parsedSchema.recipeInstructions.split(",").map((s) => s.trim());
            // } else {
              out.directions = [parsedSchema.recipeInstructions.trim()];
            // }
          }
        }
  
        if (parsedSchema.name && typeof parsedSchema.name === "string") {
          out.name = parsedSchema.name;
        } else if (parsedSchema.alternateName && typeof parsedSchema.alternateName === "string") {
          out.name = parsedSchema.alternateName;
        }
  
        if (parsedSchema.recipeCategory && typeof parsedSchema.recipeCategory === "string") {
          out.category = parsedSchema.recipeCategory;
        }
  
        if (parsedSchema.recipeCuisine && typeof parsedSchema.recipeCuisine === "string") {
          out.cuisine = parsedSchema.recipeCuisine;
        }
  
        if (parsedSchema.description && typeof parsedSchema.description === "string") {
          out.description = parsedSchema.description;
        }
  
        if (parsedSchema.author && typeof parsedSchema.author === "string") {
          out.author = parsedSchema.author;
        } else if (Array.isArray(parsedSchema.author)) {
          const authorArr = parsedSchema.author as (Organization | Person)[];
          out.author = authorArr.map((v) => typeof v == "string" ? v : v.name).join(", ")
        } else if (parsedSchema.author) {
  
        }
  
        if (parsedSchema.prepTime && (typeof parsedSchema.prepTime === "string" || typeof parsedSchema.prepTime === "number")) {
          out.prepTime = parsedSchema.prepTime;
        }
  
        if (parsedSchema.cookTime && (typeof parsedSchema.cookTime === "string" || typeof parsedSchema.cookTime === "number")) {
          out.cookTime = parsedSchema.cookTime;
        }
  
        if (parsedSchema.totalTime && (typeof parsedSchema.totalTime === "string" || typeof parsedSchema.totalTime === "number")) {
          out.totalTime = parsedSchema.totalTime;
        }
  
        if (parsedSchema.recipeYield && (typeof parsedSchema.recipeYield === "string" || typeof parsedSchema.recipeYield === "number")) {
          out.yield = parsedSchema.recipeYield;
        } else if (parsedSchema.yield && (typeof parsedSchema.yield === "string" || typeof parsedSchema.yield === "number")) {
          out.yield = parsedSchema.yield;
        }
  
        if (parsedSchema.image) {
          const image = parsedSchema.image as URL | ImageObject | (URL | ImageObject)[];
  
          if (typeof image === "string") {
            out.image = image;
          } else if (Array.isArray(image)) {
            if (image.length > 0) {
              if (typeof image[0] === "string") {
                out.image = image[0]
              } else if (typeof image[0]?.url === "string") {
                out.image = image[0].url;
              }
            }
          } else if (typeof image["url"] === "string") {
            out.image = image.url;
          }
        }
      }
  
      return out;
    }
  }