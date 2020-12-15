
let min = 1; // dlya randoma vibora kubikov
let max = 6; // dlya randoma vibora kubikov
let rolls = 0; // broski
let turn = 13; // indikator hodov

let held = [false, false, false, false, false]; // otlozenniye kubiki
let diceValues = [0, 0, 0, 0, 0]; // cifri na kubikah
let sameSum = [0, 0, 0, 0, 0, 0]; // summi kubikov s odinakovimi znacheniyami
let lowerSectionSum = [0, 0, 0, 0, 0, 0]; // summa ockov nizney sekcii
let savedSum = [false, false, false, false, false, false, false, false, false, false, false, false]; // vse sohranenniye kombinacii
let savedScore = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // vse ocki za sohranenniye kombinacii

let resultSaved = false; // indikator sohraneniya ockov, pokazivaet konec hoda
let gameOver = false; // indikator konca igri
let upperCheckSum = false; // indikator zapolnenosti verhney sekcii
let sumUpper = 0;
let sum = 0;
let bonus = 0;

let yahtzee = 0; // summa za yahtzee
let hadYahtzee = false; // indikator yahtze

let enemy = 'Enemy';

let enemyScore = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let enemyDices = [1, 1, 1, 1, 1];
let enemyHold = [false, false, false, false, false];
let enemyYahtzee = 0;
let enemySum = 0;
let enemySumUpper = 0;
let enemyBonus = 0;

function get(id) {
    return document.getElementById(id);
}

function setMessage(message) {
    get('message-field').innerText = message;
}

