import React, { useEffect, useRef, useState } from 'react';
import { Search, Play, Plus,Pause } from 'lucide-react';
import Modal from './selctedSongPopUp'
import { useNavigate, useParams } from 'react-router-dom';
import Songs from './songs';

const SongSelectionPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isloading,setisloading]=useState(false)
const roomId=localStorage.getItem('roomId')
const [songs,setSongs]=useState([])
useEffect(() => {
  const fetchSongs = async () => {
    try {
      setisloading(true)
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
      setisloading(false)
      setSelectedSong(formattedSongs[0]); 
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  fetchSongs();
}, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const navigate=useNavigate();
  const [isPlaying, setIsPlaying] = useState(false); 
  
const audioRef=useRef(null)
const toggleAudio = () => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    }
};
const setSong=(song)=>{
setSelectedSong(song)
}
const setmodalopen=(bool)=>{
    setIsModalOpen(bool)
}
 
  const [selectedSong, setSelectedSong] = useState(songs[0]);

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-8">
  <div className="flex items-center space-x-4">
    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
      <div className="h-2 w-2 bg-white rounded-full"></div>
    </div>
    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Listen Together</h1>
  </div>

  <div className="flex-1 flex justify-center">
    <button
      onClick={() => navigate(`/Chat-Room`)}
      className="px-6 py-2 bg-indigo-500 text-white rounded-full shadow-md hover:bg-indigo-600 transition-all duration-300"
    >
      🎧 Listen Room
    </button>
  </div>

  <button className="p-2 rounded-full hover:bg-white hover:bg-opacity-50 transition-colors">
    <Plus size={24} />
  </button>
</header>

        
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-indigo-500" />
          </div>
          <input
            type="text"
            className="bg-white w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-md"
            placeholder="Search songs, artists, or albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="mb-8">
  <h2 className="text-xl font-bold mb-4 text-gray-800">Featured Songs</h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
   {isloading?Array.from({length:10}).map((_,i)=><Skeleton key={i}/>): filteredSongs?.slice(0,10).map((song) => (
      <Songs key={song.id}
       setSong={setSong}
     song={song}
     roomId={roomId}
      setmodalopen={setmodalopen}
      current_song_id={selectedSong.id} 
      />
    ))}
  </div>
</div>

        <div >
          <h2 className="text-xl font-bold mb-4 text-gray-800">Most Played</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSongs.slice(0, 4).map((song) => (
              <div 
                key={`recent-${song.id}`}
                className="flex items-center bg-white bg-opacity-80 rounded-lg p-3 hover:bg-white transition-colors shadow-sm hover:shadow-md"
              >
                <div className={`h-12 w-12 rounded-md bg-gradient-to-br ${song.color} mr-3 flex-shrink-0`}></div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold truncate text-gray-800">{song.title}</h3>
                  <p className="text-gray-600 text-sm truncate">{song.artist}</p>
                </div>
                <div className="flex items-center ml-3">
                  <span className="text-gray-500 text-xs mr-3 hidden sm:block">{song.duration}</span>
                  <button className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center transition-colors shadow-sm hover:shadow"
                  >
                    <Play className="h-4 w-4 ml-0.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
       
      {selectedSong&&  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full py-2 px-4 shadow-lg flex items-center">
          <div className="h-8 w-8 rounded-full bg-white text-indigo-600 flex items-center justify-center mr-3">
            <button onClick={toggleAudio}>
{isPlaying?<Pause className="h-4 w-4 ml-0.5" fill="currentColor"/>:<Play className="h-4 w-4 ml-0.5" fill="currentColor"/>
}
            </button>
            <audio src={selectedSong.url}  ref={audioRef}/>
          </div>
          <div className="mr-3">
            <p className="font-semibold text-sm text-white">{selectedSong.title}</p>
            <p className="text-xs text-indigo-100">{selectedSong.artist}</p>
          </div>
          <div className="flex items-center">
            <div className="w-16 h-1 bg-indigo-200 bg-opacity-50 rounded-full">
              <div className="w-3/4 h-full bg-white rounded-full"></div>
            </div>
          </div>
        </div>}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  {selectedSong && (
    <div className="text-center px-4 py-6">
      <h2 className="text-2xl font-bold mb-2 text-indigo-700">{selectedSong.title}</h2>
      
      
      <div className={`h-40 w-full rounded-lg bg-gradient-to-br ${selectedSong.color} mb-6`}></div>

      <p className="text-gray-700 mb-4">How would you like to enjoy this song?</p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
          onClick={() => {
            toggleAudio();
            setIsModalOpen(false);
          }}
        >
          🎵 Play Now
        </button>
        <button
          className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
          onClick={() => {
            setIsModalOpen(false);
            navigate(`/Chat-Room`, { state: selectedSong })
        }}
        >
          🤝 Listen Together
        </button>
      </div>
    </div>
  )}
</Modal>


    </div>
  );
};

export default SongSelectionPage;
 const Skeleton=()=>{
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
      <div className="h-48 w-full bg-gray-200"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        <div className="flex justify-between mt-3">
          <div className="h-3 w-12 bg-gray-300 rounded"></div>
          <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
 }