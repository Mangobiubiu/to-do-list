import axios from 'axios'
import responseHandler from '../utils/responseHandler'

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 5000,
  headers: {
    'Accept': 'application/json'
  }
})

const getAllTodoLists = responseHandler(() => api.get('/todo-lists'))

const saveTodoLists = responseHandler((todoLists) => 
  api.post('/todo-lists', todoLists)
)

export { getAllTodoLists, saveTodoLists }
