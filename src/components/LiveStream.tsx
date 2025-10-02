import React, { useState, useEffect, useRef } from 'react';
import type { Screen } from '../App';
import { ArrowLeft, Camera, Wifi, WifiOff } from 'lucide-react';

interface LiveStreamProps {
  eventId: string;
  eventName: string;
  navigate: (screen: Screen) => void;
}

export function LiveStream({ eventId, eventName, navigate }: LiveStreamProps) {
  const [streamStatus, setStreamStatus] = useState<'loading' | 'live' | 'offline' | 'ended'>('loading');
  const [streamInfo, setStreamInfo] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if there's an active live stream
    const checkLiveStream = () => {
      try {
        const stored = localStorage.getItem(`zhevents_live_stream_${eventId}`);
        if (stored) {
          const info = JSON.parse(stored);
          setStreamInfo(info);
          
          if (info.activated) {
            setStreamStatus('live');
            
            // In a real implementation, you would connect to the actual stream
            // For now, we'll simulate a live stream status
            setTimeout(() => {
              // Simulate checking if stream is still active
              const currentStored = localStorage.getItem(`zhevents_live_stream_${eventId}`);
              if (currentStored) {
                const currentInfo = JSON.parse(currentStored);
                if (currentInfo.activated) {
                  // Stream is still active
                  console.log('Stream is live');
                } else {
                  setStreamStatus('ended');
                }
              } else {
                setStreamStatus('offline');
              }
            }, 2000);
          } else {
            setStreamStatus('ended');
          }
        } else {
          setStreamStatus('offline');
        }
      } catch (error) {
        console.error('Error checking live stream:', error);
        setStreamStatus('offline');
      }
    };

    checkLiveStream();

    // Check for stream updates every 5 seconds
    const interval = setInterval(checkLiveStream, 5000);

    return () => clearInterval(interval);
  }, [eventId]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTimeSinceStart = (startTime: number) => {
    const now = Date.now();
    const elapsed = now - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s ago`;
    }
    return `${seconds}s ago`;
  };

  return (
    <div className="w-full min-h-screen bg-black text-white p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => navigate('eventDetail')}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-white truncate">{eventName}</h1>
          <p className="text-sm text-gray-400">Live Stream</p>
        </div>
      </div>

      {/* Stream Content */}
      <div className="max-w-md mx-auto">
        {streamStatus === 'loading' && (
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-300">Checking for live stream...</p>
          </div>
        )}

        {streamStatus === 'live' && (
          <div className="space-y-4">
            {/* Live Stream Status */}
            <div className="bg-red-600 rounded-lg p-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Wifi size={16} />
                  <span className="font-semibold">LIVE</span>
                </div>
                <p className="text-sm opacity-90">
                  Started {streamInfo && getTimeSinceStart(streamInfo.timestamp)}
                </p>
              </div>
            </div>

            {/* Stream Video Area */}
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
              {/* Simulated Live Stream */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-20"></div>
              <div className="text-center z-10">
                <Camera size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-300 mb-2">Live Stream Active</p>
                <p className="text-sm text-gray-400">
                  🎥 Organizer is broadcasting live
                </p>
              </div>
              
              {/* Live Indicator */}
              <div className="absolute top-4 left-4 bg-red-600 px-2 py-1 rounded text-sm font-semibold flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                LIVE
              </div>
              
              {/* Viewer Count (Mock) */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
                👁 {Math.floor(Math.random() * 50) + 10} watching
              </div>
            </div>

            {/* Stream Info */}
            {streamInfo && (
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Stream Information</h3>
                <div className="space-y-1 text-sm text-gray-300">
                  <p>📡 Broadcaster: Event Organizer</p>
                  <p>⏰ Started: {formatTime(streamInfo.timestamp)}</p>
                  <p>🎯 Event: {eventName}</p>
                </div>
              </div>
            )}

            {/* Connection Quality */}
            <div className="bg-gray-900 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi size={16} className="text-green-400" />
                <span className="text-sm">Connection: Good</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-4 bg-green-400 rounded-sm"></div>
                <div className="w-2 h-4 bg-green-400 rounded-sm"></div>
                <div className="w-2 h-4 bg-green-400 rounded-sm"></div>
                <div className="w-2 h-4 bg-yellow-400 rounded-sm"></div>
                <div className="w-2 h-4 bg-gray-600 rounded-sm"></div>
              </div>
            </div>
          </div>
        )}

        {streamStatus === 'offline' && (
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <WifiOff size={48} className="mx-auto mb-4 text-gray-500" />
            <h2 className="text-xl font-semibold mb-2">Stream Offline</h2>
            <p className="text-gray-400 mb-4">
              The organizer hasn't started the live stream yet.
            </p>
            <div className="text-sm text-gray-500">
              <p>• Live streaming will begin when the organizer activates it</p>
              <p>• Check back later or contact the organizer</p>
            </div>
          </div>
        )}

        {streamStatus === 'ended' && (
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <Camera size={48} className="mx-auto mb-4 text-gray-500" />
            <h2 className="text-xl font-semibold mb-2">Stream Ended</h2>
            <p className="text-gray-400 mb-4">
              The live stream has ended.
            </p>
            {streamInfo && (
              <div className="text-sm text-gray-500">
                <p>Started: {formatTime(streamInfo.timestamp)}</p>
                <p>Broadcaster: Event Organizer</p>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-sm">About Live Streaming</h3>
          <div className="text-xs text-gray-400 space-y-1">
            <p>• Live streams are broadcast by event organizers</p>
            <p>• You'll see real-time footage when available</p>
            <p>• Stream quality depends on organizer's connection</p>
            <p>• Refresh if you experience connection issues</p>
          </div>
        </div>
      </div>
    </div>
  );
}