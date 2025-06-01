import React, { Fragment, useState, useEffect, useCallback } from 'react'
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

  const handleSaveTodoList = useCallback(async (id, { todos }) => {
    try {
      let currentTodoLists

      setTodoLists((current) => {
        currentTodoLists = current
        return current
      })

      if (!currentTodoLists || !currentTodoLists[id]) return;
      const updatedTodoLists = {
        ...currentTodoLists,
        [id]: { ...currentTodoLists[id], todos }
      }
      await saveTodoLists(updatedTodoLists)
      
      setTodoLists(updatedTodoLists)
    } catch (error) {
      alert(`Auto-save failed: ${error.message}. Please refresh to sync data.`)
    }
  }, [])

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
          saveTodoLists={handleSaveTodoList}
        />
      )}
    </Fragment>
  )
}
