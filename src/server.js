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
    setTimeout(next, 5000);
})


// routes
// -------------------------------------------------------------------------------------
app.get('/movies', (req, res) => {
    var json = fs.readFileSync('src/data/movies.json')
    res.send(JSON.parse(json))
})

app.get('/filteredMovies', (req, res) => {
    var json = fs.readFileSync('src/data/movies.json')
    var movies = JSON.parse(json)
   // console.log(movies)
   const filterdMovies = movies.map(movie => {
       return {
       id: movie.id, 
       title: movie.title,
       movieTag: movie.movieTag
       }
       // res.send(JSON.parse(element.movietag))
    });

    res.send(filterdMovies)
    
})

app.get('/movies/:id', (req, res) => {
    var json = fs.readFileSync('src/data/movies.json')
    var movies = JSON.parse(json)
   // console.log(movies)
   const selecteddMovie = movies.find(movie => {
       return movie.id == req.params.id
       })
       // res.send(JSON.parse(element.movietag))
    res.send(selecteddMovie)
    
})

/// Destructuration : newMovies = filteredMovies
const movies = JSON.parse(fs.readFileSync('src/data/movies.json'))
const newMovies = movies.map(({ title, movieTag}) => {
    return { title, movieTag }
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