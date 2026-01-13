import React, { useState, useRef, useEffect } from 'react';
import { useAI2Store } from './ai2Store';

// Mode descriptions
const MODE_INFO = {
  auto: 'AI decides the best approach',
  planning: 'Create detailed video plans',
  prompts: 'Generate image/video prompts',
  chat: 'General conversation'
};

// Model info
const MODEL_INFO = {
  'claude-opus': { name: 'Claude Opus 4.5', desc: 'Best reasoning' },
  'claude-sonnet': { name: 'Claude Sonnet', desc: 'Fast & capable' },
  'qwen': { name: 'Qwen 3 8B', desc: 'Local (Ollama)' },
  'mistral': { name: 'Mistral', desc: 'Local (Ollama)' }
};

// Generated asset type
interface GeneratedAsset {
  id: string;
  type: 'image' | 'video';
  prompt: string;
  motionPrompt?: string;
  url?: string;           // Image URL
  videoUrl?: string;      // Video URL
  status: 'pending' | 'generating' | 'done' | 'error';
  videoStatus?: 'pending' | 'generating' | 'done' | 'error';
  approved?: boolean;     // Approval status (undefined = not yet reviewed)
  duration?: '5' | '10';  // Video duration
  error?: string;
}

// Pipeline phase - now includes 'approval' phase
type PipelinePhase = 'idle' | 'refs' | 'refs-approval' | 'images' | 'approval' | 'videos' | 'stitching' | 'done';

interface GeneratedRef {
  id: string;
  name: string;
  type: 'character' | 'location';
  description: string;
  url?: string;
  status: 'pending' | 'generating' | 'done' | 'error';
  approved?: boolean;
}

