module.exports = class UserDto {
  id
  telephone
  firstname
  lastname
  email
  constructor(model) {
    this.id = model.id
    this.telephone = model.telephone
    this.firstname = model.firstname
    this.lastname = model.lastname
    this.email = model.email
  }
}
