const mongoose = require('mongoose');
const ParseResultSchema = new mongoose.Schema({
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed }, // 存储完整解析JSON
  updatedAt: { type: Date, default: Date.now }
}, { collection: 'parseresults' });
module.exports = mongoose.model('ParseResult', ParseResultSchema); 