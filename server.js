const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = 8000

let turns = 13;
players = [];
games = [];

app.use(cors())	//Enable CORS

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

app.get('/players', (req, res) => {
    res.json(players);
})

app.get('/games', (req, res) => {
    res.send(games);
})

app.post('/', (req, res) => {
    let name = req.body.name;
    players.push(name);
    if (players.length % 2 === 0) {
        for (let i = 0; i < players.length; i++) {
            if (i % 2 !== 0) {
                games.push([players[i - 1], players[i]])
            }
        }
    }
    res.json(games);
})

app.listen(port, () => {
    console.log(`Listening at port: ${port}`)
})
