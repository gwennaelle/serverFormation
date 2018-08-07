import express from 'express'
import fs from 'fs'

const app = express()


// middleware
// -------------------------------------------------------------------------------------
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');
    next();
})

app.use(function (req, res, next) {
    setTimeout(next, 3000);
})


// routes
// -------------------------------------------------------------------------------------
app.get('/movies', (req, res) => {
    var json = fs.readFileSync('src/data/movies.json')
    res.send(JSON.parse(json))
})

app.get('/', function (req, res) {
    res.send('Hello World!')
})
  
app.get('/ping', (req, res) => {
    res
    .status(200)
    .send('pong')
})

// demarrage de l'application
// -------------------------------------------------------------------------------------
app.listen(5000, function () {
  console.log('Example app listening on port 5000!')
})