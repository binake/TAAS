import React, { useEffect, useState, useCallback } from 'react';
import FileUploadModal from './FileUploadModal';

const PAGE_SIZE = 10;
const uploadTypes = [
  { key: 'resume', label: '个人简历上传' },
  { key: 'company', label: '公司介绍上传' },
  { key: 'workflow', label: '工作流程上传' },
  { key: 'knowledge', label: '知识纪要上传' },
];
const SLICE_METHOD = 'General';

function DataUploadPanel({ onlyType }) {
  const [files, setFiles] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [page, setPage] = useState(1);
  const [activeType, setActiveType] = useState(onlyType || 'resume');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [parsing, setParsing] = useState({});

  useEffect(() => {
    if (onlyType) setActiveType(onlyType);
  }, [onlyType]);

  const fetchFiles = useCallback(() => {
    fetch(`/api/files?type=${activeType}&page=${page}&pageSize=${PAGE_SIZE}`)
      .then(res => res.json())
      .then(data => {
        setFiles((data.files || []).map(f => ({
          ...f,
          chunkCount: f.chunkCount ?? Math.floor(Math.random()*7),
          sliceMethod: f.sliceMethod ?? SLICE_METHOD,
          enabled: f.enabled ?? true,
          status: f.status ?? '未解析',
        })));
      });
  }, [page, activeType]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleDelete = (id) => {
    if (!window.confirm('确定要删除该文件吗？')) return;
    fetch(`/api/files/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => fetchFiles());
  };

  const handleEnable = (id) => {
    setFiles(fs => fs.map(f => f._id === id ? { ...f, enabled: !f.enabled } : f));
  };

  // 解析按钮：调用后端API
  const handleParse = async (id) => {
    setParsing(p => ({ ...p, [id]: 0 }));
    try {
      const res = await fetch(`/api/files/parse/${id}`, { method: 'POST' });
      if (!res.ok) throw new Error('解析失败');
      await fetchFiles();
    } catch (e) {
      setFiles(fs => fs.map(f => f._id === id ? { ...f, status: '解析失败' } : f));
    } finally {
      setParsing(p => { const np = { ...p }; delete np[id]; return np; });
    }
  };

  // 搜索过滤
  const filteredFiles = files.filter(f => f.originalname.includes(search));

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', width: '100%' }}>
        {!onlyType && (
          <div style={{ width: 180, marginRight: 32, background: '#fff', borderRadius: 8, padding: '24px 0', boxShadow: '0 2px 8px #0001', height: 'fit-content' }}>
            {uploadTypes.map(type => (
              <div
                key={type.key}
                onClick={() => { setActiveType(type.key); setPage(1); }}
                style={{
                  padding: '16px 0',
                  textAlign: 'center',
                  cursor: 'pointer',
                  color: activeType === type.key ? '#1677ff' : '#222',
                  fontWeight: activeType === type.key ? 'bold' : 'normal',
                  background: activeType === type.key ? '#e6f0ff' : 'transparent',
                  borderLeft: activeType === type.key ? '4px solid #1677ff' : '4px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                {type.label}
              </div>
            ))}
          </div>
        )}
        <div className="card" style={{ flex: 1 }}>
          {/* 顶部工具栏 */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <select className="button" style={{background:'#f4f8fb',color:'#1677ff',border:'1px solid #e3eaf2',padding:'6px 18px',fontWeight:400}}>
                <option>批量</option>
                <option>批量删除</option>
                <option>批量解析</option>
              </select>
              <input
                className="input"
                style={{border:'1px solid #e3eaf2',borderRadius:6,padding:'7px 14px',fontSize:15,minWidth:180}}
                placeholder="搜索文件"
                value={search}
                onChange={e=>setSearch(e.target.value)}
              />
            </div>
            <button className="button" onClick={()=>setShowUpload(true)} style={{fontSize:16}}>+ 新增文件</button>
          </div>
          {/* 表格 */}
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" checked={selected.length===filteredFiles.length&&filteredFiles.length>0} onChange={e=>setSelected(e.target.checked?filteredFiles.map(f=>f._id):[])} /></th>
                <th>名称</th>
                <th>分块数</th>
                <th>上传日期</th>
                <th>切片方法</th>
                <th>启用</th>
                <th>解析状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map(f => (
                <tr key={f._id} style={{background: selected.includes(f._id)?'#e6f0ff':''}}>
                  <td><input type="checkbox" checked={selected.includes(f._id)} onChange={e=>setSelected(e.target.checked?[...selected,f._id]:selected.filter(id=>id!==f._id))} /></td>
                  <td style={{maxWidth:220,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.originalname}</td>
                  <td>{f.chunkCount}</td>
                  <td>{new Date(f.uploadDate).toLocaleString()}</td>
                  <td>{f.sliceMethod}</td>
                  <td>
                    <label className="switch">
                      <input type="checkbox" checked={f.enabled} onChange={()=>handleEnable(f._id)} />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    {parsing[f._id]!==undefined ? (
                      <span style={{color:'#1677ff'}}>{parsing[f._id]}%</span>
                    ) : f.status==='成功' ? (
                      <span style={{color:'#52c41a',background:'#f6ffed',padding:'2px 10px',borderRadius:6,fontWeight:500}}>成功</span>
                    ) : (
                      <span style={{color:'#1677ff',background:'#e6f0ff',padding:'2px 10px',borderRadius:6,fontWeight:500}}>{f.status}</span>
                    )}
                  </td>
                  <td style={{minWidth:120}}>
                    <button className="icon-btn" title="解析" onClick={()=>handleParse(f._id)} disabled={!!parsing[f._id]}>
                      <span role="img" aria-label="parse">🔄</span>
                    </button>
                    <button className="icon-btn" title="编辑" style={{marginLeft:4}}>
                      <span role="img" aria-label="edit">✏️</span>
                    </button>
                    <button className="icon-btn" title="删除" style={{marginLeft:4}} onClick={()=>handleDelete(f._id)}>
                      <span role="img" aria-label="delete">🗑️</span>
                    </button>
                    <a
                      className="icon-btn"
                      title="下载"
                      style={{marginLeft:4}}
                      href={`http://localhost:4000/uploads/${encodeURIComponent(f.filename)}`}
                      download={f.originalname}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span role="img" aria-label="download">⬇️</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* 分页 */}
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <button className="button" style={{padding:'6px 18px',fontSize:15}} onClick={() => setPage(page - 1)} disabled={page === 1}>上一页</button>
            <span style={{ margin: '0 8px' }}>第 {page} 页</span>
            <button className="button" style={{padding:'6px 18px',fontSize:15}} onClick={() => setPage(page + 1)} disabled={files.length < PAGE_SIZE}>下一页</button>
          </div>
          {showUpload && (
            <FileUploadModal
              projectId={null}
              onSuccess={() => {
                setShowUpload(false);
                fetchFiles();
              }}
              onClose={() => setShowUpload(false)}
              defaultType={activeType}
            />
          )}
          {/* 开关样式 */}
          <style>{`
            .switch { position: relative; display: inline-block; width: 38px; height: 22px; }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: #e3eaf2; transition: .4s; border-radius: 22px; }
            .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 2px; bottom: 2px; background: white; transition: .4s; border-radius: 50%; box-shadow: 0 1px 4px #1677ff22; }
            input:checked + .slider { background: linear-gradient(90deg,#1677ff 0%,#3ba0ff 100%); }
            input:checked + .slider:before { transform: translateX(16px); }
            .icon-btn { background: none; border: none; cursor: pointer; font-size: 18px; padding: 4px; border-radius: 6px; transition: background 0.2s; }
            .icon-btn:hover { background: #e6f0ff; }
            .icon-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            .input:focus { outline: 1.5px solid #1677ff; }
          `}</style>
        </div>
      </div>
    </div>
  );
}

export default DataUploadPanel; 