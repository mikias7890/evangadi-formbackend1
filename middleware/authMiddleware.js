const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  //   The middleware first attempts to retrieve the authorization header from the incoming request (req).
  // The authorization header typically contains the token, and it's used to authenticate users.

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "authentication invalid" });
  }

  //   The code checks if the authHeader exists and if it starts with "Bearer", which is the standard format for tokens (Bearer <token>).
  // If the header is missing or doesn't start with "Bearer", the request is denied, and an "unauthorized" status code (401) is returned with the message "authentication invalid".

  const token = authHeader.split(" ")[1];
  //   If the header is valid, it splits the string by spaces (split(' ')) and extracts the token, which is the second part ([1]) of the Bearer <token> string.
  // This token is the actual JWT that will be verified.
  console.log(authHeader);
  console.log(token);
  try {
    const { username, userid } = jwt.verify(token, "secret");
    //     The jwt.verify function is used to validate the token against a secret string ("secret" in this case).
    // If the token is valid, the payload inside the token is decoded. The decoded payload typically contains claims (information) such as username and userid, which are extracted here.
    // This step ensures that the token has not been tampered with and is still valid.
    //decoded payload will be returned which is the information or claims encoded in the token.
    // return res.status(StatusCodes.OK).json({ data });
    req.user = { username, userid };
    //     After successfully decoding the token, the middleware attaches the extracted username and userid to the req object (as req.user).
    // This makes the user's information available to the next middleware or route handler, allowing further processing based on the authenticated user's details.
    next();
    // The next() function is called to pass control to the next middleware or route handler in the stack. If this function is not called, the request will be stuck and not processed further
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalidd" });
  }
}

module.exports = authMiddleware;
