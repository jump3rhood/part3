const mongoose = require('mongoose')

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.y4uxh.mongodb.net/phonebookdb?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
const Person = mongoose.model('Person', personSchema);

mongoose.connect(url).then(res => {
    console.log("Connected to database");
    if(process.argv.length > 3) {
        const name = process.argv[3];
        const number = process.argv[4];
        const person = new Person({
            name: name,
            number: number
        })
        return person.save()
    }
    return Person.find({})
}).then((res) => {
    if(process.argv.length > 3)
        console.log(`Added ${res.name} number ${res.number} to the phonebook`);
    else {
        console.log("Phonebook:");
        res.forEach(person => console.log(`${person.name} ${person.number}`))
    }
    mongoose.connection.close();
}).catch(err => console.log(err));