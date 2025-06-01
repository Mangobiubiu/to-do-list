import React, { useEffect, useState } from 'react'
import { TextField, Card, CardContent, CardActions, Button, Typography, Checkbox } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import todoActions from '../../constants/TodoActions'

const TodoListForm = ({ todoList, saveTodoLists }) => {
  const [todos, setTodos] = useState(todoList.todos)
  const [updatedTodosAction, setUpdatedTodosAction] = useState('')

  useEffect(() => {
    if (updatedTodosAction === todoActions.CREATE 
      || updatedTodosAction === todoActions.UPDATE_COMPLETED 
      || updatedTodosAction === todoActions.DELETE
    ) {
      saveTodoLists(todoList.id, { todos })
    }
    else {
      const timeoutId = setTimeout(() => {
        saveTodoLists(todoList.id, { todos })
      }, 800)
      return () => clearTimeout(timeoutId)
    }
  }, [saveTodoLists, todoList.id, todos, updatedTodosAction])

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <form
          style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        >
          {todos.map(({ text, completed }, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={completed}
                onChange={(event) => {
                  setTodos([
                    ...todos.slice(0, index),
                    { text: text, completed: event.target.checked },
                    ...todos.slice(index + 1),
                  ])
                  setUpdatedTodosAction(todoActions.UPDATE_COMPLETED)
                }}
              />
              <Typography sx={{ margin: '8px' }} variant='h6'>
                {index + 1}
              </Typography>
              <TextField
                sx={{ flexGrow: 1, marginTop: '1rem' }}
                label='What to do?'
                value={text}
                onChange={(event) => {
                  setTodos([
                    // immutable update
                    ...todos.slice(0, index),
                    { text: event.target.value, completed: todos[index].completed },
                    ...todos.slice(index + 1),
                  ])
                  setUpdatedTodosAction(todoActions.UPDATE_TEXT)
                }}
              />
              <Button
                sx={{ margin: '8px' }}
                size='small'
                color='secondary'
                onClick={() => {
                  setTodos([
                    // immutable delete
                    ...todos.slice(0, index),
                    ...todos.slice(index + 1),
                  ])
                  setUpdatedTodosAction(todoActions.DELETE)
                }}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                setTodos([...todos, { text: '', completed: false }])
                setUpdatedTodosAction(todoActions.CREATE)
              }}
            >
              Add Todo <AddIcon />
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}

export default TodoListForm
