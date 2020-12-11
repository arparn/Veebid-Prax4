const API_URL = 'http://localhost:8000';

let game_id;

function connect(name) {
    let p_name = {name: name};
    fetch(`${API_URL}/connect`, {
        method: 'POST',
        body: JSON.stringify(p_name),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }})
        .then(response => response.text())
        .then(id => game_id = id)
        .catch(err => console.error(err))
}

function get_id() {
    console.log(game_id);
}