import { useEffect, useState } from "react";
import api from "../api/client";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    api.get("/certificates/mine").then((res) => setCertificates(res.data));
  }, []);

  const download = (id) => {
    window.open(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/certificates/${id}/download`, "_blank");
  };

  return (
    <div className="grid">
      <div className="card">
        <h3>Certificates</h3>
        <div className="list">
          {certificates.map((cert) => (
            <div key={cert._id} className="list-row">
              <div>
                <h4>{cert.course?.title}</h4>
                <p>Issued {new Date(cert.issuedAt).toLocaleDateString()}</p>
              </div>
              <button className="ghost" onClick={() => download(cert._id)}>
                Download
              </button>
            </div>
          ))}
          {!certificates.length && <p>No certificates yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default Certificates;
