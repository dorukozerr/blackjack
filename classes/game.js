import { Deck } from './deck.js'
import { Player } from './player.js'
import { addNewGame, updateGame } from '../utils/dbHandler.js'
import { prompt } from '../utils/prompt.js'
import { generateUniqueId } from '../utils/genId.js'

class BlackjackGame {
  constructor() {
    this.deck = new Deck()
    this.players = []
    this.delay = 0
  }

  async startGame() {
    const playerName = await prompt('Please enter your name:')
    this.players.push(new Player(playerName))
    this.delay = parseInt(
      await prompt(
        'Please enter desired delay between rounds (in milliseconds):'
      )
    )

    this.deck.shuffle()
    this.playRound()
  }

  async playRound() {
    const gameId = generateUniqueId()
    const player = this.players[0]
    const dealer = new Player('Dealer')

    player.hand = []
    dealer.hand = []

    dealer.addCardToHand(this.deck.dealCard())
    player.addCardToHand(this.deck.dealCard())
    dealer.addCardToHand(this.deck.dealCard())
    player.addCardToHand(this.deck.dealCard())

    this.displayHand(player, false)
    this.displayHand(dealer, true)

    try {
      const game = {
        id: gameId,
        deck: this.deck.cards,
        player: player.name,
        dealer: dealer.name,
        playerHand: player.hand,
        dealerHand: dealer.hand
      }

      await addNewGame(game, err => {
        if (err) {
          console.log('Error adding game to database:', err)
        }
      })
    } catch (error) {
      console.log('Error adding game to database:', error)
    }

    while (player.getHandValue() < 21) {
      const decision = await prompt('Do you want to hit? (y/n)')

      if (decision === 'y') {
        player.addCardToHand(this.deck.dealCard())
        this.displayHand(player, false)
      } else {
        this.displayHand(dealer, true, true)
        break
      }
    }

    const playerScore = player.getHandValue()

    if (playerScore > 21) {
      console.log('Busted! You lose.')
    } else {
      while (dealer.getHandValue() < 17) {
        dealer.addCardToHand(this.deck.dealCard())
        this.displayHand(dealer, true, true)
      }

      const dealerScore = dealer.getHandValue()

      const game = {
        id: gameId,
        deck: this.deck.cards,
        player: player.name,
        dealer: dealer.name,
        playerHand: player.hand,
        dealerHand: dealer.hand
      }

      if (dealerScore > 21 || playerScore > dealerScore) {
        console.log('Congratulations! You win.')

        await updateGame(gameId, { ...game, winner: player.name }, err => {
          if (err) {
            console.log('Error updating game in database:', err)
          }
        })
      } else if (playerScore < dealerScore) {
        console.log('Sorry, you lose.')

        await updateGame(gameId, { ...game, winner: dealer.name }, err => {
          if (err) {
            console.log('Error updating game in database:', err)
          }
        })
      } else {
        console.log("It's a draw.")

        await updateGame(gameId, { ...game, winner: 'Draw' }, err => {
          if (err) {
            console.log('Error updating game in database:', err)
          }
        })
      }
    }

    setTimeout(async () => {
      const playAgain = await prompt('Do you want to play again? (y/n)')
      if (playAgain === 'y') {
        this.playRound()
      } else {
        console.log('Thanks for playing!')
        process.exit()
      }
    }, this.delay)
  }

  displayHand(player, isDealer, showAll = false) {
    let handString = isDealer ? "Dealer's hand: " : 'Your hand: '

    for (let i = 0; i < player.hand.length; i++) {
      if (isDealer && i === 0 && !showAll) {
        handString += 'unknown, '
      } else {
        handString += `${player.hand[i].value} of ${player.hand[i].suit}, `
      }
    }
    handString = handString.slice(0, -2)
    console.log(handString)
  }
}

export { BlackjackGame }
