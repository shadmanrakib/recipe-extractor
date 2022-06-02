"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var cheerio_1 = require("cheerio");
var node_fetch_1 = require("node-fetch");
var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
function parseJSONLD(recipe, jsonObj) {
    return __awaiter(this, void 0, void 0, function () {
        var toMerge, i, jsonObj2, merged, newRecipe, parsedSchema, authorArr;
        return __generator(this, function (_a) {
            if (Array.isArray(jsonObj)) {
                toMerge = [];
                for (i = 0; i < jsonObj.length; i++) {
                    jsonObj2 = jsonObj[i];
                    toMerge.push(parseJSONLD(recipe, jsonObj2));
                }
                merged = mergeArrayOfObjects(toMerge);
                newRecipe = __assign(__assign({}, recipe), merged);
                return [2 /*return*/, newRecipe];
            }
            else {
                if (jsonObj["@type"] === "Recipe") {
                    parsedSchema = jsonObj;
                    if (parsedSchema.recipeIngredient) {
                        if (Array.isArray(parsedSchema.recipeIngredient)) {
                            recipe.ingredients = parsedSchema.recipeIngredient.map(function (val) { return val.trim(); });
                        }
                        else if (typeof parsedSchema.recipeIngredient === "string") {
                            if ((parsedSchema.recipeIngredient.match(/,/g) || []).length > 2) {
                                recipe.ingredients = parsedSchema.recipeIngredient.split(",").map(function (s) { return s.trim(); });
                            }
                            else {
                                recipe.ingredients = [parsedSchema.recipeIngredient.trim()];
                            }
                        }
                    }
                    else if (parsedSchema.ingredients) {
                        if (Array.isArray(parsedSchema.ingredients)) {
                            recipe.ingredients = parsedSchema.ingredients.map(function (val) { return val.trim(); });
                        }
                        else if (typeof parsedSchema.ingredients === "string") {
                            if ((parsedSchema.ingredients.match(/,/g) || []).length > 2) {
                                recipe.ingredients = parsedSchema.ingredients.split(",").map(function (s) { return s.trim(); });
                            }
                            else {
                                recipe.ingredients = [parsedSchema.ingredients.trim()];
                            }
                        }
                    }
                    if (parsedSchema.recipeInstructions) {
                        if (Array.isArray(parsedSchema.recipeInstructions)) {
                            recipe.directions = parsedSchema.recipeInstructions.map(function (inst) {
                                if (typeof inst === "string") {
                                    return inst.trim();
                                }
                                else if (inst["text"]) {
                                    return inst["text"].trim();
                                }
                                else {
                                    return null;
                                }
                            }).filter(function (val) { return val; });
                        }
                        else if (typeof parsedSchema.recipeInstructions === "string") {
                            if ((parsedSchema.recipeInstructions.match(/,/g) || []).length > 2) {
                                recipe.directions = parsedSchema.recipeInstructions.split(",").map(function (s) { return s.trim(); });
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
                        authorArr = parsedSchema.author;
                        recipe.author = authorArr.map(function (v) { return typeof v == "string" ? v : v.name; }).join(", ");
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
                    // not complete
                    if (parsedSchema.image) {
                        if (typeof parsedSchema.image === "string") {
                            recipe.image = parsedSchema.image;
                        }
                        else if (Array.isArray(parsedSchema.image) && parsedSchema.image.length > 0) {
                            if (typeof parsedSchema.image[0] === "string") {
                                recipe.image = parsedSchema.image[0];
                            }
                        }
                    }
                }
                return [2 /*return*/, recipe];
            }
            return [2 /*return*/];
        });
    });
}
function mergeArrayOfObjects(arr) {
    return arr.reduce(function (result, current) {
        if (current) {
            var keys = Object.keys(current);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (!result[key]) {
                    result[key] = current[key];
                }
                else if (Array.isArray(result[key])) {
                    if (Array.isArray(current[key])) {
                        result[key] = __spreadArray(__spreadArray([], result[key], true), current[key], true);
                    }
                    else {
                        result[key] = __spreadArray(__spreadArray([], result[key], true), [current[key]], false);
                    }
                }
            }
        }
        return result;
    }, {});
}
// Constants
var PORT = 8080;
var HOST = '0.0.0.0';
router.use(function (req, res, next) {
    console.log("/" + req.method);
    next();
});
router.get("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var recipe, url, html, $, JSONLDs, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    recipe = {
                        name: "",
                        url: "",
                        ingredients: [],
                        directions: []
                    };
                    url = ((req === null || req === void 0 ? void 0 : req.query) && typeof req.query["url"] == "string") ? req.query["url"] : "https://www.allrecipes.com/recipe/283347/air-fryer-stuffed-chicken-thighs/";
                    recipe.url = url; // will be replaced later
                    return [4 /*yield*/, (0, node_fetch_1["default"])(url)];
                case 1: return [4 /*yield*/, (_c.sent()).text()];
                case 2:
                    html = _c.sent();
                    $ = (0, cheerio_1.load)(html);
                    JSONLDs = $('script[type="application/ld+json"]').toArray().map(function (e) { return JSON.parse($(e).text()); });
                    _b = (_a = res).json;
                    return [4 /*yield*/, parseJSONLD(recipe, JSONLDs)];
                case 3:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    });
});
// app.use(express.static(path));
app.use("/", router);
app.listen(PORT, function () {
    console.log("listening...");
});
