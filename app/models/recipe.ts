export interface Recipe {
    url: string;
    name: string;
    ingredients: string[];
    directions: string[];
    description?: string;
    image?: string;
    prepTime?: string;
    cookTime?: string;
    totalTime?: string;
    yield?: string;
    category?: string;
    cuisine?: string;
    author?: string;
}