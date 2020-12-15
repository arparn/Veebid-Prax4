const express = require('express');
const path = require('path');
const port = 6019;
const app = express();
const bodyParser = require("body-parser");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


let game_id = 0;
let games = [];
let dice_states = [];
let saved_combinations = [];

app.post('/my_daces', function(req, res) {
    let dices = req.body.dices;
    let hold = req.body.hold;
    let id = req.body.id;
    let p_name = req.body.name;
    let p_id = req.body.p_id;
    let saved = req.body.saved;
    if (games[id].whose_turn == p_id) {
        dice_states[id].name = p_name;
        dice_states[id].result_saved = saved;
        dice_states[id].current_dices = dices;
        dice_states[id].hold = hold;
    }
    if (saved == true) {
        if (games[id].whose_turn == 0) {
            games[id].whose_turn = 1;
        } else {
            games[id].whose_turn = 0;
            games[id].turns = games[id].turns - 1;
            if (games[id].turns == 0) {
                games[id].game_over = true;
            }
        }
    }
    res.send(games[id]);
})

app.post('/my_score', function (req, res) {
    let id = req.body.id;
    let p_id = req.body.p_id;
    let yah = req.body.yahtzee;
    let sum_upper = req.body.sumUpper;
    let sum = req.body.sum;
    let bonus = req.body.bonus;
    saved_combinations[id].results[p_id] = req.body.score;
    saved_combinations[id].yahtzee[p_id] = yah;
    saved_combinations[id].sum_upper[p_id] = sum_upper;
    saved_combinations[id].bonus[p_id] = bonus;
    saved_combinations[id].sum[p_id] = sum;

    let data = {game_over: games[id].game_over, turns: games[id].turns};
    res.send(data);
})

app.get('/allow_play', async function (req, res) {
    let id = req.query['id'];
    let p_id = req.query['my_id'];
    if (games[id].game_over == true) {
        res.send(false);
    } else if (games[id].whose_turn != p_id) {
        res.send(false);
    } else {
        res.send(true);
    }
})

app.get('/enemy_score', function (req, res) {
    let id = req.query['id'];
    let my_id = req.query['my_id'];
    let p_id;
    let enemy;
    if (my_id == 0) {
        p_id = 1;
        enemy = games[id].p2;
    } else {
        p_id = 0;
        enemy = games[id].p1;
    }
    let data = {combinations: saved_combinations[id].results[p_id], yahtzee: saved_combinations[id].yahtzee[p_id],
        sum: saved_combinations[id].sum[p_id], sumUpper: saved_combinations[id].sum_upper[p_id],
        bonus: saved_combinations[id].bonus[p_id], game_over: games[id].game_over, turn: games[id].turns, enemy: enemy}
    res.send(data);
})

app.get('/enemy_dices', function (req, res) {
    let id = req.query['id'];
    let data = {dice: dice_states[id].current_dices, hold: dice_states[id].hold}
    res.send(data);
})

app.get('/connect', function(req, res) {
    let name = req.query['name'];
    let turns = req.query['turns'];
    if (games.length < 1) {
        games.push({id: game_id, p1: name, p2: '', begin: false, turns: turns, whose_turn: 0, game_over: false});
        dice_states.push({id: game_id, name: name, result_saved: false, current_dices: [1, 1, 1, 1, 1], hold: [false, false, false, false, false]});
        saved_combinations.push({id: game_id, results: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
            yahtzee: [0, 0], bonus: [0, 0], sum_upper: [0, 0], sum: [0, 0]});
        res.send({id: game_id, name: name, my_id: 0, turns: games[game_id].turns});
    } else {
        let found = false;
        for (const game of games) {
            if (game.begin == false && game.turns == turns && game.p2 == '') {
                game.p2 = name;
                game.begin = true;
                found = true;
                res.send({id: game.id, name: name, my_id: 1, turns: game.turns});
            }
        }
        if (found == false) {
            game_id++;
            games.push({id: game_id, p1: name, p2: '', begin: false, turns: turns, whose_turn: 0, game_over: false});
            dice_states.push({id: game_id, name: name, result_saved: false, current_dices: [1, 1, 1, 1, 1], hold: [false, false, false, false, false]});
            saved_combinations.push({id: game_id, results: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
                yahtzee: [0, 0], bonus: [0, 0], sum_upper: [0, 0], sum: [0, 0]});
            res.send({id: game_id, name: name, my_id: 0, turns: games[game_id].turns});
        }
    }
})

app.get('/check', function (req, res) {
    let id = req.query['id'];
    return res.send({check: games[id].begin, url: '/multiplayer.html'});
})

app.listen(port, () => {
    console.log(`Listening at port: ${port}`);
})