function getRandomInt(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function changeDie(diceId) {
    let number = getRandomInt(min, max);
    if (number === 1) {
        get(diceId).src = "images/one.png";
    }
    if (number === 2) {
        get(diceId).src = "images/two.png";
    }
    if (number === 3) {
        get(diceId).src = "images/three.png";
    }
    if (number === 4) {
        get(diceId).src = "images/four.png";
    }
    if (number === 5) {
        get(diceId).src = "images/five.png";
    }
    if (number === 6) {
        get(diceId).src = "images/six.png";
    }

    if(held[diceId] === false) {
        diceValues[diceId] = number;
    }
}

function holdDie(id) {
    if (rolls > 0 && rolls < 3) {
        if (held[id] == false) {
            held[id] = true;
            get(id).style.border = "solid red";
        } else {
            held[id] = false;
            get(id).style.border = "none";
        }
        send_my_dices(diceValues, held);
    }
}

function resetDices() {
    can_i_play().then(function (res) {
        if (res == true && rolls < 3 && turn > 0 && gameOver == false) {
            if (resultSaved == true) {
                held = [false, false, false, false, false];
                resultSaved = false;
            }
            sameSum = [0, 0, 0, 0, 0, 0];
            lowerSectionSum = [0, 0, 0, 0, 0, 0];
            for (let i = 0; i < 5; i++) {
                if (held[i] == false) {
                    changeDie(i);
                }
            }
            rolls++;
            let rollsNum = 3 - rolls;
            setMessage(sessionStorage.getItem('name') + " have " + rollsNum + " rolls left. Turns left: " + turn)
            calculateSame();
            calculateSameLower();
            fillTable();
            send_my_dices(diceValues, held);
        }
    })
}

function renderEnemyDices() {
    for (let i = 0; i < 5; i++) {
        let number = enemyDices[i];
        if (number == 1) {
            get(i).src = "images/one.png";
        }
        if (number == 2) {
            get(i).src = "images/two.png";
        }
        if (number == 3) {
            get(i).src = "images/three.png";
        }
        if (number == 4) {
            get(i).src = "images/four.png";
        }
        if (number == 5) {
            get(i).src = "images/five.png";
        }
        if (number == 6) {
            get(i).src = "images/six.png";
        }
        if (enemyHold[i] == true) {
            get(i).style.border = "solid red";
        } else {
            get(i).style.border = "none";
        }
    }
}


function calculateSame() {
    for (let i = 0; i < 5; i++) {
        let number = diceValues[i]; //берём значение кубика по индексу из листа с кубиками
        sameSum[number - 1] = number + sameSum[number - 1]; // в листе sameSum индексация начинается с 0, поэтому отнимаем от значения кубика 1 чтобы получить его индекс (6 имеет индекс 5 и тд.)
    }
}

function calculateSameLower() {
    let sumOfThree = false;
    let sumOfFour = false;
    let fullHousePair = false;
    let sumOfAll = 0;
    let smallStraight = calculateSmallStraight();
    let bigStraight = calculateBigStraight();
    let yahtzeeCheck = false;
    for (let i = 0; i < 5; i++) {
        let number = diceValues[i];
        sumOfAll = number + sumOfAll;
        let same = 0;
        for (let y =  0; y < 5; y++) {
            if (diceValues[y] === number) {
                same ++;
            }
        }
        if (same === 3) {
            sumOfThree = true;
        }
        if (same === 4) {
            sumOfFour = true;
        }
        if (same === 2) {
            fullHousePair = true;
        }
        if (same === 5) {
            yahtzeeCheck = true;
        }
    }
    for (let z = 0; z < 6; z++) {
        switch(z) {
            case(0):
                if (sumOfThree === true) {
                    lowerSectionSum[z] = sumOfAll;
                }
                break;
            case(1):
                if (sumOfFour === true) {
                    lowerSectionSum[z] = sumOfAll;
                }
                break;
            case(2):
                if (sumOfThree === true && fullHousePair === true) {
                    lowerSectionSum[z] = 25;
                }
                break;
            case(3):
                if (smallStraight === true) {
                    lowerSectionSum[z] = 30;
                }
                break;
            case(4):
                if (bigStraight === true) {
                    lowerSectionSum[z] = 40;
                }
                break;
            case(5):
                lowerSectionSum[z] = sumOfAll;
                break;
        }
    }
    if (yahtzeeCheck === true && hadYahtzee === false) {
        yahtzee = 50;
    }
    if (yahtzeeCheck === true && hadYahtzee === true) {
        yahtzee = yahtzee + 100;
    }
}

function calculateSmallStraight() {
    if (diceValues.includes(1) && diceValues.includes(2) && diceValues.includes(3) && diceValues.includes(4)) {
        return true;
    }
    if (diceValues.includes(2) && diceValues.includes(3) && diceValues.includes(4) && diceValues.includes(5)) {
        return true;
    }
    return diceValues.includes(3) && diceValues.includes(4) && diceValues.includes(5) && diceValues.includes(6);

}

function calculateBigStraight() {
    if (diceValues.includes(1) && diceValues.includes(2) && diceValues.includes(3) && diceValues.includes(4) && diceValues.includes(5)) {
        return true;
    }
    return diceValues.includes(2) && diceValues.includes(3) && diceValues.includes(4) && diceValues.includes(5) && diceValues.includes(6);
}

function fillTable() {
    for (let i = 0; i < 6; i++) {
        switch(i) {
            case 0:
                if (savedSum[i] === false) {
                    get("onesScore").innerText = sameSum[i];
                }
                if (savedSum[i + 6] === false) {
                    get("threeOfAKindScore").innerText = lowerSectionSum[i];
                }
                break;
            case 1:
                if (savedSum[i] === false) {
                    get("twosScore").innerText = sameSum[i];
                }
                if (savedSum[i + 6] === false) {
                    get("fourOfAKindScore").innerText = lowerSectionSum[i];
                }
                break;
            case 2:
                if (savedSum[i] === false) {
                    get("threesScore").innerText = sameSum[i];
                }
                if (savedSum[i + 6] === false) {
                    get("fullHouseScore").innerText = lowerSectionSum[i];
                }
                break;
            case 3:
                if (savedSum[i] === false) {
                    get("foursScore").innerText = sameSum[i];
                }
                if (savedSum[i + 6] === false) {
                    get("smallStraightScore").innerText = lowerSectionSum[i];
                }
                break;
            case 4:
                if (savedSum[i] === false) {
                    get("fivesScore").innerText = sameSum[i];
                }
                if (savedSum[i + 6] === false) {
                    get("largeStraightScore").innerText = lowerSectionSum[i];
                }
                break;
            case 5:
                if (savedSum[i] === false) {
                    get("sixesScore").innerText = sameSum[i];
                }
                if (savedSum[i + 6] === false) {
                    get("jokerScore").innerText = lowerSectionSum[i];
                }
                break;
        }
    }
    get("yahtzeeScore").innerText = yahtzee;
}

function fillTableEnemy() {
    for (let i = 0; i < 6; i++) {
        switch(i) {
            case 0:
                get("onesScore2").innerText = enemyScore[i];
                get("threeOfAKindScore2").innerText = enemyScore[i + 6];
                break;
            case 1:
                get("twosScore2").innerText = enemyScore[i];
                get("fourOfAKindScore2").innerText = enemyScore[i + 6];
                break;
            case 2:
                get("threesScore2").innerText = enemyScore[i];
                get("fullHouseScore2").innerText = enemyScore[i + 6];
                break;
            case 3:
                get("foursScore2").innerText = enemyScore[i];
                get("smallStraightScore2").innerText = enemyScore[i + 6];
                break;
            case 4:
                get("fivesScore2").innerText = enemyScore[i];
                get("largeStraightScore2").innerText = enemyScore[i + 6];
                break;
            case 5:
                get("sixesScore2").innerText = enemyScore[i];
                get("jokerScore2").innerText = enemyScore[i + 6];
                break;
        }
    }
    get("yahtzeeScore2").innerText = enemyYahtzee;
    get("upperSecSumScore2").innerText = enemySumUpper;
    get("upperSecBoonusScore2").innerText = enemyBonus;
    get("totalScore2").innerText = enemySum;
}

function saveResult(id, cellId) {
    can_i_play().then(function (res) {
        if (res == true) {
            if (savedSum[id] === false && resultSaved === false) {
                savedSum[id] = true;
                savedScore[id] = parseInt(get(cellId).innerText);
                get(cellId).style.background = "grey";
                resultSaved = true;
                if (upperCheckSum == false && checkUpperSection() == true) {
                    upperCheckSum = true;
                    sumUpper = calcSumUpper();
                    if (sumUpper >= 63) {
                        bonus = 35;
                    }
                    get("upperSecBoonusScore").style.background = "grey";
                    get("upperSecBoonusScore").innerText = bonus;
                    get("upperSecSumScore").style.background = "grey";
                    get("upperSecSumScore").innerText = sumUpper + bonus;
                }
                setMessage("Result saved! " + enemy + "'s turn!");
                send_my_dices([1, 1, 1, 1, 1], [false, false, false, false, false]);
                send_scores(savedScore, yahtzee, sumUpper, sum, bonus);
                resetAll();
            }
        }
    })
    setTimeout(() => {
        can_i_play().then(r => console.log('result saved'));
    }, 2000);
}

function saveYahtzee(cellId) {
    can_i_play().then(function (res) {
        if (res == true) {
            if (hadYahtzee == false) {
                hadYahtzee = true;
            }
            get(cellId).style.background = "grey";
            resultSaved = true;
            setMessage("Result saved!" + enemy + "'s turn!");
            send_my_dices([1, 1, 1, 1, 1], [false, false, false, false, false]);
            send_scores(savedScore, yahtzee, sumUpper, sum, bonus);
            resetAll();
        }
    })
    setTimeout(() => {
        can_i_play().then(r => console.log('result saved'));
    }, 2000);
}

function resetAll() {
    rolls = 0;
    resetHold();
    setDicesToOne();
    sameSum = [0, 0, 0, 0, 0, 0];
    lowerSectionSum = [0, 0, 0, 0, 0, 0];
    fillTable();
}

function setDicesToOne() {
    for (let i = 0; i < 5; i++) {
        get(i).src = "images/one.png";
    }
}

function resetHold() {
    for (let i = 0; i < 5; i++) {
        get(i).style.border = "none";
    }
}


function checkUpperSection() {
    for (let i = 0; i < 5; i++) {
        if (savedSum[i] === false) {
            return false;
        }
    }
    return true;
}

function calcSum() {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        sum = sum + savedScore[i];
    }
    return sum + yahtzee;
}

