module.exports = class UserDto {
  id
  telephone
  constructor(model) {
    this.id = model.id
    this.telephone = model.telephone
  }
}
