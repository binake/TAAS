import React, { useEffect, useState } from "react";
import axios from "axios";

const ResumePage = ({ resumeId = "68710eb32f5df87d117b2ec1" }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/api/parse-result/${resumeId}`)
      .then((res) => setData(res.data))
      .catch((err) => setError("加载失败"));
  }, [resumeId]);

  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!data) return <div>加载中...</div>;

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px #eee", padding: 32 }}>
      {/* 头像和基本信息 */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        {data.avatar_data && (
          <img
            src={data.avatar_data}
            alt="avatar"
            style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", marginRight: 32, border: "1px solid #eee" }}
          />
        )}
        <div>
          <h2 style={{ margin: 0 }}>{data.name} <span style={{ fontSize: 16, color: "#888" }}>{data.gender_inf} / {data.age_inf}岁</span></h2>
          <div style={{ color: "#666", marginTop: 8 }}>
            <div>学历：{data.degree}（{data.college}）</div>
            <div>专业：{data.major}</div>
            <div>毕业时间：{data.grad_time}</div>
            <div>工作年限：{data.work_year}年</div>
            {data.email && <div>邮箱：{data.email}</div>}
          </div>
        </div>
      </div>

      {/* 教育背景 */}
      <h3 style={{ borderLeft: "4px solid #1890ff", paddingLeft: 8 }}>教育背景</h3>
      {data.education_objs && data.education_objs.length > 0 ? (
        data.education_objs.map((edu, idx) => (
          <div key={idx} style={{ marginBottom: 12, paddingLeft: 12 }}>
            <b>{edu.edu_college}</b>（{edu.start_date} - {edu.end_date}）<br />
            学位：{edu.edu_degree}，专业：{edu.edu_major}
          </div>
        ))
      ) : (
        <div style={{ color: "#aaa", paddingLeft: 12 }}>无</div>
      )}

      {/* 工作经历 */}
      <h3 style={{ borderLeft: "4px solid #1890ff", paddingLeft: 8, marginTop: 24 }}>工作经历</h3>
      {data.job_exp_objs && data.job_exp_objs.length > 0 ? (
        data.job_exp_objs.map((job, idx) => (
          <div key={idx} style={{ marginBottom: 16, paddingLeft: 12 }}>
            <b>{job.job_cpy}</b>（{job.start_date || ""} - {job.end_date || ""}）<br />
            职位：{job.job_position}（{job.job_pos_type_p || ""}）<br />
            {job.job_location && <span>地点：{job.job_location}<br /></span>}
            {job.job_nature && <span>性质：{job.job_nature}<br /></span>}
            {job.job_duration && <span>时长：{job.job_duration}<br /></span>}
            <div style={{ color: "#555", marginTop: 4, whiteSpace: "pre-line" }}>{job.job_content}</div>
          </div>
        ))
      ) : (
        <div style={{ color: "#aaa", paddingLeft: 12 }}>无</div>
      )}

      {/* 技能 */}
      <h3 style={{ borderLeft: "4px solid #1890ff", paddingLeft: 8, marginTop: 24 }}>技能</h3>
      {data.skills_objs && data.skills_objs.length > 0 ? (
        <div style={{ paddingLeft: 12 }}>
          {data.skills_objs.map((skill, idx) => (
            <span key={idx} style={{ display: "inline-block", background: "#f0f5ff", color: "#1890ff", borderRadius: 4, padding: "2px 10px", margin: "0 8px 8px 0" }}>
              {skill.skills_name}
            </span>
          ))}
        </div>
      ) : (
        <div style={{ color: "#aaa", paddingLeft: 12 }}>无</div>
      )}

      {/* 其他信息 */}
      <h3 style={{ borderLeft: "4px solid #1890ff", paddingLeft: 8, marginTop: 24 }}>其他信息</h3>
      <div style={{ color: "#555", paddingLeft: 12, whiteSpace: "pre-line" }}>
        {data.cont_basic_info}
      </div>
    </div>
  );
};

export default ResumePage; 