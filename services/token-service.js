const conf = require("../conf")
const knex = require("knex")(conf.pg)
const jwt = require("jsonwebtoken")
const TOKEN_TABLE = "tokens"

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, conf.accessSecret, {
      expiresIn: "15s",
    })
    const refreshToken = jwt.sign(payload, conf.refreshSecret, {
      expiresIn: "30d",
    })
    return {
      accessToken,
      refreshToken,
    }
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, conf.accessSecret)
      return userData
    } catch (e) {
      return null
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, conf.refreshSecret)
      return userData
    } catch (e) {
      return null
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await knex
      .select("*")
      .from(TOKEN_TABLE)
      .where("userid", userId)

    if (tokenData[0]) {
      return await knex(TOKEN_TABLE)
        .where({ userid: userId })
        .update({ refreshtoken: refreshToken })
        .returning("*")
    }

    const token = await knex
      .insert(
        {
          userid: userId,
          refreshtoken: refreshToken,
        },
        ["refreshtoken"]
      )
      .into(TOKEN_TABLE)

    return token
  }

  async findToken(refreshToken) {
    const tokenData = await knex
      .select("*")
      .from(TOKEN_TABLE)
      .where("refreshtoken", refreshToken)
    return tokenData
  }

  async removeToken(refreshToken) {
    const tokenData = await knex(TOKEN_TABLE)
      .where("refreshtoken", refreshToken)
      .del()
      .returning("*")
    return tokenData
  }
}

module.exports = new TokenService()
