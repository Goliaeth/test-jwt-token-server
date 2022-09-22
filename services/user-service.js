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
        },
        ["id", "email"]
      )
      .into(USERS_TABLE)

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
