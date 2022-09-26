const Router = require("express").Router
const urlencodedParser = require("express").urlencoded({ extended: false })
const userController = require("../controllers/user-controller")
const { check } = require("express-validator")
const authMiddleware = require("../middlewares/auth-middleware")

const router = new Router()

router.post("/registration", urlencodedParser, userController.registration)
router.post("/login", urlencodedParser, userController.login)
router.post("/logout", userController.logout)
router.post("/code", urlencodedParser, userController.getCode)
router.get("/refresh", userController.refresh)
router.get("/users", authMiddleware, userController.getUsers)

module.exports = router
