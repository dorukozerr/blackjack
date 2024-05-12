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

const writeDatabase = async (data, callback) => {
  await writeFile('db.json', JSON.stringify(data), 'utf8', callback)
}

const addNewGame = async (game, callback) => {
  readDatabase(async games => {
    games.push(game)
    await writeDatabase(games, callback)
  })
}

const updateGame = async (id, game, callback) => {
  readDatabase(async games => {
    const gameIndex = games.findIndex(game => game.id === id)

    if (gameIndex === -1) {
      return callback(new Error('Game not found'))
    }

    games[gameIndex] = game

    await writeDatabase(games, callback)
  })
}

export { addNewGame, readDatabase, updateGame }
