import React, { useState } from 'react';

export default function SimpleUpload() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');

  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    fetch('/api/files/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => setMsg('上传成功: ' + JSON.stringify(data)))
      .catch(err => setMsg('上传失败: ' + err));
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>最简文件上传测试</h2>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload} style={{ marginLeft: 8 }}>上传</button>
      <div style={{ marginTop: 16 }}>{msg}</div>
    </div>
  );
} 