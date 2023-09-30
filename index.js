require('dotenv').config()

const express = require('express')
const app = express()
const persons = require('./models/persons')
const morgan = require('morgan')
const cors = require('cors')


app.use(express.json())
app.use(express.static('build'))
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms '))
app.use(cors())


app.get('/api/persons', (req, res) => {
    persons.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/info', (req, res) => {

    res.send(`Phonebook has info for ${persons.length} people ` + `<br/> ` + ` ${Date()}`);

})

app.get('/api/persons/:id', (req, res) => {

    persons.findById(req.params.id).then(persons => {
        res.json(persons)
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
  })


app.post('/api/persons', (req, res) => {
    const body = req.body

    if(!body.name){
        return res.status(400).json({
            error:'Name information missing'
        })
    }
    if(!body.number){
        return res.status(400).json({
            error:'Number information missing'
        })
    }

    // const nameCheck = persons.find(person => person.name === body.name)
    // if (nameCheck) {
        
    //  return res.status(400).json({
    //     error:'name must be unique'
    //  })   
    // }

    const person = new persons({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPersons => {
        res.json(savedPersons)
    })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
