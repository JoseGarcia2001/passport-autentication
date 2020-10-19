const MongoLib = require('../lib/mongo');
const bcrypt = require('bcrypt');

class usersService {
  constructor() {
    this.collection = 'users';
    this.mongoDB = new MongoLib();
  }

  async getUser({ email }) {
    const [user] = await this.mongoDB.getAll(this.collection, { email })
    return user;
  }

  async createUser({ user }) {
    const [name, email, password] = user
    const hashedPassword = bcrypt.hash(password, 10)

    const createUserId = await this.mongoDB.create({
      name,
      email,
      password: hashedPassword,
    })

    return createUserId
  }
}

module.exports = usersService