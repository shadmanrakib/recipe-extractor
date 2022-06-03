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
const parseJSONLD_1 = __importDefault(require("./utils/parseJSONLD"));
const test_1 = require("./utils/test");
const satisifiedWithParsed_1 = __importDefault(require("./utils/satisifiedWithParsed"));
const app = (0, express_1.default)();
const router = express.Router();
var path = __dirname + '/views/';
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
        const $2 = (0, cheerio_1.load)(test_1.microdataTestHTML);
        const JSONLDs = $('script[type="application/ld+json"]').toArray().map((e) => JSON.parse($(e).text()));
        const parsedJSONLD = yield (0, parseJSONLD_1.default)(recipe, JSONLDs);
        if ((0, satisifiedWithParsed_1.default)(parsedJSONLD)) {
            res.json(parsedJSONLD);
        }
        else {
            const microdataParentElements = $2('[itemtype="https://schema.org/Recipe"]').toArray();
            res.json(parsedJSONLD);
        }
    });
});
// app.use(express.static(path));
app.use("/", router);
app.listen(PORT, function () {
    console.log("listening...");
});
