const conf = require("../conf")
const knex = require("knex")(conf.pg)
const jwt = require("jsonwebtoken")
const TOKEN_TABLE = "tokens"

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, conf.accessSecret, {
      expiresIn: "15m",
    })
    const refreshToken = jwt.sign(payload, conf.refreshSecret, {
      expiresIn: "30d",
    })
    return {
      accessToken,
      refreshToken,
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await knex
      .select("*")
      .from(TOKEN_TABLE)
      .where("userid", userId)
    console.log(tokenData)
    if (tokenData[0]) {
      tokenData.refreshToken = refreshToken
      return await knex(TOKEN_TABLE)
        .where({ userid: userId })
        .update(tokenData[0])
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
}

module.exports = new TokenService()
