const userService = require("../services/user-service")
const { validationResult } = require("express-validator")
const ApiError = require("../exceptions/api-error")

class UserController {
  async registration(req, res, next) {
    try {
      const { telephone } = req.body
      const userData = await userService.registration(telephone)
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async login(req, res, next) {
    try {
      const { telephone, code } = req.body
      const userData = await userService.login(telephone, code)
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      return res.json({
        accessToken: userData.accessToken,
        user: userData.user,
      })
    } catch (e) {
      next(e)
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const token = await userService.logout(refreshToken)
      res.clearCookie("refreshToken")
      return res.json(token) // return 200 status
    } catch (e) {
      next(e)
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await userService.refresh(refreshToken)
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers()
      return res.json(users)
    } catch (e) {
      next(e)
    }
  }

  async getCode(req, res, next) {
    try {
      const { telephone } = req.body
      const codeData = await userService.getCode(telephone)
      return res.json(codeData)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UserController()
