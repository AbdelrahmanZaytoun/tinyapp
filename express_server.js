const express = require("express");
const bodyParser = require("body-parser");
var cookieSession = require('cookie-session')


const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({name: 'session', secret: 'grey-rose-juggling-volcanoes'}));

var bcrypt = require('bcryptjs');


const PORT = 8080; 


const { getUserByEmail, generateRandomString, urlsForUser } = require('./helpers');





const urlDatabase = {
 

};

const users = {

 };


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



app.get("/", (req, res) => {
  if (req.session.userID) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});







app.get("/urls", (req, res) => {

  const userID = req.session.userID;

  const userUrls = urlsForUser(userID, urlDatabase);

  const templateVars = { urls: userUrls, user: users[userID] };


  if (!userID) { 

    res.redirect('/login');
    res.statusCode = 401 
  }
  
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
  const userID = req.session.userID
  const userUrls = urlsForUser(userID, urlDatabase);

  const templateVars = { urls: userUrls, user: users[userID] };


  if (!userID) { res.statusCode = 401 }
  
  res.render("urls_index", templateVars);
});




app.post("/urls", (req, res) => {if (req.session.userID) {


  if (req.session.userID) {

    const shortURL = generateRandomString();
      urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: req.session.userID
    };
    res.redirect(`/urls/${shortURL}`);
  }

  }

   else {
  const errorMessage = ' log in again!';
  res.status(401).render('urls_error', {user: users[req.session.userID], errorMessage});
}
});


app.get("/urls/new", (req, res) => {
  if (req.session.userID) {
    const templateVars = {user: users[req.session.userID]};
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  }

});




app.get("/urls/:shortURL" , (req, res) => {

 const shortURL = req.params.shortURL;
  const userID = req.session.userID;
  const userUrls = urlsForUser(userID, urlDatabase);
  const templateVars = { urlDatabase, userUrls, shortURL, user: users[userID] };

  if (!urlDatabase[shortURL]) {
    const errorMessage = 'URL not found.';
    res.status(404).render('urls_error', {user: users[userID], errorMessage});
  } else if (!userID || !userUrls[shortURL]) {
    const errorMessage = 'you can not get this URL';
    res.status(401).render('urls_error', {user: users[userID], errorMessage});
  } else {
    res.render('urls_show', templateVars);
  }

});


app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;

    urlDatabase[shortURL].longURL = req.body.updatedURL;
    res.redirect(`/urls`);
  
});





app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });


  app.post("/urls/:shortURL/delete", (req, res) => {
 
      const shortURL = req.params.shortURL;
      if (req.session.userID  && req.session.userID === urlDatabase[shortURL].userID) {
        delete urlDatabase[shortURL];
        res.redirect('/urls');
      } else {
        const errorMessage = 'No authorization';
        res.status(401).render('urls_error', {user: users[req.session.userID], errorMessage});
      }
   
  });



  app.get("/u/:shortURL", (req, res) => {
    if (urlDatabase[req.params.shortURL]) {
      res.redirect(urlDatabase[req.params.shortURL].longURL);
    } else {
      const errorMessage = 'URL NOT found!';
      res.status(404).render('urls_error', {user: users[req.session.userID], errorMessage});
    }
  });

  


  app.post("/urls/:id", (req, res) => {
 
   
   const shortURL = req.params.id;
      urlDatabase[shortURL].longURL = req.body.newURL;
      res.redirect('/urls');
    
  });

  console.log("heasdasd")


  app.get('/login', (req, res) => {
    console.log(req.session.userID)
  
  
    const templateVars = {user: users[req.session.userID]};
    res.render('urls_login', templateVars);
  });



 

    app.post('/login', (req, res) => {
      const user = getUserByEmail(req.body.email, users);
    
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        req.session.userID = user.userID;
        res.redirect('/urls');
      } else {
        const errorMessage = 'enter the correct USER and PASS';
        res.status(401).render('urls_error', {user: users[req.session.userID], errorMessage});
      }
    });
    
   



  app.post("/logout", (req, res) => {
    
    req.session.userID = null 
    res.redirect('/urls');
  });


  app.get('/register', (req, res) => {
    // if (!req.session.userID) {
    //   return res.redirect('/urls');
    // }
  
    const templateVars = {user: users[req.session.userID]};
    res.render('urls_registration', templateVars);
  });
 
  

  app.post('/register', (req, res) => {
   
        // users[userID] = {userID, email: req.body.email,password: req.body.password };
        // req.session.userID = userID;
        if (req.body.password &&  req.body.email ) {

          if (!getUserByEmail(req.body.email, users)) {
            const userID = generateRandomString();


            users[userID] = {
              userID,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, 10)

            };
            req.session.userID = userID;
            res.redirect('/urls');
          } else {
            const errorMessage = 'this email is already exist! try again please!';
            res.status(400).render('urls_error', {user: users[req.session.userID], errorMessage});
          }
      
        } else {
          const errorMessage = 'write USER and PASS please!';
          res.status(400).render('urls_error', {user: users[req.session.userID], errorMessage});
        }

      } )









