import { load, Element } from "cheerio";
import fetch from "node-fetch";

import { ImageObject, Organization, Person, Recipe as RecipeSchemaOrg, URL } from "schema-dts";
import { Recipe } from "./models/recipe";

import expressapp, * as express from "express";
import mergeArrayOfObjects from "./utils/mergeArrayOfObjects";
import parseJSONLD from "./utils/parseJSONLD";
import { microdataTestHTML } from "./utils/test";
import satisfiedWithParsed from "./utils/satisifiedWithParsed";

const app = expressapp();
const router = express.Router();
var path = __dirname + '/views/';

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

router.use(function (req, res, next) {
  console.log("/" + req.method);
  next();
});

router.get("/", async function (req: express.Request<{ url?: string }>, res) {
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
  const $2 = load(microdataTestHTML)

  const JSONLDs: Element[] = $('script[type="application/ld+json"]').toArray().map((e) => JSON.parse($(e).text()));

  const parsedJSONLD = await parseJSONLD(recipe, JSONLDs);
  
  if (satisfiedWithParsed(parsedJSONLD)) {
    res.json(parsedJSONLD);
  } else {
    const microdataParentElements : Element[] = $2('[itemtype="https://schema.org/Recipe"]').toArray();
    res.json(parsedJSONLD);
  }

});

// app.use(express.static(path));
app.use("/", router);

app.listen(PORT, function () {
  console.log("listening...")
})