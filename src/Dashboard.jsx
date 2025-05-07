import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { auth, firestore, storage } from './firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [folderName, setFolderName] = useState('');
  const [file, setFile] = useState(null);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Track time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Watch for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch data after user is available
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const folderSnap = await getDocs(collection(firestore, 'users', user.uid, 'folders'));
      const folderList = folderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFolders(folderList);

      const fileSnap = await getDocs(collection(firestore, 'users', user.uid, 'files'));
      const fileList = fileSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFiles(fileList);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;
    try {
      await addDoc(collection(firestore, 'users', user.uid, 'folders'), { name: folderName });
      setFolderName('');
      fetchData();
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder: ' + error.message);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file before uploading!');
      return;
    }

    try {
      console.log('Uploading file:', file.name);
      const fileRef = ref(storage, `users/${user.uid}/files/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      console.log('Download URL:', url);

      await addDoc(collection(firestore, 'users', user.uid, 'files'), {
        name: file.name,
        url,
      });

      alert('File uploaded successfully ✅');
      setFile(null);
      fetchData();
    } catch (error) {
      console.error('Error during file upload:', error);
      alert('Upload failed: ' + error.message);
    }
  };

  return (
    <div className="dashboard">
      {/* LEFT PANEL */}
      <div className="left-widgets">
        <div className="clock">
          🕒
          <p>{currentTime.toLocaleTimeString()}</p>
        </div>
        <div className="calendar">
          📅
          <p>{currentTime.toDateString()}</p>
        </div>
      </div>

      {/* CENTER MAIN CONTENT */}
      <div className="main-content">
        <h2>📁 Create New Folder / Upload Files</h2>
        <input
          type="text"
          placeholder="Folder name..."
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleCreateFolder}>Create Folder</button>
        <button onClick={handleFileUpload}>Upload File</button>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="file-sidebar">
        <h3>📂 My Folders & Files</h3>
        <ul>
          {folders.map(folder => (
            <li key={folder.id}>📁 {folder.name}</li>
          ))}
          {files.map(file => (
            <li key={file.id}>📄 <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a></li>
          ))}
        </ul>
      </div>

      {/* AI BOT */}
      <div className="ai-bot">
        <img
          src={user?.photoURL || '/default-avatar.png'}
          alt="User avatar"
          className="bot-avatar"
        />
        <p>Hi {user?.displayName || 'Student'}! How can I help you today?</p>
      </div>
    </div>
  );
};

export default Dashboard;
