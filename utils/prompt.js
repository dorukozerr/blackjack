import { createInterface } from 'readline'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

const prompt = query => {
  return new Promise(resolve => rl.question(query, resolve))
}

export { prompt }
