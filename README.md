## Introduction

I was playing around with 3D graphics in p5js (you can find the results here: https://codepen.io/wesserboy/pen/dvLmQw) and the possibilities of WEB_GL intrigued me. 
I was kind of limited by the possibilities of p5js and so I decided to try and learn how to use the real deal.
Since the main game I play these days is Minecraft, I decided to try and replicate (the basics of) this game.
This will be the project I use to explore WEB_GL.

## Disclaimer

Basically this is just my learning process, so don't expect anything to come from this.
Also, this will not be clean and nice code (for obvious reasons :P).

## .gitignore

In this section i will explain what files i hid using .gitignore, and where you can find them if you wish to clone this repository.

### /libs
I don't want to redistribute the libraries that I am using, and this is why the /libs/ folder is included in the .gitignore file. If you want to see which libraries I am using, you can look at page.html. At the bottem of the body tag you will see a comment saying "load libraries", the script tags underneath this line load libraries that I am using. I rename all the files to the exact name (and if possible version) of the libraries so it should be relitively easy to find them from there.

### /assets
Since i don't have any intend of ever actually publishing this project, I am using Minecraft's original assets. I have no right to distribute these files, and this is why they are included in the .gitignore. These files are located in the assets folder, and they're used throughout the render.js file.

### server-cors.py
When locally developing WEB_GL, you can't load textures from the local machine. This is because the CORS policy blocks the requests. This python script hosts a simple http server to serve the content I need from the other folders in the repository (in the js code you'll see me reference localhost:8000, this is where the server is hosted). The native python server doesn't add a 'Access-Control-Allow-Origin' header, this script adds that header to the responses it sends. It is 95% based on the gist found here: https://gist.github.com/razor-x/9542707, with a couple of minor changes I made to fit my personal needs.