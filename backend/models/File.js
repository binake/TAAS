const mongoose = require('mongoose');
const FileSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  type: String,
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now },
  status: { type: String, default: '未解析' },
  meta: Object,
  parseResult: { type: Object }, // 解析结果
  parseError: { type: String }, // 解析错误
});
module.exports = mongoose.model('File', FileSchema); 