function calcSumUpper() {
    let sum = 0;
    for (let i = 0; i < 6; i++) {
        sum = sum + savedScore[i];
    }
    return sum;
}

function whoWon() {
    if (sum > enemySum) {
        return sessionStorage.getItem('name') + " win!";
    } else {
        return enemy + " win!";
    }
}

function ret() {
    if (gameOver) {
        history.go(-1);
    }
}

// -POST DATA TO SERVER- //

function send_my_dices(dices, hold) {
    let data = {
        id: sessionStorage.getItem('id'),
        name: sessionStorage.getItem('name'),
        p_id: sessionStorage.getItem('my_id'),
        dices: dices,
        hold: hold,
        saved: resultSaved
    };
    fetch('/my_daces', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
        .then(res => res.json())
}

function send_scores(score, yahtzee, sumUp, sum_all, bon) {
    let data = {
        id: sessionStorage.getItem('id'),
        p_id: sessionStorage.getItem('my_id'),
        score: score,
        yahtzee: yahtzee,
        sumUpper: sumUp,
        sum: sum_all,
        bonus: bon
    };
    fetch('/my_score', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    }).then(res => res.json())
}

// _POST DATA TO SERVER END- //


// -GET DATA FROM SERVER- //

async function can_i_play() {
    const res = await fetch(`/allow_play/?id=${sessionStorage.getItem('id')}&my_id=${sessionStorage.getItem('my_id')}`)
    const ans = await res.json();
    get_enemy_score();
    if (gameOver == false && ans == false) {
        setMessage(enemy + "'s turn!");
        setTimeout(() => {
            get_enemy_dices();
            can_i_play();
        }, 2000);
    } else if (gameOver == true) {
        sum = calcSum();
        if (upperCheckSum === false) {
            sumUpper = calcSumUpper();
            get("upperSecSumScore").innerText = sumUpper;
            get("upperSecBoonusScore").innerText = bonus;
        }
        get("totalScore").innerText = sum;
        get("totalScore").style.background = "grey";
        let message = "Your score is: " + sum + ". " + "Game Over!";
        setMessage(message);
        send_scores(savedScore, yahtzee, sumUpper, sum, bonus);
        get_enemy_score();
    } else {
        setMessage('Your turn!');
        if (rolls == 0) {
            resetAll();
        }
        return ans;
    }
}

