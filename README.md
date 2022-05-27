# recipe-extractor by ski

## Roles (tentative)
- Shadmn Rakib: PM, parsing recipe data
- Kevin Cao: web server and deployment using docker and nginx
- Ivan Mijacika: frontend

## Description
Our project is an API that takes in a url to a recipe, extracts all information relating to the recipe, and returns the data in a simple, structured format. [104.131.177.26](http://104.131.177.26)

## Launch Codes
Install Docker
1. ```curl -fsSL https://get.docker.com -o get-docker.sh```
2. ```sudo sh get-docker.sh```
Create Docker Container
1. ```sudo docker pull kcao20/recipe-extractor```
2. ```sudo docker run -d -p 80:8080 kcao20/recipe-extractor```
