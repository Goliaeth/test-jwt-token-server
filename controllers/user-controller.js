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
      // console.log("login")
      // console.log("headers")
      // console.log(req.headers)
      // console.log("body")
      // console.log(req.body)
      // console.log("cookies")
      // console.log(req.cookies)
      const userData = await userService.login(telephone, code)
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      return res.json({
        access_token: userData.accessToken,
        refresh_token: userData.refreshToken,
        user: userData.user,
      })
    } catch (e) {
      next(e)
    }
  }

  async logout(req, res, next) {
    try {
      const { refresh_token } = req.cookies
      // console.log("logout")
      // console.log("headers")
      // console.log(req.headers)
      // console.log("body")
      // console.log(req.body)
      // console.log("cookies")
      // console.log(req.cookies)
      const token = await userService.logout(refresh_token)
      res.clearCookie("refreshToken")
      return res.json(token) // return 200 status
    } catch (e) {
      next(e)
    }
  }

  async refresh(req, res, next) {
    try {
      const { refresh_token } = req.body
      // console.log("refresh")
      // console.log("headers")
      // console.log(req.headers)
      // console.log("body")
      // console.log(req.body)
      // console.log("cookies")
      // console.log(req.cookies)
      const userData = await userService.refresh(refresh_token)
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      return res.json({
        user: userData.user,
        access_token: userData.accessToken,
        refresh_token: userData.refreshToken,
      })
    } catch (e) {
      next(e)
    }
  }

  async getUsers(req, res, next) {
    try {
      // const { refreshToken } = req.cookies
      // console.log(req.cookies)
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
