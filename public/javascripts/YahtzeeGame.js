let min = 1; // dlya randoma vibora kubikov
let max = 6; // dlya randoma vibora kubikov
let rolls = 0; // broski
let turn = 1; // indikator hodov
let maxTurn = 7; // max hodi

let held = [false, false, false, false, false]; // otlozenniye kubiki
let diceValues = [0, 0, 0, 0, 0]; // cifri na kubikah
let sameSum = [0, 0, 0, 0, 0, 0]; // summi kubikov s odinakovimi znacheniyami
let lowerSectionSum = [0, 0, 0, 0, 0, 0]; // summa ockov nizney sekcii
let savedSum = [false, false, false, false, false, false, false, false, false, false, false, false]; // vse sohranenniye kombinacee
let savedScore = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // vse ocki za sohranenniye kombinacii

let resultSaved = false; // indikator sohraneniya ockov, pokazivaet konec hoda
let gameOver = false; // indikator konca igri
let turnsChoosed = false; // indikator vibora kolicestva hodov
let upperCheckSum = false; // indikator zapolnenosti verhney sekcii

let yahtzee = 0; // summa za yahtzee
let savedYahtzee = 0; // ocki sohranennogo yahtze
let hadYahtzee = false; // indikator yahtze

let player1 = "";
let player2 = "";
let whoseTurn = 0; // indicator cei hod


let savedSum2 = [false, false, false, false, false, false, false, false, false, false, false, false];
let savedScore2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let yahtzee2 = 0;
let savedYahtzee2 = 0;
let hadYahtzee2 = false;
let upperCheckSum2 = false;

let sum1 = 0;
let sum2 = 0;

function get(id) {
    return document.getElementById(id);
}

function setMessage(message) {
    get('message-field').innerText = message;
}

function setName(name, cellId) {
    get(cellId).innerText = name + "'s Score:"
}

