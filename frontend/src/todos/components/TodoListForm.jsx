import React, { useEffect, useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

import { TextField, Card, CardContent, CardActions, Button, Typography, Checkbox } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import DueStatusChip from './DueStatusChip'

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
          {todos.map(({ text, isCompleted, dueDate }, index) => {
            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', marginTop: '8px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Checkbox
                    checked={isCompleted}
                    onChange={(event) => {
                      setTodos([
                        ...todos.slice(0, index),
                        { 
                          text: text, 
                          isCompleted: event.target.checked, 
                          dueDate: todos[index].dueDate || '' 
                        },
                        ...todos.slice(index + 1),
                      ])
                      setUpdatedTodosAction(todoActions.UPDATE_COMPLETED)
                    }}
                  />
                  <Typography sx={{ margin: '8px' }} variant='h6'>
                    {index + 1}
                  </Typography>
                  {/* Text field input */}
                  <TextField
                    sx={{ flexGrow: 1, marginTop: '1rem' }}
                    label='What to do?'
                    size="medium"
                    value={text}
                    disabled={isCompleted}
                    onChange={(event) => {
                      setTodos([
                        // immutable update
                        ...todos.slice(0, index),
                        { 
                          ...todos[index],
                          text: event.target.value, 
                        },
                        ...todos.slice(index + 1),
                      ])
                      setUpdatedTodosAction(todoActions.UPDATE_TEXT)
                    }}
                  />
                  {/* Due date picker */}
                  <DatePicker
                    label='Due Date'
                    disabled={isCompleted}
                    value={dueDate ? dayjs(dueDate) : null}
                    onChange={(newValue) => {
                      const formattedDate = newValue ? newValue.format('YYYY-MM-DD') : ''
                      setTodos([
                        ...todos.slice(0, index),
                        { 
                          ...todos[index],
                          dueDate: formattedDate
                        },
                        ...todos.slice(index + 1),
                      ])
                      setUpdatedTodosAction(todoActions.UPDATE_TEXT)
                    }}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        sx={{ marginTop: '1rem' }}
                        size="medium"
                      />
                    )}
                  />
                  {/* Delete todo button */}
                  <Button
                    sx={{ margin: '8px' }}
                    disabled={isCompleted}
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
                {/* Due date status chip */}
                <div style={{ marginTop: '8px', marginLeft: '88px' }}>
                  <DueStatusChip dueDate={dueDate} isCompleted={isCompleted} />
                </div>
              </div>
            )
          })}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                setTodos([...todos, { text: '', isCompleted: false, dueDate: '' }])
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
