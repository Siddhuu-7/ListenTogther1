import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FileUpload from './FileUplod';
import CreatorAccess from './CreatorAccess';
import FirstPage from './FirstPage';
import CreateRoomPage from './CreateRoom';
import Chat from './Chat';
import SongSelectionPage from './SongsSection';
import Admin from './Admin'
import pageNotFound from './PageNotFound'
export default function App() {
 
  
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<FirstPage />} />
  <Route path="/Admin" element={<Admin />} />
  <Route path="/Creator-Auth" element={<CreatorAccess />} />
  <Route path="/creator-file-upload" element={<FileUpload />} />
  <Route path="/Create-Room" element={<CreateRoomPage />} />
  <Route path="/Chat-Room" element={<Chat />} />
  <Route path="/songSelection" element={<SongSelectionPage />} />
  <Route path="*" element={<pageNotFound />} />
</Routes>

    </BrowserRouter>
  );
}
