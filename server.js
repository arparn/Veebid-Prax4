const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 10000

app.use(bodyParser.json())

app.get('/', (request, response) => {

    let name = request.query['name'] || 'person with no name';
    let age = request.query['age'];

    let msg = `Hello ${name}! You are ${age} years old.`;

    response.json(msg);
    //response.json(JSON.stringify(msg))
})

// app.post('/', (request, response) => {
//
//     let name = request.body['name'] || 'person with no name'
//     let age = request.body['age']
//
//     response.send(`POST: Hello ${name}! You are ${age} years old.`)
// })

app.listen(port, () => {
    console.log('port: ' + port)
});