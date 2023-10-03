require('dotenv').config()

const express = require('express')

const app = express()
const morgan = require('morgan')
const cors = require('cors')
const persons = require('./models/persons')

app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms '))
app.use(cors())

app.get('/api/persons', (req, res) => {
  persons.find({}).then((users) => {
    res.json(users)
  })
})

app.get('/info', (req, res) => {
  persons.find({}).then((users) => {
    res.send(`Phonebook has info for ${users.length} people ` + '<br/> ' + ` ${Date()}`)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  persons.findById(req.params.id).then((persons) => {
    res.json(persons)
  })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  persons.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { body } = req

  const person = new persons({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedPersons) => {
    res.json(savedPersons)
  })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  persons.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' },
  )
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  console.log(error.name)

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const { PORT } = process.env

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
