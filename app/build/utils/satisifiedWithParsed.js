"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function satisfiedWithParsed(recipe) {
    if (!recipe) {
        return false;
    }
    if (!recipe.name) {
        return false;
    }
    if (!recipe.ingredients || (recipe === null || recipe === void 0 ? void 0 : recipe.ingredients.length) === 0) {
        return false;
    }
    if (!recipe.directions || (recipe === null || recipe === void 0 ? void 0 : recipe.directions.length) === 0) {
        return false;
    }
    return true;
}
exports.default = satisfiedWithParsed;
