const conf = require("../conf")
const knex = require("knex")(conf.pg)
const USERS_TABLE = "users"
const bcrypt = require("bcrypt")
const tokenService = require("./token-service")
const UserDto = require("../dtos/user-dto")
const ApiError = require("../exceptions/api-error")

class UserService {
  
  async registration(email, password) {
    const candidate = await knex
      .select("*")
      .from(USERS_TABLE)
      .where("email", email)

    if (candidate[0]) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email} уже существует`
      )
    }

    const hashPassword = await bcrypt.hash(password, 3)
    const user = await knex
      .insert(
        {
          email: email,
          password: hashPassword,
        }
      )
      .into(USERS_TABLE)
      .returning('*')

    const userDto = new UserDto(user[0])
    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto,
    }
  }

  async login(email, password) {
    const user = await knex.select("*").from(USERS_TABLE).where("email", email)

    if (!user[0]) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email} не найден`
      )
    }

    const isPassEquals = await bcrypt.compare(password, user[0].password)
    if (!isPassEquals) {
      throw ApiError.BadRequest("Wrong password")
    }
    const userDto = new UserDto(user[0])

    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto,
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
    if (!userData || ! !tokenFromDB) {
      throw ApiError.UnauthorizedError()
    }
    
    const user = await knex.select("*").from(USERS_TABLE).where("id", userData.id)
    const userDto = new UserDto(user[0])

    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto,
    }
  }

}

module.exports = new UserService()
