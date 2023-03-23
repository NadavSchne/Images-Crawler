const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const crawl = require('./Crawler');

app.use(bodyParser.urlencoded({ extended: true })); //  for parsing  HTTP requests in JSON format  
app.use(bodyParser.json());
app.use(cors());

// connecting to mongo db
mongoose.connect('mongodb://localhost:27017/Crawl', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('Database connected');
});



// set up routes
app.post('/api/crawl', async (req, res) => {
    try {
      const url = req.body.url;                                     //retrieving data from request's body
      const depth = req.body.depth;
      //console.log(url)
      //console.log(depth)
      const data = await crawl(url, depth, db);                     // calling our crawl func in Crawler.js
      //console.log(data)

      res.json(data); // send back data
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});