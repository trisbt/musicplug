const User = require('../models/userModel');
const Session = require('../models/sessionModel'); 
const bcrypt = require('bcrypt');

const userController = {};

userController.createUser = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = { username: username, password: hashedPassword, email: email };
        res.locals.user = await User.create(user);
        return next();
    } catch (err) {
        return next({ err: 'middleware createUser error' });
    }
};

userController.verifyUser = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user1 = await User.findOne({ username: `${username}`}).exec();
        if (user1) {
            const isPasswordValid = await bcrypt.compare(password, user1.password);
            if (isPasswordValid) {
                res.locals.user = user1;
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
  const cookieId = req.cookies.ssid;
  try {
    await Session.deleteOne({ cookieId });
    res.clearCookie('ssid');
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Error logging out:', err);
    return next(err);
  }
};


userController.addFavorites = (req, res, next) => {
    const { song, artist, album, image } = req.body;
    User.findOneAndUpdate(
        { username: 'trisb' }, // Filter condition to find the user 'trisb'
        { $push: { favorites: { song, artist, album, image } } }, // Update to add the new favorite
        { new: true } // Option to return the updated user object
    )
        .then(updatedUser => {
            // The updated user object can be accessed in the `updatedUser` variable
            console.log('Updated user:', updatedUser);
            return next();
        })
        .catch(err => {
            // Handle any errors that occur during the update process
            console.error('Error updating user favorites:', err);
            return next(err);
        });
};

userController.getFavorites = (req, res, next) => {

    User.findOne(
        { username: 'trisb' }
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



module.exports = userController;
