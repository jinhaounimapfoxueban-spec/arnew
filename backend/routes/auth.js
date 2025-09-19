const express = require('express');
const router = express.Router();

// 模拟登录
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // 模拟验证
  if (username === 'admin' && password === 'password') {
    res.json({
      success: true,
      message: '登录成功',
      token: 'mock-jwt-token',
      user: { username, role: 'admin' }
    });
  } else {
    res.status(401).json({
      success: false,
      message: '用户名或密码错误'
    });
  }
});

// 注册
router.post('/register', (req, res) => {
  res.json({
    success: true,
    message: '注册功能准备中'
  });
});

module.exports = router;
