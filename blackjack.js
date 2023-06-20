class Card {
    constructor(suit, rank, value) {
        this.suit = suit;
        this.rank = rank;
        this.value = value;
    }
}

class Deck52Blackjack {
    constructor() {
        this.deck = [];
        this.createDeck();
    }
    createDeck() {
        const suits = ["Spades", "Hearts", "Clubs", "Diamonds"];
        const ranks = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];
        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < ranks.length; j++) {
                let blackJackValue = j + 1;
                switch (blackJackValue) {
                    case 1: blackJackValue = 11;
                        break;
                    case 11:
                    case 12:
                    case 13: blackJackValue = 10;
                        break;
                    default:
                        break;
                }
                const newCard = new Card(suits[i], ranks[j], blackJackValue);
                this.deck.push(newCard);
            }
        }
    }
}

class Player {
    constructor(playerName = "Guest") {
        this.playerName = playerName;
        this.playerHand = [];
        this.playerHandValue = 0;
        this.playerBankroll = 100;
        this.playerBet = 0;
        this.playerNumOfWins = 0;
    }
}

class Blackjack {
    constructor(decksUsed = 6) {
        this.decksUsed = decksUsed;
        this.deck = [];
        this.createDeck();
        this.shuffleDeck();
        this.players = [];
        this.addPlayers();
        this.playBlackjackConsole();
        this.testMe = "testMe";
        this.gamesPlayed = 0;
        this.openingCardsDealt = 2;
    }

