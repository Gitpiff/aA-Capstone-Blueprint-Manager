const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { User } = require('../../db/models');
const router = express.Router();


//Login 

const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    handleValidationErrors
];


router.post('/', validateLogin, async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.unscoped().findOne({
        where: {
            [Op.or]: {
                username: credential,
                email: credential
            }
        }
    });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login Failed');
        err.status = 401;
        err.title = 'Login Failed';
        err.errors = { credential: 'The provided credentials were invalid.'};
        return next(err);
    }

    const safeUser = {
        //id: user.id,
        //email: user.email,
        username: user.username,
        companyName: user.companyName,
        industrySector: user.industrySector
    };
    
    await setTokenCookie(res, safeUser);
    
    return res.json({ user: safeUser });
});


//Logout
router.delete('/', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'You are now logged out'})
})


// Get Session User
router.get('/', (req, res) => {
    const { user } = req;

    if(user) {
        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            companyName: user.companyName,
            industrySector: user.industrySector,
            email: user.email
        };
        return res.json({
            user: safeUser
        });
    } else return res.json({ user: null });
});

module.exports = router;


