class Player {
  constructor(name) {
    this.name = name
    this.hand = []
  }

  addCardToHand(card) {
    this.hand.push(card)
  }

  getHandValue() {
    let sum = 0
    let numOfAces = 0

    for (let card of this.hand) {
      if (card.value === 'A') {
        numOfAces++
        sum += 11
      } else if (
        card.value === 'J' ||
        card.value === 'Q' ||
        card.value === 'K'
      ) {
        sum += 10
      } else {
        sum += parseInt(card.value)
      }
    }

    while (sum > 21 && numOfAces > 0) {
      sum -= 10
      numOfAces--
    }

    return sum
  }
}

export { Player }
