//init = estado inicial do jogo
//o state é o objeto de objetos
const state = {

    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points')
    },

    cardsSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },

    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },

    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector('#player-cards'),
        computer: "computer-cards",
        computerBOX: document.querySelector('#computer-cards'),
    },

    actions: {
        button: document.getElementById('next-duel'),
    },

}

const playerSides = {
    player1: 'player-cards',
    computer: 'computer-cards',
}


const pathImages = './src/assets/icons/';

//enumerando, dando sentido para as cartas
const cardData = [

    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}/dragon.png`,
        WinOf: [1],
        LoseOf: [2],
        TieOf: [0],
    },

    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}/magician.png`,
        WinOf: [2],
        LoseOf: [0],
        TieOf: [1],
    },

    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}/exodia.png`,
        WinOf: [0],
        LoseOf: [1],
        TieOf: [2],
    },

];


async function getRandomCardId() {

    const randomIndex = Math.floor(Math.random() * cardData.length);

    return cardData[randomIndex].id;

}


async function createCardImage(IdCard, fieldSide) {

    const cardImage = document.createElement('img');

    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', './src/assets/icons/card-back.png');
    cardImage.setAttribute('data-id', IdCard);
    cardImage.classList.add('card');


    if (fieldSide === playerSides.player1) {

        cardImage.addEventListener('mouseover', () => {

            drawSelectCard(IdCard);

        })

        cardImage.addEventListener('click', () => {

            setCardsField(cardImage.getAttribute("data-id"));
        })
    }

    return cardImage;

}


async function setCardsField(cardId) {

    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await ShowHiddenCardFieldsImages(true);

    await hiddenCardDetails();

    await drawCardsInField(cardId, computerCardId);

    let duelResult = await checkDuelResult(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResult);

}


async function drawCardsInField(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function ShowHiddenCardFieldsImages(value) {

    if (value === true) {

        state.fieldCards.player.style.display = 'block';
        state.fieldCards.computer.style.display = 'block';
    }

    if (value === false) {

        state.fieldCards.player.style.display = 'none';
        state.fieldCards.computer.style.display = 'none';
    }
}


async function hiddenCardDetails() {

    state.cardsSprites.avatar.src = '';
    state.cardsSprites.name.innerText = '';
    state.cardsSprites.type.innerText = '';
}




async function drawButton(text) {

    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = 'block';

}



async function updateScore() {

    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;

}



async function checkDuelResult(playerCardId, computerCardId) {

    let duelResults = 'tie';
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {

        duelResults = 'win';

        state.score.playerScore++;
    }

    if (playerCard.LoseOf.includes(computerCardId)) {

        duelResults = 'lose';

        state.score.computerScore++;
    }

    if (playerCard.TieOf.includes(computerCardId)) {
        duelResults = 'tie';
    }

    await playAudio(duelResults);

    return duelResults;
}



async function removeAllCardsImages() {

    //remove cartas do computer
    let { computerBOX, player1BOX } = state.playerSides;
    let imgElements = computerBOX.querySelectorAll('img');

    imgElements.forEach((img) => img.remove());


    //remove cartas do player
    imgElements = player1BOX.querySelectorAll('img');

    imgElements.forEach((img) => img.remove());

}




function drawSelectCard(index) {

    state.cardsSprites.avatar.src = cardData[index].img;
    state.cardsSprites.name.innerHTML = cardData[index].name;
    state.cardsSprites.type.innerText = 'Attribute: ' + cardData[index].type;
}



async function drawCards(cardNumbers, fieldSide) {

    for (let i = 0; i < cardNumbers; i++) {

        const randomIdCard = await getRandomCardId();

        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }

}


async function resetDuel() {

    state.cardsSprites.avatar.src = '';
    state.actions.button.style.display = 'none';

    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';

    init();
}



async function playAudio(status) {

    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
    audio.volume = 0.2;
}




function init() {

    ShowHiddenCardFieldsImages(false);

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const music = document.getElementById('music');
    music.volume = 0.03;
    music.play();
}

init();