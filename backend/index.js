const express = require('express');
const cors = require('cors');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql'); // Import MySQL module
const app = express();
const PORT = process.env.PORT || 3000;

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'placehold',
  port: 'placehold',
  user: 'placehold',
  password: 'placehold',
  database: 'placehold'
});

// Dummy data for testing
let newsArticles = [
    { id: 1, title: "meow meow meow meow meow", description: "test" }]
// middle ware v2

app.use(cors({
  origin: 'https://antifurrynews.devpage.me',
  credentials: true // Allow cookies to be sent
}));


// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your_secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Set up serialization and deserialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Set up Discord OAuth2 strategy
passport.use(new DiscordStrategy({
  clientID: 'placehold',
  clientSecret: 'placehold',
  callbackURL: 'placehold/auth/discord/callback',
  scope: ['identify', 'email'] // Adjust scope according to your needs
},
function(accessToken, refreshToken, profile, done) {

  db.query('SELECT * FROM users WHERE discordId = ?', [profile.id], (err, rows) => {
    if (err) throw err;
    if (rows.length) {

      console.log('data already exists dumbass!')
      const userId = profile.id;
      return done(null, userId);
    } else {

      const user = {
        discordId: profile.id,
        email: profile.email,
        username: profile.username,
        avatar: profile.avatar
      };


      db.query('INSERT INTO users SET ?', user, (err, result) => {
        if (err) throw err;
        console.log('User added to database:', result);

  
        const userId = profile.id;
        return done(null, userId);
      });
    }
  });
}
));
// routes
app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback', passport.authenticate('discord', { failureRedirect: '/login' }), (req, res) => {
  const userId = req.user; 
  if (userId) {
    
    res.redirect(`https://antifurrynews.devpage.me/test?userId=${userId}`);
  } else {
    
    res.status(500).send('Error: User ID not available');
  }
});



app.get('/api/userId', (req, res) => {
  const userId = req.cookies.userId; 
  if (userId) {
    res.json({ userId }); 
  } else {
    res.status(404).json({ error: 'User ID not found' });
  }
});
// get user shit
app.get('/api/user/:userId', (req, res) => {
    const userId = req.params.userId;

    db.query('SELECT avatar, username, email FROM users WHERE discordId = ?', [userId], (err, rows) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else if (rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            const { avatar, username, email } = rows[0];
            const avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`;
            res.json({ userId, avatarUrl, username, email });
        }
    });
});
// dashboard

app.get('/api/checkStaffAccess/:userId', (req, res) => {
    const userId = req.params.userId;

 
    db.query('SELECT authorized FROM users WHERE discordId = ?', [userId], (err, rows) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else if (rows.length === 0) {
            
            res.status(404).json({ error: 'User not found' });
        } else {
            const authorized = rows[0].authorized;
            if (authorized === 1) {
                res.status(200).json({ authorized: true });
            } else {
              
               res.status(403).json({ authorized: false });
            }
        }
    });
});



// 
app.get('/api/news', (req, res) => {
    res.json(newsArticles);
});

app.get('/api/news/specific/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const article = newsArticles.find(article => article.id === id);
    if (article) {
        res.json(article);
    } else {
        res.status(404).json({ message: "Article not found" });
    }
});

app.post('/api/news', (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required.' });
    }
    const newArticle = {
        id: newsArticles.length + 1,
        title,
        description
    };
    newsArticles.push(newArticle);
    res.status(201).json(newArticle);
});

app.put('/api/news/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedArticle = req.body;
    const index = newsArticles.findIndex(article => article.id === id);
    if (index !== -1) {
        newsArticles[index] = { ...newsArticles[index], ...updatedArticle };
        res.json(newsArticles[index]);
    } else {
        res.status(404).json({ message: "Article not found" });
    }
});

app.delete('/api/news/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = newsArticles.findIndex(article => article.id === id);
    if (index !== -1) {
        newsArticles.splice(index, 1);
        res.json({ message: "Article deleted" });
    } else {
        res.status(404).json({ message: "Article not found" });
    }
});




// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
