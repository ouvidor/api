import User from '../../models/User';

const fetchUsers = async () => {
  const users = await User.findAll({
    attributes: ['id', 'first_name', 'last_name', 'email', 'role'],
  });

  return users;
};

export default fetchUsers;
