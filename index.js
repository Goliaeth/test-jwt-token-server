const conf = require("./conf")
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const router = require("./routes/index")
const errorMiddleware = require("./middlewares/error-middleware")

const PORT = conf.PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use("/api", router)
app.use(errorMiddleware)

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start()
