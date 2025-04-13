import React, { useState, useRef, useEffect } from 'react';
import { Send, MoreVertical, ArrowLeft, Home, Music, Plus } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import NowPlayingCard from './chatSong';
import DefaultPng from './assets/music.png';
import { io } from 'socket.io-client';
import Review from './components/review';
const socket = io(import.meta.env.VITE_BACKEND_API);

const ChatRoom = () => {
    const [reviewModel, setIsReviewOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const roomId = localStorage.getItem('roomId');
  const [socketId, setSocketId] = useState('');
  const [isloading, setIsloading] = useState(false);
  const [otherUserName, setOtheruserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const [songs, setSongs] = useState([]);
  const [isSongListOpen, setIsSongListOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customSongChangeTrigger, setCustomSongChangeTrigger] = useState(0);
  
  let filteredSongs = songs.filter((song) =>
    song.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_MUSIC_FILE_FETCH);
        const result = await response.json();

        const formattedSongs = result.data.map((item, index) => ({
          id: item.fileId,
          title: item.embeddedMetadata?.Title || item.name,
          artist: item.embeddedMetadata?.Artist || "Unknown Artist",
          url: item.url,
          thumbnail: item.thumbnail,
          duration: `${Math.floor(item.size / 1000000)} MB`, 
          color: `from-pink-400 to-purple-400`, 
        }));

        setSongs(formattedSongs);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };
    const r=sessionStorage.getItem('review')

    fetchSongs();
    fetchCustomSongs();
    if(!r){
      setTimeout(()=>{
        setIsReviewOpen(true)
      },5000);
    }
  
  }, []);
  
  const song = location.state;
  const [Song, setSong] = useState(song);
  
  useEffect(() => {
    socket.on('connect', () => {
      setSocketId(socket.id);
    });
    const data = {
      song,
      roomId
    };
    socket.emit('songDetails', data);
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);
  
  useEffect(() => {
    if (!roomId) return;
  
    socket.emit('joinRoom', roomId);
  
    const handleReceiveMessage = ({ message, senderId, username }) => {
      if (senderId === socket.id) return;
      setOtheruserName(username);
  
      if (message.trim()) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: 'other',
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: true,
          },
        ]);
      }
    };
  
    const handleReceiveSongDetails = (song) => {
      if (song) {
        setSong(song);
      }
    };
  
    const handleAddingCustomSong = (bool) => {
      setIsloading(bool);
      console.log("bool", bool);
    };
  
    const handleCustomSongDetails = ({ formattedSong, senderId }) => {
      if (senderId === socket.id) return;
      console.log('customSong', formattedSong);
      setSongs((prevSongs) => [formattedSong, ...prevSongs]);
    };
  
    socket.on('recivemessage', handleReceiveMessage);
    socket.on('reciveSongDetails', handleReceiveSongDetails);
    socket.on('addingCustomeSong', handleAddingCustomSong);
    socket.on('customeSongDetails', handleCustomSongDetails);
  
    return () => {
      socket.off('recivemessage', handleReceiveMessage);
      socket.off('reciveSongDetails', handleReceiveSongDetails);
      socket.off('addingCustomeSong', handleAddingCustomSong);
      socket.off('customeSongDetails', handleCustomSongDetails);
    };
  }, [roomId]);  
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e) => {
    e.preventDefault();
  
    if (message.trim()) {
      const messageData = {
        message,
        roomId,
        username: localStorage.getItem('username'),
        senderId: socket.id
      };
      socket.emit('sendmessage', messageData);
      const newMessage = {
        id: chatMessages.length + 1,
        sender: 'self',
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      setChatMessages((prev) => [...prev, newMessage]);
      setMessage('');
    }
    
  };

  const handleCustomSongUpload = async (e) => {
    setIsloading(true);
    try {
      socket.emit('addingCustomeSong', {bool: true, roomId});
      const file = e.target.files[0];
      if (!file) {
        console.warn("No file selected");
        return;
      }
  
      const authRes = await fetch(import.meta.env.VITE_AUTH_API);
      const auth = await authRes.json();
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("publicKey", import.meta.env.VITE_PUBLIC_KEY);
      formData.append("signature", auth.signature);
      formData.append("expire", auth.expire);
      formData.append("token", auth.token);
      formData.append("folder", `ListenTogetherCustm${roomId}`);
     
      const res = await fetch(import.meta.env.VITE_IMGKIT_API, {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      await fetch(import.meta.env.VITE_SAVE_FOLDERS, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({FolderName: `ListenTogetherCustm${roomId}`})
      });
      
      const formattedSong = {
        id: data.fileId,
        title: data.embeddedMetadata?.title || data.name,
        artist: data.embeddedMetadata?.Artist || "Unknown Artist",
        url: data.url,
        thumbnail: data.thumbnail,
        duration: `${Math.floor(data.size/1000000)} MB`,
        color: `from-pink-400 to-purple-400`
      };      
      
      socket.emit('customeSongDetails', {formattedSong, roomId, senderId: socketId});
      setSongs([formattedSong, ...songs]);
      
      if (data) {       
        setCustomSongChangeTrigger((prev) => prev + 1);
        socket.emit('addingCustomeSong', {bool: false, roomId});
        setIsloading(false);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };
  
  const fetchCustomSongs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_TMP_MUSIC_DATA_FETCH}?folder=ListenTogetherCustm${roomId}`);
      const result = await response.json();

      const formattedSongs = result.data.map((item) => ({
        id: item.fileId,
        title: item.embeddedMetadata?.Title || item.name,
        artist: item.embeddedMetadata?.Artist || "Unknown Artist",
        url: item.url,
        thumbnail: item.thumbnail,
        duration: `${Math.floor(item.size / 1000000)} MB`,
        color: `from-pink-400 to-purple-400`,
      }));

      setSongs((prevSongs) => {
        const existingIds = new Set(prevSongs.map((song) => song.id));
        const newCustomSongs = formattedSongs.filter((song) => !existingIds.has(song.id));
        return [...newCustomSongs, ...prevSongs];
      });
    } catch (error) {
      console.error("Error fetching custom songs:", error);
    }
  };
  
  useEffect(() => {
    fetchCustomSongs();
    console.log("custom song is added");
  }, [customSongChangeTrigger]);
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
             {reviewModel&&<Review
             roomId={roomId}
              setIsReviewOpen={setIsReviewOpen}/>}

      
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button className="mr-2 p-2 rounded-full hover:bg-gray-100" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                    <Home />
                  </div>
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="ml-3">
                  <h1 className="font-semibold text-gray-800">{roomId}</h1>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 bg-white md:bg-gray-100">
        <div className="max-w-4xl mx-auto space-y-4 p-4">
          <div className="text-center">
            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
              {new Date().toLocaleDateString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'self' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] md:max-w-[60%] ${msg.sender === 'self' ? 'order-2' : 'order-1'}`}>
                {msg.sender === 'other' && (
                  <div className="flex items-center mb-1 pl-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs">
                      {otherUserName.slice(0, 1)}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">{otherUserName}</span>
                  </div>
                )}
                <div className={`p-3 rounded-2xl shadow-sm ${
                  msg.sender === 'self'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
                <div className={`flex items-center mt-1 text-xs text-gray-500 ${
                  msg.sender === 'self' ? 'justify-end pr-2' : 'justify-start pl-2'
                }`}>
                  <span>{msg.time}</span>
                  {msg.sender === 'self' && (
                    <span className="ml-2">
                      {msg.read ? 'Read' : 'Delivered'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

    <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        {Song && (
          <div className="border-b border-gray-200">
            <div className="max-w-4xl mx-auto py-2 px-4">
              <NowPlayingCard song={Song} roomID={roomId} />
            </div>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto p-4">
          <form onSubmit={handleSend} className="flex items-center">
            <button 
              type="button"
              className="p-2 rounded-full hover:bg-gray-100 text-indigo-600 transition-colors"
              onClick={() => setIsSongListOpen(!isSongListOpen)}
            >
              <Music size={24} />
            </button>

            <input
              className="flex-1 border rounded-full px-4 py-2 mx-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-white hover:shadow-md transition-shadow duration-300"
              disabled={!message.trim()}
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      {isSongListOpen && (
        <div className="fixed inset-x-0 bottom-0 bg-white max-h-[80vh] overflow-y-auto shadow-lg border-t z-50 rounded-t-2xl">
          <div className="max-w-4xl mx-auto p-4 relative">
            <button
              className="absolute top-2 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsSongListOpen(false)}
            >
              &#x2715; 
            </button>

            <div className="flex justify-center mb-4">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            <h2 className="text-lg font-semibold mb-3 text-center">Select a Song</h2>

            <input
              type="text"
              placeholder="Search songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-full px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            
            <div className="mb-4 flex justify-center">
              <label className="inline-flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-indigo-600 transition">
                <Plus size={18} />
                Upload Song
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleCustomSongUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isloading && <Skeleton />}
              
              {filteredSongs.length > 0 ? (
                filteredSongs.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition border border-gray-100 shadow-sm"
                    onClick={() => {
                      setSong(item);
                      socket.emit('songDetails', { song: item, roomId });
                      setIsSongListOpen(false);
                    }}
                  >
                    <img
                      src={item.thumbnail || DefaultPng}
                      alt={item.title}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium truncate">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.artist}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center col-span-2 text-gray-500">No songs found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;

const Skeleton = () => {
  return (
    <div className="flex items-center space-x-4 p-2 rounded-lg animate-pulse bg-white shadow-sm">
      <div className="w-12 h-12 bg-gray-300 rounded-md shimmer" />
      <div className="flex flex-col space-y-2 w-full">
        <div className="w-3/4 h-4 bg-gray-300 rounded shimmer" />
        <div className="w-1/2 h-3 bg-gray-200 rounded shimmer" />
      </div>
    </div>
  );
};
