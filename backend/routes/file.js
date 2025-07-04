const express = require('express');
const multer = require('multer');
const File = require('../models/File');
const path = require('path');
const mongoose = require('mongoose');
// const iconv = require('iconv-lite'); // 不再需要
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// 多文件上传
router.post('/upload', upload.array('file'), async (req, res) => {
  try {
    const { project, type } = req.body;
    const projectId = project && project !== 'null' ? new mongoose.Types.ObjectId(project) : null;
    const files = await Promise.all(
      req.files.map(f => {
        const fixedName = Buffer.from(f.originalname, 'latin1').toString('utf8');
        console.log('上传文件名:', fixedName); // 日志输出
        return File.create({
          project: projectId,
          type,
          filename: f.filename,
          originalname: fixedName, // 用latin1转utf8修复
          mimetype: f.mimetype,
          size: f.size
        });
      })
    );
    res.json(files);
  } catch (err) {
    console.error('文件上传出错:', err);
    res.status(500).json({ error: '文件上传失败', detail: err.message });
  }
});

// 获取文件列表
router.get('/', async (req, res) => {
  const { project, type, page = 1, pageSize = 10 } = req.query;
  const filter = {};
  if (project && project !== 'null') filter.project = project;
  if (type) filter.type = type;
  const total = await File.countDocuments(filter);
  const files = await File.find(filter)
    .skip((page - 1) * pageSize)
    .limit(Number(pageSize));
  res.json({ total, files });
});

// 删除文件
router.delete('/:id', async (req, res) => {
  await File.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router; 