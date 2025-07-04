import React, { useState } from 'react';
import './App.css';
import ProjectTree from './components/ProjectTree';
import ProjectFilesPanel from './components/ProjectFilesPanel';
import DataUploadPanel from './components/DataUploadPanel';

const uploadTypes = [
  { key: 'resume', label: '个人简历上传' },
  { key: 'company', label: '公司介绍上传' },
  { key: 'workflow', label: '工作流程上传' },
  { key: 'knowledge', label: '知识纪要上传' },
];

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [activeMenu, setActiveMenu] = useState('project');
  const [activeUploadType, setActiveUploadType] = useState('resume');

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-title">工作台</div>
        <nav className="sidebar-menu">
          <div onClick={() => { setActiveMenu('project'); setSelectedProjectId(null); }} className={`sidebar-menu-item${activeMenu === 'project' ? ' active' : ''}`}>我的项目</div>
          {activeMenu === 'project' && <ProjectTree onSelect={setSelectedProjectId} selectedId={selectedProjectId} />}
          <div className="sidebar-menu-item">AI对话</div>
          <div className="sidebar-menu-item">数据（知识库）检索</div>
          <div className={`sidebar-menu-item${activeMenu === 'upload' ? ' active' : ''}`}>数据上传</div>
          {uploadTypes.map(type => (
            <div
              key={type.key}
              onClick={() => { setActiveMenu('upload'); setActiveUploadType(type.key); setSelectedProjectId(null); }}
              className={`sidebar-menu-item${activeMenu === 'upload' && activeUploadType === type.key ? ' active' : ''}`}
              style={{ fontSize: 15, paddingLeft: 24, cursor: 'pointer' }}
            >
              {type.label}
            </div>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <div className="main-header-title">AI简历分析系统</div>
        </header>
        <section className="main-section">
          {activeMenu === 'project' ? (
            selectedProjectId ? (
              <ProjectFilesPanel projectId={selectedProjectId} />
            ) : (
              <div className="placeholder">请选择左侧项目</div>
            )
          ) : null}
          {activeMenu === 'upload' ? (
            <DataUploadPanel onlyType={activeUploadType} />
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default App;
