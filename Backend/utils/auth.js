const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Generates and Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create token
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username
    };
    const token = jwt.sign(
        { data: safeUser },
        secret,
        { expiresIn: parseInt(expiresIn) }     //604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === 'production';

    // Set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, //maxAge in miliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction & 'Lax'
    });

    return token
};

// Restores User -Global Middleware-
const restoreUser = (req, res, next) => {
    // Token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if(err) {
            return next();
        }

        try {
            const { id } = jwtPayload.data;
            req.user = await User.findByPk(id, {
                attributes: {
                    include: ['email', 'createdAt', 'updatedAt']
                }
            });
        } catch(error) {
            res.clearCookie('token');
            return next();
        }

        if(!req.user) res.clearCookie('token');

        return next();
    });
};

// Require Auth
    // If there's no current user, return an error
const requireAuth = function (req, _res, next) {
    if(req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.message = 'Authentication required';
    err.status = 401;
    return next(err)
};


module.exports = { setTokenCookie, restoreUser, requireAuth };
