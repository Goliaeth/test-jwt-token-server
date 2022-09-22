const Router = require("express").Router
const urlencodedParser = require("express").urlencoded({ extended: false })
const userController = require("../controllers/user-controller")
const { check } = require("express-validator")

const router = new Router()

router.post(
  "/registration",
  urlencodedParser,
  [
    check("email", "Email is not valid").isEmail().normalizeEmail(),
    check(
      "password",
      "Password must be more then 2 and less then 32 chars"
    ).isLength({ min: 3, max: 32 }),
  ],
  userController.registration
)
router.post("/login", urlencodedParser, userController.login)
router.post("/logout", userController.logout)
router.get("/refresh", userController.refresh)
router.get("/users", userController.getUsers)

module.exports = router
