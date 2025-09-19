const auth = (req, res, next) => {
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: '访问被拒绝，需要认证token'
    });
  }
  
  // 模拟token验证
  if (token === 'mock-jwt-token') {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: '无效的token'
    });
  }
};

module.exports = auth;
