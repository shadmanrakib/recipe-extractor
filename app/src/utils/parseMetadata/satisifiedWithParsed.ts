import { Recipe } from "../../models/recipe";

export default function satisfiedWithParsed(recipe : Recipe | null) : boolean {
    
    if (!recipe) {
        return false;
    }

    if (!recipe.name) {
        return false;
    }

    if (!recipe.ingredients || recipe?.ingredients.length === 0) {
        return false;
    }

    if (!recipe.directions || recipe?.directions.length === 0) {
        return false;
    }

    return true;
    
}