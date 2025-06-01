import express from 'express'
import dayjs from 'dayjs'
import cors from 'cors'
import { 
  getAllTodoLists,
  saveTodoLists, 
} from './storage/todoListController.js'

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 3001

// Get all todo lists
app.get('/api/todo-lists', (req, res) => {
  try {
    const todos = getAllTodoLists()
    res.json({ success: true, data: todos })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Save all todo lists
app.post('/api/todo-lists', (req, res) => {
  try {
    // Validation
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Request body must be an object'
      })
    }

    // Validate todoLists structure
    const todoLists = req.body
    for (const [id, todoList] of Object.entries(todoLists)) {
      // Validate each todoList
      if (!todoList || typeof todoList !== 'object') {
        return res.status(400).json({
          success: false,
          error: `TodoList ${id} must be an object`
        })
      }

      // Validate required fields
      if (!todoList.id || typeof todoList.id !== 'string') {
        return res.status(400).json({
          success: false,
          error: `TodoList ${id} must have a valid id (string)`
        })
      }

      if (!todoList.title || typeof todoList.title !== 'string') {
        return res.status(400).json({
          success: false,
          error: `TodoList ${id} must have a valid title (string)`
        })
      }

      if (!Array.isArray(todoList.todos)) {
        return res.status(400).json({
          success: false,
          error: `TodoList ${id} must have todos as an array`
        })
      }

      // Validate todos array
      for (let i = 0; i < todoList.todos.length; i++) {
        const todo = todoList.todos[i]
        
        // Validate text
        if (typeof todo.text !== 'string') {
          return res.status(400).json({
            success: false,
            error: `TodoList ${id}, text of todo at index ${i} must be a string`
          })
        }
        
        // Validate isCompleted
        if (typeof todo.isCompleted !== 'boolean') {
          return res.status(400).json({
            success: false,
            error: `TodoList ${id}, isCompleted of todo at index ${i} must be a boolean`
          })
        }

        // Validate dueDate
        if (typeof todo.dueDate !== 'string') {
            return res.status(400).json({
              success: false,
              error: `TodoList ${id}, dueDate of todo at index ${i} must be a string`
            })
        }
        
        if (todo.dueDate !== '') {
          // Use dayjs to validate the date
          const dueDate = dayjs(todo.dueDate)
          if (!dueDate.isValid()) {
            return res.status(400).json({
              success: false,
              error: `TodoList ${id}, dueDate of todo at index ${i} is not a valid date`
            })
          }
        }
      }
    }

    // Save the validated data
    try {
      saveTodoLists(todoLists)
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      })
    }

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Todo API server running on port ${PORT}`))
