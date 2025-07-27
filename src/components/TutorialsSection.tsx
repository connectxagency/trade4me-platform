import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Play, 
  FileText, 
  Download, 
  Clock, 
  BookOpen, 
  Video,
  Filter,
  Search,
  X,
  Maximize2,
  Volume2,
  Pause,
  VolumeX,
  SkipBack,
  SkipForward,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Tutorial {
  id: string;
  title: string;
  description: string | null;
  type: 'video' | 'pdf';
  file_url: string;
  file_name: string;
  file_size: number | null;
  duration: number | null;
  category: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

interface VideoPlayerModalProps {
  tutorial: Tutorial | null;
  isOpen: boolean;
  onClose: () => void;
  getCategoryLabel: (category: string) => string;
  formatDuration: (seconds: number | null) => string | null;
}

interface PDFViewerModalProps {
  tutorial: Tutorial | null;
  isOpen: boolean;
  onClose: () => void;
  getCategoryLabel: (category: string) => string;
}

const PDFViewerModal: React.FC<PDFViewerModalProps> = ({ tutorial, isOpen, onClose, getCategoryLabel }) => {
  const [pdfSrc, setPdfSrc] = useState<string>('');
  const [pdfError, setPdfError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setPdfError('');
      setCurrentPage(1);
      setZoom(100);
      setRotation(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (tutorial && isOpen && tutorial.type === 'pdf') {
      console.log('Loading PDF tutorial:', tutorial.title, 'URL:', tutorial.file_url);
      
      // Handle different types of file sources
      if (tutorial.file_url.startsWith('data:')) {
        // Base64 encoded file - use directly
        setPdfSrc(tutorial.file_url);
        console.log('Using base64 data URL for PDF');
      } else if (tutorial.file_url.startsWith('blob:')) {
        // Blob URL - use directly
        setPdfSrc(tutorial.file_url);
        console.log('Using blob URL for PDF');
      } else if (tutorial.file_url.startsWith('http://') || tutorial.file_url.startsWith('https://')) {
        // External URL - use directly
        setPdfSrc(tutorial.file_url);
        console.log('Using external URL for PDF');
      } else {
        // Check if file exists in localStorage first with multiple possible keys
        let storedFile = localStorage.getItem(`tutorial_file_${tutorial.file_name}`);
        
        // Try alternative storage keys if the first one doesn't work
        if (!storedFile) {
          // Try with the original filename from the URL
          const urlFileName = tutorial.file_url.split('/').pop();
          if (urlFileName) {
            storedFile = localStorage.getItem(`tutorial_file_${urlFileName}`);
          }
        }
        
        if (!storedFile) {
          // Try with just the tutorial ID
          storedFile = localStorage.getItem(`tutorial_${tutorial.id}`);
        }
        
        if (storedFile && storedFile.startsWith('data:')) {
          setPdfSrc(storedFile);
          console.log('Using localStorage file with key:', tutorial.file_name);
        } else {
          // File not found in localStorage and not a valid URL
          console.log('PDF file not found in localStorage or invalid format:', tutorial.file_url);
          console.log('Checked keys:', [
            `tutorial_file_${tutorial.file_name}`,
            `tutorial_file_${tutorial.file_url.split('/').pop()}`,
            `tutorial_${tutorial.id}`
          ]);
          setPdfError(`PDF file not available: ${tutorial.file_name}. The file may need to be re-uploaded by an administrator.`);
          setPdfSrc(''); // Clear PDF source to prevent loading attempts
        }
      }
    }
  }, [tutorial, isOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const resetView = () => {
    setZoom(100);
    setRotation(0);
    setCurrentPage(1);
  };

  if (!isOpen || !tutorial || tutorial.type !== 'pdf') return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
    >
      <div className={`bg-gray-800 rounded-xl w-full max-h-[90vh] overflow-hidden ${
        isFullscreen ? 'max-w-none h-full' : 'max-w-6xl'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b border-gray-700 ${
          isFullscreen ? 'absolute top-0 left-0 right-0 z-10 bg-gray-800/90' : ''
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{tutorial.title}</h3>
              {tutorial.description && (
                <p className="text-sm text-gray-400">{tutorial.description}</p>
              )}
            </div>
          </div>
          
          {/* PDF Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-400 min-w-[60px] text-center">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleRotate}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Rotate"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className={`relative bg-gray-900 ${isFullscreen ? 'h-full pt-16' : 'h-[70vh]'}`}>
          {pdfError ? (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-400" />
                </div>
                <h4 className="text-white text-lg font-semibold mb-2">PDF Load Error</h4>
                <p className="text-gray-400 mb-4">{pdfError}</p>
                <div className="text-sm text-gray-500">
                  <p>File: {tutorial.file_name}</p>
                  <p>Source: {pdfSrc ? 'Available' : 'Not found'}</p>
                  <p>Type: {tutorial.type}</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 mb-4">
                  <p className="text-yellow-300 text-sm">
                    <strong>Troubleshooting:</strong> This PDF file was uploaded but cannot be displayed. 
                    The administrator may need to re-upload the file in a compatible format.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setPdfError('');
                    // Try to reload the PDF with different strategies
                    console.log('Retrying PDF load...');
                    
                    // Try multiple localStorage keys
                    const possibleKeys = [
                      `tutorial_file_${tutorial.file_name}`,
                      `tutorial_file_${tutorial.file_url.split('/').pop()}`,
                      `tutorial_${tutorial.id}`
                    ];
                    
                    let foundFile = null;
                    for (const key of possibleKeys) {
                      const stored = localStorage.getItem(key);
                      if (stored && stored.startsWith('data:')) {
                        foundFile = stored;
                        console.log('Found file with key:', key);
                        break;
                      }
                    }
                    
                    if (foundFile) {
                      setPdfSrc(foundFile);
                    } else if (tutorial.file_url.startsWith('data:') || 
                               tutorial.file_url.startsWith('blob:') || 
                               tutorial.file_url.startsWith('http://') || 
                               tutorial.file_url.startsWith('https://')) {
                      setPdfSrc(tutorial.file_url);
                    } else {
                      setPdfError(`PDF file not available: ${tutorial.file_name}. Please contact an administrator to re-upload this tutorial.`);
                    }
                  }}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
                <button
                  onClick={onClose}
                  className="mt-4 ml-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : pdfSrc ? (
            <div className="w-full h-full flex items-center justify-center overflow-auto">
              <div className="w-full h-full overflow-auto bg-gray-900 p-4">
                <div 
                  className="bg-white shadow-2xl mx-auto"
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.3s ease',
                    width: isFullscreen ? `${(100 * 100) / zoom}vw` : `${(210 * 100) / zoom}mm`,
                    height: isFullscreen ? `${(100 * 100) / zoom}vh` : `${(297 * 100) / zoom}mm`,
                    minWidth: `${(800 * 100) / zoom}px`,
                    minHeight: `${(600 * 100) / zoom}px`
                  }}
                >
                  <iframe
                    ref={iframeRef}
                    src={`${pdfSrc}#toolbar=0&navpanes=0&scrollbar=1&zoom=100`}
                    className="w-full h-full border-0"
                    style={{
                      width: '100%',
                      height: '100%'
                    }}
                    title={tutorial.title}
                    onLoad={() => {
                      console.log('PDF loaded successfully');
                      setPdfError('');
                    }}
                    onError={() => {
                      console.error('PDF loading error');
                      setPdfError(`Failed to load PDF: ${tutorial.file_name}. The file may be corrupted or in an unsupported format.`);
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading PDF...</p>
              </div>
            </div>
          )}
        </div>

        {/* PDF Info Panel (only visible when not fullscreen) */}
        {!isFullscreen && !pdfError && (
          <div className="p-4 bg-gray-700/30 border-t border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-gray-400">
                <span>Category: {getCategoryLabel(tutorial.category)}</span>
                <span>File: {tutorial.file_name}</span>
                {tutorial.file_size && (
                  <span>Size: {(tutorial.file_size / (1024 * 1024)).toFixed(1)} MB</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                  PDF Document
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ tutorial, isOpen, onClose, getCategoryLabel, formatDuration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [videoError, setVideoError] = useState<string>('');
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      setVideoError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (tutorial && isOpen && tutorial.type === 'video') {
      console.log('Loading tutorial:', tutorial.title, 'URL:', tutorial.file_url);
      
      // Handle different types of file sources
      if (tutorial.file_url.startsWith('data:')) {
        // Base64 encoded file - use directly
        setVideoSrc(tutorial.file_url);
        console.log('Using base64 data URL');
      } else if (tutorial.file_url.startsWith('blob:')) {
        // Blob URL - use directly
        setVideoSrc(tutorial.file_url);
        console.log('Using blob URL');
      } else if (tutorial.file_url.startsWith('http://') || tutorial.file_url.startsWith('https://')) {
        // External URL - use directly
        setVideoSrc(tutorial.file_url);
        console.log('Using external URL');
      } else {
        // Check if file exists in localStorage first with multiple possible keys
        let storedFile = localStorage.getItem(`tutorial_file_${tutorial.file_name}`);
        
        // Try alternative storage keys if the first one doesn't work
        if (!storedFile) {
          // Try with the original filename from the URL
          const urlFileName = tutorial.file_url.split('/').pop();
          if (urlFileName) {
            storedFile = localStorage.getItem(`tutorial_file_${urlFileName}`);
          }
        }
        
        if (!storedFile) {
          // Try with just the tutorial ID
          storedFile = localStorage.getItem(`tutorial_${tutorial.id}`);
        }
        
        if (storedFile && storedFile.startsWith('data:')) {
          setVideoSrc(storedFile);
          console.log('Using localStorage file with key:', tutorial.file_name);
        } else {
          // File not found in localStorage and not a valid URL
          console.log('File not found in localStorage or invalid format:', tutorial.file_url);
          console.log('Checked keys:', [
            `tutorial_file_${tutorial.file_name}`,
            `tutorial_file_${tutorial.file_url.split('/').pop()}`,
            `tutorial_${tutorial.id}`
          ]);
          setVideoError(`Video file not available: ${tutorial.file_name}. The file may need to be re-uploaded by an administrator.`);
          setVideoSrc(''); // Clear video source to prevent loading attempts
        }
      }
    }
  }, [tutorial, isOpen]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !tutorial || tutorial.type !== 'video') return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
    >
      <div className={`bg-gray-800 rounded-xl w-full max-h-[90vh] overflow-hidden ${
        isFullscreen ? 'max-w-none h-full' : 'max-w-4xl'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b border-gray-700 ${
          isFullscreen ? 'absolute top-0 left-0 right-0 z-10 bg-gray-800/90' : ''
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{tutorial.title}</h3>
              {tutorial.description && (
                <p className="text-sm text-gray-400">{tutorial.description}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className={`relative bg-black ${isFullscreen ? 'h-full' : ''}`}>
          <div className={`relative ${isFullscreen ? 'h-full' : 'aspect-video'}`}>
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onError={(e) => {
                console.error('Video loading error:', e);
                console.error('Video source:', videoSrc);
                console.error('Tutorial data:', tutorial);
                if (!videoSrc || videoSrc === '') {
                  setVideoError(`Video file not available: ${tutorial.file_name}. Please contact an administrator to re-upload this tutorial.`);
                } else {
                  setVideoError(`Failed to load video: ${tutorial.file_name}. The file may be corrupted, in an unsupported format, or needs to be re-uploaded.`);
                }
              }}
              onLoadStart={() => console.log('Video loading started')}
              onCanPlay={() => console.log('Video can start playing')}
              onLoadedData={() => console.log('Video data loaded successfully')}
            >
              {/* Multiple source formats for better compatibility */}
              {videoSrc && <source src={videoSrc} type="video/mp4" />}
              {videoSrc && <source src={videoSrc} type="video/quicktime" />}
              {videoSrc && <source src={videoSrc} type="video/webm" />}
              {videoSrc && <source src={videoSrc} type="video/avi" />}
              Your browser does not support the video tag.
            </video>

            {/* Error Message Overlay */}
            {videoError && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-400" />
                  </div>
                  <h4 className="text-white text-lg font-semibold mb-2">Video Load Error</h4>
                  <p className="text-gray-400 mb-4">{videoError}</p>
                  <div className="text-sm text-gray-500">
                    <p>File: {tutorial.file_name}</p>
                    <p>Source: {videoSrc ? 'Available' : 'Not found'}</p>
                    <p>Type: {tutorial.type}</p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 mb-4">
                    <p className="text-yellow-300 text-sm">
                      <strong>Troubleshooting:</strong> This video file was uploaded but cannot be played. 
                      The administrator may need to re-upload the file in a compatible format (MP4 recommended).
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setVideoError('');
                      // Try to reload the video with different strategies
                      console.log('Retrying video load...');
                      
                      // Try multiple localStorage keys
                      const possibleKeys = [
                        `tutorial_file_${tutorial.file_name}`,
                        `tutorial_file_${tutorial.file_url.split('/').pop()}`,
                        `tutorial_${tutorial.id}`
                      ];
                      
                      let foundFile = null;
                      for (const key of possibleKeys) {
                        const stored = localStorage.getItem(key);
                        if (stored && stored.startsWith('data:')) {
                          foundFile = stored;
                          console.log('Found file with key:', key);
                          break;
                        }
                      }
                      
                      if (foundFile) {
                        setVideoSrc(foundFile);
                        if (videoRef.current) {
                          videoRef.current.load();
                        }
                      } else if (tutorial.file_url.startsWith('data:') || 
                                 tutorial.file_url.startsWith('blob:') || 
                                 tutorial.file_url.startsWith('http://') || 
                                 tutorial.file_url.startsWith('https://')) {
                        setVideoSrc(tutorial.file_url);
                        if (videoRef.current) {
                          videoRef.current.load();
                        }
                      } else {
                        setVideoError(`Video file not available: ${tutorial.file_name}. Please contact an administrator to re-upload this tutorial.`);
                      }
                    }}
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Retry
                  </button>
                  <button
                    onClick={onClose}
                    className="mt-4 ml-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Video Controls Overlay */}
            <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 ${videoError ? 'hidden' : ''}`}>
              {/* Progress Bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`
                  }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    )}
                  </button>

                  {/* Skip Buttons */}
                  <button
                    onClick={() => skip(-10)}
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                  >
                    <SkipBack className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => skip(10)}
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                  >
                    <SkipForward className="w-4 h-4 text-white" />
                  </button>

                  {/* Volume Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-white" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-white" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Time Display */}
                  <div className="text-white text-sm font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Fullscreen Toggle */}
                  <button
                    onClick={toggleFullscreen}
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                  >
                    {isFullscreen ? (
                      <Minimize className="w-4 h-4 text-white" />
                    ) : (
                      <Maximize className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info Panel (only visible when not fullscreen) */}
        {!isFullscreen && tutorial.type === 'video' && (
          <div className="p-4 bg-gray-700/30 border-t border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-gray-400">
                <span>Category: {getCategoryLabel(tutorial.category)}</span>
                <span>File: {tutorial.file_name}</span>
                {tutorial.file_size && (
                  <span>Size: {(tutorial.file_size / (1024 * 1024)).toFixed(1)} MB</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                  HD Quality
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

interface TutorialsSectionProps {
  cachedData?: Tutorial[];
}

const TutorialsSection: React.FC<TutorialsSectionProps> = ({ cachedData = [] }) => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 6; // Load 6 items at a time

  // Initialize with cached data if available
  useEffect(() => {
    if (cachedData && cachedData.length >= 0) {
      // Show data immediately (including empty arrays)
      setTutorials(cachedData);
      setHasLoaded(true);
      setLoading(false);
      setHasMore(cachedData.length > ITEMS_PER_PAGE);
    } else if (cachedData === undefined) {
      // Only fetch if no cached data is provided
      fetchTutorials(1, false);
    }
  }, [cachedData]);

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchTutorials = useCallback(async (page = 1, append = false) => {
    if (hasLoaded && page === 1) return; // Prevent multiple fetches for first page
    
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Calculate offset for pagination
      const offset = (page - 1) * ITEMS_PER_PAGE;
      
      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
        .order('created_at')
        .range(offset, offset + ITEMS_PER_PAGE - 1);

      if (error) throw error;
      
      // Process tutorials to ensure proper file URLs
      const processedTutorials = (data || []).map(tutorial => {
        // Check if we have a stored file in localStorage
        const storedFile = localStorage.getItem(`tutorial_file_${tutorial.file_name}`);
        if (storedFile && !tutorial.file_url.startsWith('data:')) {
          return { ...tutorial, file_url: storedFile };
        }
        return tutorial;
      });
      
      if (append) {
        setTutorials(prev => [...prev, ...processedTutorials]);
      } else {
        setTutorials(processedTutorials);
      }
      
      // Check if there are more items
      setHasMore(processedTutorials.length === ITEMS_PER_PAGE);
      
      if (page === 1) {
        setHasLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching tutorials:', error);
      // No fallback data - just set empty array
      if (page === 1) {
        setTutorials([]);
        setHasMore(false);
        setHasLoaded(true);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [hasLoaded]);

  // Load more function
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchTutorials(nextPage, true);
    }
  }, [loadingMore, hasMore, currentPage, fetchTutorials]);

  // Reset pagination when filters change
  useEffect(() => {
    // Only reset if we don't have cached data
    if (!cachedData || cachedData.length === 0) {
      setCurrentPage(1);
      setHasMore(true);
      setTutorials([]);
      setHasLoaded(false);
      fetchTutorials(1, false);
    }
  }, [selectedCategory, selectedType, searchTerm]);

  // Memoize utility functions
  const formatFileSize = useCallback((bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  }, []);

  const formatDuration = useCallback((seconds: number | null) => {
    if (!seconds) return null;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const getCategories = useMemo(() => {
    const categories = [...new Set(tutorials.map(t => t.category))];
    return categories.sort();
  }, [tutorials]);

  const getCategoryLabel = useCallback((category: string) => {
    const labels: Record<string, string> = {
      basics: 'Basics',
      earnings: 'Earnings',
      referrals: 'Referrals',
      marketing: 'Marketing',
      compliance: 'Compliance',
      general: 'General'
    };
    return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
  }, []);

  // Memoize filtered tutorials to prevent unnecessary re-computations
  const filteredTutorials = useMemo(() => {
    return tutorials.filter(tutorial => {
      const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
      const matchesType = selectedType === 'all' || tutorial.type === selectedType;
      const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tutorial.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesType && matchesSearch;
    });
  }, [tutorials, selectedCategory, selectedType, searchTerm]);

  const handleTutorialClick = useCallback((tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    if (tutorial.type === 'video') {
      setIsPlayerOpen(true);
    } else if (tutorial.type === 'pdf') {
      setIsPDFViewerOpen(true);
    }
  }, []);

  const closePlayer = useCallback(() => {
    setIsPlayerOpen(false);
    setSelectedTutorial(null);
  }, []);

  const closePDFViewer = useCallback(() => {
    setIsPDFViewerOpen(false);
    setSelectedTutorial(null);
  }, []);

  if (loading && tutorials.length === 0 && !hasLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Video Tutorials & PDF Guides</h3>
          <p className="text-gray-400 text-sm">Learn how to maximize your partnership with Trade4me</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-700/30 rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tutorials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {getCategories.map(category => (
                <option key={category} value={category}>
                  {getCategoryLabel(category)}
                </option>
              ))}
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="video">Videos</option>
              <option value="pdf">PDFs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutorials.map((tutorial) => (
          <div key={tutorial.id} className="bg-gray-700/30 rounded-lg p-6 hover:bg-gray-700/50 transition-colors h-full flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  tutorial.type === 'video' 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-green-500/20 text-green-400'
                }`}>
                  {tutorial.type === 'video' ? (
                    <Video className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tutorial.type === 'video'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-green-500/20 text-green-400 border border-green-500/30'
                  }`}>
                    {tutorial.type.toUpperCase()}
                  </span>
                </div>
              </div>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                {getCategoryLabel(tutorial.category)}
              </span>
            </div>

            <h4 className="text-lg font-semibold text-white mb-3 line-clamp-2 min-h-[3.5rem]">{tutorial.title}</h4>
            
            {tutorial.description && (
              <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow min-h-[4.5rem]">{tutorial.description}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-6 mt-auto">
              {tutorial.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(tutorial.duration)}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {formatFileSize(tutorial.file_size)}
              </div>
            </div>

            <button
              onClick={() => handleTutorialClick(tutorial)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors mt-auto ${
                tutorial.type === 'video'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {tutorial.type === 'video' ? (
                <>
                  <Play className="w-4 h-4" />
                  Watch Video
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  View PDF
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading...
              </>
            ) : (
              'Load More Tutorials'
            )}
          </button>
        </div>
      )}

      {filteredTutorials.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-400 mb-2">No Tutorials Found</h4>
          <p className="text-gray-500">
            {searchTerm || selectedCategory !== 'all' || selectedType !== 'all'
              ? 'Try adjusting your filters.'
              : 'No tutorials available yet.'
            }
          </p>
        </div>
      )}

      {/* Video Player Modal */}
      <VideoPlayerModal
        tutorial={selectedTutorial}
        isOpen={isPlayerOpen}
        onClose={closePlayer}
        getCategoryLabel={getCategoryLabel}
        formatDuration={formatDuration}
      />

      {/* PDF Viewer Modal */}
      <PDFViewerModal
        tutorial={selectedTutorial}
        isOpen={isPDFViewerOpen}
        onClose={closePDFViewer}
        getCategoryLabel={getCategoryLabel}
      />
    </div>
  );
};

export default TutorialsSection;