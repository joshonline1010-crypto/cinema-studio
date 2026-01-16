/**
 * MOVIE SHOTS DATABASE TYPES
 *
 * TypeScript interfaces for the MOVIE SHOTS reference database.
 * Used by AI2 Studio agents to fetch real film reference shots.
 */

// ============================================
// QUERY INTERFACES
// ============================================

export interface ShotQuery {
  director?: string;        // "stanley-kubrick", "spielberg"
  shotType?: string;        // "close-up", "wide", "extreme-long"
  emotion?: string;         // "fear", "awe", "tension"
  cameraMovement?: string;  // "static", "tracking", "dolly"
  lighting?: string;        // "dramatic", "natural", "neon"
  environment?: string;     // "interior", "exterior", "scifi"
  angle?: string;           // "eye-level", "low-angle", "high-angle"
  decade?: string;          // "1960s", "1980s", "2010s"
  genre?: string;           // "scifi", "horror", "drama"
  lens?: string;            // "35mm", "85mm", "wide"
  limit?: number;           // Max results (default 5)
}

// ============================================
// SHOT DATA INTERFACES
// ============================================

export interface ShotReference {
  id: string;
  image: string;              // Relative path to image
  film: string;               // "2001: A Space Odyssey"
  year: number;
  director: string;           // "stanley-kubrick"
  shot: string;               // Shot type: "extreme-long", "close-up"
  angle: string;              // "eye-level", "low-angle"
  movement: string;           // "static", "tracking"
  emotion: string;            // "awe", "fear"
  emotionIntensity: string;   // "strong", "subtle"
  lighting: string;           // "dramatic", "natural"
  lightingSource: string;     // "sunlight", "neon"
  lightingColor: string;      // "warm", "cool"
  environment: string;        // "scifi", "urban"
  location: string;           // "space", "city"
  weather: string | null;
  timeOfDay: string;
  genre: string[];
  decade: string;
  lens: string;
  tags: string[];
  prompt: string;             // How to recreate this shot
  framing: string;            // "symmetrical", "centered"
  depth: string;              // "sharp throughout", "shallow"
  compositionNotes: string | null;
  subjectPlacement: string | null;
  eyeDirection: string | null;
  pose: string | null;
  colorPalette: string | null;
  filmStock: string | null;
  aspectRatio: string | null;
  camera3d: string | null;
}

export interface MovieShotsIndex {
  generated: string;
  count: number;
  filters: {
    directors: string[];
    emotions: string[];
    lighting: string[];
    shotTypes: string[];
    environments: string[];
    decades: string[];
    films: string[];
    lenses: string[];
    angles: string[];
  };
  shots: ShotReference[];
}

// ============================================
// FORMATTED REFERENCE FOR AGENTS
// ============================================

export interface FormattedShotReference {
  id: string;
  url: string;                // Full path to image
  director: string;
  directorFormatted: string;  // "Stanley Kubrick"
  movie: string;
  year: number;
  shotType: string;
  angle: string;
  emotion: string;
  lighting: string;
  description: string;        // Human-readable description
  photoPrompt: string;        // How to recreate
  motionPrompt?: string;      // For video (derived from movement)
  tags: string[];
}

// ============================================
// DIRECTOR MAPPING
// ============================================

export const DIRECTOR_NAME_MAP: Record<string, string> = {
  'stanley-kubrick': 'Stanley Kubrick',
  'steven-spielberg': 'Steven Spielberg',
  'quentin-tarantino': 'Quentin Tarantino',
  'david-fincher': 'David Fincher',
  'christopher-nolan': 'Christopher Nolan',
  'denis-villeneuve': 'Denis Villeneuve',
  'wes-anderson': 'Wes Anderson',
  'akira-kurosawa': 'Akira Kurosawa',
  'martin-scorsese': 'Martin Scorsese',
  'ridley-scott': 'Ridley Scott',
  'brian-de-palma': 'Brian De Palma',
  'alfred-hitchcock': 'Alfred Hitchcock',
  'francis-ford-coppola': 'Francis Ford Coppola',
  'james-cameron': 'James Cameron',
  'george-lucas': 'George Lucas',
  'ari-aster': 'Ari Aster',
  'barry-jenkins': 'Barry Jenkins',
  'bong-joon-ho': 'Bong Joon-ho',
  'coen-brothers': 'Coen Brothers',
  'damien-chazelle': 'Damien Chazelle',
  'terrence-malick': 'Terrence Malick',
  'tim-burton': 'Tim Burton',
  'roman-polanski': 'Roman Polanski',
  'sam-mendes': 'Sam Mendes',
  'yasujirō-ozu': 'Yasujirō Ozu',
  'duncan-jones': 'Duncan Jones',
  'ethan-coen-joel-coen': 'Ethan & Joel Coen',
  'joel-coen': 'Joel Coen'
};

// ============================================
// SHOT TYPE MAPPING TO COVERAGE PLANNER
// ============================================

export const SHOT_TYPE_MAP: Record<string, string[]> = {
  // Coverage planner shot types -> index.json shot types
  'WIDE_MASTER': ['extreme-long', 'long'],
  'WIDE_ESTABLISHING': ['extreme-long', 'long'],
  'WIDE_EXT': ['extreme-long', 'long'],
  'WIDE_TWO_SHOT': ['medium-long', 'long'],
  'MEDIUM_SHOT': ['medium', 'medium-long'],
  'MEDIUM': ['medium'],
  'MS': ['medium'],
  'CU_FACE': ['close-up', 'medium-close'],
  'CU_A': ['close-up'],
  'CU_B': ['close-up'],
  'CU': ['close-up'],
  'ECU': ['extreme-close'],
  'REACTION_INSERT': ['close-up', 'extreme-close'],
  'OTS_A': ['medium', 'medium-close'],
  'OTS_B': ['medium', 'medium-close'],
  'POV': ['medium', 'close-up'],
  'LOW_ANGLE_HERO': ['medium', 'medium-long'],
  'HIGH_ANGLE': ['high-angle', 'medium-long'],
  'TRACKING': ['medium', 'medium-long', 'long']
};

// ============================================
// DIRECTOR STYLE ALIASES
// ============================================

export const DIRECTOR_ALIASES: Record<string, string> = {
  // Common names to slug format
  'kubrick': 'stanley-kubrick',
  'spielberg': 'steven-spielberg',
  'tarantino': 'quentin-tarantino',
  'fincher': 'david-fincher',
  'nolan': 'christopher-nolan',
  'villeneuve': 'denis-villeneuve',
  'wes anderson': 'wes-anderson',
  'kurosawa': 'akira-kurosawa',
  'scorsese': 'martin-scorsese',
  'ridley scott': 'ridley-scott',
  'de palma': 'brian-de-palma',
  'hitchcock': 'alfred-hitchcock',
  'coppola': 'francis-ford-coppola',
  'cameron': 'james-cameron',
  'lucas': 'george-lucas',
  'aster': 'ari-aster',
  'jenkins': 'barry-jenkins',
  'bong': 'bong-joon-ho',
  'coens': 'coen-brothers',
  'coen': 'coen-brothers',
  'chazelle': 'damien-chazelle',
  'malick': 'terrence-malick',
  'burton': 'tim-burton',
  'polanski': 'roman-polanski',
  'mendes': 'sam-mendes',
  'ozu': 'yasujirō-ozu'
};
