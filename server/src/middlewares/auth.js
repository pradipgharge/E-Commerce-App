const jwt = require("jsonwebtoken");

const secret = process.env.SECRET_KEY;

const createTokenForUser = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
  };

  const token = jwt.sign(payload, secret, {
    expiresIn: "1h",
  });
  return token;
};

//protects routes from unauthorized access by checking and authenticating a JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);

  if (!token) {
    return res.status(401).send("Authorization failed. No access token.");
  }

  //Verifying if the token is valid
  jwt.verify(token, "secret", (err) => {
    if (err) {
      return res.status(403).send("Could not verify token!");
    }

    next();
  });
};

module.exports = {
  createTokenForUser,
  verifyToken,
};
