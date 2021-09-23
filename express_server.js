const express = require("express");
const bodyParser = require("body-parser");
var cookieSession = require('cookie-session')


const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({name: 'session', secret: 'grey-rose-juggling-volcanoes'}));

// const bcrypt = require('bcrypt');


const PORT = 8080; // default port 8080


const { getUserByEmail, generateRandomString, urlsForUser } = require('./helpers');



// console.log(shortURL, req.body)
// generateRandomString()

const urlDatabase = {
 
  // "b2xVn2": "http://www.lighthouselabs.ca",
  // "9sm5xK": "http://www.google.com"
};

const users = {

 };


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});







app.get("/urls", (req, res) => {

  const user_id = req.session.user_id;

  const userUrls = urlsForUser(user_id, urlDatabase);

  const templateVars = { urls: userUrls, user: users[user_id] };


  if (!user_id) { res.statusCode = 401 }
  
  res.render("urls_index", templateVars);
});


// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });


// app.get("/hello", (req, res) => {
//   const templateVars = { greeting: 'Hello World!' };
//   res.render("hello_world", templateVars);
// });




app.get("/urls", (req, res) => {
  const user_id = req.session.user_id
  const userUrls = urlsForUser(user_id, urlDatabase);

  const templateVars = { urls: userUrls, user: users[user_id] };


  if (!user_id) { res.statusCode = 401 }
  
  res.render("urls_index", templateVars);
});




app.post("/urls", (req, res) => {if (req.session.user_id) {


  if (req.session.userID) {

    const shortURL = generateRandomString();
      urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      user_id: req.session.user_id
    };
    res.redirect(`/urls/${shortURL}`);
  }

  }

   else {
  const errorMessage = ' log in again!';
  res.status(401).render('urls_wrong', {user: users[req.session.user_id], errorMessage});
}
});


app.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    const templateVars = {user: users[req.session.user_id]};
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  }

});




app.get("/urls/:shortURL" , (req, res) => {

 const shortURL = req.params.shortURL;
  const user_id = req.session.user_id;
  const userUrls = urlsForUser(user_id, urlDatabase);
  const templateVars = { urlDatabase, userUrls, shortURL, user: users[user_id] };

  if (!urlDatabase[shortURL]) {
    const errorMessage = 'URL not found.';
    res.status(404).render('urls_wrong', {user: users[user_id], errorMessage});
  } else if (!user_id || !userUrls[shortURL]) {
    const errorMessage = 'you can not get this URL';
    res.status(401).render('urls_wrong', {user: users[user_id], errorMessage});
  } else {
    res.render('urls_show', templateVars);
  }

});


app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;

  if (req.session.user_id  && req.session.user_id === urlDatabase[shortURL].user_id) {
    urlDatabase[shortURL].longURL = req.body.updatedURL;
    res.redirect(`/urls`);
  } else {
    const errorMessage = 'No authorization';
    res.status(401).render('urls_wrong', {user: users[req.session.user_id], errorMessage});
  }
});





app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });


  app.post("/urls/:shortURL/delete", (req, res) => {
 
      const shortURL = req.params.shortURL;
      if (req.session.user_id  && req.session.user_id === urlDatabase[shortURL].user_id) {
        delete urlDatabase[shortURL];
        res.redirect('/urls');
      } else {
        const errorMessage = 'No authorization';
        res.status(401).render('urls_wrong', {user: users[req.session.user_id], errorMessage});
      }
   
  });



  app.get("/u/:shortURL", (req, res) => {
    if (urlDatabase[req.params.shortURL]) {
      res.redirect(urlDatabase[req.params.shortURL].longURL);
    } else {
      const errorMessage = 'URL NOT found!';
      res.status(404).render('urls_wrong', {user: users[req.session.user_id], errorMessage});
    }
  });

  


  app.post("/urls/:id", (req, res) => {
 
   
   const shortURL = req.params.id;
      urlDatabase[shortURL].longURL = req.body.newURL;
      res.redirect('/urls');
    
  });


  app.get('/login', (req, res) => {
    if (req.session.user_id) {
      return res.redirect('/urls');
    }
  
    const templateVars = {user: users[req.session.user_id]};
    res.render('urls_login', templateVars);
  });



  app.post("/login", (req, res) => {
    // const username = req.body.username;
    // const password = req.body.password;
    // const templateVars = {
    //   username: req.cookies["username"],
    //   password: req.cookies["password"]};

    app.post('/login', (req, res) => {
      const user = getUserByEmail(req.body.email, users);
    
      // if (user && bcrypt.compareSync(req.body.password, user.password)) {
        req.session.user_id = user.user_id;
        res.redirect('/urls');
      // } else {
        const errorMessage = 'enter the correct USER and PASS';
        res.status(401).render('urls_wrong', {user: users[req.session.user_id], errorMessage});
      // }
    });
    
   

  });


  app.post("/logout", (req, res) => {
    res.redirect('/urls');
  });


  app.get('/register', (req, res) => {
    if (req.session.user_id) {
      return res.redirect('/urls');
    }
  
    const templateVars = {user: users[req.session.user_id]};
    res.render('urls_registration', templateVars);
  });
 
  

  app.post('/register', (req, res) => {
   
        // users[user_id] = {user_id, email: req.body.email,password: req.body.password };
        // req.session.user_id = user_id;
        if (req.body.password &&  req.body.email ) {

          if (getUserByEmail(req.body.email, users) === false) {
            const user_id = generateRandomString();


            users[user_id] = {
              user_id,
              email: req.body.email,
              // password: bcrypt.hashSync(req.body.password, 10)
              password:req.body.password 

            };
            req.session.user_id = user_id;
            res.redirect('/urls');
          } else {
            const errorMessage = 'this email is already exist! try again please!';
            res.status(400).render('urls_wrong', {user: users[req.session.user_id], errorMessage});
          }
      
        } else {
          const errorMessage = 'write USER and PASS please!';
          res.status(400).render('urls_wrong', {user: users[req.session.user_id], errorMessage});
        }

      } )









