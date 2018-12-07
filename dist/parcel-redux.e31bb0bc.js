// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"GameBoard.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Commodity = new Map([["camel", 5], ["leather", 8], ["cloth", 8], ["spice", 8], ["silver", 6], ["gold", 5], ["ruby", 4]]);
var CommodityType = {
  CAMEL: "camel",
  LEATHER: "leather",
  CLOTH: "cloth",
  SPICE: "spice",
  SILVER: "silver",
  GOLD: "gold",
  RUBY: "ruby"
};
var CardAmts = {
  CAMEL: 12,
  LEATHER: 8,
  CLOTH: 8,
  SPICE: 8,
  SILVER: 6,
  GOLD: 5,
  RUBY: 4
};
var TokenValues = {
  CAMEL: [5],
  LEATHER: [5, 4, 3, 2, 1],
  CLOTH: [5, 4, 3, 2, 1],
  SPICE: [5, 4, 3, 2, 1],
  SILVER: [5, 4, 3, 2, 1],
  GOLD: [5, 4, 3, 2, 1],
  RUBY: [5, 4, 3, 2, 1],
  THREE: [3, 4, 2, 3, 4],
  FOUR: [5, 6, 5, 4, 6, 7],
  FIVE: [7, 8, 9, 10, 9, 8]
};

var GameBoard =
/*#__PURE__*/
function () {
  function GameBoard() {
    _classCallCheck(this, GameBoard);

    this.tokens = this.buildTokens();
    this.deck = this.buildDeck();
    this.discardPile = [];
    this.cardsInPlay = [new Card(CommodityType.CAMEL), new Card(CommodityType.CAMEL), new Card(CommodityType.CAMEL)];
    this.players = [new Player("Me"), new Player("Opponent")];

    for (var i = 0; i < 5; i++) {
      this.players[0].addCard(this.deck.deal());
      this.players[1].addCard(this.deck.deal());
    }

    this.cardsInPlay.push(this.deck.deal(true), this.deck.deal(true));
    this.activePlayer = this.players[0];
    this.gameLoop();
  }

  _createClass(GameBoard, [{
    key: "sell",
    value: function sell() {
      var discarded = 0;
      var player = this.activePlayer;

      for (var i = player.cards.length - 1; i >= 0; i--) {
        var card = player.cards[i];

        if (card.selected) {
          //count
          discarded++; //discard

          this.discardPile.push(player.cards.splice(i, 1)); //collect

          var token = this.tokens[card.type.toUpperCase()].shift();

          if (token) {
            player.tokens.push(token);
          }
        }
      } //bonus


      var bonusToken;

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
  }, {
    key: "gameLoop",
    value: function gameLoop() {
      var cards = this.activePlayer.cards;
      this.sortCardsByType();

      for (var i = cards.length - 1; i >= 0; i--) {
        if (cards[i].type == CommodityType.CAMEL) {
          var camelCard = cards.splice(i, 1)[0];
          this.activePlayer.camels.push(camelCard);
        }
      }
    }
  }, {
    key: "sortCardsByType",
    value: function sortCardsByType() {
      var cards = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.activePlayer.cards;
      cards.sort(function (a, b) {
        var x = a.type.toLowerCase();
        var y = b.type.toLowerCase();

        if (x < y) {
          return -1;
        }

        if (x > y) {
          return 1;
        }

        return 0;
      });
    }
  }, {
    key: "buildDeck",
    value: function buildDeck() {
      var deck = new Deck();

      for (var type in CommodityType) {
        if (CommodityType.hasOwnProperty(type)) {
          for (var i = 0; i < CardAmts[type]; i++) {
            var card = new Card(CommodityType[type]);
            deck.addCard(card);
          }
        }
      }

      deck.shuffle();
      return deck;
    }
  }, {
    key: "buildTokens",
    value: function buildTokens() {
      var tokens = {};

      var _loop = function _loop(type) {
        tokens[type] = [];

        if (TokenValues.hasOwnProperty(type)) {
          TokenValues[type].forEach(function (value) {
            tokens[type].push(new Token(type, value));
          });
        }
      };

      for (var type in TokenValues) {
        _loop(type);
      }

      return tokens;
    }
  }]);

  return GameBoard;
}();

var Deck =
/*#__PURE__*/
function () {
  /**
   * @param {Array<Card>} cards
   * @param {boolean} shuffle
   */
  function Deck() {
    var cards = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var shuffle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, Deck);

    this.cards = cards;

    if (shuffle) {
      this.shuffle();
    }
  }
  /**
   * @param {Card} card
   */


  _createClass(Deck, [{
    key: "addCard",
    value: function addCard(card) {
      this.cards.push(card);
    }
  }, {
    key: "shuffle",
    value: function shuffle() {
      this.cards.sort(function (a, b) {
        if (Math.round(Math.random()) == 1) {
          return 1;
        }

        return -1;
      });
    }
  }, {
    key: "deal",
    value: function deal() {
      var faceUp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var card = this.cards.pop();
      card.faceUp = faceUp;
      return card;
    }
  }]);

  return Deck;
}();

