const fs = require("fs");

function write(file, content) {
  fs.mkdirSync(require("path").dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

write("craigslist-clone/package.json", `{
  "name": "craigslist-clone",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2",
    "sqlite3": "^5.1.6",
    "body-parser": "^1.20.2"
  }
}`);

write("craigslist-clone/server.js", `
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

const db = new sqlite3.Database("database.db");

db.run(\`
CREATE TABLE IF NOT EXISTS posts (
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT,
price TEXT,
description TEXT
)
\`);

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/posts", (req, res) => {
  db.all("SELECT * FROM posts ORDER BY id DESC", [], (err, rows) => {
    res.json(rows);
  });
});

app.post("/posts", (req, res) => {
  const { title, price, description } = req.body;

  db.run(
    "INSERT INTO posts (title, price, description) VALUES (?, ?, ?)",
    [title, price, description],
    function (err) {
      res.json({ id: this.lastID });
    }
  );
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
`);

write("craigslist-clone/public/index.html", `
<!DOCTYPE html>
<html>
<head>
<title>Simple Classifieds</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<h1>Classified Listings</h1>
<a href="post.html">Post New Listing</a>

<div id="posts"></div>

<script src="script.js"></script>

</body>
</html>
`);

write("craigslist-clone/public/post.html", `
<!DOCTYPE html>
<html>
<head>
<title>Post Listing</title>
</head>

<body>

<h2>Create Listing</h2>

<input id="title" placeholder="Title"><br><br>
<input id="price" placeholder="Price"><br><br>
<textarea id="description" placeholder="Description"></textarea><br><br>

<button onclick="submitPost()">Submit</button>

<script>
async function submitPost(){

const title=document.getElementById("title").value
const price=document.getElementById("price").value
const description=document.getElementById("description").value

await fetch("/posts",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({title,price,description})
})

alert("Listing posted")
window.location="index.html"

}
</script>

</body>
</html>
`);

write("craigslist-clone/public/script.js", `
async function loadPosts(){

const res = await fetch("/posts")
const posts = await res.json()

const container = document.getElementById("posts")

posts.forEach(post => {

const div = document.createElement("div")

div.innerHTML = \`
<h3>\${post.title}</h3>
<p>Price: \${post.price}</p>
<p>\${post.description}</p>
<hr>
\`

container.appendChild(div)

})

}

loadPosts()
`);

write("craigslist-clone/public/style.css", `
body{
font-family:Arial;
max-width:700px;
margin:auto;
}

h1{
color:#333;
}

#posts div{
padding:10px;
border-bottom:1px solid #ccc;
}
`);

console.log("Project created: craigslist-clone");
