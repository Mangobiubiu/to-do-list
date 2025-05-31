import React, { Fragment, useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import TodoListForm from './TodoListForm'
import { getAllTodoLists, saveTodoLists } from '../../services/todoListsApi'

const fetchTodoLists = () => {
  return getAllTodoLists()
}

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState({})
  const [activeList, setActiveList] = useState()

  useEffect(() => {
    fetchTodoLists().then((result) => {
      setTodoLists(result.data)
    })
  }, [])

  const handleSaveTodoList = async (id, { todos }) => {
    try {
      const listToUpdate = todoLists[id]
      const updatedTodoLists = {
        ...todoLists,
        [id]: { ...listToUpdate, todos },
      }
  
      await saveTodoLists(updatedTodoLists)
      
      setTodoLists(updatedTodoLists)
    } catch (error) {
      alert(error.message)
    }
  }

  if (!Object.keys(todoLists).length) return null

  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>
          <List>
            {Object.keys(todoLists).map((key) => (
              <ListItemButton key={key} onClick={() => setActiveList(key)}>
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary={todoLists[key].title} />
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Card>
      {todoLists[activeList] && (
        <TodoListForm
          key={activeList}
          todoList={todoLists[activeList]}
          saveTodoList={handleSaveTodoList}
        />
      )}
    </Fragment>
  )
}
