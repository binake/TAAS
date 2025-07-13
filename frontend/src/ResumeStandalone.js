import React, { useEffect, useState } from 'react';
import './components/ResumePages.css';

export default function ResumeStandalone() {
  // 你可以在这里直接写死 fileId 测试
  const fileId = window.location.pathname.split('/').pop();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/parse-result/${'6870c77a9e4ac01979d5420c'}`)
      .then(res => res.json())
      .then(res => {
        setData(res.result);
        setLoading(false);
      })
      .catch(e => {
        setError('加载失败');
        setLoading(false);
      });
  }, [fileId]);

  if (loading) return <div className="resume-loading">加载中...</div>;
  if (error) return <div className="resume-loading" style={{color:'red'}}>{error}</div>;
  if (!data) return <div className="resume-loading">无数据</div>;

  return (
    <div className="resume-container">
      <div className="resume-sidebar">
        <div className="profile-section">
          <div className="profile-image">
            {data.avatar_data ? <img src={data.avatar_data} alt="头像" /> : <div className="no-avatar">无头像</div>}
          </div>
          <div className="name">{data.name || '未提供姓名'}</div>
          <div className="title">{data.major || '专业未填写'}</div>
          <div className="age-gender">{data.age || ''}岁 | {data.gender || ''}</div>
        </div>
        <div className="contact-section">
          <h3 className="section-title">联系方式</h3>
          {data.email && <div className="contact-item"><i>📧</i><span>{data.email}</span></div>}
          {data.phone && <div className="contact-item"><i>📱</i><span>{data.phone}</span></div>}
          {data.living_address && <div className="contact-item"><i>📍</i><span>{data.living_address}</span></div>}
          {data.college && <div className="contact-item"><i>🎓</i><span>{data.college}</span></div>}
        </div>
        {data.lang_objs && data.lang_objs.length > 0 && (
          <div className="contact-section">
            <h3 className="section-title">语言能力</h3>
            {data.lang_objs.map((lang, i) => (
              <div className="language-item" key={i}>{lang.language_name}：{lang.level}{lang.cert ? ` (${lang.cert})` : ''}</div>
            ))}
          </div>
        )}
        {data.cert_objs && data.cert_objs.length > 0 && (
          <div className="contact-section">
            <h3 className="section-title">证书</h3>
            {data.cert_objs.map((cert, i) => (
              <div className="cert-item" key={i}>{cert.langcert_name || cert.cert_name}</div>
            ))}
          </div>
        )}
      </div>
      <div className="resume-main-content">
        <div className="intro-section">
          <div className="intro-text">
            我是{data.name}，{data.college ? '毕业于' + data.college : ''}{data.major ? data.major : ''}。
            拥有丰富的实习和工作经验，思考灵活、态度圆融，逻辑清晰，做事细心，不怕困难、乐于接受挑战，对任何目标都全力以赴。
          </div>
        </div>
        {data.job_exp_objs && data.job_exp_objs.length > 0 && (
          <div className="content-section">
            <h2>工作经历</h2>
            {data.job_exp_objs.map((job, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-date">{job.start_date} - {job.end_date}</div>
                <div className="timeline-title">{job.job_position}</div>
                <div className="timeline-company">{job.job_cpy}</div>
                <div className="timeline-content">
                  {job.job_content ? job.job_content.split('。').filter(item => item.trim()).map((item, idx) => `• ${item.trim()}`).join('\n') : ''}
                </div>
              </div>
            ))}
          </div>
        )}
        {data.education_objs && data.education_objs.length > 0 && (
          <div className="content-section">
            <h2>教育背景</h2>
            {data.education_objs.map((edu, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-date">{edu.start_date} - {edu.end_date}</div>
                <div className="timeline-title">{edu.edu_college_dept || edu.edu_major}</div>
                <div className="timeline-company">{edu.edu_college}</div>
                <div className="timeline-content">{edu.edu_degree || ''} | {edu.edu_major || ''}</div>
              </div>
            ))}
          </div>
        )}
        {data.social_exp_objs && data.social_exp_objs.length > 0 && (
          <div className="content-section">
            <h2>社会经历</h2>
            {data.social_exp_objs.map((social, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-date">{social.start_date} - {social.end_date}</div>
                <div className="timeline-title">{social.job_position}</div>
                <div className="timeline-company">{social.job_cpy}</div>
                <div className="timeline-content">
                  {social.job_content ? social.job_content.split('。').filter(item => item.trim()).map((item, idx) => `• ${item.trim()}`).join('\n') : ''}
                </div>
              </div>
            ))}
          </div>
        )}
        {data.skills_objs && data.skills_objs.length > 0 && (
          <div className="content-section">
            <h2>专业技能</h2>
            <div className="skills-grid">
              {data.skills_objs.map((skill, i) => (
                <div className="skill-item" key={i}>
                  <div className="skill-name">{skill.skills_name}</div>
                  <div className="skill-level">{skill.skills_level}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.expect_job_objs && data.expect_job_objs.length > 0 && (
          <div className="content-section">
            <h2>求职条件</h2>
            {data.expect_job_objs.map((expect, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-content">
                  <strong>希望职位：</strong>行销企划人员<br />
                  <strong>希望地点：</strong>{expect.expect_jlocation}<br />
                  <strong>希望待遇：</strong>{expect.expect_salary}<br />
                  <strong>希望产业：</strong>{expect.expect_industry}<br />
                  <strong>工作性质：</strong>全职，对远端工作有意愿
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 