import React, { useRef } from 'react';
import './DataUpload.css';

const uploadTypes = [
  { key: 'resume', label: '个人简历上传' },
  { key: 'company', label: '公司介绍上传' },
  { key: 'workflow', label: '工作流程上传' },
  { key: 'knowledge', label: '知识纪要上传' },
];

function DataUpload() {
  const fileInputs = useRef({});

  const handleUploadClick = (key) => {
    fileInputs.current[key].click();
  };

  const handleFileChange = (key, e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`${uploadTypes.find(t => t.key === key).label}：${file.name}`);
      // 这里可扩展为上传逻辑
    }
  };

  return (
    <div className="data-upload-panel">
      <div className="data-upload-title">数据上传</div>
      <ul className="data-upload-list">
        {uploadTypes.map(type => (
          <li key={type.key} className="data-upload-item">
            <button className="upload-btn" onClick={() => handleUploadClick(type.key)}>{type.label}</button>
            <input
              type="file"
              style={{ display: 'none' }}
              ref={el => (fileInputs.current[type.key] = el)}
              onChange={e => handleFileChange(type.key, e)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DataUpload; 