    createDeck() {
        this.deck = [];
        for (let i = 0; i < this.decksUsed; i++) {
            const newDeck = new Deck52Blackjack();
            this.deck = [...this.deck, ...newDeck.deck]
        }
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i >= 0; i--) {
            const randomReducedIndex = Math.floor(Math.random() * (i + 1));
            const temp = this.deck[randomReducedIndex];
            this.deck[randomReducedIndex] = this.deck[i];
            this.deck[i] = temp;
            // [this.deck[i], this.deck[randomReducedIndex]] = [this.deck[randomReducedIndex], this.deck[i]];
        }
    }

    addPlayers(playerCount = 2) {
        // Additional handling for invalid inputs e.g. decimals, strings
        if (playerCount < 2) {
            console.log("Must have 2 or more players");
        } else {
            for (let i = 0; i < playerCount; i++) {
                const newPlayer = new Player(`Guest ${i + 1}`);
                this.players.push(newPlayer);
            }
        }
    }

    /*
    playBlackjackConsole calls a series of anonymous functions for readability, especially to avoid huge chains of nested control statements.
    
    Functions are anonymous for this. references to work.

    Though perhaps not strictly necessary in this case, functions are in reverse order of triggering, so functions are defined by the time they are called.

    There is no "initializeGame" function; initial values are set in constructor.
    Should be "initializeRound" and "reinitialize game" though.

    Later can implement dealer rules (dealer wins ties, face up / face down rules, hit / stay automation, dealer goes last)
    
    1) Play
    2) Change number of decks used; default: 6, current: 
    3) Change number of players; default: 2, current:
    4) Change player names
    5) Reset all data
    */

    playBlackjackConsole() {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        // nonsequential functions
        const dealCard = (playerIndex) => {
            this.players[playerIndex].playerHand.push(this.deck.pop());
        }

        const adjustHandValue = (playerIndex, totalValue, aceCount) => {
            // console.log("Adjustment running", playerIndex, totalValue, aceCount);
            if (totalValue > 21 && aceCount > 0) {
                return adjustHandValue(playerIndex, totalValue - 10, aceCount - 1);
            }
            this.players[playerIndex].playerHandValue = totalValue;
           // console.log("Adjustment ending", totalValue, aceCount);
            return [totalValue, aceCount];
        }

        // This may be a little odd (don't know coding convention); totalValue and aceCount are local variables.
        // But totalValue is stored in Player in adjustHandValue and aceCount is not referenced elsewhere.
        const showHand = (playerIndex) => {
            let returnString = "";
            let totalValue = 0;
            let aceCount = 0;
            const thisPlayerHand = this.players[playerIndex].playerHand
            for (let i = 0; i < thisPlayerHand.length; i++) {
                returnString += `${thisPlayerHand[i].rank} of ${thisPlayerHand[i].suit}, `
                totalValue += thisPlayerHand[i].value;
                if (thisPlayerHand[i].rank === "Ace") {
                    aceCount += 1;
                }
            }
            // console.log("Ace count:", aceCount);
            [totalValue, aceCount] = adjustHandValue(playerIndex, totalValue, aceCount);
            returnString += `hand value: ${totalValue}`;
            console.log(`Player: ${this.players[playerIndex].playerName}:`);
            console.log(returnString);
        }

        const playerPrompt = (playerIndex) => {
            //console.log("this", this);
            //console.log("this...playerHandValue", this.players[playerIndex].playerHandValue);
            //console.log("typeof", typeof(this.players[playerIndex].playerHandValue));
            return new Promise((resolve) => {
                if (this.players[playerIndex].playerHandValue <= 21) {
                    readline.question("Enter Selection: ", (userInput) => {
                        switch (userInput) {
                            case "0":
                                readline.close();
                                // resolve();
                                break;
                            case "1":
                                console.log("<<PLAYER HITS>>");
                                dealCard(playerIndex);
                                showHand(playerIndex);
                                return playerPrompt(playerIndex).then(resolve);
                                break;
                            case "2":
                                console.log("<<PLAYER STANDS>>");
                                resolve();
                                break;
                            default:
                                console.log("Invalid selection.");
                                return playerPrompt(playerIndex).then(resolve);
                        }
                    })
                } else if (this.players[playerIndex].playerHandValue > 21) {
                    console.log(`Player ${this.players[playerIndex].playerName} has busted!`);
                    console.log("");
                    resolve();
                }
                //return new Promise((resolve) => { });
                //use .then(resolve) as in playerPrompt(playerIndex).then(resolve);
            });
        }

        // end nonsequential functions

        // sequential functions
        const roundEnd = () => {
            console.log ("");
            console.log ("<<ROUND END>>")
            let winningArray = [];
            let max = 0;
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].playerHandValue <= 21) {
                    if (this.players[i].playerHandValue === max) {
                        winningArray.push(i);
                    } else if (this.players[i].playerHandValue > max) {
                        winningArray = [];
                        winningArray.push(i);
                        max = this.players[i].playerHandValue;
                    }
                }
            }
            console.log("winningArray: ", winningArray, "max: ", max)
            if (winningArray.length === 0) {
                console.log ("All players busted!")
            } else {
                for (let i = 0; i < winningArray.length; i++) {
                    console.log(`Winning player: ${this.players[i].playerName}`)
                }
            }
            roundMenu();
        }

        const playerTurns = async () => {
            console.log("");
            console.log("<<STARTING PLAY>>")
            console.log("");
            for (let i = 0; i < this.players.length; i++) {
                console.log("");
                console.log(`<<PLAYER ${this.players[i].playerName} TURN>>`)
                showHand(i);
                console.log("Please enter a number.");
                console.log("1) Hit");
                console.log("2) Stand");
                console.log("0) Exit game");
                await playerPrompt(i);
                console.log(`<<PLAYER ${i + 1} TURN COMPLETE>>`);
            }
            roundEnd();
        }

        const startRound = () => {
            for (let i = 0; i < this.openingCardsDealt; i++) {
                for (let j = 0; j < this.players.length; j++) {
                    dealCard(j)
                }
            }
            console.log("");
            console.log("<<OPENING HANDS>>")
            for (let i = 0; i < this.players.length; i++) {
                showHand(i)
            }
            playerTurns();
        }

        const menuPrompt = () => {
            readline.question("Enter Selection: ", (userInput) => {
                switch (userInput) {
                    case "0":
                        readline.close();
                        break;
                    case "1":
                        startRound();
                        break;
                    case "2":
                        break;
                    case "3":
                        break;
                    case "4":
                        break;
                    case "5":
                        break;
                    default:
                        console.log("Invalid selection.")
                        menuPrompt();
                }
            })
        }

        const roundMenu = () => {
            console.log("Welcome to Blackjack.  Please enter a number.");
            console.log("1) Play");
            console.log(`2) Change number of decks used; default: 6; current: ${this.decksUsed}`);
            console.log(`3) Change number of players; default: 2; current: ${this.players.length}`);
            console.log("4) Change player names");
            console.log("5) Reset all data");
            console.log("0) Exit game");
            console.log("");
            menuPrompt();
        }

        roundMenu();

        // namePlayers(playerIndex, playerNameInput) {
        //     console.log(``)
        //     //this.players[playerIndex].playerName = playerNameInput;
        // }

    }
}
// class Blackjack

const game = new Blackjack(6);
