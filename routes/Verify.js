const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token
    
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if(err) {
                return res.status(403).json({ message: "Token is invalid!" });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(400).json({
            status: false,
            message: 'Auth Missing!'
        });
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        next();
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user && req.user.isAdmin){
            next();
        } else {
            return res.status(400).json({
                status: false,
                message: 'Only admin has access to do that!'
            });
        }
    });
};

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };
