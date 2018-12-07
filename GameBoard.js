const Commodity = new Map([
  ["camel", 5],
  ["leather", 8],
  ["cloth", 8],
  ["spice", 8],
  ["silver", 6],
  ["gold", 5],
  ["ruby", 4],
]);

const CommodityType = {
  CAMEL: "camel",
  LEATHER: "leather",
  CLOTH: "cloth",
  SPICE: "spice",
  SILVER: "silver",
  GOLD: "gold",
  RUBY: "ruby",
}

const CardAmts = {
  CAMEL: 12,
  LEATHER: 8,
  CLOTH: 8,
  SPICE: 8,
  SILVER: 6,
  GOLD: 5,
  RUBY: 4,
}

const TokenValues = {
  CAMEL: [5],
  LEATHER: [5,4,3,2,1],
  CLOTH: [5,4,3,2,1],
  SPICE: [5,4,3,2,1],
  SILVER: [5,4,3,2,1],
  GOLD: [5,4,3,2,1],
  RUBY: [5,4,3,2,1],
  THREE: [3,4,2,3,4],
  FOUR: [5,6,5,4,6,7],
  FIVE: [7,8,9,10,9,8],
}

class GameBoard {
  constructor() {
    this.tokens = this.buildTokens();
    this.deck = this.buildDeck();
    this.discardPile = [];
    this.cardsInPlay = [
      new Card(CommodityType.CAMEL),
      new Card(CommodityType.CAMEL),
      new Card(CommodityType.CAMEL),
    ];

    this.players = [
      new Player("Me"),
      new Player("Opponent"),
    ];

    for (let i=0; i<5; i++) {
      this.players[0].addCard(this.deck.deal())
      this.players[1].addCard(this.deck.deal())
    }

    this.cardsInPlay.push(
      this.deck.deal(true),
      this.deck.deal(true)
    )

    this.activePlayer = this.players[0];

    this.gameLoop();
  }

  sell() {
    let discarded = 0;
    let player = this.activePlayer;

    for (var i=player.cards.length-1; i>=0; i--) {
      let card = player.cards[i];
      if (card.selected) {
        //count
        discarded++;

        //discard
        this.discardPile.push(player.cards.splice(i,1));

        //collect
        let token = this.tokens[card.type.toUpperCase()].shift();
        if (token) {
          player.tokens.push(token);
        }
      }
    }

    //bonus
    let bonusToken;
    if (discarded >= 5) {
      bonusToken = this.tokens.FIVE.shift();
    } else if (discarded === 4) {
      bonusToken = this.tokens.FOUR.shift();
    } else if (discarded === 3) {
      bonusToken = this.tokens.THREE.shift();
    }
    if (bonusToken) {
      player.tokens.push(bonusToken);
    }
  }

  gameLoop() {
    let cards = this.activePlayer.cards;

    this.sortCardsByType();

    for (let i=cards.length-1; i>=0; i--){
      if (cards[i].type == CommodityType.CAMEL) {
        let camelCard = cards.splice(i,1)[0];
        this.activePlayer.camels.push(camelCard);
      }
    }
  }

  sortCardsByType(cards = this.activePlayer.cards) {
    cards.sort((a, b) => {
      var x = a.type.toLowerCase();
      var y = b.type.toLowerCase();
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    });
  }

  buildDeck() {
    let deck = new Deck;
    for (const type in CommodityType) {
      if (CommodityType.hasOwnProperty(type)) {
        for (var i = 0; i<CardAmts[type]; i++) {
          let card = new Card(CommodityType[type]);
          deck.addCard(card);
        }
      }
    }
    deck.shuffle();
    return deck;
  }

  buildTokens() {
    let tokens = {};
    for (const type in TokenValues) {
      tokens[type] = [];
      if (TokenValues.hasOwnProperty(type)) {
        TokenValues[type].forEach(value => {
          tokens[type].push(new Token(type, value));
        });
      }
    }
    return tokens;
  }
}

class Deck {
  /**
   * @param {Array<Card>} cards
   * @param {boolean} shuffle
   */
  constructor(cards = [], shuffle = false) {
    this.cards = cards;
    if (shuffle) {
      this.shuffle();
    }
  }

  /**
   * @param {Card} card
   */
  addCard(card) {
    this.cards.push(card);
  }

  shuffle() {
    this.cards.sort((a,b) => {
      if (Math.round(Math.random()) == 1) {
        return 1;
      }
      return -1;
    });
  }

  deal(faceUp = false) {
    let card = this.cards.pop();
    card.faceUp = faceUp;
    return card;
  }
}

class Card {
  constructor(type) {
    this.type = type;
    this.selected = false;
    this.faceUp = false;
  }
  toggleSelect() {
    this.selected = !this.selected;
  }
}

class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

class Player {
  constructor(name = "Player") {
    this.name = name;
    this.tokens = [];
    this.cards = [];
    this.camels = [];
    this.cardLimit = 7;
  }

  addCard(card) {
    if (this.cards.length >= this.cardLimit) {
      return false;
    }
    this.cards.push(card);
  }
}

export default GameBoard;