function get_enemy_dices() {
    fetch(`/enemy_dices/?id=${sessionStorage.getItem('id')}`)
        .then(res => res.json())
        .then(data => {
            enemyDices = data.dice;
            enemyHold = data.hold;
            renderEnemyDices();
        })
}

function get_enemy_score() {
    fetch(`/enemy_score/?id=${sessionStorage.getItem('id')}&my_id=${sessionStorage.getItem('my_id')}`)
        .then(res => res.json())
        .then(score => {
            enemyScore = score.combinations;
            enemyYahtzee = score.yahtzee;
            enemySum = score.sum;
            enemyBonus = score.bonus;
            enemySumUpper = score.sumUpper;
            gameOver = score.game_over;
            turn = score.turn;
            enemy = score.enemy;
            get('player2Name').innerText = enemy;
            get('player1Name').innerText = sessionStorage.getItem('name');
            fillTableEnemy();
            if (gameOver && enemySum == 0) {
                get_enemy_score();
            }
            if (gameOver && enemySum != 0) {
                let message = "Your score is: " + sum + ". " + "Game Over!";
                let who_won = whoWon();
                setMessage(message + ' ' + who_won);
            }
        });
}

// -GET DATA FROM SERVER END- //


// -CONNECTION- //

function connect(name, turns) {
    fetch(`/connect/?name=${name}&turns=${turns}`)
        .then(res => res.json())
        .then(data => {
            sessionStorage.setItem('id', data.id); // game id
            sessionStorage.setItem('name', data.name); // this player name
            sessionStorage.setItem('my_id', data.my_id); // this player id (to check whose turn is)
            turn = data.turns;
            check_if_begin(sessionStorage.getItem('id'));
        })
}

function check_if_begin(id) {
    fetch(`/check/?id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.check === true) {
                location.href = data.url;
            } else {
                setTimeout(() => {
                    check_if_begin(id)
                }, 2000);
            }
        })
}

// -CONNECTION END- //