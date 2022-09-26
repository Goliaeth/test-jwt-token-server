const conf = require("../conf")
const knex = require("knex")(conf.pg)
const USERS_TABLE = "users"
const bcrypt = require("bcrypt")
const tokenService = require("./token-service")
const UserDto2 = require("../dtos/user-dto-2")
const ApiError = require("../exceptions/api-error")
const UserDto = require("../dtos/user-dto")

class UserService {
  async registration(telephone) {
    const candidate = await knex
      .select("*")
      .from(USERS_TABLE)
      .where("telephone", telephone)

    if (candidate[0]) {
      throw ApiError.BadRequest(
        `Пользователь с таким телефоном ${telephone} уже существует`
      )
    }

    const user = await knex
      .insert({ telephone: telephone })
      .into(USERS_TABLE)
      .returning("*")

    const userDto2 = new UserDto(user[0])
    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: user[0],
    }
  }

  async login(telephone, code) {
    const user = await knex
      .select("*")
      .from(USERS_TABLE)
      .where("telephone", telephone)

    if (!user[0]) {
      throw ApiError.BadRequest(
        `Пользователь с телефоном ${telephone} не найден`
      )
    }

    if (code !== user[0].code) {
      throw ApiError.BadRequest("Код не подходит")
    }
    const userDto = new UserDto2(user[0])
    const userDto2 = new UserDto(user[0])

    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto2,
    }
  }

  async logout(refreshToken) {
    const token = tokenService.removeToken(refreshToken)
    return token
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }

    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDB = await tokenService.findToken(refreshToken)

    if (!userData || !tokenFromDB[0]) {
      throw ApiError.UnauthorizedError()
    }

    const user = await knex
      .select("*")
      .from(USERS_TABLE)
      .where("id", userData.id)

    const userDto = new UserDto2(user[0])
    const userDto2 = new UserDto(user[0])
    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto2,
    }
  }

  async getAllUsers() {
    const users = await knex.select("*").from(USERS_TABLE)

    const userDtos = users.map((user) => new UserDto(user))
    return userDtos
  }

  async getCode(telephone) {
    const codeData = await knex
      .select("*")
      .from(USERS_TABLE)
      .where("telephone", telephone)
    return codeData[0]
  }
}

module.exports = new UserService()
