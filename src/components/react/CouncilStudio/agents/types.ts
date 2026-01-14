// Council Agent System Types

// ============================================
// AGENT INTERFACES
// ============================================

export type AgentDomain = 'narrative' | 'visual' | 'technical' | 'production';

export interface CouncilAgent {
  name: string;
  domain: AgentDomain;
  icon: string;  // emoji for UI display
  color: string; // tailwind color class
  systemPrompt: string;
  knowledgeBases: string[];
  evaluate(context: ShotContext): Promise<AgentDecision>;
  query(question: string, context: any): Promise<AgentResponse>;
}

export interface AgentDecision {
  agent: AgentDomain;
  recommendation: any;
  confidence: number;  // 0-1
  reasoning: string[];
  sources: string[];
  dissent?: string;
  warnings?: string[];
}

export interface AgentResponse {
  agent: AgentDomain;
  answer: any;
  confidence: number;
  sources: string[];
}

// ============================================
// SHOT & PLAN CONTEXT
// ============================================

export interface ShotContext {
  shot: Shot;
  refs: RefImage[];
  previousShots: Shot[];
  plan?: Plan;
  userPrompt: string;
  director?: string;
}

export interface Shot {
  id: string;
  order: number;
  prompt: string;
  motionPrompt?: string;
  duration: '5' | '10';
  model?: VideoModel;
  imageUrl?: string;
  videoUrl?: string;
  status: 'pending' | 'generating' | 'done' | 'error';

  // Detailed shot info (from reverse engineering)
  camera?: CameraInfo;
  subject?: SubjectInfo;
  environment?: EnvironmentInfo;
  audio?: AudioInfo;
  timing?: TimingInfo;
  chainRef?: ChainRef;
}

export interface CameraInfo {
  framing: string;  // ECU, CU, MCU, MS, WS, EWS
  movement: string;
  movementSpeed?: 'slow' | 'medium' | 'fast';
  movementDirection?: string;
  angle?: string;
  focalLength?: string;
  aperture?: string;
}

export interface SubjectInfo {
  who: string;
  bodyAction?: string;
  handAction?: string;
  headAction?: string;
  facialStart?: string;
  facialEnd?: string;
}

export interface EnvironmentInfo {
  location: string;
  visibleElements?: string[];
  lighting?: string;
  weather?: string;
  timeOfDay?: string;
}

export interface AudioInfo {
  dialog?: string;
  speaker?: string;
  wordCount?: number;
}

export interface TimingInfo {
  startFrame: number;
  endFrame: number;
  actualDuration: number;
  generationDuration: number;
  cutStrategy?: string;
}

export interface ChainRef {
  fromShot: string;
  useFrame: number;
  colorLock?: boolean;
}

export interface RefImage {
  id: string;
  url: string;
  type: 'character' | 'location' | 'product' | 'baseplate' | 'generic';
  name: string;
  description?: string;
}

export interface Plan {
  id: string;
  name: string;
  description?: string;
  shots: Shot[];
  refs?: RefImage[];
  director?: string;
  visualStyle?: VisualStyle;
  characters?: CharacterRef[];
}

export interface VisualStyle {
  camera?: string;
  lens?: string;
  colorGrade?: string;
  lightingStyle?: string;
  aspectRatio?: string;
  filmStockLook?: string;
}

export interface CharacterRef {
  id: string;
  name: string;
  costume?: string;
  voice?: VoiceInfo;
  generatePrompt?: string;
}

export interface VoiceInfo {
  gender: string;
  tone: string;
  accent?: string;
  ttsPrompt?: string;
}

// ============================================
// VIDEO MODEL TYPES
// ============================================

export type VideoModel = 'kling-2.6' | 'kling-o1' | 'seedance-1.5';

export interface ModelSelection {
  model: VideoModel;
  reason: string;
  confidence: number;
  parameters: ModelParameters;
}

export interface ModelParameters {
  endpoint: string;
  imageParam: string;
  endImageParam?: string;
  supportsDialog: boolean;
  supportsEndFrame: boolean;
  maxDuration: 5 | 10;
}

export const MODEL_SPECS: Record<VideoModel, ModelParameters> = {
  'seedance-1.5': {
    endpoint: 'fal-ai/bytedance/seedance/v1.5/pro/image-to-video',
    imageParam: 'image_url',
    endImageParam: 'end_image_url',
    supportsDialog: true,
    supportsEndFrame: true,
    maxDuration: 5
  },
  'kling-o1': {
    endpoint: 'fal-ai/kling-video/o1/image-to-video',
    imageParam: 'start_image_url',
    endImageParam: 'tail_image_url',
    supportsDialog: false,
    supportsEndFrame: true,
    maxDuration: 10
  },
  'kling-2.6': {
    endpoint: 'fal-ai/kling-video/v2.6/pro/image-to-video',
    imageParam: 'image_url',
    endImageParam: undefined,
    supportsDialog: false,
    supportsEndFrame: false,
    maxDuration: 10
  }
};

// ============================================
// COUNCIL CONSENSUS
// ============================================

export interface ConsensusResult {
  finalDecision: FinalDecision;
  agentDecisions: AgentDecision[];
  consensusScore: number;  // 0-1, how aligned are agents
  requiresReview: boolean; // if agents disagree significantly
  dissents: Dissent[];
  timestamp: number;
}

