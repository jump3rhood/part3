require('dotenv').config()
const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const app = express();
const Person = require('./models/person')
const logger = morgan(':method :url :status :res[content-length] - :response-time ms :body');
// allow cors
app.use(cors());
app.use(express.json()); // to parse json sent in the request
app.use(logger);    // logger
app.use(express.static('build'))
morgan.token('body', (req) => {
    return JSON.stringify(req.body);
})
let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
];
app.get('/info', (request, response)=> {
    const date = new Date();
    response.send(`Phonebook has info for ${persons.length} people
        ${date.toString()}`)
})
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.status(200).json(persons);
    })
})

app.post('/api/persons', (request, response)=> {
    const person = request.body;
    if(!person.name || !person.number){
        return response.status(400).json({error: 'name and/or number missing'})
    }
    const duplicate = persons.find( p => p.name.toLowerCase() === person.name.toLowerCase())
    if(duplicate){
        return response.status(400).json({error: 'name must be unique'})
    }
    persons = persons.concat(person)
    response.status(200).json(person);
})

app.get('/api/persons/:id', (request, response)=> {
    Person.findById(request.params.id).then(person => {
        response.status(200).json(person);
    }).catch(err => response.status(404).end())
})
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(p => p.id !== id);
    response.status(204).end();
})
const generateId = () => {
    return Math.floor(Math.random()*1000+1);
}
const PORT = process.env.PORT || 3001;
app.listen(PORT)
console.log(`listening on port ${PORT}`);