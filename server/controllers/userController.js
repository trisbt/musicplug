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
                { $pull: { favorites: { id} } }, 
                { new: true } 
            )
            isFavorite = 'removed'
            res.locals.userFavs = {username, song, isFavorite};
            return next();
        }
        else{
            isFavorite = 'added';
        }
        await User.findOneAndUpdate(
            { username: username }, 
            { $push: { favorites: { id, song, artist, album, image, key, tempo, loudness } } }, 
            { new: true } 
        )
        res.locals.userFavs = {username, song, isFavorite};
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



module.exports = userController;
