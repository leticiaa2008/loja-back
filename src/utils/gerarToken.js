const jwt = require('jsonwebtoken');

function gerarToken(id) {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: '7d'
        }
    );
}

module.exports = gerarToken;