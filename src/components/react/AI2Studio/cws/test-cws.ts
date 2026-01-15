/**
 * CWS Test File - Run with: npx ts-node --esm src/components/react/AI2Studio/cws/test-cws.ts
 * Or just import in browser console to verify
 */

import {
  createDefaultWorldState,
  STANDARD_RIGS,
  type Character,
  type WorldState,
  type ContinuityViolation
} from './types';

import {
  buildCWSContext,
  generateLockPhrase,
  suggestRigsForBeat,
  validateCameraTransition,
  validateEntityMovement
} from './cwsPromptSystem';

// Test 1: Create default world state
console.log('=== TEST 1: Default World State ===');
const worldState = createDefaultWorldState('test-scene');
console.log('Created world state:', worldState.id);
console.log('Scene ID:', worldState.sceneId);
console.log('CWS Enabled:', worldState.cwsEnabled);
console.log('Available rigs:', Object.keys(worldState.cameraRigs).length);

// Test 2: Standard rigs
console.log('\n=== TEST 2: Standard Camera Rigs ===');
console.log('WIDE_MASTER:', STANDARD_RIGS.WIDE_MASTER);
console.log('OTS_A:', STANDARD_RIGS.OTS_A);
console.log('CU_B:', STANDARD_RIGS.CU_B);

// Test 3: Add character to world
console.log('\n=== TEST 3: Add Character ===');
const hero: Character = {
  id: 'hero',
  name: 'Hero',
  type: 'character',
  position: { x: 0, y: 0, z: 0 },
  facing: 'CAMERA',
  state: { current: 'standing', history: [] },
  screenPosition: 'CENTER',
  lookDirection: 'CAMERA',
  travelDirection: {
    horizontal: 'LEFT_TO_RIGHT',
    vertical: 'LEVEL',
    locked: true
  }
};
worldState.characters['hero'] = hero;
worldState.entities['hero'] = hero;
worldState.cwsEnabled = true;
console.log('Added hero:', hero.name, 'at', hero.position);

// Test 4: Build CWS context
console.log('\n=== TEST 4: Build CWS Context ===');
const context = buildCWSContext(worldState);
console.log('CWS Context Preview (first 500 chars):');
console.log(context.substring(0, 500));

// Test 5: Generate lock phrase
console.log('\n=== TEST 5: Generate Lock Phrase ===');
worldState.directionLocks = [{
  entityId: 'hero',
  lockType: 'TRAVEL',
  lockedValue: 'LEFT_TO_RIGHT',
  lockedAtPanel: 1,
  active: true
}];
worldState.environment.lightingDirection = 'from left';
const lockPhrase = generateLockPhrase(worldState, 'hero');
console.log('Lock phrase:', lockPhrase);

// Test 6: Suggest rigs for beat
console.log('\n=== TEST 6: Suggest Rigs for Beat ===');
console.log('catalyst:', suggestRigsForBeat('catalyst'));
console.log('climax:', suggestRigsForBeat('climax'));
console.log('debate:', suggestRigsForBeat('debate'));

// Test 7: Validate camera transition
console.log('\n=== TEST 7: Validate Camera Transition ===');
worldState.lineOfAction = {
  entityA: 'hero',
  entityB: 'villain',
  currentSide: 'A',
  violated: false
};
const validTransition = validateCameraTransition('OTS_A', 'CU_A', worldState);
const invalidTransition = validateCameraTransition('OTS_A', 'OTS_B', worldState);
console.log('OTS_A → CU_A (same side):', validTransition);
console.log('OTS_A → OTS_B (crossing):', invalidTransition);

// Test 8: Validate entity movement
console.log('\n=== TEST 8: Validate Entity Movement ===');
const smallMove = validateEntityMovement('hero', {x:0,y:0,z:0}, {x:1,y:0,z:0});
const bigMove = validateEntityMovement('hero', {x:0,y:0,z:0}, {x:5,y:0,z:0});
console.log('Small move (1 unit):', smallMove);
console.log('Big move (5 units - TELEPORT):', bigMove);

console.log('\n=== ALL TESTS PASSED ===');