export default function AI2Studio() {
  const {
    messages,
    isGenerating,
    mode,
    model,
    sessions,
    currentSessionId,
    showHistory,
    showSettings,
    addMessage,
    clearMessages,
    setGenerating,
    setMode,
    setModel,
    setShowHistory,
    setShowSettings,
    createNewSession,
    loadSession,
    loadSessions
  } = useAI2Store();

  const [input, setInput] = useState('');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const refImageInputRef = useRef<HTMLInputElement>(null);

  // Generation state
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);
  const [isGeneratingAssets, setIsGeneratingAssets] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });
  const [pipelinePhase, setPipelinePhase] = useState<PipelinePhase>('idle');
  const [generatedRefs, setGeneratedRefs] = useState<GeneratedRef[]>([]);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);

  // Reference images state - now with labeled categories
  const [refImages, setRefImages] = useState<Array<{ url: string; description: string | null }>>([]);
  const [refLoading, setRefLoading] = useState<number | null>(null);

  // Labeled ref categories (like Cinema UI)
  const [characterRefs, setCharacterRefs] = useState<Array<{ url: string; name: string }>>([]);
  const [productRefs, setProductRefs] = useState<Array<{ url: string; name: string }>>([]);
  const [locationRefs, setLocationRefs] = useState<Array<{ url: string; name: string }>>([]);
  const [showRefPanel, setShowRefPanel] = useState(false);

  // Accumulated plans tracking
  const [accumulatedPlans, setAccumulatedPlans] = useState<Array<{ id: string; name: string; shots: any[]; messageIndex: number }>>([]);
  const [showPlanTracker, setShowPlanTracker] = useState(false);

  // Expanded message JSON - track which messages show full JSON
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  // Shot view tab - no longer used (replaced with card grid), keeping for backward compat
  const [shotViewTab, setShotViewTab] = useState<'photo' | 'video' | 'dialog' | 'voiceover'>('photo');

  // Ref view tab - story, characters, locations, or items
  const [refViewTab, setRefViewTab] = useState<'story' | 'characters' | 'locations' | 'items'>('story');

  // Format a nice summary from a JSON plan
  const formatPlanSummary = (plan: any): React.ReactNode => {
    if (!plan) return null;

    const chars = plan.character_references || {};
    const locs = plan.scene_references || {};
    const items = plan.item_references || plan.product_references || plan.asset_references || {};
    const shots = plan.shots || [];

    // Count refs
    const charCount = Object.keys(chars).length;
    const locCount = Object.keys(locs).length;
    const itemCount = Object.keys(items).length;
    const hasRefs = charCount > 0 || locCount > 0 || itemCount > 0;

    return (
      <div className="space-y-3">
        {/* Models Info */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 rounded-lg">
            <span className="text-blue-400">📷</span>
            <span className="text-white/50">Photo:</span>
            <span className="text-blue-300 font-medium">Nano Banana 4K</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-500/10 rounded-lg">
            <span className="text-orange-400">🎬</span>
            <span className="text-white/50">Video:</span>
            <span className="text-orange-300 font-medium">{plan.video_model || 'Kling 2.6'}</span>
          </div>
        </div>

        {/* Story & References with Tabs */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-teal-400 text-xs font-medium">📖 PROJECT</div>
            {/* Story + Ref Type Tabs */}
            <div className="flex bg-white/5 rounded-lg p-0.5">
              <button
                onClick={() => setRefViewTab('story')}
                className={`px-3 py-1 text-xs rounded-md transition ${refViewTab === 'story' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'text-white/50 hover:text-white/70'}`}
              >
                Story
              </button>
              {charCount > 0 && (
                <button
                  onClick={() => setRefViewTab('characters')}
                  className={`px-3 py-1 text-xs rounded-md transition ${refViewTab === 'characters' ? 'bg-purple-500 text-white' : 'text-white/50 hover:text-white/70'}`}
                >
                  Characters ({charCount})
                </button>
              )}
              {locCount > 0 && (
                <button
                  onClick={() => setRefViewTab('locations')}
                  className={`px-3 py-1 text-xs rounded-md transition ${refViewTab === 'locations' ? 'bg-blue-500 text-white' : 'text-white/50 hover:text-white/70'}`}
                >
                  Locations ({locCount})
                </button>
              )}
              <button
                onClick={() => setRefViewTab('items')}
                className={`px-3 py-1 text-xs rounded-md transition ${refViewTab === 'items' ? 'bg-orange-500 text-white' : 'text-white/50 hover:text-white/70'}`}
              >
                Props/Assets ({itemCount})
              </button>
            </div>
          </div>

          {/* Story Tab - compact view with logline + expandable details */}
          {refViewTab === 'story' && (
            <div className="ml-3">
              {/* Logline - always visible, compact */}
              {(plan.log_line || plan.logline) && (
                <div className="text-white/90 text-sm mb-2 italic">
                  "{plan.log_line || plan.logline}"
                </div>
              )}

              {/* Compact info grid - single line summaries */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(plan.story || plan.concept || plan.idea || plan.description || plan.overview) && (
                  <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20">
                    <span className="text-blue-400">💡 </span>
                    <span className="text-white/60 line-clamp-1">{(plan.story || plan.concept || plan.idea || plan.description || plan.overview).slice(0, 80)}...</span>
                  </div>
                )}
                {(plan.reasoning || plan.shot_reasoning || plan.why || plan.approach) && (
                  <div className="p-2 bg-green-500/10 rounded border border-green-500/20">
                    <span className="text-green-400">🎯 </span>
                    <span className="text-white/60 line-clamp-1">{(plan.reasoning || plan.shot_reasoning || plan.why || plan.approach).slice(0, 80)}...</span>
                  </div>
                )}
                {(plan.technique || plan.method || plan.how || plan.visual_strategy) && (
                  <div className="p-2 bg-orange-500/10 rounded border border-orange-500/20">
                    <span className="text-orange-400">🎬 </span>
                    <span className="text-white/60 line-clamp-1">{(plan.technique || plan.method || plan.how || plan.visual_strategy).slice(0, 80)}...</span>
                  </div>
                )}
                {plan.director_style && (
                  <div className="p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                    <span className="text-yellow-400">🎥 </span>
                    <span className="text-white/60 line-clamp-1">{plan.director_style.slice(0, 80)}...</span>
                  </div>
                )}
              </div>

              {/* No story fallback */}
              {!plan.log_line && !plan.logline && !plan.story && !plan.concept && !plan.idea && (
                <div className="p-2 text-white/30 text-xs italic">No story details</div>
              )}
            </div>
          )}

          {/* Characters Tab */}
          {refViewTab === 'characters' && charCount > 0 && (
            <div className="space-y-1">
              {Object.entries(chars).map(([id, char]: [string, any]) => (
                <div key={id} className="ml-3 p-2 bg-purple-500/10 rounded-lg">
                  <div className="text-purple-300 font-medium text-sm">{char.name || id}</div>
                  {char.description && <div className="text-white/50 text-xs mt-1">{char.description}</div>}
                </div>
              ))}
            </div>
          )}
          {/* Locations Tab */}
          {refViewTab === 'locations' && locCount > 0 && (
            <div className="space-y-1">
              {Object.entries(locs).map(([id, loc]: [string, any]) => (
                <div key={id} className="ml-3 p-2 bg-blue-500/10 rounded-lg">
                  <div className="text-blue-300 font-medium text-sm">{loc.name || id}</div>
                  {loc.description && <div className="text-white/50 text-xs mt-1">{loc.description}</div>}
                </div>
              ))}
            </div>
          )}
          {/* Props/Assets Tab */}
          {refViewTab === 'items' && (
            <div className="space-y-1">
              {itemCount > 0 ? (
                Object.entries(items).map(([id, item]: [string, any]) => (
                  <div key={id} className="ml-3 p-2 bg-orange-500/10 rounded-lg">
                    <div className="text-orange-300 font-medium text-sm">{item.name || id}</div>
                    {item.description && <div className="text-white/50 text-xs mt-1">{item.description}</div>}
                  </div>
                ))
              ) : (
                <div className="ml-3 p-2 text-white/30 text-sm italic">No props/assets defined</div>
              )}
            </div>
          )}
        </div>

        {/* Voiceover/Narration - compact */}
        {(plan.voiceover || shots.some((s: any) => s.voiceover)) && (
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded text-xs">
            <span className="text-cyan-400">🎙️ V/O: </span>
            <span className="text-white/60 italic">
              {plan.voiceover ? (typeof plan.voiceover === 'string' ? plan.voiceover : plan.voiceover.text).slice(0, 100) + '...' : 'Per-shot narration'}
            </span>
          </div>
        )}

        {/* Shots Grid - Compact cards that fit on screen */}
        {shots.length > 0 && (
          <div className="flex-1 min-h-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-400 text-xs font-medium">🎬 SHOTS ({shots.length})</span>
              {generatedAssets.length > 0 && (
                <span className="text-xs text-green-400/50">• {generatedAssets.filter(a => a.status === 'done').length} done</span>
              )}
            </div>

            {/* Compact Shot Grid - 3-4 columns, small cards */}
            <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {shots.map((shot: any, i: number) => {
                const asset = generatedAssets[i];
                const hasImage = asset?.status === 'done' && asset?.url;
                const hasVideo = asset?.videoStatus === 'done' && asset?.videoUrl;
                const isGenerating = asset?.status === 'generating' || asset?.videoStatus === 'generating';
                const shotType = shot.shot_type || shot.type || 'Shot';

                return (
                  <div key={i} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden group">
                    {/* Thumbnail - small fixed height */}
                    <div className="relative h-20 bg-vs-dark">
                      {hasImage ? (
                        <>
                          <img src={asset.url} alt="" className="w-full h-full object-cover" />
                          {hasVideo && (
                            <a href={asset.videoUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                              <span className="text-white text-lg">▶</span>
                            </a>
                          )}
                          {asset.approved === true && <div className="absolute top-1 left-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-[8px] text-white">✓</div>}
                          {asset.approved === false && <div className="absolute top-1 left-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white">✗</div>}
                        </>
                      ) : isGenerating ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white/20 text-xs">{i + 1}</span>
                        </div>
                      )}
                    </div>
                    {/* Minimal info */}
                    <div className="p-1.5">
                      <div className="text-[10px] text-white/80 truncate">{i + 1}. {shotType}</div>
                      <div className="text-[9px] text-white/40 truncate">{shot.duration || '5s'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Character DNA - persistent character description
  const [characterDNA, setCharacterDNA] = useState('');
  const [showCharacterDNA, setShowCharacterDNA] = useState(false);

  // Default video duration
  const [defaultDuration, setDefaultDuration] = useState<'5' | '10'>('5');

  // Auto-approve mode - skips approval phases, runs straight through
  const [autoApprove, setAutoApprove] = useState(false);

  // Video model selection
  type VideoModel = 'kling-2.6' | 'kling-o1' | 'seedance';
  const [videoModel, setVideoModel] = useState<VideoModel>('kling-2.6');
  const [autoDetectDialogue, setAutoDetectDialogue] = useState(true); // Auto-switch to Seedance for dialogue

  // TTS / Voiceover state
  const [voiceoverText, setVoiceoverText] = useState('');
  const [voiceoverUrl, setVoiceoverUrl] = useState<string | null>(null);
  const [isGeneratingVoiceover, setIsGeneratingVoiceover] = useState(false);
  const [showVoiceoverPanel, setShowVoiceoverPanel] = useState(false);

  // Director Presets state
  const [selectedDirector, setSelectedDirector] = useState<string | null>(null);
  const [showDirectorPanel, setShowDirectorPanel] = useState(false);

  // Video Motion Panel state
  const [showMotionPanel, setShowMotionPanel] = useState(false);
  const [motionTab, setMotionTab] = useState<'camera' | 'subject' | 'background' | 'objects' | 'templates' | 'dialogue'>('camera');
  const [selectedMotions, setSelectedMotions] = useState<{ camera?: string; subject?: string; background?: string }>({});

  // Motion vocabulary data
  const MOTION_DATA = {
    camera: [
      { id: 'dolly_around', name: 'Dolly Around', prompt: 'Slow dolly shot around the subject, then settles' },
      { id: 'dolly_in', name: 'Dolly In', prompt: 'Dolly in toward subject, then holds' },
      { id: 'dolly_out', name: 'Dolly Out', prompt: 'Dolly out revealing environment, then settles' },
      { id: 'push_in', name: 'Push In', prompt: 'Slow push-in creating intimacy, then holds on face' },
      { id: 'orbit_slow', name: 'Orbit', prompt: 'Camera orbits slowly around subject, then settles' },
      { id: 'orbit_180', name: 'Orbit 180', prompt: 'Slow 180-degree orbit around subject, then holds' },
      { id: 'pan_left', name: 'Pan Left', prompt: 'Slow pan left revealing landscape, then stops' },
      { id: 'pan_right', name: 'Pan Right', prompt: 'Pan right following action, then settles' },
      { id: 'tilt_up', name: 'Tilt Up', prompt: 'Tilt up from feet to face, then holds' },
      { id: 'tracking_side', name: 'Track Side', prompt: 'Smooth tracking shot following from the side, then settles' },
      { id: 'tracking_behind', name: 'Track Behind', prompt: 'Tracking shot from behind, following subject, then stops' },
      { id: 'aerial_track', name: 'Aerial Track', prompt: 'Wide-angle aerial shot tracking from above, then holds' },
      { id: 'drone_rise', name: 'Drone Rise', prompt: 'Drone shot rising to reveal vista, then settles' },
      { id: 'static', name: 'Static', prompt: 'Static shot, subtle breathing motion' },
      { id: 'handheld', name: 'Handheld', prompt: 'Slight handheld movement, documentary feel' },
      { id: 'dolly_zoom', name: 'Dolly Zoom', prompt: 'Cinematic dolly zoom, zali effect, then holds' },
      { id: 'steadicam', name: 'Steadicam', prompt: 'Steadicam following shot, smooth glide, then settles' },
      { id: 'crane_up', name: 'Crane Up', prompt: 'Crane up, rotate counterclockwise, then holds' },
    ],
    subject: [
      { id: 'walk_toward', name: 'Walk Toward', prompt: 'walks toward camera, then stops and looks up' },
      { id: 'walk_away', name: 'Walk Away', prompt: 'turns and walks away, then pauses' },
      { id: 'turn_camera', name: 'Turn to Camera', prompt: 'turns head to camera, then holds gaze' },
      { id: 'turn_around', name: 'Turn Around', prompt: 'spins around, then faces forward' },
      { id: 'look_over', name: 'Look Over Shoulder', prompt: 'looks over shoulder, then turns back' },
      { id: 'smile', name: 'Smile', prompt: 'forms slight smile, holds expression' },
      { id: 'blink', name: 'Blink & Smile', prompt: 'blinks naturally, forms slight smile' },
      { id: 'eyes_widen', name: 'Eyes Widen', prompt: 'eyes widen in surprise, then settle' },
      { id: 'wave', name: 'Wave', prompt: 'waves hand, then lowers arm' },
      { id: 'point', name: 'Point', prompt: 'points at camera, then arm drops' },
      { id: 'reach', name: 'Reach Out', prompt: 'reaches out with hand, then pulls back' },
      { id: 'tears', name: 'Tears', prompt: 'tears well up, single tear falls' },
      { id: 'laugh', name: 'Laugh', prompt: 'laughs briefly, then quiets' },
      { id: 'gasp', name: 'Gasp', prompt: 'gasps in shock, hand to chest' },
      { id: 'nod', name: 'Nod', prompt: 'nods slowly, then holds' },
      { id: 'shake_head', name: 'Shake Head', prompt: 'shakes head gently, then stops' },
    ],
    background: [
      { id: 'wind_leaves', name: 'Leaves Sway', prompt: 'leaves sway gently, then still' },
      { id: 'wind_grass', name: 'Grass Ripples', prompt: 'grass ripples in breeze, then settles' },
      { id: 'wind_curtains', name: 'Curtains Flutter', prompt: 'curtains flutter, then rest' },
      { id: 'waves', name: 'Waves Lap', prompt: 'waves lap at shore, then recede' },
      { id: 'ripples', name: 'Water Ripples', prompt: 'ripples spread across surface, then gentle waves settle' },
      { id: 'rain', name: 'Rain Falls', prompt: 'rain drops streak down, then eases' },
      { id: 'snow', name: 'Snow Falls', prompt: 'snowflakes drift down gently, then thin out' },
      { id: 'dust', name: 'Dust Particles', prompt: 'dust particles drift in light beam, then settle' },
      { id: 'clouds', name: 'Clouds Drift', prompt: 'clouds drift slowly overhead, then hold' },
    ],
    objects: [
      { id: 'flames', name: 'Flames', prompt: 'flames flicker and dance, then steadies' },
      { id: 'embers', name: 'Embers', prompt: 'embers drift upward, then dissipate' },
      { id: 'smoke', name: 'Smoke', prompt: 'smoke rises and disperses slowly' },
      { id: 'sparks', name: 'Sparks', prompt: 'sparks fly upward, then fade' },
      { id: 'hair_wind', name: 'Hair Wind', prompt: 'hair gently moves in breeze, then settles back into place' },
      { id: 'cape', name: 'Cape Billow', prompt: 'cape billows behind, then drapes down' },
      { id: 'dress', name: 'Dress Flow', prompt: 'dress flows with movement, then settles' },
      { id: 'papers', name: 'Papers Scatter', prompt: 'papers scatter in wind, then land' },
      { id: 'petals', name: 'Petals Fall', prompt: 'flower petals drift down, then land gently' },
      { id: 'explosion', name: 'Explosion', prompt: 'explosion erupts, debris scatters, then settles' },
    ],
    templates: [
      { id: 'emotional', name: 'Emotional', prompt: 'Camera slowly orbits left, subject blinks naturally, forms slight smile, hair moves gently as if in soft breeze, movement settles' },
      { id: 'action', name: 'Action', prompt: 'Subject lunges forward, cape billows behind, camera follows the motion, dust kicks up, action completes with landing pose' },
      { id: 'dramatic', name: 'Dramatic', prompt: 'Slow dolly in toward face, eyes narrow with intensity, slight trembling, then stillness' },
      { id: 'reveal', name: 'Reveal', prompt: 'Camera pulls back revealing the full scene, subject turns to look, then holds position' },
      { id: 'chase', name: 'Chase', prompt: 'Tracking shot behind subject running, environment blurs past, then slows to stop' },
      { id: 'contemplative', name: 'Contemplative', prompt: 'Static shot, subject gazes into distance, subtle breathing, wind in hair, then stillness' },
      { id: 'surprise', name: 'Surprise', prompt: 'Subject turns suddenly, eyes widen, gasps, camera pushes in slightly, then holds' },
      { id: 'farewell', name: 'Farewell', prompt: 'Subject turns and walks away, camera stays static, figure recedes, then fades' },
    ],
    dialogue: [
      { id: 'speak_calm', name: 'Speak Calm', prompt: 'speaks calmly with measured pacing, subtle head movements, then pauses' },
      { id: 'speak_excited', name: 'Speak Excited', prompt: 'speaks enthusiastically with animated expressions, gesturing, then settles' },
      { id: 'whisper', name: 'Whisper', prompt: 'whispers with barely contained emotion, leans in slightly, then pulls back' },
      { id: 'shout', name: 'Shout', prompt: 'shouts with intensity, arms raised, then lowers arms' },
      { id: 'monologue', name: 'Monologue', prompt: 'delivers monologue with emotional depth, subtle expressions, then silent moment' },
      { id: 'react', name: 'React', prompt: 'listens intently, reacts with surprise, subtle nod, then holds gaze' },
    ],
  };

  // Director Presets data
  const DIRECTOR_PRESETS = [
    { id: 'kubrick', name: 'Kubrick', desc: 'Symmetrical, cold, meticulous', prompt: 'Stanley Kubrick style, symmetrical one-point perspective, wide angle lens, cold sterile lighting, meticulous composition, centered framing', color: '#4A90A4' },
    { id: 'spielberg', name: 'Spielberg', desc: 'Warm, emotional, wonder', prompt: 'Spielberg style, warm lighting, lens flares, emotional close-ups, dynamic camera movement, wonder and awe', color: '#E8A838' },
    { id: 'tarantino', name: 'Tarantino', desc: 'Low angles, pop culture', prompt: 'Tarantino style, low angle shots, pop culture aesthetic, stylized, film grain, saturated colors', color: '#C53030' },
    { id: 'fincher', name: 'Fincher', desc: 'Dark, moody, precise', prompt: 'David Fincher style, dark and moody, desaturated colors, low-key lighting, meticulous framing, clinical precision', color: '#2D3748' },
    { id: 'nolan', name: 'Nolan', desc: 'IMAX epic, blue/orange', prompt: 'Christopher Nolan style, IMAX grandeur, practical effects look, blue and orange grade, epic scale', color: '#2B6CB0' },
    { id: 'villeneuve', name: 'Villeneuve', desc: 'Vast, atmospheric, Deakins', prompt: 'Denis Villeneuve style, vast landscapes, Roger Deakins lighting, muted colors, atmospheric, contemplative', color: '#718096' },
    { id: 'wes-anderson', name: 'Wes Anderson', desc: 'Symmetrical pastel whimsy', prompt: 'Wes Anderson style, perfectly symmetrical, pastel color palette, whimsical, centered subjects, tableau shots', color: '#F6AD55' },
    { id: 'wong-kar-wai', name: 'Wong Kar-wai', desc: 'Neon romance, step-print', prompt: 'Wong Kar-wai style, step-printed slow motion, smeared colors, neon-lit, romantic melancholy, Christopher Doyle cinematography', color: '#E53E3E' },
    { id: 'tarkovsky', name: 'Tarkovsky', desc: 'Poetic, contemplative, nature', prompt: 'Andrei Tarkovsky style, long takes, contemplative pacing, water and nature elements, philosophical atmosphere, poetic cinema', color: '#38A169' },
    { id: 'depalma', name: 'De Palma', desc: 'Split diopter, Hitchcock', prompt: 'Brian De Palma style, split diopter, Hitchcock homage, voyeuristic, thriller tension, operatic', color: '#805AD5' },
    { id: 'refn', name: 'Refn', desc: 'Neon-drenched, Drive style', prompt: 'Nicolas Winding Refn style, neon-drenched, extreme color gels, synth-wave aesthetic, Drive style, hyperreal', color: '#D53F8C' },
    { id: 'malick', name: 'Malick', desc: 'Golden hour, ethereal', prompt: 'Terrence Malick style, magic hour golden light, nature documentary style, ethereal, spiritual, whispered feeling', color: '#DD6B20' },
  ];

  // Handle ref image upload - prompts for name (no limit)
  const handleRefImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Ask for name first
    const name = prompt('Name this reference (e.g., "Main character", "Logo", "Beach location"):');
    if (!name) {
      if (refImageInputRef.current) refImageInputRef.current.value = '';
      return; // User cancelled
    }

    const file = files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;

      // Add image immediately with name
      const newIndex = refImages.length;
      setRefImages(prev => [...prev, { url: dataUrl, description: name }]);
      setRefLoading(newIndex);

      // Upload to catbox for public URL
      try {
        const blob = await fetch(dataUrl).then(r => r.blob());
        const formData = new FormData();
        formData.append('reqtype', 'fileupload');
        formData.append('fileToUpload', blob, 'ref.jpg');

        const uploadRes = await fetch('/api/cinema/upload', {
          method: 'POST',
          body: formData
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          const publicUrl = uploadData.url;

          // Update with public URL, keep name
          setRefImages(prev => prev.map((img, i) =>
            i === newIndex ? { ...img, url: publicUrl } : img
          ));
        }
      } catch (err) {
        console.log('Could not upload ref image:', err);
      } finally {
        setRefLoading(null);
      }
    };

    reader.readAsDataURL(file);
    if (refImageInputRef.current) refImageInputRef.current.value = '';
  };

  // Remove ref image
  const removeRefImage = (index: number) => {
    setRefImages(prev => prev.filter((_, i) => i !== index));
  };


  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setGenerating(true);

    try {
      // Conversational instruction - Claude should talk naturally with CLEAN TEXT
      const conversationalInstruction = `You are a creative director helping me plan video content. Talk to me like a friend and collaborator.

CRITICAL - OUTPUT CLEAN TEXT:
- NO markdown formatting (no #, **, -, etc)
- NO bullet points or lists
- Just write normal paragraphs like a text message or email
- Keep it short and conversational (2-4 short paragraphs max)
- Be excited and friendly!

HOW TO RESPOND:
1. React to my idea with enthusiasm (1-2 sentences)
2. Share what you're thinking visually (1-2 sentences)
3. Briefly explain your shot plan (1-2 sentences)
4. Then ONLY at the very end, include the JSON code block

Example response style:
"Oh I love this! A parachute bag is such a wild concept - we can make this look absolutely cinematic.

I'm thinking we open with the bag looking totally normal, maybe on someone's shoulder in a city. Then BAM - they jump off something and it deploys. The reveal moment is everything.

Let me set up 4 shots that build the tension and payoff..."

Then end with the JSON block (this is the only code block allowed):
\`\`\`json
{"name":"Scene","shots":[...]}
\`\`\`

Remember: Clean readable text first, JSON code block at the end only.`;

      // Build ref context for AI
      let refContext = '';
      if (refImages.length > 0 || characterRefs.length > 0 || productRefs.length > 0 || locationRefs.length > 0) {
        refContext = '\n\n[You have reference images uploaded to work with]';
        if (characterRefs.length > 0) {
          refContext += `\nCharacters: ${characterRefs.map(r => r.name).join(', ')}`;
        }
        if (productRefs.length > 0) {
          refContext += `\nProducts: ${productRefs.map(r => r.name).join(', ')}`;
        }
        if (locationRefs.length > 0) {
          refContext += `\nLocations: ${locationRefs.map(r => r.name).join(', ')}`;
        }
        if (refImages.length > 0) {
          refContext += `\nRef images: ${refImages.map(r => r.description || 'uploaded').join(', ')}`;
        }
      }

      const messageToSend = `${conversationalInstruction}${refContext}\n\nUser: ${userMessage}`;

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          sessionId: currentSessionId,
          model: model,
          extendedThinking: true
        })
      });

      const data = await response.json();

      if (data.error) {
        addMessage('assistant', `Error: ${data.error}\n\n${data.suggestion || ''}`);
      } else {
        addMessage('assistant', data.response);

        // TRACK PLANS: Always look for JSON plans in responses and accumulate them
        const plan = extractJsonPlan(data.response);
        if (plan && plan.shots && plan.shots.length > 0) {
          console.log('Plan detected with', plan.shots.length, 'shots - tracking...');

          // Add to accumulated plans
          const newPlan = {
            id: `plan-${Date.now()}`,
            name: plan.name || plan.scene_id || `Scene ${accumulatedPlans.length + 1}`,
            shots: plan.shots,
            messageIndex: messages.length
          };
          setAccumulatedPlans(prev => [...prev, newPlan]);
        }
      }
    } catch (error) {
      addMessage('assistant', `Failed to connect: ${error}`);
    } finally {
      setGenerating(false);
    }
  };

  // Extract JSON plan from AI response - find ANY code block with valid shots array
  const extractJsonPlan = (response: string): any | null => {
    try {
      // Find ALL code blocks and try each one
      const codeBlocks = response.match(/```(?:json|JSON)?\s*([\s\S]*?)```/g);
      if (codeBlocks) {
        for (const block of codeBlocks) {
          try {
            const content = block.replace(/```(?:json|JSON)?\s*/, '').replace(/```$/, '').trim();
            const plan = JSON.parse(content);
            if (plan.shots && Array.isArray(plan.shots) && plan.shots.length > 0) {
              return plan;
            }
          } catch (e) {
            // Not valid JSON, try next block
          }
        }
      }
      // Try raw JSON object with shots
      const jsonMatch = response.match(/\{[^{}]*"shots"\s*:\s*\[[\s\S]*?\]\s*[^{}]*\}/);
      if (jsonMatch) {
        const plan = JSON.parse(jsonMatch[0]);
        if (plan.shots && Array.isArray(plan.shots)) {
          return plan;
        }
      }
    } catch (e) {
      console.log('JSON extraction error:', e);
    }
    return null;
  };

  // COLOR LOCK PHRASE - maintains consistency across shots
  const COLOR_LOCK = 'THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.';

  // MOTION ENDPOINT VALIDATION
  // Motions without endpoints cause Kling to hang at 99%
  const MOTION_PATTERNS_NEEDING_ENDPOINTS = [
    { pattern: /\bhair\s+(blows|flows|moves|waves)\b/i, suggestion: ', then settles back into place' },
    { pattern: /\bwater\s+ripples\b/i, suggestion: ', then gentle waves settle' },
    { pattern: /\bflame[s]?\s+(flicker|dance|burn)\b/i, suggestion: ', then steadies' },
    { pattern: /\bsmoke\s+(rises|billows|drifts)\b/i, suggestion: ', then dissipates' },
    { pattern: /\bwind\s+(blows|gusts)\b/i, suggestion: ', then calms' },
    { pattern: /\bleaves?\s+(fall|drift|blow)\b/i, suggestion: ', then land gently' },
    { pattern: /\bcloth\s+(flows|billows|waves)\b/i, suggestion: ', then settles' },
    { pattern: /\bcape\s+(flows|billows|waves)\b/i, suggestion: ', then drapes still' },
    { pattern: /\bwalks?\b(?!.*\b(stops?|pauses?|halts?|settles?|holds?)\b)/i, suggestion: ', then stops' },
    { pattern: /\bruns?\b(?!.*\b(stops?|pauses?|halts?|settles?|holds?)\b)/i, suggestion: ', then halts' },
    { pattern: /\bspins?\b(?!.*\b(stops?|pauses?|halts?|settles?|holds?)\b)/i, suggestion: ', then holds' },
    { pattern: /\bturns?\b(?!.*\b(stops?|pauses?|halts?|settles?|holds?|faces?)\b)/i, suggestion: ', then faces camera' },
    { pattern: /\borbit[s]?\b(?!.*\b(stops?|settles?|holds?)\b)/i, suggestion: ', then settles' },
    { pattern: /\bdolly\b(?!.*\b(stops?|settles?|holds?)\b)/i, suggestion: ', then holds' },
    { pattern: /\bpush\s+in\b(?!.*\b(stops?|holds?)\b)/i, suggestion: ', then holds on subject' },
    { pattern: /\bzoom\b(?!.*\b(stops?|holds?|settles?)\b)/i, suggestion: ', then holds' },
  ];

  const ENDPOINT_KEYWORDS = ['settles', 'stops', 'pauses', 'halts', 'holds', 'lands', 'calms', 'steadies', 'dissipates', 'faces'];

  interface MotionValidation {
    isValid: boolean;
    warnings: string[];
    suggestions: string[];
  }

  const validateMotionPrompt = (motionPrompt: string): MotionValidation => {
    if (!motionPrompt || motionPrompt.trim() === '') {
      return { isValid: true, warnings: [], suggestions: [] };
    }

    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check if prompt has any endpoint keywords
    const hasEndpoint = ENDPOINT_KEYWORDS.some(keyword =>
      motionPrompt.toLowerCase().includes(keyword)
    );

    // Check each pattern
    for (const { pattern, suggestion } of MOTION_PATTERNS_NEEDING_ENDPOINTS) {
      if (pattern.test(motionPrompt)) {
        // Extract the matched text for the warning
        const match = motionPrompt.match(pattern);
        if (match && !hasEndpoint) {
          warnings.push(`"${match[0]}" needs an endpoint`);
          suggestions.push(`${match[0]}${suggestion}`);
        }
      }
    }

    return {
      isValid: warnings.length === 0,
      warnings,
      suggestions
    };
  };

  // Auto-fix motion prompt by adding endpoints
  const fixMotionPrompt = (motionPrompt: string): string => {
    if (!motionPrompt) return motionPrompt;

    let fixed = motionPrompt;

    // Check if already has endpoint
    const hasEndpoint = ENDPOINT_KEYWORDS.some(keyword =>
      motionPrompt.toLowerCase().includes(keyword)
    );

    if (hasEndpoint) return motionPrompt;

    // Apply first matching fix
    for (const { pattern, suggestion } of MOTION_PATTERNS_NEEDING_ENDPOINTS) {
      if (pattern.test(fixed)) {
        const match = fixed.match(pattern);
        if (match) {
          // Add the suggestion after the matched text
          fixed = fixed.replace(match[0], match[0] + suggestion);
          break; // Only apply one fix to avoid over-modifying
        }
      }
    }

    return fixed;
  };

  // Fix motion prompt for a specific shot
  const fixShotMotion = (index: number) => {
    setGeneratedAssets(prev => prev.map((a, idx) => {
      if (idx === index && a.motionPrompt) {
        return { ...a, motionPrompt: fixMotionPrompt(a.motionPrompt) };
      }
      return a;
    }));
  };

  // Fix ALL motion prompts that have issues
  const fixAllMotionPrompts = () => {
    setGeneratedAssets(prev => prev.map(a => {
      if (a.motionPrompt) {
        const validation = validateMotionPrompt(a.motionPrompt);
        if (!validation.isValid) {
          return { ...a, motionPrompt: fixMotionPrompt(a.motionPrompt) };
        }
      }
      return a;
    }));
  };

  // Count shots with motion issues
  const countMotionIssues = () => {
    return generatedAssets.filter(a => {
      if (!a.motionPrompt) return false;
      const validation = validateMotionPrompt(a.motionPrompt);
      return !validation.isValid;
    }).length;
  };

  // Get current director preset
  const getDirectorPreset = () => {
    if (!selectedDirector) return null;
    return DIRECTOR_PRESETS.find(d => d.id === selectedDirector);
  };

  // Save project state (assets, refs, settings)
  const saveProjectState = async () => {
    try {
      const projectState = {
        generatedAssets: generatedAssets.map(a => ({
          id: a.id,
          type: a.type,
          prompt: a.prompt,
          motionPrompt: a.motionPrompt,
          status: a.status,
          url: a.url,
          videoUrl: a.videoUrl,
          approved: a.approved
        })),
        generatedRefs: generatedRefs.map(r => ({
          id: r.id,
          name: r.name,
          type: r.type,
          url: r.url,
          approved: r.approved
        })),
        characterRefs,
        productRefs,
        locationRefs,
        refImages,
        characterDNA,
        defaultDuration,
        videoModel,
        finalVideoUrl,
        voiceoverUrl,
        voiceoverText,
        accumulatedPlans
      };

      await fetch('/api/ai/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: currentSessionId, projectState })
      });
      console.log(`[AI2] Project state saved for session: ${currentSessionId}`);
    } catch (error) {
      console.error('[AI2] Failed to save project state:', error);
    }
  };

  // Load project state
  const loadProjectState = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/ai/project?sessionId=${sessionId}`);
      const data = await response.json();

      if (data.projectState) {
        const ps = data.projectState;
        console.log(`[AI2] Loading project state for session: ${sessionId}`);

        // Restore all state
        if (ps.generatedAssets?.length) setGeneratedAssets(ps.generatedAssets);
        if (ps.generatedRefs?.length) setGeneratedRefs(ps.generatedRefs);
        if (ps.characterRefs?.length) setCharacterRefs(ps.characterRefs);
        if (ps.productRefs?.length) setProductRefs(ps.productRefs);
        if (ps.locationRefs?.length) setLocationRefs(ps.locationRefs);
        if (ps.refImages?.length) setRefImages(ps.refImages);
        if (ps.characterDNA) setCharacterDNA(ps.characterDNA);
        if (ps.defaultDuration) setDefaultDuration(ps.defaultDuration);
        if (ps.videoModel) setVideoModel(ps.videoModel);
        if (ps.finalVideoUrl) setFinalVideoUrl(ps.finalVideoUrl);
        if (ps.voiceoverUrl) setVoiceoverUrl(ps.voiceoverUrl);
        if (ps.voiceoverText) setVoiceoverText(ps.voiceoverText);
        if (ps.accumulatedPlans?.length) setAccumulatedPlans(ps.accumulatedPlans);

        console.log(`[AI2] Project state loaded: ${ps.generatedAssets?.length || 0} assets, ${ps.generatedRefs?.length || 0} refs`);
      }
    } catch (error) {
      console.error('[AI2] Failed to load project state:', error);
    }
  };

  // Auto-save project state when significant changes happen
  useEffect(() => {
    // Save when we have assets or refs
    if (generatedAssets.length > 0 || generatedRefs.length > 0 || finalVideoUrl) {
      const timer = setTimeout(() => saveProjectState(), 2000); // Debounce 2s
      return () => clearTimeout(timer);
    }
  }, [generatedAssets, generatedRefs, finalVideoUrl, currentSessionId]);

  // Build motion prompt from selected motions
  const buildMotionPromptFromSelections = (): string => {
    const parts: string[] = [];

    if (selectedMotions.camera) {
      const camera = MOTION_DATA.camera.find(m => m.id === selectedMotions.camera);
      if (camera) parts.push(camera.prompt);
    }

    if (selectedMotions.subject) {
      const subject = MOTION_DATA.subject.find(m => m.id === selectedMotions.subject);
      if (subject) parts.push(subject.prompt);
    }

    if (selectedMotions.background) {
      const bg = MOTION_DATA.background.find(m => m.id === selectedMotions.background);
      if (bg) parts.push(bg.prompt);
    }

    return parts.join(', ') || 'Slow cinematic movement, then settles';
  };

  // Select a motion item (handles camera/subject/background auto-categorization)
  const selectMotion = (category: string, itemId: string, prompt: string) => {
    if (category === 'templates' || category === 'dialogue') {
      // Templates and dialogue replace entire motion prompt
      setSelectedMotions({ camera: undefined, subject: undefined, background: undefined });
      // Set input to the template prompt for easy editing
      setInput(prompt);
    } else if (category === 'objects') {
      // Objects go to background slot
      setSelectedMotions(prev => ({ ...prev, background: itemId }));
    } else {
      setSelectedMotions(prev => ({
        ...prev,
        [category]: prev[category as keyof typeof prev] === itemId ? undefined : itemId
      }));
    }
  };

  // Clear all motion selections
  const clearMotionSelections = () => {
    setSelectedMotions({});
  };

  // Build prompt with character DNA, color lock, and director style
  const buildPrompt = (basePrompt: string, useColorLock: boolean = false) => {
    let prompt = basePrompt;

    // Add director style first (foundational aesthetic)
    const director = getDirectorPreset();
    if (director) {
      prompt = `${director.prompt}. ${prompt}`;
    }

    // Add character DNA
    if (characterDNA.trim()) {
      prompt = `${characterDNA.trim()}. ${prompt}`;
    }

    // Add color lock for consistency
    if (useColorLock) {
      prompt = `${COLOR_LOCK} ${prompt}`;
    }

    return prompt;
  };

  // STEP 0: Generate REFS first (character + location references)
  const generateRefs = async (plan: any) => {
    const charRefs = plan.character_references || {};
    const sceneRefs = plan.scene_references || {};

    // Build refs list
    const refs: GeneratedRef[] = [];

    // Add character refs
    Object.entries(charRefs).forEach(([id, char]: [string, any]) => {
      refs.push({
        id: `char-${id}`,
        name: char.name || id,
        type: 'character',
        description: char.description || `Character: ${char.name || id}`,
        status: 'pending'
      });
    });

    // Add location refs
    Object.entries(sceneRefs).forEach(([id, scene]: [string, any]) => {
      refs.push({
        id: `loc-${id}`,
        name: scene.name || id,
        type: 'location',
        description: scene.description || `Location: ${scene.name || id}`,
        status: 'pending'
      });
    });

    // If no refs defined, skip to images
    if (refs.length === 0) {
      console.log('[AI2] No refs in plan, skipping to images...');
      await generateImages(plan);
      return;
    }

    setGeneratedRefs(refs);
    setCurrentPlan(plan);
    setPipelinePhase('refs');
    setIsGeneratingAssets(true);
    setGenerationProgress({ current: 0, total: refs.length });

    console.log(`[AI2] Generating ${refs.length} refs...`);

    // Get director style for consistent refs
    const directorPreset = getDirectorPreset();
    const directorStyle = directorPreset
      ? `, ${directorPreset.prompt}`
      : ', cinematic lighting';

    console.log(`[AI2] Generating refs with director style: ${directorPreset?.name || 'default'}`);

    // Generate refs in parallel
    const refPromises = refs.map(async (ref, i) => {
      setGeneratedRefs(prev => prev.map((r, idx) =>
        idx === i ? { ...r, status: 'generating' } : r
      ));

      try {
        // IMPORTANT: Refs use SAME director style as shots for consistency
        // This way "THIS EXACT LIGHTING" actually matches!
        const prompt = ref.type === 'character'
          ? `${ref.description}, single character portrait, clear full body view${directorStyle}, 8K detailed`
          : `${ref.description}, establishing wide shot${directorStyle}, 8K detailed`;

        const response = await fetch('/api/cinema/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'image',
            prompt,
            aspect_ratio: '16:9',
            resolution: '2K'
          })
        });

        const data = await response.json();
        // API returns image_url (not images array)
        const imageUrl = data.image_url || data.images?.[0]?.url || data.image?.url || data.url;
        console.log(`[AI2] Ref ${i} result:`, imageUrl ? 'SUCCESS' : 'NO URL', data);

        setGeneratedRefs(prev => prev.map((r, idx) =>
          idx === i ? { ...r, status: imageUrl ? 'done' : 'error', url: imageUrl } : r
        ));
        setGenerationProgress(prev => ({ ...prev, current: prev.current + 1 }));

        return { index: i, success: !!imageUrl, url: imageUrl };
      } catch (error) {
        setGeneratedRefs(prev => prev.map((r, idx) =>
          idx === i ? { ...r, status: 'error' } : r
        ));
        return { index: i, success: false };
      }
    });

    await Promise.all(refPromises);

    // If auto-approve is ON, skip approval and continue
    if (autoApprove) {
      console.log('[AI2] Auto-approve ON - auto-approving refs and continuing...');
      // Auto-approve all refs
      setGeneratedRefs(prev => prev.map(r => ({ ...r, approved: true })));
      setIsGeneratingAssets(false);
      // Small delay to let state update, then continue
      setTimeout(async () => {
        const refs = generatedRefs.filter(r => r.url);
        setRefImages(refs.map(r => ({ url: r.url!, description: r.name })));
        if (currentPlan) {
          await generateImages(currentPlan);
        }
      }, 100);
    } else {
      setPipelinePhase('refs-approval');
      setIsGeneratingAssets(false);
      console.log('[AI2] Refs done - awaiting approval');
    }
  };

  // Approve refs and continue to images
  const approveRefsAndContinue = async () => {
    const approvedRefs = generatedRefs.filter(r => r.approved !== false && r.url);
    const refUrls = approvedRefs.map(r => r.url!);

    // Store approved ref URLs for image generation
    setRefImages(approvedRefs.map(r => ({ url: r.url!, description: r.name })));

    // Continue to image generation with refs
    if (currentPlan) {
      await generateImages(currentPlan);
    }
  };

  // STEP 1: Generate images only (stops at approval)
  const generateImages = async (plan: any) => {
    const shots = plan.shots || [];
    if (shots.length === 0) return;

    setIsGeneratingAssets(true);
    setPipelinePhase('images');
    setFinalVideoUrl(null);
    setGenerationProgress({ current: 0, total: shots.length });

    // Build ref ID -> URL map from approved generated refs
    const refUrlMap: Record<string, string> = {};
    generatedRefs.filter(r => r.approved !== false && r.url).forEach(r => {
      // Map both formats: "char-CHAR1" and "CHAR1"
      refUrlMap[r.id] = r.url!;
      const shortId = r.id.replace(/^(char-|loc-)/, '');
      refUrlMap[shortId] = r.url!;
    });

    // Also include manually added ref images (from upload) AND labeled refs
    const uploadedRefUrls = refImages.map(r => r.url).filter(url => url && !url.startsWith('data:'));
    const labeledRefUrls = [
      ...characterRefs.map(r => r.url),
      ...productRefs.map(r => r.url),
      ...locationRefs.map(r => r.url)
    ];
    const allApprovedRefUrls = [
      ...generatedRefs.filter(r => r.approved !== false && r.url).map(r => r.url!),
      ...uploadedRefUrls,
      ...labeledRefUrls
    ];

    const useColorLock = allApprovedRefUrls.length > 0;
    console.log(`[AI2] Ref URL map:`, Object.keys(refUrlMap), `All refs: ${allApprovedRefUrls.length} (labeled: ${labeledRefUrls.length})`);

    // Initialize assets from plan shots
    const assets: GeneratedAsset[] = shots.map((shot: any, i: number) => ({
      id: `shot-${Date.now()}-${i}`,
      type: 'image' as const,
      prompt: shot.photo_prompt || shot.prompt || `Shot ${i + 1}`,
      motionPrompt: shot.motion_prompt || 'Slow cinematic movement, then settles',
      status: 'pending' as const,
      videoStatus: 'pending' as const,
      approved: undefined, // Not yet reviewed
      duration: defaultDuration
    }));
    setGeneratedAssets(assets);

    // Generate ALL images in PARALLEL
    console.log(`[AI2] Generating ${assets.length} images in parallel...`);

    const imagePromises = shots.map(async (shot: any, i: number) => {
      setGeneratedAssets(prev => prev.map((a, idx) =>
        idx === i ? { ...a, status: 'generating' } : a
      ));

      try {
        // Get per-shot refs if specified, otherwise use all refs
        let shotRefUrls: string[] = [];
        const charRefs = shot.character_refs || [];
        const sceneRefs = shot.scene_refs || [];
        const shotSpecificRefs = [...charRefs, ...sceneRefs];

        if (shotSpecificRefs.length > 0) {
          // Use only the refs specified for this shot
          shotRefUrls = shotSpecificRefs
            .map((refId: string) => refUrlMap[refId] || refUrlMap[`char-${refId}`] || refUrlMap[`loc-${refId}`])
            .filter(Boolean);
          console.log(`[AI2] Shot ${i + 1}: Using ${shotRefUrls.length} specific refs:`, shotSpecificRefs);
        } else {
          // Fall back to all approved refs
          shotRefUrls = allApprovedRefUrls;
          console.log(`[AI2] Shot ${i + 1}: Using all ${shotRefUrls.length} refs`);
        }

        const prompt = shot.photo_prompt || shot.prompt || `Shot ${i + 1}`;
        const finalPrompt = buildPrompt(prompt, useColorLock && shotRefUrls.length > 0);

        const response = await fetch('/api/cinema/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: shotRefUrls.length > 0 ? 'edit' : 'image',
            prompt: finalPrompt,
            aspect_ratio: '16:9',
            resolution: '2K',
            image_urls: shotRefUrls.length > 0 ? shotRefUrls : undefined
          })
        });

        const data = await response.json();
        const imageUrl = data.image_url || data.images?.[0]?.url || data.image?.url || data.url;
        console.log(`[AI2] Shot ${i + 1} result:`, imageUrl ? 'SUCCESS' : 'FAILED', imageUrl || data);

        setGeneratedAssets(prev => {
          const updated = prev.map((a, idx) =>
            idx === i ? { ...a, status: (imageUrl ? 'done' : 'error') as 'done' | 'error', url: imageUrl } : a
          );
          console.log(`[AI2] Updated assets:`, updated.map(a => ({ id: a.id, status: a.status, hasUrl: !!a.url })));
          return updated;
        });
        setGenerationProgress(prev => ({ ...prev, current: prev.current + 1 }));

        return { index: i, success: !!imageUrl, url: imageUrl };
      } catch (error) {
        setGeneratedAssets(prev => prev.map((a, idx) =>
          idx === i ? { ...a, status: 'error', error: String(error) } : a
        ));
        return { index: i, success: false };
      }
    });

    await Promise.all(imagePromises);

    // If auto-approve is ON, skip approval and continue to videos
    if (autoApprove) {
      console.log('[AI2] Auto-approve ON - auto-approving images and generating videos...');
      // Auto-approve all images
      setGeneratedAssets(prev => prev.map(a => ({ ...a, approved: true })));
      // Small delay then continue to videos
      setTimeout(() => {
        generateVideosForApproved();
      }, 100);
    } else {
      // STOP at approval phase - user must approve before videos
      setPipelinePhase('approval');
      setIsGeneratingAssets(false);
      console.log(`[AI2] Images done - awaiting approval`);
    }
  };

  // Approve/Reject handlers
  const approveShot = (index: number) => {
    setGeneratedAssets(prev => prev.map((a, idx) =>
      idx === index ? { ...a, approved: true } : a
    ));
  };

  const rejectShot = (index: number) => {
    setGeneratedAssets(prev => prev.map((a, idx) =>
      idx === index ? { ...a, approved: false } : a
    ));
  };

  const approveAll = () => {
    setGeneratedAssets(prev => prev.map(a =>
      a.status === 'done' ? { ...a, approved: true } : a
    ));
  };

  // Regenerate a single rejected shot
  const regenerateShot = async (index: number) => {
    const asset = generatedAssets[index];
    if (!asset) return;

    setGeneratedAssets(prev => prev.map((a, idx) =>
      idx === index ? { ...a, status: 'generating', approved: undefined } : a
    ));

    const refUrls = refImages.map(r => r.url).filter(url => url && !url.startsWith('data:'));
    const useColorLock = refUrls.length > 0;

    try {
      const finalPrompt = buildPrompt(asset.prompt, useColorLock);

      const response = await fetch('/api/cinema/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: refUrls.length > 0 ? 'edit' : 'image',
          prompt: finalPrompt,
          aspect_ratio: '16:9',
          resolution: '4K',
          image_urls: refUrls.length > 0 ? refUrls : undefined
        })
      });

      const data = await response.json();
      const imageUrl = data.image_url || data.images?.[0]?.url || data.image?.url || data.url;

      setGeneratedAssets(prev => prev.map((a, idx) =>
        idx === index ? { ...a, status: imageUrl ? 'done' : 'error', url: imageUrl } : a
      ));
    } catch (error) {
      setGeneratedAssets(prev => prev.map((a, idx) =>
        idx === index ? { ...a, status: 'error', error: String(error) } : a
      ));
    }
  };

  // Detect if motion prompt contains dialogue/talking keywords
  const isDialoguePrompt = (prompt: string): boolean => {
    const dialogueKeywords = [
      'speaks', 'speaking', 'talks', 'talking', 'says', 'saying',
      'dialogue', 'conversation', 'whispers', 'whispering', 'shouts', 'shouting',
      'mouth moves', 'lip sync', 'lipsync', 'voice', 'vocal',
      'expresses', 'emotes', 'reacts verbally', 'responds verbally'
    ];
    const lowerPrompt = prompt.toLowerCase();
    return dialogueKeywords.some(kw => lowerPrompt.includes(kw));
  };

  // Map videoModel state to API type
  const getVideoApiType = (model: string, motionPrompt: string): string => {
    // Auto-detect dialogue if enabled
    if (autoDetectDialogue && isDialoguePrompt(motionPrompt)) {
      console.log('[AI2] Dialogue detected in prompt - routing to Seedance');
      return 'video-seedance';
    }

    switch (model) {
      case 'kling-2.6': return 'video-kling';
      case 'kling-o1': return 'video-kling-o1';
      case 'seedance': return 'video-seedance';
      default: return 'video-kling';
    }
  };

  // STEP 2: Generate videos for APPROVED shots only
  const generateVideosForApproved = async () => {
    const approvedAssets = generatedAssets.filter(a => a.approved === true && a.status === 'done' && a.url);
    if (approvedAssets.length === 0) {
      console.log('[AI2] No approved shots to generate videos for');
      return;
    }

    setIsGeneratingAssets(true);
    setPipelinePhase('videos');
    setGenerationProgress({ current: 0, total: approvedAssets.length });
    console.log(`[AI2] Generating ${approvedAssets.length} videos for approved shots using model: ${videoModel}...`);

    const videoPromises = approvedAssets.map(async (asset, approvedIndex) => {
      const index = generatedAssets.findIndex(a => a.id === asset.id);

      setGeneratedAssets(prev => prev.map((a, idx) =>
        idx === index ? { ...a, videoStatus: 'generating' } : a
      ));

      try {
        // Compress image for video models (<10MB limit) - REQUIRED!
        console.log(`[AI2] Compressing image for video: ${asset.url?.substring(0, 50)}...`);
        const compressRes = await fetch('/api/cinema/compress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: asset.url })
        });
        const compressData = await compressRes.json();
        // API returns image_url (not compressed_url)
        const compressedUrl = compressData.image_url || compressData.compressed_url || asset.url;
        console.log(`[AI2] Compressed: ${compressedUrl?.substring(0, 50)}... (${compressData.compressed_size ? Math.round(compressData.compressed_size/1024) + 'KB' : 'unknown size'})`);

        const motionPrompt = asset.motionPrompt || 'Slow cinematic movement, then settles';
        const duration = asset.duration || defaultDuration;

        // Determine which video model to use (may auto-switch for dialogue)
        const apiType = getVideoApiType(videoModel, motionPrompt);
        console.log(`[AI2] Using video model: ${apiType} for shot ${index + 1}`);

        // Build request body based on model type
        const requestBody: any = {
          type: apiType,
          prompt: motionPrompt,
          aspect_ratio: '16:9'
        };

        // Model-specific parameters
        if (apiType === 'video-kling-o1') {
          // Kling O1 uses start_image_url (and optionally end_image_url for transitions)
          requestBody.start_image_url = compressedUrl;
          requestBody.duration = duration;

          // If there's a next approved asset, use it as end frame for smooth transition
          if (approvedIndex < approvedAssets.length - 1) {
            const nextAsset = approvedAssets[approvedIndex + 1];
            if (nextAsset?.url) {
              // Compress next asset for end frame
              const nextCompressRes = await fetch('/api/cinema/compress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image_url: nextAsset.url })
              });
              const nextCompressData = await nextCompressRes.json();
              const nextCompressedUrl = nextCompressData.image_url || nextCompressData.compressed_url || nextAsset.url;
              requestBody.end_image_url = nextCompressedUrl;
              console.log(`[AI2] O1 transition: start→end frame set`);
            }
          }
        } else if (apiType === 'video-seedance') {
          // Seedance uses image_url
          requestBody.image_url = compressedUrl;
          // Seedance doesn't use duration parameter the same way
        } else {
          // Kling 2.6 uses image_url
          requestBody.image_url = compressedUrl;
          requestBody.duration = duration;
        }

        const response = await fetch('/api/cinema/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        const videoUrl = data.video?.url || data.video_url || data.url;

        setGeneratedAssets(prev => prev.map((a, idx) =>
          idx === index ? { ...a, videoStatus: videoUrl ? 'done' : 'error', videoUrl } : a
        ));
        setGenerationProgress(prev => ({ ...prev, current: prev.current + 1 }));

        return { index, success: !!videoUrl, url: videoUrl };
      } catch (error) {
        setGeneratedAssets(prev => prev.map((a, idx) =>
          idx === index ? { ...a, videoStatus: 'error' } : a
        ));
        return { index, success: false };
      }
    });

    const videoResults = await Promise.all(videoPromises);
    const successfulVideos = videoResults.filter(r => r.success);
    console.log(`[AI2] Videos done: ${successfulVideos.length}/${approvedAssets.length}`);

    // STITCH all videos
    if (successfulVideos.length >= 2) {
      setPipelinePhase('stitching');
      console.log(`[AI2] Stitching ${successfulVideos.length} videos...`);

      try {
        const videoUrls = successfulVideos
          .sort((a, b) => a.index - b.index)
          .map(r => r.url);

        const stitchResponse = await fetch('/api/cinema/stitch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videos: videoUrls })
        });

        if (stitchResponse.ok) {
          const stitchData = await stitchResponse.json();
          const finalUrl = stitchData.video_url || stitchData.url;
          console.log(`[AI2] Stitch complete: ${finalUrl}`);
          setFinalVideoUrl(finalUrl);

          // Add completion message to chat
          if (finalUrl) {
            addMessage('assistant', `🎬 **Video Complete!**\n\n${successfulVideos.length} clips stitched into final video.\n\n[▶️ Watch Final Video](${finalUrl})`);
            window.open(finalUrl, '_blank');
          }
        }
      } catch (error) {
        console.error('[AI2] Stitch error:', error);
      }
    } else if (successfulVideos.length === 1) {
      // Single video - just set it as final
      const singleUrl = successfulVideos[0].url;
      setFinalVideoUrl(singleUrl);
      // Add completion message to chat
      if (singleUrl) {
        addMessage('assistant', `🎬 **Video Complete!**\n\nSingle clip ready.\n\n[▶️ Watch Video](${singleUrl})`);
      }
    }

    setPipelinePhase('done');
    setIsGeneratingAssets(false);
  };

  // Legacy function for backwards compatibility - now uses approval flow
  const generateFromJsonPlan = async (plan: any) => {
    // Start with refs, then images
    await generateRefs(plan);
  };

  // Execute ALL accumulated plans
  const executeAllPlans = async () => {
    if (accumulatedPlans.length === 0) return;

    // Combine all shots from all plans
    const allShots = accumulatedPlans.flatMap(p => p.shots);
    console.log(`[AI2] Executing ${accumulatedPlans.length} plans with ${allShots.length} total shots`);

    // Create a combined plan
    const combinedPlan = {
      name: 'Combined Execution',
      shots: allShots,
      aspect_ratio: '16:9'
    };

    // Run the full pipeline
    await generateFromJsonPlan(combinedPlan);
  };

  // Quick generate single image (for chat mode)
  const quickGenerateImage = async (prompt: string) => {
    if (!prompt.trim()) return;

    setIsGeneratingAssets(true);
    setPipelinePhase('images');

    const asset: GeneratedAsset = {
      id: `quick-${Date.now()}`,
      type: 'image',
      prompt: prompt,
      status: 'generating'
    };
    setGeneratedAssets([asset]);

    try {
      const refUrls = refImages.map(r => r.url).filter(url => url && !url.startsWith('data:'));

      const response = await fetch('/api/cinema/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: refUrls.length > 0 ? 'edit' : 'image',
          prompt: prompt,
          aspect_ratio: '16:9',
          resolution: '4K',
          image_urls: refUrls.length > 0 ? refUrls : undefined
        })
      });

      const data = await response.json();
      const imageUrl = data.image_url || data.images?.[0]?.url || data.image?.url || data.url;

      setGeneratedAssets([{ ...asset, status: imageUrl ? 'done' : 'error', url: imageUrl }]);
    } catch (error) {
      setGeneratedAssets([{ ...asset, status: 'error', error: String(error) }]);
    }

    setPipelinePhase('done');
    setIsGeneratingAssets(false);
  };

  // Generate TTS voiceover
  const generateVoiceover = async (text: string) => {
    if (!text.trim()) return;

    setIsGeneratingVoiceover(true);
    console.log(`[AI2] Generating voiceover: "${text.substring(0, 50)}..."`);

    try {
      const response = await fetch('/api/cinema/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const data = await response.json();
      if (data.audio_url) {
        setVoiceoverUrl(data.audio_url);
        console.log(`[AI2] Voiceover generated: ${data.audio_url}`);
        addMessage('assistant', `🎙️ **Voiceover Generated!**\n\n[▶️ Play Audio](${data.audio_url})\n\nText: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`);
      } else {
        console.error('[AI2] TTS error:', data);
        addMessage('assistant', `❌ Failed to generate voiceover: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('[AI2] TTS error:', error);
      addMessage('assistant', `❌ Failed to generate voiceover: ${error}`);
    }

    setIsGeneratingVoiceover(false);
  };

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick action handler
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'plan':
        setMode('planning');
        setInput('Plan a video about: ');
        inputRef.current?.focus();
        break;
      case 'image':
        setMode('prompts');
        setInput('Create an image prompt for: ');
        inputRef.current?.focus();
        break;
      case 'motion':
        setMode('prompts');
        setInput('Create a video motion prompt for: ');
        inputRef.current?.focus();
        break;
    }
  };

  return (
    <div className="min-h-screen bg-vs-dark flex flex-col">
      {/* Header */}
      <header className="border-b border-vs-border px-6 py-4 flex items-center justify-between bg-vs-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-white">AI Studio 2</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* New Chat */}
          <button
            onClick={() => { createNewSession(); clearMessages(); }}
            className="px-3 py-1.5 text-sm bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New
          </button>

          {/* History */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-3 py-1.5 text-sm rounded-lg transition flex items-center gap-1 ${showHistory ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </button>



          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`px-3 py-1.5 text-sm rounded-lg transition ${showSettings ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Auto-approve toggle */}
          <button
            onClick={() => setAutoApprove(!autoApprove)}
            className={`px-3 py-1.5 text-sm rounded-lg transition flex items-center gap-1.5 ${
              autoApprove
                ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                : 'bg-white/10 text-white/50 hover:bg-white/20'
            }`}
            title="Auto-approve: Skip approval phases, run straight through to final video"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Auto
          </button>

          {/* Reset button - shows when generating is stuck */}
          {(isGeneratingAssets || pipelinePhase !== 'idle') && (
            <button
              onClick={() => {
                setIsGeneratingAssets(false);
                setPipelinePhase('idle');
                setGeneratedAssets([]);
                setGeneratedRefs([]);
                console.log('[AI2] State reset');
              }}
              className="px-3 py-1.5 text-sm bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition"
              title="Reset stuck state"
            >
              Reset
            </button>
          )}

          {/* Back to Cinema */}
          <a
            href="/cinema"
            className="px-3 py-1.5 text-sm text-white/40 hover:text-white/60 transition"
          >
            Cinema
          </a>
        </div>
      </header>

      {/* Main Content - Lovable-style layout */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT: Chat Panel - Wider for better readability */}
        <aside className="w-[480px] min-w-[480px] border-r border-vs-border bg-vs-card/30 flex flex-col">
          {/* Chat Header */}
          <div className="p-3 border-b border-vs-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-white/70">Chat</span>
            </div>
            <span className="text-xs text-white/30">{MODEL_INFO[model]?.name || model}</span>
          </div>

          {/* Chat Messages - Scrollable */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center mb-4">
                  <span className="text-2xl">🎬</span>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Hey! What are we making?</h3>
                <p className="text-white/50 text-sm mb-4 max-w-[280px]">Tell me about your video idea and I'll help plan the shots</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button onClick={() => setInput("Let's make a 30 second ad for ")} className="px-3 py-1.5 text-xs bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30">Ad/Commercial</button>
                  <button onClick={() => setInput("Create a short film scene about ")} className="px-3 py-1.5 text-xs bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30">Short Film</button>
                  <button onClick={() => setInput("Music video sequence for ")} className="px-3 py-1.5 text-xs bg-pink-500/20 text-pink-300 rounded-lg hover:bg-pink-500/30">Music Video</button>
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                // For assistant messages, extract text before JSON (Claude's discussion)
                const hasPlan = msg.role === 'assistant' && extractJsonPlan(msg.content)?.shots;
                let displayText = msg.content;

                if (hasPlan) {
                  // Extract just the discussion part (before the JSON block)
                  const jsonIndex = msg.content.indexOf('```json');
                  if (jsonIndex > 0) {
                    displayText = msg.content.slice(0, jsonIndex).trim();
                  }
                }

                // Check if message is expanded
                const isExpanded = expandedMessages.has(msg.id);
                const isLong = displayText.length > 500;
                const showText = isExpanded || !isLong ? displayText : displayText.slice(0, 500) + '...';

                return (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-purple-500/20 text-white'
                        : 'bg-vs-dark text-white/80 border border-vs-border'
                    }`}>
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-1 text-xs text-purple-400">
                          <span>🤖 Claude</span>
                          {hasPlan && <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded">Plan ready</span>}
                        </div>
                      )}
                      <div className="whitespace-pre-wrap leading-relaxed">{showText}</div>
                      {isLong && (
                        <button
                          onClick={() => setExpandedMessages(prev => {
                            const next = new Set(prev);
                            if (next.has(msg.id)) next.delete(msg.id);
                            else next.add(msg.id);
                            return next;
                          })}
                          className="mt-2 text-xs text-purple-400 hover:text-purple-300"
                        >
                          {isExpanded ? 'Show less' : 'Show more...'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-vs-dark border border-vs-border rounded-xl px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400 text-xs">🤖</span>
                    <span className="text-white/70 text-sm">Claude is thinking...</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Area - Bigger, more comfortable */}
          <div className="border-t border-vs-border p-4 space-y-3">
            {/* Ref Images */}
            {refImages.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {refImages.map((img, idx) => (
                  <div key={idx} className="relative group w-12 h-12 rounded-lg overflow-hidden border border-white/20">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeRefImage(idx)}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-red-400 text-sm"
                    >×</button>
                  </div>
                ))}
              </div>
            )}

            {/* Input row - bigger icons and input */}
            <div className="flex gap-3 items-end">
              {/* Upload buttons - bigger */}
              <div className="flex gap-2">
                <input type="file" id="char-upload" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0]; if (!file) return;
                  const name = prompt('Character name:') || 'Character';
                  const reader = new FileReader();
                  reader.onload = async (ev) => {
                    const dataUrl = ev.target?.result as string;
                    setRefImages(prev => [...prev, { url: dataUrl, description: `👤 ${name}` }]);
                    try {
                      const blob = await fetch(dataUrl).then(r => r.blob());
                      const formData = new FormData(); formData.append('reqtype', 'fileupload'); formData.append('fileToUpload', blob, 'ref.jpg');
                      const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: formData });
                      const url = await res.text();
                      if (url.startsWith('https://')) setRefImages(prev => prev.map((img, i) => i === prev.length - 1 ? { ...img, url: url.trim() } : img));
                    } catch (err) { console.log('Upload failed:', err); }
                  };
                  reader.readAsDataURL(file);
                  e.target.value = '';
                }} />
                <input type="file" id="loc-upload" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0]; if (!file) return;
                  const name = prompt('Location name:') || 'Location';
                  const reader = new FileReader();
                  reader.onload = async (ev) => {
                    const dataUrl = ev.target?.result as string;
                    setRefImages(prev => [...prev, { url: dataUrl, description: `📍 ${name}` }]);
                    try {
                      const blob = await fetch(dataUrl).then(r => r.blob());
                      const formData = new FormData(); formData.append('reqtype', 'fileupload'); formData.append('fileToUpload', blob, 'ref.jpg');
                      const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: formData });
                      const url = await res.text();
                      if (url.startsWith('https://')) setRefImages(prev => prev.map((img, i) => i === prev.length - 1 ? { ...img, url: url.trim() } : img));
                    } catch (err) { console.log('Upload failed:', err); }
                  };
                  reader.readAsDataURL(file);
                  e.target.value = '';
                }} />
                <input type="file" id="asset-upload" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0]; if (!file) return;
                  const name = prompt('Asset/Product name:') || 'Asset';
                  const reader = new FileReader();
                  reader.onload = async (ev) => {
                    const dataUrl = ev.target?.result as string;
                    setRefImages(prev => [...prev, { url: dataUrl, description: `📦 ${name}` }]);
                    try {
                      const blob = await fetch(dataUrl).then(r => r.blob());
                      const formData = new FormData(); formData.append('reqtype', 'fileupload'); formData.append('fileToUpload', blob, 'ref.jpg');
                      const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: formData });
                      const url = await res.text();
                      if (url.startsWith('https://')) setRefImages(prev => prev.map((img, i) => i === prev.length - 1 ? { ...img, url: url.trim() } : img));
                    } catch (err) { console.log('Upload failed:', err); }
                  };
                  reader.readAsDataURL(file);
                  e.target.value = '';
                }} />
                <button onClick={() => document.getElementById('char-upload')?.click()} className="p-3 bg-purple-500/20 text-purple-300 rounded-xl hover:bg-purple-500/30 transition" title="Add Character">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </button>
                <button onClick={() => document.getElementById('loc-upload')?.click()} className="p-3 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition" title="Add Location">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                </button>
                <button onClick={() => document.getElementById('asset-upload')?.click()} className="p-3 bg-orange-500/20 text-orange-300 rounded-xl hover:bg-orange-500/30 transition" title="Add Asset">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </button>
              </div>

              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your video..."
                className="flex-1 bg-vs-dark border border-vs-border rounded-xl px-4 py-3 text-base text-white placeholder-white/40 resize-none focus:outline-none focus:border-purple-500/50"
                rows={2}
                disabled={isGenerating}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isGenerating || isGeneratingAssets}
                className="p-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>

            {/* Execute Button - Shows when there's a plan ready */}
            {(() => {
              const latestPlanMsg = [...messages].reverse().find(m => m.role === 'assistant' && extractJsonPlan(m.content)?.shots);
              const latestPlan = latestPlanMsg ? extractJsonPlan(latestPlanMsg.content) : null;
              const hasPlan = latestPlan && latestPlan.shots && latestPlan.shots.length > 0;

              if (hasPlan && !isGenerating && !isGeneratingAssets) {
                return (
                  <button
                    onClick={() => generateFromJsonPlan(latestPlan)}
                    className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition flex items-center justify-center gap-2 font-semibold"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Execute Plan ({latestPlan.shots.length} shots)
                  </button>
                );
              }

              if (isGeneratingAssets) {
                return (
                  <div className="w-full py-2.5 bg-purple-500/20 text-purple-300 rounded-lg flex items-center justify-center gap-2 text-sm">
                    <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    Generating... {generationProgress.current}/{generationProgress.total}
                  </div>
                );
              }

              return null;
            })()}
          </div>
        </aside>

        {/* CENTER: Output Panel - Fits on one page without scrolling */}
        <main className="flex-1 flex flex-col overflow-hidden bg-vs-dark">
          <div className="flex-1 flex flex-col p-4 min-h-0">
            {(() => {
              // Find the latest plan from messages
              const latestPlanMsg = [...messages].reverse().find(m => m.role === 'assistant' && extractJsonPlan(m.content)?.shots);
              const latestPlan = latestPlanMsg ? extractJsonPlan(latestPlanMsg.content) : null;
              const hasPlan = latestPlan && latestPlan.shots && latestPlan.shots.length > 0;

              // Show output content
              if (!hasPlan && messages.length === 0 && generatedAssets.length === 0 && generatedRefs.length === 0) {
                // Empty state - show welcome
                return (
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">Your Project</h2>
                    <p className="text-white/50 text-sm text-center max-w-md">Plans and generated content will appear here</p>
                  </div>
                );
              }

              return (
                <div className="flex flex-col h-full min-h-0 gap-3">
                  {/* Plan Header - Compact */}
                  {hasPlan && (
                    <div className="bg-vs-card border border-green-500/30 rounded-xl p-3 flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
                            {latestPlan.shots.length} shots
                          </span>
                          <span className="text-white font-medium text-sm">{latestPlan.name || latestPlan.scene_id || 'Scene'}</span>
                        </div>
                        {!isGenerating && !isGeneratingAssets && (
                          <button
                            onClick={() => generateFromJsonPlan(latestPlan)}
                            className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition flex items-center gap-1.5 font-semibold text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            EXECUTE
                          </button>
                        )}
                      </div>
                      {formatPlanSummary(latestPlan)}
                    </div>
                  )}

                  {/* Generated Assets Display - Compact */}
                  {(generatedAssets.length > 0 || generatedRefs.length > 0) && (
                    <div className="bg-vs-card border border-vs-border rounded-xl p-3 flex-1 min-h-0 flex flex-col">
                      {/* Pipeline Phase Indicator - Inline */}
                      <div className="mb-2 flex items-center gap-1.5 flex-wrap text-[10px]">
                        {generatedRefs.length > 0 && (
                          <>
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${pipelinePhase === 'refs' ? 'bg-teal-500/20 text-teal-300' : (pipelinePhase === 'refs-approval' || pipelinePhase === 'images' || pipelinePhase === 'approval' || pipelinePhase === 'videos' || pipelinePhase === 'stitching' || pipelinePhase === 'done') ? 'text-green-400' : 'text-white/30'}`}>
                              <span>{pipelinePhase === 'refs' ? '...' : (pipelinePhase !== 'idle') ? '✓' : '○'}</span>Refs
                            </div>
                            <span className="text-white/20">→</span>
                          </>
                        )}
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${pipelinePhase === 'images' ? 'bg-blue-500/20 text-blue-300' : (pipelinePhase === 'approval' || pipelinePhase === 'videos' || pipelinePhase === 'stitching' || pipelinePhase === 'done') ? 'text-green-400' : 'text-white/30'}`}>
                          <span>{pipelinePhase === 'images' ? '...' : (pipelinePhase === 'approval' || pipelinePhase === 'videos' || pipelinePhase === 'stitching' || pipelinePhase === 'done') ? '✓' : '○'}</span>Images
                        </div>
                        <span className="text-white/20">→</span>
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${pipelinePhase === 'approval' ? 'bg-yellow-500/20 text-yellow-300' : (pipelinePhase === 'videos' || pipelinePhase === 'stitching' || pipelinePhase === 'done') ? 'text-green-400' : 'text-white/30'}`}>
                          <span>{pipelinePhase === 'approval' ? '!' : (pipelinePhase === 'videos' || pipelinePhase === 'stitching' || pipelinePhase === 'done') ? '✓' : '○'}</span>Approve
                        </div>
                        <span className="text-white/20">→</span>
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${pipelinePhase === 'videos' ? 'bg-purple-500/20 text-purple-300' : (pipelinePhase === 'stitching' || pipelinePhase === 'done') ? 'text-green-400' : 'text-white/30'}`}>
                          <span>{pipelinePhase === 'videos' ? '...' : (pipelinePhase === 'stitching' || pipelinePhase === 'done') ? '✓' : '○'}</span>Videos
                        </div>
                        <span className="text-white/20">→</span>
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${pipelinePhase === 'stitching' ? 'bg-orange-500/20 text-orange-300' : pipelinePhase === 'done' ? 'text-green-400' : 'text-white/30'}`}>
                          <span>{pipelinePhase === 'stitching' ? '...' : pipelinePhase === 'done' ? '✓' : '○'}</span>Render
                        </div>
                        {pipelinePhase === 'done' && (
                          <>
                            <span className="text-white/20">→</span>
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-green-500/20 text-green-300">
                              <span>✓</span>Done!
                            </div>
                          </>
                        )}
                      </div>

                      {/* Approval Controls */}
                      {pipelinePhase === 'approval' && (
                        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                          <div className="flex items-center justify-between">
                            <span className="text-yellow-300 font-medium">Review & Approve Shots</span>
                            <div className="flex gap-2">
                              <button onClick={approveAll} className="px-3 py-1.5 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 text-sm">Approve All</button>
                              <button
                                onClick={generateVideosForApproved}
                                disabled={generatedAssets.filter(a => a.approved === true).length === 0}
                                className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-sm font-medium"
                              >
                                Generate Videos ({generatedAssets.filter(a => a.approved === true).length})
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Assets Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {generatedAssets.map((asset, idx) => (
                          <div key={asset.id} className="relative aspect-video bg-vs-dark rounded-lg overflow-hidden">
                            {asset.status === 'pending' && <div className="absolute inset-0 flex items-center justify-center"><span className="text-white/30 text-sm">Waiting...</span></div>}
                            {asset.status === 'generating' && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
                                <span className="text-blue-400 text-xs">Image...</span>
                              </div>
                            )}
                            {asset.status === 'done' && asset.url && (
                              <>
                                <img src={asset.url} alt={`Shot ${idx + 1}`} className={`w-full h-full object-cover ${asset.approved === false ? 'opacity-40' : ''}`} />
                                {pipelinePhase === 'approval' && asset.approved === undefined && (
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                                    <button onClick={() => approveShot(idx)} className="px-2 py-1 bg-green-500 text-white rounded text-sm">✓</button>
                                    <button onClick={() => rejectShot(idx)} className="px-2 py-1 bg-red-500 text-white rounded text-sm">✗</button>
                                  </div>
                                )}
                                {asset.approved === true && <div className="absolute top-2 left-2 px-2 py-0.5 bg-green-500 text-white rounded text-xs">✓</div>}
                                {asset.videoStatus === 'generating' && (
                                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-2" />
                                    <span className="text-purple-400 text-xs">Video...</span>
                                  </div>
                                )}
                                {asset.videoStatus === 'done' && asset.videoUrl && (
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <a href={asset.videoUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-green-500 text-white rounded-lg flex items-center gap-1 text-sm">
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>Play
                                    </a>
                                  </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-2">
                                  <span className="text-xs text-white/70">Shot {idx + 1}</span>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Final Video */}
                      {finalVideoUrl && (
                        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                              </div>
                              <div>
                                <h4 className="text-green-300 font-medium">Final Video Ready!</h4>
                                <p className="text-xs text-green-400/60">{generatedAssets.filter(a => a.videoStatus === 'done').length} clips stitched</p>
                              </div>
                            </div>
                            <a href={finalVideoUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center gap-2">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>Watch
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </main>

        {/* RIGHT: Optional Sidebars */}
        {showHistory && (
          <aside className="w-64 border-l border-vs-border bg-vs-card/50 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-white/60 mb-3">Chat History</h3>
            {sessions.length === 0 ? (
              <p className="text-sm text-white/40">No previous sessions</p>
            ) : (
              <div className="space-y-2">
                {sessions.map(session => (
                  <button
                    key={session.id}
                    onClick={() => {
                      loadSession(session.id);
                      loadProjectState(session.id);
                      setShowHistory(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      session.id === currentSessionId ? 'bg-purple-500/20 text-purple-300' : 'text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {session.name}
                  </button>
                ))}
              </div>
            )}
          </aside>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <aside className="w-80 border-l border-vs-border bg-vs-card/50 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-white/60 mb-4">Settings</h3>

            {/* Model Selection */}
            <div className="mb-6">
              <label className="text-xs text-white/50 uppercase tracking-wide mb-2 block">Model</label>
              <div className="space-y-2">
                {Object.entries(MODEL_INFO).map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => setModel(key as any)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex justify-between items-center ${
                      model === key
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                        : 'text-white/70 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <span>{info.name}</span>
                    <span className="text-xs text-white/40">{info.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* System Prompt Info */}
            <div className="mb-6">
              <label className="text-xs text-white/50 uppercase tracking-wide mb-2 block">System Prompt</label>
              <div className="bg-vs-dark rounded-lg p-3 text-xs space-y-2">
                <div className="text-green-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  aiPromptSystem.ts (1165 lines)
                </div>
                <div className="text-white/50 pl-4 space-y-1">
                  <div>12 Director Styles</div>
                  <div>Lens Knowledge (14-200mm)</div>
                  <div>Camera Bodies (ARRI, RED, etc)</div>
                  <div>30+ Camera Movements</div>
                  <div>Lighting Styles</div>
                  <div>Video Prompt Rules</div>
                  <div>Power Verbs Library</div>
                </div>
              </div>
            </div>

            {/* Connected Data */}
            <div className="mb-6">
              <label className="text-xs text-white/50 uppercase tracking-wide mb-2 block">Connected Data</label>
              <div className="bg-vs-dark rounded-lg p-3 text-xs space-y-2">
                <div className="flex items-center gap-2 text-blue-400">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Directors
                </div>
                <div className="text-white/40 pl-4 text-[10px]">
                  Kubrick, Spielberg, Tarantino, Fincher, Nolan, Villeneuve, Wes Anderson, Wong Kar-wai, Tarkovsky, Refn, Malick
                </div>

                <div className="flex items-center gap-2 text-yellow-400 mt-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  Camera Moves
                </div>
                <div className="text-white/40 pl-4 text-[10px]">
                  dolly, orbit, tracking, push, pull, pan, tilt, aerial, drone, handheld, drift, dolly_zoom, steadicam
                </div>
              </div>
            </div>

            {/* File Paths */}
            <div className="mb-6">
              <label className="text-xs text-white/50 uppercase tracking-wide mb-2 block">File Paths</label>
              <div className="bg-vs-dark rounded-lg p-3 text-xs space-y-3">
                <div>
                  <div className="text-purple-400 mb-1">Chat History</div>
                  <code className="text-white/40 text-[10px] block break-all">
                    {'{cwd}'}/ai-memory/{currentSessionId}.txt
                  </code>
                </div>
                <div>
                  <div className="text-purple-400 mb-1">System Prompt</div>
                  <code className="text-white/40 text-[10px] block break-all">
                    src/components/react/CinemaStudio/aiPromptSystem.ts
                  </code>
                </div>
                <div>
                  <div className="text-purple-400 mb-1">API Endpoint</div>
                  <code className="text-white/40 text-[10px] block break-all">
                    /api/ai/chat
                  </code>
                </div>
              </div>
            </div>

            {/* Session Info */}
            <div className="border-t border-vs-border pt-4">
              <div className="text-xs text-white/30 space-y-1">
                <div>Session: <span className="text-white/50">{currentSessionId}</span></div>
                <div>Messages: <span className="text-white/50">{messages.length}</span></div>
                <div>Extended Thinking: <span className="text-green-400">Enabled</span></div>
              </div>
            </div>
          </aside>
        )}

      </div>
    </div>
  );
}
