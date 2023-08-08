
const cookieController = {};

// cookieController.setCookie = async (req, res, next) => {
//     res.cookie('plug', 1234);
//     return next();
// }

cookieController.setSSIDCookie = async (req, res, next) => {
    try {
        const token = res.locals.sessionToken;
        await res.cookie('ssid', token, { httpOnly: true });
        return next();
    } catch (err) {
        console.error('Error setting cookie:', err);
        return next(err);
    }
};



module.exports = cookieController;
