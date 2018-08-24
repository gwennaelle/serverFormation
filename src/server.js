import express from 'express'
import fs from 'fs'

const app = express()

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// middleware
// -------------------------------------------------------------------------------------
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

app.use(express.static('public'));

app.use(function (req, res, next) {
    setTimeout(next, 300);
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

app.get('/filteredEvents', (req, res) => {
    var json = fs.readFileSync('src/data/GenericEvents.json')
    var events = JSON.parse(json)
   // console.log(movies)
   const filteredEvents = events.map(event => {
       return {
       id: event.id, 
       name: event.name
       }
    });

    res.send(filteredEvents)
    
})

app.get('/movies/:id', (req, res) => {
    var json = fs.readFileSync('src/data/movies.json')
    var movies = JSON.parse(json)
    //console.log(movies.length)
   const selecteddMovie = movies.find(movie => {
       return movie.id == req.params.id
       })
       // res.send(JSON.parse(element.movietag))
    res.send(selecteddMovie)
    
})

app.post('/form', function(req, res) {
    const errors = []

    function validateField(field, msg){
        if (!field || field.trim().length === 0){
            errors.push(msg)
        }
    }
    validateField(req.body.title, 'Missing title')
    validateField(req.body.tag, 'Missing tag')
    validateField(req.body.synopsis, 'Missing synospis')

    if (errors.length > 0) {
        return res.status(400).send(errors)
    }
    
    var json = fs.readFileSync('src/data/movies.json')
    var movies = JSON.parse(json)
    var length = JSON.parse(json).length
    var newMovie = {
        id: length,
        title: req.body.title,
        movieTag: req.body.tag,
        synopsis: req.body.synopsis
    }
    movies.push(newMovie)
    fs.writeFileSync('src/data/movies.json', JSON.stringify(movies))
    res.send(newMovie);
});

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