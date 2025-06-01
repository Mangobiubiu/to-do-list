import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'

import { Chip } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import WarningIcon from '@mui/icons-material/Warning'

const getDueDateStatus = (dueDate, isCompleted, currentDate) => {
  if (!dueDate || isCompleted || !dayjs(dueDate).isValid()) return {
    status: null,
    description: null,
  }

  const today = dayjs(currentDate)
  const dueDay = dayjs(dueDate)
  const diffDays = dueDay.diff(today, 'day')

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays)
    return {
      status: 'overdue',
      description: `Overdue ${overdueDays} day${overdueDays === 1 ? '' : 's'}`,
    }
  } 
  else if (diffDays === 0) {
    return {
      status: 'today',
      description: 'Due today',
    }
  } 
  else {
    return {
      status: 'future',
      description: `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`,
    }
  }
}

const DueStatusChip = ({ dueDate, isCompleted }) => {
  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'))

  useEffect(() => {
    // Check if the date has changed every minute
    const interval = setInterval(() => {
      const newDate = dayjs().format('YYYY-MM-DD')
      if (newDate !== currentDate) {
        setCurrentDate(newDate) // Trigger a re-render of the statue chip
      }
    }, 60 * 1000) // Check every minute

    return () => clearInterval(interval)
  }, [currentDate])

  const {status, description} = getDueDateStatus(dueDate, isCompleted, currentDate)

  if (!status) return null

  let color = null
  let icon = null

  if (status === 'overdue') {
    color = 'error'
    icon = <WarningIcon fontSize="small" />
  }
  else if (status === 'today') {
    color = 'warning'
    icon = <EventIcon fontSize="small" />
  }
  else if (status === 'future') {
    color = 'primary'
    icon = <EventIcon fontSize="small" />
  }

  return (
    <Chip
      icon={icon}
      label={description || ''}
      color={color}
      size="small"
      variant="outlined"
      sx={{
        fontSize: '12px',
        padding: '0 8px',
      }}
    />
  )
}

export default DueStatusChip 