const jwt = require('jsonwebtoken');
const User = require('../models/User'); // assuming you have this

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id.toString(), email: user.email }, // 🔥 use userId
            process.env.JWT_SECRET || 'yo0aUAPPC6',
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login' });
    }
};

module.exports = { loginUser };
