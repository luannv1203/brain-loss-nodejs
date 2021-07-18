module.exports = (data) => {
  return {
    id: data._id,
    firstName: data.firstName,
    lastName: data.lastName,
    userName: data.userName,
    phoneNumber: data.phoneNumber || null,
    avatar: data.avatar || null
  }
}