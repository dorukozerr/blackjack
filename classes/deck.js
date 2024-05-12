import { Card } from './card.js'

class Deck {
  constructor(numDecks) {
    this.cards = []
    this.numDecks = numDecks
    this.initializeDeck()
  }

  initializeDeck() {
    fetch('http://localhost:4141/generate-deck')
      .then(response => response.json())
      .then(data => {
        this.cards = data
      })
      .catch(error => {
        console.error('Error: =>', error)
      })
  }

  dealCard() {
    return this.cards.pop()
  }
}

export { Deck }
