const express = require('express')
const path = require('path')
const port = 8000;
const app = express();
const bodyParser = require("body-parser");

app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());


let game_id = 0;
let games = [];
let players = [];

app.get('/turn', function (req, res) {
    let needed_id = req.query['id']
    res.send({turn: games[needed_id].whose_turn})
})

app.get('/connect', function(req, res) {
    let name = req.query['name']
    if (players.length <= 2) {
        players.push(name);
    }
    if (players.length === 1) {
        games.push({id: game_id, p1: '', p2: '', begin: false, turns: 13, whose_turn: 0});
        games[game_id].p1 = name;
        res.send({id: game_id, name: name, my_id: 0});
    } else if (players.length === 2) {
        games[game_id].p2 = name;
        games[game_id].begin = true;
        players = [];
        game_id ++;
        res.send({id: games[game_id - 1].id, name: name, my_id: 1});
    }
     console.log(games)
     console.log(game_id)
})

app.get('/check', function (req, res) {
    let id = req.query['id']
    return res.send({check: games[id].begin, url: '/multiplayer.html'})
})

app.listen(port, () => {
    console.log(`Listening at port: ${port}`)
})