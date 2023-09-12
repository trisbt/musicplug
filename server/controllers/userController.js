const User = require('../models/userModel');
const Session = require('../models/sessionModel');
const bcrypt = require('bcrypt');

const userController = {};

userController.createUser = async (req, res, next) => {
  try {
    const { username, password, email, firstname, lastname } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already in use.' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already in use.' });
      }
    }

    // Continue with user creation if no conflicts
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = { 
      firstname: firstname, 
      lastname: lastname, 
      username: username, 
      password: hashedPassword, 
      email: email 
    };
    res.locals.user = await User.create(user);

    return next();
  } catch (err) {
    return next({ err: 'middleware createUser error' });
  }
};


userController.verifyUser = async (req, res, next) => {

  const { username, password, rememberMe } = req.body;
  try {
    const user1 = await User.findOne({ username: `${username}` }).exec();
    if (user1) {
      const isPasswordValid = await bcrypt.compare(password, user1.password);
      if (isPasswordValid) {
        res.locals.user = {
          id: user1._id,
          username: user1.username,
          firstname: user1.firstname,
          lastname: user1.lastname,
          email: user1.email,
          rememberMe: rememberMe
        };
        return next();
      } else {
        return res.status(401).json({ message: 'Invalid password' });
      }
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};


userController.logoutUser = async (req, res, next) => {
  const sessionToken = req.cookies.ssid;
  try {
    await Session.deleteOne({ sessionToken });
    res.clearCookie('ssid');
    res.clearCookie('plugKeepMeLoggedIn')
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Error logging out:', err);
    return next(err);
  }
};

userController.changePassword = async (req, res, next) => {
  const { username, email, passwordOld, passwordNew } = req.body;
  console.log(username, email, passwordOld, passwordNew)
  try {
    const currentUser = await User.findOne({ username, email }).exec();
    console.log(currentUser)
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isOldPasswordValid = await bcrypt.compare(passwordOld, currentUser.password);

    if (!isOldPasswordValid) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }

    // If old password is valid, hash the new password and update in database
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(passwordNew, salt);

    currentUser.password = hashedNewPassword;
    await currentUser.save();

    res.locals.message = 'Password successfully changed'
    return next();
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

userController.deleteAccount = async (req, res, next) => {
  const { username, email } = req.body;
  try {
    const user = await User.findOneAndDelete({ username, email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.locals.message = 'Account successfully deleted';
    return next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


userController.addFavorites = async (req, res, next) => {
  const id = req.body.id;
  const username = req.body.username;
  const artist = req.body.artists.map(el => el.name).join(',');
  const song = req.body.name;
  const image = req.body.images;
  const album = req.body.albums;
  const key = req.body.key;
  const tempo = req.body.tempo;
  const loudness = req.body.loudness
  let isFavorite;
  try {
    const user = await User.findOne({ username, 'favorites.id': id });
    if (user) {
      await User.findOneAndUpdate(
        { username: username },
        { $pull: { favorites: { id } } },
        { new: true }
      )
      isFavorite = 'removed'
      res.locals.userFavs = { username, song, isFavorite };
      return next();
    }
    else {
      isFavorite = 'added';
    }
    await User.findOneAndUpdate(
      { username: username },
      { $push: { favorites: { id, song, artist, album, image, key, tempo, loudness } } },
      { new: true }
    )
    res.locals.userFavs = { username, song, isFavorite };
    return next();
  } catch (err) {
    return res.status(500).json({ error: 'Error updating user favorites' });
  }
};

userController.getFavorites = (req, res, next) => {
  const { username } = req.body
  User.findOne(
    { username: username }
  )
    .then(user => {
      res.locals.userFavs = user;
      return next();
    })
    .catch(err => {
      console.log('cannot get favs of user');
      return next(err);
    })
}
userController.deleteFavorites = async (req, res, next) => {
  const { username, idsToDelete } = req.body;
  // console.log(username, idsToDelete)
  if (!username || !idsToDelete || !Array.isArray(idsToDelete)) {
    return res.status(400).json({ message: "Invalid request data." });
  }
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    user.favorites = user.favorites.filter(favorite => !idsToDelete.includes(favorite.id));
    await user.save();
    return next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
}



module.exports = userController;
