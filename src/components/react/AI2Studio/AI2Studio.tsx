import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAI2Store } from './ai2Store';
import { buildAI2Prompt } from './ai2PromptSystem';
import CameraControl, { buildFullCameraPrompt } from './CameraControl';
import CouncilPanel from './components/CouncilPanel';
import AgentDebugPanel from './components/AgentDebugPanel';
import { useCouncilStore } from '../CouncilStudio/councilStore';

// Spec Pipeline Agents (PDF Bible v4.0)
import {
  specOrchestrator,
  worldStatePersistence,
  TheStack,
  buildCharacterMasterPrompt,
  buildEnvironmentMasterPrompt
} from './agents';
import type { ShotCard, WorldEngineerOutput, BeatPlannerOutput, ShotCompilerOutput } from './agents';

// UNIFIED PIPELINE V2 - Complete rewrite with all new agents
import { unifiedPipelineV2, type UnifiedPipelineV2Output } from './agents/unifiedPipelineV2';
// Keep V1 for backwards compatibility if needed
import { unifiedPipeline, type UnifiedPipelineOutput } from './agents/unifiedPipeline';

// Mode descriptions
const MODE_INFO = {
  auto: 'AI decides the best approach',
  planning: 'Create detailed video plans',
  prompts: 'Generate image/video prompts',
  chat: 'General conversation'
};

