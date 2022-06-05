import express, { Request, Response } from 'express';
import { load, Element } from "cheerio";
import fetch from "node-fetch";

import { Recipe } from "./models/recipe";
import parseJSONLD from "./utils/parseJSONLD";
import { microdataTestHTML, RFDaHTMLTest } from "./utils/test";
import parseMicrodata from "./utils/parseMicrodata";
import parseRFDa from "./utils/parseRFDa";
import mergeParsedMetadata from './utils/mergeParsedMetadata';

const app = express();
const router = express.Router();

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const __filename = new URL('', import.meta.url).pathname;
const __dirname = new URL('.', import.meta.url).pathname; // Will contain trailing slash

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

  const JSONLDs: Element[] = $('script[type="application/ld+json"]').toArray().map((e) => JSON.parse($(e).text()));
  const parsedJSONLD = await parseJSONLD(recipe, JSONLDs);

  const microdataParentElements: Element[] = $('[itemtype="https://schema.org/Recipe"]').toArray();
  const parsedMicrodata = await parseMicrodata(recipe, microdataParentElements);

  const RFDaParentElements: Element[] = $('[typeof="Recipe"]').toArray();
  const parsedRFDa = await parseRFDa(recipe, RFDaParentElements);

  const mergedParsedMetadata = mergeParsedMetadata(parsedJSONLD, parsedMicrodata, parsedRFDa);

  res.json(mergedParsedMetadata);
});

// app.use(express.static(path));
app.use("/", router);

app.listen(PORT, function () {
  console.log("listening...")
})