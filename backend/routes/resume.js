const express = require('express');
const router = express.Router();
const ParseResult = require('../models/ParseResult');
const mongoose = require('mongoose');

// 获取所有简历
router.get('/all', async (req, res) => {
  try {
    const results = await ParseResult.find({}, { 'data.result': 1 }).sort({ _id: -1 });
    res.json(results.map(doc => ({ ...doc.data.result, _id: doc._id })));
  } catch (err) {
    res.status(500).json({ error: '查询失败', detail: err.message });
  }
});

// 获取最新一条简历
router.get('/latest', async (req, res) => {
  try {
    const doc = await ParseResult.findOne({}, { 'data.result': 1 }).sort({ _id: -1 });
    if (doc && doc.data && doc.data.result) {
      res.json({ ...doc.data.result, _id: doc._id });
    } else {
      res.status(404).json({ error: '未找到简历数据' });
    }
  } catch (err) {
    res.status(500).json({ error: '查询失败', detail: err.message });
  }
});

// 获取指定ID简历
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID格式错误' });
    }
    const doc = await ParseResult.findById(req.params.id, { 'data.result': 1 });
    if (doc && doc.data && doc.data.result) {
      res.json({ ...doc.data.result, _id: doc._id });
    } else {
      res.status(404).json({ error: '未找到简历数据' });
    }
  } catch (err) {
    res.status(500).json({ error: '查询失败', detail: err.message });
  }
});

// 保存简历
router.post('/', async (req, res) => {
  try {
    const doc = new ParseResult({
      data: { result: req.body },
      updatedAt: new Date()
    });
    await doc.save();
    res.json({ success: true, id: doc._id });
  } catch (err) {
    res.status(500).json({ error: '保存失败', detail: err.message });
  }
});

module.exports = router; 