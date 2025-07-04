const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { mongoUri } = require('./config');
const projectRoutes = require('./routes/project');
const fileRoutes = require('./routes/file');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/projects', projectRoutes);
app.use('/api/files', fileRoutes);

app.listen(4000, () => console.log('Backend running on http://localhost:4000')); 