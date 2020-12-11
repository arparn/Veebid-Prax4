const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = 8000

let game_id = 0;
let games = [];
let players = [];


app.use(cors())	//Enable CORS

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

app.post('/connect', ((req, res) => {
    let name = req.body.name;
    if (players.length <= 2) {
        players.push(name);
    }
    if (players.length === 1) {
        games.push({id: 0, p1: '', p2: '', begin: false, turns: 13, whose_turn: 1});
        games[game_id].p1 = name;
        res.json({id: game_id});
    } else if (players.length === 2) {
        games[game_id].p2 = name;
        games[game_id].id = game_id;
        games[game_id].begin = true;
        players = [];
        res.json({g_id: games[game_id].id});
        game_id ++;
    }
    console.log(games);
    console.log(game_id);
}))

app.listen(port, () => {
    console.log(`Listening at port: ${port}`)
})
