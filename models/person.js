const mongoose = require('mongoose');

const url = process.env.MONGO_URI;

console.log('connecting to', url);

mongoose.connect(url).then(result => {
    console.log("Connected to MongoDB");
}).catch(error => {
    console.log("Error connecting to MongoDB", error.message);
})


const personSchema = new mongoose.Schema({
    name: {
        type: String, 
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (doc, retObj) => {
        retObj.id = retObj._id.toString()
        delete retObj._id
        delete retObj.__v
    }
})


module.exports = mongoose.model('Person', personSchema)