require('dotenv').config()

const express = require('express')
const app = express()
const persons = require('./models/persons')
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms '))
app.use(cors())


app.get('/api/persons', (req, res) => {
    persons.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/info', (req, res) => {
    persons.find({}).then(persons => {
        res.send(`Phonebook has info for ${persons.length} people ` + `<br/> ` + ` ${Date()}`);
    })
})

app.get('/api/persons/:id', (req, res, next) => {

    persons.findById(req.params.id).then(persons => {
        res.json(persons)
    })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    persons.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))

})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const person = new persons({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPersons => {
        res.json(savedPersons)
    })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }

    persons.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})


const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    console.log(error.name)

    if (error.name === 'ValidationError') {
        return res.status(400).send({ error: 'information missing' })
    }
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
