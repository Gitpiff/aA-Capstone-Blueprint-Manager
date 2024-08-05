const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser } = require('../../utils/auth.js');

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;




// const router = require('express').Router();
// const { setTokenCookie } = require('../../utils/auth');
// const { restoreUser } = require('../../utils/auth');
// const { requireAuth } = require('../../utils/auth');
// const { User } = require('../../db/models');

// // Get Current User's Token -Login-
// router.get('/set-token-cookie', async (_req, res) => {
//     const user = await User.findOne({
//         where: {
//             username: 'VictorN'
//         }
//     });
//     setTokenCookie(res, user);
//     return res.json({ user: user});
// });

// router.post('/test', function(req, res) {
//     res.json({ requestBody: req.body });
// });

// // Restore User's Token
// router.use(restoreUser);

// router.get('/restore-user', (req, res) => {
//     return res.json(req.user);
// });

// router.get('/require-auth', requireAuth, (req, res) => {
//     return res.json(req.user);
// })

// module.exports = router;