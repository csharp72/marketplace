import GameBoard from './GameBoard'

const gameBoard = window.gameBoard = new GameBoard();
console.log(gameBoard);

let marketplace = document.getElementById('marketplace');
let marketplaceCards = marketplace.getElementsByClassName('card');
marketplace.addEventListener('click', (e) => {
  e.target.card.toggleSelect();
  render();
})

let myHand = document.getElementById('my-cards');
myHand.addEventListener('click', (e) => {
  e.target.card.toggleSelect();
  render();
});

let myTokens = document.getElementById('my-tokens');

let myCamels = document.getElementById('my-camels');

let sellBtn = document.getElementById('sell-button');
sellBtn.addEventListener('click', (e) => {
  gameBoard.sell();
  render();
})

const render = () => {
  gameBoard.cardsInPlay.forEach((card, i) => {
    marketplaceCards[i].innerHTML = card.type;
    marketplaceCards[i].dataset.selected = card.selected;
    marketplaceCards[i].card = card;
  });

  myHand.innerHTML = "";
  gameBoard.players[0].cards.forEach((card) => {
    let cardEl = document.createElement('div');
    cardEl.className = "card";
    cardEl.innerHTML = card.type;
    cardEl.dataset.selected = card.selected;
    cardEl.card = card;
    myHand.append(cardEl);
  });

  myTokens.innerHTML = "";
  gameBoard.players[0].tokens.forEach((token) => {
    let tokenEl = document.createElement('div');
    tokenEl.className = "token";
    tokenEl.innerHTML = token.type + " " + token.value;
    myTokens.append(tokenEl);
  });

  myCamels.innerHTML = "Camels " + gameBoard.players[0].camels.length;
}

render();