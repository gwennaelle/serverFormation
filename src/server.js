import express from 'express'
import fs from 'fs'

const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/ping', (req, res) => {
    res
    .status(200)
    .send('pong')
  })

app.get('/movies', (req, res) => {
    var json = fs.readFileSync('src/data/movies.json')
    res.send(JSON.parse(json))
})

app.listen(5000, function () {
  console.log('Example app listening on port 5000!')
})