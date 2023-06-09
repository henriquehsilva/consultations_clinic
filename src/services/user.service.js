import User from '../models/user.model.js';

class UserService {

  create = (id, user) => {

    return new User({ 
      id: id,
      name: user.name, 
      phone: user.phone 
    });
  }
}

export default new UserService();