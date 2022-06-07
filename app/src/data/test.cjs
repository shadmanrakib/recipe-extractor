const fs = require("fs")
const xlsxFile = require('read-excel-file/node');
 
xlsxFile('src/data/MyFoodData-Nutrition-Facts-SpreadSheet-Release-1-4.xlsx').then((rows) => {
const ings = []
const words = new Set()
const freq = {}
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
 fs.writeFileSync("src/data/sortedWords.json", JSON.stringify((Array.from(words).sort((a, b) => freq[b] - freq[a]))));
 fs.writeFileSync("src/data/frequencies.json", JSON.stringify(freq));

})

// // console.log(Object.keys(file["FoundationFoods"][0]))
// // console.log(file["FoundationFoods"][0].description)

// for (let index = 0; index < file["FoundationFoods"].length; index++) {
//     const food = file["FoundationFoods"][index];
//     ings.push(food.description)
// }

// console.log(ings.length)
// fs.writeFileSync("./ingredients.json", JSON.stringify(ings));