// Model info
const MODEL_INFO: Record<string, { name: string; desc: string }> = {
  'claude-opus': { name: 'Claude Opus 4.5', desc: 'Best reasoning' },
  'claude-sonnet': { name: 'Claude Sonnet', desc: 'Fast & capable' },
  'gpt-5.2': { name: 'GPT-5.2', desc: 'OpenAI latest' },
  'gpt-4o': { name: 'GPT-4o', desc: 'OpenAI reliable' },
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
  type: 'character' | 'location' | 'baseplate' | 'item';
  description: string;
  url?: string;
  status: 'pending' | 'generating' | 'done' | 'error';
  approved?: boolean;
  // For baseplates: which scene/environment does this establish?
  establishes?: string; // e.g., "cockpit_interior", "exterior_helicopter", "location_bg"
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
  const [pipelineStatus, setPipelineStatus] = useState<string>(''); // Current phase status message
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

  // Ref view tab - story, characters, locations, items, or uploaded (user refs only)
  const [refViewTab, setRefViewTab] = useState<'story' | 'characters' | 'locations' | 'items' | 'baseplates' | 'uploaded'>('story');

  // Segment filter tab - filter shots by segment (intro, buildup, climax, etc.)
  const [segmentTab, setSegmentTab] = useState<string>('all');

  // Zoom level for shots panel (smaller = more cards fit)
  const [shotZoom, setShotZoom] = useState<number>(100); // 50-150 range

  // 3D Camera Control state
  const [cameraPrompt, setCameraPrompt] = useState<string>('');
  const [showCameraControl, setShowCameraControl] = useState(false);

  // Council Panel state
  const [showCouncilPanel, setShowCouncilPanel] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const { councilEnabled, setCouncilEnabled, runMeeting, consensus } = useCouncilStore();

  // Ref Upload Modal state
  const [showRefUploadModal, setShowRefUploadModal] = useState(false);
  const [pendingRefFile, setPendingRefFile] = useState<{ file: File; dataUrl: string } | null>(null);
  const [pendingRefName, setPendingRefName] = useState('');

  // Model dropdown in chat header
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  // SPEC PIPELINE STATE (PDF Bible v4.0)
  const [useSpecPipeline, setUseSpecPipeline] = useState(false);
  const [specWorldState, setSpecWorldState] = useState<WorldEngineerOutput | null>(null);
  const [specBeats, setSpecBeats] = useState<BeatPlannerOutput | null>(null);
  const [specShotCards, setSpecShotCards] = useState<ShotCompilerOutput | null>(null);
  const [specSessionId, setSpecSessionId] = useState<string | null>(null);
  const [showSpecPanel, setShowSpecPanel] = useState(false);

  // Format a nice summary from a JSON plan - SIMPLIFIED: Refs row, then content
  const formatPlanSummary = (plan: any): React.ReactNode => {
    if (!plan) return null;

    const chars = plan.character_references || {};
    const locs = plan.scene_references || {};
    const items = plan.item_references || plan.product_references || plan.asset_references || {};

    // Combine all refs into one list with type labels
    const allRefs: Array<{ id: string; name: string; type: 'char' | 'loc' | 'item'; desc?: string }> = [];
    Object.entries(chars).forEach(([id, char]: [string, any]) => {
      allRefs.push({ id, name: char.name || id, type: 'char', desc: char.description });
    });
    Object.entries(locs).forEach(([id, loc]: [string, any]) => {
      allRefs.push({ id, name: loc.name || id, type: 'loc', desc: loc.description });
    });
    Object.entries(items).forEach(([id, item]: [string, any]) => {
      allRefs.push({ id, name: item.name || id, type: 'item', desc: item.description });
    });

    // Also include user-uploaded refs
    const uploadedRefs = refImages.map((r, i) => ({
      id: `uploaded-${i}`,
      name: r.description || 'Ref',
      type: r.description?.startsWith('👤') ? 'char' as const : r.description?.startsWith('📍') ? 'loc' as const : 'item' as const,
      url: r.url
    }));

    return null; // No longer needed in plan summary - refs shown in main panel
  };

  // Character DNA - persistent character description
  const [characterDNA, setCharacterDNA] = useState('');
  const [showCharacterDNA, setShowCharacterDNA] = useState(false);

  // Default video duration
  const [defaultDuration, setDefaultDuration] = useState<'5' | '10'>('5');

  // Aspect ratio - 16:9 (landscape), 9:16 (TikTok/Reels), 1:1 (Square)
  type AspectRatio = '16:9' | '9:16' | '1:1';
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');

  // Auto-approve mode - skips approval phases, runs straight through
  // DEFAULT: true - Execute Plan now runs fully automatic (refs→images→videos→stitch)
  const [autoApprove, setAutoApprove] = useState(true);

  // Video model selection
  type VideoModel = 'kling-2.6' | 'kling-o1' | 'seedance';
  const [videoModel, setVideoModel] = useState<VideoModel>('kling-2.6');
  const [autoDetectDialogue, setAutoDetectDialogue] = useState(true); // Auto-switch to Seedance for dialogue

  // Frame Chaining - extract last frame of each video, use as input for next
  // Prevents color drift between shots, maintains continuity
  const [enableChaining, setEnableChaining] = useState(true); // ON by default
  const [lastExtractedFrame, setLastExtractedFrame] = useState<string | null>(null);

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
        // FIXED: Use 'file' key to match upload endpoint expectation
        const ext = blob.type.includes('png') ? 'png' : 'jpg';
        formData.append('file', blob, `ref-${Date.now()}.${ext}`);

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

  // Auto-scroll to bottom - like Claude web
  useEffect(() => {
    // Scroll to bottom whenever messages change
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages, isGenerating, generatedAssets]);

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

    // COUNCIL DELIBERATION (runs when panel is open)
    let councilContext = '';
    if (showCouncilPanel) {
      try {
        console.log('[AI2] 🧠 Council deliberating...');
        const meetingResult = await runMeeting({
          userPrompt: userMessage,  // API expects userPrompt, not prompt
          shot: {
            id: `shot_${Date.now()}`,
            prompt: userMessage,
            order: generatedAssets.length,
            duration: '5',
            status: 'pending'
          },  // API requires shot object with required fields
          director: undefined,
          previousShots: generatedAssets.filter(a => a.videoUrl).map(a => ({
            id: a.id,
            prompt: a.prompt,
            order: 0,
            duration: '5' as const,
            status: 'done' as const,
            videoUrl: a.videoUrl
          })),
          refs: [...characterRefs, ...locationRefs, ...productRefs].map(r => ({
            id: r.name,
            name: r.name,
            type: r.name.includes('char') ? 'character' as const : 'location' as const,
            url: r.url
          }))
        });

        // Format council recommendations for Claude
        if (meetingResult) {
          const techRec = meetingResult.agentDecisions?.find((d: any) => d.agent === 'technical')?.recommendation;
          const prodRec = meetingResult.agentDecisions?.find((d: any) => d.agent === 'production')?.recommendation;
          const visRec = meetingResult.agentDecisions?.find((d: any) => d.agent === 'visual')?.recommendation;

          councilContext = `
## COUNCIL RECOMMENDATIONS (Follow These)
- **Model:** ${meetingResult.finalDecision?.model || 'kling-2.6'}
- **Duration:** ${meetingResult.finalDecision?.duration || '5'}s
- **Motion Prompt:** ${techRec?.suggestedMotionPrompt || 'Smooth cinematic movement, then settles'}
- **Color Lock:** ${prodRec?.colorLockPhrase || 'THIS EXACT CHARACTER, THIS EXACT LIGHTING'}
- **Chain Strategy:** ${prodRec?.chainStrategy || 'new_sequence'}
${visRec?.cameraMovement ? `- **Camera:** ${visRec.cameraMovement}` : ''}

`;
          console.log('[AI2] ✅ Council consensus received:', meetingResult.finalDecision);
        }
      } catch (error) {
        console.log('[AI2] ⚠️ Council meeting failed, proceeding without:', error);
      }
    }

    try {
      // Build comprehensive system prompt with all cinematography knowledge
      const hasUploadedRefs = refImages.length > 0 || characterRefs.length > 0 || productRefs.length > 0 || locationRefs.length > 0;

      const systemPrompt = buildAI2Prompt({
        hasUploadedRefs,
        characterRefs: characterRefs.map(r => r.name),
        productRefs: productRefs.map(r => r.name),
        locationRefs: locationRefs.map(r => r.name),
        generalRefs: refImages.map(r => r.description || 'uploaded image')
      });

      // Inject council recommendations into message
      const messageToSend = `${systemPrompt}\n\n${councilContext}---\n\nUser: ${userMessage}`;

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

  // MEMOIZE: Pre-calculate all refs data to avoid recalculation on every render
  // This fixes lag when many photos are displayed
  const memoizedRefData = useMemo(() => {
    // Convert uploaded refs to standard format
    const uploadedRefs = refImages.map((r, i) => ({
      id: `upload-${i}`,
      type: (r.description?.startsWith('👤') ? 'char' : r.description?.startsWith('📍') ? 'loc' : 'item') as 'char' | 'loc' | 'item',
      name: r.description?.replace(/^(👤|📍|📦)\s*/, '') || 'Ref',
      url: r.url,
      isUploaded: true,
      isUploading: (r as any)._uploading === true,
      isFailed: (r as any)._failed === true
    }));

    // Count uploaded refs that are ready (have catbox URLs)
    const readyUploadCount = uploadedRefs.filter(r => r.url?.startsWith('http')).length;
    const pendingUploadCount = uploadedRefs.filter(r => r.isUploading).length;
    const failedUploadCount = uploadedRefs.filter(r => r.isFailed).length;

    return {
      uploadedRefs,
      readyUploadCount,
      pendingUploadCount,
      failedUploadCount,
      totalUploadedRefs: uploadedRefs.length
    };
  }, [refImages]);

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

  // Build prompt with character DNA, color lock, director style, and 3D camera
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

    // Add 3D camera control prompt (maintains shot consistency)
    if (cameraPrompt.trim()) {
      prompt = `${prompt}, ${cameraPrompt.trim()}`;
    }

    // Add color lock for consistency
    if (useColorLock) {
      prompt = `${COLOR_LOCK} ${prompt}`;
    }

    return prompt;
  };

  // STEP 0: Generate REFS first (character + location references)
  // If user uploaded refs, use them as INPUT to generate better 8K versions
  // Still generate location refs if plan has them
  const generateRefs = async (plan: any) => {
    const hasUploadedCharRefs = characterRefs.length > 0 || refImages.length > 0;
    const hasUploadedLocRefs = locationRefs.length > 0;

    const charRefsFromPlan = plan.character_references || {};
    const sceneRefsFromPlan = plan.scene_references || {};

    // Build refs list - combining user uploads with plan refs
    const refs: GeneratedRef[] = [];

    // CHARACTER REFS: User uploads are used DIRECTLY (no regeneration!)
    if (hasUploadedCharRefs) {
      // User uploaded character refs - USE AS-IS, no regeneration!
      characterRefs.forEach((ref, i) => {
        refs.push({
          id: `char-uploaded-${i}`,
          name: ref.name || `Character ${i + 1}`,
          type: 'character',
          description: ref.name || 'uploaded character',
          url: ref.url,
          status: 'done' // DONE - use as-is, don't regenerate!
        });
      });
      // Also include general refs tagged as character
      refImages.forEach((ref, i) => {
        if (ref.description?.toLowerCase().includes('character') || ref.description?.startsWith('👤')) {
          refs.push({
            id: `char-general-${i}`,
            name: ref.description?.replace(/^👤\s*/, '') || `Character`,
            type: 'character',
            description: ref.description || 'uploaded character',
            url: ref.url,
            status: 'done' // DONE - use as-is!
          });
        }
      });
      console.log(`[AI2] ✅ Using ${refs.filter(r => r.type === 'character').length} uploaded character refs DIRECTLY (no regeneration)`);
    } else {
      // No user uploads - use plan's character descriptions
      Object.entries(charRefsFromPlan).forEach(([id, char]: [string, any]) => {
        refs.push({
          id: `char-${id}`,
          name: char.name || id,
          type: 'character',
          description: char.description || `Character: ${char.name || id}`,
          status: 'pending'
        });
      });
    }

    // LOCATION REFS: Generate from plan if user didn't upload locations
    if (!hasUploadedLocRefs) {
      Object.entries(sceneRefsFromPlan).forEach(([id, scene]: [string, any]) => {
        refs.push({
          id: `loc-${id}`,
          name: scene.name || id,
          type: 'location',
          description: scene.description || `Location: ${scene.name || id}`,
          status: 'pending'
        });
      });
      console.log(`[AI2] Will generate ${Object.keys(sceneRefsFromPlan).length} location refs from plan`);
    } else {
      // User uploaded locations - use them directly (already good)
      locationRefs.forEach((ref, i) => {
        refs.push({
          id: `loc-uploaded-${i}`,
          name: ref.name || `Location ${i + 1}`,
          type: 'location',
          description: ref.name || 'uploaded location',
          url: ref.url,
          status: 'done' // Already done - use as-is
        });
      });
      console.log(`[AI2] ✅ Using ${locationRefs.length} uploaded location refs directly`);
    }

    // PROP/PRODUCT REFS: User uploads are used DIRECTLY (no regeneration!)
    const hasUploadedPropRefs = productRefs.length > 0;
    if (hasUploadedPropRefs) {
      productRefs.forEach((ref, i) => {
        refs.push({
          id: `prop-uploaded-${i}`,
          name: ref.name || `Prop ${i + 1}`,
          type: 'item',
          description: ref.name || 'uploaded prop',
          url: ref.url,
          status: 'done' // DONE - use as-is, don't regenerate!
        });
      });
      // Also include general refs tagged as prop/item
      refImages.forEach((ref, i) => {
        if (ref.description?.toLowerCase().includes('prop') ||
            ref.description?.toLowerCase().includes('item') ||
            ref.description?.startsWith('📦')) {
          refs.push({
            id: `prop-general-${i}`,
            name: ref.description?.replace(/^📦\s*/, '') || `Prop`,
            type: 'item',
            description: ref.description || 'uploaded prop',
            url: ref.url,
            status: 'done' // DONE - use as-is!
          });
        }
      });
      console.log(`[AI2] ✅ Using ${refs.filter(r => r.type === 'item').length} uploaded prop refs DIRECTLY (no regeneration)`);
    }

    // BASE PLATES: Generate environment base plates from plan (cockpit, exterior, etc.)
    const basePlatesFromPlan = plan.base_plates || {};
    Object.entries(basePlatesFromPlan).forEach(([id, plate]: [string, any]) => {
      refs.push({
        id: `baseplate-${id}`,
        name: plate.name || id,
        type: 'baseplate',
        description: plate.description || `Base plate: ${plate.name || id}`,
        establishes: id, // What this base plate establishes (e.g., "cockpit_interior")
        status: 'pending'
      });
    });
    if (Object.keys(basePlatesFromPlan).length > 0) {
      console.log(`[AI2] Will generate ${Object.keys(basePlatesFromPlan).length} base plates from plan:`, Object.keys(basePlatesFromPlan));
    }

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

    // Generate refs in parallel - some may already have URLs (user uploads)
    const refPromises = refs.map(async (ref, i) => {
      // Skip refs that are already done (like user-uploaded locations)
      if (ref.status === 'done' && ref.url) {
        console.log(`[AI2] Ref ${i} "${ref.name}": Already done, using existing URL`);
        return { index: i, success: true, url: ref.url, name: ref.name, id: ref.id };
      }

      setGeneratedRefs(prev => prev.map((r, idx) =>
        idx === i ? { ...r, status: 'generating' } : r
      ));

      try {
        // IMPORTANT: Refs use SAME director style as shots for consistency
        // Different prompt templates for different ref types
        let prompt: string;
        if (ref.type === 'character') {
          // INCLUDE THE ACTUAL CHARACTER DESCRIPTION!
          prompt = `${ref.description}, THIS EXACT CHARACTER, single character portrait, clear full body view${directorStyle}, 8K detailed, maintain exact likeness`;
        } else if (ref.type === 'baseplate') {
          // Base plates are wide establishing shots that define the environment
          prompt = `${ref.description}, wide establishing shot, empty environment, no people, clean background plate${directorStyle}, 8K detailed, cinematic`;
        } else if (ref.type === 'item') {
          prompt = `${ref.description}, product shot, clean background, detailed${directorStyle}, 8K detailed`;
        } else {
          // Location ref
          prompt = `${ref.description}, establishing wide shot${directorStyle}, 8K detailed`;
        }

        // If ref has a URL (user uploaded), use EDIT endpoint to enhance it
        // Otherwise use IMAGE endpoint for text-to-image
        const hasBaseImage = !!ref.url;
        const requestBody: any = {
          type: hasBaseImage ? 'edit' : 'image',
          prompt,
          aspect_ratio: aspectRatio,
          resolution: '4K' // Use 4K for refs to get best quality
        };

        if (hasBaseImage) {
          requestBody.image_urls = [ref.url];
          console.log(`[AI2] Ref ${i} "${ref.name}": Enhancing uploaded image to 8K`);
        } else {
          console.log(`[AI2] Ref ${i} "${ref.name}": Generating from description`);
        }

        const response = await fetch('/api/cinema/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        // API returns image_url (not images array)
        const imageUrl = data.image_url || data.images?.[0]?.url || data.image?.url || data.url;
        console.log(`[AI2] Ref ${i} "${ref.name}" result:`, imageUrl ? 'SUCCESS' : 'NO URL', data);

        setGeneratedRefs(prev => prev.map((r, idx) =>
          idx === i ? { ...r, status: imageUrl ? 'done' : 'error', url: imageUrl } : r
        ));
        setGenerationProgress(prev => ({ ...prev, current: prev.current + 1 }));

        return { index: i, success: !!imageUrl, url: imageUrl, name: ref.name, id: ref.id };
      } catch (error) {
        console.error(`[AI2] Ref ${i} "${ref.name}" error:`, error);
        setGeneratedRefs(prev => prev.map((r, idx) =>
          idx === i ? { ...r, status: 'error' } : r
        ));
        return { index: i, success: false, name: ref.name, id: ref.id };
      }
    });

    const refResults = await Promise.all(refPromises);

    // Collect successfully generated refs WITH FULL DATA (need type for categorization!)
    const successfulRefs = refResults.filter(r => r.success).map(r => {
      // Find the full ref object from our local refs array to get the type
      const fullRef = refs.find(ref => ref.id === r.id);
      return {
        url: r.url!,
        name: r.name,
        id: r.id,
        type: fullRef?.type || 'character' // Include type for categorization!
      };
    });

    console.log(`[AI2] Refs complete: ${successfulRefs.length}/${refResults.length} successful`);
    console.log(`[AI2] Successful refs with types:`, successfulRefs.map(r => `${r.name} (${r.type})`));

    // If auto-approve is ON, skip approval and continue
    if (autoApprove) {
      console.log('[AI2] Auto-approve ON - auto-approving refs and continuing to images...');
      // Auto-approve all refs
      setGeneratedRefs(prev => prev.map(r => ({ ...r, approved: true })));
      // Store refs for image generation (for display)
      setRefImages(prev => [...prev, ...successfulRefs.map(r => ({ url: r.url, description: r.name }))]);
      // Continue to images immediately - PASS FULL REFS to avoid stale closure!
      if (plan) {
        await generateImages(plan, successfulRefs);
      }
    } else {
      setPipelinePhase('refs-approval');
      setIsGeneratingAssets(false);
      console.log('[AI2] Refs done - awaiting approval');
    }
  };

  // Approve refs and continue to images
  const approveRefsAndContinue = async () => {
    const approvedRefs = generatedRefs.filter(r => r.approved !== false && r.url);

    // Build full ref objects with type info
    const fullRefs = approvedRefs.map(r => ({
      url: r.url!,
      name: r.name,
      id: r.id,
      type: r.type || 'character'
    }));

    // Store approved ref URLs for image generation (for display)
    setRefImages(approvedRefs.map(r => ({ url: r.url!, description: r.name })));

    // Continue to image generation - PASS FULL REFS to ensure proper categorization!
    if (currentPlan) {
      console.log(`[AI2] approveRefsAndContinue: Passing ${fullRefs.length} full refs to generateImages`);
      await generateImages(currentPlan, fullRefs);
    }
  };

  // STEP 1: Generate images only (stops at approval)
  // directRefs: Pass FULL refs directly to avoid stale closure (from generateRefs)
  const generateImages = async (plan: any, directRefs?: Array<{url: string; name: string; id: string; type: string}>) => {
    const shots = plan.shots || [];
    if (shots.length === 0) return;

    setIsGeneratingAssets(true);
    setPipelinePhase('images');
    setFinalVideoUrl(null);
    setGenerationProgress({ current: 0, total: shots.length });

    // Build ref ID -> URL map from ALL refs (uploaded + generated)
    // This map lets us lookup refs by ID when AI specifies character_refs/scene_refs
    const refUrlMap: Record<string, string> = {};

    // ============ ADD UPLOADED REFS TO MAP (CRITICAL!) ============
    // These are the refs the user uploaded - AI references them as "char-uploaded-0", etc.
    characterRefs.forEach((r, i) => {
      if (r.url?.startsWith('http')) {
        refUrlMap[`char-uploaded-${i}`] = r.url;
        refUrlMap[r.name] = r.url; // Also map by name for flexibility
        console.log(`[AI2] refUrlMap: char-uploaded-${i} = ${r.url.substring(0, 50)}...`);
      }
    });
    locationRefs.forEach((r, i) => {
      if (r.url?.startsWith('http')) {
        refUrlMap[`loc-uploaded-${i}`] = r.url;
        refUrlMap[r.name] = r.url;
        console.log(`[AI2] refUrlMap: loc-uploaded-${i} = ${r.url.substring(0, 50)}...`);
      }
    });
    productRefs.forEach((r, i) => {
      if (r.url?.startsWith('http')) {
        refUrlMap[`prop-uploaded-${i}`] = r.url;
        refUrlMap[r.name] = r.url;
        console.log(`[AI2] refUrlMap: prop-uploaded-${i} = ${r.url.substring(0, 50)}...`);
      }
    });

    // Also add general refImages with guessed IDs based on description
    refImages.forEach((r, i) => {
      if (r.url?.startsWith('http')) {
        const desc = r.description || '';
        if (desc.startsWith('👤') || desc.toLowerCase().includes('character')) {
          refUrlMap[`char-general-${i}`] = r.url;
        } else if (desc.startsWith('📍') || desc.toLowerCase().includes('location')) {
          refUrlMap[`loc-general-${i}`] = r.url;
        } else if (desc.startsWith('📦') || desc.toLowerCase().includes('prop')) {
          refUrlMap[`prop-general-${i}`] = r.url;
        }
        // Always add by description name too
        if (desc) {
          refUrlMap[desc.replace(/^(👤|📍|📦)\s*/, '')] = r.url;
        }
      }
    });

    // Add directRefs (from generateRefs, fresh data)
    if (directRefs && directRefs.length > 0) {
      console.log(`[AI2] Adding ${directRefs.length} DIRECT refs to map`);
      directRefs.forEach(r => {
        refUrlMap[r.id] = r.url;
        const shortId = r.id.replace(/^(char-|loc-|baseplate-)/, '');
        refUrlMap[shortId] = r.url;
      });
    }

    // Add from generatedRefs state (for manual approval flow)
    generatedRefs.filter(r => r.approved !== false && r.url).forEach(r => {
      refUrlMap[r.id] = r.url!;
      const shortId = r.id.replace(/^(char-|loc-|baseplate-)/, '');
      refUrlMap[shortId] = r.url!;
    });

    console.log(`[AI2] refUrlMap has ${Object.keys(refUrlMap).length} entries:`, Object.keys(refUrlMap));

    // ============ SMART REF MATCHING ============
    // Separate refs by TYPE so we can send only relevant refs to each shot

    // User-uploaded refs by type (from labeled categories)
    const uploadedCharacterUrls = characterRefs
      .map(r => r.url)
      .filter(url => url?.startsWith('http'));
    const uploadedLocationUrls = locationRefs
      .map(r => r.url)
      .filter(url => url?.startsWith('http'));
    const uploadedPropUrls = productRefs
      .map(r => r.url)
      .filter(url => url?.startsWith('http'));

    // General refImages - parse type from description emoji
    refImages.forEach(r => {
      if (!r.url?.startsWith('http')) return;
      const desc = r.description || '';
      if (desc.startsWith('👤') || desc.toLowerCase().includes('character')) {
        uploadedCharacterUrls.push(r.url);
      } else if (desc.startsWith('📍') || desc.startsWith('🏔️') || desc.toLowerCase().includes('location')) {
        uploadedLocationUrls.push(r.url);
      } else if (desc.startsWith('📦') || desc.toLowerCase().includes('prop') || desc.toLowerCase().includes('item')) {
        uploadedPropUrls.push(r.url);
      }
    });

    // Generated refs by type - USE directRefs FIRST (fresh), then fall back to state
    let generatedCharUrls: string[] = [];
    let generatedLocUrls: string[] = [];
    let generatedBaseplateUrls: string[] = [];
    let generatedItemUrls: string[] = [];

    if (directRefs && directRefs.length > 0) {
      // Use directRefs (fresh data, not stale!)
      generatedCharUrls = directRefs.filter(r => r.type === 'character').map(r => r.url);
      generatedLocUrls = directRefs.filter(r => r.type === 'location').map(r => r.url);
      generatedBaseplateUrls = directRefs.filter(r => r.type === 'baseplate').map(r => r.url);
      generatedItemUrls = directRefs.filter(r => r.type === 'item').map(r => r.url);
      console.log(`[AI2] From directRefs: ${generatedCharUrls.length} chars, ${generatedLocUrls.length} locs, ${generatedBaseplateUrls.length} baseplates, ${generatedItemUrls.length} items`);
    } else {
      // Fall back to state (for manual approval flow)
      generatedCharUrls = generatedRefs
        .filter(r => r.type === 'character' && r.approved !== false && r.url)
        .map(r => r.url!);
      generatedLocUrls = generatedRefs
        .filter(r => r.type === 'location' && r.approved !== false && r.url)
        .map(r => r.url!);
      generatedBaseplateUrls = generatedRefs
        .filter(r => r.type === 'baseplate' && r.approved !== false && r.url)
        .map(r => r.url!);
      generatedItemUrls = generatedRefs
        .filter(r => r.type === 'item' && r.approved !== false && r.url)
        .map(r => r.url!);
      console.log(`[AI2] From state: ${generatedCharUrls.length} chars, ${generatedLocUrls.length} locs, ${generatedBaseplateUrls.length} baseplates, ${generatedItemUrls.length} items`);
    }

    // Combined by type
    const allCharacterRefs = [...uploadedCharacterUrls, ...generatedCharUrls];
    const allLocationRefs = [...uploadedLocationUrls, ...generatedLocUrls, ...generatedBaseplateUrls];
    const allPropRefs = [...uploadedPropUrls, ...generatedItemUrls];

    // Legacy: all refs combined (for fallback)
    const allApprovedRefUrls = [...allCharacterRefs, ...allLocationRefs, ...allPropRefs];

    console.log(`[AI2] ============ SMART REF MATCHING ============`);
    console.log(`[AI2] Character refs: ${allCharacterRefs.length} (${uploadedCharacterUrls.length} uploaded + ${generatedCharUrls.length} generated)`);
    console.log(`[AI2] Location refs: ${allLocationRefs.length} (${uploadedLocationUrls.length} uploaded + ${generatedLocUrls.length + generatedBaseplateUrls.length} generated)`);
    console.log(`[AI2] Prop refs: ${allPropRefs.length} (${uploadedPropUrls.length} uploaded + ${generatedItemUrls.length} generated)`);

    const useColorLock = allApprovedRefUrls.length > 0;
    console.log(`[AI2] allApprovedRefUrls TOTAL:`, allApprovedRefUrls.length);
    console.log(`[AI2] =====================================`);

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

    // ============ BASE SHOT SYSTEM ============
    // Group shots by scene_id, generate BASE shots first, then use as ref for others

    // Step 1: Identify BASE shots for each scene_id
    const sceneBaseMap: Record<string, number> = {}; // scene_id -> shot index
    const shotsByScene: Record<string, number[]> = {}; // scene_id -> [shot indices]

    shots.forEach((shot: any, i: number) => {
      const sceneId = shot.scene_id || 'default';
      if (!shotsByScene[sceneId]) {
        shotsByScene[sceneId] = [];
      }
      shotsByScene[sceneId].push(i);

      // If shot is marked as base, or it's the first wide shot for this scene
      if (shot.is_base_shot) {
        sceneBaseMap[sceneId] = i;
      }
    });

    // Auto-detect base shots if not marked (prefer wide shots)
    Object.entries(shotsByScene).forEach(([sceneId, indices]) => {
      if (sceneBaseMap[sceneId] === undefined) {
        // Find widest shot type as base
        const wideIndex = indices.find(i =>
          shots[i].shot_type === 'wide' || shots[i].shot_type === 'establishing'
        );
        sceneBaseMap[sceneId] = wideIndex !== undefined ? wideIndex : indices[0];
      }
    });

    const baseIndices = new Set(Object.values(sceneBaseMap));
    const nonBaseIndices = shots.map((_: any, i: number) => i).filter((i: number) => !baseIndices.has(i));

    console.log(`[AI2] ============ BASE SHOT SYSTEM ============`);
    console.log(`[AI2] Scenes found:`, Object.keys(shotsByScene));
    console.log(`[AI2] Base shots:`, sceneBaseMap);
    console.log(`[AI2] Base indices:`, [...baseIndices]);
    console.log(`[AI2] Non-base indices:`, nonBaseIndices);
    console.log(`[AI2] ===========================================`);

    // Store base shot URLs after generation
    const sceneBaseUrls: Record<string, string> = {};

    // Helper function to generate a single shot
    const generateShot = async (shot: any, i: number, extraRefs: string[] = []) => {
      setGeneratedAssets(prev => prev.map((a, idx) =>
        idx === i ? { ...a, status: 'generating' } : a
      ));

      try {
        // Get per-shot refs if specified
        let shotRefUrls: string[] = [];
        const charRefs = shot.character_refs || [];
        const sceneRefIds = shot.scene_refs || [];
        const basePlateRefIds = shot.base_plate_refs || []; // NEW: base plate refs
        const shotSpecificRefs = [...basePlateRefIds, ...charRefs, ...sceneRefIds]; // Base plates FIRST for priority

        if (shotSpecificRefs.length > 0) {
          // SMART MATCHING: Shot has specific refs defined - USE THEM
          shotRefUrls = shotSpecificRefs
            .map((refId: string) => {
              // Try multiple lookup patterns to find the ref
              const url = refUrlMap[refId] ||
                         refUrlMap[`char-${refId}`] ||
                         refUrlMap[`loc-${refId}`] ||
                         refUrlMap[`baseplate-${refId}`] ||
                         refUrlMap[`prop-${refId}`] ||
                         refUrlMap[`char-uploaded-${refId}`] ||
                         refUrlMap[`loc-uploaded-${refId}`] ||
                         refUrlMap[`prop-uploaded-${refId}`];
              if (!url) {
                console.warn(`[AI2] Shot ${i + 1}: Could not find ref "${refId}" in refUrlMap. Available keys:`, Object.keys(refUrlMap));
              }
              return url;
            })
            .filter(Boolean);
          console.log(`[AI2] Shot ${i + 1}: Using ${shotRefUrls.length}/${shotSpecificRefs.length} SPECIFIC refs:`, shotSpecificRefs);
          if (basePlateRefIds.length > 0) {
            console.log(`[AI2] Shot ${i + 1}: Includes ${basePlateRefIds.length} BASE PLATE refs for environment consistency`);
          }
        } else {
          // NO specific refs defined - use SMART TYPE MATCHING
          // Analyze shot prompt to determine what refs are needed
          const shotPromptLower = (shot.photo_prompt || shot.prompt || '').toLowerCase();
          const hasCharacterInShot = shotPromptLower.includes('character') ||
                                     shotPromptLower.includes('person') ||
                                     shotPromptLower.includes('man') ||
                                     shotPromptLower.includes('woman') ||
                                     shot.subject;
          const hasLocationInShot = shotPromptLower.includes('location') ||
                                    shotPromptLower.includes('background') ||
                                    shotPromptLower.includes('environment') ||
                                    shotPromptLower.includes('scene');

          // Build refs based on what's in the shot
          if (hasCharacterInShot && allCharacterRefs.length > 0) {
            shotRefUrls.push(...allCharacterRefs);
            console.log(`[AI2] Shot ${i + 1}: Added ${allCharacterRefs.length} character refs (detected character in prompt)`);
          }
          if (hasLocationInShot && allLocationRefs.length > 0) {
            shotRefUrls.push(...allLocationRefs);
            console.log(`[AI2] Shot ${i + 1}: Added ${allLocationRefs.length} location refs (detected location in prompt)`);
          }

          // If no smart match found, fall back to all refs
          if (shotRefUrls.length === 0 && allApprovedRefUrls.length > 0) {
            shotRefUrls = [...allApprovedRefUrls];
            console.log(`[AI2] Shot ${i + 1}: Using ALL ${shotRefUrls.length} refs (no specific match found)`);
          } else if (shotRefUrls.length > 0) {
            console.log(`[AI2] Shot ${i + 1}: SMART matched ${shotRefUrls.length} refs`);
          }
        }

        // Add extra refs (base shot URL for non-base shots) at the FRONT for priority
        if (extraRefs.length > 0) {
          shotRefUrls = [...extraRefs, ...shotRefUrls];
          console.log(`[AI2] Shot ${i + 1}: Added BASE shot ref for scene consistency`);
        }

        let prompt = shot.photo_prompt || shot.prompt || `Shot ${i + 1}`;

        // ============ INJECT CHARACTER DETAILS INTO PROMPT ============
        // Look up character from plan.character_references and add description/costume
        const characterRefs = plan.character_references || {};
        const shotSubject = shot.subject?.toLowerCase();

        if (shotSubject && Object.keys(characterRefs).length > 0) {
          // Find matching character (case-insensitive)
          const charKey = Object.keys(characterRefs).find(k =>
            k.toLowerCase() === shotSubject ||
            characterRefs[k]?.name?.toLowerCase() === shotSubject
          );

          if (charKey && characterRefs[charKey]) {
            const char = characterRefs[charKey];
            const charDesc = char.description || '';
            const charCostume = char.costume || '';

            // Build character details string
            let charDetails = '';
            if (charDesc && !prompt.toLowerCase().includes(charDesc.toLowerCase().substring(0, 20))) {
              charDetails += charDesc;
            }
            if (charCostume && !prompt.toLowerCase().includes(charCostume.toLowerCase().substring(0, 20))) {
              charDetails += (charDetails ? '. ' : '') + charCostume;
            }

            // Inject BEFORE "THIS EXACT CHARACTER" if present, or at start
            if (charDetails) {
              if (prompt.includes('THIS EXACT CHARACTER')) {
                // Insert character details after "THIS EXACT CHARACTER"
                prompt = prompt.replace(
                  'THIS EXACT CHARACTER',
                  `THIS EXACT CHARACTER (${charDetails})`
                );
              } else {
                // Prepend character details
                prompt = `${charDetails}. ${prompt}`;
              }
              console.log(`[AI2] Shot ${i + 1}: Injected character details for "${char.name || charKey}"`);
            }
          }
        }

        // ============ DIRECTION LOCK ============
        // For travel/motion scenes, lock direction to prevent continuity breaks
        const directionLock = plan.direction_lock;
        if (directionLock && !prompt.includes('NO DIRECTION FLIP') && !prompt.includes('NO MIRRORING')) {
          let directionPhrase = 'NO MIRRORING. NO DIRECTION FLIP.';

          // Add specific direction cues
          if (directionLock.vertical === 'DESCENDING') {
            directionPhrase = `road DESCENDING, mountains BELOW, ${directionPhrase}`;
          } else if (directionLock.vertical === 'ASCENDING') {
            directionPhrase = `road ASCENDING, mountains ABOVE, ${directionPhrase}`;
          }

          if (directionLock.horizontal === 'LEFT_TO_RIGHT') {
            directionPhrase = `traveling LEFT_TO_RIGHT, ${directionPhrase}`;
          } else if (directionLock.horizontal === 'RIGHT_TO_LEFT') {
            directionPhrase = `traveling RIGHT_TO_LEFT, ${directionPhrase}`;
          }

          prompt = `${prompt}. ${directionPhrase}`;
          console.log(`[AI2] Shot ${i + 1}: Applied DIRECTION LOCK (${directionLock.horizontal || ''} ${directionLock.vertical || ''})`);
        }

        // For non-base shots, add "THIS EXACT BACKGROUND" to lock environment
        if (extraRefs.length > 0 && !prompt.includes('THIS EXACT BACKGROUND')) {
          prompt = `THIS EXACT BACKGROUND, THIS EXACT ENVIRONMENT, ${prompt}`;
        }

        const finalPrompt = buildPrompt(prompt, useColorLock && shotRefUrls.length > 0);

        const requestType = shotRefUrls.length > 0 ? 'edit' : 'image';
        const requestBody = {
          type: requestType,
          prompt: finalPrompt,
          aspect_ratio: aspectRatio,
          resolution: '2K',
          image_urls: shotRefUrls.length > 0 ? shotRefUrls : undefined
        };

        console.log(`[AI2] Shot ${i + 1} ${baseIndices.has(i) ? '(BASE)' : ''} REQUEST:`, {
          type: requestType,
          refs: shotRefUrls.length,
          prompt: finalPrompt.substring(0, 80) + '...'
        });

        const response = await fetch('/api/cinema/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        const imageUrl = data.image_url || data.images?.[0]?.url || data.image?.url || data.url;
        console.log(`[AI2] Shot ${i + 1} result:`, imageUrl ? 'SUCCESS' : 'FAILED');

        setGeneratedAssets(prev => prev.map((a, idx) =>
          idx === i ? { ...a, status: (imageUrl ? 'done' : 'error') as 'done' | 'error', url: imageUrl } : a
        ));
        setGenerationProgress(prev => ({ ...prev, current: prev.current + 1 }));

        return { index: i, success: !!imageUrl, url: imageUrl, sceneId: shot.scene_id || 'default' };
      } catch (error) {
        console.error(`[AI2] Shot ${i + 1} error:`, error);
        setGeneratedAssets(prev => prev.map((a, idx) =>
          idx === i ? { ...a, status: 'error', error: String(error) } : a
        ));
        return { index: i, success: false };
      }
    };

    // ============ PHASE 1: Generate BASE shots first ============
    console.log(`[AI2] PHASE 1: Generating ${baseIndices.size} base shots...`);
    const basePromises = [...baseIndices].map(i => generateShot(shots[i], i, []));
    const baseResults = await Promise.all(basePromises);

    // Store base shot URLs for each scene
    baseResults.forEach(result => {
      if (result.success && result.url && result.sceneId) {
        sceneBaseUrls[result.sceneId] = result.url;
        console.log(`[AI2] Scene "${result.sceneId}" base shot URL stored`);
      }
    });

    // ============ PHASE 2: Generate NON-BASE shots with base refs ============
    console.log(`[AI2] PHASE 2: Generating ${nonBaseIndices.length} non-base shots with base refs...`);
    const nonBasePromises = nonBaseIndices.map((i: number) => {
      const shot = shots[i];
      const sceneId = shot.scene_id || 'default';
      const baseUrl = sceneBaseUrls[sceneId];
      const extraRefs = baseUrl ? [baseUrl] : [];
      return generateShot(shot, i, extraRefs);
    });
    const nonBaseResults = await Promise.all(nonBasePromises);

    // Combine all results
    const imageResults = [...baseResults, ...nonBaseResults];
    const successfulImages = imageResults.filter(r => r.success && r.url);
    console.log(`[AI2] All images complete: ${successfulImages.length}/${imageResults.length} successful`);

    // If auto-approve is ON, skip approval and continue to videos
    if (autoApprove) {
      console.log('[AI2] Auto-approve ON - auto-approving images and generating videos...');

      // Build the approved assets directly from results to avoid stale closure
      const approvedAssets = successfulImages.map(result => ({
        ...assets[result.index],
        url: result.url,
        status: 'done' as const,
        approved: true
      }));

      // Update state for UI
      setGeneratedAssets(prev => prev.map((a, idx) => {
        const result = successfulImages.find(r => r.index === idx);
        if (result) {
          return { ...a, status: 'done', url: result.url, approved: true };
        }
        return a;
      }));

      // Pass approved assets directly to video generation (fixes stale closure!)
      await generateVideosWithAssets(approvedAssets);
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
          aspect_ratio: aspectRatio,
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
  // Can receive assets directly to avoid stale closure issues
  // FRAME CHAINING: When enabled, generates sequentially and uses last frame of each video as input for next
  const generateVideosWithAssets = async (passedAssets?: GeneratedAsset[]) => {
    const approvedAssets = passedAssets || generatedAssets.filter(a => a.approved === true && a.status === 'done' && a.url);
    if (approvedAssets.length === 0) {
      console.log('[AI2] No approved shots to generate videos for');
      return;
    }
    console.log(`[AI2] generateVideosWithAssets called with ${approvedAssets.length} assets (passed directly: ${!!passedAssets})`);
    console.log(`[AI2] Frame chaining: ${enableChaining ? 'ENABLED (sequential)' : 'DISABLED (parallel)'}`);

    setIsGeneratingAssets(true);
    setPipelinePhase('videos');
    setGenerationProgress({ current: 0, total: approvedAssets.length });
    console.log(`[AI2] Generating ${approvedAssets.length} videos for approved shots using model: ${videoModel}...`);

    // Helper function to generate a single video
    const generateSingleVideo = async (asset: GeneratedAsset, approvedIndex: number, chainedFrameUrl?: string) => {
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
          aspect_ratio: aspectRatio
        };

        // FRAME CHAINING: If we have a chained frame from previous video, use it as start
        const startImageUrl = chainedFrameUrl || compressedUrl;
        if (chainedFrameUrl) {
          console.log(`[AI2] 🔗 CHAIN: Using previous video's last frame as start`);
        }

        // Model-specific parameters
        if (apiType === 'video-kling-o1') {
          requestBody.start_image_url = startImageUrl;
          requestBody.duration = duration;

          // If there's a next approved asset, use it as end frame for smooth transition
          if (approvedIndex < approvedAssets.length - 1) {
            const nextAsset = approvedAssets[approvedIndex + 1];
            if (nextAsset?.url) {
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
          requestBody.image_url = startImageUrl;
        } else {
          requestBody.image_url = startImageUrl;
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
    };

    // Helper function to extract last frame from video
    const extractLastFrame = async (videoUrl: string): Promise<string | null> => {
      try {
        console.log(`[AI2] 🎞️ Extracting last frame from: ${videoUrl.substring(0, 50)}...`);
        const response = await fetch('/api/cinema/extract-frame', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ video_url: videoUrl, position: 'last' })
        });

        if (!response.ok) {
          console.error('[AI2] Frame extraction failed:', response.status);
          return null;
        }

        const data = await response.json();
        const frameUrl = data.frame_url;
        console.log(`[AI2] ✅ Frame extracted: ${frameUrl?.substring(0, 50)}...`);
        setLastExtractedFrame(frameUrl);
        return frameUrl;
      } catch (error) {
        console.error('[AI2] Frame extraction error:', error);
        return null;
      }
    };

    let videoResults: Array<{ index: number; success: boolean; url?: string }> = [];

    if (enableChaining && approvedAssets.length > 1) {
      // SEQUENTIAL GENERATION with frame chaining
      console.log('[AI2] 🔗 Starting SEQUENTIAL video generation with frame chaining...');
      let chainedFrame: string | null = null;

      for (let i = 0; i < approvedAssets.length; i++) {
        const asset = approvedAssets[i];
        console.log(`[AI2] Processing video ${i + 1}/${approvedAssets.length}${chainedFrame ? ' (with chained frame)' : ''}`);

        // Generate video (using chained frame if available)
        const result = await generateSingleVideo(asset, i, chainedFrame || undefined);
        videoResults.push(result);

        // Extract last frame for next video (if not the last one)
        if (result.success && result.url && i < approvedAssets.length - 1) {
          chainedFrame = await extractLastFrame(result.url);
          if (!chainedFrame) {
            console.warn('[AI2] ⚠️ Frame extraction failed, next video will use its own image');
          }
        }
      }
    } else {
      // PARALLEL GENERATION (original behavior, faster but no chaining)
      console.log('[AI2] ⚡ Starting PARALLEL video generation (no chaining)...');
      const videoPromises = approvedAssets.map((asset, i) => generateSingleVideo(asset, i));
      videoResults = await Promise.all(videoPromises);
    }

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
      setFinalVideoUrl(singleUrl ?? null);
      // Add completion message to chat
      if (singleUrl) {
        addMessage('assistant', `🎬 **Video Complete!**\n\nSingle clip ready.\n\n[▶️ Watch Video](${singleUrl})`);
      }
    }

    setPipelinePhase('done');
    setIsGeneratingAssets(false);
  };

  // Wrapper for UI buttons (reads from state)
  const generateVideosForApproved = async () => {
    await generateVideosWithAssets();
  };

  // ============================================
  // SPEC PIPELINE (PDF Bible v4.0)
  // ============================================

  /**
   * Run the UNIFIED pipeline - Director + Council + Spec + Validation ALL IN ONE
   * No toggles, no modes - just complete production planning
   */
  const runSpecPipeline = async (concept: string, targetDuration: number = 30) => {
    console.log('[AI2] 🚀 Running UNIFIED Pipeline for:', concept.substring(0, 50) + '...');
    addMessage('assistant', `🎬 **UNIFIED PIPELINE Started**

**Phase 0:** World Engineering (3D coordinates, entities, lighting)
**Phase 1:** Director Analysis (scene type, shot patterns, film grammar)
**Phase 1b:** Council Deliberation (narrative, visual, technical, production)
**Phase 2:** Ref Strategy (which refs for which shots)
**Phase 3:** Beat Planning (story moments with timing)
**Phase 4:** Shot Compilation (photo & video prompts)
**Phase 5:** Validation (continuity check)

Running all phases automatically...`);

    try {
      setIsGeneratingAssets(true);
      setPipelinePhase('refs');

      // Create a new session for persistence
      const session = worldStatePersistence.createSession({
        projectName: concept.substring(0, 30),
        concept,
        targetDuration
      });
      setSpecSessionId(session.projectId);

      // Collect refs from uploaded images
      const refInputs = [
        ...characterRefs.map(r => ({ url: r.url, name: r.name, type: 'character' as const })),
        ...locationRefs.map(r => ({ url: r.url, name: r.name, type: 'location' as const })),
        ...productRefs.map(r => ({ url: r.url, name: r.name, type: 'prop' as const }))
      ];

      // Run the UNIFIED PIPELINE V2 (complete rewrite with all new agents!)
      const result = await unifiedPipelineV2.run(
        {
          concept,
          targetDuration,
          refs: refInputs,
          generateRefs: refInputs.length === 0  // Auto-generate if no refs provided
        },
        // Ref generator callback (optional - for auto-generating refs)
        async (params) => {
          console.log('[AI2] Generating ref:', params.name, params.type);
          const response = await fetch('/api/cinema/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: params.prompt,
              image_size: 'square_hd',
              num_images: 1
            })
          });
          const data = await response.json();
          return { url: data.images?.[0]?.url || '' };
        },
        // Progress callback - UPDATE UI IN REAL TIME
        (phase, message) => {
          console.log(`[AI2] ${phase}: ${message}`);
          // Show status message in UI
          setPipelineStatus(`${phase}: ${message}`);
          // Update UI with phase info - map V2 phases to UI phases
          if (phase.startsWith('PHASE_')) {
            const phaseNum = parseInt(phase.split('_')[1]);
            // Phases 1-4: Story/Beat/Coverage/Director = refs prep
            // Phases 5-9: Script/World/RefPlan/RefGen/RefValidate = refs
            // Phases 10-11: ShotCompiler/Audio = images prep
            // Phases 12-15: Continuity/Editor/Producer/Verification = images
            if (phaseNum <= 9) setPipelinePhase('refs');
            else setPipelinePhase('images');
          }
        }
      );

      // Store results (compatible with existing state)
      setSpecWorldState(result.world);
      setSpecBeats(result.beats);
      setSpecShotCards(result.shots);

      // Save to persistence
      worldStatePersistence.saveWorldState(session.projectId, result.world);
      worldStatePersistence.saveShotCards(session.projectId, result.shots.shotCards);

      console.log('[AI2] ✅ UNIFIED Pipeline complete:', result.shots.shotCards.length, 'shots');

      // Convert shot cards to the existing GeneratedAsset format
      const assets: GeneratedAsset[] = result.shots.shotCards.map((card: ShotCard) => ({
        id: card.shot_id,
        type: 'image' as const,
        prompt: card.photo_prompt,
        motionPrompt: card.video_motion_prompt,
        status: 'pending' as const,
        duration: String(card.video_duration_seconds) as '5' | '10'
      }));

      setGeneratedAssets(assets);

      // Build a plan object compatible with existing flow
      const specPlan = {
        name: 'Unified Pipeline',
        shots: result.shots.shotCards.map((card: ShotCard) => ({
          shot_id: card.shot_id,
          photo_prompt: card.photo_prompt,
          motion_prompt: card.video_motion_prompt,
          camera_rig: card.camera_rig_id,
          lens_mm: card.lens_mm,
          video_model: card.video_model,
          duration: card.video_duration_seconds
        })),
        world_state: result.world.worldState,
        character_references: {},
        scene_references: {},
        // V2: Include all new agent data
        direction: result.direction,
        storyAnalysis: result.storyAnalysis,
        coverage: result.coverage,
        script: result.script,
        refPlan: result.refPlan,
        editAdvice: result.editAdvice
      };

      setCurrentPlan(specPlan);

      // Build comprehensive summary message (V2)
      const worldSummary = result.world?.worldState;
      const directionSummary = result.direction;
      const storyAnalysis = result.storyAnalysis;
      const continuity = result.continuity;
      const verification = result.verification;

      // Calculate model distribution
      const modelCounts: Record<string, number> = {};
      for (const shot of result.direction?.shot_sequence || []) {
        const model = shot.video_model || 'kling-2.6';
        modelCounts[model] = (modelCounts[model] || 0) + 1;
      }
      const modelSummary = Object.entries(modelCounts).map(([m, c]) => `${m}: ${c}`).join(', ');

      addMessage('assistant', `✅ **UNIFIED PIPELINE V2 Complete!**

**🧠 Story Analysis:**
- Type: **${storyAnalysis?.concept_analysis?.story_type || 'Analyzed'}**
- Core Emotion: ${storyAnalysis?.concept_analysis?.core_emotion || 'Identified'}
- Director Style: ${storyAnalysis?.director_recommendation?.director || 'Recommended'}

**📷 Coverage Planning:**
- Total Angles: ${result.coverage?.total_angles_planned || 0}
- Recommended Shots: ${result.coverage?.recommended_total_shots || 0}
- Estimated Cost: $${result.coverage?.estimated_cost?.recommended?.toFixed(2) || '0.00'}

**🎬 Director's Plan:**
- Scene Type: **${directionSummary?.scene_analysis?.scene_type || 'Analyzed'}**
- Shots: ${directionSummary?.shot_sequence?.length || 0}
- Energy Arc: ${directionSummary?.scene_analysis?.energy_arc?.join(' → ') || 'Planned'}

**🎯 Model Selection:**
${modelSummary || 'Determined per shot'}

**✍️ Script:**
- Dialogue Lines: ${result.script?.summary?.total_dialogue_lines || 0}
- Voiceover Segments: ${result.script?.summary?.total_voiceover_segments || 0}
- Needs Lip Sync: ${result.script?.summary?.needs_lip_sync ? 'Yes' : 'No'}

**🖼️ Refs:**
- Planned: ${result.refPlan?.summary?.total_refs_needed || 0}
- Generated: ${result.masterRefs?.length || 0}
- Validation: ${result.refValidation?.summary?.shots_ready || 0}/${result.refValidation?.summary?.total_shots || 0} ready

**✂️ Editing:**
- Style: ${result.editAdvice?.summary?.editing_style || 'Determined'}
- Edited Duration: ${(result.editAdvice?.total_edited_duration_ms || 0) / 1000}s

**📋 Production:**
- Beats: ${result.beats?.beats?.length || 0} story beats
- Shots: ${result.shots?.shotCards?.length || 0} shot cards ready
- Total Assets: ${result.productionManifest?.summary?.totalAssets || 0}

**✓ Verification:** Score ${verification?.score || 0}/100 ${verification?.passed ? '✅ PASSED' : '⚠️ Issues found'}
${verification?.issues?.length ? `- ${verification.issues.length} issues to review` : ''}

**⏱️ Timing:** ${result.timing?.total || 0}ms total

Click **Execute Plan** to start generating images and videos.`);

      setPipelinePhase('idle');
      setIsGeneratingAssets(false);

      return result;

    } catch (error) {
      console.error('[AI2] ❌ Spec Pipeline error:', error);
      addMessage('assistant', `❌ **Spec Pipeline Error**\n\n${error}`);
      setPipelinePhase('idle');
      setIsGeneratingAssets(false);
      throw error;
    }
  };

  /**
   * Execute the spec plan using shot cards
   */
  const executeSpecPlan = async () => {
    if (!specShotCards || specShotCards.shotCards.length === 0) {
      console.log('[AI2] No spec shot cards to execute');
      return;
    }

    console.log('[AI2] Executing spec plan with', specShotCards.shotCards.length, 'shot cards');

    // Build refs from THE_STACK
    const stack = TheStack.fromRefInputs([
      ...characterRefs.map(r => ({ url: r.url, name: r.name, type: 'character' as const })),
      ...locationRefs.map(r => ({ url: r.url, name: r.name, type: 'location' as const })),
      ...productRefs.map(r => ({ url: r.url, name: r.name, type: 'prop' as const }))
    ]);

    // Convert to plan format and execute
    const plan = {
      name: 'Spec Execution',
      shots: specShotCards.shotCards.map((card: ShotCard) => ({
        shot_id: card.shot_id,
        photo_prompt: card.photo_prompt,
        motion_prompt: card.video_motion_prompt,
        video_model: card.video_model,
        duration: card.video_duration_seconds
      })),
      character_references: characterRefs.length > 0 ? { main: { name: characterRefs[0].name, description: characterRefs[0].name } } : {},
      scene_references: locationRefs.length > 0 ? { main: { name: locationRefs[0].name, description: locationRefs[0].name } } : {}
    };

    await generateFromJsonPlan(plan);
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
      aspect_ratio: aspectRatio
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
          aspect_ratio: aspectRatio,
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
    <div className="h-screen bg-vs-dark flex flex-col overflow-hidden">
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

          {/* 3D Camera toggle - OPTIONAL override for specific angles (consistency is automatic) */}
          <button
            onClick={() => setShowCameraControl(!showCameraControl)}
            className={`px-3 py-1.5 text-sm rounded-lg transition flex items-center gap-1.5 ${
              showCameraControl
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                : 'bg-white/10 text-white/50 hover:bg-white/20'
            }`}
            title="3D Camera: OPTIONAL - Force specific angle/distance. Consistency is already automatic for same-scene shots."
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            3D
          </button>

          {/* Council Panel toggle */}
          <button
            onClick={() => setShowCouncilPanel(!showCouncilPanel)}
            className={`px-3 py-1.5 text-sm rounded-lg transition flex items-center gap-1.5 ${
              showCouncilPanel
                ? 'bg-violet-500/30 text-violet-300 border border-violet-500/50'
                : 'bg-white/10 text-white/50 hover:bg-white/20'
            }`}
            title="Council: 4 AI agents deliberate on model, motion, continuity before generation"
          >
            <span className="text-base">🧠</span>
            Council
          </button>

          {/* SPEC PIPELINE toggle (PDF Bible v4.0) */}
          <button
            onClick={() => setUseSpecPipeline(!useSpecPipeline)}
            className={`px-3 py-1.5 text-sm rounded-lg transition flex items-center gap-1.5 ${
              useSpecPipeline
                ? 'bg-teal-500/30 text-teal-300 border border-teal-500/50'
                : 'bg-white/10 text-white/50 hover:bg-white/20'
            }`}
            title="Spec Pipeline: WorldEngineer → BeatPlanner → ShotCompiler (PDF Bible v4.0)"
          >
            <span className="text-base">🌍</span>
            Spec
          </button>

          {/* Agent Debug Panel toggle */}
          <button
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className={`px-3 py-1.5 text-sm rounded-lg transition flex items-center gap-1.5 ${
              showDebugPanel
                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                : 'bg-white/10 text-white/50 hover:bg-white/20'
            }`}
            title="Debug: View all agent prompts, test agents, see data flow"
          >
            <span className="text-base">🔧</span>
            Debug
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

        {/* LEFT: Chat Panel - Wide for comfortable reading */}
        <aside className="w-[520px] min-w-[520px] border-r border-vs-border bg-vs-card/30 flex flex-col">
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
            {/* Model Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-purple-300 hover:bg-purple-500/20 transition"
              >
                <span>{MODEL_INFO[model]?.name || model}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showModelDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-zinc-900 border border-white/10 rounded-lg shadow-xl z-50 min-w-[180px] py-1">
                  {[
                    { id: 'claude-opus', name: 'Claude Opus 4.5', desc: 'Best reasoning', color: 'purple' },
                    { id: 'claude-sonnet', name: 'Claude Sonnet', desc: 'Fast & capable', color: 'purple' },
                    { id: 'gpt-5.2', name: 'GPT-5.2', desc: 'OpenAI latest', color: 'green' },
                    { id: 'gpt-4o', name: 'GPT-4o', desc: 'OpenAI reliable', color: 'green' },
                    { id: 'qwen', name: 'Qwen 3 8B', desc: 'Local (Ollama)', color: 'orange' },
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setModel(m.id as any); setShowModelDropdown(false); }}
                      className={`w-full px-3 py-2 text-left hover:bg-white/5 flex items-center justify-between ${
                        model === m.id ? 'bg-white/10' : ''
                      }`}
                    >
                      <div>
                        <div className={`text-sm ${m.color === 'purple' ? 'text-purple-300' : m.color === 'green' ? 'text-green-300' : 'text-orange-300'}`}>{m.name}</div>
                        <div className="text-[10px] text-white/40">{m.desc}</div>
                      </div>
                      {model === m.id && <span className="text-green-400">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Messages - Scrollable, content pushed to bottom like Claude web */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col">
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
              <>
              {/* Spacer to push messages to bottom when few */}
              <div className="flex-1 min-h-0" />
              <div className="space-y-3">
              {messages.map((msg) => {
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
                      {/* Render images if message contains markdown images */}
                      {showText.includes('![') && showText.includes('](') ? (
                        <div className="leading-relaxed">
                          {showText.split(/(\!\[[^\]]*\]\([^)]+\))/).map((part, i) => {
                            const imgMatch = part.match(/\!\[([^\]]*)\]\(([^)]+)\)/);
                            if (imgMatch) {
                              return (
                                <div key={i} className="my-2">
                                  <img
                                    src={imgMatch[2]}
                                    alt={imgMatch[1]}
                                    className="max-w-[200px] max-h-[200px] rounded-lg border border-white/20 object-cover"
                                  />
                                </div>
                              );
                            }
                            return <span key={i} className="whitespace-pre-wrap">{part}</span>;
                          })}
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap leading-relaxed">{showText}</div>
                      )}
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
              })}
              </div>
              </>
            )}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-vs-dark border border-vs-border rounded-xl px-3 py-2.5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400 text-xs">🤖</span>
                      <span className="text-white/70 text-sm">Claude is thinking...</span>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                    {pipelineStatus && (
                      <div className="text-xs text-cyan-400 font-mono pl-5 animate-pulse">
                        {pipelineStatus}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Pipeline Progress - Show when running spec pipeline */}
            {isGeneratingAssets && pipelineStatus && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-cyan-500/30 rounded-xl px-4 py-3 max-w-md">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 text-sm">⚡</span>
                      <span className="text-cyan-300 text-sm font-semibold">Pipeline Running</span>
                    </div>
                    <div className="text-xs text-white/90 font-mono bg-black/30 px-2 py-1 rounded">
                      {pipelineStatus}
                    </div>
                    {generationProgress.total > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300"
                            style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/50">{generationProgress.current}/{generationProgress.total}</span>
                      </div>
                    )}
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
                {refImages.map((img, idx) => {
                  const isUploading = (img as any)._uploading === true;
                  const isFailed = (img as any)._failed === true;
                  const isReady = img.url?.startsWith('http');
                  return (
                    <div key={idx} className={`relative group w-12 h-12 rounded-lg overflow-hidden border ${
                      isUploading ? 'border-yellow-500 animate-pulse' :
                      isFailed ? 'border-red-500' :
                      isReady ? 'border-green-500' : 'border-white/20'
                    }`}>
                      <img src={img.url} alt="" loading="lazy" className="w-full h-full object-cover" />
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      {isFailed && (
                        <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                          <span className="text-red-300 text-lg">!</span>
                        </div>
                      )}
                      {isReady && !isUploading && (
                        <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-green-500 rounded-full" />
                      )}
                      <button
                        onClick={() => removeRefImage(idx)}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-red-400 text-sm"
                      >×</button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Input row - clean and aligned */}
            <div className="flex gap-2 items-center">
              {/* Single image upload button */}
              <input type="file" id="ref-upload" accept="image/*" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0]; if (!file) return;
                // Read file and show modal for type selection
                const reader = new FileReader();
                reader.onload = (ev) => {
                  const dataUrl = ev.target?.result as string;
                  setPendingRefFile({ file, dataUrl });
                  setPendingRefName('');
                  setShowRefUploadModal(true);
                };
                reader.readAsDataURL(file);
                e.target.value = '';
              }} />
              <button
                onClick={() => document.getElementById('ref-upload')?.click()}
                className="h-11 w-11 flex items-center justify-center bg-purple-500/20 text-purple-300 rounded-xl hover:bg-purple-500/30 transition flex-shrink-0"
                title="Add Reference Image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>

              {/* Aspect Ratio Toggle */}
              <button
                onClick={() => {
                  const ratios: AspectRatio[] = ['16:9', '9:16', '1:1'];
                  const currentIdx = ratios.indexOf(aspectRatio);
                  setAspectRatio(ratios[(currentIdx + 1) % ratios.length]);
                }}
                className={`h-11 px-3 flex items-center justify-center gap-1.5 rounded-xl transition flex-shrink-0 ${
                  aspectRatio === '16:9' ? 'bg-blue-500/20 text-blue-300' :
                  aspectRatio === '9:16' ? 'bg-pink-500/20 text-pink-300' :
                  'bg-orange-500/20 text-orange-300'
                }`}
                title={`Aspect Ratio: ${aspectRatio} (click to change)`}
              >
                <span className="text-sm">{aspectRatio === '16:9' ? '📺' : aspectRatio === '9:16' ? '📱' : '⬜'}</span>
                <span className="text-xs font-medium">{aspectRatio}</span>
              </button>

              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your video..."
                className="flex-1 h-11 bg-vs-dark border border-vs-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 resize-none focus:outline-none focus:border-purple-500/50"
                rows={1}
                disabled={isGenerating}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isGenerating || isGeneratingAssets}
                className="h-11 w-11 flex items-center justify-center bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>

            {/* Execute Button - Shows when there's a plan ready */}
            {(() => {
              const latestPlanMsg = [...messages].reverse().find(m => m.role === 'assistant' && extractJsonPlan(m.content)?.shots);
              const latestPlan = latestPlanMsg ? extractJsonPlan(latestPlanMsg.content) : null;
              const hasPlan = latestPlan && latestPlan.shots && latestPlan.shots.length > 0;

              // Check if any refs are still uploading (have _uploading flag)
              const pendingUploads = refImages.filter(r => (r as any)._uploading === true);
              const failedUploads = refImages.filter(r => (r as any)._failed === true);
              const hasReadyRefs = refImages.filter(r => r.url?.startsWith('http')).length;

              // Get latest user message for spec pipeline concept
              const latestUserMsg = [...messages].reverse().find(m => m.role === 'user');
              const concept = latestUserMsg?.content || input;

              if (hasPlan && !isGenerating && !isGeneratingAssets) {
                return (
                  <div className="space-y-2">
                    {pendingUploads.length > 0 && (
                      <div className="text-xs text-yellow-400 flex items-center gap-2 justify-center">
                        <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                        Uploading {pendingUploads.length} ref(s)... (15s timeout)
                      </div>
                    )}
                    {failedUploads.length > 0 && pendingUploads.length === 0 && (
                      <div className="text-xs text-red-400 flex items-center gap-2 justify-center">
                        ⚠️ {failedUploads.length} ref(s) failed to upload - will run without them
                      </div>
                    )}

                    {/* SPEC PIPELINE BUTTON (when enabled) */}
                    {useSpecPipeline && (
                      <button
                        onClick={() => runSpecPipeline(concept, 30)}
                        disabled={pendingUploads.length > 0 || !concept}
                        className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="text-lg">🌍</span>
                        Run Spec Pipeline (World → Beats → Shots)
                      </button>
                    )}

                    {/* Standard Execute Button */}
                    <button
                      onClick={() => useSpecPipeline && specShotCards ? executeSpecPlan() : generateFromJsonPlan(latestPlan)}
                      disabled={pendingUploads.length > 0}
                      className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {useSpecPipeline && specShotCards
                        ? `Execute Spec (${specShotCards.shotCards.length} shots)`
                        : `Execute Plan (${latestPlan.shots.length} shots)`}{hasReadyRefs > 0 ? ` + ${hasReadyRefs} refs` : ''}
                    </button>
                  </div>
                );
              }

              // Show SPEC button even without a plan (if spec mode is on)
              if (useSpecPipeline && !isGenerating && !isGeneratingAssets && concept) {
                return (
                  <div className="space-y-2">
                    <button
                      onClick={() => runSpecPipeline(concept, 30)}
                      className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition flex items-center justify-center gap-2 font-semibold"
                    >
                      <span className="text-lg">🌍</span>
                      Run Spec Pipeline
                    </button>
                    <div className="text-xs text-white/40 text-center">
                      WorldEngineer → BeatPlanner → ShotCompiler
                    </div>
                  </div>
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

        {/* CENTER: Output Panel - Clean: Refs → Photos → Videos */}
        <main className="flex-1 flex flex-col overflow-hidden bg-vs-dark">
          <div className="flex-1 flex flex-col p-4 min-h-0">
            {(() => {
              // Find the latest plan from messages
              const latestPlanMsg = [...messages].reverse().find(m => m.role === 'assistant' && extractJsonPlan(m.content)?.shots);
              const latestPlan = latestPlanMsg ? extractJsonPlan(latestPlanMsg.content) : null;
              const hasPlan = latestPlan && latestPlan.shots && latestPlan.shots.length > 0;

              // Combine all refs from plan + user uploads
              const planChars = latestPlan?.character_references || {};
              const planLocs = latestPlan?.scene_references || {};
              const planItems = latestPlan?.item_references || latestPlan?.product_references || {};

              const allRefs: Array<{ id: string; name: string; type: 'char' | 'loc' | 'item' | 'baseplate'; desc?: string; url?: string; generated?: boolean }> = [];

              // User uploaded refs first
              refImages.forEach((r, i) => {
                const isChar = r.description?.startsWith('👤');
                const isLoc = r.description?.startsWith('📍') || r.description?.startsWith('🏔️');
                const isProp = r.description?.startsWith('📦');
                allRefs.push({
                  id: `upload-${i}`,
                  name: r.description?.replace(/^(👤|📍|🏔️|📦)\s*/, '') || 'Ref',
                  type: isChar ? 'char' : isLoc ? 'loc' : 'item',
                  url: r.url,
                  generated: false
                });
              });

              // Generated refs
              generatedRefs.forEach(ref => {
                allRefs.push({
                  id: ref.id,
                  name: ref.name,
                  type: ref.type === 'character' ? 'char' : ref.type === 'location' ? 'loc' : ref.type, // 'baseplate' and 'item' stay as-is
                  desc: ref.description,
                  url: ref.url,
                  generated: true
                });
              });

              // Plan-defined refs (not yet generated)
              Object.entries(planChars).forEach(([id, char]: [string, any]) => {
                if (!allRefs.find(r => r.name === (char.name || id))) {
                  allRefs.push({ id, name: char.name || id, type: 'char', desc: char.description });
                }
              });
              Object.entries(planLocs).forEach(([id, loc]: [string, any]) => {
                if (!allRefs.find(r => r.name === (loc.name || id))) {
                  allRefs.push({ id, name: loc.name || id, type: 'loc', desc: loc.description });
                }
              });
              Object.entries(planItems).forEach(([id, item]: [string, any]) => {
                if (!allRefs.find(r => r.name === (item.name || id))) {
                  allRefs.push({ id, name: item.name || id, type: 'item', desc: item.description });
                }
              });

              // Show output content
              if (!hasPlan && messages.length === 0 && generatedAssets.length === 0 && allRefs.length === 0) {
                // Empty state - show welcome
                return (
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">Your Project</h2>
                    <p className="text-white/50 text-sm text-center max-w-md">Upload refs and describe your video</p>
                  </div>
                );
              }

              return (
                <div className="flex flex-col h-full min-h-0 gap-4">
                  {/* 3D Camera Control Panel - for shot consistency */}
                  {showCameraControl && (
                    <div className="flex-shrink-0">
                      <CameraControl
                        onCameraChange={setCameraPrompt}
                        compact={false}
                      />
                    </div>
                  )}

                  {/* SECTION 1: REFS - With tabs for filtering (max 30% height) */}
                  {allRefs.length > 0 && (
                    <div className="flex-shrink-0 max-h-[30%] overflow-hidden flex flex-col">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-teal-400 text-xs font-semibold uppercase tracking-wider">REFS</span>
                        {/* Tabs for filtering */}
                        <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
                          <button
                            onClick={() => setRefViewTab('story')}
                            className={`px-2 py-0.5 text-[10px] rounded ${refViewTab === 'story' ? 'bg-teal-500 text-white' : 'text-white/50 hover:text-white'}`}
                          >All ({allRefs.length})</button>
                          <button
                            onClick={() => setRefViewTab('uploaded')}
                            className={`px-2 py-0.5 text-[10px] rounded ${refViewTab === 'uploaded' ? 'bg-pink-500 text-white' : 'text-white/50 hover:text-white'}`}
                          >📤 Uploaded ({allRefs.filter(r => !r.generated).length})</button>
                          <button
                            onClick={() => setRefViewTab('characters')}
                            className={`px-2 py-0.5 text-[10px] rounded ${refViewTab === 'characters' ? 'bg-purple-500 text-white' : 'text-white/50 hover:text-white'}`}
                          >Characters ({allRefs.filter(r => r.type === 'char').length})</button>
                          <button
                            onClick={() => setRefViewTab('locations')}
                            className={`px-2 py-0.5 text-[10px] rounded ${refViewTab === 'locations' ? 'bg-blue-500 text-white' : 'text-white/50 hover:text-white'}`}
                          >Locations ({allRefs.filter(r => r.type === 'loc').length})</button>
                          <button
                            onClick={() => setRefViewTab('baseplates')}
                            className={`px-2 py-0.5 text-[10px] rounded ${refViewTab === 'baseplates' ? 'bg-green-500 text-white' : 'text-white/50 hover:text-white'}`}
                          >Base Plates ({allRefs.filter(r => r.type === 'baseplate').length})</button>
                          <button
                            onClick={() => setRefViewTab('items')}
                            className={`px-2 py-0.5 text-[10px] rounded ${refViewTab === 'items' ? 'bg-orange-500 text-white' : 'text-white/50 hover:text-white'}`}
                          >Items ({allRefs.filter(r => r.type === 'item').length})</button>
                        </div>
                      </div>
                      <div className="flex gap-3 overflow-x-auto overflow-y-hidden pb-2 flex-1 min-h-0">
                        {allRefs
                          .filter(ref => {
                            if (refViewTab === 'story') return true;
                            if (refViewTab === 'uploaded') return !ref.generated; // Only user-uploaded refs
                            if (refViewTab === 'characters') return ref.type === 'char';
                            if (refViewTab === 'locations') return ref.type === 'loc';
                            if (refViewTab === 'baseplates') return ref.type === 'baseplate';
                            if (refViewTab === 'items') return ref.type === 'item';
                            return true;
                          })
                          .map((ref) => (
                          <div key={ref.id} className={`flex-shrink-0 p-3 rounded-xl border w-[220px] ${
                            ref.type === 'char' ? 'bg-purple-500/10 border-purple-500/30' :
                            ref.type === 'loc' ? 'bg-blue-500/10 border-blue-500/30' :
                            ref.type === 'baseplate' ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'
                          }`}>
                            {/* Large Thumbnail */}
                            <div className={`w-full aspect-video rounded-lg overflow-hidden relative mb-2 ${
                              ref.type === 'char' ? 'border border-purple-500/30' :
                              ref.type === 'loc' ? 'border border-blue-500/30' :
                              ref.type === 'baseplate' ? 'border border-green-500/30' : 'border border-orange-500/30'
                            } bg-vs-dark`}>
                              {ref.url ? (
                                <img src={ref.url} alt={ref.name} loading="lazy" className="w-full h-full object-cover" />
                              ) : generatedRefs.find(r => r.name === ref.name)?.status === 'generating' ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                                  <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                                </div>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/20 text-4xl">
                                  {ref.type === 'char' ? '👤' : ref.type === 'loc' ? '📍' : ref.type === 'baseplate' ? '🖼️' : '📦'}
                                </div>
                              )}
                            </div>
                            {/* Info */}
                            <div>
                              <div className="flex items-center justify-between">
                                <div className={`text-sm font-semibold ${
                                  ref.type === 'char' ? 'text-purple-300' :
                                  ref.type === 'loc' ? 'text-blue-300' :
                                  ref.type === 'baseplate' ? 'text-green-300' : 'text-orange-300'
                                }`}>{ref.name}</div>
                                <div className={`text-[9px] px-1.5 py-0.5 rounded ${
                                  ref.type === 'char' ? 'bg-purple-500/20 text-purple-400' :
                                  ref.type === 'loc' ? 'bg-blue-500/20 text-blue-400' :
                                  ref.type === 'baseplate' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                                }`}>
                                  {ref.type === 'char' ? 'Character' : ref.type === 'loc' ? 'Location' : ref.type === 'baseplate' ? 'Base Plate' : 'Prop'}
                                </div>
                              </div>
                              {ref.desc && (
                                <div className="text-[11px] text-white/60 mt-1 leading-snug line-clamp-3">{ref.desc}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SECTION 2: SHOTS - Tabs for Photos/Videos */}
                  {(generatedAssets.length > 0 || (hasPlan && latestPlan.shots.length > 0)) && (() => {
                    // Extract unique segments from shots
                    const shots = latestPlan?.shots || [];
                    const segments: string[] = [...new Set(shots.map((s: any) =>
                      s.segment || s.section || s.phase || s.act || s.beat || 'all'
                    ).filter((s: string) => s && s !== 'all'))] as string[];
                    // Calculate shot counts per segment
                    const getSegmentCount = (seg: string) => seg === 'all'
                      ? shots.length
                      : shots.filter((s: any) => (s.segment || s.section || s.phase || s.act || s.beat) === seg).length;

                    return (
                    <div className="flex-1 min-h-0 flex flex-col">
                      <div className="flex flex-col gap-2 mb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {/* Tabs for Photos/Videos */}
                            <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
                              <button
                                onClick={() => setShotViewTab('photo')}
                                className={`px-3 py-1 text-xs rounded ${shotViewTab === 'photo' ? 'bg-blue-500 text-white' : 'text-white/50 hover:text-white'}`}
                              >📷 Photos ({generatedAssets.filter(a => a.status === 'done').length}/{latestPlan?.shots?.length || generatedAssets.length})</button>
                              <button
                                onClick={() => setShotViewTab('video')}
                                className={`px-3 py-1 text-xs rounded ${shotViewTab === 'video' ? 'bg-purple-500 text-white' : 'text-white/50 hover:text-white'}`}
                              >🎬 Videos ({generatedAssets.filter(a => a.videoStatus === 'done').length}/{generatedAssets.filter(a => a.approved).length || 0})</button>
                              {/* Rendered tab - shows when videos are complete */}
                              {generatedAssets.filter(a => a.videoStatus === 'done' && a.videoUrl).length > 0 && (
                                <button
                                  onClick={() => setShotViewTab('video')}
                                  className="px-3 py-1 text-xs rounded bg-green-500 text-white"
                                >✓ Rendered ({generatedAssets.filter(a => a.videoStatus === 'done' && a.videoUrl).length})</button>
                              )}
                            </div>
                            {/* Pipeline Progress - Show ALL phases */}
                            {pipelinePhase !== 'idle' && pipelinePhase !== 'done' && (
                              <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                                pipelinePhase === 'refs' ? 'bg-teal-500/20 text-teal-300' :
                                pipelinePhase === 'refs-approval' ? 'bg-teal-500/20 text-teal-300' :
                                pipelinePhase === 'images' ? 'bg-blue-500/20 text-blue-300' :
                                pipelinePhase === 'approval' ? 'bg-amber-500/20 text-amber-300' :
                                pipelinePhase === 'videos' ? 'bg-purple-500/20 text-purple-300' :
                                pipelinePhase === 'stitching' ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-white/60'
                              }`}>
                                <div className={`w-3 h-3 border-2 border-t-transparent rounded-full animate-spin ${
                                  pipelinePhase === 'refs' || pipelinePhase === 'refs-approval' ? 'border-teal-400' :
                                  pipelinePhase === 'images' ? 'border-blue-400' :
                                  pipelinePhase === 'approval' ? 'border-amber-400' :
                                  pipelinePhase === 'videos' ? 'border-purple-400' :
                                  pipelinePhase === 'stitching' ? 'border-green-400' : 'border-white/40'
                                }`} />
                                <span className="text-xs font-medium">
                                  {pipelinePhase === 'refs' && '1/5 Generating refs...'}
                                  {pipelinePhase === 'refs-approval' && '2/5 Review refs...'}
                                  {pipelinePhase === 'images' && `3/5 Generating photos (${generatedAssets.filter(a => a.status === 'done').length}/${latestPlan?.shots?.length || 0})...`}
                                  {pipelinePhase === 'approval' && '4/5 Approve photos...'}
                                  {pipelinePhase === 'videos' && `5/5 Generating videos (${generatedAssets.filter(a => a.videoStatus === 'done').length}/${generatedAssets.filter(a => a.approved).length || 0})...`}
                                  {pipelinePhase === 'stitching' && 'Stitching final video...'}
                                </span>
                              </div>
                            )}
                            {pipelinePhase === 'done' && (
                              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-lg">
                                <span className="text-xs font-medium">✓ Complete!</span>
                              </div>
                            )}
                          </div>
                          {/* Approval controls inline */}
                          {pipelinePhase === 'approval' && (
                            <div className="flex gap-2">
                              <button onClick={approveAll} className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs hover:bg-green-500/30">Approve All</button>
                              <button
                                onClick={generateVideosForApproved}
                                disabled={generatedAssets.filter(a => a.approved === true).length === 0}
                                className="px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 disabled:opacity-50"
                              >
                                → Videos ({generatedAssets.filter(a => a.approved === true).length})
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Segment Filter Tabs - only show if we have segments */}
                        {segments.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-white/40 text-[10px] uppercase tracking-wider">Segment:</span>
                            <div className="flex gap-1 bg-white/5 rounded-lg p-0.5 flex-wrap">
                              <button
                                onClick={() => setSegmentTab('all')}
                                className={`px-2 py-0.5 text-[10px] rounded ${segmentTab === 'all' ? 'bg-teal-500 text-white' : 'text-white/50 hover:text-white'}`}
                              >All ({shots.length})</button>
                              {segments.map((seg: string) => (
                                <button
                                  key={seg}
                                  onClick={() => setSegmentTab(seg)}
                                  className={`px-2 py-0.5 text-[10px] rounded capitalize ${segmentTab === seg ? 'bg-amber-500 text-white' : 'text-white/50 hover:text-white'}`}
                                >{seg} ({getSegmentCount(seg)})</button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ZOOM SLIDER - control card size */}
                        <div className="flex items-center gap-2 ml-auto">
                          <span className="text-white/40 text-[10px]">🔍</span>
                          <input
                            type="range"
                            min="30"
                            max="150"
                            value={shotZoom}
                            onChange={(e) => setShotZoom(parseInt(e.target.value))}
                            className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            title={`Zoom: ${shotZoom}%`}
                          />
                          <span className="text-white/40 text-[10px] w-8">{shotZoom}%</span>
                        </div>
                      </div>

                      {/* PHOTOS TAB */}
                      {shotViewTab === 'photo' && (() => {
                        // Zoom-based sizing - use slider value to control card size
                        // 30% zoom = 120px min (tiny), 100% = 280px (normal), 150% = 400px (large)
                        const minWidth = Math.round(120 + (shotZoom - 30) * 2.3);
                        return (
                        <div className="grid gap-2 overflow-y-auto flex-1" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))` }}>
                          {(generatedAssets.length > 0 ? generatedAssets : (latestPlan?.shots || []).map((s: any, i: number) => ({ id: `placeholder-${i}`, status: 'pending' as const, prompt: s.prompt || s.image_prompt || s.photo_prompt || s.visual_prompt || '', type: 'image' as const, motionPrompt: s.motion_prompt || s.video_prompt || s.motion || '', _segment: s.segment || s.section || s.phase || s.act || s.beat })))
                          .filter((asset: any, idx: number) => {
                            if (segmentTab === 'all') return true;
                            const shot = latestPlan?.shots?.[idx];
                            const shotSegment = asset._segment || shot?.segment || shot?.section || shot?.phase || shot?.act || shot?.beat;
                            return shotSegment === segmentTab;
                          })
                          .map((asset: GeneratedAsset, idx: number) => {
                            const shot = latestPlan?.shots?.[idx];
                            const hasImage = asset.status === 'done' && asset.url;
                            // Check ALL possible prompt field names
                            const promptText = asset.prompt || shot?.prompt || shot?.image_prompt || shot?.photo_prompt || shot?.visual_prompt || shot?.description || '';
                            const isChained = idx > 0;

                            // USE MEMOIZED ref data instead of recalculating (fixes lag!)
                            const { uploadedRefs, readyUploadCount } = memoizedRefData;
                            const hasAnyRefs = readyUploadCount > 0 || generatedRefs.length > 0;

                            return (
                              <div key={asset.id} className="bg-white/5 rounded-xl p-3 border border-white/10">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-white font-medium text-sm">{idx + 1}. {shot?.shot_type || 'Shot'}</span>
                                    {asset.approved === true && <span className="text-green-400 text-xs">✓</span>}
                                    {asset.approved === false && <span className="text-red-400 text-xs">✗</span>}
                                  </div>
                                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] rounded">Nano Banana 4K</span>
                                </div>

                                {/* Image */}
                                <div className="relative aspect-video bg-vs-dark rounded-lg overflow-hidden mb-3 group">
                                  {asset.status === 'pending' && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <span className="text-white/20 text-2xl font-bold">{idx + 1}</span>
                                    </div>
                                  )}
                                  {asset.status === 'generating' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10">
                                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                  )}
                                  {hasImage && (
                                    <>
                                      <img src={asset.url} alt="" loading="lazy" className={`w-full h-full object-cover ${asset.approved === false ? 'opacity-30 grayscale' : ''}`} />
                                      {pipelinePhase === 'approval' && asset.approved === undefined && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                          <button onClick={() => approveShot(idx)} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">✓ Approve</button>
                                          <button onClick={() => rejectShot(idx)} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">✗ Reject</button>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>

                                {/* Refs used - SIMPLIFIED summary (memoized for performance) */}
                                <div className="mb-2 p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[10px] text-orange-400 font-medium">📎 REFS:</span>
                                    {hasAnyRefs ? (
                                      <>
                                        {readyUploadCount > 0 && (
                                          <span className="px-1.5 py-0.5 bg-purple-500/20 rounded text-[9px] text-purple-200">
                                            📷 {readyUploadCount} uploaded
                                          </span>
                                        )}
                                        {generatedRefs.filter(r => r.approved !== false).length > 0 && (
                                          <span className="px-1.5 py-0.5 bg-blue-500/20 rounded text-[9px] text-blue-200">
                                            🎨 {generatedRefs.filter(r => r.approved !== false).length} generated
                                          </span>
                                        )}
                                        {isChained && (
                                          <span className="px-1.5 py-0.5 bg-teal-500/20 rounded text-[9px] text-teal-300">
                                            🔗 chained
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <span className="text-[9px] text-white/40 italic">
                                        prompt only {isChained && '+ 🔗 chained'}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Prompt - Full text visible - ALWAYS show */}
                                <div className="bg-blue-500/10 rounded-lg p-2 border border-blue-500/20">
                                  <div className="text-[10px] text-blue-400 font-medium mb-1">📷 IMAGE PROMPT:</div>
                                  {promptText ? (
                                    <div className="text-[11px] text-white/90 leading-relaxed whitespace-pre-wrap">{promptText}</div>
                                  ) : (
                                    <div className="text-[11px] text-white/40 italic">No prompt found in plan - check JSON structure</div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        );
                      })()}

                      {/* VIDEOS TAB */}
                      {shotViewTab === 'video' && (() => {
                        // Dynamic sizing - smaller cards when more shots
                        // Zoom-based sizing - use slider value to control card size
                        const minWidth = Math.round(120 + (shotZoom - 30) * 2.3);
                        return (
                        <div className="grid gap-2 overflow-y-auto flex-1" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))` }}>
                          {(generatedAssets.length > 0 ? generatedAssets : (latestPlan?.shots || []).map((s: any, i: number) => ({ id: `placeholder-${i}`, status: 'pending' as const, prompt: '', type: 'image' as const, motionPrompt: s.motion_prompt || s.video_prompt || s.motion || s.camera_movement || '', _segment: s.segment || s.section || s.phase || s.act || s.beat })))
                          .filter((asset: any, idx: number) => {
                            if (segmentTab === 'all') return true;
                            const shot = latestPlan?.shots?.[idx];
                            const shotSegment = asset._segment || shot?.segment || shot?.section || shot?.phase || shot?.act || shot?.beat;
                            return shotSegment === segmentTab;
                          })
                          .map((asset: GeneratedAsset, idx: number) => {
                            const shot = latestPlan?.shots?.[idx];
                            const hasImage = asset.status === 'done' && asset.url;
                            const hasVideo = asset.videoStatus === 'done' && asset.videoUrl;
                            // Check ALL possible motion prompt field names
                            const motionText = asset.motionPrompt || shot?.motion_prompt || shot?.video_prompt || shot?.motion || shot?.camera_movement || shot?.movement || '';
                            const isDialogue = motionText.toLowerCase().includes('speak') || motionText.toLowerCase().includes('talk') || motionText.toLowerCase().includes('dialogue');
                            const hasEndFrame = idx < (latestPlan?.shots?.length || 0) - 1;
                            const videoType = isDialogue ? 'Dialogue' : hasEndFrame && videoModel === 'kling-o1' ? 'Start→End' : 'Motion';
                            const modelName = isDialogue ? 'Seedance' : videoModel === 'kling-2.6' ? 'Kling 2.6' : videoModel === 'kling-o1' ? 'Kling O1' : 'Seedance';

                            return (
                              <div key={asset.id} className="bg-white/5 rounded-xl p-3 border border-purple-500/20">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-white font-medium text-sm">{idx + 1}. {shot?.shot_type || 'Shot'}</span>
                                    {hasVideo && <span className="text-green-400 text-xs">▶ Ready</span>}
                                    {asset.videoStatus === 'generating' && <span className="text-purple-400 text-xs">⏳ Rendering...</span>}
                                  </div>
                                  <div className="flex gap-1">
                                    <span className={`px-2 py-0.5 text-[10px] rounded ${
                                      isDialogue ? 'bg-pink-500/20 text-pink-300' :
                                      videoModel === 'kling-o1' ? 'bg-cyan-500/20 text-cyan-300' :
                                      'bg-purple-500/20 text-purple-300'
                                    }`}>{modelName}</span>
                                    <span className="px-2 py-0.5 bg-white/10 text-white/60 text-[10px] rounded">{asset.duration || defaultDuration}s</span>
                                  </div>
                                </div>

                                {/* Video thumbnail */}
                                <div className="relative aspect-video bg-vs-dark rounded-lg overflow-hidden mb-3 group">
                                  {!hasImage && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <span className="text-white/20 text-2xl font-bold">{idx + 1}</span>
                                    </div>
                                  )}
                                  {hasImage && !asset.approved && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                                      <span className="text-white/30 text-sm">Not approved</span>
                                    </div>
                                  )}
                                  {hasImage && asset.approved && (
                                    <>
                                      <img src={asset.url} alt="" loading="lazy" className="w-full h-full object-cover" />
                                      {!asset.videoStatus && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                          <span className="text-white/50">Waiting for video gen...</span>
                                        </div>
                                      )}
                                      {asset.videoStatus === 'generating' && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                      )}
                                      {hasVideo && (
                                        <a href={asset.videoUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/60 transition">
                                          <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                                            <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                          </div>
                                        </a>
                                      )}
                                    </>
                                  )}
                                </div>

                                {/* Video type info */}
                                <div className="mb-2">
                                  <div className="text-[10px] text-purple-400 font-medium mb-1">VIDEO TYPE:</div>
                                  <div className="flex gap-1 flex-wrap">
                                    <span className={`px-1.5 py-0.5 text-[9px] rounded ${
                                      isDialogue ? 'bg-pink-500/10 text-pink-300' :
                                      videoType === 'Start→End' ? 'bg-cyan-500/10 text-cyan-300' :
                                      'bg-purple-500/10 text-purple-300'
                                    }`}>{videoType}</span>
                                    {videoType === 'Start→End' && (
                                      <span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-300 text-[9px] rounded">Uses next shot as end frame</span>
                                    )}
                                    {isDialogue && (
                                      <span className="px-1.5 py-0.5 bg-pink-500/10 text-pink-300 text-[9px] rounded">Auto-detected dialogue</span>
                                    )}
                                  </div>
                                </div>

                                {/* Motion prompt - Full text visible - ALWAYS show */}
                                <div className="bg-purple-500/10 rounded-lg p-2 border border-purple-500/20">
                                  <div className="text-[10px] text-purple-400 font-medium mb-1">🎬 MOTION PROMPT:</div>
                                  {motionText ? (
                                    <div className="text-[11px] text-white/90 leading-relaxed whitespace-pre-wrap">{motionText}</div>
                                  ) : (
                                    <div className="text-[11px] text-white/40 italic">No motion prompt - will use default camera movement</div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        );
                      })()}
                    </div>
                    );
                  })()}

                  {/* FINAL VIDEO */}
                  {finalVideoUrl && (
                    <div className="flex-shrink-0 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                          </div>
                          <div>
                            <h4 className="text-green-300 font-semibold">Final Video Ready!</h4>
                            <p className="text-xs text-green-400/60">{generatedAssets.filter(a => a.videoStatus === 'done').length} clips stitched</p>
                          </div>
                        </div>
                        <a href={finalVideoUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>Watch
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Execute button is only in the chat panel now */}
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

            {/* Aspect Ratio Selection */}
            <div className="mb-6">
              <label className="text-xs text-white/50 uppercase tracking-wide mb-2 block">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: '16:9', label: '16:9', desc: 'YouTube', icon: '📺' },
                  { value: '9:16', label: '9:16', desc: 'TikTok/Reels', icon: '📱' },
                  { value: '1:1', label: '1:1', desc: 'Square', icon: '⬜' }
                ].map(({ value, label, desc, icon }) => (
                  <button
                    key={value}
                    onClick={() => setAspectRatio(value as AspectRatio)}
                    className={`flex flex-col items-center p-2 rounded-lg text-xs transition ${
                      aspectRatio === value
                        ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                        : 'bg-vs-dark text-white/50 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <span className="text-lg mb-1">{icon}</span>
                    <span className="font-medium">{label}</span>
                    <span className="text-[9px] text-white/40">{desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Chaining Toggle */}
            <div className="mb-6">
              <label className="text-xs text-white/50 uppercase tracking-wide mb-2 block">Frame Chaining</label>
              <div className="bg-vs-dark rounded-lg p-3">
                <button
                  onClick={() => setEnableChaining(!enableChaining)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                    enableChaining
                      ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                      : 'bg-red-500/10 text-red-300/70 border border-red-500/30'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${enableChaining ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    {enableChaining ? 'Enabled' : 'Disabled'}
                  </span>
                  <span className="text-xs text-white/40">{enableChaining ? 'Sequential' : 'Parallel'}</span>
                </button>
                <p className="text-[10px] text-white/40 mt-2 leading-relaxed">
                  When enabled, extracts last frame of each video and uses it as input for the next.
                  Prevents color drift between shots. Videos generate sequentially.
                </p>
                {lastExtractedFrame && (
                  <div className="mt-2 text-[10px] text-cyan-400/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
                    Last frame ready for chaining
                  </div>
                )}
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

        {/* Council Panel - AI Agent Deliberation */}
        {showCouncilPanel && (
          <aside className="w-96 border-l border-vs-border bg-zinc-950 overflow-y-auto">
            <CouncilPanel />
          </aside>
        )}

        {/* Agent Debug Panel - View prompts, test agents */}
        {showDebugPanel && (
          <aside className="w-[450px] border-l border-vs-border bg-zinc-950 overflow-hidden">
            <AgentDebugPanel onClose={() => setShowDebugPanel(false)} />
          </aside>
        )}

      </div>

      {/* Ref Upload Modal - Type Selection */}
      {showRefUploadModal && pendingRefFile && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowRefUploadModal(false)}>
          <div className="bg-zinc-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-white/10" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-4">Add Reference Image</h3>

            {/* Image Preview */}
            <div className="mb-4 rounded-lg overflow-hidden bg-black/50 flex items-center justify-center" style={{ height: '200px' }}>
              <img src={pendingRefFile.dataUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
            </div>

            {/* Name Input */}
            <input
              type="text"
              value={pendingRefName}
              onChange={e => setPendingRefName(e.target.value)}
              placeholder="Name this reference..."
              className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/40 mb-4 focus:outline-none focus:border-purple-500"
              autoFocus
            />

            {/* Type Selection Buttons */}
            <div className="text-xs text-white/50 mb-2">What type of reference is this?</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'character', label: 'Character', icon: '👤', color: 'cyan' },
                { type: 'location', label: 'Location', icon: '🏔️', color: 'green' },
                { type: 'prop', label: 'Prop', icon: '📦', color: 'orange' }
              ].map(({ type, label, icon, color }) => (
                <button
                  key={type}
                  onClick={async () => {
                    const name = pendingRefName.trim() || label;
                    const dataUrl = pendingRefFile.dataUrl;
                    const uploadId = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

                    // Close modal
                    setShowRefUploadModal(false);

                    // Add to refImages for visual display (loading thumbnail)
                    const refDescription = `${icon} ${name}`;
                    setRefImages(prev => [...prev, { url: dataUrl, description: refDescription, _uploadId: uploadId, _uploading: true, _type: type } as any]);

                    // Add to appropriate typed ref list
                    if (type === 'character') {
                      setCharacterRefs(prev => [...prev, { name, url: dataUrl, _uploadId: uploadId, _uploading: true } as any]);
                    } else if (type === 'location') {
                      setLocationRefs(prev => [...prev, { name, url: dataUrl, _uploadId: uploadId, _uploading: true } as any]);
                    } else {
                      setProductRefs(prev => [...prev, { name, url: dataUrl, _uploadId: uploadId, _uploading: true } as any]);
                    }

                    // Upload file
                    try {
                      const blob = await fetch(dataUrl).then(r => r.blob());
                      const formData = new FormData();
                      const ext = blob.type.includes('png') ? 'png' : 'jpg';
                      formData.append('file', blob, `ref-${Date.now()}.${ext}`);

                      const res = await fetch('/api/cinema/upload', { method: 'POST', body: formData });
                      const data = await res.json();

                      if (data.success && data.url) {
                        console.log(`[AI2] Ref upload complete: ${name} (${type}) → ${data.url}`);
                        const updateFn = (prev: any[]) => prev.map(r => (r as any)._uploadId === uploadId ? { ...r, url: data.url, _uploading: false } : r);
                        // Update all ref arrays
                        setRefImages(updateFn);
                        if (type === 'character') setCharacterRefs(updateFn);
                        else if (type === 'location') setLocationRefs(updateFn);
                        else setProductRefs(updateFn);

                        // Add message to chat showing the uploaded ref
                        const typeLabel = type === 'character' ? '👤 Character' : type === 'location' ? '🏔️ Location' : '📦 Prop';
                        addMessage('assistant', `**${typeLabel} ref added:** ${name}\n\n![${name}](${data.url})`);
                      } else {
                        console.log(`[AI2] Upload failed:`, data.error);
                        const updateFn = (prev: any[]) => prev.map(r => (r as any)._uploadId === uploadId ? { ...r, _uploading: false, _failed: true } : r);
                        setRefImages(updateFn);
                        if (type === 'character') setCharacterRefs(updateFn);
                        else if (type === 'location') setLocationRefs(updateFn);
                        else setProductRefs(updateFn);
                      }
                    } catch (err) {
                      console.log('Upload failed:', err);
                      const updateFn = (prev: any[]) => prev.map(r => (r as any)._uploadId === uploadId ? { ...r, _uploading: false, _failed: true } : r);
                      setRefImages(updateFn);
                      if (type === 'character') setCharacterRefs(updateFn);
                      else if (type === 'location') setLocationRefs(updateFn);
                      else setProductRefs(updateFn);
                    }

                    setPendingRefFile(null);
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition hover:scale-105 ${
                    color === 'cyan' ? 'border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300' :
                    color === 'green' ? 'border-green-500/50 bg-green-500/10 hover:bg-green-500/20 text-green-300' :
                    'border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/20 text-orange-300'
                  }`}
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>

            {/* Cancel */}
            <button
              onClick={() => { setShowRefUploadModal(false); setPendingRefFile(null); }}
              className="w-full mt-4 py-2 text-white/50 hover:text-white/70 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
