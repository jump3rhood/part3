require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person');
const logger = morgan(':method :url :status :res[content-length] - :response-time ms :body');
app.use(express.static('build'));
// allow cors
app.use(cors());
app.use(express.json()); // to parse json sent in the request
app.use(logger);    // logger
morgan.token('body', (req) => {
    return JSON.stringify(req.body);
})

app.get('/info', (request, response, next) => {
    const date = new Date();
    Person.find({})
        .then(persons => {
            response.status(200).send(`Phonebook has info of ${persons.length} people
            ${date.toString()}`);
        }).catch(error => next(error));
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.status(200).json(persons);
    });
})

app.post('/api/persons', (request, response, next) => {
    const person = request.body;
    if(!person.name || !person.number){
        return response.status(400).json({ error: 'name and/or number missing' });
    }
    Person.find({ name: person.name }).then(foundPerson => {
        if(foundPerson){
            response.status(400).json({ error: 'Name already in phonebook' });
            return;
        } else {
            const newPerson = new Person(person);
            newPerson.save().then(person => {
                response.status(200).json(person);
            }).catch(error => {
                next(error);
            })
        }
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person)
                response.status(200).json(person);
            else
                response.status(400).end()
        }).catch(error => next(error));
})

app.put('/api/persons/:id', (request,response, next) => {
    const id = request.params.id;
    const body = request.body;
    Person.findByIdAndUpdate(id, body, { new: true, runValidators: true })
        .then(updatedPerson => {
            if(updatedPerson)
                response.status(200).json(updatedPerson);
            else
                response.status(404).json({ error: 'Resource with id already deleted or not found' })
        }).catch(error => next(error));
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;
    Person.findByIdAndRemove(id)
        .then(result => {
            console.log(result);
            response.status(202).end();
        }).catch(error => {
            next(error);
        })
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message);
    if(error.name === "CastError") {
        return response.status(400).send({ error: 'malformatted id' });
    }
    if(error.name === "ValidationError")
        return response.status(400).send({ error: error.message })
    next(error);
}
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT)
console.log(`listening on port ${PORT}`);