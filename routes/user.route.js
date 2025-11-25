const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, deleteUser, updateUser } = require('../controllers/user.controller');

router.get('/all', getAllUsers);
router.post('/add', createUser);
router.delete('/delete/:id', deleteUser)
router.put('/update/:id', updateUser)

module.exports = router;