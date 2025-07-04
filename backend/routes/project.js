const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const File = require('../models/File');

// 新建项目
router.post('/', async (req, res) => {
  const project = await Project.create({ name: req.body.name });
  res.json(project);
});

// 获取项目列表
router.get('/', async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

// 获取单个项目详情（含资料列表）
router.get('/:id', async (req, res) => {
  const project = await Project.findById(req.params.id);
  const files = await File.find({ project: req.params.id });
  res.json({ ...project.toObject(), files });
});

// 删除项目及其资料
router.delete('/:id', async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  await File.deleteMany({ project: req.params.id });
  res.json({ success: true });
});

module.exports = router; 