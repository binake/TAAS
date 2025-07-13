const express = require('express');
const router = express.Router();
const ParseResult = require('../models/ParseResult');

// 获取解析结果
router.get('/:fileId', async (req, res) => {
  try {
    const result = await ParseResult.findOne({ fileId: req.params.fileId });
    if (!result) return res.status(404).json({ error: '未找到解析结果' });
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: '查询失败', detail: err.message });
  }
});

// 更新解析结果
router.put('/:fileId', async (req, res) => {
  try {
    const updated = await ParseResult.findOneAndUpdate(
      { fileId: req.params.fileId },
      { data: req.body, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: updated.data });
  } catch (err) {
    res.status(500).json({ error: '更新失败', detail: err.message });
  }
});

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
// 获取指定ID简历（只返回data.result内容）
router.get('/:id', async (req, res) => {
  try {
    const doc = await ParseResult.findById(req.params.id, { 'data.result': 1 });
    if (doc && doc.data && doc.data.result) {
      res.json(doc.data.result); // 只返回 result
    } else {
      res.status(404).json({ error: '未找到解析结果' });
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