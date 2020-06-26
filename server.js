const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const ShortUrl = require('./models/ShortUrl');

const connectDB = require('./config/db');

//load env vars

dotenv.config({ path: './config/config.env' });

connectDB();


const app = express();


app.set('view engine', 'ejs');
app.use(express.json());



const shortUrl  = require('./routes/sorturl');
const auth = require('./routes/auth');
const users = require('./routes/users');
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

// app.post('/shortUrls', async (req, res) => {
//   await ShortUrl.create({ full: req.body.fullUrl })

//   res.redirect('/')
// })

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.use('/api/v1/url', shortUrl);
app.use('/api/v1/auth', auth);
app.use('/api/v1/user', users)




app.listen(process.env.PORT || 5000);