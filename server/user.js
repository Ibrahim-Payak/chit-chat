// will create helper function here regarding user (use sign in, sign out, which users have which room)

//set up user array (intially it's empty)
const users = [];

const addUser = ({ id, name, room }) => {
  //Class A - classa (change room & name)
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  if (existingUser) {
    return { error: "This Username is already taken" };
  }

  const user = { id, name, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex != -1) {
    return users.splice(userIndex, 1)[0]; //remove that index value from users
  }
};

const getUser = (id) => users.find((user) => user.id === id);

//return all users from room
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
