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

// 解析简历API
router.post('/parse/:id', async (req, res) => {
  const { id } = req.params;
  const url = 'https://ap-beijing.cloudmarket-apigw.com/service-9wsy8usn/ResumeParser';
  const secretId = 'RrIawnDnCs4ha4hs';
  const secretKey = 'JQSIHcT3xjgVAD1p33kvcn3I6KG4TcrB';
  const fs = require('fs');
  const crypto = require('crypto');
  const { v4: uuidv4 } = require('uuid');
  try {
    const fileDoc = await File.findById(id);
    if (!fileDoc) return res.status(404).json({ error: 'File not found' });
    const filePath = path.join(__dirname, '../uploads', fileDoc.filename);
    const fileBuffer = fs.readFileSync(filePath);
    const base64Content = fileBuffer.toString('base64');
    const date = new Date().toUTCString();
    const signStr = `x-date: ${date}`;
    const sign = crypto.createHmac('sha1', secretKey).update(signStr).digest('base64');
    const auth = JSON.stringify({ id: secretId, 'x-date': date, signature: sign });
    const axios = require('axios');
    let resp;
    try {
      resp = await axios.post(url, {
        file_name: fileDoc.originalname,
        file_cont: base64Content,
        need_avatar: 1
      }, {
        headers: {
          'request-id': uuidv4(),
          'Authorization': auth,
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
    } catch (apiErr) {
      console.error('第三方API请求失败:', apiErr.response ? apiErr.response.data : apiErr);
      throw new Error('第三方API请求失败: ' + (apiErr.response ? JSON.stringify(apiErr.response.data) : apiErr.message));
    }
    fileDoc.parseResult = resp.data;
    fileDoc.status = '已解析';
    fileDoc.parseError = undefined;
    await fileDoc.save();
    // 保存解析结果到ParseResult表
    const ParseResult = require('../models/ParseResult');
    await ParseResult.findOneAndUpdate(
      { fileId: fileDoc._id },
      { data: resp.data, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ success: true, result: resp.data });
  } catch (err) {
    console.error('解析API出错:', err.stack || err);
    await File.findByIdAndUpdate(id, { status: '解析失败', parseError: err.message });
    res.status(500).json({ error: '解析失败', detail: err.message });
  }
});

module.exports = router; 