export interface FinalDecision {
  model: VideoModel;
  modelReason: string;
  photoPrompt: string;
  motionPrompt: string;
  duration: '5' | '10';
  chainStrategy?: ChainStrategy;
  estimatedCost: number;
  warnings: string[];
}

export interface ChainStrategy {
  chainFromPrevious: boolean;
  useLastFrame: boolean;
  colorLockPhrase: string;
  directionLock?: string;
}

export interface Dissent {
  agent: AgentDomain;
  issue: string;
  alternative: string;
  severity: 'low' | 'medium' | 'high';
}

// ============================================
// DATABASE TYPES (MOVIE SHOTS)
// ============================================

export interface DatabaseShot {
  id: string;
  image: string;
  film: string;
  year: number;
  director: string;
  shot: string;  // type: extreme-long, long, medium, etc.
  angle: string;
  movement: string;
  emotion: string;
  emotionIntensity: string;
  lighting: string;
  lightingSource?: string;
  lightingColor?: string;
  environment: string;
  location?: string;
  weather?: string;
  timeOfDay?: string;
  genre: string[];
  decade: string;
  lens?: string;
  tags: string[];
  prompt?: string;
  framing?: string;
  depth?: string;
  compositionNotes?: string;
}

export interface ShotFilters {
  director?: string;
  emotion?: string;
  emotionIntensity?: string;
  movement?: string;
  shotType?: string;
  lighting?: string;
  environment?: string;
  genre?: string;
  decade?: string;
  lens?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ReverseEngineeredScene {
  sceneId: string;
  name: string;
  description?: string;
  director: string;
  year: number;
  cinematographer?: string;
  aspectRatio: string;
  extraction: {
    fps: number;
    totalFrames: number;
    totalDurationSec: number;
  };
  visualStyle: VisualStyle;
  cameraAngles: Record<string, CameraPreset>;
  characterRefs: Record<string, CharacterRef>;
  shots: ReverseEngineeredShot[];
  summary: SceneSummary;
  techniques: string[];
}

export interface CameraPreset {
  focalLength: string;
  aperture: string;
  distance: string;
  height?: string;
  angle?: string;
}

export interface ReverseEngineeredShot {
  shotId: string;
  order: number;
  timing: TimingInfo;
  camera: CameraInfo;
  subjectPrimary?: SubjectInfo;
  subjectSecondary?: SubjectInfo;
  props?: PropsInfo;
  environment: EnvironmentInfo;
  audio?: AudioInfo;
  transitionIn: string;
  transitionOut: string;
  model: VideoModel;
  needsEndFrame: boolean;
  photoPromptStart: string;
  photoPromptEnd?: string;
  motionPrompt: string;
  recommendedModel: VideoModel;
  modelReason: string;
  speakerOnScreen: boolean;
  chainFromPrevious: boolean;
  chainRef?: ChainRef;
}

export interface PropsInfo {
  items: string[];
  interaction?: string;
  stateChange?: string;
}

export interface SceneSummary {
  totalShots: number;
  dialogShots: number;
  actionShots: number;
  transitionShots: number;
  insertShots: number;
  modelBreakdown: Record<VideoModel, number>;
  estimatedCost: {
    videoGeneration: string;
    imageGeneration: string;
    total: string;
  };
}

// ============================================
// DIRECTOR DECISION SYSTEM
// ============================================

export interface DirectorDecisionSystem {
  name: string;
  style: string;
  coreQuestions: {
    power: string;
    audienceExpect: string;
    informationHold: string;
    timeManip: string;
    simplicity: string;
  };
  shotRules: ShotRule[];
  signatureShots: SignatureShot[];
  colorPalette: string;
  framingStyle: string;
  setDesign: string;
  neverDo: string[];
}

export interface ShotRule {
  condition: string;
  decision: string;
  reason: string;
}

export interface SignatureShot {
  name: string;
  description: string;
  prompt: string;
  useCase: string;
}

// ============================================
// UI STATE TYPES
// ============================================

export interface CouncilMeeting {
  id: string;
  context: ShotContext;
  decisions: AgentDecision[];
  consensus: ConsensusResult | null;
  status: 'pending' | 'deliberating' | 'consensus' | 'review' | 'executed';
  timestamp: number;
}

export type PipelinePhase =
  | 'idle'
  | 'planning'
  | 'council'
  | 'refs'
  | 'refs-approval'
  | 'images'
  | 'images-approval'
  | 'videos'
  | 'stitching'
  | 'done';

export interface GeneratedAsset {
  id: string;
  shotId: string;
  type: 'ref' | 'image' | 'video';
  url: string;
  status: 'pending' | 'generating' | 'done' | 'error' | 'approved' | 'rejected';
  metadata?: any;
}

// ============================================
// MESSAGE TYPES
// ============================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'agent';
  content: string;
  agentDomain?: AgentDomain;
  timestamp: number;
  plan?: Plan;
}

export interface CouncilQuery {
  fromAgent: AgentDomain;
  queryType: 'decision' | 'validation' | 'prediction' | 'lookup';
  context: Partial<ShotContext>;
  question: string;
  requiredFields: string[];
}
