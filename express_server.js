const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const PORT = 8080; // default port 8080


let generateRandomString = function() {
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    let randomCharCode = Math.floor(Math.random() * 26 + 97);
    let randomChar = String.fromCharCode(randomCharCode);
    randomString += randomChar;
  }
  return randomString;
}


// console.log(shortURL, req.body)
// generateRandomString()

const urlDatabase = {
 
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



app.get("/", (req, res) => {
  res.send(req);
});

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });


// app.get("/hello", (req, res) => {
//   const templateVars = { greeting: 'Hello World!' };
//   res.render("hello_world", templateVars);
// });


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]}
  res.render("urls_show",templateVars);
});


  
  //....
  app.post("/urls", (req, res) => {
    const shortURL = generateRandomString() 
    const longURL = req.body.longURL
    urlDatabase[shortURL] = longURL
    res.redirect(`/urls ${shortURL}`)
  });

app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  res.redirect(longURL);
});




app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });


 

 