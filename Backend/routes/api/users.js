const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();

//Sign up
router.post('', async(req, res) => {
    const { firstName, lastName, username, companyName, industrySector, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ firstName, lastName, username, companyName, industrySector, email, hashedPassword });

    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        companyName: user.companyName,
        industrySector: user.industrySector,
        email: user.email
    };

    await setTokenCookie(res, safeUser);

    return res.json({ user: safeUser });
})

module.exports = router;


// fetch('/api/users', {
//     method: 'POST',
//     headers: {
//       "Content-Type": "application/json",
//       "XSRF-TOKEN": `xXGLo1tp-Rax4Kezm7SnfIet3rPVzty0BLRI`
//     },
//     body: JSON.stringify({
//         firstName: 'Whale',
//         lastName: 'Baluga',
//         username: 'Oreja',
//         companyName: 'Monster Trucks Inc',
//         industrySector: 'Entertainment',
//         email: 'lucabaluga@monstertruck.com',
//         password: 'orejapassord'
//     })
//   }).then(res => res.json()).then(data => console.log(data));