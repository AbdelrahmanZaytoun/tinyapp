const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

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

const users = { };




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

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls", (req, res) => {
  const user_id = req.session.user_id
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
    res.redirect(`/urls/${shortURL}`)
  });

app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  res.redirect(longURL);
});


app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });


  app.post("/urls/:shortURL/delete", (req, res) => {
 
      const shortURL = req.params.shortURL;
      delete urlDatabase[shortURL];
      res.redirect('/urls');
   
  });


  app.post("/urls/:id", (req, res) => {
 
   
   const shortURL = req.params.id;
      urlDatabase[shortURL].longURL = req.body.newURL;
      res.redirect('/urls');
    
  });



  app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const templateVars = {
      username: req.cookies["username"],
      password: req.cookies["password"]
    
    };
    res.render("urls_index", templateVars);

  });


  app.post("/logout", (req, res) => {
    res.redirect('/urls');
  });


  app.get('/register', (req, res) => {
    if (req.session.user_id) {
      res.redirect('/urls');
      return;
    }
  
    const templateVars = {user: users[req.session.user_id]};
    res.render('urls_registration', templateVars);
  });
 
  

  app.post('/register', (req, res) => {
   
  
  
        users[user_id] = {
          user_id,
          email: req.body.email,
          password: req.body.password
        };

        req.session.user_id = user_id;
        res.redirect('/urls');
      } )