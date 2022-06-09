const fs = require("fs")
const xlsxFile = require('read-excel-file/node');
const customIngList = require("./customIngredientsList.json");
const customToolsList = require("./customToolsList.json");

const ings = []
const tools = [];

const ingTokens = new Set()
const highIngTokens = new Set()
const lowIngTokens = new Set()
const ingFreq = {}

const toolTokens = new Set()
const toolFreq = {}


xlsxFile('src/data/MyFoodData-Nutrition-Facts-SpreadSheet-Release-1-4.xlsx').then((rows) => {
    for (let i = 0; i < customIngList.length; i++) {
        const name = customIngList[i];
        const ingName = (name || "").replace(/[\/\\\-\?\.\,\(\)\!\"\']/g, " ").trim().toLowerCase();

        if (ingName != "") {
            ings.push(ingName)
        }

        const tokens = ingName.split(" ").map((s) => s.trim().endsWith(",") ? s.trim().substring(0, s.length - 1) : s.trim()).filter((s) => s);

        for (let j = 0; j < tokens.length; j++) {
            const token = tokens[j];

            ingTokens.add(token)
            highIngTokens.add(token)

            if (typeof ingFreq[token] == "number") {
                ingFreq[token] += 1;
            } else {
                ingFreq[token] = 1;
            }
        }
    }
    for (let i = 4; i < rows.length; i++) {
        const name = rows[i][1];
        const ingName = (name || "").replace(/[\/\\\-\?\.\,\(\)\!\"\']/g, "").trim().toLowerCase();

        if (ingName != "") {
            ings.push(ingName)
        }

        const tokens = ingName.split(" ").map((s) => s.trim().endsWith(",") ? s.trim().substring(0, s.length - 1) : s.trim()).filter((s) => s);

        for (let j = 0; j < tokens.length; j++) {
            const token = tokens[j];

            ingTokens.add(token)
            lowIngTokens.add(token)


            if (typeof ingFreq[token] == "number") {
                ingFreq[token] += 1;
            } else {
                ingFreq[token] = 1;
            }
        }
    }

    fs.writeFileSync("src/data/ingredients.json", JSON.stringify(ings));
    fs.writeFileSync("src/data/ingTokens.json", JSON.stringify(Array.from(ingTokens)));
    fs.writeFileSync("src/data/highIngTokens.json", JSON.stringify(Array.from(highIngTokens)));
    fs.writeFileSync("src/data/lowIngTokens.json", JSON.stringify(Array.from(lowIngTokens)));
    fs.writeFileSync("src/data/ingFrequencies.json", JSON.stringify(ingFreq));

})

for (let i = 0; i < customToolsList.length; i++) {
    const name = customToolsList[i];
    const toolName = (name || "").replace(/[\/\\\-\?\.\,\(\)\!\"\']/g, " ").trim().toLowerCase();

    if (toolName != "") {
        tools.push(toolName)
    }

    const tokens = toolName.split(" ").map((s) => s.trim().endsWith(",") ? s.trim().substring(0, s.length - 1) : s.trim()).filter((s) => s);

    for (let j = 0; j < tokens.length; j++) {
        const token = tokens[j];

        toolTokens.add(token)

        if (typeof toolFreq[token] == "number") {
            toolFreq[token] += 1;
        } else {
            toolFreq[token] = 1;
        }
    }
}

fs.writeFileSync("src/data/tools.json", JSON.stringify(tools));
fs.writeFileSync("src/data/toolTokens.json", JSON.stringify(Array.from(toolTokens)));
fs.writeFileSync("src/data/toolFrequencies.json", JSON.stringify(ingFreq));
