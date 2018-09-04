import app from './app'
import { db } from './db'

// demarrage de l'application
// -------------------------------------------------------------------------------------
(async function () {
  try {
    await db.connect('mongodb://localhost:27017/wiztivi', { useNewUrlParser: true })
    app.listen(5000, function () {
      console.log('Server started')
    })
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
})()


