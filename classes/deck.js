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

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]
    }
  }

  dealCard() {
    return this.cards.pop()
  }
}

export { Deck }
