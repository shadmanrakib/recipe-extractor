export const VARIATIONS : Record<string, string[]> = {
    "tsp" : ["tsp", "teasp", "teaspoon", "teaspoons", "t", "tsp.", "teasp.", "teaspoon", "teaspoons", "t.",],
    "tbsp" : ["tbs", "tb", "tbsp", "tablespoon", "tablespoons", "tbl", "T", "tl", "tbl", "tb.", "tbsp.", "tablespoon", "tablespoons", "tbl.", "T.", "tbs.", "tl.", "tbl.",],
    "cup" : ["cup", "cups", "c.", "c",],
    "gram" : ["gram", "grams", "g.", "g", "gr.", "gr", "grm.", "grm", "gramme",],
    "mL" : ["mL", "milliliter", "mLs", "mL's", "mililiter", "milliliters", "mililiters", "cc", "millilitre", "ml", "mls", "ml.", "mls.", "ml's.",],
    "lb" : ["lb", "pound", "lbs", "pounds", "lb.", "lbs.", "p", "#", "#s", "#'s",],
    "kg" : ["kg", "kilo", "kilog", "kilogram", "kilos", "kilogs", "kilograms", "kg.", "k.", "k", "kilo.", "kilos.", "kilog.", "kilogs.",],
    "L" : ["L", "liter", "l's", "ls", "liters", "l.", "ls.", "l's.",],
    "oz" : ["oz", "ounces", "ounce", "oz.", "o", "o.",],
    "mg" : ["mg", "miligram", "milligramme", "miligrams", "milligrammes",],
    "dl" : ["dl", "deciliter", "decilitre",],
    "clove" : ["clove", "cloves", "clove of", "cloves of"], // Last 2 wont work because they are multiple words long
    "packet" : ["packet", "packets",],
    "package" : ["package", "packages", "pkg",],
    "bunch" : ["bunch", "bunches",],
    "sprinkle" : ["sprinkle", "sprinkles",],
    "pinch" : ["pinch", "pinches",],
    "cloves" : ["cloves", "clove",],
    "can" : ["can", "cans", "canned", "8 oz can", "9 oz can", "10 oz can", "11 oz can", "12 oz can", "13 oz can", "14 oz can", "15 oz can", "16 oz can", "17 oz can",],
    "mason jar" : ["mason jar", "8 oz jar", "9 oz jar", "10 oz jar", "11 oz jar", "12 oz jar", "13 oz jar", "14 oz jar", "15 oz jar", "16 oz jar", "32 oz jar", "64 oz jar"], // Wont work
    "quart" : ["quart", "quarts", "q", "q.", "qu.", "qu", "fl qt", "fl qt.",],
    "container" : ["container", "containers",],
    "containers worth" : ["containers worth"], // Should it be a part of container?
    "bag": ["bag", "bags",],
    "smear": ["smear", "smears",],
    "twist": ["twist", "twists",],
    "palmful" : ["palmful", "palmfuls",],
    "sheet" : ["sheet", "sheets",],
    "ball" : ["ball", "balls",],
    "drop" : ["drop", "drops", "dropping", "droppings",],
    "slice" : ["slices", "slice", "slice of", "slices of",],
    "stick" : ["stick", "sticks", "sticks of",],
    "to taste" : ["to taste",],
    "as needed" : ["as needed",],
    "sprig" : ["sprig",],
    "pack" : ["pack",],
    "whole" : ["whole",],
    "entire" : ["entire",],
    "complete" : ["complete",],
    "jar" : ["jar", "jars"],
    "grate" : ["grate", "grates",],
    "nub" : ["nub", "nubs",],
    "handful" : ["handful",],
    "dusting" : ["dusting",],
    "spoonful" : ["spoonful",],
    "pint" : ["pint", "pints",],
    "half pint" : ["half pint", "half pints",], // Last 2 weird
    "gallon" : ["gallon", "gallons", "gal", "gal.", "ga.", "ga", ], // "g", "g.",
    "half gallon" : ["half gallon", "half gallons",],
    "glass" : ["glass", "glasses",],
    "square" : ["square", "squares",],
    "cube" : ["cube", "cubes",],
    "dollop" : ["dollop", "dollops",],
    "fluid ounce" : ["fluid ounce", "fluid ounces", "fl oz", "fl. oz", "fl. oz.", "fl oz.",],
    "gill" : ["gill", "gills",],
    "inch" : ["inch", "inches", "in", '"', "in.",],
    "mm" : ["millimeter", "mm", "millimetre",],
    "cm" : ["centimeter", "cm", "centimetre",],
    "jigger" : ["jigger", "jiggers",],
    "swirl" : ["swirl", "swirls",],
    "smidgen" : ["smidgen", "smidgens",],
    "juice of" : ["juice of", "the juice of", "juiced",],
    // "pressed" : ["pressed",],
    // "dried" : ["dried",],
    "shake" : ["shake", "shakes",],
    "squirt" : ["squirt", "squirts",],
    "spray" : ["spray", "sprays",], 
    "set" : ["set", "sets",],
    "baton"  : ["baton", "batons",],
    // "crack" : ["crack", "cracks", "crack of"],
}

const STD_UNITS = Object.keys(VARIATIONS);

let GENERATE_UNITS : Record<string, string> = {} 

for (let i = 0; i < STD_UNITS.length; i++) {
    const std_unit = STD_UNITS[i];
    
    const unit_variations = VARIATIONS[std_unit];

    for (let j = 0; j < unit_variations.length; j++) {
        const variation = unit_variations[j];
        
        GENERATE_UNITS[variation] = std_unit;
    }
}

const UNITS = GENERATE_UNITS;

export default UNITS;