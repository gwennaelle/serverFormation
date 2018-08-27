import supertest from 'supertest'
import app from '../src/app'
import should from 'should'
import fs from 'fs'
import config from 'config'
import { movieList } from './movie-list'

beforeEach('Reset movie file', () => {
    // runs before each test in this block
    fs.writeFileSync(config.get('jsonFile'), JSON.stringify(movieList))
  });

describe('GET /movies', () => {
    it('should send a list of movies', done => {
        supertest(app)
        .get('/movies')
        .expect(200)
        .expect(res => {
            should.exist(res.body)
            res.body.should.be.a.Array
            res.body.length.should.be.above(0)
            res.body[0].should.have.only.keys('id', 'title', 'movieTag', 'synopsis')
        })
        .end(done)
    })
})

describe('GET /movies/:Id', () => {
    it('should send a movies', done => {
        supertest(app)
        .get('/movies/3')
        .expect(200)
        .expect(res => {
            should.exist(res.body)
            res.body.should.not.be.empty
        })
        .end(done)
    })
    it('should send 404 error', done => {
        supertest(app)
        .get('/movies/51')
        .expect(404)
        .expect(({ text }) => {
            should.exist(text)
        })
        .end(done)
    })
})

describe('POST /form', () => {
    it('should work', done => {
        supertest(app)
        .post('/form')
        .expect(200)
        .send({ title: 'a', tag:'b', synopsis: 'c' })
        .expect(res => {
            should.exist(res.body)
            should.exist(res.body.id)
        })
        .end(done)
    })
    it('should send 400 error', done => {
        supertest(app)
        .post('/form')
        .expect(400)
        .expect(({ text }) => {
            should.exist(text)
        })
        .end(done)
    })
})