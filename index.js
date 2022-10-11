require('dotenv').config()
const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const app = express();
const Person = require('./models/person')
const logger = morgan(':method :url :status :res[content-length] - :response-time ms :body');
app.use(express.static('build'))
// allow cors
app.use(cors());
app.use(express.json()); // to parse json sent in the request
app.use(logger);    // logger
morgan.token('body', (req) => {
    return JSON.stringify(req.body);
})

app.get('/info', (request, response)=> {
    const date = new Date();
    response.send(`Phonebook has info for people
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
    const newPerson = new Person(person);
    newPerson.save().then(person => {
        response.status(200).json(person);
    }).catch(err => {
        response.status(400).json({error: err.message})
    })
})

app.get('/api/persons/:id', (request, response)=> {
    Person.findById(request.params.id)
        .then(person => {
            if(person)
                response.status(200).json(person);
            else 
                response.status(400).end()
    }).catch(err => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
    })
})
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    Person.findByIdAndRemove(id)
        .then(result => {
            console.log(result);
            response.status(202).end();
        }).catch(error => {
            console.log(error);
            response.status(500).end();
        })
})
const generateId = () => {
    return Math.floor(Math.random()*1000+1);
}
const PORT = process.env.PORT || 3001;
app.listen(PORT)
console.log(`listening on port ${PORT}`);