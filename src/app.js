import express from 'express'
import fs from 'fs'
import socketio from 'socket.io'
import config from 'config'

const app = express()
const io = socketio(5010)

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// middleware
// -------------------------------------------------------------------------------------
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE');
    next();
})

app.use(express.static('public'));

app.use(function (req, res, next) {
    setTimeout(next, config.get('timeout'));
})



// routes
// -------------------------------------------------------------------------------------
app.get('/movies', (req, res) => {
    var json = fs.readFileSync(config.get('jsonFile'))
    res.send(JSON.parse(json))
})

app.get('/filteredMovies', (req, res) => {
    var json = fs.readFileSync(config.get('jsonFile'))
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
    var json = fs.readFileSync(config.get('jsonFile'))
    var movies = JSON.parse(json)
    const selecteddMovie = movies.find(movie => {
        return movie.id == req.params.id
    })
    // res.send(JSON.parse(element.movietag))
    if (!selecteddMovie) {
        return res.status(404).send('Film introuvable')
    }
    res.send(selecteddMovie)

})


// add or update movie
app.post('/form', function (req, res) {
    const errors = []

    function validateField(field, msg) {
        if (!field || field.trim().length === 0) {
            errors.push(msg)
        }
    }
    validateField(req.body.title, 'Missing title')
    validateField(req.body.movieTag, 'Missing tag')
    validateField(req.body.synopsis, 'Missing synospis')

    if (errors.length > 0) {
        return res.status(400).send(errors)
    }

    var json = fs.readFileSync(config.get('jsonFile'))
    var movies = JSON.parse(json)
    
    let updatedMovie
    if (!req.body.id) {
        updatedMovie = {
            id: Date.now(),
            title: req.body.title,
            movieTag: req.body.movieTag,
            synopsis: req.body.synopsis
        }
        io.emit('insert-movie', updatedMovie)
        movies.push(updatedMovie)
    } else {
        updatedMovie = movies.find(movie => {
            return movie.id == req.body.id
        })
        if (!updatedMovie) {
            return res.status(404).send('Film introuvable')
        }
        else {
            Object.assign(updatedMovie, req.body)
            io.emit('update-movie', updatedMovie)
            // updatedMovie.title = req.body.title,
            // updatedMovie.movieTag = req.body.tag,
            // updatedMovie.synopsis = req.body.synopsis
        }
    }
    fs.writeFileSync(config.get('jsonFile'), JSON.stringify(movies))
    // console.log(updatesMovie)
    res.send(updatedMovie);
});

// delete movie
app.delete('/movies/:id', (req, res) => {
    var json = fs.readFileSync(config.get('jsonFile'))
    var movies = JSON.parse(json)
    const selectedMovie = movies.find(movie => {
        return movie.id == req.params.id
    })
    // res.send(JSON.parse(element.movietag))
    if (!selectedMovie) {
        return res.status(404).send('Film introuvable')
    }
    io.emit('delete-movie', selectedMovie)
    movies.splice(movies.indexOf(selectedMovie), 1)
    fs.writeFileSync(config.get('jsonFile'), JSON.stringify(movies))
    res.send(movies)

})

/// Destructuration : newMovies = filteredMovies
const movies = JSON.parse(fs.readFileSync(config.get('jsonFile')))
const newMovies = movies.map(({ title, movieTag }) => {
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

// exports
// -------------------------------------------------------------------------------------
export default app