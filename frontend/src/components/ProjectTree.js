import React, { useState, useEffect } from 'react';
import './ProjectTree.css';

function ProjectTree({ onSelect, selectedId }) {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');

  // 获取项目列表
  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(setProjects);
  }, []);

  const handleAddProject = () => {
    if (!newProjectName.trim()) return;
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newProjectName })
    })
      .then(res => res.json())
      .then(project => {
        setProjects([...projects, project]);
        setNewProjectName('');
        if (onSelect) onSelect(project._id);
      });
  };

  return (
    <div className="project-tree">
      <div className="project-tree-header">
        {/* <span>我的项目</span> */}
        {/* <button className="add-btn" onClick={handleAddProject}>+</button> */}
      </div>
      <ul className="project-list">
        {projects.map(project => (
          <li
            key={project._id}
            className={`project-item${selectedId === project._id ? ' selected' : ''}`}
            onClick={() => onSelect && onSelect(project._id)}
            style={{ cursor: 'pointer' }}
          >
            <span>{project.name}</span>
          </li>
        ))}
      </ul>
      <div className="add-project-input">
        <input
          type="text"
          placeholder="输入新项目名称"
          value={newProjectName}
          onChange={e => setNewProjectName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddProject()}
        />
      </div>
    </div>
  );
}

export default ProjectTree; 