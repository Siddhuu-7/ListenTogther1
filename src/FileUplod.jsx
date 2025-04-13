import React, { useState } from 'react';
import { Upload, X, Music, Check, AlertCircle ,ArrowLeft} from 'lucide-react';
import { replace, useNavigate } from 'react-router-dom';

const SongUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [filter, setFilter] = useState([]);
  const [isUploaded, setIsUploaded] = useState({}); 
const navigate=useNavigate()
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (newFiles) => {
    const audioFiles = Array.from(newFiles).filter(file =>
      file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|ogg|flac|m4a)$/i)
    );

    if (audioFiles.length === 0) {
      setError("Please select audio files only.");
      return;
    }

    setError(null);
    setFilter([...filter, ...audioFiles]);
    const updatedFiles = [...files, ...audioFiles];
    setFiles([...new Set(updatedFiles)]);

    audioFiles.forEach(file => {

      simulateUpload(file);
    });
  };

  const simulateUpload = (file) => {
    let progress = 0;
    setUploadProgress(prev => ({ ...prev, [file.name]: progress }));

    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
    }, 300);
   
  };

  const removeFile = (fileName) => {
    setFiles(files.filter(file => file.name !== fileName));
    setFilter(filter.filter(file => file.name !== fileName));
    setUploadProgress(prev => {
      const updated = { ...prev };
      delete updated[fileName];
      return updated;
    });
    setIsUploaded(prev => {
      const updated = { ...prev };
      delete updated[fileName];
      return updated;
    });
  };

  const handelUploadTocloud = async () => {
    setIsUploading(true);
    const successfulUploads = [];

    for (const file of filter) {
      try {
        const authRes = await fetch(import.meta.env.VITE_AUTH_API);
         const auth = await authRes.json();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);
        formData.append("publicKey", import.meta.env.VITE_PUBLIC_KEY);
        formData.append("signature", auth.signature);
        formData.append("expire", auth.expire);
        formData.append("token", auth.token);
        formData.append("folder", "ListenTogether");

        const res = await fetch(import.meta.env.VITE_IMGKIT_API, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
       
        
        

        if (data.url) {
          setIsUploaded(prev => ({ ...prev, [file.name]: true }));
          successfulUploads.push(file);
          console.log(`${file.name} uploaded`);
        } else {
          console.error("Upload failed:", data);
          alert(`Upload failed for ${file.name}`);
        }
      } catch (err) {
        console.error(`Upload error for ${file.name}:`, err);
      }
    }

    const updatedFilter = filter.filter(file => !successfulUploads.includes(file));
    setFilter(updatedFilter);

    setIsUploading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
    <div className="flex items-center mb-6">
      <button 
      onClick={()=>navigate('/Admin',{replace:true})}
      className="p-2 rounded-full hover:bg-gray-200 transition">
        <ArrowLeft size={28} className="text-gray-700" />
      </button>
      <h1 className="ml-4 text-3xl font-bold text-gray-800">Upload Your Music</h1>
    </div>
  
    <p className="text-gray-600 text-lg">
      Upload your songs to the cloud and access them anywhere, anytime.
    </p>









      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center">
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700">Drag and drop your audio files here</p>
          <p className="text-sm text-gray-500 mb-4">or</p>
          <label className="cursor-pointer px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Browse Files
            <input
              type="file"
              multiple
              accept="audio/*, video/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500 mt-2">Supports MP3, WAV, OGG, FLAC, M4A</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Uploads</h2>
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.name} className={`border rounded-lg p-4 flex items-center ${isUploaded[file.name] ? "bg-green-600" : ""}`}>
                <Music className="w-8 h-8 text-gray-400 mr-3" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">{file.name}</span>
                    <button
                      onClick={() => removeFile(file.name)}
                      className="text-gray-400 hover:text-red-500"
                      disabled={isUploading}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${uploadProgress[file.name] || 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                      <span className="flex items-center">
                        {uploadProgress[file.name] === 100 ? (
                          <>
                            <Check className="w-3 h-3 text-green-500 mr-1" />
                           {isUploaded[file.name]?`Uploded`:`Ready To Upload`}
                          </>
                        ) : (
                          `${Math.round(uploadProgress[file.name] || 0)}%`
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handelUploadTocloud}
            disabled={isUploading || filter.length === 0}
            className={`px-6 py-2 font-medium rounded-lg transition-colors ${
              isUploading || filter.length === 0
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Upload All to Cloud
          </button>
        </div>
      )}
    </div>
  );
};

export default SongUpload;
