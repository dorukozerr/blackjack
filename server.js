import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { Card } from './classes/card.js'

const app = express()
const PORT = process.env.PORT || 4141

app.use(cors())
app.use(bodyParser.json())

app.get('/generate-deck', (req, res) => {
  let cards = []
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
  const values = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'A'
  ]

  for (let i = 0; i < 6; i++) {
    for (let suit of suits) {
      for (let value of values) {
        cards.push(new Card(suit, value))
      }
    }
  }

  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }

  res.json(cards)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
