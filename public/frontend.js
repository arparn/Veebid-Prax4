const API_URL = 'http://localhost:8000';

function get_players() {
    fetch(`${API_URL}/players`)
        .then(response => response.json())
        .then(data => console.log('players: ', data))
        .catch(err => console.error(err))
}

function get_games() {
    fetch(`${API_URL}/games`)
        .then(response => response.text())
        .then(data => console.log('games: ', data))
        .catch(err => console.error(err))
}

function add_player(name) {
    let p_name = {name: name}

    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(p_name),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }})
        .then(response => response.text())
        .then(data => console.log(data))
        .then(err => console.error(err))
}