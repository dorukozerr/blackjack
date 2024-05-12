import { writeFile, readFile } from 'fs'

const readDatabase = async callback => {
  await readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      callback([])
    } else {
      const jsonData = JSON.parse(data)
      callback(jsonData)
    }
  })
}

const writeDatabase = async data => {
  await writeFile('db.json', JSON.stringify(data), 'utf8', err => {
    if (err) {
      console.log('Error updating game in database:', err)
    }
  })
}

const addNewGame = async game => {
  readDatabase(async games => {
    games.push(game)
    await writeDatabase(games)
  })
}

const updateGame = async (id, game) => {
  readDatabase(async games => {
    const gameIndex = games.findIndex(game => game.id === id)

    if (gameIndex === -1) {
      return new Error('Game not found')
    }

    games[gameIndex] = game

    await writeDatabase(games)
  })
}

export { addNewGame, readDatabase, updateGame }
