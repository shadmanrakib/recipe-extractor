import express, { Request, response, Response } from 'express';
import { load, Element } from "cheerio";
import fetch from "node-fetch";
import path from "path"

import { Recipe } from "./models/recipe";
import parseJSONLD from "./utils/parseMetadata/parseJSONLD";
import { microdataTestHTML, RFDaHTMLTest } from "./test/sampleHTML";
import parseMicrodata from "./utils/parseMetadata/parseMicrodata";
import parseRFDa from "./utils/parseMetadata/parseRFDa";
import mergeParsedMetadata from './utils/merge/mergeParsedMetadata';
import satisfiedWithParsed from './utils/parseMetadata/satisifiedWithParsed';
import extractManually from './utils/manualExtraction/extractManually';
import isIngredient from './utils/manualExtraction/isIngredient';

const app = express();
const router = express.Router();

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const __filename = new URL('', import.meta.url).pathname;
const __dirname = new URL('.', import.meta.url).pathname; // Will contain trailing slash

app.use(express.urlencoded({
  extended: true
}))

router.use(function (req, res, next) {
  console.log("/" + req.method);
  next();
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get("/api", async function (req: express.Request<{ url?: string }>, res) {
  // res.sendFile(path + "index.html");
  const recipe: Recipe = {
    name: "",
    url: "",
    ingredients: [],
    directions: [],
  }

  const url: string = (req?.query && typeof req.query["url"] == "string") ? req.query["url"] : "https://www.allrecipes.com/recipe/283347/air-fryer-stuffed-chicken-thighs/";

  recipe.url = url; // will be replaced later

  const html = await (await fetch(url)).text()
  const $ = load(html)

  const JSONLDs: Element[] = $('script[type="application/ld+json"]').toArray().map((e) => JSON.parse($(e).text()));
  const parsedJSONLD = await parseJSONLD(recipe, JSONLDs);

  const microdataParentElements: Element[] = $('[itemtype="https://schema.org/Recipe"]').toArray();
  const parsedMicrodata = await parseMicrodata(recipe, microdataParentElements);

  const RFDaParentElements: Element[] = $('[typeof="Recipe"]').toArray();
  const parsedRFDa = await parseRFDa(recipe, RFDaParentElements);

  const mergedParsedMetadata = mergeParsedMetadata(parsedJSONLD, parsedMicrodata, parsedRFDa);

  isIngredient("1 tsp sugar")
  isIngredient("sugar")
  isIngredient("powdered sugar")
  isIngredient("cup sugar")
  isIngredient("Eat the sugar")
  isIngredient("4 Russet Potatoes")
  isIngredient("2 quarts (1.9L) of vegetable oil")
  isIngredient("1.5 teaspoons (under 1g) fresh ground black pepper ")
  isIngredient("Ketchup for Serving")
  isIngredient("2 Serranos, charred and peeled")
  isIngredient("Preheat the oven to 400F. Place potatoes on a baking sheet and place in the oven for 1 hour or until fork tender; place in the fridge overnight.")
  isIngredient("Season fish with salt on all sides, and let it sit at room temperature for 8 minutes.")
  isIngredient("Pat dry your fish with a paper towel to remove the excess water. In a bowl, place flour for dredging; then toss a couple of fish pieces to coat, shake off the excess, put them in the batter, and then fry your fish for 3 - 4 minutes or until golden brown and fully cooked.    ")

  // console.log("1 tsp sugar", isIngredient("1 tsp sugar"));


  if (satisfiedWithParsed(mergedParsedMetadata)) {
    res.json(mergedParsedMetadata);
  } else {
    // TODO: try to manually get name, ingredients, and directions
    const extracted = extractManually(mergedParsedMetadata, $);
    res.json(extracted)
  }
});

app.use(express.static(path.join(__dirname, '../public')));
app.use("/", router);

app.listen(PORT, function () {
  console.log("listening...")
})