module.exports = class UserDto2 {
  id
  email
  constructor(model) {
    this.id = model.id
    this.email = model.email
  }
}
