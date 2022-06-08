const fs = require("fs")
const xlsxFile = require('read-excel-file/node');
const customIngList = require("./customIngredientsList.json");

const ings = []
const words = new Set()
const freq = {}


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

            words.add(token)

            if (typeof freq[token] == "number") {
                freq[token] += 1;
            } else {
                freq[token] = 1;
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

            words.add(token)

            if (typeof freq[token] == "number") {
                freq[token] += 1;
            } else {
                freq[token] = 1;
            }
        }
    }
    console.log(ings.length)
    console.log(words.length)

    console.log(Array.from(words).sort((a, b) => freq[b] - freq[a]))
    fs.writeFileSync("src/data/ingredients.json", JSON.stringify(ings));
    fs.writeFileSync("src/data/words.json", JSON.stringify((Array.from(words))));
    fs.writeFileSync("src/data/frequencies.json", JSON.stringify(freq));

})
