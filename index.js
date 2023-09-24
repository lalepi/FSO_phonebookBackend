const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('build'))
const morgan = require('morgan')

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms '))

const cors = require('cors')

app.use(cors())

let persons = [
      { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-2424-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      }
]
  
console.log(persons.length)
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
   
    res.send( `Phonebook has info for ${persons.length} people ` + `<br/> ` + ` ${Date()}` );

})

app.get('/api/persons/:id', (req, res) => {

const id = Number(req.params.id)
const person = persons.find(person => person.id === id)
if (person) {
    res.json(person)
}
else {
    res.status(404).end()
}
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

    const nameCheck = persons.find(person => person.name === body.name)
    if (nameCheck) {
        
     return res.status(400).json({
        error:'name must be unique'
     })   
    }

    const person = {
        name: body.name,
        number: body.number,
        id:generateId()
    }

    persons = persons.concat(person)

    res.json(person)

})


const generateId = () => {
    const max = Math.floor(123456)
    const min = Math.ceil(1983)
    const newId = Math.floor(Math.random() * (max - min) + min) 
    return newId
}


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