function getRandomInt(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function changeDie(diceId) {
    let number = getRandomInt(min, max)
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

function resetDices() {
    if (turnsChoosed === false) {
        maxTurn = get("selectTurns").value;
        player1 = get("player1").value;
        player2 = get("player2").value;
        setName(player1, "player1Name");
        setName(player2, "player2Name");
        turnsChoosed = true;
    }
    if (rolls < 3 && turn < maxTurn + 1 && gameOver === false) {
        if (resultSaved === true) {
            held = [false, false, false, false, false];
            resultSaved = false;
        }
        sameSum = [0, 0, 0, 0, 0, 0];
        lowerSectionSum = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 5; i++) {
            if (held[i] === false) {
                changeDie(i);
            }
        }
        rolls++;
        let rollsNum = 3 - rolls;
        let message = "";
        if (whoseTurn > 0) {
            message = player2 + " have " + rollsNum + " rolls left. Turn: " + turn;
        } else {
            message = player1 + " have " + rollsNum + " rolls left. Turn: " + turn;
        }
        setMessage(message);
        calculateSame();
        calculateSameLower();
        fillTable();
    }
}

function holdDie(id) {
    if (rolls > 0 && rolls < 3) {
        if (held[id] === false) {
            held[id] = true;
            get(id).style.border = "solid red";
        } else {
            held[id] = false;
            get(id).style.border = "none";
        }
    }
}

function resetHold() {
    for (let i = 0; i < 5; i++) {
        get(i).style.border = "none";
    }
}

function setDicesToOne() {
    for (let i = 0; i < 5; i++) {
        get(i).src = "images/one.png";
    }
}

function calculateSame() {
    for (let i = 0; i < 5; i++) {
        let number = diceValues[i]; //берём значение кубика по индексу тз листа с кубиками
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
    if (whoseTurn > 0) {
        if (yahtzeeCheck === true && hadYahtzee2 === false) {
            yahtzee2 = 50;
        }
        if (yahtzeeCheck === true && hadYahtzee2 === true && savedYahtzee2 > 0) {
            yahtzee2 = savedYahtzee2 + 100;
        }
    } else {
        if (yahtzeeCheck === true && hadYahtzee === false) {
            yahtzee = 50;
        }
        if (yahtzeeCheck === true && hadYahtzee === true && savedYahtzee > 0) {
            yahtzee = savedYahtzee + 100;
        }
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
    if (whoseTurn > 0) {
        for (let i = 0; i < 6; i++) {
            switch(i) {
                case 0:
                    if (savedSum2[i] === false) {
                        get("onesScore2").innerText = sameSum[i];
                    }
                    if (savedSum2[i + 6] === false) {
                        get("threeOfAKindScore2").innerText = lowerSectionSum[i];
                    }
                    break;
                case 1:
                    if (savedSum2[i] === false) {
                        get("twosScore2").innerText = sameSum[i];
                    }
                    if (savedSum2[i + 6] === false) {
                        get("fourOfAKindScore2").innerText = lowerSectionSum[i];
                    }
                    break;
                case 2:
                    if (savedSum2[i] === false) {
                        get("threesScore2").innerText = sameSum[i];
                    }
                    if (savedSum2[i + 6] === false) {
                        get("fullHouseScore2").innerText = lowerSectionSum[i];
                    }
                    break;
                case 3:
                    if (savedSum2[i] === false) {
                        get("foursScore2").innerText = sameSum[i];
                    }
                    if (savedSum2[i + 6] === false) {
                        get("smallStraightScore2").innerText = lowerSectionSum[i];
                    }
                    break;
                case 4:
                    if (savedSum2[i] === false) {
                        get("fivesScore2").innerText = sameSum[i];
                    }
                    if (savedSum2[i + 6] === false) {
                        get("largeStraightScore2").innerText = lowerSectionSum[i];
                    }
                    break;
                case 5:
                    if (savedSum2[i] === false) {
                        get("sixesScore2").innerText = sameSum[i];
                    }
                    if (savedSum2[i + 6] === false) {
                        get("jokerScore2").innerText = lowerSectionSum[i];
                    }
                    break;
            }
        }
        get("yahtzeeScore2").innerText = yahtzee2;
    } else {
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
}

function saveResult2(id, cellId) {
    if (whoseTurn > 0) {
        if (savedSum2[id] === false && resultSaved === false) {
            savedSum2[id] = true;
            savedScore2[id] = parseInt(get(cellId).innerText);
            get(cellId).style.background = "grey";
            resultSaved = true;
            if (upperCheckSum2 === false && checkUpperSection2() === true) {
                upperCheckSum2 = true;
                let sumUpperCalc = calcSumUpper2();
                let boonus = 0;
                if (sumUpperCalc >= 63) {
                    boonus = 35;
                }
                get("upperSecBoonusScore2").style.background = "grey";
                get("upperSecBoonusScore2").innerText = boonus;
                get("upperSecSumScore2").style.background = "grey";
                get("upperSecSumScore2").innerText = sumUpperCalc + boonus;
            }
            if (turn === maxTurn) {
                let sum = calcSum2();
                if (upperCheckSum2 === false) {
                    get("upperSecSumScore2").innerText = calcSumUpper2();
                    get("upperSecBoonusScore2").innerText = 0;
                }
                get("totalScore2").innerText = sum;
                sum2 = sum;
                let mess = whoWon(sum1, sum2);
                get("totalScore2").style.background = "grey";
                setMessage("Game Over! " + player2 + "'s score is: " + sum + ". " + mess);
                gameOver = true;
            } else {
                setMessage("Result saved! To roll dice again press 'Roll Dice");
            }
            resetAll();
            turn++;
            whoseTurn = 0;
        }
    }
}

function saveResult(id, cellId) {
    if (whoseTurn === 0) {
        if (savedSum[id] === false && resultSaved === false) {
            savedSum[id] = true;
            savedScore[id] = parseInt(get(cellId).innerText);
            get(cellId).style.background = "grey";
            resultSaved = true;
            if (upperCheckSum === false && checkUpperSection() === true) {
                upperCheckSum = true;
                let sumUpperCalc = calcSumUpper();
                let boonus = 0;
                if (sumUpperCalc >= 63) {
                    boonus = 35;
                }
                get("upperSecBoonusScore").style.background = "grey";
                get("upperSecBoonusScore").innerText = boonus;
                get("upperSecSumScore").style.background = "grey";
                get("upperSecSumScore").innerText = sumUpperCalc + boonus;
            }
            if (turn === maxTurn) {
                let sum = calcSum();
                if (upperCheckSum === false) {
                    get("upperSecSumScore").innerText = calcSumUpper();
                    get("upperSecBoonusScore").innerText = 0;
                }
                get("totalScore").innerText = sum;
                get("totalScore").style.background = "grey";
                sum1 = sum;
                setMessage(player1 + "'s score is: " + sum  + ". " + player2 + "'s turn!");
            } else {
                setMessage("Result saved! To roll dice again press 'Roll Dice");
            }
            resetAll();
            whoseTurn = 1;
        }
    }
}

function saveYahtzee2(cellId) {
    if (whoseTurn > 0) {
        if (hadYahtzee2 === false) {
            hadYahtzee2 = true;
        }
        savedYahtzee2 = yahtzee2;
        get(cellId).style.background = "grey";
        resultSaved = true;
        if (turn === maxTurn) {
            let sum = calcSum2();
            if (upperCheckSum === false) {
                get("upperSecSumScore2").innerText = calcSumUpper2();
                get("upperSecBoonusScore2").innerText = 0;
            }
            get("totalScore2").innerText = sum;
            get("totalScore2").style.background = "grey";
            sum2 = sum;
            let mess = whoWon(sum1, sum2);
            setMessage("Game Over! " + player2 + "'s score is: " + sum + ". " + mess);
            gameOver = true;
        } else {
            setMessage("Result saved! To roll dice again press 'Roll Dice");
        }
        resetAll();
        turn++;
        whoseTurn = 0;
    }
}

function saveYahtzee(cellId) {
    if (whoseTurn === 0) {
        if (hadYahtzee === false) {
            hadYahtzee = true;
        }
        savedYahtzee = yahtzee;
        get(cellId).style.background = "grey";
        resultSaved = true;
        if (turn === maxTurn) {
            let sum = calcSum();
            if (upperCheckSum === false) {
                get("upperSecSumScore").innerText = calcSumUpper();
                get("upperSecBoonusScore").innerText = 0;
            }
            get("totalScore").innerText = sum;
            sum1 = sum;
            get("totalScore").style.background = "grey";
            setMessage(player1 + "'s score is: " + sum + ". " + player2 + "'s turn!");
        } else {
            setMessage("Result saved! To roll dice again press 'Roll Dice");
        }
        resetAll();
        whoseTurn = 1;
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

function checkUpperSection2() {
    for (let i = 0; i < 5; i++) {
        if (savedSum2[i] === false) {
            return false;
        }
    }
    return true;
}

function resetAll() {
    rolls = 0;
    resetHold();
    setDicesToOne();
    sameSum = [0, 0, 0, 0, 0, 0];
    lowerSectionSum = [0, 0, 0, 0, 0, 0];
    fillTable();
}

function calcSum() {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        sum = sum + savedScore[i];
    }
    return sum + yahtzee;
}

function calcSum2() {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        sum = sum + savedScore2[i];
    }
    return sum + yahtzee2;
}

function calcSumUpper() {
    let sum = 0;
    for (let i = 0; i < 6; i++) {
        sum = sum + savedScore[i];
    }
    return sum;
}

function calcSumUpper2() {
    let sum = 0;
    for (let i = 0; i < 6; i++) {
        sum = sum + savedScore2[i];
    }
    return sum;
}

function whoWon(sum1, sum2) {
    if (sum1 > sum2) {
        return player1 + " win!";
    } else {
        return player2 + " win!";
    }

}