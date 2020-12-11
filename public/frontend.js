const API_URL = 'http://localhost:8000';

let game_id;
let p_name;

function connect(name) {
    fetch(`/connect/?name=${name}`)
        .then(res => res.json())
        .then(data => {
            game_id = data.id
            p_name = data.name
            sessionStorage.setItem('id', game_id)
            sessionStorage.setItem('name', p_name)
            get_data()
            check_if_begin(game_id)
        })
}

function check_if_begin(id) {
    fetch(`/check/?id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.check === true) {
                location.href = data.url
            } else {
                setTimeout(() => {
                    check_if_begin(id)
                }, 2000)
            }
        })
}

function get_data() {
    console.log(sessionStorage.getItem('id'))
    console.log(sessionStorage.getItem('name'))
}






// function connect(name) {
//     let p_name = {name: name};
//     fetch(`/connect`, {
//         method: 'POST',
//         body: JSON.stringify(p_name),
//         headers: {
//             'Content-type': 'application/json; charset=UTF-8'
//         }})
//         .then(response => response.json())
//         .then(id => console.log(id.id))
//         .catch(err => console.error(err))
//
// }