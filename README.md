# recipe-extractor by ski

## Roles
- Shadmn Rakib: PM, parsing recipe data
- Kevin Cao: web server and deployment using docker / frontend
- Ivan Mijacika: frontend

## Description
Our project is an API that takes in a url to a recipe, extracts all information relating to the recipe, and returns the data in a simple, structured format.

Droplet URL: [104.131.177.26](http://104.131.177.26)

Demo URL: [https://drive.google.com/file/d/11_hULbu59lHktXoc7iZFTsVWmVfdeHkt/view?usp=sharing](https://drive.google.com/file/d/11_hULbu59lHktXoc7iZFTsVWmVfdeHkt/view?usp=sharing)

## Docker
[Docker Image](https://hub.docker.com/r/kcao20/recipe-extractor)

## Launch Codes

### Using Docker Hub Image
Install Docker (on linux)
1.  ```curl -fsSL https://get.docker.com -o get-docker.sh```
2.  ```sudo sh get-docker.sh```

Create Docker Container
1.  ```sudo docker pull kcao20/recipe-extractor```
2.  ```sudo docker run -d -p 80:8080 kcao20/recipe-extractor```

Go to localhost:80

### Creating image from source
Install Docker (on linux)
1.  ```curl -fsSL https://get.docker.com -o get-docker.sh```
2.  ```sudo sh get-docker.sh```

Create Docker Image
1.  ```git clone https://github.com/shadmanrakib/recipe-extractor.git```
2.  ```cd app```
2.  ```sudo docker build -t <image_name> .```

Create Docker Container
1.  ```sudo docker run -d -p 80:8080 <image_name>```

Go to localhost:80

### Running using Node.js

[Install Node.JS](https://nodejs.dev/learn/how-to-install-nodejs/)

1.  ```git clone https://github.com/shadmanrakib/recipe-extractor.git```
2.  ```cd app```
3.  ```npm i```
4.  ```npm run start```

Go to localhost:8080
