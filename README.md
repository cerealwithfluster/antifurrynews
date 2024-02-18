# anti furry news 
it's some site for furry news, makes no sense right? because if its "anti" furry wouldnt it be like hating on furries?
The owner of the twitter account said it's a joke, plus they're a furry. but this is basically just a site for furry fandom news.

**Made By: [kastry/patch](https://twitter.com/Kastrydev)**
# set up 
## Front End:
I used [a free hosting provider](https://devpage.me/) to host the site, if you have basic coding/hosting knowledge you go to files and more, etc etc, public html, dump the frontend/index.html then make a folder named "dashboard", dump dashboard/index.html in there.
"But, why folders?" - It removes the ugly extension (***.html or .js***) from the URL since it's the index file of the folder. making the url more sexy instead of "**https://example.com/dashboard.html/**"

Now, Go through all the files, placeholder is the backend (**A replit file**) URL, except for "SendToWebhook" on the dashboard/index.html and replace stuff, so on and so forth.
## Back End:
Make a [replit account](https://replit.com)
Make a new project, Node JS, Dump the code from backend/index.js into index.js
Read the **Database (backend)** part to set up the DB
Go to [discord dev portal](https://discord.dev)
Make  a new bot, Oauth, get client ID and secret or whatever, save those, go back to replit and replace these with that info
```js
// Set up Discord OAuth2 strategy
passport.use(new DiscordStrategy({
  clientID: 'client id',
  clientSecret: 'client secret',
  callbackURL: 'placeholder/auth/discord/callback',
  scope: ['identify', 'email'] // Adjust scope according to your needs
},
```
Now, start it and open the replit webpage thing in a new tab, copy the URL and replace all the placeholders that are like this:
``placeholder/api/[whatever[]`` and ``placeholder/[whatever]`` with the URL, make sure the URL is BEHIND the other things like ``/api`` and ``/auth``
Now, go back to the discord Oauth, make a redirect/callback URL the replit URL and ``[replit url]/auth/discord`` and ``[replit url]/auth/discord/callback``
Now, try logging in using discord with this URL:
``https://my.replit.url.thingy/auth/discord``
Replace my.replit.url.thingy with your replit dev url thing.
it should redirect you to discord, prompting you to let **[your bot name]** "access your account"
Accept it, so on. New data written to the DB.
Go to the DB site [db4free](https://db4free.net/phpMyAdmin) and make the ``authorized`` field inside of ``users`` the value **1** (true)
Visit the dashboard on the free domain you got, **Make SURE that the REPLIT IS RUNNING**.

## Database (Back End)
Make a account on [db4free](https://db4free.net/)
Save the login info
Open phpMyAdmin or whatever on their site, login
Paste THIS into the console thing they have
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    discordId VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    username VARCHAR(255),
    avatar VARCHAR(255),
    authorized BOOLEAN DEFAULT FALSE
);

```
It will:
Make a new table called ***users***
Make records/fields to it which are used by discord (when you like, oauth and such)

The authorized field is a **BOOLEAN**, 0 = false, 1 = true. this allows access to the dashboard.
go back to replit, index.js
find this code which is placeholders and replace it with this:
```js
// Configure MySQL connection
const db = mysql.createConnection({
  host: 'db4free.net',
  port: '3306',
  user: 'your username when signing up',
  password: 'database + account password (its the same thing)',
  database: 'the database name you gave when signing up'
});

```
