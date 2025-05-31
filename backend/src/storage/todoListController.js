import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TODO_LISTS_FILE = path.join(__dirname, 'todoLists.json')

export const getAllTodoLists = () => {
  try {
    const data = fs.readFileSync(TODO_LISTS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    throw new Error('Failed to read todoLists:', error)
  }
}

export const saveTodoLists = (todoLists) => {
  try {
    fs.writeFileSync(TODO_LISTS_FILE, JSON.stringify(todoLists, null, 2))
  } catch (error) {
    throw new Error('Failed to save todoLists:', error)
  }
}