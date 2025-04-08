const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "관리자 권한이 필요합니다." });
    }
  };
  
  module.exports = adminMiddleware;