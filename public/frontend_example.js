const API_URL = 'http://localhost:8080';

function get_json(endpoint) {
    fetch(`${API_URL}/${endpoint}`)
        .then(response => response.json())
        .then(data => console.log("JSON response", data))
        .catch(err => console.error(err))
}



function get_text(endpoint) {
    fetch(`${API_URL}/${endpoint}`)
        .then(response => response.text())
        .then(data => console.log("TEXT response", data))
        .catch(err => console.error(err))
}



function post_data() {

    let data = {name: "Mati", location: "Tartu"};

    fetch(`${API_URL}/welcome`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
        .then(response => response.text())
        .then(data => {
            console.log("POST RESPONSE: " + data)
        })
        .catch(err => console.error(err))
}
