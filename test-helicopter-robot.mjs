/**
 * Test: Helicopter vs Robot Story
 * Tests the full spatial context with a real story scenario
 */

// Simulate WorldStateContext
class WorldStateContext {
  constructor() {
    this.entities = new Map();
    this.cameras = new Map();
    this.worldId = '';
    this.currentBeatId = '';
  }

  initFromWorldState(worldState, cameraRigs) {
    this.worldId = worldState.world_id;

    for (const entity of worldState.entities || []) {
      const yawRad = ((entity.base_orientation?.yaw_deg || 0) * Math.PI) / 180;
      const facingDir = [Math.sin(yawRad), 0, -Math.cos(yawRad)];

      this.entities.set(entity.entity_id, {
        id: entity.entity_id,
        type: entity.entity_type,
        position: [
          entity.base_world_position?.x || 0,
          entity.base_world_position?.y || 0,
          entity.base_world_position?.z || 0
        ],
        facing: {
          direction: facingDir,
          targetEntityId: undefined,
          description: 'facing forward'
        },
        positionHistory: []
      });
    }

    for (const rig of cameraRigs?.camera_rigs || []) {
      this.cameras.set(rig.rig_id, {
        id: rig.rig_id,
        position: [rig.camera_position?.x || 0, rig.camera_position?.y || 0, rig.camera_position?.z || 0],
        lookAt: [rig.look_at?.x || 0, rig.look_at?.y || 0, rig.look_at?.z || 0],
        defaultLens: rig.default_lens_mm || 50
      });
    }
  }

  setCurrentBeat(beatId) { this.currentBeatId = beatId; }

  getEntityPosition(id) {
    const e = this.entities.get(id);
    return e ? [...e.position] : null;
  }

  getDistanceBetween(a, b) {
    const pA = this.getEntityPosition(a);
    const pB = this.getEntityPosition(b);
    if (!pA || !pB) return null;
    return Math.sqrt((pB[0]-pA[0])**2 + (pB[1]-pA[1])**2 + (pB[2]-pA[2])**2);
  }

  setEntityFacing(entityId, targetId) {
    const entity = this.entities.get(entityId);
    const target = this.entities.get(targetId);
    if (!entity || !target) return;

    const dx = target.position[0] - entity.position[0];
    const dy = target.position[1] - entity.position[1];
    const dz = target.position[2] - entity.position[2];
    const len = Math.sqrt(dx*dx + dy*dy + dz*dz);

    if (len > 0) {
      entity.facing = {
        direction: [dx/len, dy/len, dz/len],
        targetEntityId: targetId,
        description: `facing ${targetId}`
      };
    }
  }

  applyAgentDecision(decision) {
    const entity = this.entities.get(decision.entityId);
    if (!entity) return { isValid: false, issues: [{ message: 'Entity not found' }] };

    const oldPos = [...entity.position];
    let newPos = [...entity.position];

    if (decision.newPosition) {
      newPos = decision.newPosition;
    } else if (decision.positionDelta) {
      newPos = [
        entity.position[0] + decision.positionDelta[0],
        entity.position[1] + decision.positionDelta[1],
        entity.position[2] + decision.positionDelta[2]
      ];
    }

    const distance = Math.sqrt((newPos[0]-oldPos[0])**2 + (newPos[1]-oldPos[1])**2 + (newPos[2]-oldPos[2])**2);
    const issues = [];

    if (distance > 50) {  // Helicopter can move fast
      issues.push({ type: 'teleport', message: `Movement of ${distance.toFixed(1)}m - valid for helicopter` });
    }

    entity.position = newPos;
    entity.positionHistory.push({
      beatId: this.currentBeatId,
      position: oldPos,
      facing: entity.facing.description,
      action: decision.storyReason
    });

    if (decision.facingTarget) {
      this.setEntityFacing(decision.entityId, decision.facingTarget);
    }

    return { isValid: issues.length === 0, issues };
  }

