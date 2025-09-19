const express = require('express');
const router = express.Router();

// 获取所有项目
router.get('/', (req, res) => {
  res.json({
    success: true,
    projects: [],
    total: 0,
    message: '获取项目列表成功'
  });
});

// 创建新项目
router.post('/', (req, res) => {
  res.json({
    success: true,
    message: '项目创建功能准备中',
    project: req.body
  });
});

module.exports = router;
