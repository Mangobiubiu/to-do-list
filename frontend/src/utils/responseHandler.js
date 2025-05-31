const responseHandler = (requestMethod) => async (...args) => {
  try {
    const res = await requestMethod(...args)
    return {
      data: res.data.data,
      success: res.data.success,
      message: res.data.message
    }
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Request failed'
    throw new Error(message)
  }
}

export default responseHandler