  generateFullSpatialContext() {
    const lines = ['=== HELICOPTER VS ROBOT - WORLD STATE ==='];

    lines.push('\nENTITIES (with facing):');
    this.entities.forEach((entity, id) => {
      lines.push(`  ${id} (${entity.type}):`);
      lines.push(`    Position: [${entity.position.map(n => n.toFixed(1)).join(', ')}]`);
      lines.push(`    Facing: ${entity.facing.description}`);
      if (entity.positionHistory.length > 0) {
        lines.push(`    Movement history: ${entity.positionHistory.length} beats`);
      }
    });

    lines.push('\nCAMERA RIGS:');
    this.cameras.forEach((cam, id) => {
      lines.push(`  ${id}: pos [${cam.position.map(n => n.toFixed(1)).join(', ')}] → lookAt [${cam.lookAt.map(n => n.toFixed(1)).join(', ')}]`);
    });

    lines.push('\nSPATIAL RELATIONSHIPS:');
    const ids = Array.from(this.entities.keys());
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const dist = this.getDistanceBetween(ids[i], ids[j]);
        if (dist !== null) {
          lines.push(`  ${ids[i]} ↔ ${ids[j]}: ${dist.toFixed(1)}m`);
        }
      }
    }

    return lines.join('\n');
  }

  toJSON() {
    return {
      worldId: this.worldId,
      entities: Object.fromEntries(
        Array.from(this.entities.entries()).map(([id, e]) => [id, {
          id: e.id,
          type: e.type,
          position: e.position,
          facing: e.facing,
          positionHistory: e.positionHistory
        }])
      ),
      cameras: Object.fromEntries(this.cameras)
    };
  }
}

// ============================================
// HELICOPTER VS ROBOT STORY
// ============================================

console.log('🚁 HELICOPTER VS ROBOT - SPATIAL STORY TEST\n');
console.log('═'.repeat(60));

// Create World State
const worldState = {
  world_id: 'helicopter_vs_robot_battle',
  entities: [
    {
      entity_id: 'ATTACK_HELICOPTER',
      entity_type: 'vehicle',
      base_world_position: { x: 0, y: 50, z: -100 },  // Starts in the air, far back
      base_orientation: { yaw_deg: 0, pitch_deg: 0, roll_deg: 0 }
    },
    {
      entity_id: 'GIANT_ROBOT',
      entity_type: 'character',
      base_world_position: { x: 0, y: 0, z: 0 },  // Robot on ground at origin
      base_orientation: { yaw_deg: 180, pitch_deg: 0, roll_deg: 0 }  // Facing helicopter
    },
    {
      entity_id: 'CITY_BUILDING_A',
      entity_type: 'prop',
      base_world_position: { x: -30, y: 0, z: -20 },
      base_orientation: { yaw_deg: 0, pitch_deg: 0, roll_deg: 0 }
    },
    {
      entity_id: 'CITY_BUILDING_B',
      entity_type: 'prop',
      base_world_position: { x: 40, y: 0, z: 10 },
      base_orientation: { yaw_deg: 0, pitch_deg: 0, roll_deg: 0 }
    }
  ]
};

const cameraRigs = {
  camera_rigs: [
    {
      rig_id: 'WIDE_ESTABLISHING',
      camera_position: { x: 100, y: 80, z: 100 },
      look_at: { x: 0, y: 25, z: 0 },
      default_lens_mm: 24
    },
    {
      rig_id: 'HELICOPTER_COCKPIT',
      camera_position: { x: 0, y: 52, z: -98 },  // Inside helicopter
      look_at: { x: 0, y: 0, z: 0 },
      default_lens_mm: 35
    },
    {
      rig_id: 'ROBOT_LOW_ANGLE',
      camera_position: { x: 5, y: 2, z: 15 },
      look_at: { x: 0, y: 30, z: 0 },
      default_lens_mm: 18
    },
    {
      rig_id: 'ACTION_TRACKING',
      camera_position: { x: -20, y: 40, z: -30 },
      look_at: { x: 0, y: 25, z: 0 },
      default_lens_mm: 50
    }
  ]
};

// Initialize context
const ctx = new WorldStateContext();
ctx.initFromWorldState(worldState, cameraRigs);

console.log('\n📍 INITIAL STATE:');
console.log(ctx.generateFullSpatialContext());

// ============================================
// SIMULATE STORY BEATS
// ============================================

console.log('\n\n' + '═'.repeat(60));
console.log('🎬 STORY BEATS WITH SPATIAL DECISIONS');
console.log('═'.repeat(60));

