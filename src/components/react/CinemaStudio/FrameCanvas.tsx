import { useState, useCallback } from 'react';
import { useCinemaStore } from './cinemaStore';

interface FrameCanvasProps {
  type: 'start' | 'end';
}

export default function FrameCanvas({ type }: FrameCanvasProps) {
  const { currentShot, setStartFrame, setEndFrame } = useCinemaStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [showPromptInput, setShowPromptInput] = useState(false);

  const frameUrl = type === 'start' ? currentShot.startFrame : currentShot.endFrame;
  const setFrame = type === 'start' ? setStartFrame : setEndFrame;

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    // Handle file drop
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // In production, upload to server first
        setFrame(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      return;
    }

    // Handle URL drop
    const url = e.dataTransfer.getData('text/plain');
    if (url && (url.startsWith('http') || url.startsWith('data:'))) {
      setFrame(url);
    }
  }, [setFrame]);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setFrame(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }, [setFrame]);

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/universal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'image-video',
          prompt: prompt,
          aspect_ratio: '16:9',
          resolution: '2K'
        })
      });

      const data = await response.json();
      if (data.image_url) {
        setFrame(data.image_url);
        setShowPromptInput(false);
        setPrompt('');
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="frame-canvas">
      {/* Label */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-mono uppercase tracking-wider ${
          type === 'start' ? 'text-teal-400' : 'text-orange-400'
        }`}>
          {type === 'start' ? 'Start Frame' : 'End Frame'}
          {type === 'end' && <span className="text-gray-500 ml-1">(optional)</span>}
        </span>
        {frameUrl && (
          <button
            onClick={() => setFrame(null)}
            className="text-xs text-gray-500 hover:text-red-400"
          >
            Clear
          </button>
        )}
      </div>

      {/* Canvas Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        className={`
          relative aspect-video rounded-lg border-2 border-dashed transition-all overflow-hidden
          ${isDragging
            ? 'border-teal-400 bg-teal-500/10'
            : frameUrl
              ? 'border-gray-700'
              : 'border-gray-600 hover:border-gray-500'
          }
          ${!frameUrl ? 'cursor-pointer' : ''}
        `}
        onClick={() => !frameUrl && setShowPromptInput(true)}
      >
        {frameUrl ? (
          // Show frame
          <img
            src={frameUrl}
            alt={`${type} frame`}
            className="w-full h-full object-cover"
          />
        ) : (
          // Drop zone
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            {isDragging ? (
              <>
                <svg className="w-10 h-10 mb-2 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-teal-400">Drop image here</span>
              </>
            ) : (
              <>
                <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">Drop image, paste URL, or click to generate</span>
              </>
            )}
          </div>
        )}

        {/* Frame number indicator */}
        <div className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          type === 'start' ? 'bg-teal-500 text-black' : 'bg-orange-500 text-black'
        }`}>
          {type === 'start' ? '1' : '2'}
        </div>
      </div>

      {/* Generate Prompt Input */}
      {showPromptInput && !frameUrl && (
        <div className="mt-3 space-y-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the scene to generate..."
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-sm text-white placeholder-gray-500 resize-none focus:border-teal-500 focus:outline-none"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={generateImage}
              disabled={isGenerating || !prompt.trim()}
              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-all ${
                isGenerating
                  ? 'bg-gray-700 text-gray-400 cursor-wait'
                  : 'bg-teal-500 text-black hover:bg-teal-400'
              }`}
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
            <button
              onClick={() => setShowPromptInput(false)}
              className="py-2 px-3 rounded text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* URL paste input */}
      {!frameUrl && !showPromptInput && (
        <input
          type="text"
          placeholder="Or paste image URL..."
          className="mt-2 w-full p-2 bg-gray-900/50 border border-gray-700 rounded text-xs text-white placeholder-gray-600 focus:border-teal-500 focus:outline-none"
          onPaste={(e) => {
            const url = e.clipboardData.getData('text');
            if (url.startsWith('http')) {
              setFrame(url);
            }
          }}
          onChange={(e) => {
            const url = e.target.value;
            if (url.startsWith('http')) {
              setFrame(url);
              e.target.value = '';
            }
          }}
        />
      )}
    </div>
  );
}