var Card =
/*#__PURE__*/
function () {
  function Card(type) {
    _classCallCheck(this, Card);

    this.type = type;
    this.selected = false;
    this.faceUp = false;
  }

  _createClass(Card, [{
    key: "toggleSelect",
    value: function toggleSelect() {
      this.selected = !this.selected;
    }
  }]);

  return Card;
}();

var Token = function Token(type, value) {
  _classCallCheck(this, Token);

  this.type = type;
  this.value = value;
};

var Player =
/*#__PURE__*/
function () {
  function Player() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Player";

    _classCallCheck(this, Player);

    this.name = name;
    this.tokens = [];
    this.cards = [];
    this.camels = [];
    this.cardLimit = 7;
  }

  _createClass(Player, [{
    key: "addCard",
    value: function addCard(card) {
      if (this.cards.length >= this.cardLimit) {
        return false;
      }

      this.cards.push(card);
    }
  }]);

  return Player;
}();

var _default = GameBoard;
exports.default = _default;
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _GameBoard = _interopRequireDefault(require("./GameBoard"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gameBoard = window.gameBoard = new _GameBoard.default();
console.log(gameBoard);
var marketplace = document.getElementById('marketplace');
var marketplaceCards = marketplace.getElementsByClassName('card');
marketplace.addEventListener('click', function (e) {
  e.target.card.toggleSelect();
  render();
});
var myHand = document.getElementById('my-cards');
myHand.addEventListener('click', function (e) {
  e.target.card.toggleSelect();
  render();
});
var myTokens = document.getElementById('my-tokens');
var myCamels = document.getElementById('my-camels');
var sellBtn = document.getElementById('sell-button');
sellBtn.addEventListener('click', function (e) {
  gameBoard.sell();
  render();
});

var render = function render() {
  gameBoard.cardsInPlay.forEach(function (card, i) {
    marketplaceCards[i].innerHTML = card.type;
    marketplaceCards[i].dataset.selected = card.selected;
    marketplaceCards[i].card = card;
  });
  myHand.innerHTML = "";
  gameBoard.players[0].cards.forEach(function (card) {
    var cardEl = document.createElement('div');
    cardEl.className = "card";
    cardEl.innerHTML = card.type;
    cardEl.dataset.selected = card.selected;
    cardEl.card = card;
    myHand.append(cardEl);
  });
  myTokens.innerHTML = "";
  gameBoard.players[0].tokens.forEach(function (token) {
    var tokenEl = document.createElement('div');
    tokenEl.className = "token";
    tokenEl.innerHTML = token.type + " " + token.value;
    myTokens.append(tokenEl);
  });
  myCamels.innerHTML = "Camels " + gameBoard.players[0].camels.length;
};

render();
},{"./GameBoard":"GameBoard.js"}],"../../.nvm/versions/node/v8.9.4/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63645" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../.nvm/versions/node/v8.9.4/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/parcel-redux.e31bb0bc.map