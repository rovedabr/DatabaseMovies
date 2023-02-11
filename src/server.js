require("express-async-errors")

const database = require("./database/sqlite")
const { request, response } = require("express")
const express = require("express")
const routes = require("./routes")
const AppError = require("./utils/AppError")

const app = express()
app.use(express.json())
app.use(routes)
database()

app.use( (error, request, response, next) => {
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    })
  }

  console.error(error)

  return response.status(500).json({
    sratus: "error",
    message: "Internal server error"
  })
})

const PORT = 5555;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))