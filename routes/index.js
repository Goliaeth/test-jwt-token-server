const Router = require("express").Router
const urlencodedParser = require("express").urlencoded({ extended: false })
const userController = require("../controllers/user-controller")

const router = new Router()

router.post("/registration", urlencodedParser, userController.registration)
router.post("/login", urlencodedParser, userController.login)
router.post("/logout", userController.logout)
router.get("/refresh", userController.refresh)
router.get("/users", userController.getUsers)

module.exports = router
