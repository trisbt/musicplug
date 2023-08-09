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
        const user1 = await User.findOne({ username: `${username}` }).exec();
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
    const sessionToken = req.cookies.ssid;
    try {
        await Session.deleteOne({ sessionToken });
        res.clearCookie('ssid');
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Error logging out:', err);
        return next(err);
    }
};


userController.addFavorites = async (req, res, next) => {
    const id = req.body.id;
    const username = req.body.username;
    const artist = req.body.arists;
    const song = req.body.name;
    const image = req.body.images;
    const album = req.body.albums;
    try {
        const user = await User.findOne({ username, 'favorites.id': id });

        if (user) {
            return res.status(400).json({ error: 'Favorite already exists' });
        }

        await User.findOneAndUpdate(
            { username: username }, // Filter condition to find the user 'trisb'
            { $push: { favorites: { id, song, artist, album, image } } }, // Update to add the new favorite
            { new: true } // Option to return the updated user object
        )
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



module.exports = userController;
