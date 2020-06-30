const Roles = require('../models/Roles');


exports.createRoles = async (req, res) => {
    try {
        const roles = await Roles.create(req.body);
        res.status(200).json({ success: true, data: roles})
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ success: true, message: 'Server Error'})
    }
}