const storyBeats = [
  {
    beat_id: 'beat_01',
    description: 'WIDE SHOT - Helicopter approaches city where robot waits',
    decisions: [
      {
        entityId: 'ATTACK_HELICOPTER',
        positionDelta: [0, 0, 30],  // Move 30m closer
        facingTarget: 'GIANT_ROBOT',
        storyReason: 'Helicopter approaches, acquiring target'
      }
    ]
  },
  {
    beat_id: 'beat_02',
    description: 'Robot spots helicopter, turns to face threat',
    decisions: [
      {
        entityId: 'GIANT_ROBOT',
        positionDelta: [0, 0, 0],  // Stays in place
        facingTarget: 'ATTACK_HELICOPTER',
        storyReason: 'Robot detects incoming threat, raises weapons'
      }
    ]
  },
  {
    beat_id: 'beat_03',
    description: 'Helicopter dives and strafes, robot fires back',
    decisions: [
      {
        entityId: 'ATTACK_HELICOPTER',
        positionDelta: [20, -20, 40],  // Dive right and forward
        facingTarget: 'GIANT_ROBOT',
        storyReason: 'Helicopter executes attack run, firing missiles'
      },
      {
        entityId: 'GIANT_ROBOT',
        positionDelta: [-5, 0, 0],  // Sidestep left
        facingTarget: 'ATTACK_HELICOPTER',
        storyReason: 'Robot dodges while returning fire'
      }
    ]
  },
  {
    beat_id: 'beat_04',
    description: 'Helicopter circles behind building for cover',
    decisions: [
      {
        entityId: 'ATTACK_HELICOPTER',
        positionDelta: [-50, 10, -20],  // Circle left, gain altitude
        facingTarget: 'CITY_BUILDING_A',
        storyReason: 'Helicopter breaks off, using building as cover'
      }
    ]
  },
  {
    beat_id: 'beat_05',
    description: 'Robot charges toward helicopter position',
    decisions: [
      {
        entityId: 'GIANT_ROBOT',
        positionDelta: [-15, 0, -10],  // Charge toward helicopter
        facingTarget: 'ATTACK_HELICOPTER',
        storyReason: 'Robot closes distance aggressively'
      }
    ]
  },
  {
    beat_id: 'beat_06',
    description: 'Final clash - helicopter emerges for killing blow',
    decisions: [
      {
        entityId: 'ATTACK_HELICOPTER',
        positionDelta: [30, -15, 30],  // Emerge from cover, dive
        facingTarget: 'GIANT_ROBOT',
        storyReason: 'Helicopter emerges for final attack run'
      },
      {
        entityId: 'GIANT_ROBOT',
        positionDelta: [0, 0, 0],
        facingTarget: 'ATTACK_HELICOPTER',
        storyReason: 'Robot braces for impact, last stand'
      }
    ]
  }
];

// Process each beat
for (const beat of storyBeats) {
  console.log(`\n📌 ${beat.beat_id.toUpperCase()}: ${beat.description}`);
  ctx.setCurrentBeat(beat.beat_id);

  for (const decision of beat.decisions) {
    const result = ctx.applyAgentDecision(decision);
    const entity = ctx.entities.get(decision.entityId);
    console.log(`   ${decision.entityId}:`);
    console.log(`     → Position: [${entity.position.map(n => n.toFixed(1)).join(', ')}]`);
    console.log(`     → Facing: ${entity.facing.description}`);
    console.log(`     → Reason: ${decision.storyReason}`);
  }

  // Show distance after this beat
  const dist = ctx.getDistanceBetween('ATTACK_HELICOPTER', 'GIANT_ROBOT');
  console.log(`   📏 Distance: Helicopter ↔ Robot = ${dist?.toFixed(1)}m`);
}

// ============================================
// FINAL OUTPUT
// ============================================

console.log('\n\n' + '═'.repeat(60));
console.log('📊 FINAL WORLD STATE');
console.log('═'.repeat(60));
console.log(ctx.generateFullSpatialContext());

console.log('\n\n' + '═'.repeat(60));
console.log('📄 JSON OUTPUT (for verification)');
console.log('═'.repeat(60));
console.log(JSON.stringify(ctx.toJSON(), null, 2));
