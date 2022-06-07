const fs = require("fs")
const xlsxFile = require('read-excel-file/node');
 
xlsxFile('src/data/MyFoodData-Nutrition-Facts-SpreadSheet-Release-1-4.xlsx').then((rows) => {
const ings = []
 for (let i = 4; i < rows.length; i++) {
     const name = rows[i][1];
     console.log(name)
     ings.push((name || "").trim())
 }
 fs.writeFileSync("./ingredients.json", JSON.stringify(ings));

})

// // console.log(Object.keys(file["FoundationFoods"][0]))
// // console.log(file["FoundationFoods"][0].description)

// for (let index = 0; index < file["FoundationFoods"].length; index++) {
//     const food = file["FoundationFoods"][index];
//     ings.push(food.description)
// }

// console.log(ings.length)
// fs.writeFileSync("./ingredients.json", JSON.stringify(ings));
