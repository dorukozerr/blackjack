import { randomBytes } from 'crypto'

const generateUniqueId = () => {
  return randomBytes(16).toString('hex')
}

export { generateUniqueId }
