const admin = require("../firebase");

exports.authCheck = async (req, res, next) => {
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    res.user = firebaseUser;
    console.log("Firebase user in object", firebaseUser);
  } catch (error) {
    console.log(error);
    res.status(401).json({
      error: "Invalid or Expired token",
    });
  }
  next();
};
