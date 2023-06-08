const User = require('../models/userModel');

const userController = {};

/**
* getAllUsers - retrieve all users from the database and stores it into res.locals
* before moving on to next middleware.
*/
// userController.getAllUsers = (req, res, next) => {
//     User.find({}, (err, users) => {
//         // if a database error occurs, call next with the error message passed in
//         // for the express global error handler to catch
//         if (err) return next('Error in userController.getAllUsers: ' + JSON.stringify(err));

//         // store retrieved users into res.locals and move on to next middleware
//         res.locals.users = users;
//         return next();
//     });
// };

/**
* createUser - create and save a new User into the database.
*/
userController.createUser = async (req, res, next) => {
    // write code here

    try {
        const { username, password } = req.body;
        // console.log(req.body)
        const user = { username: username, password: password };
        res.locals.user = await User.create(user);
        console.log(user)
        return next();
    }
    catch (err) {
        return next({ err: 'middleware createUser error' });
    }
};

/**
* verifyUser - Obtain username and password from the request body, locate
* the appropriate user in the database, and then authenticate the submitted password
* against the password stored in the database.
*/
userController.verifyUser = async (req, res, next) => {
    // write code here
    const { username, password } = req.body
    // console.log(username)
    try {
        const user1 = await User.findOne({ username: `${username}`, password: `${password}` }).exec();
        if (user1) {
            res.locals.user = user1[0]
            console.log('User Found' + `${user1}`)
            return next();
        }
        else {
            console.log('failed')
            res.redirect('http://localhost:3000/signup');
        }
    }
    catch (err) {
        console.log('Hit Error')
        return next(err)
    }
}

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
