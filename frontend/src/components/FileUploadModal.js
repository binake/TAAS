import React, { useState, useEffect } from 'react';

function FileUploadModal({ projectId, onSuccess, onClose, defaultType }) {
  const [files, setFiles] = useState([]);
  const [type, setType] = useState(defaultType || 'resume');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [useDirectory, setUseDirectory] = useState(false);

  useEffect(() => {
    if (defaultType) setType(defaultType);
  }, [defaultType]);

  const handleUpload = () => {
    if (!files.length) return;
    setLoading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('file', file));
    if (projectId) {
      formData.append('project', projectId);
    } else {
      formData.append('type', type);
    }
    fetch('/api/files/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onSuccess();
        }, 800);
      });
  };

  return (
    <div style={{
      position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320 }}>
        <h3>上传文件</h3>
        <div style={{ marginBottom: 8 }}>
          <button onClick={() => setUseDirectory(false)} style={{ background: !useDirectory ? '#1677ff' : '#f5f5f5', color: !useDirectory ? '#fff' : '#222', border: 'none', borderRadius: 4, padding: '4px 12px', marginRight: 8 }}>上传文件</button>
          <button onClick={() => setUseDirectory(true)} style={{ background: useDirectory ? '#1677ff' : '#f5f5f5', color: useDirectory ? '#fff' : '#222', border: 'none', borderRadius: 4, padding: '4px 12px' }}>上传文件夹</button>
        </div>
        <input
          type="file"
          multiple
          {...(useDirectory ? { webkitdirectory: 'true', directory: 'true' } : {})}
          onChange={e => setFiles(Array.from(e.target.files))}
        />
        <span style={{ marginLeft: 8, color: '#888' }}>
          {files.length ? `${files.length} 个文件` : ''}
        </span>
        {!projectId && (
          <select value={type} onChange={e => setType(e.target.value)} style={{ marginLeft: 16 }}>
            <option value="resume">简历</option>
            <option value="company">公司介绍</option>
            <option value="workflow">工作流程</option>
            <option value="knowledge">知识纪要</option>
          </select>
        )}
        <div style={{ marginTop: 16 }}>
          <button onClick={handleUpload} disabled={loading || !files.length}>{loading ? '上传中...' : '上传'}</button>
          <button onClick={onClose} style={{ marginLeft: 8 }}>取消</button>
        </div>
        {success && <div style={{ color: 'green', marginTop: 8 }}>上传成功！</div>}
      </div>
    </div>
  );
}

export default FileUploadModal; 