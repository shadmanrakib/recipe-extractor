"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = require("cheerio");
const node_fetch_1 = __importDefault(require("node-fetch"));
const express_1 = __importStar(require("express")), express = express_1;
const app = (0, express_1.default)();
const router = express.Router();
var path = __dirname + '/views/';
function parseJSONLD(recipe, jsonObj) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (Array.isArray(jsonObj)) {
            const toMerge = [];
            for (let i = 0; i < jsonObj.length; i++) {
                const jsonObj2 = jsonObj[i];
                toMerge.push(parseJSONLD(recipe, jsonObj2));
            }
            const merged = mergeArrayOfObjects(toMerge);
            const newRecipe = Object.assign(Object.assign({}, recipe), merged);
            return newRecipe;
        }
        else {
            if (jsonObj["@type"] === "Recipe") {
                const parsedSchema = jsonObj;
                if (parsedSchema.recipeIngredient) {
                    if (Array.isArray(parsedSchema.recipeIngredient)) {
                        recipe.ingredients = parsedSchema.recipeIngredient.map(val => val.trim());
                    }
                    else if (typeof parsedSchema.recipeIngredient === "string") {
                        if ((parsedSchema.recipeIngredient.match(/,/g) || []).length > 2) {
                            recipe.ingredients = parsedSchema.recipeIngredient.split(",").map((s) => s.trim());
                        }
                        else {
                            recipe.ingredients = [parsedSchema.recipeIngredient.trim()];
                        }
                    }
                }
                else if (parsedSchema.ingredients) {
                    if (Array.isArray(parsedSchema.ingredients)) {
                        recipe.ingredients = parsedSchema.ingredients.map(val => val.trim());
                    }
                    else if (typeof parsedSchema.ingredients === "string") {
                        if ((parsedSchema.ingredients.match(/,/g) || []).length > 2) {
                            recipe.ingredients = parsedSchema.ingredients.split(",").map((s) => s.trim());
                        }
                        else {
                            recipe.ingredients = [parsedSchema.ingredients.trim()];
                        }
                    }
                }
                if (parsedSchema.recipeInstructions) {
                    if (Array.isArray(parsedSchema.recipeInstructions)) {
                        recipe.directions = parsedSchema.recipeInstructions.map((inst) => {
                            if (typeof inst === "string") {
                                return inst.trim();
                            }
                            else if (inst["text"]) {
                                return inst["text"].trim();
                            }
                            else {
                                return null;
                            }
                        }).filter((val) => val);
                    }
                    else if (typeof parsedSchema.recipeInstructions === "string") {
                        if ((parsedSchema.recipeInstructions.match(/,/g) || []).length > 2) {
                            recipe.directions = parsedSchema.recipeInstructions.split(",").map((s) => s.trim());
                        }
                        else {
                            recipe.directions = [parsedSchema.recipeInstructions.trim()];
                        }
                    }
                }
                if (parsedSchema.name && typeof parsedSchema.name === "string") {
                    recipe.name = parsedSchema.name;
                }
                else if (parsedSchema.alternateName && typeof parsedSchema.alternateName === "string") {
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
                }
                else if (Array.isArray(parsedSchema.author)) {
                    const authorArr = parsedSchema.author;
                    recipe.author = authorArr.map((v) => typeof v == "string" ? v : v.name).join(", ");
                }
                else if (parsedSchema.author) {
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
                }
                else if (parsedSchema.yield && (typeof parsedSchema.yield === "string" || typeof parsedSchema.yield === "number")) {
                    recipe.yield = parsedSchema.yield;
                }
                if (parsedSchema.image) {
                    const image = parsedSchema.image;
                    if (typeof image === "string") {
                        recipe.image = image;
                    }
                    else if (Array.isArray(image)) {
                        if (image.length > 0) {
                            if (typeof image[0] === "string") {
                                recipe.image = image[0];
                            }
                            else if (typeof ((_a = image[0]) === null || _a === void 0 ? void 0 : _a.url) === "string") {
                                recipe.image = image[0].url;
                            }
                        }
                    }
                    else if (typeof image["url"] === "string") {
                        recipe.image = image.url;
                    }
                }
            }
            return recipe;
        }
    });
}
function mergeArrayOfObjects(arr) {
    return arr.reduce(function (result, current) {
        if (current) {
            const keys = Object.keys(current);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (!result[key]) {
                    result[key] = current[key];
                }
                else if (Array.isArray(result[key])) {
                    if (Array.isArray(current[key])) {
                        result[key] = [...result[key], ...current[key]];
                    }
                    else {
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
router.get("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // res.sendFile(path + "index.html");
        const recipe = {
            name: "",
            url: "",
            ingredients: [],
            directions: [],
        };
        const url = ((req === null || req === void 0 ? void 0 : req.query) && typeof req.query["url"] == "string") ? req.query["url"] : "https://www.allrecipes.com/recipe/283347/air-fryer-stuffed-chicken-thighs/";
        recipe.url = url; // will be replaced later
        const html = yield (yield (0, node_fetch_1.default)(url)).text();
        const $ = (0, cheerio_1.load)(html);
        const JSONLDs = $('script[type="application/ld+json"]').toArray().map((e) => JSON.parse($(e).text()));
        res.json(yield parseJSONLD(recipe, JSONLDs));
    });
});
// app.use(express.static(path));
app.use("/", router);
app.listen(PORT, function () {
    console.log("listening...");
});
