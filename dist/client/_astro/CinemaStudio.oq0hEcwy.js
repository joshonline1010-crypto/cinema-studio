import{j as s}from"./jsx-runtime.BG36-YHJ.js";import{r as Z}from"./index.y5FlbPQu.js";import{c as Dd}from"./index.s7pVKYCa.js";const Ha=()=>({id:`shot-${Date.now()}`,startFrame:null,endFrame:null,cameraPresets:[],lens:null,cameraBody:null,focus:null,motionPrompt:"",model:"kling-2.6",duration:5,videoUrl:null,status:"draft"}),hu=Dd((i,e)=>({currentShot:Ha(),shots:[],characterDNA:null,sequencePlan:[],isAutoChaining:!1,currentSequenceIndex:0,selectedPresets:[],selectedLens:null,selectedCamera:null,selectedFocus:null,isGenerating:!1,generationProgress:0,error:null,setCharacterDNA:t=>i({characterDNA:t}),setStartFrame:t=>i(n=>({currentShot:{...n.currentShot,startFrame:t}})),setEndFrame:t=>i(n=>({currentShot:{...n.currentShot,endFrame:t},...t?{currentShot:{...n.currentShot,endFrame:t,model:"kling-o1"}}:{}})),togglePreset:t=>i(n=>{const r=n.selectedPresets.find(l=>l.id===t.id);let a;r?a=n.selectedPresets.filter(l=>l.id!==t.id):n.selectedPresets.length<3?a=[...n.selectedPresets,t]:a=[...n.selectedPresets.slice(1),t];const o=a.map(l=>l.prompt.split(",")[0]).join(", ");return{selectedPresets:a,currentShot:{...n.currentShot,cameraPresets:a,motionPrompt:n.currentShot.motionPrompt||o}}}),clearPresets:()=>i(t=>({selectedPresets:[],currentShot:{...t.currentShot,cameraPresets:[],motionPrompt:""}})),setLens:t=>i(n=>({selectedLens:t,currentShot:{...n.currentShot,lens:t}})),setCameraBody:t=>i(n=>({selectedCamera:t,currentShot:{...n.currentShot,cameraBody:t}})),setFocus:t=>i(n=>({selectedFocus:t,currentShot:{...n.currentShot,focus:t}})),setMotionPrompt:t=>i(n=>({currentShot:{...n.currentShot,motionPrompt:t}})),setModel:t=>i(n=>({currentShot:{...n.currentShot,model:t}})),setDuration:t=>i(n=>({currentShot:{...n.currentShot,duration:t}})),setGenerating:t=>i({isGenerating:t}),startGeneration:()=>i({isGenerating:!0,generationProgress:0,error:null}),setProgress:t=>i({generationProgress:t}),completeGeneration:t=>i(n=>({isGenerating:!1,generationProgress:100,currentShot:{...n.currentShot,videoUrl:t,status:"complete"}})),failGeneration:t=>i(n=>({isGenerating:!1,generationProgress:0,error:t,currentShot:{...n.currentShot,status:"error"}})),addShot:t=>i(n=>({shots:[...n.shots,t]})),removeShot:t=>i(n=>({shots:n.shots.filter(r=>r.id!==t)})),reorderShots:(t,n)=>i(r=>{const a=[...r.shots],[o]=a.splice(t,1);return a.splice(n,0,o),{shots:a}}),saveCurrentAsShot:()=>i(t=>t.currentShot.videoUrl?{shots:[...t.shots,{...t.currentShot,id:`shot-${Date.now()}`}],currentShot:Ha(),selectedPresets:[],selectedLens:null,selectedCamera:null,selectedFocus:null}:t),resetCurrent:()=>i({currentShot:Ha(),selectedPresets:[],selectedLens:null,selectedCamera:null,selectedFocus:null,isGenerating:!1,generationProgress:0,error:null}),addPlannedShot:t=>i(n=>({sequencePlan:[...n.sequencePlan,{...t,id:`planned-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,status:"planned"}]})),updatePlannedShot:(t,n)=>i(r=>({sequencePlan:r.sequencePlan.map(a=>a.id===t?{...a,...n}:a)})),removePlannedShot:t=>i(n=>({sequencePlan:n.sequencePlan.filter(r=>r.id!==t)})),reorderPlannedShots:(t,n)=>i(r=>{const a=[...r.sequencePlan],[o]=a.splice(t,1);return a.splice(n,0,o),{sequencePlan:a}}),clearSequencePlan:()=>i({sequencePlan:[],currentSequenceIndex:0,isAutoChaining:!1}),setAutoChaining:t=>i({isAutoChaining:t}),setCurrentSequenceIndex:t=>i({currentSequenceIndex:t}),markPlannedShotComplete:(t,n,r)=>i(a=>({sequencePlan:a.sequencePlan.map(o=>o.id===t?{...o,status:"complete",imageUrl:n,videoUrl:r}:o)}))})),uu=["says","speaks","talking","dialogue","voice","speech","says:","speaks:",'"',"'",":","exclaims","whispers","shouts","murmurs","announces","declares","pleads","asks","responds","replies","explains","lip sync","lipsync","lip-sync","mouthing","mouth moves","warmly","excitedly","calmly","confidently","enthusiastically","passionately","angrily","sadly","playfully","seriously","ugc","talking head","talking-head","presenter","host","creator","vlog","interview","testimonial","direct to camera","eye contact","in english","in mandarin","in japanese","in korean","in spanish","in portuguese","in indonesian","in cantonese","conversation","discusse","chat","banter"];function fu(i){const e=i.motionPrompt.toLowerCase();if(i.endFrame)return"Kling O1: Start→End frame transition";const t=uu.find(n=>e.includes(n.toLowerCase()));return t?`Seedance 1.5: Detected dialogue ("${t}")`:"Kling 2.6: General motion/action"}const pu={};function mu(i,e){let t;try{t=i()}catch{return}return{getItem:r=>{var a;const o=d=>d===null?null:JSON.parse(d,void 0),l=(a=t.getItem(r))!=null?a:null;return l instanceof Promise?l.then(o):o(l)},setItem:(r,a)=>t.setItem(r,JSON.stringify(a,void 0)),removeItem:r=>t.removeItem(r)}}const hs=i=>e=>{try{const t=i(e);return t instanceof Promise?t:{then(n){return hs(n)(t)},catch(n){return this}}}catch(t){return{then(n){return this},catch(n){return hs(n)(t)}}}},gu=(i,e)=>(t,n,r)=>{let a={getStorage:()=>localStorage,serialize:JSON.stringify,deserialize:JSON.parse,partialize:x=>x,version:0,merge:(x,p)=>({...p,...x}),...e},o=!1;const l=new Set,d=new Set;let h;try{h=a.getStorage()}catch{}if(!h)return i((...x)=>{console.warn(`[zustand persist middleware] Unable to update item '${a.name}', the given storage is currently unavailable.`),t(...x)},n,r);const u=hs(a.serialize),f=()=>{const x=a.partialize({...n()});let p;const E=u({state:x,version:a.version}).then(T=>h.setItem(a.name,T)).catch(T=>{p=T});if(p)throw p;return E},m=r.setState;r.setState=(x,p)=>{m(x,p),f()};const g=i((...x)=>{t(...x),f()},n,r);let y;const _=()=>{var x;if(!h)return;o=!1,l.forEach(E=>E(n()));const p=((x=a.onRehydrateStorage)==null?void 0:x.call(a,n()))||void 0;return hs(h.getItem.bind(h))(a.name).then(E=>{if(E)return a.deserialize(E)}).then(E=>{if(E)if(typeof E.version=="number"&&E.version!==a.version){if(a.migrate)return a.migrate(E.state,E.version);console.error("State loaded from storage couldn't be migrated since no migrate function was provided")}else return E.state}).then(E=>{var T;return y=a.merge(E,(T=n())!=null?T:g),t(y,!0),f()}).then(()=>{p?.(y,void 0),o=!0,d.forEach(E=>E(y))}).catch(E=>{p?.(void 0,E)})};return r.persist={setOptions:x=>{a={...a,...x},x.getStorage&&(h=x.getStorage())},clearStorage:()=>{h?.removeItem(a.name)},getOptions:()=>a,rehydrate:()=>_(),hasHydrated:()=>o,onHydrate:x=>(l.add(x),()=>{l.delete(x)}),onFinishHydration:x=>(d.add(x),()=>{d.delete(x)})},_(),y||g},xu=(i,e)=>(t,n,r)=>{let a={storage:mu(()=>localStorage),partialize:_=>_,version:0,merge:(_,x)=>({...x,..._}),...e},o=!1;const l=new Set,d=new Set;let h=a.storage;if(!h)return i((..._)=>{console.warn(`[zustand persist middleware] Unable to update item '${a.name}', the given storage is currently unavailable.`),t(..._)},n,r);const u=()=>{const _=a.partialize({...n()});return h.setItem(a.name,{state:_,version:a.version})},f=r.setState;r.setState=(_,x)=>{f(_,x),u()};const m=i((..._)=>{t(..._),u()},n,r);r.getInitialState=()=>m;let g;const y=()=>{var _,x;if(!h)return;o=!1,l.forEach(E=>{var T;return E((T=n())!=null?T:m)});const p=((x=a.onRehydrateStorage)==null?void 0:x.call(a,(_=n())!=null?_:m))||void 0;return hs(h.getItem.bind(h))(a.name).then(E=>{if(E)if(typeof E.version=="number"&&E.version!==a.version){if(a.migrate)return[!0,a.migrate(E.state,E.version)];console.error("State loaded from storage couldn't be migrated since no migrate function was provided")}else return[!1,E.state];return[!1,void 0]}).then(E=>{var T;const[C,N]=E;if(g=a.merge(N,(T=n())!=null?T:m),t(g,!0),C)return u()}).then(()=>{p?.(g,void 0),g=n(),o=!0,d.forEach(E=>E(g))}).catch(E=>{p?.(void 0,E)})};return r.persist={setOptions:_=>{a={...a,..._},_.storage&&(h=_.storage)},clearStorage:()=>{h?.removeItem(a.name)},getOptions:()=>a,rehydrate:()=>y(),hasHydrated:()=>o,onHydrate:_=>(l.add(_),()=>{l.delete(_)}),onFinishHydration:_=>(d.add(_),()=>{d.delete(_)})},a.skipHydration||y(),g||m},vu=(i,e)=>"getStorage"in e||"serialize"in e||"deserialize"in e?((pu?"production":void 0)!=="production"&&console.warn("[DEPRECATED] `getStorage`, `serialize` and `deserialize` options are deprecated. Use `storage` option instead."),gu(i,e)):xu(i,e),_u=vu,Id=()=>`${Date.now()}-${Math.random().toString(36).substr(2,9)}`,yu=(i={})=>({scene_id:i.scene_id||Id(),name:i.name||"New Scene",description:i.description||"",duration_estimate:i.duration_estimate||0,location:i.location||"",time_of_day:i.time_of_day||"day",mood:i.mood||"",color_palette:i.color_palette||"",aspect_ratio:i.aspect_ratio||"16:9",director:i.director,year:i.year,character_references:i.character_references||{},scene_references:i.scene_references||{},shots:i.shots||[],audio_layers:i.audio_layers||[],execution_notes:i.execution_notes,created_at:new Date().toISOString(),updated_at:new Date().toISOString()}),bc=i=>{try{const e=JSON.parse(i),t=(e.shots||[]).map((n,r)=>({shot_id:n.shot_id||`shot_${String(r+1).padStart(3,"0")}`,order:n.order??r+1,frames:n.frames,shot_type:n.shot_type||"medium",subject:n.subject||"",location:n.location||"",start_frame:n.start_frame,end_frame:n.end_frame,duration:n.duration||2,model:n.model||"kling-2.6",dialog:n.dialog,photo_prompt:n.photo_prompt||"",motion_prompt:n.motion_prompt||"",transition_in:n.transition_in,transition_out:n.transition_out||"cut",narrative_beat:n.narrative_beat||"",status:n.status||(n.image_url?"done":"pending"),image_url:n.image_url,video_url:n.video_url}));return{scene_id:e.scene_id||Id(),name:e.name||"Imported Scene",description:e.description||"",duration_estimate:e.duration_estimate||t.reduce((n,r)=>n+r.duration,0),location:e.location||"",time_of_day:e.time_of_day||"day",mood:e.mood||"",color_palette:e.color_palette||"",aspect_ratio:e.aspect_ratio||"16:9",director:e.director,year:e.year,character_references:e.character_references||{},scene_references:e.scene_references||{},shots:t,audio_layers:e.audio_layers||[],execution_notes:e.execution_notes,created_at:e.created_at||new Date().toISOString(),updated_at:new Date().toISOString()}}catch(e){return console.error("Failed to parse scene JSON:",e),null}},bu=Dd()(_u((i,e)=>({currentScene:null,scenes:[],selectedShotId:null,loadScene:t=>{let n;typeof t=="string"?n=bc(t):n={...t,shots:t.shots.map(r=>({...r,status:r.status||(r.image_url?"done":"pending")})),updated_at:new Date().toISOString()},n&&i({currentScene:n,selectedShotId:null})},createScene:t=>{const n=yu(t);return i({currentScene:n,selectedShotId:null}),n},clearScene:()=>(typeof window<"u"&&localStorage.removeItem("cinema-scene-storage"),i({currentScene:null,selectedShotId:null})),resetAllGenerated:()=>i(t=>{if(!t.currentScene)return t;const n=t.currentScene.shots.map(o=>({...o,image_url:void 0,video_url:void 0,status:"pending"})),r={};Object.entries(t.currentScene.character_references||{}).forEach(([o,l])=>{r[o]={...l,ref_url:void 0}});const a={};return Object.entries(t.currentScene.scene_references||{}).forEach(([o,l])=>{a[o]={...l,ref_url:void 0}}),{currentScene:{...t.currentScene,shots:n,character_references:r,scene_references:a}}}),addShot:t=>i(n=>{if(!n.currentScene)return n;const r=n.currentScene.shots.length+1,a={...t,shot_id:`shot_${String(r).padStart(3,"0")}`,order:r,status:"pending"};return{currentScene:{...n.currentScene,shots:[...n.currentScene.shots,a],updated_at:new Date().toISOString()}}}),updateShot:(t,n)=>i(r=>r.currentScene?{currentScene:{...r.currentScene,shots:r.currentScene.shots.map(a=>a.shot_id===t?{...a,...n}:a),updated_at:new Date().toISOString()}}:r),removeShot:t=>i(n=>{if(!n.currentScene)return n;const r=n.currentScene.shots.filter(a=>a.shot_id!==t).map((a,o)=>({...a,order:o+1}));return{currentScene:{...n.currentScene,shots:r,updated_at:new Date().toISOString()},selectedShotId:n.selectedShotId===t?null:n.selectedShotId}}),reorderShots:t=>i(n=>{if(!n.currentScene)return n;const r=new Map(n.currentScene.shots.map(o=>[o.shot_id,o])),a=t.map(o=>r.get(o)).filter(o=>!!o).map((o,l)=>({...o,order:l+1}));return{currentScene:{...n.currentScene,shots:a,updated_at:new Date().toISOString()}}}),addCharacter:t=>i(n=>{if(!n.currentScene)return n;const r=t.name.toLowerCase().replace(/\s+/g,"_"),a={...t,id:r};return{currentScene:{...n.currentScene,character_references:{...n.currentScene.character_references,[r]:a},updated_at:new Date().toISOString()}}}),updateCharacter:(t,n)=>i(r=>{if(!r.currentScene)return r;const a=r.currentScene.character_references[t];return a?{currentScene:{...r.currentScene,character_references:{...r.currentScene.character_references,[t]:{...a,...n}},updated_at:new Date().toISOString()}}:r}),removeCharacter:t=>i(n=>{if(!n.currentScene)return n;const{[t]:r,...a}=n.currentScene.character_references;return{currentScene:{...n.currentScene,character_references:a,updated_at:new Date().toISOString()}}}),addSceneRef:t=>i(n=>{if(!n.currentScene)return n;const r=t.name.toLowerCase().replace(/\s+/g,"_"),a={...t,id:r};return{currentScene:{...n.currentScene,scene_references:{...n.currentScene.scene_references,[r]:a},updated_at:new Date().toISOString()}}}),updateSceneRef:(t,n)=>i(r=>{if(!r.currentScene)return r;const a=r.currentScene.scene_references?.[t];return a?{currentScene:{...r.currentScene,scene_references:{...r.currentScene.scene_references,[t]:{...a,...n}},updated_at:new Date().toISOString()}}:r}),removeSceneRef:t=>i(n=>{if(!n.currentScene||!n.currentScene.scene_references)return n;const{[t]:r,...a}=n.currentScene.scene_references;return{currentScene:{...n.currentScene,scene_references:a,updated_at:new Date().toISOString()}}}),selectShot:t=>i({selectedShotId:t}),getSelectedShot:()=>{const t=e();return!t.currentScene||!t.selectedShotId?null:t.currentScene.shots.find(n=>n.shot_id===t.selectedShotId)||null},markShotGenerating:t=>i(n=>n.currentScene?{currentScene:{...n.currentScene,shots:n.currentScene.shots.map(r=>r.shot_id===t?{...r,status:"generating"}:r)}}:n),markShotComplete:(t,n,r)=>i(a=>a.currentScene?{currentScene:{...a.currentScene,shots:a.currentScene.shots.map(o=>o.shot_id===t?{...o,status:"done",image_url:n,video_url:r||o.video_url}:o),updated_at:new Date().toISOString()}}:a),markShotPending:t=>i(n=>n.currentScene?{currentScene:{...n.currentScene,shots:n.currentScene.shots.map(r=>r.shot_id===t?{...r,status:"pending"}:r)}}:n),exportSceneJSON:()=>{const t=e().currentScene;if(!t)return"{}";const n={scene_id:t.scene_id,name:t.name,description:t.description,duration_estimate:t.duration_estimate,location:t.location,time_of_day:t.time_of_day,mood:t.mood,color_palette:t.color_palette,aspect_ratio:t.aspect_ratio,director:t.director,year:t.year,character_references:t.character_references,shots:t.shots.map(r=>({shot_id:r.shot_id,order:r.order,frames:r.frames,shot_type:r.shot_type,subject:r.subject,location:r.location,start_frame:r.start_frame,end_frame:r.end_frame,duration:r.duration,model:r.model,dialog:r.dialog,photo_prompt:r.photo_prompt,motion_prompt:r.motion_prompt,transition_in:r.transition_in,transition_out:r.transition_out,narrative_beat:r.narrative_beat,image_url:r.image_url,video_url:r.video_url})),audio_layers:t.audio_layers,execution_notes:t.execution_notes};return JSON.stringify(n,null,2)},importSceneJSON:t=>{const n=bc(t);return n?(i({currentScene:n,selectedShotId:null}),!0):!1},getStats:()=>{const t=e().currentScene;if(!t)return{total:0,done:0,generating:0,pending:0};const n={total:t.shots.length,done:0,generating:0,pending:0};for(const r of t.shots)r.status==="done"?n.done++:r.status==="generating"?n.generating++:n.pending++;return n}}),{name:"cinema-scene-storage",partialize:i=>({currentScene:i.currentScene,scenes:i.scenes})})),qr=[{id:"dolly-in",name:"Dolly In",category:"dolly",prompt:"dolly in, forward camera movement, approaching subject, smooth push in",icon:"⬆️",description:"Camera moves toward subject"},{id:"dolly-out",name:"Dolly Out",category:"dolly",prompt:"dolly out, pull back, revealing shot, backward camera movement",icon:"⬇️",description:"Camera moves away from subject"},{id:"dolly-left",name:"Truck Left",category:"dolly",prompt:"truck left, lateral tracking shot, camera slides left, parallax movement",icon:"⬅️",description:"Camera slides left"},{id:"dolly-right",name:"Truck Right",category:"dolly",prompt:"truck right, lateral tracking shot, camera slides right, parallax movement",icon:"➡️",description:"Camera slides right"},{id:"pan-left",name:"Pan Left",category:"pan",prompt:"pan left, horizontal sweep, smooth rotation left, camera turns",icon:"↩️",description:"Camera rotates left on axis"},{id:"pan-right",name:"Pan Right",category:"pan",prompt:"pan right, horizontal sweep, smooth rotation right, camera turns",icon:"↪️",description:"Camera rotates right on axis"},{id:"tilt-up",name:"Tilt Up",category:"tilt",prompt:"tilt up, vertical reveal, crane movement upward, looking up",icon:"🔼",description:"Camera tilts upward"},{id:"tilt-down",name:"Tilt Down",category:"tilt",prompt:"tilt down, vertical movement down, looking down, descending view",icon:"🔽",description:"Camera tilts downward"},{id:"orbit-left",name:"Orbit Left",category:"orbit",prompt:"orbit around subject counter-clockwise, circular tracking left, rotating view",icon:"🔄",description:"Camera circles left around subject"},{id:"orbit-right",name:"Orbit Right",category:"orbit",prompt:"orbit around subject clockwise, circular tracking right, rotating view",icon:"🔃",description:"Camera circles right around subject"},{id:"orbit-360",name:"360 Orbit",category:"orbit",prompt:"360-degree rotation around subject, full circular tracking, complete orbit",icon:"⭕",description:"Full circle around subject"},{id:"zoom-in",name:"Zoom In",category:"zoom",prompt:"slow zoom in, push in, intimate framing, gradual magnification",icon:"🔍",description:"Optical zoom toward subject"},{id:"zoom-out",name:"Zoom Out",category:"zoom",prompt:"slow zoom out, pull back zoom, wide reveal, gradual reduction",icon:"🔎",description:"Optical zoom away from subject"},{id:"crash-zoom",name:"Crash Zoom",category:"zoom",prompt:"crash zoom in, rapid zoom, dramatic emphasis, fast push in",icon:"💥",description:"Fast dramatic zoom"},{id:"handheld",name:"Handheld",category:"special",prompt:"handheld camera shake, documentary style, subtle organic movement, natural sway",icon:"📹",description:"Natural handheld movement"},{id:"fpv-drone",name:"FPV Drone",category:"special",prompt:"FPV drone movement, dynamic flight path, low altitude sweep, first person view",icon:"🚁",description:"First-person drone perspective"},{id:"bullet-time",name:"Bullet Time",category:"special",prompt:"frozen spin around subject, time freeze, slow motion rotation, matrix effect",icon:"⏱️",description:"Time freeze with rotation"},{id:"snorricam",name:"Snorricam",category:"special",prompt:"snorricam, subject-mounted camera, face stays centered, background moves",icon:"🎭",description:"Camera fixed to subject"},{id:"crane-up",name:"Crane Up",category:"special",prompt:"crane shot rising, vertical arc upward, jib movement ascending, establishing shot",icon:"🏗️",description:"Rising crane movement"},{id:"crane-down",name:"Crane Down",category:"special",prompt:"crane shot descending, vertical arc downward, jib movement down",icon:"⬇️",description:"Descending crane movement"},{id:"through-object",name:"Through",category:"special",prompt:"camera moves through doorway, keyhole transition, passing through opening",icon:"🚪",description:"Move through an opening"},{id:"steadicam",name:"Steadicam",category:"special",prompt:"steadicam following, smooth glide through space, floating camera movement",icon:"🎬",description:"Smooth floating follow"},{id:"static",name:"Static",category:"static",prompt:"static camera, locked off tripod shot, no movement, stable framing",icon:"📷",description:"No camera movement"},{id:"micro-movement",name:"Subtle",category:"static",prompt:"subtle micro-movements, barely perceptible drift, breathing camera",icon:"〰️",description:"Very subtle movement"}],Su=[{id:"ultra-wide-14",name:"14mm Ultra Wide",focalLength:"14mm",prompt:"shot on 14mm ultra-wide lens, extreme wide angle, dramatic perspective distortion, vast field of view",icon:"🌐",description:"Extreme wide, dramatic distortion"},{id:"wide-24",name:"24mm Wide",focalLength:"24mm",prompt:"shot on 24mm wide angle lens, expansive view, environmental context, slight perspective",icon:"📐",description:"Classic wide angle"},{id:"wide-35",name:"35mm",focalLength:"35mm",prompt:"shot on 35mm lens, natural perspective, documentary feel, versatile framing",icon:"🎞️",description:"Natural, documentary feel"},{id:"standard-50",name:"50mm",focalLength:"50mm",prompt:"shot on 50mm lens, natural human eye perspective, classic cinema look, minimal distortion",icon:"👁️",description:"Human eye perspective"},{id:"portrait-85",name:"85mm Portrait",focalLength:"85mm",prompt:"shot on 85mm portrait lens, flattering compression, beautiful bokeh, subject isolation",icon:"🖼️",description:"Flattering portrait compression"},{id:"tele-135",name:"135mm",focalLength:"135mm",prompt:"shot on 135mm telephoto lens, strong compression, creamy background blur, intimate feel",icon:"🔭",description:"Strong compression, intimate"},{id:"tele-200",name:"200mm Telephoto",focalLength:"200mm",prompt:"shot on 200mm telephoto lens, extreme compression, stacked planes, paparazzi aesthetic",icon:"📡",description:"Extreme compression"},{id:"anamorphic",name:"Anamorphic",focalLength:"anamorphic",prompt:"shot on anamorphic lens, horizontal lens flares, oval bokeh, 2.39:1 cinematic, widescreen",icon:"🎬",description:"Cinematic flares & oval bokeh"},{id:"anamorphic-vintage",name:"Vintage Anamorphic",focalLength:"vintage anamorphic",prompt:"vintage anamorphic lens, blue streak lens flares, aberrations, organic imperfections, filmic",icon:"✨",description:"Classic Hollywood look"},{id:"macro",name:"Macro",focalLength:"macro",prompt:"shot on macro lens, extreme close-up, tiny details revealed, microscopic view",icon:"🔬",description:"Extreme detail close-up"},{id:"fisheye",name:"Fisheye",focalLength:"fisheye",prompt:"shot on fisheye lens, 180-degree view, barrel distortion, spherical perspective",icon:"🐟",description:"Spherical wide distortion"},{id:"tilt-shift",name:"Tilt-Shift",focalLength:"tilt-shift",prompt:"tilt-shift lens effect, miniature look, selective focus plane, diorama effect",icon:"🏠",description:"Miniature/diorama effect"}],wu=[{id:"arri-alexa",name:"ARRI Alexa",prompt:"shot on ARRI Alexa, rich color science, cinematic dynamic range, Hollywood production",icon:"🎥",description:"Hollywood standard, rich colors"},{id:"arri-65",name:"ARRI 65",prompt:"shot on ARRI 65 large format, stunning detail, IMAX-quality, epic scope",icon:"🎞️",description:"Large format IMAX quality"},{id:"red-v-raptor",name:"RED V-Raptor",prompt:"shot on RED V-Raptor 8K, ultra high resolution, sharp detail, modern cinema look",icon:"🔴",description:"Sharp 8K digital cinema"},{id:"sony-venice",name:"Sony Venice",prompt:"shot on Sony Venice, dual ISO, wide color gamut, versatile cinematic look",icon:"📹",description:"Versatile dual ISO cinema"},{id:"blackmagic",name:"Blackmagic URSA",prompt:"shot on Blackmagic URSA, raw capture, indie cinema aesthetic, high dynamic range",icon:"⬛",description:"Indie cinema raw look"},{id:"imax-70mm",name:"IMAX 70mm",prompt:"shot on IMAX 70mm film, massive resolution, epic scale, theatrical experience",icon:"🏛️",description:"Epic IMAX theatrical"},{id:"kodak-5219",name:"Kodak Vision3 500T",prompt:"shot on Kodak Vision3 500T film stock, warm tungsten, beautiful grain, classic Hollywood",icon:"🟡",description:"Warm tungsten film look"},{id:"kodak-5207",name:"Kodak Vision3 250D",prompt:"shot on Kodak Vision3 250D daylight film, natural colors, fine grain, daylight balanced",icon:"☀️",description:"Natural daylight film"},{id:"fuji-eterna",name:"Fuji Eterna",prompt:"shot on Fuji Eterna film, subtle colors, gentle contrast, Japanese cinema aesthetic",icon:"🗻",description:"Subtle Japanese cinema look"},{id:"super-8",name:"Super 8",focalLength:"super8",prompt:"shot on Super 8 film, heavy grain, vintage home movie look, nostalgic, light leaks",icon:"📼",description:"Nostalgic home movie grain"},{id:"16mm-bolex",name:"16mm Bolex",prompt:"shot on 16mm Bolex, documentary texture, indie film grain, authentic vintage",icon:"🎬",description:"Indie documentary texture"},{id:"vhs",name:"VHS Camcorder",prompt:"VHS camcorder footage, low resolution, tracking lines, retro 80s aesthetic, analog",icon:"📺",description:"Retro VHS aesthetic"},{id:"dslr-cinematic",name:"DSLR Cinematic",prompt:"DSLR cinematic footage, shallow depth of field, digital but filmic, run and gun",icon:"📷",description:"Modern DSLR film look"}],Mu=[{id:"film-noir",name:"Film Noir",prompt:"film noir style, high contrast, deep shadows, 1940s detective film, black and white, dramatic lighting",description:"Classic detective film look"},{id:"golden-hour",name:"Golden Hour",prompt:"golden hour lighting, warm sunset tones, magic hour, soft golden light, romantic atmosphere",description:"Warm sunset magic hour"},{id:"cyberpunk",name:"Cyberpunk",prompt:"cyberpunk aesthetic, neon lights, rain-soaked streets, futuristic dystopia, pink and blue neon",description:"Neon-lit futuristic dystopia"},{id:"horror",name:"Horror",prompt:"horror film atmosphere, dark shadows, unsettling tension, dread, ominous lighting",description:"Dark unsettling tension"},{id:"dreamy",name:"Dreamy",prompt:"dreamy ethereal look, soft focus, pastel colors, hazy glow, fantasy atmosphere",description:"Soft ethereal fantasy"},{id:"gritty",name:"Gritty",prompt:"gritty realistic look, desaturated colors, harsh lighting, raw documentary style",description:"Raw realistic documentary"},{id:"vintage-70s",name:"70s Vintage",prompt:"1970s film look, warm color grade, film grain, faded blacks, retro vintage",description:"Retro 1970s film style"},{id:"blockbuster",name:"Blockbuster",prompt:"Hollywood blockbuster style, teal and orange color grade, high production value, epic scale",description:"Big budget Hollywood look"},{id:"anime",name:"Anime Style",prompt:"anime visual style, vibrant colors, dramatic lighting, Japanese animation aesthetic",description:"Japanese animation look"},{id:"wes-anderson",name:"Wes Anderson",prompt:"Wes Anderson style, symmetrical framing, pastel color palette, whimsical, centered composition",description:"Symmetrical whimsical pastel"}],Eu=[{id:"natural",name:"Natural Light",prompt:"natural lighting, available light, realistic illumination",description:"Realistic available light"},{id:"three-point",name:"Three Point",prompt:"three point lighting setup, key light, fill light, back light, studio lighting",description:"Classic studio setup"},{id:"rembrandt",name:"Rembrandt",prompt:"Rembrandt lighting, triangle shadow on cheek, dramatic portraiture, chiaroscuro",description:"Classic portrait triangle shadow"},{id:"silhouette",name:"Silhouette",prompt:"silhouette lighting, backlit, rim light only, subject in shadow",description:"Backlit shadow outline"},{id:"neon",name:"Neon Glow",prompt:"neon lighting, colored light gels, cyberpunk glow, pink and blue neon",description:"Colorful neon glow"},{id:"harsh-sun",name:"Harsh Sun",prompt:"harsh midday sun, hard shadows, high contrast, bright highlights",description:"Strong midday sunlight"},{id:"overcast",name:"Overcast",prompt:"overcast soft light, diffused illumination, no harsh shadows, even lighting",description:"Soft diffused daylight"},{id:"candlelight",name:"Candlelight",prompt:"candlelight illumination, warm flickering light, intimate atmosphere, orange glow",description:"Warm intimate flicker"},{id:"moonlight",name:"Moonlight",prompt:"moonlight illumination, blue night lighting, cool tones, nocturnal atmosphere",description:"Cool blue night light"},{id:"volumetric",name:"Volumetric",prompt:"volumetric lighting, god rays, light shafts through atmosphere, dramatic beams",description:"Dramatic light rays"}],Tu=[{id:"very-slow",name:"Very Slow",prompt:"very slow motion, ultra smooth, glacial pace, meditative",description:"Ultra slow meditative"},{id:"slow",name:"Slow",prompt:"slow motion, gentle movement, smooth and deliberate",description:"Gentle deliberate motion"},{id:"normal",name:"Normal",prompt:"natural speed, normal motion, realistic timing",description:"Natural realistic speed"},{id:"fast",name:"Fast",prompt:"fast motion, dynamic movement, energetic pace, quick",description:"Dynamic energetic motion"},{id:"speed-ramp",name:"Speed Ramp",prompt:"speed ramping, slow to fast transition, time manipulation, dramatic timing",description:"Slow-mo to fast transition"},{id:"timelapse",name:"Timelapse",prompt:"timelapse motion, accelerated time, hours in seconds",description:"Accelerated time passage"},{id:"hyperlapse",name:"Hyperlapse",prompt:"hyperlapse, moving timelapse, traveling through time, dynamic timelapse",description:"Moving timelapse"}],Au=[{id:"clear",name:"Clear",prompt:"clear atmosphere, crisp visibility, no atmospheric effects",description:"Clear crisp air"},{id:"fog",name:"Fog",prompt:"thick fog, atmospheric haze, mysterious foggy, low visibility",description:"Mysterious thick fog"},{id:"mist",name:"Mist",prompt:"light mist, morning haze, subtle atmospheric diffusion",description:"Light morning mist"},{id:"rain",name:"Rain",prompt:"heavy rain, wet surfaces, rain drops, puddle reflections, stormy",description:"Rainy wet atmosphere"},{id:"snow",name:"Snow",prompt:"falling snow, winter atmosphere, snowflakes, cold breath visible",description:"Winter snowfall"},{id:"dust",name:"Dust",prompt:"dust particles, volumetric dust, hazy dusty air, particles in light",description:"Dusty particle-filled air"},{id:"smoke",name:"Smoke",prompt:"smoke atmosphere, hazy smoke, atmospheric smoke wisps",description:"Smoky hazy atmosphere"},{id:"underwater",name:"Underwater",prompt:"underwater atmosphere, light rays through water, bubbles, aquatic",description:"Submerged underwater"},{id:"heat-haze",name:"Heat Haze",prompt:"heat distortion, desert mirage, shimmering hot air",description:"Hot shimmering distortion"}],Ti=[{id:"kubrick",name:"Kubrick",director:"Stanley Kubrick",prompt:"Stanley Kubrick style, symmetrical one-point perspective, wide angle lens, cold sterile lighting, meticulous composition, centered framing, geometric architecture, Steadicam glide, clinical observation",description:"Symmetrical, cold, meticulous",recommendedCamera:"arri-alexa",recommendedLens:"wide-24",recommendedMovement:["dolly-in","steadicam","static"],recommendedLighting:"low-key",recommendedStyle:"gritty",recommendedAtmosphere:"clear",recommendedFraming:"centered-symmetrical",recommendedSetDesign:"sterile-geometric",recommendedColorPalette:"desaturated-cold",recommendedCharacterStyle:"grunge-realistic",shotLibrary:[{id:"one-point-corridor",name:"One-Point Perspective Corridor",whenToUse:["Establishing geography","Character trapped by environment","Building dread/inevitability"],prompt:"one-point perspective shot, symmetrical corridor, vanishing point center frame, geometric architecture, wide angle lens, stark lighting, character small in vast space, Kubrick style, clinical precision, cold institutional, 18mm wide angle",lens:"wide-14",movement:"static or slow push",rig:"tripod or Steadicam"},{id:"kubrick-stare",name:"The Kubrick Stare",whenToUse:["Character crossed into madness","Psychological break","Direct confrontation with audience"],prompt:"Kubrick stare, head tilted down, eyes looking up at camera, intense menacing gaze, direct eye contact, close-up, cold lighting, centered framing, psychological intensity, character breaking sanity, unsettling, Kubrick style",lens:"standard-50",movement:"static or slow dolly in",rig:"tripod or dolly"},{id:"low-steadicam-follow",name:"Low Steadicam Follow",whenToUse:["Child POV","Vulnerability","Space hunting character"],prompt:"low angle Steadicam shot, 18 inches from ground, following character from behind, smooth gliding movement, child perspective, wide angle lens, corridor or hallway, ominous smooth tracking, Kubrick style, The Shining aesthetic",lens:"wide-24",movement:"steadicam glide",rig:"modified Steadicam 18 inches"},{id:"steadicam-follow",name:"Steadicam Follow (Standard)",whenToUse:["Character moving through environment","Space has power over character","Building tension through movement"],prompt:"Steadicam following shot, smooth gliding movement, character walking through space, symmetrical architecture, one-point perspective, wide angle, observational, ominous smooth tracking, Kubrick style, cold precision",lens:"wide-24",movement:"steadicam",rig:"Steadicam"},{id:"slow-dolly-in",name:"Slow Dolly In",whenToUse:["Building to revelation","Focusing attention","Psychological intimacy"],prompt:"slow dolly in, pushing toward face, mathematical precision, centered subject, building tension, inevitable approach, intimate observation, Kubrick style, static subject, moving camera, cold lighting",lens:"standard-50",movement:"dolly-in",rig:"dolly track"},{id:"architectural-wide",name:"Architectural Wide",whenToUse:["Establishing power of environment","Character insignificance","Institutional/cold spaces"],prompt:"extreme wide shot, architectural composition, geometric space, character dwarfed by environment, symmetrical framing, one-point perspective, institutional, cold sterile, Kubrick style, 18mm wide angle, vast interior space",lens:"wide-14",movement:"static",rig:"tripod"},{id:"reverse-zoom-tableau",name:"Reverse Zoom (Barry Lyndon)",whenToUse:["Period drama","Revealing context after intimacy","Painterly tableaus"],prompt:"reverse zoom reveal, starting close-up pulling to wide tableau, painterly composition, 18th century aesthetic, candlelit interior, period costume, soft natural lighting, Barry Lyndon style, Kubrick",lens:"standard-50",movement:"zoom out",rig:"tripod"},{id:"overhead-topdown",name:"Overhead/Top-Down",whenToUse:["Violence with clinical distance","Maze/pattern reveal","Gods-eye detachment"],prompt:"overhead top-down shot, looking straight down at subject, geometric composition, clinical detachment, pattern visible, Kubrick style, god's eye view, cold observation",lens:"wide-24",movement:"static",rig:"crane or ceiling mount"},{id:"interview-confrontation",name:"Interview/Confrontation",whenToUse:["Character explaining/confessing","Interview moments","Psychological examination"],prompt:"medium shot interview framing, subject centered, looking slightly off-camera, static tripod, cold lighting, institutional background, confrontational, Kubrick style, psychological examination, clinical observation",lens:"standard-50",movement:"static",rig:"tripod"},{id:"helicopter-establishing",name:"Helicopter Establishing",whenToUse:["Opening establishing shots","Showing journey/isolation","Environment dwarfs human"],prompt:"aerial helicopter shot, following vehicle through vast landscape, mountain roads, isolated journey, epic scale, character insignificant, nature dominates, Kubrick opening style, ominous establishing",lens:"telephoto-135",movement:"aerial tracking",rig:"helicopter mount"},{id:"bathroom-revelation",name:"Bathroom Revelation",whenToUse:["Private moments of madness","Intimate horror","Institutional vulnerability"],prompt:"bathroom interior, harsh fluorescent lighting, cold tile surfaces, isolated figure, private horror, institutional space, vulnerable, Kubrick style, psychological breakdown, clinical harsh light",lens:"wide-24",movement:"static",rig:"tripod"},{id:"war-room-control",name:"War Room / Control Center",whenToUse:["Power concentrated in space","Institutional decision-making","Satirical commentary"],prompt:"war room interior, circular geometric space, large central table, figures arranged around perimeter, dramatic overhead lighting, institutional power, Kubrick style, Dr. Strangelove aesthetic, cold sterile, military/governmental",lens:"wide-14",movement:"static or slow pan",rig:"tripod or dolly"}],rules:{neverDo:["handheld chaos","dutch angles","crash zooms","quick MTV-style cuts","warm emotional lighting","asymmetrical sloppy framing"],alwaysDo:["one-point perspective in corridors","center subjects in frame","wide angle for geography","hold shots past comfort","geometric precision","practical lighting sources"],signature:["Steadicam follow through corridors","Kubrick stare (eyes up through brow at camera)","one-point perspective symmetry","slow dolly in to face","low Steadicam at child height"]},sceneResponses:{horror_corridor:{shot:"wide one-point perspective",lens:"18mm wide",movement:"Steadicam glide",why:"Corridor becomes inescapable geometry"},character_madness:{shot:"slow dolly to close-up, then stare",lens:"25-35mm",movement:"slow dolly in",why:"Intimacy with the breakdown, then direct confrontation"},dialogue_tension:{shot:"static wide or medium",lens:"25mm minimum",movement:"static tripod",why:"Cold observation, let tension build without cutting"},child_pov:{shot:"low tracking",lens:"wide",movement:"Steadicam at 18 inches",why:"World as child sees it, vulnerable perspective"},violence:{shot:"wide or medium, often static",lens:"wide for context",movement:"static or slow motion",why:"Clinical detachment, forcing audience to watch"},establishing:{shot:"extreme wide one-point",lens:"18mm",movement:"static or slow Steadicam",why:"Show full geography, character dwarfed by space"}},colorPalette:{primary:"#1A1A1A",secondary:"#4A4A4A",accent:"#8B0000",shadows:"#0D0D0D",highlights:"#C8C8C8"},avoidPrompts:["handheld","shaky camera","quick cuts","dutch angle","tilted frame","warm emotional","soft romantic","asymmetrical chaos","crash zoom","MTV style"]},{id:"spielberg",name:"Spielberg",director:"Steven Spielberg",prompt:"warm lighting, lens flares, emotional close-ups, dynamic camera movement, blockbuster style, wonder and awe",description:"Warm, emotional, wonder",recommendedCamera:"arri-alexa",recommendedMovement:["steadicam","crane-up"],recommendedLighting:"natural",recommendedStyle:"blockbuster",recommendedAtmosphere:"clear",recommendedFraming:"rule-of-thirds",recommendedSetDesign:"retro-americana",recommendedColorPalette:"teal-orange",recommendedCharacterStyle:"classic-hollywood"},{id:"tarantino",name:"Tarantino",director:"Quentin Tarantino",prompt:"low angle shots, trunk shot, pop culture aesthetic, stylized violence, film grain, saturated colors",description:"Low angles, pop culture style",recommendedCamera:"kodak-5219",recommendedMovement:["dolly-in","pan-left"],recommendedLighting:"three-point",recommendedStyle:"vintage-70s",recommendedAtmosphere:"clear",recommendedFraming:"low-angle-hero",recommendedSetDesign:"retro-americana",recommendedColorPalette:"sepia-vintage",recommendedCharacterStyle:"retro-70s"},{id:"fincher",name:"Fincher",director:"David Fincher",prompt:"dark and moody, desaturated colors, low-key lighting, meticulous framing, clinical precision",description:"Dark, moody, precise",recommendedCamera:"red-v-raptor",recommendedLens:"standard-50",recommendedLighting:"silhouette",recommendedStyle:"gritty",recommendedAtmosphere:"fog",recommendedFraming:"rule-of-thirds",recommendedSetDesign:"gritty-decay",recommendedColorPalette:"desaturated-cold",recommendedCharacterStyle:"grunge-realistic"},{id:"nolan",name:"Nolan",director:"Christopher Nolan",prompt:"IMAX grandeur, practical effects look, blue and orange grade, epic scale, non-linear feeling",description:"IMAX epic, blue/orange",recommendedCamera:"imax-70mm",recommendedLens:"wide-24",recommendedMovement:["steadicam","crane-up"],recommendedLighting:"natural",recommendedStyle:"blockbuster",recommendedAtmosphere:"clear",recommendedFraming:"wide-negative-space",recommendedSetDesign:"sci-fi-industrial",recommendedColorPalette:"teal-orange",recommendedCharacterStyle:"sci-fi-functional"},{id:"villeneuve",name:"Villeneuve",director:"Denis Villeneuve",prompt:"vast landscapes, minimal dialogue aesthetic, Roger Deakins style, muted colors, atmospheric, contemplative",description:"Vast, atmospheric, Deakins",recommendedCamera:"arri-65",recommendedLens:"wide-35",recommendedMovement:["dolly-in","steadicam"],recommendedLighting:"silhouette",recommendedStyle:"desaturated",recommendedAtmosphere:"fog",recommendedFraming:"wide-negative-space",recommendedSetDesign:"vast-landscapes",recommendedColorPalette:"desaturated-cold",recommendedCharacterStyle:"minimalist-modern"},{id:"wes-anderson-dir",name:"Wes Anderson",director:"Wes Anderson",prompt:"perfectly symmetrical, pastel color palette, whimsical, centered subjects, tableau shots, dollhouse framing",description:"Symmetrical pastel whimsy",recommendedLens:"wide-24",recommendedMovement:["pan-left","pan-right"],recommendedLighting:"three-point",recommendedStyle:"wes-anderson",recommendedAtmosphere:"clear",recommendedFraming:"centered-symmetrical",recommendedSetDesign:"dollhouse-whimsy",recommendedColorPalette:"wes-anderson-pastel",recommendedCharacterStyle:"wes-anderson-quirky"},{id:"wong-kar-wai",name:"Wong Kar-wai",director:"Wong Kar-wai",prompt:"step-printed slow motion, smeared colors, neon-lit Hong Kong, romantic melancholy, Christopher Doyle style",description:"Neon romance, step-print",recommendedCamera:"kodak-5219",recommendedMovement:["handheld"],recommendedLighting:"neon",recommendedStyle:"neon-noir",recommendedAtmosphere:"rain",recommendedFraming:"frames-within-frames",recommendedSetDesign:"neon-urban",recommendedColorPalette:"neon-noir",recommendedCharacterStyle:"classic-hollywood"},{id:"tarkovsky",name:"Tarkovsky",director:"Andrei Tarkovsky",prompt:"long takes, contemplative pacing, water and nature elements, philosophical atmosphere, poetic cinema",description:"Poetic, contemplative, nature",recommendedMovement:["steadicam","static"],recommendedLighting:"natural",recommendedStyle:"desaturated",recommendedAtmosphere:"rain",recommendedFraming:"wide-negative-space",recommendedSetDesign:"nature-organic",recommendedColorPalette:"sepia-vintage",recommendedCharacterStyle:"natural-earthy"},{id:"depalma",name:"De Palma",director:"Brian De Palma",prompt:"split diopter, split screen feeling, Hitchcock homage, voyeuristic, thriller tension, operatic",description:"Split diopter, Hitchcock homage",recommendedMovement:["dolly-in","orbit-right"],recommendedLighting:"dramatic",recommendedStyle:"thriller",recommendedAtmosphere:"clear",recommendedFraming:"over-shoulder",recommendedSetDesign:"gothic-ornate",recommendedColorPalette:"technicolor-vivid",recommendedCharacterStyle:"classic-hollywood"},{id:"refn",name:"Refn",director:"Nicolas Winding Refn",prompt:"neon-drenched, extreme color gels, synth-wave aesthetic, Drive style, hyperreal, violent beauty",description:"Neon-drenched, Drive style",recommendedLens:"anamorphic",recommendedMovement:["dolly-in","steadicam"],recommendedLighting:"neon",recommendedStyle:"neon-noir",recommendedAtmosphere:"night",recommendedFraming:"profile-side",recommendedSetDesign:"neon-urban",recommendedColorPalette:"neon-noir",recommendedCharacterStyle:"cyberpunk-street"},{id:"malick",name:"Malick",director:"Terrence Malick",prompt:"magic hour golden light, whispered voiceover feeling, nature documentary style, ethereal, spiritual",description:"Golden hour, ethereal nature",recommendedMovement:["steadicam","handheld"],recommendedLighting:"golden-hour",recommendedStyle:"golden-hour",recommendedAtmosphere:"clear",recommendedFraming:"wide-negative-space",recommendedSetDesign:"nature-organic",recommendedColorPalette:"golden-hour-warm",recommendedCharacterStyle:"natural-earthy"}],Cu=[{id:"fear",name:"Fear",emotion:"Fear/Dread",prompt:"dutch angle, unstable framing, dark shadows, unsettling, horror atmosphere, something lurking",description:"Horror tension, unstable",recommendedLighting:"silhouette",recommendedMovement:["dolly-in","handheld"]},{id:"joy",name:"Joy",emotion:"Joy/Happiness",prompt:"bright warm lighting, golden tones, open framing, uplifting, celebration, warm colors",description:"Bright, warm, uplifting",recommendedStyle:"golden-hour",recommendedMovement:["crane-up","orbit-360"]},{id:"tension",name:"Tension",emotion:"Suspense/Tension",prompt:"tight framing, claustrophobic, shallow focus, ticking clock feeling, building dread",description:"Tight, claustrophobic",recommendedLighting:"harsh-sun",recommendedMovement:["dolly-in","zoom-in"]},{id:"romance",name:"Romance",emotion:"Love/Romance",prompt:"soft focus, warm glow, intimate framing, shallow depth of field, dreamy bokeh, tender",description:"Soft, intimate, dreamy",recommendedStyle:"dreamy",recommendedLighting:"candlelight",recommendedMovement:["orbit-right","dolly-in"]},{id:"power",name:"Power",emotion:"Power/Dominance",prompt:"low angle looking up, heroic framing, dramatic backlighting, imposing, authoritative",description:"Low angle, imposing",recommendedLighting:"silhouette",recommendedMovement:["tilt-up","dolly-in"]},{id:"vulnerability",name:"Vulnerability",emotion:"Weakness/Vulnerability",prompt:"high angle looking down, small in frame, isolated, overwhelming space, exposed",description:"High angle, isolated",recommendedMovement:["crane-up","dolly-out"]},{id:"mystery",name:"Mystery",emotion:"Mystery/Intrigue",prompt:"obscured view, partial reveals, shadows, noir lighting, hidden elements, enigmatic",description:"Obscured, shadowy reveals",recommendedStyle:"film-noir",recommendedLighting:"silhouette",recommendedMovement:["dolly-in","pan-right"]},{id:"chaos",name:"Chaos",emotion:"Chaos/Panic",prompt:"shaky handheld, quick cuts feeling, dutch angles, disorienting, frantic, unstable",description:"Shaky, disorienting",recommendedMovement:["handheld","crash-zoom"]},{id:"peace",name:"Peace",emotion:"Calm/Serenity",prompt:"static wide shots, balanced composition, natural lighting, slow movement, tranquil",description:"Still, balanced, calm",recommendedLighting:"natural",recommendedMovement:["static","micro-movement"]},{id:"nostalgia",name:"Nostalgia",emotion:"Nostalgia/Memory",prompt:"soft edges, warm color grade, film grain, hazy glow, dreamlike, faded memories",description:"Warm, grainy, dreamlike",recommendedStyle:"vintage-70s",recommendedCamera:"super-8"},{id:"isolation",name:"Isolation",emotion:"Loneliness/Isolation",prompt:"empty space, small subject in vast environment, cold tones, distant framing, alone",description:"Empty, distant, cold",recommendedLens:"wide-24",recommendedMovement:["dolly-out","crane-up"]},{id:"rage",name:"Rage",emotion:"Anger/Rage",prompt:"extreme close-ups, red color cast, intense, aggressive camera movement, visceral",description:"Intense close-ups, red",recommendedMovement:["crash-zoom","handheld"]}],Nu=[{id:"epic-establish",name:"Epic Establishing",storyBeat:"Opening/Location Reveal",prompt:"vast establishing shot, epic scale, location reveal, IMAX grandeur, sweeping vista",description:"Epic location reveal",camera:"imax-70mm",lens:"wide-24",movement:["crane-up","pan-right"],style:"blockbuster"},{id:"intimate-establish",name:"Intimate Intro",storyBeat:"Character Introduction",prompt:"intimate character introduction, environmental portrait, revealing details",description:"Character intro in environment",lens:"portrait-85",lighting:"natural",movement:["dolly-in"]},{id:"confrontation",name:"Confrontation",storyBeat:"Heated Argument",prompt:"two-shot tension, alternating close-ups, confrontational framing, dramatic",description:"Tense dialogue showdown",lens:"standard-50",lighting:"harsh-sun",movement:["dolly-in","orbit-left"]},{id:"confession",name:"Confession",storyBeat:"Emotional Reveal",prompt:"intimate single shot, slow push in, emotional vulnerability, tears close-up",description:"Emotional confession moment",lens:"portrait-85",lighting:"natural",movement:["dolly-in"],style:"dreamy"},{id:"chase",name:"Chase Scene",storyBeat:"Pursuit/Chase",prompt:"dynamic chase, following action, fast movement, adrenaline, tracking pursuit",description:"High-energy pursuit",movement:["steadicam","fpv-drone"],style:"blockbuster"},{id:"fight",name:"Fight Scene",storyBeat:"Combat/Fight",prompt:"kinetic fight choreography, impact shots, visceral action, dynamic angles",description:"Visceral combat action",movement:["handheld","crash-zoom"],lens:"wide-35"},{id:"death-scene",name:"Death Scene",storyBeat:"Character Death",prompt:"slow motion, intimate close-ups, fading light, emotional devastation, final moment",description:"Tragic farewell moment",lighting:"candlelight",movement:["dolly-in","crane-up"],style:"dreamy"},{id:"reunion",name:"Reunion",storyBeat:"Emotional Reunion",prompt:"building anticipation, recognition moment, embrace, joyful tears, warm lighting",description:"Heartwarming reunion",lighting:"natural",style:"golden-hour",movement:["dolly-in","orbit-right"]},{id:"victory",name:"Victory Moment",storyBeat:"Triumph/Win",prompt:"heroic framing, low angle, rising crane, triumphant, golden hour, epic music moment",description:"Triumphant hero shot",camera:"imax-70mm",movement:["crane-up","orbit-360"],style:"blockbuster",lighting:"natural"},{id:"jumpscare",name:"Jump Scare",storyBeat:"Horror Reveal",prompt:"slow approach, building tension, sudden reveal, sharp movement, shock",description:"Building to shock reveal",lighting:"silhouette",movement:["dolly-in","crash-zoom"],style:"horror"},{id:"stalker",name:"Stalker POV",storyBeat:"Being Watched",prompt:"voyeuristic framing, hidden observer, through obstacles, predatory, unseen threat",description:"Predatory watching",movement:["dolly-in","handheld"],lens:"tele-200",style:"horror"},{id:"time-passage",name:"Time Passage",storyBeat:"Montage/Time Skip",prompt:"timelapse elements, dissolve feeling, seasons changing, time flowing",description:"Time passing montage",movement:["static","orbit-360"],atmosphere:"clear"},{id:"dream-sequence",name:"Dream Sequence",storyBeat:"Dream/Vision",prompt:"surreal imagery, soft focus, floating camera, otherworldly, ethereal glow",description:"Dreamlike surreal",style:"dreamy",movement:["steadicam","orbit-right"],atmosphere:"mist"},{id:"noir-detective",name:"Noir Detective",storyBeat:"Investigation",prompt:"hard shadows, rain-wet streets, fedora silhouette, venetian blinds, cigarette smoke",description:"Classic noir investigation",style:"film-noir",lighting:"silhouette",atmosphere:"rain",movement:["dolly-in","pan-left"]},{id:"sci-fi-discovery",name:"Sci-Fi Discovery",storyBeat:"Alien/Tech Discovery",prompt:"awe and wonder, slow reveal, technology glow, scale revelation, 2001 monolith moment",description:"Awe-inspiring discovery",camera:"imax-70mm",lens:"wide-24",movement:["crane-up","dolly-in"],style:"cyberpunk"}],Ru=[{id:"centered-symmetrical",name:"Centered Symmetrical",prompt:"perfectly centered subject, symmetrical composition, one-point perspective, tableau framing",description:"Subject dead center, perfect symmetry",example:"Wes Anderson, Kubrick"},{id:"rule-of-thirds",name:"Rule of Thirds",prompt:"rule of thirds composition, off-center subject, balanced asymmetry, classic framing",description:"Classic balanced composition",example:"Spielberg"},{id:"dutch-angle",name:"Dutch Angle",prompt:"dutch angle, tilted frame, canted camera, disorienting composition, unsettling",description:"Tilted unsettling frame",example:"Terry Gilliam, Horror"},{id:"extreme-closeup",name:"Extreme Close-up",prompt:"extreme close-up, eyes only, macro detail, intimate framing, face filling frame",description:"Face/detail fills frame",example:"Sergio Leone"},{id:"wide-negative-space",name:"Wide Negative Space",prompt:"vast negative space, tiny subject in frame, environmental scale, lonely composition",description:"Subject dwarfed by environment",example:"Villeneuve, Tarkovsky"},{id:"profile-side",name:"Profile/Side Shot",prompt:"perfect profile shot, side view, lateral framing, flat staging, theatrical",description:"Pure side profile view",example:"Wes Anderson"},{id:"over-shoulder",name:"Over the Shoulder",prompt:"over-the-shoulder framing, conversation shot, foreground silhouette, depth staging",description:"Classic dialogue framing",example:"Classic Hollywood"},{id:"low-angle-hero",name:"Low Angle Hero",prompt:"low angle shot, looking up at subject, heroic framing, powerful stance, ground level",description:"Looking up, powerful",example:"Tarantino trunk shot"},{id:"high-angle-vulnerable",name:"High Angle Vulnerable",prompt:"high angle shot, looking down on subject, vulnerable framing, small in frame",description:"Looking down, vulnerable",example:"Hitchcock"},{id:"frames-within-frames",name:"Frames Within Frames",prompt:"doorway framing, window frame, natural frame within frame, nested composition",description:"Subject framed by environment",example:"John Ford"}],Pu=[{id:"sterile-geometric",name:"Sterile Geometric",prompt:"sterile white corridors, geometric architecture, clinical spaces, brutalist design, cold institutional",description:"Cold, clinical, geometric",director:"Kubrick"},{id:"dollhouse-whimsy",name:"Dollhouse Whimsy",prompt:"miniature dollhouse aesthetic, perfectly organized spaces, pastel interiors, vintage props, handcrafted details",description:"Whimsical miniature world",director:"Wes Anderson"},{id:"neon-urban",name:"Neon Urban",prompt:"neon-lit streets, rain-wet asphalt, Asian signage, cyberpunk urban, electric colors at night",description:"Neon-drenched city nights",director:"Refn, Wong Kar-wai"},{id:"gritty-decay",name:"Gritty Urban Decay",prompt:"urban decay, grimy textures, industrial spaces, rust and dirt, lived-in squalor",description:"Dark, dirty, decaying",director:"Fincher"},{id:"vast-landscapes",name:"Vast Landscapes",prompt:"vast desert landscapes, monumental scale, natural formations, epic vistas, dwarfing human scale",description:"Epic natural environments",director:"Villeneuve, Malick"},{id:"retro-americana",name:"Retro Americana",prompt:"1950s-70s Americana, diners and motels, vintage cars, nostalgic America, Kodachrome look",description:"Nostalgic American past",director:"Tarantino, Coen Brothers"},{id:"gothic-ornate",name:"Gothic Ornate",prompt:"gothic architecture, ornate Victorian interiors, candlelit chambers, dark wood and velvet",description:"Dark, ornate, Victorian",director:"Guillermo del Toro"},{id:"minimalist-modern",name:"Minimalist Modern",prompt:"minimalist interior design, clean lines, sparse furnishing, modern architecture, negative space",description:"Clean, minimal, modern",director:"Fincher, Villeneuve"},{id:"nature-organic",name:"Nature Organic",prompt:"organic natural settings, forests and fields, golden wheat, flowing water, earth and sky",description:"Natural, organic, earthy",director:"Malick, Tarkovsky"},{id:"sci-fi-industrial",name:"Sci-Fi Industrial",prompt:"industrial sci-fi corridors, exposed pipes and machinery, functional spacecraft design, Alien aesthetic",description:"Functional future industrial",director:"Ridley Scott"}],Lu=[{id:"wes-anderson-pastel",name:"Wes Anderson Pastels",prompt:"pastel color palette, soft pink and mint, powder blue and cream, candy colors, muted pastels",description:"Soft pastels, pinks, yellows",colors:["#F4A4A4","#A4D4AE","#F4E4BC","#A4C4D4","#E4D4F4"],director:"Wes Anderson"},{id:"teal-orange",name:"Teal & Orange",prompt:"teal and orange color grade, complementary colors, blockbuster look, warm skin tones cool shadows",description:"Hollywood blockbuster grade",colors:["#008080","#FF8C00","#004040","#FFA500","#006666"],director:"Michael Bay, Transformers"},{id:"desaturated-cold",name:"Desaturated Cold",prompt:"desaturated color palette, muted tones, cold blue-grey, drained of warmth, clinical",description:"Cold, muted, lifeless",colors:["#4A5568","#2D3748","#718096","#A0AEC0","#1A202C"],director:"Fincher"},{id:"neon-noir",name:"Neon Noir",prompt:"neon color palette, hot pink and electric blue, magenta and cyan, glowing colors in darkness",description:"Electric neons in dark",colors:["#FF00FF","#00FFFF","#FF1493","#00CED1","#8B00FF"],director:"Refn, Gaspar Noé"},{id:"golden-hour-warm",name:"Golden Hour Warm",prompt:"golden hour palette, warm amber tones, magic hour light, honey and gold, nostalgic warmth",description:"Warm golden tones",colors:["#FFD700","#FFA500","#FF8C00","#DAA520","#F4A460"],director:"Malick"},{id:"noir-monochrome",name:"Noir Monochrome",prompt:"high contrast black and white, film noir shadows, silver and black, monochromatic",description:"Black & white noir",colors:["#000000","#1A1A1A","#4A4A4A","#8A8A8A","#FFFFFF"],director:"Classic Noir"},{id:"sepia-vintage",name:"Sepia Vintage",prompt:"sepia tones, vintage photograph look, faded browns and creams, aged film stock",description:"Old photograph feel",colors:["#704214","#8B7355","#C4A777","#E8D4A8","#F5DEB3"],director:"1970s films"},{id:"matrix-green",name:"Matrix Green",prompt:"green color cast, digital matrix look, green-tinted blacks, cyberpunk green",description:"Digital green tint",colors:["#00FF00","#003300","#00CC00","#006600","#00FF66"],director:"The Matrix"},{id:"bleach-bypass",name:"Bleach Bypass",prompt:"bleach bypass look, high contrast, desaturated but harsh, metallic sheen, Saving Private Ryan",description:"High contrast, low saturation",colors:["#2F4F4F","#696969","#808080","#A9A9A9","#C0C0C0"],director:"Spielberg (war films)"},{id:"technicolor-vivid",name:"Technicolor Vivid",prompt:"technicolor saturation, vivid primary colors, rich reds and blues, classic Hollywood glamour",description:"Saturated classic Hollywood",colors:["#FF0000","#0000FF","#FFD700","#00FF00","#FF00FF"],director:"Classic Hollywood musicals"}],Du=[{id:"wes-anderson-quirky",name:"Quirky Vintage",prompt:"quirky vintage costumes, matching outfits, retro uniforms, coordinated colors, deadpan expressions",description:"Matching, vintage, quirky",director:"Wes Anderson"},{id:"noir-hardboiled",name:"Noir Hardboiled",prompt:"fedora and trench coat, cigarette smoking, shadowed faces, 1940s suits, femme fatale glamour",description:"Classic noir archetypes",director:"Film Noir"},{id:"grunge-realistic",name:"Grunge Realistic",prompt:"realistic worn clothing, sweat and dirt, lived-in costumes, unglamorous, authentic",description:"Dirty, realistic, worn",director:"Fincher"},{id:"sci-fi-functional",name:"Sci-Fi Functional",prompt:"functional space suits, utilitarian future clothing, practical sci-fi costumes, NASA-inspired",description:"Practical future wear",director:"Nolan, Ridley Scott"},{id:"retro-70s",name:"Retro 70s",prompt:"1970s fashion, bell bottoms, big collars, mustaches and sideburns, brown and orange palette",description:"70s period costumes",director:"Tarantino, Coen Bros"},{id:"gothic-romantic",name:"Gothic Romantic",prompt:"gothic romantic costumes, flowing dark fabrics, Victorian silhouettes, pale makeup, dramatic",description:"Dark romantic Victorian",director:"Tim Burton"},{id:"minimalist-modern",name:"Minimalist Modern",prompt:"minimalist contemporary clothing, clean lines, monochromatic outfits, simple elegant",description:"Clean modern minimal",director:"Denis Villeneuve"},{id:"cyberpunk-street",name:"Cyberpunk Street",prompt:"cyberpunk street fashion, neon accents, tech wear, Asian influences, rain jacket and goggles",description:"Future street style",director:"Blade Runner"},{id:"classic-hollywood",name:"Classic Hollywood Glamour",prompt:"classic Hollywood glamour, elegant gowns, tuxedos, perfectly styled hair, golden age beauty",description:"Old Hollywood elegance",director:"Golden Age"},{id:"natural-earthy",name:"Natural Earthy",prompt:"natural fabrics, earthy tones, flowing linen, minimal makeup, organic and honest",description:"Simple, natural, organic",director:"Malick"}];function Iu(i){const e=[];if(i.style&&e.push(i.style.prompt.split(",")[0]),i.camera&&e.push(i.camera.prompt.split(",")[0]),i.lens&&e.push(i.lens.prompt.split(",").slice(0,2).join(",")),i.focus&&e.push(i.focus.prompt.split(",")[0]),i.lighting&&e.push(i.lighting.prompt.split(",")[0]),i.atmosphere&&e.push(i.atmosphere.prompt.split(",")[0]),i.movement&&i.movement.length>0){const t=i.movement.map(n=>n.prompt.split(",")[0]).join(", ");e.push(t)}return i.motionSpeed&&e.push(i.motionSpeed.prompt.split(",")[0]),i.frameRate&&e.push(i.frameRate.prompt.split(",")[0]),i.customPrompt&&e.push(i.customPrompt),e.push("cinematic"),e.join(", ")}const Uu={chase:["chase","chasing","running","fleeing","escape","pursued","hunting"],danger:["dragon","monster","enemy","threat","attack","fire","explosion","danger"],calm:["peaceful","calm","relaxing","serene","quiet","resting","sleeping"],discovery:["finding","discover","looking","searching","exploring","cave","door"],confrontation:["facing","battle","fight","standoff","versus","against"],emotion:["sad","happy","crying","laughing","scared","terrified","angry","love"],journey:["walking","traveling","path","road","forest","mountain","desert"],victory:["winning","victory","defeating","celebrating","triumph"],defeat:["falling","losing","injured","trapped","captured"]},Sc={chase:["finds temporary shelter and catches breath","reaches a dead end and must turn to face the threat","discovers a hidden escape route","trips and falls, threat closing in","is saved by an unexpected ally"],danger:["narrowly dodges the attack","finds cover behind debris","faces the threat with newfound courage","witnesses the destruction from a distance","prepares for the final confrontation"],calm:["notices something unusual in the distance","is interrupted by unexpected visitor","makes an important decision","reflects on the journey so far","prepares to leave this peaceful place"],discovery:["enters the mysterious space cautiously","finds exactly what they were looking for","triggers an unexpected trap","uncovers a shocking revelation","realizes they are not alone"],confrontation:["makes the first move","circles the opponent, looking for weakness","exchanges fierce blows","gains the upper hand momentarily","is pushed back but refuses to give up"],emotion:["takes a moment to process the feelings","shares the moment with a companion","channels the emotion into action","finds comfort in the environment","makes a decision based on this feeling"],journey:["pauses to take in the breathtaking view","encounters an obstacle in the path","meets a fellow traveler","finds signs of civilization ahead","notices the weather changing dramatically"],victory:["stands triumphant over the defeated foe","celebrates with allies","reflects on what it cost to win","claims the prize or reward","looks toward the next challenge"],defeat:["struggles to get back up","is rescued at the last moment","finds inner strength to continue","accepts help from an unlikely source","plots a new strategy from the ground"]};function Fu(i,e,t){const n=e.toLowerCase();let r="journey";for(const[h,u]of Object.entries(Uu))if(u.some(f=>n.includes(f))){r=h;break}const a=Sc[r]||Sc.journey,o=(t-1)%a.length,l=a[o],d=[];if(d.push("THIS EXACT SETUP"),d.push(`character ${l}`),i?.sceneResponses){const u={danger:"horror_corridor",chase:"horror_corridor",emotion:"character_madness",confrontation:"dialogue_tension",calm:"establishing",journey:"establishing",discovery:"establishing",defeat:"character_madness",victory:"establishing"}[r],f=i.sceneResponses[u];f?.movement&&f.movement!=="static"&&d.push(f.movement)}return d.push("8K high detail"),d.join(", ")}const ku=["cinematic lighting","dramatic lighting","moody atmosphere","muted colors","professional lighting","studio lighting"];function Ou(i){const e=[];return ku.forEach(t=>{i.toLowerCase().includes(t.toLowerCase())&&e.push(`Avoid "${t}" - use specific light SOURCE instead (e.g., "spotlight from above")`)}),i.match(/^(4K|8K|cinematic|shot on|ARRI|RED)/i)&&e.push("Technical specs should be at END, not beginning. Put subject/action first."),{valid:e.length===0,warnings:e}}const wc={tracking_ground:"Wide shot tracking at ground level following movement",tracking_side:"Smooth tracking shot following from the side",tracking_behind:"Tracking shot from behind, following subject",dolly_forward:"Slow dolly shot forward",dolly_around:"Slow dolly shot around the subject",dolly_in:"Dolly in toward subject",dolly_out:"Dolly out revealing environment",push_in:"Slow push-in creating intimacy",push_in_10s:"Static medium close-up with slow push-in over 10 seconds",pull_back:"Pull back revealing the full scene, then settles",orbit_slow:"Camera orbits slowly around subject",orbit_180:"Slow 180-degree orbit",orbit_eye_level:"Camera circles subject, maintaining eye level",orbit_stop:"Rotating around at steady pace, then stops",pan_left:"Slow pan left revealing landscape",pan_right:"Pan right following action",tilt_up:"Tilt up from feet to face",tilt_down:"Tilt down from sky to subject",aerial_track:"Wide-angle aerial shot tracking from above",drone_rise:"Drone shot rising to reveal vista",aerial_push:"Aerial push-in toward subject",birds_eye_descend:"Bird's eye view slowly descending",fpv_dive:"FPV drone shot, high-speed dive, vertical drop, motion blur",static:"Static shot, slight movement",static_locked:"Locked-off camera, subject moves within frame",static_elevated:"Static wide shot from elevated position",handheld_slight:"Slight handheld movement, documentary feel",handheld_subtle:"Subtle camera shake, intimate feel",handheld_urgent:"Handheld following action, urgent energy",drift_around:"Camera drifting around subject",drift_floating:"Gentle floating camera movement",dolly_zoom:"Cinematic dolly zoom, zali effect",rack_focus:"Rack focus, focus shift",steadicam:"Steadicam following shot",whip_pan:"Whip pan, fast direction change",crash_zoom:"Crash zoom, rapid push-in",crane_up:"Crane up, rotate counterclockwise"},Mc={walk_purpose:"walks purposefully, then stops",walk_casual:"strolls casually, then pauses",walk_toward:"walks toward camera, then stops and looks up",run_sprint:"sprints forward, then slows to stop",turn_camera:"turns head to camera, then holds gaze",turn_around:"spins around, then faces forward",look_over:"looks over shoulder, then turns back",wave:"waves hand, then lowers arm",point:"points at camera, then arm drops",reach:"reaches out with hand, then pulls back",blink:"blinks naturally, forms slight smile",smile:"forms slight smile, holds expression",eyes_widen:"eyes widen in surprise, then settle",hair_wind:"hair gently moves in breeze, then settles back into place",hair_settle:"hair moves with movement, then rests",clothing_flow:"dress flows with movement, then settles",cape_billow:"cape billows behind, then drapes down",tears:"tears well up, single tear falls",laugh:"laughs briefly, then quiets",gasp:"gasps in shock, hand to chest"},Ec={wind_leaves:"leaves sway gently, then still",wind_grass:"grass ripples in breeze, then settles",wind_curtains:"curtains flutter, then rest",waves_lap:"waves lap at shore, then recede",ripples:"ripples spread across surface, then gentle waves settle",waterfall:"water falls continuously",flames:"flames flicker and dance",embers:"embers drift upward, then dissipate",smoke:"smoke rises and disperses slowly",car_pass:"car drives past in background",leaves_fall:"leaves fall slowly to ground",rain:"rain drops streak down",dust:"dust particles drift in light beam"},ju=["WALKING","RUNNING","FLICKERING","POURING","CHARGING","BILLOWING","DRIFTING","SWAYING","SPINNING","COLLAPSING","ERUPTING","CRASHING"],Bu=["moving","going","visible","slowly","gently","being","having","appearing"];function zu(i){return["settles","stops","holds","rests","pauses","freezes","lands","dissipates","quiets","slows"].some(t=>i.toLowerCase().includes(t))}const vn={simple:{dolly_around:"slow dolly shot around the subject",push_in:"Slow push-in on face, subtle movement, then holds",orbit:"camera orbits slowly around subject, then settles",static:"static shot, subtle breathing motion"},full:{emotional:"Camera slowly orbits left, subject blinks naturally, forms slight smile, hair moves gently as if in soft breeze, background remains mostly static, movement settles",action:"Subject lunges forward, cape billows behind, camera follows the motion, dust kicks up from ground, action completes with landing pose",dramatic:"Slow dolly in toward face, eyes narrow with intensity, slight trembling, then stillness"},seedance:{ugc_basic:'Medium close-up, eye level, soft bokeh background. Subject speaks directly to camera with natural expressions. Slow push-in, focus on eyes. She speaks confidently: "[DIALOGUE]". Cinematic UGC style, clean audio.',ugc_energetic:'Close-up, slightly low angle for confidence. Animated expressions, casual outfit. Handheld slight movement, dynamic energy. He speaks excitedly: "[DIALOGUE]". High energy, bright natural light.',product_demo:'Medium shot, presenter slightly off-center, product prominent. Professional appearance, warm genuine smile. Camera slowly pushes in. She explains: "[DIALOGUE]". Clean commercial lighting.',emotional:'Close-up on face, soft focus on eyes. Subtle micro-expressions, emotional depth. Static camera with slight handheld warmth. She whispers: "[DIALOGUE]". Quiet, contemplative atmosphere.',interview:'Medium close-up, subject slightly off-center, soft bokeh. Professional, natural pauses, thoughtful expression. Slow subtle push-in during emotional moments. She reflects: "[DIALOGUE]". Documentary lighting.',dialogue_two:'Medium shot, two people facing each other. Character on left speaks first: "[DIALOGUE1]". Camera slowly dollies right to capture reaction. Second character responds: "[DIALOGUE2]". Natural room ambience.',social_hook:'Extreme close-up, direct eye contact. Confident expression, one eyebrow raised. Slight lean toward camera. He asks: "[DIALOGUE]". Punchy rhythm, immediate engagement.',mandarin:'Medium close-up, professional setting. Subject speaks in fluent Mandarin with professional tone: "[DIALOGUE]". Clean audio, subtle office ambience.',spanish:'Close-up, vibrant colorful background. Animated expressions, expressive gestures. She speaks enthusiastically in Spanish: "[DIALOGUE]". Warm lighting.',japanese:'Medium shot, minimal modern setting. Calm demeanor, measured pacing. He speaks in polite Japanese: "[DIALOGUE]". Serene atmosphere.'}};function Gu(i){const e=[],n=["dolly","orbit","pan","tilt","zoom","track","crane","push","pull"].filter(a=>i.toLowerCase().includes(a));return n.length>1&&e.push(`Multiple camera movements detected (${n.join(", ")}). Use ONE at a time to avoid warped geometry.`),Bu.forEach(a=>{new RegExp(`\\b${a}\\b`,"i").test(i)&&e.push(`Weak verb "${a}" detected. Use power verbs like: ${ju.slice(0,3).join(", ")}`)}),zu(i)||e.push('No motion endpoint detected. Add "then settles" or similar to prevent 99% hang.'),["in a","wearing","with dramatic","background is","setting is"].forEach(a=>{i.toLowerCase().includes(a)&&e.push(`Scene description "${a}" detected. Video prompts should be MOTION ONLY - image has all visual info.`)}),(i.toLowerCase().includes("bullet time")||i.toLowerCase().includes("matrix effect"))&&e.push("Bullet time / Matrix effect rarely works. Consider simple slow motion instead."),(i.toLowerCase().includes("fpv")||i.toLowerCase().includes("first person"))&&e.push("FPV / First person view is inconsistent. Consider tracking shot instead."),{valid:e.length===0,warnings:e}}const Vu={hair:{gentle:"hair moves gently in breeze, strands catching light, then settles",flow:"hair flows with wind, then rests",blow:"hair blows across face, then clears",lift:"strands lift and settle"},clothing:{dress:"dress flows in wind, fabric rippling, movement subtle",cape:"cape billows dramatically behind, wind gusting, then falls",flutter:"clothing flutters gently, then stills",whip:"coat whips in strong wind, then calms"},vegetation:{leaves:"leaves sway in gentle breeze, dappled light, peaceful motion",grass:"grass ripples like waves, then settles",branches:"branches bend with wind, then straighten",flowers:"flowers bob gently, then still",trees:"trees sway slowly, then calm"},water:{ripples:"water ripples spread across surface, then gentle waves settle",waves:"waves lap gently at shore, rhythmic motion, foam dissolves",rain:"rain drops streak down window, collecting at bottom",waterfall:"waterfall cascades down rocks, mist rises, water pools below",drip:"water drips from faucet, drops fall, ripples in sink"},fire:{flicker:"flames flicker gently, casting dancing shadows, warmth visible",candle:"candle flame wavers in draft, steadies, soft glow",sparks:"sparks rise from fire, drift upward, fade into darkness",embers:"embers glow orange, pulse with heat, slowly dim",bonfire:"bonfire blazes, flames dance, then settle"},smoke:{rise:"smoke rises slowly, curls and disperses, fades to nothing",mist:"mist swirls around subject feet, dreamlike, settles",steam:"steam rises from hot coffee, wisps curl, dissipate",fog:"fog rolls in from background, obscures scene partially",exhaust:"exhaust billows, drifts away, clears"},dust:{motes:"dust motes float in sunbeam, drifting slowly, magical feel",kicked:"dust kicked up by footsteps, swirls, settles back down",particles:"particles drift through air, catching light, ethereal",debris:"debris scatters from impact, pieces fall, settle on ground",sand:"sand blows across ground, then settles"}},Hu={rain:{start:"rain begins falling, intensifies, streaks across window",stop:"rain slows, drops cease, surface glistens"},snow:{fall:"snow falls gently, flakes drifting, covering ground slowly",accumulate:"snow accumulates, scene whitens"},wind:{pickup:"wind picks up, trees bend, debris swirls, calms",gust:"gust blows through, then passes"},light:{shift:"sunlight shifts across room as clouds pass, returns to bright",dim:"light dims as sun sets, warm to cool tones",shadow:"shadow of tree branch moves slowly across wall"}},Wu=["then settles","comes to rest","stops moving","lands on ground","fades away","dissipates","stabilizes","returns to position","then stills","holds position","movement completes"];/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const wl="182",Xu=0,Tc=1,$u=2,fa=1,qu=2,is=3,Fi=0,sn=1,Nn=2,hi=0,wr=1,Ac=2,Cc=3,Nc=4,Yu=5,$i=100,Ku=101,Ju=102,Zu=103,Qu=104,ef=200,tf=201,nf=202,rf=203,No=204,Ro=205,sf=206,af=207,of=208,lf=209,cf=210,df=211,hf=212,uf=213,ff=214,Po=0,Lo=1,Do=2,Er=3,Io=4,Uo=5,Fo=6,ko=7,Ud=0,pf=1,mf=2,qn=0,Fd=1,kd=2,Od=3,jd=4,Bd=5,zd=6,Gd=7,Vd=300,Ji=301,Tr=302,Oo=303,jo=304,wa=306,Bo=1e3,di=1001,zo=1002,Ht=1003,gf=1004,zs=1005,Jt=1006,Wa=1007,Yi=1008,un=1009,Hd=1010,Wd=1011,us=1012,Ml=1013,Kn=1014,Xn=1015,fi=1016,El=1017,Tl=1018,fs=1020,Xd=35902,$d=35899,qd=1021,Yd=1022,Pn=1023,pi=1026,Ki=1027,Kd=1028,Al=1029,Ar=1030,Cl=1031,Nl=1033,pa=33776,ma=33777,ga=33778,xa=33779,Go=35840,Vo=35841,Ho=35842,Wo=35843,Xo=36196,$o=37492,qo=37496,Yo=37488,Ko=37489,Jo=37490,Zo=37491,Qo=37808,el=37809,tl=37810,nl=37811,il=37812,rl=37813,sl=37814,al=37815,ol=37816,ll=37817,cl=37818,dl=37819,hl=37820,ul=37821,fl=36492,pl=36494,ml=36495,gl=36283,xl=36284,vl=36285,_l=36286,xf=3200,Jd=0,vf=1,Ii="",yn="srgb",Cr="srgb-linear",_a="linear",bt="srgb",ar=7680,Rc=519,_f=512,yf=513,bf=514,Rl=515,Sf=516,wf=517,Pl=518,Mf=519,Pc=35044,Lc="300 es",$n=2e3,ya=2001;function Zd(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function ps(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ef(){const i=ps("canvas");return i.style.display="block",i}const Dc={};function Ic(...i){const e="THREE."+i.shift();console.log(e,...i)}function qe(...i){const e="THREE."+i.shift();console.warn(e,...i)}function ft(...i){const e="THREE."+i.shift();console.error(e,...i)}function ms(...i){const e=i.join(" ");e in Dc||(Dc[e]=!0,qe(...i))}function Tf(i,e,t){return new Promise(function(n,r){function a(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:n()}}setTimeout(a,t)})}class Pr{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const r=n[e];if(r!==void 0){const a=r.indexOf(t);a!==-1&&r.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let a=0,o=r.length;a<o;a++)r[a].call(this,e);e.target=null}}}const Yt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Uc=1234567;const ss=Math.PI/180,gs=180/Math.PI;function Lr(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Yt[i&255]+Yt[i>>8&255]+Yt[i>>16&255]+Yt[i>>24&255]+"-"+Yt[e&255]+Yt[e>>8&255]+"-"+Yt[e>>16&15|64]+Yt[e>>24&255]+"-"+Yt[t&63|128]+Yt[t>>8&255]+"-"+Yt[t>>16&255]+Yt[t>>24&255]+Yt[n&255]+Yt[n>>8&255]+Yt[n>>16&255]+Yt[n>>24&255]).toLowerCase()}function at(i,e,t){return Math.max(e,Math.min(t,i))}function Ll(i,e){return(i%e+e)%e}function Af(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)}function Cf(i,e,t){return i!==e?(t-i)/(e-i):0}function as(i,e,t){return(1-t)*i+t*e}function Nf(i,e,t,n){return as(i,e,1-Math.exp(-t*n))}function Rf(i,e=1){return e-Math.abs(Ll(i,e*2)-e)}function Pf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Lf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Df(i,e){return i+Math.floor(Math.random()*(e-i+1))}function If(i,e){return i+Math.random()*(e-i)}function Uf(i){return i*(.5-Math.random())}function Ff(i){i!==void 0&&(Uc=i);let e=Uc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function kf(i){return i*ss}function Of(i){return i*gs}function jf(i){return(i&i-1)===0&&i!==0}function Bf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function zf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Gf(i,e,t,n,r){const a=Math.cos,o=Math.sin,l=a(t/2),d=o(t/2),h=a((e+n)/2),u=o((e+n)/2),f=a((e-n)/2),m=o((e-n)/2),g=a((n-e)/2),y=o((n-e)/2);switch(r){case"XYX":i.set(l*u,d*f,d*m,l*h);break;case"YZY":i.set(d*m,l*u,d*f,l*h);break;case"ZXZ":i.set(d*f,d*m,l*u,l*h);break;case"XZX":i.set(l*u,d*y,d*g,l*h);break;case"YXY":i.set(d*g,l*u,d*y,l*h);break;case"ZYZ":i.set(d*y,d*g,l*u,l*h);break;default:qe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function br(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function en(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Yr={DEG2RAD:ss,RAD2DEG:gs,generateUUID:Lr,clamp:at,euclideanModulo:Ll,mapLinear:Af,inverseLerp:Cf,lerp:as,damp:Nf,pingpong:Rf,smoothstep:Pf,smootherstep:Lf,randInt:Df,randFloat:If,randFloatSpread:Uf,seededRandom:Ff,degToRad:kf,radToDeg:Of,isPowerOfTwo:jf,ceilPowerOfTwo:Bf,floorPowerOfTwo:zf,setQuaternionFromProperEuler:Gf,normalize:en,denormalize:br};class He{constructor(e=0,t=0){He.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=at(this.x,e.x,t.x),this.y=at(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=at(this.x,e,t),this.y=at(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(at(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(at(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),r=Math.sin(t),a=this.x-e.x,o=this.y-e.y;return this.x=a*n-o*r+e.x,this.y=a*r+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class vs{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,a,o,l){let d=n[r+0],h=n[r+1],u=n[r+2],f=n[r+3],m=a[o+0],g=a[o+1],y=a[o+2],_=a[o+3];if(l<=0){e[t+0]=d,e[t+1]=h,e[t+2]=u,e[t+3]=f;return}if(l>=1){e[t+0]=m,e[t+1]=g,e[t+2]=y,e[t+3]=_;return}if(f!==_||d!==m||h!==g||u!==y){let x=d*m+h*g+u*y+f*_;x<0&&(m=-m,g=-g,y=-y,_=-_,x=-x);let p=1-l;if(x<.9995){const E=Math.acos(x),T=Math.sin(E);p=Math.sin(p*E)/T,l=Math.sin(l*E)/T,d=d*p+m*l,h=h*p+g*l,u=u*p+y*l,f=f*p+_*l}else{d=d*p+m*l,h=h*p+g*l,u=u*p+y*l,f=f*p+_*l;const E=1/Math.sqrt(d*d+h*h+u*u+f*f);d*=E,h*=E,u*=E,f*=E}}e[t]=d,e[t+1]=h,e[t+2]=u,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,r,a,o){const l=n[r],d=n[r+1],h=n[r+2],u=n[r+3],f=a[o],m=a[o+1],g=a[o+2],y=a[o+3];return e[t]=l*y+u*f+d*g-h*m,e[t+1]=d*y+u*m+h*f-l*g,e[t+2]=h*y+u*g+l*m-d*f,e[t+3]=u*y-l*f-d*m-h*g,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,r=e._y,a=e._z,o=e._order,l=Math.cos,d=Math.sin,h=l(n/2),u=l(r/2),f=l(a/2),m=d(n/2),g=d(r/2),y=d(a/2);switch(o){case"XYZ":this._x=m*u*f+h*g*y,this._y=h*g*f-m*u*y,this._z=h*u*y+m*g*f,this._w=h*u*f-m*g*y;break;case"YXZ":this._x=m*u*f+h*g*y,this._y=h*g*f-m*u*y,this._z=h*u*y-m*g*f,this._w=h*u*f+m*g*y;break;case"ZXY":this._x=m*u*f-h*g*y,this._y=h*g*f+m*u*y,this._z=h*u*y+m*g*f,this._w=h*u*f-m*g*y;break;case"ZYX":this._x=m*u*f-h*g*y,this._y=h*g*f+m*u*y,this._z=h*u*y-m*g*f,this._w=h*u*f+m*g*y;break;case"YZX":this._x=m*u*f+h*g*y,this._y=h*g*f+m*u*y,this._z=h*u*y-m*g*f,this._w=h*u*f-m*g*y;break;case"XZY":this._x=m*u*f-h*g*y,this._y=h*g*f-m*u*y,this._z=h*u*y+m*g*f,this._w=h*u*f+m*g*y;break;default:qe("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],r=t[4],a=t[8],o=t[1],l=t[5],d=t[9],h=t[2],u=t[6],f=t[10],m=n+l+f;if(m>0){const g=.5/Math.sqrt(m+1);this._w=.25/g,this._x=(u-d)*g,this._y=(a-h)*g,this._z=(o-r)*g}else if(n>l&&n>f){const g=2*Math.sqrt(1+n-l-f);this._w=(u-d)/g,this._x=.25*g,this._y=(r+o)/g,this._z=(a+h)/g}else if(l>f){const g=2*Math.sqrt(1+l-n-f);this._w=(a-h)/g,this._x=(r+o)/g,this._y=.25*g,this._z=(d+u)/g}else{const g=2*Math.sqrt(1+f-n-l);this._w=(o-r)/g,this._x=(a+h)/g,this._y=(d+u)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(at(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,r=e._y,a=e._z,o=e._w,l=t._x,d=t._y,h=t._z,u=t._w;return this._x=n*u+o*l+r*h-a*d,this._y=r*u+o*d+a*l-n*h,this._z=a*u+o*h+n*d-r*l,this._w=o*u-n*l-r*d-a*h,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let n=e._x,r=e._y,a=e._z,o=e._w,l=this.dot(e);l<0&&(n=-n,r=-r,a=-a,o=-o,l=-l);let d=1-t;if(l<.9995){const h=Math.acos(l),u=Math.sin(h);d=Math.sin(d*h)/u,t=Math.sin(t*h)/u,this._x=this._x*d+n*t,this._y=this._y*d+r*t,this._z=this._z*d+a*t,this._w=this._w*d+o*t,this._onChangeCallback()}else this._x=this._x*d+n*t,this._y=this._y*d+r*t,this._z=this._z*d+a*t,this._w=this._w*d+o*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),a=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class k{constructor(e=0,t=0,n=0){k.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Fc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Fc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,r=this.z,a=e.elements;return this.x=a[0]*t+a[3]*n+a[6]*r,this.y=a[1]*t+a[4]*n+a[7]*r,this.z=a[2]*t+a[5]*n+a[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,a=e.elements,o=1/(a[3]*t+a[7]*n+a[11]*r+a[15]);return this.x=(a[0]*t+a[4]*n+a[8]*r+a[12])*o,this.y=(a[1]*t+a[5]*n+a[9]*r+a[13])*o,this.z=(a[2]*t+a[6]*n+a[10]*r+a[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,r=this.z,a=e.x,o=e.y,l=e.z,d=e.w,h=2*(o*r-l*n),u=2*(l*t-a*r),f=2*(a*n-o*t);return this.x=t+d*h+o*f-l*u,this.y=n+d*u+l*h-a*f,this.z=r+d*f+a*u-o*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,r=this.z,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r,this.y=a[1]*t+a[5]*n+a[9]*r,this.z=a[2]*t+a[6]*n+a[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=at(this.x,e.x,t.x),this.y=at(this.y,e.y,t.y),this.z=at(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=at(this.x,e,t),this.y=at(this.y,e,t),this.z=at(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(at(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,r=e.y,a=e.z,o=t.x,l=t.y,d=t.z;return this.x=r*d-a*l,this.y=a*o-n*d,this.z=n*l-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Xa.copy(this).projectOnVector(e),this.sub(Xa)}reflect(e){return this.sub(Xa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(at(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Xa=new k,Fc=new vs;class tt{constructor(e,t,n,r,a,o,l,d,h){tt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,a,o,l,d,h)}set(e,t,n,r,a,o,l,d,h){const u=this.elements;return u[0]=e,u[1]=r,u[2]=l,u[3]=t,u[4]=a,u[5]=d,u[6]=n,u[7]=o,u[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,a=this.elements,o=n[0],l=n[3],d=n[6],h=n[1],u=n[4],f=n[7],m=n[2],g=n[5],y=n[8],_=r[0],x=r[3],p=r[6],E=r[1],T=r[4],C=r[7],N=r[2],L=r[5],D=r[8];return a[0]=o*_+l*E+d*N,a[3]=o*x+l*T+d*L,a[6]=o*p+l*C+d*D,a[1]=h*_+u*E+f*N,a[4]=h*x+u*T+f*L,a[7]=h*p+u*C+f*D,a[2]=m*_+g*E+y*N,a[5]=m*x+g*T+y*L,a[8]=m*p+g*C+y*D,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],r=e[2],a=e[3],o=e[4],l=e[5],d=e[6],h=e[7],u=e[8];return t*o*u-t*l*h-n*a*u+n*l*d+r*a*h-r*o*d}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],a=e[3],o=e[4],l=e[5],d=e[6],h=e[7],u=e[8],f=u*o-l*h,m=l*d-u*a,g=h*a-o*d,y=t*f+n*m+r*g;if(y===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/y;return e[0]=f*_,e[1]=(r*h-u*n)*_,e[2]=(l*n-r*o)*_,e[3]=m*_,e[4]=(u*t-r*d)*_,e[5]=(r*a-l*t)*_,e[6]=g*_,e[7]=(n*d-h*t)*_,e[8]=(o*t-n*a)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,a,o,l){const d=Math.cos(a),h=Math.sin(a);return this.set(n*d,n*h,-n*(d*o+h*l)+o+e,-r*h,r*d,-r*(-h*o+d*l)+l+t,0,0,1),this}scale(e,t){return this.premultiply($a.makeScale(e,t)),this}rotate(e){return this.premultiply($a.makeRotation(-e)),this}translate(e,t){return this.premultiply($a.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const $a=new tt,kc=new tt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Oc=new tt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Vf(){const i={enabled:!0,workingColorSpace:Cr,spaces:{},convert:function(r,a,o){return this.enabled===!1||a===o||!a||!o||(this.spaces[a].transfer===bt&&(r.r=ui(r.r),r.g=ui(r.g),r.b=ui(r.b)),this.spaces[a].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[a].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===bt&&(r.r=Mr(r.r),r.g=Mr(r.g),r.b=Mr(r.b))),r},workingToColorSpace:function(r,a){return this.convert(r,this.workingColorSpace,a)},colorSpaceToWorking:function(r,a){return this.convert(r,a,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Ii?_a:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,a=this.workingColorSpace){return r.fromArray(this.spaces[a].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,a,o){return r.copy(this.spaces[a].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,a){return ms("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,a)},toWorkingColorSpace:function(r,a){return ms("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Cr]:{primaries:e,whitePoint:n,transfer:_a,toXYZ:kc,fromXYZ:Oc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:yn},outputColorSpaceConfig:{drawingBufferColorSpace:yn}},[yn]:{primaries:e,whitePoint:n,transfer:bt,toXYZ:kc,fromXYZ:Oc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:yn}}}),i}const pt=Vf();function ui(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Mr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let or;class Hf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{or===void 0&&(or=ps("canvas")),or.width=e.width,or.height=e.height;const r=or.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),n=or}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ps("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const r=n.getImageData(0,0,e.width,e.height),a=r.data;for(let o=0;o<a.length;o++)a[o]=ui(a[o]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ui(t[n]/255)*255):t[n]=ui(t[n]);return{data:t,width:e.width,height:e.height}}else return qe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Wf=0;class Dl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Wf++}),this.uuid=Lr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let a;if(Array.isArray(r)){a=[];for(let o=0,l=r.length;o<l;o++)r[o].isDataTexture?a.push(qa(r[o].image)):a.push(qa(r[o]))}else a=qa(r);n.url=a}return t||(e.images[this.uuid]=n),n}}function qa(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Hf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(qe("Texture: Unable to serialize Texture."),{})}let Xf=0;const Ya=new k;class Wt extends Pr{constructor(e=Wt.DEFAULT_IMAGE,t=Wt.DEFAULT_MAPPING,n=di,r=di,a=Jt,o=Yi,l=Pn,d=un,h=Wt.DEFAULT_ANISOTROPY,u=Ii){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Xf++}),this.uuid=Lr(),this.name="",this.source=new Dl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=a,this.minFilter=o,this.anisotropy=h,this.format=l,this.internalFormat=null,this.type=d,this.offset=new He(0,0),this.repeat=new He(1,1),this.center=new He(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new tt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ya).x}get height(){return this.source.getSize(Ya).y}get depth(){return this.source.getSize(Ya).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){qe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){qe(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Vd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Bo:e.x=e.x-Math.floor(e.x);break;case di:e.x=e.x<0?0:1;break;case zo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Bo:e.y=e.y-Math.floor(e.y);break;case di:e.y=e.y<0?0:1;break;case zo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Wt.DEFAULT_IMAGE=null;Wt.DEFAULT_MAPPING=Vd;Wt.DEFAULT_ANISOTROPY=1;class Pt{constructor(e=0,t=0,n=0,r=1){Pt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,a=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*r+o[12]*a,this.y=o[1]*t+o[5]*n+o[9]*r+o[13]*a,this.z=o[2]*t+o[6]*n+o[10]*r+o[14]*a,this.w=o[3]*t+o[7]*n+o[11]*r+o[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,a;const d=e.elements,h=d[0],u=d[4],f=d[8],m=d[1],g=d[5],y=d[9],_=d[2],x=d[6],p=d[10];if(Math.abs(u-m)<.01&&Math.abs(f-_)<.01&&Math.abs(y-x)<.01){if(Math.abs(u+m)<.1&&Math.abs(f+_)<.1&&Math.abs(y+x)<.1&&Math.abs(h+g+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const T=(h+1)/2,C=(g+1)/2,N=(p+1)/2,L=(u+m)/4,D=(f+_)/4,j=(y+x)/4;return T>C&&T>N?T<.01?(n=0,r=.707106781,a=.707106781):(n=Math.sqrt(T),r=L/n,a=D/n):C>N?C<.01?(n=.707106781,r=0,a=.707106781):(r=Math.sqrt(C),n=L/r,a=j/r):N<.01?(n=.707106781,r=.707106781,a=0):(a=Math.sqrt(N),n=D/a,r=j/a),this.set(n,r,a,t),this}let E=Math.sqrt((x-y)*(x-y)+(f-_)*(f-_)+(m-u)*(m-u));return Math.abs(E)<.001&&(E=1),this.x=(x-y)/E,this.y=(f-_)/E,this.z=(m-u)/E,this.w=Math.acos((h+g+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=at(this.x,e.x,t.x),this.y=at(this.y,e.y,t.y),this.z=at(this.z,e.z,t.z),this.w=at(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=at(this.x,e,t),this.y=at(this.y,e,t),this.z=at(this.z,e,t),this.w=at(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(at(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class $f extends Pr{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Jt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Pt(0,0,e,t),this.scissorTest=!1,this.viewport=new Pt(0,0,e,t);const r={width:e,height:t,depth:n.depth},a=new Wt(r);this.textures=[];const o=n.count;for(let l=0;l<o;l++)this.textures[l]=a.clone(),this.textures[l].isRenderTargetTexture=!0,this.textures[l].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:Jt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,a=this.textures.length;r<a;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new Dl(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Yn extends $f{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Qd extends Wt{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Ht,this.minFilter=Ht,this.wrapR=di,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class qf extends Wt{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Ht,this.minFilter=Ht,this.wrapR=di,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class _s{constructor(e=new k(1/0,1/0,1/0),t=new k(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Tn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Tn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Tn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const a=n.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let o=0,l=a.count;o<l;o++)e.isMesh===!0?e.getVertexPosition(o,Tn):Tn.fromBufferAttribute(a,o),Tn.applyMatrix4(e.matrixWorld),this.expandByPoint(Tn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Gs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Gs.copy(n.boundingBox)),Gs.applyMatrix4(e.matrixWorld),this.union(Gs)}const r=e.children;for(let a=0,o=r.length;a<o;a++)this.expandByObject(r[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Tn),Tn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Kr),Vs.subVectors(this.max,Kr),lr.subVectors(e.a,Kr),cr.subVectors(e.b,Kr),dr.subVectors(e.c,Kr),Ai.subVectors(cr,lr),Ci.subVectors(dr,cr),zi.subVectors(lr,dr);let t=[0,-Ai.z,Ai.y,0,-Ci.z,Ci.y,0,-zi.z,zi.y,Ai.z,0,-Ai.x,Ci.z,0,-Ci.x,zi.z,0,-zi.x,-Ai.y,Ai.x,0,-Ci.y,Ci.x,0,-zi.y,zi.x,0];return!Ka(t,lr,cr,dr,Vs)||(t=[1,0,0,0,1,0,0,0,1],!Ka(t,lr,cr,dr,Vs))?!1:(Hs.crossVectors(Ai,Ci),t=[Hs.x,Hs.y,Hs.z],Ka(t,lr,cr,dr,Vs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Tn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Tn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(si[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),si[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),si[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),si[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),si[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),si[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),si[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),si[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(si),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const si=[new k,new k,new k,new k,new k,new k,new k,new k],Tn=new k,Gs=new _s,lr=new k,cr=new k,dr=new k,Ai=new k,Ci=new k,zi=new k,Kr=new k,Vs=new k,Hs=new k,Gi=new k;function Ka(i,e,t,n,r){for(let a=0,o=i.length-3;a<=o;a+=3){Gi.fromArray(i,a);const l=r.x*Math.abs(Gi.x)+r.y*Math.abs(Gi.y)+r.z*Math.abs(Gi.z),d=e.dot(Gi),h=t.dot(Gi),u=n.dot(Gi);if(Math.max(-Math.max(d,h,u),Math.min(d,h,u))>l)return!1}return!0}const Yf=new _s,Jr=new k,Ja=new k;class Ma{constructor(e=new k,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Yf.setFromPoints(e).getCenter(n);let r=0;for(let a=0,o=e.length;a<o;a++)r=Math.max(r,n.distanceToSquared(e[a]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Jr.subVectors(e,this.center);const t=Jr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(Jr,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ja.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Jr.copy(e.center).add(Ja)),this.expandByPoint(Jr.copy(e.center).sub(Ja))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const ai=new k,Za=new k,Ws=new k,Ni=new k,Qa=new k,Xs=new k,eo=new k;class Il{constructor(e=new k,t=new k(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ai)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ai.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ai.copy(this.origin).addScaledVector(this.direction,t),ai.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Za.copy(e).add(t).multiplyScalar(.5),Ws.copy(t).sub(e).normalize(),Ni.copy(this.origin).sub(Za);const a=e.distanceTo(t)*.5,o=-this.direction.dot(Ws),l=Ni.dot(this.direction),d=-Ni.dot(Ws),h=Ni.lengthSq(),u=Math.abs(1-o*o);let f,m,g,y;if(u>0)if(f=o*d-l,m=o*l-d,y=a*u,f>=0)if(m>=-y)if(m<=y){const _=1/u;f*=_,m*=_,g=f*(f+o*m+2*l)+m*(o*f+m+2*d)+h}else m=a,f=Math.max(0,-(o*m+l)),g=-f*f+m*(m+2*d)+h;else m=-a,f=Math.max(0,-(o*m+l)),g=-f*f+m*(m+2*d)+h;else m<=-y?(f=Math.max(0,-(-o*a+l)),m=f>0?-a:Math.min(Math.max(-a,-d),a),g=-f*f+m*(m+2*d)+h):m<=y?(f=0,m=Math.min(Math.max(-a,-d),a),g=m*(m+2*d)+h):(f=Math.max(0,-(o*a+l)),m=f>0?a:Math.min(Math.max(-a,-d),a),g=-f*f+m*(m+2*d)+h);else m=o>0?-a:a,f=Math.max(0,-(o*m+l)),g=-f*f+m*(m+2*d)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(Za).addScaledVector(Ws,m),g}intersectSphere(e,t){ai.subVectors(e.center,this.origin);const n=ai.dot(this.direction),r=ai.dot(ai)-n*n,a=e.radius*e.radius;if(r>a)return null;const o=Math.sqrt(a-r),l=n-o,d=n+o;return d<0?null:l<0?this.at(d,t):this.at(l,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,a,o,l,d;const h=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,m=this.origin;return h>=0?(n=(e.min.x-m.x)*h,r=(e.max.x-m.x)*h):(n=(e.max.x-m.x)*h,r=(e.min.x-m.x)*h),u>=0?(a=(e.min.y-m.y)*u,o=(e.max.y-m.y)*u):(a=(e.max.y-m.y)*u,o=(e.min.y-m.y)*u),n>o||a>r||((a>n||isNaN(n))&&(n=a),(o<r||isNaN(r))&&(r=o),f>=0?(l=(e.min.z-m.z)*f,d=(e.max.z-m.z)*f):(l=(e.max.z-m.z)*f,d=(e.min.z-m.z)*f),n>d||l>r)||((l>n||n!==n)&&(n=l),(d<r||r!==r)&&(r=d),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,ai)!==null}intersectTriangle(e,t,n,r,a){Qa.subVectors(t,e),Xs.subVectors(n,e),eo.crossVectors(Qa,Xs);let o=this.direction.dot(eo),l;if(o>0){if(r)return null;l=1}else if(o<0)l=-1,o=-o;else return null;Ni.subVectors(this.origin,e);const d=l*this.direction.dot(Xs.crossVectors(Ni,Xs));if(d<0)return null;const h=l*this.direction.dot(Qa.cross(Ni));if(h<0||d+h>o)return null;const u=-l*Ni.dot(eo);return u<0?null:this.at(u/o,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class At{constructor(e,t,n,r,a,o,l,d,h,u,f,m,g,y,_,x){At.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,a,o,l,d,h,u,f,m,g,y,_,x)}set(e,t,n,r,a,o,l,d,h,u,f,m,g,y,_,x){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=r,p[1]=a,p[5]=o,p[9]=l,p[13]=d,p[2]=h,p[6]=u,p[10]=f,p[14]=m,p[3]=g,p[7]=y,p[11]=_,p[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new At().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,n=e.elements,r=1/hr.setFromMatrixColumn(e,0).length(),a=1/hr.setFromMatrixColumn(e,1).length(),o=1/hr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*a,t[5]=n[5]*a,t[6]=n[6]*a,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,r=e.y,a=e.z,o=Math.cos(n),l=Math.sin(n),d=Math.cos(r),h=Math.sin(r),u=Math.cos(a),f=Math.sin(a);if(e.order==="XYZ"){const m=o*u,g=o*f,y=l*u,_=l*f;t[0]=d*u,t[4]=-d*f,t[8]=h,t[1]=g+y*h,t[5]=m-_*h,t[9]=-l*d,t[2]=_-m*h,t[6]=y+g*h,t[10]=o*d}else if(e.order==="YXZ"){const m=d*u,g=d*f,y=h*u,_=h*f;t[0]=m+_*l,t[4]=y*l-g,t[8]=o*h,t[1]=o*f,t[5]=o*u,t[9]=-l,t[2]=g*l-y,t[6]=_+m*l,t[10]=o*d}else if(e.order==="ZXY"){const m=d*u,g=d*f,y=h*u,_=h*f;t[0]=m-_*l,t[4]=-o*f,t[8]=y+g*l,t[1]=g+y*l,t[5]=o*u,t[9]=_-m*l,t[2]=-o*h,t[6]=l,t[10]=o*d}else if(e.order==="ZYX"){const m=o*u,g=o*f,y=l*u,_=l*f;t[0]=d*u,t[4]=y*h-g,t[8]=m*h+_,t[1]=d*f,t[5]=_*h+m,t[9]=g*h-y,t[2]=-h,t[6]=l*d,t[10]=o*d}else if(e.order==="YZX"){const m=o*d,g=o*h,y=l*d,_=l*h;t[0]=d*u,t[4]=_-m*f,t[8]=y*f+g,t[1]=f,t[5]=o*u,t[9]=-l*u,t[2]=-h*u,t[6]=g*f+y,t[10]=m-_*f}else if(e.order==="XZY"){const m=o*d,g=o*h,y=l*d,_=l*h;t[0]=d*u,t[4]=-f,t[8]=h*u,t[1]=m*f+_,t[5]=o*u,t[9]=g*f-y,t[2]=y*f-g,t[6]=l*u,t[10]=_*f+m}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Kf,e,Jf)}lookAt(e,t,n){const r=this.elements;return dn.subVectors(e,t),dn.lengthSq()===0&&(dn.z=1),dn.normalize(),Ri.crossVectors(n,dn),Ri.lengthSq()===0&&(Math.abs(n.z)===1?dn.x+=1e-4:dn.z+=1e-4,dn.normalize(),Ri.crossVectors(n,dn)),Ri.normalize(),$s.crossVectors(dn,Ri),r[0]=Ri.x,r[4]=$s.x,r[8]=dn.x,r[1]=Ri.y,r[5]=$s.y,r[9]=dn.y,r[2]=Ri.z,r[6]=$s.z,r[10]=dn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,a=this.elements,o=n[0],l=n[4],d=n[8],h=n[12],u=n[1],f=n[5],m=n[9],g=n[13],y=n[2],_=n[6],x=n[10],p=n[14],E=n[3],T=n[7],C=n[11],N=n[15],L=r[0],D=r[4],j=r[8],S=r[12],M=r[1],U=r[5],V=r[9],H=r[13],K=r[2],Q=r[6],J=r[10],Y=r[14],le=r[3],me=r[7],ve=r[11],be=r[15];return a[0]=o*L+l*M+d*K+h*le,a[4]=o*D+l*U+d*Q+h*me,a[8]=o*j+l*V+d*J+h*ve,a[12]=o*S+l*H+d*Y+h*be,a[1]=u*L+f*M+m*K+g*le,a[5]=u*D+f*U+m*Q+g*me,a[9]=u*j+f*V+m*J+g*ve,a[13]=u*S+f*H+m*Y+g*be,a[2]=y*L+_*M+x*K+p*le,a[6]=y*D+_*U+x*Q+p*me,a[10]=y*j+_*V+x*J+p*ve,a[14]=y*S+_*H+x*Y+p*be,a[3]=E*L+T*M+C*K+N*le,a[7]=E*D+T*U+C*Q+N*me,a[11]=E*j+T*V+C*J+N*ve,a[15]=E*S+T*H+C*Y+N*be,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],r=e[8],a=e[12],o=e[1],l=e[5],d=e[9],h=e[13],u=e[2],f=e[6],m=e[10],g=e[14],y=e[3],_=e[7],x=e[11],p=e[15],E=d*g-h*m,T=l*g-h*f,C=l*m-d*f,N=o*g-h*u,L=o*m-d*u,D=o*f-l*u;return t*(_*E-x*T+p*C)-n*(y*E-x*N+p*L)+r*(y*T-_*N+p*D)-a*(y*C-_*L+x*D)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],a=e[3],o=e[4],l=e[5],d=e[6],h=e[7],u=e[8],f=e[9],m=e[10],g=e[11],y=e[12],_=e[13],x=e[14],p=e[15],E=f*x*h-_*m*h+_*d*g-l*x*g-f*d*p+l*m*p,T=y*m*h-u*x*h-y*d*g+o*x*g+u*d*p-o*m*p,C=u*_*h-y*f*h+y*l*g-o*_*g-u*l*p+o*f*p,N=y*f*d-u*_*d-y*l*m+o*_*m+u*l*x-o*f*x,L=t*E+n*T+r*C+a*N;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const D=1/L;return e[0]=E*D,e[1]=(_*m*a-f*x*a-_*r*g+n*x*g+f*r*p-n*m*p)*D,e[2]=(l*x*a-_*d*a+_*r*h-n*x*h-l*r*p+n*d*p)*D,e[3]=(f*d*a-l*m*a-f*r*h+n*m*h+l*r*g-n*d*g)*D,e[4]=T*D,e[5]=(u*x*a-y*m*a+y*r*g-t*x*g-u*r*p+t*m*p)*D,e[6]=(y*d*a-o*x*a-y*r*h+t*x*h+o*r*p-t*d*p)*D,e[7]=(o*m*a-u*d*a+u*r*h-t*m*h-o*r*g+t*d*g)*D,e[8]=C*D,e[9]=(y*f*a-u*_*a-y*n*g+t*_*g+u*n*p-t*f*p)*D,e[10]=(o*_*a-y*l*a+y*n*h-t*_*h-o*n*p+t*l*p)*D,e[11]=(u*l*a-o*f*a-u*n*h+t*f*h+o*n*g-t*l*g)*D,e[12]=N*D,e[13]=(u*_*r-y*f*r+y*n*m-t*_*m-u*n*x+t*f*x)*D,e[14]=(y*l*r-o*_*r-y*n*d+t*_*d+o*n*x-t*l*x)*D,e[15]=(o*f*r-u*l*r+u*n*d-t*f*d-o*n*m+t*l*m)*D,this}scale(e){const t=this.elements,n=e.x,r=e.y,a=e.z;return t[0]*=n,t[4]*=r,t[8]*=a,t[1]*=n,t[5]*=r,t[9]*=a,t[2]*=n,t[6]*=r,t[10]*=a,t[3]*=n,t[7]*=r,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),r=Math.sin(t),a=1-n,o=e.x,l=e.y,d=e.z,h=a*o,u=a*l;return this.set(h*o+n,h*l-r*d,h*d+r*l,0,h*l+r*d,u*l+n,u*d-r*o,0,h*d-r*l,u*d+r*o,a*d*d+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,a,o){return this.set(1,n,a,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){const r=this.elements,a=t._x,o=t._y,l=t._z,d=t._w,h=a+a,u=o+o,f=l+l,m=a*h,g=a*u,y=a*f,_=o*u,x=o*f,p=l*f,E=d*h,T=d*u,C=d*f,N=n.x,L=n.y,D=n.z;return r[0]=(1-(_+p))*N,r[1]=(g+C)*N,r[2]=(y-T)*N,r[3]=0,r[4]=(g-C)*L,r[5]=(1-(m+p))*L,r[6]=(x+E)*L,r[7]=0,r[8]=(y+T)*D,r[9]=(x-E)*D,r[10]=(1-(m+_))*D,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){const r=this.elements;if(e.x=r[12],e.y=r[13],e.z=r[14],this.determinant()===0)return n.set(1,1,1),t.identity(),this;let a=hr.set(r[0],r[1],r[2]).length();const o=hr.set(r[4],r[5],r[6]).length(),l=hr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(a=-a),An.copy(this);const h=1/a,u=1/o,f=1/l;return An.elements[0]*=h,An.elements[1]*=h,An.elements[2]*=h,An.elements[4]*=u,An.elements[5]*=u,An.elements[6]*=u,An.elements[8]*=f,An.elements[9]*=f,An.elements[10]*=f,t.setFromRotationMatrix(An),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,r,a,o,l=$n,d=!1){const h=this.elements,u=2*a/(t-e),f=2*a/(n-r),m=(t+e)/(t-e),g=(n+r)/(n-r);let y,_;if(d)y=a/(o-a),_=o*a/(o-a);else if(l===$n)y=-(o+a)/(o-a),_=-2*o*a/(o-a);else if(l===ya)y=-o/(o-a),_=-o*a/(o-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+l);return h[0]=u,h[4]=0,h[8]=m,h[12]=0,h[1]=0,h[5]=f,h[9]=g,h[13]=0,h[2]=0,h[6]=0,h[10]=y,h[14]=_,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,t,n,r,a,o,l=$n,d=!1){const h=this.elements,u=2/(t-e),f=2/(n-r),m=-(t+e)/(t-e),g=-(n+r)/(n-r);let y,_;if(d)y=1/(o-a),_=o/(o-a);else if(l===$n)y=-2/(o-a),_=-(o+a)/(o-a);else if(l===ya)y=-1/(o-a),_=-a/(o-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+l);return h[0]=u,h[4]=0,h[8]=0,h[12]=m,h[1]=0,h[5]=f,h[9]=0,h[13]=g,h[2]=0,h[6]=0,h[10]=y,h[14]=_,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const hr=new k,An=new At,Kf=new k(0,0,0),Jf=new k(1,1,1),Ri=new k,$s=new k,dn=new k,jc=new At,Bc=new vs;class Jn{constructor(e=0,t=0,n=0,r=Jn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const r=e.elements,a=r[0],o=r[4],l=r[8],d=r[1],h=r[5],u=r[9],f=r[2],m=r[6],g=r[10];switch(t){case"XYZ":this._y=Math.asin(at(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,g),this._z=Math.atan2(-o,a)):(this._x=Math.atan2(m,h),this._z=0);break;case"YXZ":this._x=Math.asin(-at(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(l,g),this._z=Math.atan2(d,h)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(at(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-f,g),this._z=Math.atan2(-o,h)):(this._y=0,this._z=Math.atan2(d,a));break;case"ZYX":this._y=Math.asin(-at(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(m,g),this._z=Math.atan2(d,a)):(this._x=0,this._z=Math.atan2(-o,h));break;case"YZX":this._z=Math.asin(at(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-u,h),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(l,g));break;case"XZY":this._z=Math.asin(-at(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(m,h),this._y=Math.atan2(l,a)):(this._x=Math.atan2(-u,g),this._y=0);break;default:qe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return jc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(jc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Bc.setFromEuler(this),this.setFromQuaternion(Bc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Jn.DEFAULT_ORDER="XYZ";class Ul{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Zf=0;const zc=new k,ur=new vs,oi=new At,qs=new k,Zr=new k,Qf=new k,ep=new vs,Gc=new k(1,0,0),Vc=new k(0,1,0),Hc=new k(0,0,1),Wc={type:"added"},tp={type:"removed"},fr={type:"childadded",child:null},to={type:"childremoved",child:null};class Xt extends Pr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zf++}),this.uuid=Lr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Xt.DEFAULT_UP.clone();const e=new k,t=new Jn,n=new vs,r=new k(1,1,1);function a(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(a),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new At},normalMatrix:{value:new tt}}),this.matrix=new At,this.matrixWorld=new At,this.matrixAutoUpdate=Xt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ul,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ur.setFromAxisAngle(e,t),this.quaternion.multiply(ur),this}rotateOnWorldAxis(e,t){return ur.setFromAxisAngle(e,t),this.quaternion.premultiply(ur),this}rotateX(e){return this.rotateOnAxis(Gc,e)}rotateY(e){return this.rotateOnAxis(Vc,e)}rotateZ(e){return this.rotateOnAxis(Hc,e)}translateOnAxis(e,t){return zc.copy(e).applyQuaternion(this.quaternion),this.position.add(zc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Gc,e)}translateY(e){return this.translateOnAxis(Vc,e)}translateZ(e){return this.translateOnAxis(Hc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(oi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?qs.copy(e):qs.set(e,t,n);const r=this.parent;this.updateWorldMatrix(!0,!1),Zr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?oi.lookAt(Zr,qs,this.up):oi.lookAt(qs,Zr,this.up),this.quaternion.setFromRotationMatrix(oi),r&&(oi.extractRotation(r.matrixWorld),ur.setFromRotationMatrix(oi),this.quaternion.premultiply(ur.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ft("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Wc),fr.child=e,this.dispatchEvent(fr),fr.child=null):ft("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(tp),to.child=e,this.dispatchEvent(to),to.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),oi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),oi.multiply(e.parent.matrixWorld)),e.applyMatrix4(oi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Wc),fr.child=e,this.dispatchEvent(fr),fr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zr,e,Qf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zr,ep,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(l=>({...l,boundingBox:l.boundingBox?l.boundingBox.toJSON():void 0,boundingSphere:l.boundingSphere?l.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(l=>({...l})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function a(l,d){return l[d.uuid]===void 0&&(l[d.uuid]=d.toJSON(e)),d.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=a(e.geometries,this.geometry);const l=this.geometry.parameters;if(l!==void 0&&l.shapes!==void 0){const d=l.shapes;if(Array.isArray(d))for(let h=0,u=d.length;h<u;h++){const f=d[h];a(e.shapes,f)}else a(e.shapes,d)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const l=[];for(let d=0,h=this.material.length;d<h;d++)l.push(a(e.materials,this.material[d]));r.material=l}else r.material=a(e.materials,this.material);if(this.children.length>0){r.children=[];for(let l=0;l<this.children.length;l++)r.children.push(this.children[l].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let l=0;l<this.animations.length;l++){const d=this.animations[l];r.animations.push(a(e.animations,d))}}if(t){const l=o(e.geometries),d=o(e.materials),h=o(e.textures),u=o(e.images),f=o(e.shapes),m=o(e.skeletons),g=o(e.animations),y=o(e.nodes);l.length>0&&(n.geometries=l),d.length>0&&(n.materials=d),h.length>0&&(n.textures=h),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),m.length>0&&(n.skeletons=m),g.length>0&&(n.animations=g),y.length>0&&(n.nodes=y)}return n.object=r,n;function o(l){const d=[];for(const h in l){const u=l[h];delete u.metadata,d.push(u)}return d}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const r=e.children[n];this.add(r.clone())}return this}}Xt.DEFAULT_UP=new k(0,1,0);Xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Cn=new k,li=new k,no=new k,ci=new k,pr=new k,mr=new k,Xc=new k,io=new k,ro=new k,so=new k,ao=new Pt,oo=new Pt,lo=new Pt;class Rn{constructor(e=new k,t=new k,n=new k){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Cn.subVectors(e,t),r.cross(Cn);const a=r.lengthSq();return a>0?r.multiplyScalar(1/Math.sqrt(a)):r.set(0,0,0)}static getBarycoord(e,t,n,r,a){Cn.subVectors(r,t),li.subVectors(n,t),no.subVectors(e,t);const o=Cn.dot(Cn),l=Cn.dot(li),d=Cn.dot(no),h=li.dot(li),u=li.dot(no),f=o*h-l*l;if(f===0)return a.set(0,0,0),null;const m=1/f,g=(h*d-l*u)*m,y=(o*u-l*d)*m;return a.set(1-g-y,y,g)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,ci)===null?!1:ci.x>=0&&ci.y>=0&&ci.x+ci.y<=1}static getInterpolation(e,t,n,r,a,o,l,d){return this.getBarycoord(e,t,n,r,ci)===null?(d.x=0,d.y=0,"z"in d&&(d.z=0),"w"in d&&(d.w=0),null):(d.setScalar(0),d.addScaledVector(a,ci.x),d.addScaledVector(o,ci.y),d.addScaledVector(l,ci.z),d)}static getInterpolatedAttribute(e,t,n,r,a,o){return ao.setScalar(0),oo.setScalar(0),lo.setScalar(0),ao.fromBufferAttribute(e,t),oo.fromBufferAttribute(e,n),lo.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(ao,a.x),o.addScaledVector(oo,a.y),o.addScaledVector(lo,a.z),o}static isFrontFacing(e,t,n,r){return Cn.subVectors(n,t),li.subVectors(e,t),Cn.cross(li).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Cn.subVectors(this.c,this.b),li.subVectors(this.a,this.b),Cn.cross(li).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Rn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Rn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,a){return Rn.getInterpolation(e,this.a,this.b,this.c,t,n,r,a)}containsPoint(e){return Rn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Rn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,r=this.b,a=this.c;let o,l;pr.subVectors(r,n),mr.subVectors(a,n),io.subVectors(e,n);const d=pr.dot(io),h=mr.dot(io);if(d<=0&&h<=0)return t.copy(n);ro.subVectors(e,r);const u=pr.dot(ro),f=mr.dot(ro);if(u>=0&&f<=u)return t.copy(r);const m=d*f-u*h;if(m<=0&&d>=0&&u<=0)return o=d/(d-u),t.copy(n).addScaledVector(pr,o);so.subVectors(e,a);const g=pr.dot(so),y=mr.dot(so);if(y>=0&&g<=y)return t.copy(a);const _=g*h-d*y;if(_<=0&&h>=0&&y<=0)return l=h/(h-y),t.copy(n).addScaledVector(mr,l);const x=u*y-g*f;if(x<=0&&f-u>=0&&g-y>=0)return Xc.subVectors(a,r),l=(f-u)/(f-u+(g-y)),t.copy(r).addScaledVector(Xc,l);const p=1/(x+_+m);return o=_*p,l=m*p,t.copy(n).addScaledVector(pr,o).addScaledVector(mr,l)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const eh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Pi={h:0,s:0,l:0},Ys={h:0,s:0,l:0};function co(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class ht{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=yn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,pt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=pt.workingColorSpace){return this.r=e,this.g=t,this.b=n,pt.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=pt.workingColorSpace){if(e=Ll(e,1),t=at(t,0,1),n=at(n,0,1),t===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+t):n+t-n*t,o=2*n-a;this.r=co(o,a,e+1/3),this.g=co(o,a,e),this.b=co(o,a,e-1/3)}return pt.colorSpaceToWorking(this,r),this}setStyle(e,t=yn){function n(a){a!==void 0&&parseFloat(a)<1&&qe("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const o=r[1],l=r[2];switch(o){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:qe("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=r[1],o=a.length;if(o===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(a,16),t);qe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=yn){const n=eh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):qe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ui(e.r),this.g=ui(e.g),this.b=ui(e.b),this}copyLinearToSRGB(e){return this.r=Mr(e.r),this.g=Mr(e.g),this.b=Mr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=yn){return pt.workingToColorSpace(Kt.copy(this),e),Math.round(at(Kt.r*255,0,255))*65536+Math.round(at(Kt.g*255,0,255))*256+Math.round(at(Kt.b*255,0,255))}getHexString(e=yn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=pt.workingColorSpace){pt.workingToColorSpace(Kt.copy(this),t);const n=Kt.r,r=Kt.g,a=Kt.b,o=Math.max(n,r,a),l=Math.min(n,r,a);let d,h;const u=(l+o)/2;if(l===o)d=0,h=0;else{const f=o-l;switch(h=u<=.5?f/(o+l):f/(2-o-l),o){case n:d=(r-a)/f+(r<a?6:0);break;case r:d=(a-n)/f+2;break;case a:d=(n-r)/f+4;break}d/=6}return e.h=d,e.s=h,e.l=u,e}getRGB(e,t=pt.workingColorSpace){return pt.workingToColorSpace(Kt.copy(this),t),e.r=Kt.r,e.g=Kt.g,e.b=Kt.b,e}getStyle(e=yn){pt.workingToColorSpace(Kt.copy(this),e);const t=Kt.r,n=Kt.g,r=Kt.b;return e!==yn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(Pi),this.setHSL(Pi.h+e,Pi.s+t,Pi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Pi),e.getHSL(Ys);const n=as(Pi.h,Ys.h,t),r=as(Pi.s,Ys.s,t),a=as(Pi.l,Ys.l,t);return this.setHSL(n,r,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,r=this.b,a=e.elements;return this.r=a[0]*t+a[3]*n+a[6]*r,this.g=a[1]*t+a[4]*n+a[7]*r,this.b=a[2]*t+a[5]*n+a[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Kt=new ht;ht.NAMES=eh;let np=0;class Dr extends Pr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:np++}),this.uuid=Lr(),this.name="",this.type="Material",this.blending=wr,this.side=Fi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=No,this.blendDst=Ro,this.blendEquation=$i,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ht(0,0,0),this.blendAlpha=0,this.depthFunc=Er,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Rc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ar,this.stencilZFail=ar,this.stencilZPass=ar,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){qe(`Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){qe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==wr&&(n.blending=this.blending),this.side!==Fi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==No&&(n.blendSrc=this.blendSrc),this.blendDst!==Ro&&(n.blendDst=this.blendDst),this.blendEquation!==$i&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Er&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Rc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ar&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ar&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ar&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(a){const o=[];for(const l in a){const d=a[l];delete d.metadata,o.push(d)}return o}if(t){const a=r(e.textures),o=r(e.images);a.length>0&&(n.textures=a),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const r=t.length;n=new Array(r);for(let a=0;a!==r;++a)n[a]=t[a].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Fl extends Dr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.combine=Ud,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Dt=new k,Ks=new He;let ip=0;class Ln{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ip++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Pc,this.updateRanges=[],this.gpuType=Xn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,a=this.itemSize;r<a;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ks.fromBufferAttribute(this,t),Ks.applyMatrix3(e),this.setXY(t,Ks.x,Ks.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.applyMatrix3(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.applyMatrix4(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.applyNormalMatrix(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.transformDirection(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=br(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=en(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=br(t,this.array)),t}setX(e,t){return this.normalized&&(t=en(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=br(t,this.array)),t}setY(e,t){return this.normalized&&(t=en(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=br(t,this.array)),t}setZ(e,t){return this.normalized&&(t=en(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=br(t,this.array)),t}setW(e,t){return this.normalized&&(t=en(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=en(t,this.array),n=en(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=en(t,this.array),n=en(n,this.array),r=en(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,a){return e*=this.itemSize,this.normalized&&(t=en(t,this.array),n=en(n,this.array),r=en(r,this.array),a=en(a,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Pc&&(e.usage=this.usage),e}}class th extends Ln{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class nh extends Ln{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Ct extends Ln{constructor(e,t,n){super(new Float32Array(e),t,n)}}let rp=0;const _n=new At,ho=new Xt,gr=new k,hn=new _s,Qr=new _s,jt=new k;class Zt extends Pr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:rp++}),this.uuid=Lr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Zd(e)?nh:th)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new tt().getNormalMatrix(e);n.applyNormalMatrix(a),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return _n.makeRotationFromQuaternion(e),this.applyMatrix4(_n),this}rotateX(e){return _n.makeRotationX(e),this.applyMatrix4(_n),this}rotateY(e){return _n.makeRotationY(e),this.applyMatrix4(_n),this}rotateZ(e){return _n.makeRotationZ(e),this.applyMatrix4(_n),this}translate(e,t,n){return _n.makeTranslation(e,t,n),this.applyMatrix4(_n),this}scale(e,t,n){return _n.makeScale(e,t,n),this.applyMatrix4(_n),this}lookAt(e){return ho.lookAt(e),ho.updateMatrix(),this.applyMatrix4(ho.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(gr).negate(),this.translate(gr.x,gr.y,gr.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let r=0,a=e.length;r<a;r++){const o=e[r];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ct(n,3))}else{const n=Math.min(e.length,t.count);for(let r=0;r<n;r++){const a=e[r];t.setXYZ(r,a.x,a.y,a.z||0)}e.length>t.count&&qe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new _s);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ft("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new k(-1/0,-1/0,-1/0),new k(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){const a=t[n];hn.setFromBufferAttribute(a),this.morphTargetsRelative?(jt.addVectors(this.boundingBox.min,hn.min),this.boundingBox.expandByPoint(jt),jt.addVectors(this.boundingBox.max,hn.max),this.boundingBox.expandByPoint(jt)):(this.boundingBox.expandByPoint(hn.min),this.boundingBox.expandByPoint(hn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ft('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ma);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ft("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new k,1/0);return}if(e){const n=this.boundingSphere.center;if(hn.setFromBufferAttribute(e),t)for(let a=0,o=t.length;a<o;a++){const l=t[a];Qr.setFromBufferAttribute(l),this.morphTargetsRelative?(jt.addVectors(hn.min,Qr.min),hn.expandByPoint(jt),jt.addVectors(hn.max,Qr.max),hn.expandByPoint(jt)):(hn.expandByPoint(Qr.min),hn.expandByPoint(Qr.max))}hn.getCenter(n);let r=0;for(let a=0,o=e.count;a<o;a++)jt.fromBufferAttribute(e,a),r=Math.max(r,n.distanceToSquared(jt));if(t)for(let a=0,o=t.length;a<o;a++){const l=t[a],d=this.morphTargetsRelative;for(let h=0,u=l.count;h<u;h++)jt.fromBufferAttribute(l,h),d&&(gr.fromBufferAttribute(e,h),jt.add(gr)),r=Math.max(r,n.distanceToSquared(jt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&ft('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ft("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,r=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ln(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),l=[],d=[];for(let j=0;j<n.count;j++)l[j]=new k,d[j]=new k;const h=new k,u=new k,f=new k,m=new He,g=new He,y=new He,_=new k,x=new k;function p(j,S,M){h.fromBufferAttribute(n,j),u.fromBufferAttribute(n,S),f.fromBufferAttribute(n,M),m.fromBufferAttribute(a,j),g.fromBufferAttribute(a,S),y.fromBufferAttribute(a,M),u.sub(h),f.sub(h),g.sub(m),y.sub(m);const U=1/(g.x*y.y-y.x*g.y);isFinite(U)&&(_.copy(u).multiplyScalar(y.y).addScaledVector(f,-g.y).multiplyScalar(U),x.copy(f).multiplyScalar(g.x).addScaledVector(u,-y.x).multiplyScalar(U),l[j].add(_),l[S].add(_),l[M].add(_),d[j].add(x),d[S].add(x),d[M].add(x))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let j=0,S=E.length;j<S;++j){const M=E[j],U=M.start,V=M.count;for(let H=U,K=U+V;H<K;H+=3)p(e.getX(H+0),e.getX(H+1),e.getX(H+2))}const T=new k,C=new k,N=new k,L=new k;function D(j){N.fromBufferAttribute(r,j),L.copy(N);const S=l[j];T.copy(S),T.sub(N.multiplyScalar(N.dot(S))).normalize(),C.crossVectors(L,S);const U=C.dot(d[j])<0?-1:1;o.setXYZW(j,T.x,T.y,T.z,U)}for(let j=0,S=E.length;j<S;++j){const M=E[j],U=M.start,V=M.count;for(let H=U,K=U+V;H<K;H+=3)D(e.getX(H+0)),D(e.getX(H+1)),D(e.getX(H+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ln(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let m=0,g=n.count;m<g;m++)n.setXYZ(m,0,0,0);const r=new k,a=new k,o=new k,l=new k,d=new k,h=new k,u=new k,f=new k;if(e)for(let m=0,g=e.count;m<g;m+=3){const y=e.getX(m+0),_=e.getX(m+1),x=e.getX(m+2);r.fromBufferAttribute(t,y),a.fromBufferAttribute(t,_),o.fromBufferAttribute(t,x),u.subVectors(o,a),f.subVectors(r,a),u.cross(f),l.fromBufferAttribute(n,y),d.fromBufferAttribute(n,_),h.fromBufferAttribute(n,x),l.add(u),d.add(u),h.add(u),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(_,d.x,d.y,d.z),n.setXYZ(x,h.x,h.y,h.z)}else for(let m=0,g=t.count;m<g;m+=3)r.fromBufferAttribute(t,m+0),a.fromBufferAttribute(t,m+1),o.fromBufferAttribute(t,m+2),u.subVectors(o,a),f.subVectors(r,a),u.cross(f),n.setXYZ(m+0,u.x,u.y,u.z),n.setXYZ(m+1,u.x,u.y,u.z),n.setXYZ(m+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)jt.fromBufferAttribute(e,t),jt.normalize(),e.setXYZ(t,jt.x,jt.y,jt.z)}toNonIndexed(){function e(l,d){const h=l.array,u=l.itemSize,f=l.normalized,m=new h.constructor(d.length*u);let g=0,y=0;for(let _=0,x=d.length;_<x;_++){l.isInterleavedBufferAttribute?g=d[_]*l.data.stride+l.offset:g=d[_]*u;for(let p=0;p<u;p++)m[y++]=h[g++]}return new Ln(m,u,f)}if(this.index===null)return qe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Zt,n=this.index.array,r=this.attributes;for(const l in r){const d=r[l],h=e(d,n);t.setAttribute(l,h)}const a=this.morphAttributes;for(const l in a){const d=[],h=a[l];for(let u=0,f=h.length;u<f;u++){const m=h[u],g=e(m,n);d.push(g)}t.morphAttributes[l]=d}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let l=0,d=o.length;l<d;l++){const h=o[l];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const d=this.parameters;for(const h in d)d[h]!==void 0&&(e[h]=d[h]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const d in n){const h=n[d];e.data.attributes[d]=h.toJSON(e.data)}const r={};let a=!1;for(const d in this.morphAttributes){const h=this.morphAttributes[d],u=[];for(let f=0,m=h.length;f<m;f++){const g=h[f];u.push(g.toJSON(e.data))}u.length>0&&(r[d]=u,a=!0)}a&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const l=this.boundingSphere;return l!==null&&(e.data.boundingSphere=l.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const r=e.attributes;for(const h in r){const u=r[h];this.setAttribute(h,u.clone(t))}const a=e.morphAttributes;for(const h in a){const u=[],f=a[h];for(let m=0,g=f.length;m<g;m++)u.push(f[m].clone(t));this.morphAttributes[h]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let h=0,u=o.length;h<u;h++){const f=o[h];this.addGroup(f.start,f.count,f.materialIndex)}const l=e.boundingBox;l!==null&&(this.boundingBox=l.clone());const d=e.boundingSphere;return d!==null&&(this.boundingSphere=d.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const $c=new At,Vi=new Il,Js=new Ma,qc=new k,Zs=new k,Qs=new k,ea=new k,uo=new k,ta=new k,Yc=new k,na=new k;class zt extends Xt{constructor(e=new Zt,t=new Fl){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=r.length;a<o;a++){const l=r[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=a}}}}getVertexPosition(e,t){const n=this.geometry,r=n.attributes.position,a=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(r,e);const l=this.morphTargetInfluences;if(a&&l){ta.set(0,0,0);for(let d=0,h=a.length;d<h;d++){const u=l[d],f=a[d];u!==0&&(uo.fromBufferAttribute(f,e),o?ta.addScaledVector(uo,u):ta.addScaledVector(uo.sub(t),u))}t.add(ta)}return t}raycast(e,t){const n=this.geometry,r=this.material,a=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Js.copy(n.boundingSphere),Js.applyMatrix4(a),Vi.copy(e.ray).recast(e.near),!(Js.containsPoint(Vi.origin)===!1&&(Vi.intersectSphere(Js,qc)===null||Vi.origin.distanceToSquared(qc)>(e.far-e.near)**2))&&($c.copy(a).invert(),Vi.copy(e.ray).applyMatrix4($c),!(n.boundingBox!==null&&Vi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Vi)))}_computeIntersections(e,t,n){let r;const a=this.geometry,o=this.material,l=a.index,d=a.attributes.position,h=a.attributes.uv,u=a.attributes.uv1,f=a.attributes.normal,m=a.groups,g=a.drawRange;if(l!==null)if(Array.isArray(o))for(let y=0,_=m.length;y<_;y++){const x=m[y],p=o[x.materialIndex],E=Math.max(x.start,g.start),T=Math.min(l.count,Math.min(x.start+x.count,g.start+g.count));for(let C=E,N=T;C<N;C+=3){const L=l.getX(C),D=l.getX(C+1),j=l.getX(C+2);r=ia(this,p,e,n,h,u,f,L,D,j),r&&(r.faceIndex=Math.floor(C/3),r.face.materialIndex=x.materialIndex,t.push(r))}}else{const y=Math.max(0,g.start),_=Math.min(l.count,g.start+g.count);for(let x=y,p=_;x<p;x+=3){const E=l.getX(x),T=l.getX(x+1),C=l.getX(x+2);r=ia(this,o,e,n,h,u,f,E,T,C),r&&(r.faceIndex=Math.floor(x/3),t.push(r))}}else if(d!==void 0)if(Array.isArray(o))for(let y=0,_=m.length;y<_;y++){const x=m[y],p=o[x.materialIndex],E=Math.max(x.start,g.start),T=Math.min(d.count,Math.min(x.start+x.count,g.start+g.count));for(let C=E,N=T;C<N;C+=3){const L=C,D=C+1,j=C+2;r=ia(this,p,e,n,h,u,f,L,D,j),r&&(r.faceIndex=Math.floor(C/3),r.face.materialIndex=x.materialIndex,t.push(r))}}else{const y=Math.max(0,g.start),_=Math.min(d.count,g.start+g.count);for(let x=y,p=_;x<p;x+=3){const E=x,T=x+1,C=x+2;r=ia(this,o,e,n,h,u,f,E,T,C),r&&(r.faceIndex=Math.floor(x/3),t.push(r))}}}}function sp(i,e,t,n,r,a,o,l){let d;if(e.side===sn?d=n.intersectTriangle(o,a,r,!0,l):d=n.intersectTriangle(r,a,o,e.side===Fi,l),d===null)return null;na.copy(l),na.applyMatrix4(i.matrixWorld);const h=t.ray.origin.distanceTo(na);return h<t.near||h>t.far?null:{distance:h,point:na.clone(),object:i}}function ia(i,e,t,n,r,a,o,l,d,h){i.getVertexPosition(l,Zs),i.getVertexPosition(d,Qs),i.getVertexPosition(h,ea);const u=sp(i,e,t,n,Zs,Qs,ea,Yc);if(u){const f=new k;Rn.getBarycoord(Yc,Zs,Qs,ea,f),r&&(u.uv=Rn.getInterpolatedAttribute(r,l,d,h,f,new He)),a&&(u.uv1=Rn.getInterpolatedAttribute(a,l,d,h,f,new He)),o&&(u.normal=Rn.getInterpolatedAttribute(o,l,d,h,f,new k),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const m={a:l,b:d,c:h,normal:new k,materialIndex:0};Rn.getNormal(Zs,Qs,ea,m.normal),u.face=m,u.barycoord=f}return u}class Ir extends Zt{constructor(e=1,t=1,n=1,r=1,a=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:a,depthSegments:o};const l=this;r=Math.floor(r),a=Math.floor(a),o=Math.floor(o);const d=[],h=[],u=[],f=[];let m=0,g=0;y("z","y","x",-1,-1,n,t,e,o,a,0),y("z","y","x",1,-1,n,t,-e,o,a,1),y("x","z","y",1,1,e,n,t,r,o,2),y("x","z","y",1,-1,e,n,-t,r,o,3),y("x","y","z",1,-1,e,t,n,r,a,4),y("x","y","z",-1,-1,e,t,-n,r,a,5),this.setIndex(d),this.setAttribute("position",new Ct(h,3)),this.setAttribute("normal",new Ct(u,3)),this.setAttribute("uv",new Ct(f,2));function y(_,x,p,E,T,C,N,L,D,j,S){const M=C/D,U=N/j,V=C/2,H=N/2,K=L/2,Q=D+1,J=j+1;let Y=0,le=0;const me=new k;for(let ve=0;ve<J;ve++){const be=ve*U-H;for(let pe=0;pe<Q;pe++){const Ke=pe*M-V;me[_]=Ke*E,me[x]=be*T,me[p]=K,h.push(me.x,me.y,me.z),me[_]=0,me[x]=0,me[p]=L>0?1:-1,u.push(me.x,me.y,me.z),f.push(pe/D),f.push(1-ve/j),Y+=1}}for(let ve=0;ve<j;ve++)for(let be=0;be<D;be++){const pe=m+be+Q*ve,Ke=m+be+Q*(ve+1),nt=m+(be+1)+Q*(ve+1),ut=m+(be+1)+Q*ve;d.push(pe,Ke,ut),d.push(Ke,nt,ut),le+=6}l.addGroup(g,le,S),g+=le,m+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ir(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Nr(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(qe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function tn(i){const e={};for(let t=0;t<i.length;t++){const n=Nr(i[t]);for(const r in n)e[r]=n[r]}return e}function ap(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function ih(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:pt.workingColorSpace}const op={clone:Nr,merge:tn};var lp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,cp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Zn extends Dr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=lp,this.fragmentShader=cp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Nr(e.uniforms),this.uniformsGroups=ap(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class rh extends Xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new At,this.projectionMatrix=new At,this.projectionMatrixInverse=new At,this.coordinateSystem=$n,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Li=new k,Kc=new He,Jc=new He;class bn extends rh{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=gs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ss*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return gs*2*Math.atan(Math.tan(ss*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Li.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Li.x,Li.y).multiplyScalar(-e/Li.z),Li.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Li.x,Li.y).multiplyScalar(-e/Li.z)}getViewSize(e,t){return this.getViewBounds(e,Kc,Jc),t.subVectors(Jc,Kc)}setViewOffset(e,t,n,r,a,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=a,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ss*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,a=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const d=o.fullWidth,h=o.fullHeight;a+=o.offsetX*r/d,t-=o.offsetY*n/h,r*=o.width/d,n*=o.height/h}const l=this.filmOffset;l!==0&&(a+=e*l/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const xr=-90,vr=1;class dp extends Xt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new bn(xr,vr,e,t);r.layers=this.layers,this.add(r);const a=new bn(xr,vr,e,t);a.layers=this.layers,this.add(a);const o=new bn(xr,vr,e,t);o.layers=this.layers,this.add(o);const l=new bn(xr,vr,e,t);l.layers=this.layers,this.add(l);const d=new bn(xr,vr,e,t);d.layers=this.layers,this.add(d);const h=new bn(xr,vr,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,r,a,o,l,d]=t;for(const h of t)this.remove(h);if(e===$n)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),l.up.set(0,1,0),l.lookAt(0,0,1),d.up.set(0,1,0),d.lookAt(0,0,-1);else if(e===ya)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),l.up.set(0,-1,0),l.lookAt(0,0,1),d.up.set(0,-1,0),d.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,o,l,d,h,u]=this.children,f=e.getRenderTarget(),m=e.getActiveCubeFace(),g=e.getActiveMipmapLevel(),y=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,a),e.setRenderTarget(n,1,r),e.render(t,o),e.setRenderTarget(n,2,r),e.render(t,l),e.setRenderTarget(n,3,r),e.render(t,d),e.setRenderTarget(n,4,r),e.render(t,h),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,r),e.render(t,u),e.setRenderTarget(f,m,g),e.xr.enabled=y,n.texture.needsPMREMUpdate=!0}}class sh extends Wt{constructor(e=[],t=Ji,n,r,a,o,l,d,h,u){super(e,t,n,r,a,o,l,d,h,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ah extends Yn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new sh(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Ir(5,5,5),a=new Zn({name:"CubemapFromEquirect",uniforms:Nr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:sn,blending:hi});a.uniforms.tEquirect.value=t;const o=new zt(r,a),l=t.minFilter;return t.minFilter===Yi&&(t.minFilter=Jt),new dp(1,10,this).update(e,o),t.minFilter=l,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){const a=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,r);e.setRenderTarget(a)}}class Sr extends Xt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const hp={type:"move"};class fo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Sr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Sr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new k,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new k),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Sr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new k,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new k),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,a=null,o=null;const l=this._targetRay,d=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){o=!0;for(const _ of e.hand.values()){const x=t.getJointPose(_,n),p=this._getHandJoint(h,_);x!==null&&(p.matrix.fromArray(x.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=x.radius),p.visible=x!==null}const u=h.joints["index-finger-tip"],f=h.joints["thumb-tip"],m=u.position.distanceTo(f.position),g=.02,y=.005;h.inputState.pinching&&m>g+y?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&m<=g-y&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else d!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,n),a!==null&&(d.matrix.fromArray(a.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,a.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(a.linearVelocity)):d.hasLinearVelocity=!1,a.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(a.angularVelocity)):d.hasAngularVelocity=!1));l!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&a!==null&&(r=a),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,this.dispatchEvent(hp)))}return l!==null&&(l.visible=r!==null),d!==null&&(d.visible=a!==null),h!==null&&(h.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Sr;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class up extends Xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Jn,this.environmentIntensity=1,this.environmentRotation=new Jn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class fp extends Wt{constructor(e=null,t=1,n=1,r,a,o,l,d,h=Ht,u=Ht,f,m){super(null,o,l,d,h,u,r,a,f,m),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const po=new k,pp=new k,mp=new tt;class Hn{constructor(e=new k(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const r=po.subVectors(n,t).cross(pp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(po),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return a<0||a>1?null:t.copy(e.start).addScaledVector(n,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||mp.getNormalMatrix(e),r=this.coplanarPoint(po).applyMatrix4(e),a=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Hi=new Ma,gp=new He(.5,.5),ra=new k;class kl{constructor(e=new Hn,t=new Hn,n=new Hn,r=new Hn,a=new Hn,o=new Hn){this.planes=[e,t,n,r,a,o]}set(e,t,n,r,a,o){const l=this.planes;return l[0].copy(e),l[1].copy(t),l[2].copy(n),l[3].copy(r),l[4].copy(a),l[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=$n,n=!1){const r=this.planes,a=e.elements,o=a[0],l=a[1],d=a[2],h=a[3],u=a[4],f=a[5],m=a[6],g=a[7],y=a[8],_=a[9],x=a[10],p=a[11],E=a[12],T=a[13],C=a[14],N=a[15];if(r[0].setComponents(h-o,g-u,p-y,N-E).normalize(),r[1].setComponents(h+o,g+u,p+y,N+E).normalize(),r[2].setComponents(h+l,g+f,p+_,N+T).normalize(),r[3].setComponents(h-l,g-f,p-_,N-T).normalize(),n)r[4].setComponents(d,m,x,C).normalize(),r[5].setComponents(h-d,g-m,p-x,N-C).normalize();else if(r[4].setComponents(h-d,g-m,p-x,N-C).normalize(),t===$n)r[5].setComponents(h+d,g+m,p+x,N+C).normalize();else if(t===ya)r[5].setComponents(d,m,x,C).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Hi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Hi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Hi)}intersectsSprite(e){Hi.center.set(0,0,0);const t=gp.distanceTo(e.center);return Hi.radius=.7071067811865476+t,Hi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Hi)}intersectsSphere(e){const t=this.planes,n=e.center,r=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const r=t[n];if(ra.x=r.normal.x>0?e.max.x:e.min.x,ra.y=r.normal.y>0?e.max.y:e.min.y,ra.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ra)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ol extends Dr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ht(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ba=new k,Sa=new k,Zc=new At,es=new Il,sa=new Ma,mo=new k,Qc=new k;class oh extends Xt{constructor(e=new Zt,t=new Ol){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let r=1,a=t.count;r<a;r++)ba.fromBufferAttribute(t,r-1),Sa.fromBufferAttribute(t,r),n[r]=n[r-1],n[r]+=ba.distanceTo(Sa);e.setAttribute("lineDistance",new Ct(n,1))}else qe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,r=this.matrixWorld,a=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),sa.copy(n.boundingSphere),sa.applyMatrix4(r),sa.radius+=a,e.ray.intersectsSphere(sa)===!1)return;Zc.copy(r).invert(),es.copy(e.ray).applyMatrix4(Zc);const l=a/((this.scale.x+this.scale.y+this.scale.z)/3),d=l*l,h=this.isLineSegments?2:1,u=n.index,m=n.attributes.position;if(u!==null){const g=Math.max(0,o.start),y=Math.min(u.count,o.start+o.count);for(let _=g,x=y-1;_<x;_+=h){const p=u.getX(_),E=u.getX(_+1),T=aa(this,e,es,d,p,E,_);T&&t.push(T)}if(this.isLineLoop){const _=u.getX(y-1),x=u.getX(g),p=aa(this,e,es,d,_,x,y-1);p&&t.push(p)}}else{const g=Math.max(0,o.start),y=Math.min(m.count,o.start+o.count);for(let _=g,x=y-1;_<x;_+=h){const p=aa(this,e,es,d,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){const _=aa(this,e,es,d,y-1,g,y-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=r.length;a<o;a++){const l=r[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=a}}}}}function aa(i,e,t,n,r,a,o){const l=i.geometry.attributes.position;if(ba.fromBufferAttribute(l,r),Sa.fromBufferAttribute(l,a),t.distanceSqToSegment(ba,Sa,mo,Qc)>n)return;mo.applyMatrix4(i.matrixWorld);const h=e.ray.origin.distanceTo(mo);if(!(h<e.near||h>e.far))return{distance:h,point:Qc.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}const ed=new k,td=new k;class xp extends oh{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let r=0,a=t.count;r<a;r+=2)ed.fromBufferAttribute(t,r),td.fromBufferAttribute(t,r+1),n[r]=r===0?0:n[r-1],n[r+1]=n[r]+ed.distanceTo(td);e.setAttribute("lineDistance",new Ct(n,1))}else qe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class vp extends Wt{constructor(e,t,n,r,a,o,l,d,h){super(e,t,n,r,a,o,l,d,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class xs extends Wt{constructor(e,t,n=Kn,r,a,o,l=Ht,d=Ht,h,u=pi,f=1){if(u!==pi&&u!==Ki)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const m={width:e,height:t,depth:f};super(m,r,a,o,l,d,u,n,h),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Dl(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class _p extends xs{constructor(e,t=Kn,n=Ji,r,a,o=Ht,l=Ht,d,h=pi){const u={width:e,height:e,depth:1},f=[u,u,u,u,u,u];super(e,e,t,n,r,a,o,l,d,h),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class lh extends Wt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class jl extends Zt{constructor(e=1,t=1,n=1,r=32,a=1,o=!1,l=0,d=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:a,openEnded:o,thetaStart:l,thetaLength:d};const h=this;r=Math.floor(r),a=Math.floor(a);const u=[],f=[],m=[],g=[];let y=0;const _=[],x=n/2;let p=0;E(),o===!1&&(e>0&&T(!0),t>0&&T(!1)),this.setIndex(u),this.setAttribute("position",new Ct(f,3)),this.setAttribute("normal",new Ct(m,3)),this.setAttribute("uv",new Ct(g,2));function E(){const C=new k,N=new k;let L=0;const D=(t-e)/n;for(let j=0;j<=a;j++){const S=[],M=j/a,U=M*(t-e)+e;for(let V=0;V<=r;V++){const H=V/r,K=H*d+l,Q=Math.sin(K),J=Math.cos(K);N.x=U*Q,N.y=-M*n+x,N.z=U*J,f.push(N.x,N.y,N.z),C.set(Q,D,J).normalize(),m.push(C.x,C.y,C.z),g.push(H,1-M),S.push(y++)}_.push(S)}for(let j=0;j<r;j++)for(let S=0;S<a;S++){const M=_[S][j],U=_[S+1][j],V=_[S+1][j+1],H=_[S][j+1];(e>0||S!==0)&&(u.push(M,U,H),L+=3),(t>0||S!==a-1)&&(u.push(U,V,H),L+=3)}h.addGroup(p,L,0),p+=L}function T(C){const N=y,L=new He,D=new k;let j=0;const S=C===!0?e:t,M=C===!0?1:-1;for(let V=1;V<=r;V++)f.push(0,x*M,0),m.push(0,M,0),g.push(.5,.5),y++;const U=y;for(let V=0;V<=r;V++){const K=V/r*d+l,Q=Math.cos(K),J=Math.sin(K);D.x=S*J,D.y=x*M,D.z=S*Q,f.push(D.x,D.y,D.z),m.push(0,M,0),L.x=Q*.5+.5,L.y=J*.5*M+.5,g.push(L.x,L.y),y++}for(let V=0;V<r;V++){const H=N+V,K=U+V;C===!0?u.push(K,K+1,H):u.push(K+1,K,H),j+=3}h.addGroup(p,j,C===!0?1:2),p+=j}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new jl(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class mi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){qe("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,r=this.getPoint(0),a=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),a+=n.distanceTo(r),t.push(a),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let r=0;const a=n.length;let o;t?o=t:o=e*n[a-1];let l=0,d=a-1,h;for(;l<=d;)if(r=Math.floor(l+(d-l)/2),h=n[r]-o,h<0)l=r+1;else if(h>0)d=r-1;else{d=r;break}if(r=d,n[r]===o)return r/(a-1);const u=n[r],m=n[r+1]-u,g=(o-u)/m;return(r+g)/(a-1)}getTangent(e,t){let r=e-1e-4,a=e+1e-4;r<0&&(r=0),a>1&&(a=1);const o=this.getPoint(r),l=this.getPoint(a),d=t||(o.isVector2?new He:new k);return d.copy(l).sub(o).normalize(),d}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new k,r=[],a=[],o=[],l=new k,d=new At;for(let g=0;g<=e;g++){const y=g/e;r[g]=this.getTangentAt(y,new k)}a[0]=new k,o[0]=new k;let h=Number.MAX_VALUE;const u=Math.abs(r[0].x),f=Math.abs(r[0].y),m=Math.abs(r[0].z);u<=h&&(h=u,n.set(1,0,0)),f<=h&&(h=f,n.set(0,1,0)),m<=h&&n.set(0,0,1),l.crossVectors(r[0],n).normalize(),a[0].crossVectors(r[0],l),o[0].crossVectors(r[0],a[0]);for(let g=1;g<=e;g++){if(a[g]=a[g-1].clone(),o[g]=o[g-1].clone(),l.crossVectors(r[g-1],r[g]),l.length()>Number.EPSILON){l.normalize();const y=Math.acos(at(r[g-1].dot(r[g]),-1,1));a[g].applyMatrix4(d.makeRotationAxis(l,y))}o[g].crossVectors(r[g],a[g])}if(t===!0){let g=Math.acos(at(a[0].dot(a[e]),-1,1));g/=e,r[0].dot(l.crossVectors(a[0],a[e]))>0&&(g=-g);for(let y=1;y<=e;y++)a[y].applyMatrix4(d.makeRotationAxis(r[y],g*y)),o[y].crossVectors(r[y],a[y])}return{tangents:r,normals:a,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class ch extends mi{constructor(e=0,t=0,n=1,r=1,a=0,o=Math.PI*2,l=!1,d=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=a,this.aEndAngle=o,this.aClockwise=l,this.aRotation=d}getPoint(e,t=new He){const n=t,r=Math.PI*2;let a=this.aEndAngle-this.aStartAngle;const o=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=r;for(;a>r;)a-=r;a<Number.EPSILON&&(o?a=0:a=r),this.aClockwise===!0&&!o&&(a===r?a=-r:a=a-r);const l=this.aStartAngle+e*a;let d=this.aX+this.xRadius*Math.cos(l),h=this.aY+this.yRadius*Math.sin(l);if(this.aRotation!==0){const u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),m=d-this.aX,g=h-this.aY;d=m*u-g*f+this.aX,h=m*f+g*u+this.aY}return n.set(d,h)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class yp extends ch{constructor(e,t,n,r,a,o){super(e,t,n,n,r,a,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Bl(){let i=0,e=0,t=0,n=0;function r(a,o,l,d){i=a,e=l,t=-3*a+3*o-2*l-d,n=2*a-2*o+l+d}return{initCatmullRom:function(a,o,l,d,h){r(o,l,h*(l-a),h*(d-o))},initNonuniformCatmullRom:function(a,o,l,d,h,u,f){let m=(o-a)/h-(l-a)/(h+u)+(l-o)/u,g=(l-o)/u-(d-o)/(u+f)+(d-l)/f;m*=u,g*=u,r(o,l,m,g)},calc:function(a){const o=a*a,l=o*a;return i+e*a+t*o+n*l}}}const oa=new k,go=new Bl,xo=new Bl,vo=new Bl;class dh extends mi{constructor(e=[],t=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new k){const n=t,r=this.points,a=r.length,o=(a-(this.closed?0:1))*e;let l=Math.floor(o),d=o-l;this.closed?l+=l>0?0:(Math.floor(Math.abs(l)/a)+1)*a:d===0&&l===a-1&&(l=a-2,d=1);let h,u;this.closed||l>0?h=r[(l-1)%a]:(oa.subVectors(r[0],r[1]).add(r[0]),h=oa);const f=r[l%a],m=r[(l+1)%a];if(this.closed||l+2<a?u=r[(l+2)%a]:(oa.subVectors(r[a-1],r[a-2]).add(r[a-1]),u=oa),this.curveType==="centripetal"||this.curveType==="chordal"){const g=this.curveType==="chordal"?.5:.25;let y=Math.pow(h.distanceToSquared(f),g),_=Math.pow(f.distanceToSquared(m),g),x=Math.pow(m.distanceToSquared(u),g);_<1e-4&&(_=1),y<1e-4&&(y=_),x<1e-4&&(x=_),go.initNonuniformCatmullRom(h.x,f.x,m.x,u.x,y,_,x),xo.initNonuniformCatmullRom(h.y,f.y,m.y,u.y,y,_,x),vo.initNonuniformCatmullRom(h.z,f.z,m.z,u.z,y,_,x)}else this.curveType==="catmullrom"&&(go.initCatmullRom(h.x,f.x,m.x,u.x,this.tension),xo.initCatmullRom(h.y,f.y,m.y,u.y,this.tension),vo.initCatmullRom(h.z,f.z,m.z,u.z,this.tension));return n.set(go.calc(d),xo.calc(d),vo.calc(d)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(new k().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function nd(i,e,t,n,r){const a=(n-e)*.5,o=(r-t)*.5,l=i*i,d=i*l;return(2*t-2*n+a+o)*d+(-3*t+3*n-2*a-o)*l+a*i+t}function bp(i,e){const t=1-i;return t*t*e}function Sp(i,e){return 2*(1-i)*i*e}function wp(i,e){return i*i*e}function os(i,e,t,n){return bp(i,e)+Sp(i,t)+wp(i,n)}function Mp(i,e){const t=1-i;return t*t*t*e}function Ep(i,e){const t=1-i;return 3*t*t*i*e}function Tp(i,e){return 3*(1-i)*i*i*e}function Ap(i,e){return i*i*i*e}function ls(i,e,t,n,r){return Mp(i,e)+Ep(i,t)+Tp(i,n)+Ap(i,r)}class Cp extends mi{constructor(e=new He,t=new He,n=new He,r=new He){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new He){const n=t,r=this.v0,a=this.v1,o=this.v2,l=this.v3;return n.set(ls(e,r.x,a.x,o.x,l.x),ls(e,r.y,a.y,o.y,l.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Np extends mi{constructor(e=new k,t=new k,n=new k,r=new k){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new k){const n=t,r=this.v0,a=this.v1,o=this.v2,l=this.v3;return n.set(ls(e,r.x,a.x,o.x,l.x),ls(e,r.y,a.y,o.y,l.y),ls(e,r.z,a.z,o.z,l.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Rp extends mi{constructor(e=new He,t=new He){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new He){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new He){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Pp extends mi{constructor(e=new k,t=new k){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new k){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new k){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Lp extends mi{constructor(e=new He,t=new He,n=new He){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new He){const n=t,r=this.v0,a=this.v1,o=this.v2;return n.set(os(e,r.x,a.x,o.x),os(e,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class hh extends mi{constructor(e=new k,t=new k,n=new k){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new k){const n=t,r=this.v0,a=this.v1,o=this.v2;return n.set(os(e,r.x,a.x,o.x),os(e,r.y,a.y,o.y),os(e,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Dp extends mi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new He){const n=t,r=this.points,a=(r.length-1)*e,o=Math.floor(a),l=a-o,d=r[o===0?o:o-1],h=r[o],u=r[o>r.length-2?r.length-1:o+1],f=r[o>r.length-3?r.length-1:o+2];return n.set(nd(l,d.x,h.x,u.x,f.x),nd(l,d.y,h.y,u.y,f.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(new He().fromArray(r))}return this}}var Ip=Object.freeze({__proto__:null,ArcCurve:yp,CatmullRomCurve3:dh,CubicBezierCurve:Cp,CubicBezierCurve3:Np,EllipseCurve:ch,LineCurve:Rp,LineCurve3:Pp,QuadraticBezierCurve:Lp,QuadraticBezierCurve3:hh,SplineCurve:Dp});class Rr extends Zt{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};const a=e/2,o=t/2,l=Math.floor(n),d=Math.floor(r),h=l+1,u=d+1,f=e/l,m=t/d,g=[],y=[],_=[],x=[];for(let p=0;p<u;p++){const E=p*m-o;for(let T=0;T<h;T++){const C=T*f-a;y.push(C,-E,0),_.push(0,0,1),x.push(T/l),x.push(1-p/d)}}for(let p=0;p<d;p++)for(let E=0;E<l;E++){const T=E+h*p,C=E+h*(p+1),N=E+1+h*(p+1),L=E+1+h*p;g.push(T,C,L),g.push(C,N,L)}this.setIndex(g),this.setAttribute("position",new Ct(y,3)),this.setAttribute("normal",new Ct(_,3)),this.setAttribute("uv",new Ct(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Rr(e.width,e.height,e.widthSegments,e.heightSegments)}}class cs extends Zt{constructor(e=1,t=32,n=16,r=0,a=Math.PI*2,o=0,l=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:a,thetaStart:o,thetaLength:l},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const d=Math.min(o+l,Math.PI);let h=0;const u=[],f=new k,m=new k,g=[],y=[],_=[],x=[];for(let p=0;p<=n;p++){const E=[],T=p/n;let C=0;p===0&&o===0?C=.5/t:p===n&&d===Math.PI&&(C=-.5/t);for(let N=0;N<=t;N++){const L=N/t;f.x=-e*Math.cos(r+L*a)*Math.sin(o+T*l),f.y=e*Math.cos(o+T*l),f.z=e*Math.sin(r+L*a)*Math.sin(o+T*l),y.push(f.x,f.y,f.z),m.copy(f).normalize(),_.push(m.x,m.y,m.z),x.push(L+C,1-T),E.push(h++)}u.push(E)}for(let p=0;p<n;p++)for(let E=0;E<t;E++){const T=u[p][E+1],C=u[p][E],N=u[p+1][E],L=u[p+1][E+1];(p!==0||o>0)&&g.push(T,C,L),(p!==n-1||d<Math.PI)&&g.push(C,N,L)}this.setIndex(g),this.setAttribute("position",new Ct(y,3)),this.setAttribute("normal",new Ct(_,3)),this.setAttribute("uv",new Ct(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cs(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class zl extends Zt{constructor(e=1,t=.4,n=12,r=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:a},n=Math.floor(n),r=Math.floor(r);const o=[],l=[],d=[],h=[],u=new k,f=new k,m=new k;for(let g=0;g<=n;g++)for(let y=0;y<=r;y++){const _=y/r*a,x=g/n*Math.PI*2;f.x=(e+t*Math.cos(x))*Math.cos(_),f.y=(e+t*Math.cos(x))*Math.sin(_),f.z=t*Math.sin(x),l.push(f.x,f.y,f.z),u.x=e*Math.cos(_),u.y=e*Math.sin(_),m.subVectors(f,u).normalize(),d.push(m.x,m.y,m.z),h.push(y/r),h.push(g/n)}for(let g=1;g<=n;g++)for(let y=1;y<=r;y++){const _=(r+1)*g+y-1,x=(r+1)*(g-1)+y-1,p=(r+1)*(g-1)+y,E=(r+1)*g+y;o.push(_,x,E),o.push(x,p,E)}this.setIndex(o),this.setAttribute("position",new Ct(l,3)),this.setAttribute("normal",new Ct(d,3)),this.setAttribute("uv",new Ct(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zl(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Gl extends Zt{constructor(e=new hh(new k(-1,-1,0),new k(-1,1,0),new k(1,1,0)),t=64,n=1,r=8,a=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:r,closed:a};const o=e.computeFrenetFrames(t,a);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const l=new k,d=new k,h=new He;let u=new k;const f=[],m=[],g=[],y=[];_(),this.setIndex(y),this.setAttribute("position",new Ct(f,3)),this.setAttribute("normal",new Ct(m,3)),this.setAttribute("uv",new Ct(g,2));function _(){for(let T=0;T<t;T++)x(T);x(a===!1?t:0),E(),p()}function x(T){u=e.getPointAt(T/t,u);const C=o.normals[T],N=o.binormals[T];for(let L=0;L<=r;L++){const D=L/r*Math.PI*2,j=Math.sin(D),S=-Math.cos(D);d.x=S*C.x+j*N.x,d.y=S*C.y+j*N.y,d.z=S*C.z+j*N.z,d.normalize(),m.push(d.x,d.y,d.z),l.x=u.x+n*d.x,l.y=u.y+n*d.y,l.z=u.z+n*d.z,f.push(l.x,l.y,l.z)}}function p(){for(let T=1;T<=t;T++)for(let C=1;C<=r;C++){const N=(r+1)*(T-1)+(C-1),L=(r+1)*T+(C-1),D=(r+1)*T+C,j=(r+1)*(T-1)+C;y.push(N,L,j),y.push(L,D,j)}}function E(){for(let T=0;T<=t;T++)for(let C=0;C<=r;C++)h.x=T/t,h.y=C/r,g.push(h.x,h.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new Gl(new Ip[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class Up extends Zn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Di extends Dr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ht(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ht(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Jd,this.normalScale=new He(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Fp extends Dr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=xf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class kp extends Dr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const _o={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class Op{constructor(e,t,n){const r=this;let a=!1,o=0,l=0,d;const h=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){l++,a===!1&&r.onStart!==void 0&&r.onStart(u,o,l),a=!0},this.itemEnd=function(u){o++,r.onProgress!==void 0&&r.onProgress(u,o,l),o===l&&(a=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return d?d(u):u},this.setURLModifier=function(u){return d=u,this},this.addHandler=function(u,f){return h.push(u,f),this},this.removeHandler=function(u){const f=h.indexOf(u);return f!==-1&&h.splice(f,2),this},this.getHandler=function(u){for(let f=0,m=h.length;f<m;f+=2){const g=h[f],y=h[f+1];if(g.global&&(g.lastIndex=0),g.test(u))return y}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const jp=new Op;class Vl{constructor(e){this.manager=e!==void 0?e:jp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(r,a){n.load(e,r,t,a)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Vl.DEFAULT_MATERIAL_NAME="__DEFAULT";const _r=new WeakMap;class Bp extends Vl{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const a=this,o=_o.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)a.manager.itemStart(e),setTimeout(function(){t&&t(o),a.manager.itemEnd(e)},0);else{let f=_r.get(o);f===void 0&&(f=[],_r.set(o,f)),f.push({onLoad:t,onError:r})}return o}const l=ps("img");function d(){u(),t&&t(this);const f=_r.get(this)||[];for(let m=0;m<f.length;m++){const g=f[m];g.onLoad&&g.onLoad(this)}_r.delete(this),a.manager.itemEnd(e)}function h(f){u(),r&&r(f),_o.remove(`image:${e}`);const m=_r.get(this)||[];for(let g=0;g<m.length;g++){const y=m[g];y.onError&&y.onError(f)}_r.delete(this),a.manager.itemError(e),a.manager.itemEnd(e)}function u(){l.removeEventListener("load",d,!1),l.removeEventListener("error",h,!1)}return l.addEventListener("load",d,!1),l.addEventListener("error",h,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(l.crossOrigin=this.crossOrigin),_o.add(`image:${e}`,l),a.manager.itemStart(e),l.src=e,l}}class zp extends Vl{constructor(e){super(e)}load(e,t,n,r){const a=new Wt,o=new Bp(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(l){a.image=l,a.needsUpdate=!0,t!==void 0&&t(a)},n,r),a}}class uh extends Xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ht(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}const yo=new At,id=new k,rd=new k;class Gp{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new He(512,512),this.mapType=un,this.map=null,this.mapPass=null,this.matrix=new At,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new kl,this._frameExtents=new He(1,1),this._viewportCount=1,this._viewports=[new Pt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;id.setFromMatrixPosition(e.matrixWorld),t.position.copy(id),rd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(rd),t.updateMatrixWorld(),yo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(yo,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(yo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Hl extends rh{constructor(e=-1,t=1,n=1,r=-1,a=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=a,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,a,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=a,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let a=n-e,o=n+e,l=r+t,d=r-t;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=h*this.view.offsetX,o=a+h*this.view.width,l-=u*this.view.offsetY,d=l-u*this.view.height}this.projectionMatrix.makeOrthographic(a,o,l,d,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Vp extends Gp{constructor(){super(new Hl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Hp extends uh{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Xt.DEFAULT_UP),this.updateMatrix(),this.target=new Xt,this.shadow=new Vp}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class Wp extends uh{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Xp extends bn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const sd=new At;class $p{constructor(e,t,n=0,r=1/0){this.ray=new Il(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new Ul,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):ft("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return sd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(sd),this}intersectObject(e,t=!0,n=[]){return yl(e,this,n,t),n.sort(ad),n}intersectObjects(e,t=!0,n=[]){for(let r=0,a=e.length;r<a;r++)yl(e[r],this,n,t);return n.sort(ad),n}}function ad(i,e){return i.distance-e.distance}function yl(i,e,t,n){let r=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(r=!1),r===!0&&n===!0){const a=i.children;for(let o=0,l=a.length;o<l;o++)yl(a[o],e,t,!0)}}class qp extends xp{constructor(e=10,t=10,n=4473924,r=8947848){n=new ht(n),r=new ht(r);const a=t/2,o=e/t,l=e/2,d=[],h=[];for(let m=0,g=0,y=-l;m<=t;m++,y+=o){d.push(-l,0,y,l,0,y),d.push(y,0,-l,y,0,l);const _=m===a?n:r;_.toArray(h,g),g+=3,_.toArray(h,g),g+=3,_.toArray(h,g),g+=3,_.toArray(h,g),g+=3}const u=new Zt;u.setAttribute("position",new Ct(d,3)),u.setAttribute("color",new Ct(h,3));const f=new Ol({vertexColors:!0,toneMapped:!1});super(u,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}function od(i,e,t,n){const r=Yp(n);switch(t){case qd:return i*e;case Kd:return i*e/r.components*r.byteLength;case Al:return i*e/r.components*r.byteLength;case Ar:return i*e*2/r.components*r.byteLength;case Cl:return i*e*2/r.components*r.byteLength;case Yd:return i*e*3/r.components*r.byteLength;case Pn:return i*e*4/r.components*r.byteLength;case Nl:return i*e*4/r.components*r.byteLength;case pa:case ma:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ga:case xa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Vo:case Wo:return Math.max(i,16)*Math.max(e,8)/4;case Go:case Ho:return Math.max(i,8)*Math.max(e,8)/2;case Xo:case $o:case Yo:case Ko:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case qo:case Jo:case Zo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Qo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case el:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case tl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case nl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case il:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case rl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case sl:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case al:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case ol:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case ll:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case cl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case dl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case hl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case ul:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case fl:case pl:case ml:return Math.ceil(i/4)*Math.ceil(e/4)*16;case gl:case xl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case vl:case _l:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Yp(i){switch(i){case un:case Hd:return{byteLength:1,components:1};case us:case Wd:case fi:return{byteLength:2,components:1};case El:case Tl:return{byteLength:2,components:4};case Kn:case Ml:case Xn:return{byteLength:4,components:1};case Xd:case $d:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:wl}}));typeof window<"u"&&(window.__THREE__?qe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=wl);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function fh(){let i=null,e=!1,t=null,n=null;function r(a,o){t(a,o),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){i=a}}}function Kp(i){const e=new WeakMap;function t(l,d){const h=l.array,u=l.usage,f=h.byteLength,m=i.createBuffer();i.bindBuffer(d,m),i.bufferData(d,h,u),l.onUploadCallback();let g;if(h instanceof Float32Array)g=i.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)g=i.HALF_FLOAT;else if(h instanceof Uint16Array)l.isFloat16BufferAttribute?g=i.HALF_FLOAT:g=i.UNSIGNED_SHORT;else if(h instanceof Int16Array)g=i.SHORT;else if(h instanceof Uint32Array)g=i.UNSIGNED_INT;else if(h instanceof Int32Array)g=i.INT;else if(h instanceof Int8Array)g=i.BYTE;else if(h instanceof Uint8Array)g=i.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)g=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:m,type:g,bytesPerElement:h.BYTES_PER_ELEMENT,version:l.version,size:f}}function n(l,d,h){const u=d.array,f=d.updateRanges;if(i.bindBuffer(h,l),f.length===0)i.bufferSubData(h,0,u);else{f.sort((g,y)=>g.start-y.start);let m=0;for(let g=1;g<f.length;g++){const y=f[m],_=f[g];_.start<=y.start+y.count+1?y.count=Math.max(y.count,_.start+_.count-y.start):(++m,f[m]=_)}f.length=m+1;for(let g=0,y=f.length;g<y;g++){const _=f[g];i.bufferSubData(h,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}d.clearUpdateRanges()}d.onUploadCallback()}function r(l){return l.isInterleavedBufferAttribute&&(l=l.data),e.get(l)}function a(l){l.isInterleavedBufferAttribute&&(l=l.data);const d=e.get(l);d&&(i.deleteBuffer(d.buffer),e.delete(l))}function o(l,d){if(l.isInterleavedBufferAttribute&&(l=l.data),l.isGLBufferAttribute){const u=e.get(l);(!u||u.version<l.version)&&e.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}const h=e.get(l);if(h===void 0)e.set(l,t(l,d));else if(h.version<l.version){if(h.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(h.buffer,l,d),h.version=l.version}}return{get:r,remove:a,update:o}}var Jp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Zp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Qp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,em=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,tm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,nm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,im=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,rm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,sm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,am=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,om=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,lm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,cm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,dm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,hm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,um=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,fm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,pm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,mm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,gm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,xm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,vm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,_m=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,ym=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,bm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Sm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,wm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Mm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Em=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Tm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Am="gl_FragColor = linearToOutputTexel( gl_FragColor );",Cm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Nm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Rm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Pm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Lm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Dm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Im=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Um=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Fm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,km=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Om=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,jm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Bm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,zm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Gm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Vm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Hm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Wm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Xm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,$m=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,qm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Ym=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( vec3( 1.0 ) - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Km=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Jm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Zm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Qm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,eg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,tg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ng=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ig=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,rg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,sg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ag=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,og=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,lg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,cg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,dg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,hg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ug=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,fg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,pg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,mg=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,gg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,xg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,_g=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,yg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,bg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Sg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,wg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Mg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Eg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Tg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ag=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Cg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ng=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Rg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Pg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Lg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 0, 5, phi ).x + bitangent * vogelDiskSample( 0, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 1, 5, phi ).x + bitangent * vogelDiskSample( 1, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 2, 5, phi ).x + bitangent * vogelDiskSample( 2, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 3, 5, phi ).x + bitangent * vogelDiskSample( 3, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 4, 5, phi ).x + bitangent * vogelDiskSample( 4, 5, phi ).y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadow = step( depth, dp );
			#else
				shadow = step( dp, depth );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Dg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ig=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Ug=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Fg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,kg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Og=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,jg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Bg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,zg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Gg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Vg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Hg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Wg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Xg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,$g=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,qg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Yg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Kg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Jg=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Qg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,e0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,t0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,n0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,i0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,r0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,s0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,a0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,o0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,l0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,c0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,d0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,h0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,u0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,f0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,p0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,m0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,g0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,x0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,v0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,y0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,b0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,S0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,w0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,M0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,E0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,T0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,A0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,C0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,N0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,st={alphahash_fragment:Jp,alphahash_pars_fragment:Zp,alphamap_fragment:Qp,alphamap_pars_fragment:em,alphatest_fragment:tm,alphatest_pars_fragment:nm,aomap_fragment:im,aomap_pars_fragment:rm,batching_pars_vertex:sm,batching_vertex:am,begin_vertex:om,beginnormal_vertex:lm,bsdfs:cm,iridescence_fragment:dm,bumpmap_pars_fragment:hm,clipping_planes_fragment:um,clipping_planes_pars_fragment:fm,clipping_planes_pars_vertex:pm,clipping_planes_vertex:mm,color_fragment:gm,color_pars_fragment:xm,color_pars_vertex:vm,color_vertex:_m,common:ym,cube_uv_reflection_fragment:bm,defaultnormal_vertex:Sm,displacementmap_pars_vertex:wm,displacementmap_vertex:Mm,emissivemap_fragment:Em,emissivemap_pars_fragment:Tm,colorspace_fragment:Am,colorspace_pars_fragment:Cm,envmap_fragment:Nm,envmap_common_pars_fragment:Rm,envmap_pars_fragment:Pm,envmap_pars_vertex:Lm,envmap_physical_pars_fragment:Vm,envmap_vertex:Dm,fog_vertex:Im,fog_pars_vertex:Um,fog_fragment:Fm,fog_pars_fragment:km,gradientmap_pars_fragment:Om,lightmap_pars_fragment:jm,lights_lambert_fragment:Bm,lights_lambert_pars_fragment:zm,lights_pars_begin:Gm,lights_toon_fragment:Hm,lights_toon_pars_fragment:Wm,lights_phong_fragment:Xm,lights_phong_pars_fragment:$m,lights_physical_fragment:qm,lights_physical_pars_fragment:Ym,lights_fragment_begin:Km,lights_fragment_maps:Jm,lights_fragment_end:Zm,logdepthbuf_fragment:Qm,logdepthbuf_pars_fragment:eg,logdepthbuf_pars_vertex:tg,logdepthbuf_vertex:ng,map_fragment:ig,map_pars_fragment:rg,map_particle_fragment:sg,map_particle_pars_fragment:ag,metalnessmap_fragment:og,metalnessmap_pars_fragment:lg,morphinstance_vertex:cg,morphcolor_vertex:dg,morphnormal_vertex:hg,morphtarget_pars_vertex:ug,morphtarget_vertex:fg,normal_fragment_begin:pg,normal_fragment_maps:mg,normal_pars_fragment:gg,normal_pars_vertex:xg,normal_vertex:vg,normalmap_pars_fragment:_g,clearcoat_normal_fragment_begin:yg,clearcoat_normal_fragment_maps:bg,clearcoat_pars_fragment:Sg,iridescence_pars_fragment:wg,opaque_fragment:Mg,packing:Eg,premultiplied_alpha_fragment:Tg,project_vertex:Ag,dithering_fragment:Cg,dithering_pars_fragment:Ng,roughnessmap_fragment:Rg,roughnessmap_pars_fragment:Pg,shadowmap_pars_fragment:Lg,shadowmap_pars_vertex:Dg,shadowmap_vertex:Ig,shadowmask_pars_fragment:Ug,skinbase_vertex:Fg,skinning_pars_vertex:kg,skinning_vertex:Og,skinnormal_vertex:jg,specularmap_fragment:Bg,specularmap_pars_fragment:zg,tonemapping_fragment:Gg,tonemapping_pars_fragment:Vg,transmission_fragment:Hg,transmission_pars_fragment:Wg,uv_pars_fragment:Xg,uv_pars_vertex:$g,uv_vertex:qg,worldpos_vertex:Yg,background_vert:Kg,background_frag:Jg,backgroundCube_vert:Zg,backgroundCube_frag:Qg,cube_vert:e0,cube_frag:t0,depth_vert:n0,depth_frag:i0,distance_vert:r0,distance_frag:s0,equirect_vert:a0,equirect_frag:o0,linedashed_vert:l0,linedashed_frag:c0,meshbasic_vert:d0,meshbasic_frag:h0,meshlambert_vert:u0,meshlambert_frag:f0,meshmatcap_vert:p0,meshmatcap_frag:m0,meshnormal_vert:g0,meshnormal_frag:x0,meshphong_vert:v0,meshphong_frag:_0,meshphysical_vert:y0,meshphysical_frag:b0,meshtoon_vert:S0,meshtoon_frag:w0,points_vert:M0,points_frag:E0,shadow_vert:T0,shadow_frag:A0,sprite_vert:C0,sprite_frag:N0},Ae={common:{diffuse:{value:new ht(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new tt}},envmap:{envMap:{value:null},envMapRotation:{value:new tt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new tt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new tt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new tt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new tt},normalScale:{value:new He(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new tt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new tt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new tt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new tt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ht(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ht(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0},uvTransform:{value:new tt}},sprite:{diffuse:{value:new ht(16777215)},opacity:{value:1},center:{value:new He(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}}},Wn={basic:{uniforms:tn([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.fog]),vertexShader:st.meshbasic_vert,fragmentShader:st.meshbasic_frag},lambert:{uniforms:tn([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,Ae.lights,{emissive:{value:new ht(0)}}]),vertexShader:st.meshlambert_vert,fragmentShader:st.meshlambert_frag},phong:{uniforms:tn([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,Ae.lights,{emissive:{value:new ht(0)},specular:{value:new ht(1118481)},shininess:{value:30}}]),vertexShader:st.meshphong_vert,fragmentShader:st.meshphong_frag},standard:{uniforms:tn([Ae.common,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.roughnessmap,Ae.metalnessmap,Ae.fog,Ae.lights,{emissive:{value:new ht(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:st.meshphysical_vert,fragmentShader:st.meshphysical_frag},toon:{uniforms:tn([Ae.common,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.gradientmap,Ae.fog,Ae.lights,{emissive:{value:new ht(0)}}]),vertexShader:st.meshtoon_vert,fragmentShader:st.meshtoon_frag},matcap:{uniforms:tn([Ae.common,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,{matcap:{value:null}}]),vertexShader:st.meshmatcap_vert,fragmentShader:st.meshmatcap_frag},points:{uniforms:tn([Ae.points,Ae.fog]),vertexShader:st.points_vert,fragmentShader:st.points_frag},dashed:{uniforms:tn([Ae.common,Ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:st.linedashed_vert,fragmentShader:st.linedashed_frag},depth:{uniforms:tn([Ae.common,Ae.displacementmap]),vertexShader:st.depth_vert,fragmentShader:st.depth_frag},normal:{uniforms:tn([Ae.common,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,{opacity:{value:1}}]),vertexShader:st.meshnormal_vert,fragmentShader:st.meshnormal_frag},sprite:{uniforms:tn([Ae.sprite,Ae.fog]),vertexShader:st.sprite_vert,fragmentShader:st.sprite_frag},background:{uniforms:{uvTransform:{value:new tt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:st.background_vert,fragmentShader:st.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new tt}},vertexShader:st.backgroundCube_vert,fragmentShader:st.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:st.cube_vert,fragmentShader:st.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:st.equirect_vert,fragmentShader:st.equirect_frag},distance:{uniforms:tn([Ae.common,Ae.displacementmap,{referencePosition:{value:new k},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:st.distance_vert,fragmentShader:st.distance_frag},shadow:{uniforms:tn([Ae.lights,Ae.fog,{color:{value:new ht(0)},opacity:{value:1}}]),vertexShader:st.shadow_vert,fragmentShader:st.shadow_frag}};Wn.physical={uniforms:tn([Wn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new tt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new tt},clearcoatNormalScale:{value:new He(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new tt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new tt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new tt},sheen:{value:0},sheenColor:{value:new ht(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new tt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new tt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new tt},transmissionSamplerSize:{value:new He},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new tt},attenuationDistance:{value:0},attenuationColor:{value:new ht(0)},specularColor:{value:new ht(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new tt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new tt},anisotropyVector:{value:new He},anisotropyMap:{value:null},anisotropyMapTransform:{value:new tt}}]),vertexShader:st.meshphysical_vert,fragmentShader:st.meshphysical_frag};const la={r:0,b:0,g:0},Wi=new Jn,R0=new At;function P0(i,e,t,n,r,a,o){const l=new ht(0);let d=a===!0?0:1,h,u,f=null,m=0,g=null;function y(T){let C=T.isScene===!0?T.background:null;return C&&C.isTexture&&(C=(T.backgroundBlurriness>0?t:e).get(C)),C}function _(T){let C=!1;const N=y(T);N===null?p(l,d):N&&N.isColor&&(p(N,1),C=!0);const L=i.xr.getEnvironmentBlendMode();L==="additive"?n.buffers.color.setClear(0,0,0,1,o):L==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||C)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(T,C){const N=y(C);N&&(N.isCubeTexture||N.mapping===wa)?(u===void 0&&(u=new zt(new Ir(1,1,1),new Zn({name:"BackgroundCubeMaterial",uniforms:Nr(Wn.backgroundCube.uniforms),vertexShader:Wn.backgroundCube.vertexShader,fragmentShader:Wn.backgroundCube.fragmentShader,side:sn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(L,D,j){this.matrixWorld.copyPosition(j.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Wi.copy(C.backgroundRotation),Wi.x*=-1,Wi.y*=-1,Wi.z*=-1,N.isCubeTexture&&N.isRenderTargetTexture===!1&&(Wi.y*=-1,Wi.z*=-1),u.material.uniforms.envMap.value=N,u.material.uniforms.flipEnvMap.value=N.isCubeTexture&&N.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=C.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=C.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(R0.makeRotationFromEuler(Wi)),u.material.toneMapped=pt.getTransfer(N.colorSpace)!==bt,(f!==N||m!==N.version||g!==i.toneMapping)&&(u.material.needsUpdate=!0,f=N,m=N.version,g=i.toneMapping),u.layers.enableAll(),T.unshift(u,u.geometry,u.material,0,0,null)):N&&N.isTexture&&(h===void 0&&(h=new zt(new Rr(2,2),new Zn({name:"BackgroundMaterial",uniforms:Nr(Wn.background.uniforms),vertexShader:Wn.background.vertexShader,fragmentShader:Wn.background.fragmentShader,side:Fi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(h)),h.material.uniforms.t2D.value=N,h.material.uniforms.backgroundIntensity.value=C.backgroundIntensity,h.material.toneMapped=pt.getTransfer(N.colorSpace)!==bt,N.matrixAutoUpdate===!0&&N.updateMatrix(),h.material.uniforms.uvTransform.value.copy(N.matrix),(f!==N||m!==N.version||g!==i.toneMapping)&&(h.material.needsUpdate=!0,f=N,m=N.version,g=i.toneMapping),h.layers.enableAll(),T.unshift(h,h.geometry,h.material,0,0,null))}function p(T,C){T.getRGB(la,ih(i)),n.buffers.color.setClear(la.r,la.g,la.b,C,o)}function E(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0)}return{getClearColor:function(){return l},setClearColor:function(T,C=1){l.set(T),d=C,p(l,d)},getClearAlpha:function(){return d},setClearAlpha:function(T){d=T,p(l,d)},render:_,addToRenderList:x,dispose:E}}function L0(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=m(null);let a=r,o=!1;function l(M,U,V,H,K){let Q=!1;const J=f(H,V,U);a!==J&&(a=J,h(a.object)),Q=g(M,H,V,K),Q&&y(M,H,V,K),K!==null&&e.update(K,i.ELEMENT_ARRAY_BUFFER),(Q||o)&&(o=!1,C(M,U,V,H),K!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(K).buffer))}function d(){return i.createVertexArray()}function h(M){return i.bindVertexArray(M)}function u(M){return i.deleteVertexArray(M)}function f(M,U,V){const H=V.wireframe===!0;let K=n[M.id];K===void 0&&(K={},n[M.id]=K);let Q=K[U.id];Q===void 0&&(Q={},K[U.id]=Q);let J=Q[H];return J===void 0&&(J=m(d()),Q[H]=J),J}function m(M){const U=[],V=[],H=[];for(let K=0;K<t;K++)U[K]=0,V[K]=0,H[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:V,attributeDivisors:H,object:M,attributes:{},index:null}}function g(M,U,V,H){const K=a.attributes,Q=U.attributes;let J=0;const Y=V.getAttributes();for(const le in Y)if(Y[le].location>=0){const ve=K[le];let be=Q[le];if(be===void 0&&(le==="instanceMatrix"&&M.instanceMatrix&&(be=M.instanceMatrix),le==="instanceColor"&&M.instanceColor&&(be=M.instanceColor)),ve===void 0||ve.attribute!==be||be&&ve.data!==be.data)return!0;J++}return a.attributesNum!==J||a.index!==H}function y(M,U,V,H){const K={},Q=U.attributes;let J=0;const Y=V.getAttributes();for(const le in Y)if(Y[le].location>=0){let ve=Q[le];ve===void 0&&(le==="instanceMatrix"&&M.instanceMatrix&&(ve=M.instanceMatrix),le==="instanceColor"&&M.instanceColor&&(ve=M.instanceColor));const be={};be.attribute=ve,ve&&ve.data&&(be.data=ve.data),K[le]=be,J++}a.attributes=K,a.attributesNum=J,a.index=H}function _(){const M=a.newAttributes;for(let U=0,V=M.length;U<V;U++)M[U]=0}function x(M){p(M,0)}function p(M,U){const V=a.newAttributes,H=a.enabledAttributes,K=a.attributeDivisors;V[M]=1,H[M]===0&&(i.enableVertexAttribArray(M),H[M]=1),K[M]!==U&&(i.vertexAttribDivisor(M,U),K[M]=U)}function E(){const M=a.newAttributes,U=a.enabledAttributes;for(let V=0,H=U.length;V<H;V++)U[V]!==M[V]&&(i.disableVertexAttribArray(V),U[V]=0)}function T(M,U,V,H,K,Q,J){J===!0?i.vertexAttribIPointer(M,U,V,K,Q):i.vertexAttribPointer(M,U,V,H,K,Q)}function C(M,U,V,H){_();const K=H.attributes,Q=V.getAttributes(),J=U.defaultAttributeValues;for(const Y in Q){const le=Q[Y];if(le.location>=0){let me=K[Y];if(me===void 0&&(Y==="instanceMatrix"&&M.instanceMatrix&&(me=M.instanceMatrix),Y==="instanceColor"&&M.instanceColor&&(me=M.instanceColor)),me!==void 0){const ve=me.normalized,be=me.itemSize,pe=e.get(me);if(pe===void 0)continue;const Ke=pe.buffer,nt=pe.type,ut=pe.bytesPerElement,te=nt===i.INT||nt===i.UNSIGNED_INT||me.gpuType===Ml;if(me.isInterleavedBufferAttribute){const oe=me.data,Ne=oe.stride,Ye=me.offset;if(oe.isInstancedInterleavedBuffer){for(let Ce=0;Ce<le.locationSize;Ce++)p(le.location+Ce,oe.meshPerAttribute);M.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let Ce=0;Ce<le.locationSize;Ce++)x(le.location+Ce);i.bindBuffer(i.ARRAY_BUFFER,Ke);for(let Ce=0;Ce<le.locationSize;Ce++)T(le.location+Ce,be/le.locationSize,nt,ve,Ne*ut,(Ye+be/le.locationSize*Ce)*ut,te)}else{if(me.isInstancedBufferAttribute){for(let oe=0;oe<le.locationSize;oe++)p(le.location+oe,me.meshPerAttribute);M.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=me.meshPerAttribute*me.count)}else for(let oe=0;oe<le.locationSize;oe++)x(le.location+oe);i.bindBuffer(i.ARRAY_BUFFER,Ke);for(let oe=0;oe<le.locationSize;oe++)T(le.location+oe,be/le.locationSize,nt,ve,be*ut,be/le.locationSize*oe*ut,te)}}else if(J!==void 0){const ve=J[Y];if(ve!==void 0)switch(ve.length){case 2:i.vertexAttrib2fv(le.location,ve);break;case 3:i.vertexAttrib3fv(le.location,ve);break;case 4:i.vertexAttrib4fv(le.location,ve);break;default:i.vertexAttrib1fv(le.location,ve)}}}}E()}function N(){j();for(const M in n){const U=n[M];for(const V in U){const H=U[V];for(const K in H)u(H[K].object),delete H[K];delete U[V]}delete n[M]}}function L(M){if(n[M.id]===void 0)return;const U=n[M.id];for(const V in U){const H=U[V];for(const K in H)u(H[K].object),delete H[K];delete U[V]}delete n[M.id]}function D(M){for(const U in n){const V=n[U];if(V[M.id]===void 0)continue;const H=V[M.id];for(const K in H)u(H[K].object),delete H[K];delete V[M.id]}}function j(){S(),o=!0,a!==r&&(a=r,h(a.object))}function S(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:l,reset:j,resetDefaultState:S,dispose:N,releaseStatesOfGeometry:L,releaseStatesOfProgram:D,initAttributes:_,enableAttribute:x,disableUnusedAttributes:E}}function D0(i,e,t){let n;function r(h){n=h}function a(h,u){i.drawArrays(n,h,u),t.update(u,n,1)}function o(h,u,f){f!==0&&(i.drawArraysInstanced(n,h,u,f),t.update(u,n,f))}function l(h,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,h,0,u,0,f);let g=0;for(let y=0;y<f;y++)g+=u[y];t.update(g,n,1)}function d(h,u,f,m){if(f===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let y=0;y<h.length;y++)o(h[y],u[y],m[y]);else{g.multiDrawArraysInstancedWEBGL(n,h,0,u,0,m,0,f);let y=0;for(let _=0;_<f;_++)y+=u[_]*m[_];t.update(y,n,1)}}this.setMode=r,this.render=a,this.renderInstances=o,this.renderMultiDraw=l,this.renderMultiDrawInstances=d}function I0(i,e,t,n){let r;function a(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const D=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(D.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(D){return!(D!==Pn&&n.convert(D)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function l(D){const j=D===fi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(D!==un&&n.convert(D)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&D!==Xn&&!j)}function d(D){if(D==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";D="mediump"}return D==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp";const u=d(h);u!==h&&(qe("WebGLRenderer:",h,"not supported, using",u,"instead."),h=u);const f=t.logarithmicDepthBuffer===!0,m=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),g=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),x=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),T=i.getParameter(i.MAX_VARYING_VECTORS),C=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),N=i.getParameter(i.MAX_SAMPLES),L=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:d,textureFormatReadable:o,textureTypeReadable:l,precision:h,logarithmicDepthBuffer:f,reversedDepthBuffer:m,maxTextures:g,maxVertexTextures:y,maxTextureSize:_,maxCubemapSize:x,maxAttributes:p,maxVertexUniforms:E,maxVaryings:T,maxFragmentUniforms:C,maxSamples:N,samples:L}}function U0(i){const e=this;let t=null,n=0,r=!1,a=!1;const o=new Hn,l=new tt,d={value:null,needsUpdate:!1};this.uniform=d,this.numPlanes=0,this.numIntersection=0,this.init=function(f,m){const g=f.length!==0||m||n!==0||r;return r=m,n=f.length,g},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,m){t=u(f,m,0)},this.setState=function(f,m,g){const y=f.clippingPlanes,_=f.clipIntersection,x=f.clipShadows,p=i.get(f);if(!r||y===null||y.length===0||a&&!x)a?u(null):h();else{const E=a?0:n,T=E*4;let C=p.clippingState||null;d.value=C,C=u(y,m,T,g);for(let N=0;N!==T;++N)C[N]=t[N];p.clippingState=C,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=E}};function h(){d.value!==t&&(d.value=t,d.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(f,m,g,y){const _=f!==null?f.length:0;let x=null;if(_!==0){if(x=d.value,y!==!0||x===null){const p=g+_*4,E=m.matrixWorldInverse;l.getNormalMatrix(E),(x===null||x.length<p)&&(x=new Float32Array(p));for(let T=0,C=g;T!==_;++T,C+=4)o.copy(f[T]).applyMatrix4(E,l),o.normal.toArray(x,C),x[C+3]=o.constant}d.value=x,d.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,x}}function F0(i){let e=new WeakMap;function t(o,l){return l===Oo?o.mapping=Ji:l===jo&&(o.mapping=Tr),o}function n(o){if(o&&o.isTexture){const l=o.mapping;if(l===Oo||l===jo)if(e.has(o)){const d=e.get(o).texture;return t(d,o.mapping)}else{const d=o.image;if(d&&d.height>0){const h=new ah(d.height);return h.fromEquirectangularTexture(i,o),e.set(o,h),o.addEventListener("dispose",r),t(h.texture,o.mapping)}else return null}}return o}function r(o){const l=o.target;l.removeEventListener("dispose",r);const d=e.get(l);d!==void 0&&(e.delete(l),d.dispose())}function a(){e=new WeakMap}return{get:n,dispose:a}}const Ui=4,ld=[.125,.215,.35,.446,.526,.582],qi=20,k0=256,ts=new Hl,cd=new ht;let bo=null,So=0,wo=0,Mo=!1;const O0=new k;class dd{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,a={}){const{size:o=256,position:l=O0}=a;bo=this._renderer.getRenderTarget(),So=this._renderer.getActiveCubeFace(),wo=this._renderer.getActiveMipmapLevel(),Mo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const d=this._allocateTargets();return d.depthBuffer=!0,this._sceneToCubeUV(e,n,r,d,l),t>0&&this._blur(d,0,0,t),this._applyPMREM(d),this._cleanup(d),d}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=fd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ud(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(bo,So,wo),this._renderer.xr.enabled=Mo,e.scissorTest=!1,yr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ji||e.mapping===Tr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),bo=this._renderer.getRenderTarget(),So=this._renderer.getActiveCubeFace(),wo=this._renderer.getActiveMipmapLevel(),Mo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Jt,minFilter:Jt,generateMipmaps:!1,type:fi,format:Pn,colorSpace:Cr,depthBuffer:!1},r=hd(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=hd(e,t,n);const{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=j0(a)),this._blurMaterial=z0(a,e,t),this._ggxMaterial=B0(a,e,t)}return r}_compileMaterial(e){const t=new zt(new Zt,e);this._renderer.compile(t,ts)}_sceneToCubeUV(e,t,n,r,a){const d=new bn(90,1,t,n),h=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,m=f.autoClear,g=f.toneMapping;f.getClearColor(cd),f.toneMapping=qn,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(r),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new zt(new Ir,new Fl({name:"PMREM.Background",side:sn,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,x=_.material;let p=!1;const E=e.background;E?E.isColor&&(x.color.copy(E),e.background=null,p=!0):(x.color.copy(cd),p=!0);for(let T=0;T<6;T++){const C=T%3;C===0?(d.up.set(0,h[T],0),d.position.set(a.x,a.y,a.z),d.lookAt(a.x+u[T],a.y,a.z)):C===1?(d.up.set(0,0,h[T]),d.position.set(a.x,a.y,a.z),d.lookAt(a.x,a.y+u[T],a.z)):(d.up.set(0,h[T],0),d.position.set(a.x,a.y,a.z),d.lookAt(a.x,a.y,a.z+u[T]));const N=this._cubeSize;yr(r,C*N,T>2?N:0,N,N),f.setRenderTarget(r),p&&f.render(_,d),f.render(e,d)}f.toneMapping=g,f.autoClear=m,e.background=E}_textureToCubeUV(e,t){const n=this._renderer,r=e.mapping===Ji||e.mapping===Tr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=fd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ud());const a=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=a;const l=a.uniforms;l.envMap.value=e;const d=this._cubeSize;yr(t,0,0,3*d,2*d),n.setRenderTarget(t),n.render(o,ts)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const r=this._lodMeshes.length;for(let a=1;a<r;a++)this._applyGGXFilter(e,a-1,a);t.autoClear=n}_applyGGXFilter(e,t,n){const r=this._renderer,a=this._pingPongRenderTarget,o=this._ggxMaterial,l=this._lodMeshes[n];l.material=o;const d=o.uniforms,h=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),f=Math.sqrt(h*h-u*u),m=0+h*1.25,g=f*m,{_lodMax:y}=this,_=this._sizeLods[n],x=3*_*(n>y-Ui?n-y+Ui:0),p=4*(this._cubeSize-_);d.envMap.value=e.texture,d.roughness.value=g,d.mipInt.value=y-t,yr(a,x,p,3*_,2*_),r.setRenderTarget(a),r.render(l,ts),d.envMap.value=a.texture,d.roughness.value=0,d.mipInt.value=y-n,yr(e,x,p,3*_,2*_),r.setRenderTarget(e),r.render(l,ts)}_blur(e,t,n,r,a){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,r,"latitudinal",a),this._halfBlur(o,e,n,n,r,"longitudinal",a)}_halfBlur(e,t,n,r,a,o,l){const d=this._renderer,h=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&ft("blur direction must be either latitudinal or longitudinal!");const u=3,f=this._lodMeshes[r];f.material=h;const m=h.uniforms,g=this._sizeLods[n]-1,y=isFinite(a)?Math.PI/(2*g):2*Math.PI/(2*qi-1),_=a/y,x=isFinite(a)?1+Math.floor(u*_):qi;x>qi&&qe(`sigmaRadians, ${a}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${qi}`);const p=[];let E=0;for(let D=0;D<qi;++D){const j=D/_,S=Math.exp(-j*j/2);p.push(S),D===0?E+=S:D<x&&(E+=2*S)}for(let D=0;D<p.length;D++)p[D]=p[D]/E;m.envMap.value=e.texture,m.samples.value=x,m.weights.value=p,m.latitudinal.value=o==="latitudinal",l&&(m.poleAxis.value=l);const{_lodMax:T}=this;m.dTheta.value=y,m.mipInt.value=T-n;const C=this._sizeLods[r],N=3*C*(r>T-Ui?r-T+Ui:0),L=4*(this._cubeSize-C);yr(t,N,L,3*C,2*C),d.setRenderTarget(t),d.render(f,ts)}}function j0(i){const e=[],t=[],n=[];let r=i;const a=i-Ui+1+ld.length;for(let o=0;o<a;o++){const l=Math.pow(2,r);e.push(l);let d=1/l;o>i-Ui?d=ld[o-i+Ui-1]:o===0&&(d=0),t.push(d);const h=1/(l-2),u=-h,f=1+h,m=[u,u,f,u,f,f,u,u,f,f,u,f],g=6,y=6,_=3,x=2,p=1,E=new Float32Array(_*y*g),T=new Float32Array(x*y*g),C=new Float32Array(p*y*g);for(let L=0;L<g;L++){const D=L%3*2/3-1,j=L>2?0:-1,S=[D,j,0,D+2/3,j,0,D+2/3,j+1,0,D,j,0,D+2/3,j+1,0,D,j+1,0];E.set(S,_*y*L),T.set(m,x*y*L);const M=[L,L,L,L,L,L];C.set(M,p*y*L)}const N=new Zt;N.setAttribute("position",new Ln(E,_)),N.setAttribute("uv",new Ln(T,x)),N.setAttribute("faceIndex",new Ln(C,p)),n.push(new zt(N,null)),r>Ui&&r--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function hd(i,e,t){const n=new Yn(i,e,t);return n.texture.mapping=wa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function yr(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function B0(i,e,t){return new Zn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:k0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ea(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:hi,depthTest:!1,depthWrite:!1})}function z0(i,e,t){const n=new Float32Array(qi),r=new k(0,1,0);return new Zn({name:"SphericalGaussianBlur",defines:{n:qi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Ea(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:hi,depthTest:!1,depthWrite:!1})}function ud(){return new Zn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ea(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:hi,depthTest:!1,depthWrite:!1})}function fd(){return new Zn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ea(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:hi,depthTest:!1,depthWrite:!1})}function Ea(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function G0(i){let e=new WeakMap,t=null;function n(l){if(l&&l.isTexture){const d=l.mapping,h=d===Oo||d===jo,u=d===Ji||d===Tr;if(h||u){let f=e.get(l);const m=f!==void 0?f.texture.pmremVersion:0;if(l.isRenderTargetTexture&&l.pmremVersion!==m)return t===null&&(t=new dd(i)),f=h?t.fromEquirectangular(l,f):t.fromCubemap(l,f),f.texture.pmremVersion=l.pmremVersion,e.set(l,f),f.texture;if(f!==void 0)return f.texture;{const g=l.image;return h&&g&&g.height>0||u&&g&&r(g)?(t===null&&(t=new dd(i)),f=h?t.fromEquirectangular(l):t.fromCubemap(l),f.texture.pmremVersion=l.pmremVersion,e.set(l,f),l.addEventListener("dispose",a),f.texture):null}}}return l}function r(l){let d=0;const h=6;for(let u=0;u<h;u++)l[u]!==void 0&&d++;return d===h}function a(l){const d=l.target;d.removeEventListener("dispose",a);const h=e.get(d);h!==void 0&&(e.delete(d),h.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function V0(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const r=i.getExtension(n);return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const r=t(n);return r===null&&ms("WebGLRenderer: "+n+" extension not supported."),r}}}function H0(i,e,t,n){const r={},a=new WeakMap;function o(f){const m=f.target;m.index!==null&&e.remove(m.index);for(const y in m.attributes)e.remove(m.attributes[y]);m.removeEventListener("dispose",o),delete r[m.id];const g=a.get(m);g&&(e.remove(g),a.delete(m)),n.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function l(f,m){return r[m.id]===!0||(m.addEventListener("dispose",o),r[m.id]=!0,t.memory.geometries++),m}function d(f){const m=f.attributes;for(const g in m)e.update(m[g],i.ARRAY_BUFFER)}function h(f){const m=[],g=f.index,y=f.attributes.position;let _=0;if(g!==null){const E=g.array;_=g.version;for(let T=0,C=E.length;T<C;T+=3){const N=E[T+0],L=E[T+1],D=E[T+2];m.push(N,L,L,D,D,N)}}else if(y!==void 0){const E=y.array;_=y.version;for(let T=0,C=E.length/3-1;T<C;T+=3){const N=T+0,L=T+1,D=T+2;m.push(N,L,L,D,D,N)}}else return;const x=new(Zd(m)?nh:th)(m,1);x.version=_;const p=a.get(f);p&&e.remove(p),a.set(f,x)}function u(f){const m=a.get(f);if(m){const g=f.index;g!==null&&m.version<g.version&&h(f)}else h(f);return a.get(f)}return{get:l,update:d,getWireframeAttribute:u}}function W0(i,e,t){let n;function r(m){n=m}let a,o;function l(m){a=m.type,o=m.bytesPerElement}function d(m,g){i.drawElements(n,g,a,m*o),t.update(g,n,1)}function h(m,g,y){y!==0&&(i.drawElementsInstanced(n,g,a,m*o,y),t.update(g,n,y))}function u(m,g,y){if(y===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,g,0,a,m,0,y);let x=0;for(let p=0;p<y;p++)x+=g[p];t.update(x,n,1)}function f(m,g,y,_){if(y===0)return;const x=e.get("WEBGL_multi_draw");if(x===null)for(let p=0;p<m.length;p++)h(m[p]/o,g[p],_[p]);else{x.multiDrawElementsInstancedWEBGL(n,g,0,a,m,0,_,0,y);let p=0;for(let E=0;E<y;E++)p+=g[E]*_[E];t.update(p,n,1)}}this.setMode=r,this.setIndex=l,this.render=d,this.renderInstances=h,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function X0(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,o,l){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=l*(a/3);break;case i.LINES:t.lines+=l*(a/2);break;case i.LINE_STRIP:t.lines+=l*(a-1);break;case i.LINE_LOOP:t.lines+=l*a;break;case i.POINTS:t.points+=l*a;break;default:ft("WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function $0(i,e,t){const n=new WeakMap,r=new Pt;function a(o,l,d){const h=o.morphTargetInfluences,u=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,f=u!==void 0?u.length:0;let m=n.get(l);if(m===void 0||m.count!==f){let S=function(){D.dispose(),n.delete(l),l.removeEventListener("dispose",S)};m!==void 0&&m.texture.dispose();const g=l.morphAttributes.position!==void 0,y=l.morphAttributes.normal!==void 0,_=l.morphAttributes.color!==void 0,x=l.morphAttributes.position||[],p=l.morphAttributes.normal||[],E=l.morphAttributes.color||[];let T=0;g===!0&&(T=1),y===!0&&(T=2),_===!0&&(T=3);let C=l.attributes.position.count*T,N=1;C>e.maxTextureSize&&(N=Math.ceil(C/e.maxTextureSize),C=e.maxTextureSize);const L=new Float32Array(C*N*4*f),D=new Qd(L,C,N,f);D.type=Xn,D.needsUpdate=!0;const j=T*4;for(let M=0;M<f;M++){const U=x[M],V=p[M],H=E[M],K=C*N*4*M;for(let Q=0;Q<U.count;Q++){const J=Q*j;g===!0&&(r.fromBufferAttribute(U,Q),L[K+J+0]=r.x,L[K+J+1]=r.y,L[K+J+2]=r.z,L[K+J+3]=0),y===!0&&(r.fromBufferAttribute(V,Q),L[K+J+4]=r.x,L[K+J+5]=r.y,L[K+J+6]=r.z,L[K+J+7]=0),_===!0&&(r.fromBufferAttribute(H,Q),L[K+J+8]=r.x,L[K+J+9]=r.y,L[K+J+10]=r.z,L[K+J+11]=H.itemSize===4?r.w:1)}}m={count:f,texture:D,size:new He(C,N)},n.set(l,m),l.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)d.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let g=0;for(let _=0;_<h.length;_++)g+=h[_];const y=l.morphTargetsRelative?1:1-g;d.getUniforms().setValue(i,"morphTargetBaseInfluence",y),d.getUniforms().setValue(i,"morphTargetInfluences",h)}d.getUniforms().setValue(i,"morphTargetsTexture",m.texture,t),d.getUniforms().setValue(i,"morphTargetsTextureSize",m.size)}return{update:a}}function q0(i,e,t,n){let r=new WeakMap;function a(d){const h=n.render.frame,u=d.geometry,f=e.get(d,u);if(r.get(f)!==h&&(e.update(f),r.set(f,h)),d.isInstancedMesh&&(d.hasEventListener("dispose",l)===!1&&d.addEventListener("dispose",l),r.get(d)!==h&&(t.update(d.instanceMatrix,i.ARRAY_BUFFER),d.instanceColor!==null&&t.update(d.instanceColor,i.ARRAY_BUFFER),r.set(d,h))),d.isSkinnedMesh){const m=d.skeleton;r.get(m)!==h&&(m.update(),r.set(m,h))}return f}function o(){r=new WeakMap}function l(d){const h=d.target;h.removeEventListener("dispose",l),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const Y0={[Fd]:"LINEAR_TONE_MAPPING",[kd]:"REINHARD_TONE_MAPPING",[Od]:"CINEON_TONE_MAPPING",[jd]:"ACES_FILMIC_TONE_MAPPING",[zd]:"AGX_TONE_MAPPING",[Gd]:"NEUTRAL_TONE_MAPPING",[Bd]:"CUSTOM_TONE_MAPPING"};function K0(i,e,t,n,r){const a=new Yn(e,t,{type:i,depthBuffer:n,stencilBuffer:r}),o=new Yn(e,t,{type:fi,depthBuffer:!1,stencilBuffer:!1}),l=new Zt;l.setAttribute("position",new Ct([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new Ct([0,2,0,0,2,0],2));const d=new Up({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new zt(l,d),u=new Hl(-1,1,1,-1,0,1);let f=null,m=null,g=!1,y,_=null,x=[],p=!1;this.setSize=function(E,T){a.setSize(E,T),o.setSize(E,T);for(let C=0;C<x.length;C++){const N=x[C];N.setSize&&N.setSize(E,T)}},this.setEffects=function(E){x=E,p=x.length>0&&x[0].isRenderPass===!0;const T=a.width,C=a.height;for(let N=0;N<x.length;N++){const L=x[N];L.setSize&&L.setSize(T,C)}},this.begin=function(E,T){if(g||E.toneMapping===qn&&x.length===0)return!1;if(_=T,T!==null){const C=T.width,N=T.height;(a.width!==C||a.height!==N)&&this.setSize(C,N)}return p===!1&&E.setRenderTarget(a),y=E.toneMapping,E.toneMapping=qn,!0},this.hasRenderPass=function(){return p},this.end=function(E,T){E.toneMapping=y,g=!0;let C=a,N=o;for(let L=0;L<x.length;L++){const D=x[L];if(D.enabled!==!1&&(D.render(E,N,C,T),D.needsSwap!==!1)){const j=C;C=N,N=j}}if(f!==E.outputColorSpace||m!==E.toneMapping){f=E.outputColorSpace,m=E.toneMapping,d.defines={},pt.getTransfer(f)===bt&&(d.defines.SRGB_TRANSFER="");const L=Y0[m];L&&(d.defines[L]=""),d.needsUpdate=!0}d.uniforms.tDiffuse.value=C.texture,E.setRenderTarget(_),E.render(h,u),_=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){a.dispose(),o.dispose(),l.dispose(),d.dispose()}}const ph=new Wt,bl=new xs(1,1),mh=new Qd,gh=new qf,xh=new sh,pd=[],md=[],gd=new Float32Array(16),xd=new Float32Array(9),vd=new Float32Array(4);function Ur(i,e,t){const n=i[0];if(n<=0||n>0)return i;const r=e*t;let a=pd[r];if(a===void 0&&(a=new Float32Array(r),pd[r]=a),e!==0){n.toArray(a,0);for(let o=1,l=0;o!==e;++o)l+=t,i[o].toArray(a,l)}return a}function Ut(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ft(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ta(i,e){let t=md[e];t===void 0&&(t=new Int32Array(e),md[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function J0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Z0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;i.uniform2fv(this.addr,e),Ft(t,e)}}function Q0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ut(t,e))return;i.uniform3fv(this.addr,e),Ft(t,e)}}function ex(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;i.uniform4fv(this.addr,e),Ft(t,e)}}function tx(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ft(t,e)}else{if(Ut(t,n))return;vd.set(n),i.uniformMatrix2fv(this.addr,!1,vd),Ft(t,n)}}function nx(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ft(t,e)}else{if(Ut(t,n))return;xd.set(n),i.uniformMatrix3fv(this.addr,!1,xd),Ft(t,n)}}function ix(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ft(t,e)}else{if(Ut(t,n))return;gd.set(n),i.uniformMatrix4fv(this.addr,!1,gd),Ft(t,n)}}function rx(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function sx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;i.uniform2iv(this.addr,e),Ft(t,e)}}function ax(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;i.uniform3iv(this.addr,e),Ft(t,e)}}function ox(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;i.uniform4iv(this.addr,e),Ft(t,e)}}function lx(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function cx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;i.uniform2uiv(this.addr,e),Ft(t,e)}}function dx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;i.uniform3uiv(this.addr,e),Ft(t,e)}}function hx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;i.uniform4uiv(this.addr,e),Ft(t,e)}}function ux(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let a;this.type===i.SAMPLER_2D_SHADOW?(bl.compareFunction=t.isReversedDepthBuffer()?Pl:Rl,a=bl):a=ph,t.setTexture2D(e||a,r)}function fx(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||gh,r)}function px(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||xh,r)}function mx(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||mh,r)}function gx(i){switch(i){case 5126:return J0;case 35664:return Z0;case 35665:return Q0;case 35666:return ex;case 35674:return tx;case 35675:return nx;case 35676:return ix;case 5124:case 35670:return rx;case 35667:case 35671:return sx;case 35668:case 35672:return ax;case 35669:case 35673:return ox;case 5125:return lx;case 36294:return cx;case 36295:return dx;case 36296:return hx;case 35678:case 36198:case 36298:case 36306:case 35682:return ux;case 35679:case 36299:case 36307:return fx;case 35680:case 36300:case 36308:case 36293:return px;case 36289:case 36303:case 36311:case 36292:return mx}}function xx(i,e){i.uniform1fv(this.addr,e)}function vx(i,e){const t=Ur(e,this.size,2);i.uniform2fv(this.addr,t)}function _x(i,e){const t=Ur(e,this.size,3);i.uniform3fv(this.addr,t)}function yx(i,e){const t=Ur(e,this.size,4);i.uniform4fv(this.addr,t)}function bx(i,e){const t=Ur(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Sx(i,e){const t=Ur(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function wx(i,e){const t=Ur(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Mx(i,e){i.uniform1iv(this.addr,e)}function Ex(i,e){i.uniform2iv(this.addr,e)}function Tx(i,e){i.uniform3iv(this.addr,e)}function Ax(i,e){i.uniform4iv(this.addr,e)}function Cx(i,e){i.uniform1uiv(this.addr,e)}function Nx(i,e){i.uniform2uiv(this.addr,e)}function Rx(i,e){i.uniform3uiv(this.addr,e)}function Px(i,e){i.uniform4uiv(this.addr,e)}function Lx(i,e,t){const n=this.cache,r=e.length,a=Ta(t,r);Ut(n,a)||(i.uniform1iv(this.addr,a),Ft(n,a));let o;this.type===i.SAMPLER_2D_SHADOW?o=bl:o=ph;for(let l=0;l!==r;++l)t.setTexture2D(e[l]||o,a[l])}function Dx(i,e,t){const n=this.cache,r=e.length,a=Ta(t,r);Ut(n,a)||(i.uniform1iv(this.addr,a),Ft(n,a));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||gh,a[o])}function Ix(i,e,t){const n=this.cache,r=e.length,a=Ta(t,r);Ut(n,a)||(i.uniform1iv(this.addr,a),Ft(n,a));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||xh,a[o])}function Ux(i,e,t){const n=this.cache,r=e.length,a=Ta(t,r);Ut(n,a)||(i.uniform1iv(this.addr,a),Ft(n,a));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||mh,a[o])}function Fx(i){switch(i){case 5126:return xx;case 35664:return vx;case 35665:return _x;case 35666:return yx;case 35674:return bx;case 35675:return Sx;case 35676:return wx;case 5124:case 35670:return Mx;case 35667:case 35671:return Ex;case 35668:case 35672:return Tx;case 35669:case 35673:return Ax;case 5125:return Cx;case 36294:return Nx;case 36295:return Rx;case 36296:return Px;case 35678:case 36198:case 36298:case 36306:case 35682:return Lx;case 35679:case 36299:case 36307:return Dx;case 35680:case 36300:case 36308:case 36293:return Ix;case 36289:case 36303:case 36311:case 36292:return Ux}}class kx{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=gx(t.type)}}class Ox{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Fx(t.type)}}class jx{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const r=this.seq;for(let a=0,o=r.length;a!==o;++a){const l=r[a];l.setValue(e,t[l.id],n)}}}const Eo=/(\w+)(\])?(\[|\.)?/g;function _d(i,e){i.seq.push(e),i.map[e.id]=e}function Bx(i,e,t){const n=i.name,r=n.length;for(Eo.lastIndex=0;;){const a=Eo.exec(n),o=Eo.lastIndex;let l=a[1];const d=a[2]==="]",h=a[3];if(d&&(l=l|0),h===void 0||h==="["&&o+2===r){_d(t,h===void 0?new kx(l,i,e):new Ox(l,i,e));break}else{let f=t.map[l];f===void 0&&(f=new jx(l),_d(t,f)),t=f}}}class va{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){const l=e.getActiveUniform(t,o),d=e.getUniformLocation(t,l.name);Bx(l,d,this)}const r=[],a=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(o):a.push(o);r.length>0&&(this.seq=r.concat(a))}setValue(e,t,n,r){const a=this.map[t];a!==void 0&&a.setValue(e,n,r)}setOptional(e,t,n){const r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let a=0,o=t.length;a!==o;++a){const l=t[a],d=n[l.id];d.needsUpdate!==!1&&l.setValue(e,d.value,r)}}static seqWithValue(e,t){const n=[];for(let r=0,a=e.length;r!==a;++r){const o=e[r];o.id in t&&n.push(o)}return n}}function yd(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const zx=37297;let Gx=0;function Vx(i,e){const t=i.split(`
`),n=[],r=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let o=r;o<a;o++){const l=o+1;n.push(`${l===e?">":" "} ${l}: ${t[o]}`)}return n.join(`
`)}const bd=new tt;function Hx(i){pt._getMatrix(bd,pt.workingColorSpace,i);const e=`mat3( ${bd.elements.map(t=>t.toFixed(4))} )`;switch(pt.getTransfer(i)){case _a:return[e,"LinearTransferOETF"];case bt:return[e,"sRGBTransferOETF"];default:return qe("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Sd(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),a=(i.getShaderInfoLog(e)||"").trim();if(n&&a==="")return"";const o=/ERROR: 0:(\d+)/.exec(a);if(o){const l=parseInt(o[1]);return t.toUpperCase()+`

`+a+`

`+Vx(i.getShaderSource(e),l)}else return a}function Wx(i,e){const t=Hx(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Xx={[Fd]:"Linear",[kd]:"Reinhard",[Od]:"Cineon",[jd]:"ACESFilmic",[zd]:"AgX",[Gd]:"Neutral",[Bd]:"Custom"};function $x(i,e){const t=Xx[e];return t===void 0?(qe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ca=new k;function qx(){pt.getLuminanceCoefficients(ca);const i=ca.x.toFixed(4),e=ca.y.toFixed(4),t=ca.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Yx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(rs).join(`
`)}function Kx(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Jx(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const a=i.getActiveAttrib(e,r),o=a.name;let l=1;a.type===i.FLOAT_MAT2&&(l=2),a.type===i.FLOAT_MAT3&&(l=3),a.type===i.FLOAT_MAT4&&(l=4),t[o]={type:a.type,location:i.getAttribLocation(e,o),locationSize:l}}return t}function rs(i){return i!==""}function wd(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Md(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Zx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Sl(i){return i.replace(Zx,ev)}const Qx=new Map;function ev(i,e){let t=st[e];if(t===void 0){const n=Qx.get(e);if(n!==void 0)t=st[n],qe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Sl(t)}const tv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ed(i){return i.replace(tv,nv)}function nv(i,e,t,n){let r="";for(let a=parseInt(e);a<parseInt(t);a++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return r}function Td(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const iv={[fa]:"SHADOWMAP_TYPE_PCF",[is]:"SHADOWMAP_TYPE_VSM"};function rv(i){return iv[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const sv={[Ji]:"ENVMAP_TYPE_CUBE",[Tr]:"ENVMAP_TYPE_CUBE",[wa]:"ENVMAP_TYPE_CUBE_UV"};function av(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":sv[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const ov={[Tr]:"ENVMAP_MODE_REFRACTION"};function lv(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":ov[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const cv={[Ud]:"ENVMAP_BLENDING_MULTIPLY",[pf]:"ENVMAP_BLENDING_MIX",[mf]:"ENVMAP_BLENDING_ADD"};function dv(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":cv[i.combine]||"ENVMAP_BLENDING_NONE"}function hv(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function uv(i,e,t,n){const r=i.getContext(),a=t.defines;let o=t.vertexShader,l=t.fragmentShader;const d=rv(t),h=av(t),u=lv(t),f=dv(t),m=hv(t),g=Yx(t),y=Kx(a),_=r.createProgram();let x,p,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(rs).join(`
`),x.length>0&&(x+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(rs).join(`
`),p.length>0&&(p+=`
`)):(x=[Td(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+d:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(rs).join(`
`),p=[Td(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+d:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==qn?"#define TONE_MAPPING":"",t.toneMapping!==qn?st.tonemapping_pars_fragment:"",t.toneMapping!==qn?$x("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",st.colorspace_pars_fragment,Wx("linearToOutputTexel",t.outputColorSpace),qx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(rs).join(`
`)),o=Sl(o),o=wd(o,t),o=Md(o,t),l=Sl(l),l=wd(l,t),l=Md(l,t),o=Ed(o),l=Ed(l),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,x=[g,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,p=["#define varying in",t.glslVersion===Lc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Lc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const T=E+x+o,C=E+p+l,N=yd(r,r.VERTEX_SHADER,T),L=yd(r,r.FRAGMENT_SHADER,C);r.attachShader(_,N),r.attachShader(_,L),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function D(U){if(i.debug.checkShaderErrors){const V=r.getProgramInfoLog(_)||"",H=r.getShaderInfoLog(N)||"",K=r.getShaderInfoLog(L)||"",Q=V.trim(),J=H.trim(),Y=K.trim();let le=!0,me=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(le=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,_,N,L);else{const ve=Sd(r,N,"vertex"),be=Sd(r,L,"fragment");ft("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+U.name+`
Material Type: `+U.type+`

Program Info Log: `+Q+`
`+ve+`
`+be)}else Q!==""?qe("WebGLProgram: Program Info Log:",Q):(J===""||Y==="")&&(me=!1);me&&(U.diagnostics={runnable:le,programLog:Q,vertexShader:{log:J,prefix:x},fragmentShader:{log:Y,prefix:p}})}r.deleteShader(N),r.deleteShader(L),j=new va(r,_),S=Jx(r,_)}let j;this.getUniforms=function(){return j===void 0&&D(this),j};let S;this.getAttributes=function(){return S===void 0&&D(this),S};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(_,zx)),M},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Gx++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=N,this.fragmentShader=L,this}let fv=0;class pv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),a=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(a)===!1&&(o.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new mv(e),t.set(e,n)),n}}class mv{constructor(e){this.id=fv++,this.code=e,this.usedTimes=0}}function gv(i,e,t,n,r,a,o){const l=new Ul,d=new pv,h=new Set,u=[],f=new Map,m=r.logarithmicDepthBuffer;let g=r.precision;const y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return h.add(S),S===0?"uv":`uv${S}`}function x(S,M,U,V,H){const K=V.fog,Q=H.geometry,J=S.isMeshStandardMaterial?V.environment:null,Y=(S.isMeshStandardMaterial?t:e).get(S.envMap||J),le=Y&&Y.mapping===wa?Y.image.height:null,me=y[S.type];S.precision!==null&&(g=r.getMaxPrecision(S.precision),g!==S.precision&&qe("WebGLProgram.getParameters:",S.precision,"not supported, using",g,"instead."));const ve=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,be=ve!==void 0?ve.length:0;let pe=0;Q.morphAttributes.position!==void 0&&(pe=1),Q.morphAttributes.normal!==void 0&&(pe=2),Q.morphAttributes.color!==void 0&&(pe=3);let Ke,nt,ut,te;if(me){const Je=Wn[me];Ke=Je.vertexShader,nt=Je.fragmentShader}else Ke=S.vertexShader,nt=S.fragmentShader,d.update(S),ut=d.getVertexShaderID(S),te=d.getFragmentShaderID(S);const oe=i.getRenderTarget(),Ne=i.state.buffers.depth.getReversed(),Ye=H.isInstancedMesh===!0,Ce=H.isBatchedMesh===!0,We=!!S.map,Et=!!S.matcap,et=!!Y,ot=!!S.aoMap,je=!!S.lightMap,Fe=!!S.bumpMap,vt=!!S.normalMap,I=!!S.displacementMap,wt=!!S.emissiveMap,Ie=!!S.metalnessMap,ct=!!S.roughnessMap,ge=S.anisotropy>0,A=S.clearcoat>0,v=S.dispersion>0,O=S.iridescence>0,P=S.sheen>0,q=S.transmission>0,G=ge&&!!S.anisotropyMap,Me=A&&!!S.clearcoatMap,se=A&&!!S.clearcoatNormalMap,Re=A&&!!S.clearcoatRoughnessMap,he=O&&!!S.iridescenceMap,ee=O&&!!S.iridescenceThicknessMap,ae=P&&!!S.sheenColorMap,Te=P&&!!S.sheenRoughnessMap,_e=!!S.specularMap,ue=!!S.specularColorMap,Be=!!S.specularIntensityMap,F=q&&!!S.transmissionMap,xe=q&&!!S.thicknessMap,de=!!S.gradientMap,Se=!!S.alphaMap,ce=S.alphaTest>0,ne=!!S.alphaHash,ye=!!S.extensions;let Ge=qn;S.toneMapped&&(oe===null||oe.isXRRenderTarget===!0)&&(Ge=i.toneMapping);const St={shaderID:me,shaderType:S.type,shaderName:S.name,vertexShader:Ke,fragmentShader:nt,defines:S.defines,customVertexShaderID:ut,customFragmentShaderID:te,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:g,batching:Ce,batchingColor:Ce&&H._colorsTexture!==null,instancing:Ye,instancingColor:Ye&&H.instanceColor!==null,instancingMorph:Ye&&H.morphTexture!==null,outputColorSpace:oe===null?i.outputColorSpace:oe.isXRRenderTarget===!0?oe.texture.colorSpace:Cr,alphaToCoverage:!!S.alphaToCoverage,map:We,matcap:Et,envMap:et,envMapMode:et&&Y.mapping,envMapCubeUVHeight:le,aoMap:ot,lightMap:je,bumpMap:Fe,normalMap:vt,displacementMap:I,emissiveMap:wt,normalMapObjectSpace:vt&&S.normalMapType===vf,normalMapTangentSpace:vt&&S.normalMapType===Jd,metalnessMap:Ie,roughnessMap:ct,anisotropy:ge,anisotropyMap:G,clearcoat:A,clearcoatMap:Me,clearcoatNormalMap:se,clearcoatRoughnessMap:Re,dispersion:v,iridescence:O,iridescenceMap:he,iridescenceThicknessMap:ee,sheen:P,sheenColorMap:ae,sheenRoughnessMap:Te,specularMap:_e,specularColorMap:ue,specularIntensityMap:Be,transmission:q,transmissionMap:F,thicknessMap:xe,gradientMap:de,opaque:S.transparent===!1&&S.blending===wr&&S.alphaToCoverage===!1,alphaMap:Se,alphaTest:ce,alphaHash:ne,combine:S.combine,mapUv:We&&_(S.map.channel),aoMapUv:ot&&_(S.aoMap.channel),lightMapUv:je&&_(S.lightMap.channel),bumpMapUv:Fe&&_(S.bumpMap.channel),normalMapUv:vt&&_(S.normalMap.channel),displacementMapUv:I&&_(S.displacementMap.channel),emissiveMapUv:wt&&_(S.emissiveMap.channel),metalnessMapUv:Ie&&_(S.metalnessMap.channel),roughnessMapUv:ct&&_(S.roughnessMap.channel),anisotropyMapUv:G&&_(S.anisotropyMap.channel),clearcoatMapUv:Me&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:se&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Re&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:he&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:ee&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:ae&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:Te&&_(S.sheenRoughnessMap.channel),specularMapUv:_e&&_(S.specularMap.channel),specularColorMapUv:ue&&_(S.specularColorMap.channel),specularIntensityMapUv:Be&&_(S.specularIntensityMap.channel),transmissionMapUv:F&&_(S.transmissionMap.channel),thicknessMapUv:xe&&_(S.thicknessMap.channel),alphaMapUv:Se&&_(S.alphaMap.channel),vertexTangents:!!Q.attributes.tangent&&(vt||ge),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!Q.attributes.uv&&(We||Se),fog:!!K,useFog:S.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:m,reversedDepthBuffer:Ne,skinning:H.isSkinnedMesh===!0,morphTargets:Q.morphAttributes.position!==void 0,morphNormals:Q.morphAttributes.normal!==void 0,morphColors:Q.morphAttributes.color!==void 0,morphTargetsCount:be,morphTextureStride:pe,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&U.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ge,decodeVideoTexture:We&&S.map.isVideoTexture===!0&&pt.getTransfer(S.map.colorSpace)===bt,decodeVideoTextureEmissive:wt&&S.emissiveMap.isVideoTexture===!0&&pt.getTransfer(S.emissiveMap.colorSpace)===bt,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Nn,flipSided:S.side===sn,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:ye&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ye&&S.extensions.multiDraw===!0||Ce)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return St.vertexUv1s=h.has(1),St.vertexUv2s=h.has(2),St.vertexUv3s=h.has(3),h.clear(),St}function p(S){const M=[];if(S.shaderID?M.push(S.shaderID):(M.push(S.customVertexShaderID),M.push(S.customFragmentShaderID)),S.defines!==void 0)for(const U in S.defines)M.push(U),M.push(S.defines[U]);return S.isRawShaderMaterial===!1&&(E(M,S),T(M,S),M.push(i.outputColorSpace)),M.push(S.customProgramCacheKey),M.join()}function E(S,M){S.push(M.precision),S.push(M.outputColorSpace),S.push(M.envMapMode),S.push(M.envMapCubeUVHeight),S.push(M.mapUv),S.push(M.alphaMapUv),S.push(M.lightMapUv),S.push(M.aoMapUv),S.push(M.bumpMapUv),S.push(M.normalMapUv),S.push(M.displacementMapUv),S.push(M.emissiveMapUv),S.push(M.metalnessMapUv),S.push(M.roughnessMapUv),S.push(M.anisotropyMapUv),S.push(M.clearcoatMapUv),S.push(M.clearcoatNormalMapUv),S.push(M.clearcoatRoughnessMapUv),S.push(M.iridescenceMapUv),S.push(M.iridescenceThicknessMapUv),S.push(M.sheenColorMapUv),S.push(M.sheenRoughnessMapUv),S.push(M.specularMapUv),S.push(M.specularColorMapUv),S.push(M.specularIntensityMapUv),S.push(M.transmissionMapUv),S.push(M.thicknessMapUv),S.push(M.combine),S.push(M.fogExp2),S.push(M.sizeAttenuation),S.push(M.morphTargetsCount),S.push(M.morphAttributeCount),S.push(M.numDirLights),S.push(M.numPointLights),S.push(M.numSpotLights),S.push(M.numSpotLightMaps),S.push(M.numHemiLights),S.push(M.numRectAreaLights),S.push(M.numDirLightShadows),S.push(M.numPointLightShadows),S.push(M.numSpotLightShadows),S.push(M.numSpotLightShadowsWithMaps),S.push(M.numLightProbes),S.push(M.shadowMapType),S.push(M.toneMapping),S.push(M.numClippingPlanes),S.push(M.numClipIntersection),S.push(M.depthPacking)}function T(S,M){l.disableAll(),M.instancing&&l.enable(0),M.instancingColor&&l.enable(1),M.instancingMorph&&l.enable(2),M.matcap&&l.enable(3),M.envMap&&l.enable(4),M.normalMapObjectSpace&&l.enable(5),M.normalMapTangentSpace&&l.enable(6),M.clearcoat&&l.enable(7),M.iridescence&&l.enable(8),M.alphaTest&&l.enable(9),M.vertexColors&&l.enable(10),M.vertexAlphas&&l.enable(11),M.vertexUv1s&&l.enable(12),M.vertexUv2s&&l.enable(13),M.vertexUv3s&&l.enable(14),M.vertexTangents&&l.enable(15),M.anisotropy&&l.enable(16),M.alphaHash&&l.enable(17),M.batching&&l.enable(18),M.dispersion&&l.enable(19),M.batchingColor&&l.enable(20),M.gradientMap&&l.enable(21),S.push(l.mask),l.disableAll(),M.fog&&l.enable(0),M.useFog&&l.enable(1),M.flatShading&&l.enable(2),M.logarithmicDepthBuffer&&l.enable(3),M.reversedDepthBuffer&&l.enable(4),M.skinning&&l.enable(5),M.morphTargets&&l.enable(6),M.morphNormals&&l.enable(7),M.morphColors&&l.enable(8),M.premultipliedAlpha&&l.enable(9),M.shadowMapEnabled&&l.enable(10),M.doubleSided&&l.enable(11),M.flipSided&&l.enable(12),M.useDepthPacking&&l.enable(13),M.dithering&&l.enable(14),M.transmission&&l.enable(15),M.sheen&&l.enable(16),M.opaque&&l.enable(17),M.pointsUvs&&l.enable(18),M.decodeVideoTexture&&l.enable(19),M.decodeVideoTextureEmissive&&l.enable(20),M.alphaToCoverage&&l.enable(21),S.push(l.mask)}function C(S){const M=y[S.type];let U;if(M){const V=Wn[M];U=op.clone(V.uniforms)}else U=S.uniforms;return U}function N(S,M){let U=f.get(M);return U!==void 0?++U.usedTimes:(U=new uv(i,M,S,a),u.push(U),f.set(M,U)),U}function L(S){if(--S.usedTimes===0){const M=u.indexOf(S);u[M]=u[u.length-1],u.pop(),f.delete(S.cacheKey),S.destroy()}}function D(S){d.remove(S)}function j(){d.dispose()}return{getParameters:x,getProgramCacheKey:p,getUniforms:C,acquireProgram:N,releaseProgram:L,releaseShaderCache:D,programs:u,dispose:j}}function xv(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let l=i.get(o);return l===void 0&&(l={},i.set(o,l)),l}function n(o){i.delete(o)}function r(o,l,d){i.get(o)[l]=d}function a(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:a}}function vv(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Ad(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Cd(){const i=[];let e=0;const t=[],n=[],r=[];function a(){e=0,t.length=0,n.length=0,r.length=0}function o(f,m,g,y,_,x){let p=i[e];return p===void 0?(p={id:f.id,object:f,geometry:m,material:g,groupOrder:y,renderOrder:f.renderOrder,z:_,group:x},i[e]=p):(p.id=f.id,p.object=f,p.geometry=m,p.material=g,p.groupOrder=y,p.renderOrder=f.renderOrder,p.z=_,p.group=x),e++,p}function l(f,m,g,y,_,x){const p=o(f,m,g,y,_,x);g.transmission>0?n.push(p):g.transparent===!0?r.push(p):t.push(p)}function d(f,m,g,y,_,x){const p=o(f,m,g,y,_,x);g.transmission>0?n.unshift(p):g.transparent===!0?r.unshift(p):t.unshift(p)}function h(f,m){t.length>1&&t.sort(f||vv),n.length>1&&n.sort(m||Ad),r.length>1&&r.sort(m||Ad)}function u(){for(let f=e,m=i.length;f<m;f++){const g=i[f];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:r,init:a,push:l,unshift:d,finish:u,sort:h}}function _v(){let i=new WeakMap;function e(n,r){const a=i.get(n);let o;return a===void 0?(o=new Cd,i.set(n,[o])):r>=a.length?(o=new Cd,a.push(o)):o=a[r],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function yv(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new k,color:new ht};break;case"SpotLight":t={position:new k,direction:new k,color:new ht,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new k,color:new ht,distance:0,decay:0};break;case"HemisphereLight":t={direction:new k,skyColor:new ht,groundColor:new ht};break;case"RectAreaLight":t={color:new ht,position:new k,halfWidth:new k,halfHeight:new k};break}return i[e.id]=t,t}}}function bv(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let Sv=0;function wv(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Mv(i){const e=new yv,t=bv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)n.probe.push(new k);const r=new k,a=new At,o=new At;function l(h){let u=0,f=0,m=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let g=0,y=0,_=0,x=0,p=0,E=0,T=0,C=0,N=0,L=0,D=0;h.sort(wv);for(let S=0,M=h.length;S<M;S++){const U=h[S],V=U.color,H=U.intensity,K=U.distance;let Q=null;if(U.shadow&&U.shadow.map&&(U.shadow.map.texture.format===Ar?Q=U.shadow.map.texture:Q=U.shadow.map.depthTexture||U.shadow.map.texture),U.isAmbientLight)u+=V.r*H,f+=V.g*H,m+=V.b*H;else if(U.isLightProbe){for(let J=0;J<9;J++)n.probe[J].addScaledVector(U.sh.coefficients[J],H);D++}else if(U.isDirectionalLight){const J=e.get(U);if(J.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){const Y=U.shadow,le=t.get(U);le.shadowIntensity=Y.intensity,le.shadowBias=Y.bias,le.shadowNormalBias=Y.normalBias,le.shadowRadius=Y.radius,le.shadowMapSize=Y.mapSize,n.directionalShadow[g]=le,n.directionalShadowMap[g]=Q,n.directionalShadowMatrix[g]=U.shadow.matrix,E++}n.directional[g]=J,g++}else if(U.isSpotLight){const J=e.get(U);J.position.setFromMatrixPosition(U.matrixWorld),J.color.copy(V).multiplyScalar(H),J.distance=K,J.coneCos=Math.cos(U.angle),J.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),J.decay=U.decay,n.spot[_]=J;const Y=U.shadow;if(U.map&&(n.spotLightMap[N]=U.map,N++,Y.updateMatrices(U),U.castShadow&&L++),n.spotLightMatrix[_]=Y.matrix,U.castShadow){const le=t.get(U);le.shadowIntensity=Y.intensity,le.shadowBias=Y.bias,le.shadowNormalBias=Y.normalBias,le.shadowRadius=Y.radius,le.shadowMapSize=Y.mapSize,n.spotShadow[_]=le,n.spotShadowMap[_]=Q,C++}_++}else if(U.isRectAreaLight){const J=e.get(U);J.color.copy(V).multiplyScalar(H),J.halfWidth.set(U.width*.5,0,0),J.halfHeight.set(0,U.height*.5,0),n.rectArea[x]=J,x++}else if(U.isPointLight){const J=e.get(U);if(J.color.copy(U.color).multiplyScalar(U.intensity),J.distance=U.distance,J.decay=U.decay,U.castShadow){const Y=U.shadow,le=t.get(U);le.shadowIntensity=Y.intensity,le.shadowBias=Y.bias,le.shadowNormalBias=Y.normalBias,le.shadowRadius=Y.radius,le.shadowMapSize=Y.mapSize,le.shadowCameraNear=Y.camera.near,le.shadowCameraFar=Y.camera.far,n.pointShadow[y]=le,n.pointShadowMap[y]=Q,n.pointShadowMatrix[y]=U.shadow.matrix,T++}n.point[y]=J,y++}else if(U.isHemisphereLight){const J=e.get(U);J.skyColor.copy(U.color).multiplyScalar(H),J.groundColor.copy(U.groundColor).multiplyScalar(H),n.hemi[p]=J,p++}}x>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ae.LTC_FLOAT_1,n.rectAreaLTC2=Ae.LTC_FLOAT_2):(n.rectAreaLTC1=Ae.LTC_HALF_1,n.rectAreaLTC2=Ae.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=f,n.ambient[2]=m;const j=n.hash;(j.directionalLength!==g||j.pointLength!==y||j.spotLength!==_||j.rectAreaLength!==x||j.hemiLength!==p||j.numDirectionalShadows!==E||j.numPointShadows!==T||j.numSpotShadows!==C||j.numSpotMaps!==N||j.numLightProbes!==D)&&(n.directional.length=g,n.spot.length=_,n.rectArea.length=x,n.point.length=y,n.hemi.length=p,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=T,n.pointShadowMap.length=T,n.spotShadow.length=C,n.spotShadowMap.length=C,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=T,n.spotLightMatrix.length=C+N-L,n.spotLightMap.length=N,n.numSpotLightShadowsWithMaps=L,n.numLightProbes=D,j.directionalLength=g,j.pointLength=y,j.spotLength=_,j.rectAreaLength=x,j.hemiLength=p,j.numDirectionalShadows=E,j.numPointShadows=T,j.numSpotShadows=C,j.numSpotMaps=N,j.numLightProbes=D,n.version=Sv++)}function d(h,u){let f=0,m=0,g=0,y=0,_=0;const x=u.matrixWorldInverse;for(let p=0,E=h.length;p<E;p++){const T=h[p];if(T.isDirectionalLight){const C=n.directional[f];C.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(x),f++}else if(T.isSpotLight){const C=n.spot[g];C.position.setFromMatrixPosition(T.matrixWorld),C.position.applyMatrix4(x),C.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(x),g++}else if(T.isRectAreaLight){const C=n.rectArea[y];C.position.setFromMatrixPosition(T.matrixWorld),C.position.applyMatrix4(x),o.identity(),a.copy(T.matrixWorld),a.premultiply(x),o.extractRotation(a),C.halfWidth.set(T.width*.5,0,0),C.halfHeight.set(0,T.height*.5,0),C.halfWidth.applyMatrix4(o),C.halfHeight.applyMatrix4(o),y++}else if(T.isPointLight){const C=n.point[m];C.position.setFromMatrixPosition(T.matrixWorld),C.position.applyMatrix4(x),m++}else if(T.isHemisphereLight){const C=n.hemi[_];C.direction.setFromMatrixPosition(T.matrixWorld),C.direction.transformDirection(x),_++}}}return{setup:l,setupView:d,state:n}}function Nd(i){const e=new Mv(i),t=[],n=[];function r(u){h.camera=u,t.length=0,n.length=0}function a(u){t.push(u)}function o(u){n.push(u)}function l(){e.setup(t)}function d(u){e.setupView(t,u)}const h={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:h,setupLights:l,setupLightsView:d,pushLight:a,pushShadow:o}}function Ev(i){let e=new WeakMap;function t(r,a=0){const o=e.get(r);let l;return o===void 0?(l=new Nd(i),e.set(r,[l])):a>=o.length?(l=new Nd(i),o.push(l)):l=o[a],l}function n(){e=new WeakMap}return{get:t,dispose:n}}const Tv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Av=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Cv=[new k(1,0,0),new k(-1,0,0),new k(0,1,0),new k(0,-1,0),new k(0,0,1),new k(0,0,-1)],Nv=[new k(0,-1,0),new k(0,-1,0),new k(0,0,1),new k(0,0,-1),new k(0,-1,0),new k(0,-1,0)],Rd=new At,ns=new k,To=new k;function Rv(i,e,t){let n=new kl;const r=new He,a=new He,o=new Pt,l=new Fp,d=new kp,h={},u=t.maxTextureSize,f={[Fi]:sn,[sn]:Fi,[Nn]:Nn},m=new Zn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new He},radius:{value:4}},vertexShader:Tv,fragmentShader:Av}),g=m.clone();g.defines.HORIZONTAL_PASS=1;const y=new Zt;y.setAttribute("position",new Ln(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new zt(y,m),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=fa;let p=this.type;this.render=function(L,D,j){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||L.length===0)return;L.type===qu&&(qe("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),L.type=fa);const S=i.getRenderTarget(),M=i.getActiveCubeFace(),U=i.getActiveMipmapLevel(),V=i.state;V.setBlending(hi),V.buffers.depth.getReversed()===!0?V.buffers.color.setClear(0,0,0,0):V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const H=p!==this.type;H&&D.traverse(function(K){K.material&&(Array.isArray(K.material)?K.material.forEach(Q=>Q.needsUpdate=!0):K.material.needsUpdate=!0)});for(let K=0,Q=L.length;K<Q;K++){const J=L[K],Y=J.shadow;if(Y===void 0){qe("WebGLShadowMap:",J,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;r.copy(Y.mapSize);const le=Y.getFrameExtents();if(r.multiply(le),a.copy(Y.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(a.x=Math.floor(u/le.x),r.x=a.x*le.x,Y.mapSize.x=a.x),r.y>u&&(a.y=Math.floor(u/le.y),r.y=a.y*le.y,Y.mapSize.y=a.y)),Y.map===null||H===!0){if(Y.map!==null&&(Y.map.depthTexture!==null&&(Y.map.depthTexture.dispose(),Y.map.depthTexture=null),Y.map.dispose()),this.type===is){if(J.isPointLight){qe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}Y.map=new Yn(r.x,r.y,{format:Ar,type:fi,minFilter:Jt,magFilter:Jt,generateMipmaps:!1}),Y.map.texture.name=J.name+".shadowMap",Y.map.depthTexture=new xs(r.x,r.y,Xn),Y.map.depthTexture.name=J.name+".shadowMapDepth",Y.map.depthTexture.format=pi,Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=Ht,Y.map.depthTexture.magFilter=Ht}else{J.isPointLight?(Y.map=new ah(r.x),Y.map.depthTexture=new _p(r.x,Kn)):(Y.map=new Yn(r.x,r.y),Y.map.depthTexture=new xs(r.x,r.y,Kn)),Y.map.depthTexture.name=J.name+".shadowMap",Y.map.depthTexture.format=pi;const ve=i.state.buffers.depth.getReversed();this.type===fa?(Y.map.depthTexture.compareFunction=ve?Pl:Rl,Y.map.depthTexture.minFilter=Jt,Y.map.depthTexture.magFilter=Jt):(Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=Ht,Y.map.depthTexture.magFilter=Ht)}Y.camera.updateProjectionMatrix()}const me=Y.map.isWebGLCubeRenderTarget?6:1;for(let ve=0;ve<me;ve++){if(Y.map.isWebGLCubeRenderTarget)i.setRenderTarget(Y.map,ve),i.clear();else{ve===0&&(i.setRenderTarget(Y.map),i.clear());const be=Y.getViewport(ve);o.set(a.x*be.x,a.y*be.y,a.x*be.z,a.y*be.w),V.viewport(o)}if(J.isPointLight){const be=Y.camera,pe=Y.matrix,Ke=J.distance||be.far;Ke!==be.far&&(be.far=Ke,be.updateProjectionMatrix()),ns.setFromMatrixPosition(J.matrixWorld),be.position.copy(ns),To.copy(be.position),To.add(Cv[ve]),be.up.copy(Nv[ve]),be.lookAt(To),be.updateMatrixWorld(),pe.makeTranslation(-ns.x,-ns.y,-ns.z),Rd.multiplyMatrices(be.projectionMatrix,be.matrixWorldInverse),Y._frustum.setFromProjectionMatrix(Rd,be.coordinateSystem,be.reversedDepth)}else Y.updateMatrices(J);n=Y.getFrustum(),C(D,j,Y.camera,J,this.type)}Y.isPointLightShadow!==!0&&this.type===is&&E(Y,j),Y.needsUpdate=!1}p=this.type,x.needsUpdate=!1,i.setRenderTarget(S,M,U)};function E(L,D){const j=e.update(_);m.defines.VSM_SAMPLES!==L.blurSamples&&(m.defines.VSM_SAMPLES=L.blurSamples,g.defines.VSM_SAMPLES=L.blurSamples,m.needsUpdate=!0,g.needsUpdate=!0),L.mapPass===null&&(L.mapPass=new Yn(r.x,r.y,{format:Ar,type:fi})),m.uniforms.shadow_pass.value=L.map.depthTexture,m.uniforms.resolution.value=L.mapSize,m.uniforms.radius.value=L.radius,i.setRenderTarget(L.mapPass),i.clear(),i.renderBufferDirect(D,null,j,m,_,null),g.uniforms.shadow_pass.value=L.mapPass.texture,g.uniforms.resolution.value=L.mapSize,g.uniforms.radius.value=L.radius,i.setRenderTarget(L.map),i.clear(),i.renderBufferDirect(D,null,j,g,_,null)}function T(L,D,j,S){let M=null;const U=j.isPointLight===!0?L.customDistanceMaterial:L.customDepthMaterial;if(U!==void 0)M=U;else if(M=j.isPointLight===!0?d:l,i.localClippingEnabled&&D.clipShadows===!0&&Array.isArray(D.clippingPlanes)&&D.clippingPlanes.length!==0||D.displacementMap&&D.displacementScale!==0||D.alphaMap&&D.alphaTest>0||D.map&&D.alphaTest>0||D.alphaToCoverage===!0){const V=M.uuid,H=D.uuid;let K=h[V];K===void 0&&(K={},h[V]=K);let Q=K[H];Q===void 0&&(Q=M.clone(),K[H]=Q,D.addEventListener("dispose",N)),M=Q}if(M.visible=D.visible,M.wireframe=D.wireframe,S===is?M.side=D.shadowSide!==null?D.shadowSide:D.side:M.side=D.shadowSide!==null?D.shadowSide:f[D.side],M.alphaMap=D.alphaMap,M.alphaTest=D.alphaToCoverage===!0?.5:D.alphaTest,M.map=D.map,M.clipShadows=D.clipShadows,M.clippingPlanes=D.clippingPlanes,M.clipIntersection=D.clipIntersection,M.displacementMap=D.displacementMap,M.displacementScale=D.displacementScale,M.displacementBias=D.displacementBias,M.wireframeLinewidth=D.wireframeLinewidth,M.linewidth=D.linewidth,j.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const V=i.properties.get(M);V.light=j}return M}function C(L,D,j,S,M){if(L.visible===!1)return;if(L.layers.test(D.layers)&&(L.isMesh||L.isLine||L.isPoints)&&(L.castShadow||L.receiveShadow&&M===is)&&(!L.frustumCulled||n.intersectsObject(L))){L.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,L.matrixWorld);const H=e.update(L),K=L.material;if(Array.isArray(K)){const Q=H.groups;for(let J=0,Y=Q.length;J<Y;J++){const le=Q[J],me=K[le.materialIndex];if(me&&me.visible){const ve=T(L,me,S,M);L.onBeforeShadow(i,L,D,j,H,ve,le),i.renderBufferDirect(j,null,H,ve,L,le),L.onAfterShadow(i,L,D,j,H,ve,le)}}}else if(K.visible){const Q=T(L,K,S,M);L.onBeforeShadow(i,L,D,j,H,Q,null),i.renderBufferDirect(j,null,H,Q,L,null),L.onAfterShadow(i,L,D,j,H,Q,null)}}const V=L.children;for(let H=0,K=V.length;H<K;H++)C(V[H],D,j,S,M)}function N(L){L.target.removeEventListener("dispose",N);for(const j in h){const S=h[j],M=L.target.uuid;M in S&&(S[M].dispose(),delete S[M])}}}const Pv={[Po]:Lo,[Do]:Fo,[Io]:ko,[Er]:Uo,[Lo]:Po,[Fo]:Do,[ko]:Io,[Uo]:Er};function Lv(i,e){function t(){let F=!1;const xe=new Pt;let de=null;const Se=new Pt(0,0,0,0);return{setMask:function(ce){de!==ce&&!F&&(i.colorMask(ce,ce,ce,ce),de=ce)},setLocked:function(ce){F=ce},setClear:function(ce,ne,ye,Ge,St){St===!0&&(ce*=Ge,ne*=Ge,ye*=Ge),xe.set(ce,ne,ye,Ge),Se.equals(xe)===!1&&(i.clearColor(ce,ne,ye,Ge),Se.copy(xe))},reset:function(){F=!1,de=null,Se.set(-1,0,0,0)}}}function n(){let F=!1,xe=!1,de=null,Se=null,ce=null;return{setReversed:function(ne){if(xe!==ne){const ye=e.get("EXT_clip_control");ne?ye.clipControlEXT(ye.LOWER_LEFT_EXT,ye.ZERO_TO_ONE_EXT):ye.clipControlEXT(ye.LOWER_LEFT_EXT,ye.NEGATIVE_ONE_TO_ONE_EXT),xe=ne;const Ge=ce;ce=null,this.setClear(Ge)}},getReversed:function(){return xe},setTest:function(ne){ne?oe(i.DEPTH_TEST):Ne(i.DEPTH_TEST)},setMask:function(ne){de!==ne&&!F&&(i.depthMask(ne),de=ne)},setFunc:function(ne){if(xe&&(ne=Pv[ne]),Se!==ne){switch(ne){case Po:i.depthFunc(i.NEVER);break;case Lo:i.depthFunc(i.ALWAYS);break;case Do:i.depthFunc(i.LESS);break;case Er:i.depthFunc(i.LEQUAL);break;case Io:i.depthFunc(i.EQUAL);break;case Uo:i.depthFunc(i.GEQUAL);break;case Fo:i.depthFunc(i.GREATER);break;case ko:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Se=ne}},setLocked:function(ne){F=ne},setClear:function(ne){ce!==ne&&(xe&&(ne=1-ne),i.clearDepth(ne),ce=ne)},reset:function(){F=!1,de=null,Se=null,ce=null,xe=!1}}}function r(){let F=!1,xe=null,de=null,Se=null,ce=null,ne=null,ye=null,Ge=null,St=null;return{setTest:function(Je){F||(Je?oe(i.STENCIL_TEST):Ne(i.STENCIL_TEST))},setMask:function(Je){xe!==Je&&!F&&(i.stencilMask(Je),xe=Je)},setFunc:function(Je,Qt,fn){(de!==Je||Se!==Qt||ce!==fn)&&(i.stencilFunc(Je,Qt,fn),de=Je,Se=Qt,ce=fn)},setOp:function(Je,Qt,fn){(ne!==Je||ye!==Qt||Ge!==fn)&&(i.stencilOp(Je,Qt,fn),ne=Je,ye=Qt,Ge=fn)},setLocked:function(Je){F=Je},setClear:function(Je){St!==Je&&(i.clearStencil(Je),St=Je)},reset:function(){F=!1,xe=null,de=null,Se=null,ce=null,ne=null,ye=null,Ge=null,St=null}}}const a=new t,o=new n,l=new r,d=new WeakMap,h=new WeakMap;let u={},f={},m=new WeakMap,g=[],y=null,_=!1,x=null,p=null,E=null,T=null,C=null,N=null,L=null,D=new ht(0,0,0),j=0,S=!1,M=null,U=null,V=null,H=null,K=null;const Q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let J=!1,Y=0;const le=i.getParameter(i.VERSION);le.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(le)[1]),J=Y>=1):le.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(le)[1]),J=Y>=2);let me=null,ve={};const be=i.getParameter(i.SCISSOR_BOX),pe=i.getParameter(i.VIEWPORT),Ke=new Pt().fromArray(be),nt=new Pt().fromArray(pe);function ut(F,xe,de,Se){const ce=new Uint8Array(4),ne=i.createTexture();i.bindTexture(F,ne),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ye=0;ye<de;ye++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(xe,0,i.RGBA,1,1,Se,0,i.RGBA,i.UNSIGNED_BYTE,ce):i.texImage2D(xe+ye,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ce);return ne}const te={};te[i.TEXTURE_2D]=ut(i.TEXTURE_2D,i.TEXTURE_2D,1),te[i.TEXTURE_CUBE_MAP]=ut(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),te[i.TEXTURE_2D_ARRAY]=ut(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),te[i.TEXTURE_3D]=ut(i.TEXTURE_3D,i.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),l.setClear(0),oe(i.DEPTH_TEST),o.setFunc(Er),Fe(!1),vt(Tc),oe(i.CULL_FACE),ot(hi);function oe(F){u[F]!==!0&&(i.enable(F),u[F]=!0)}function Ne(F){u[F]!==!1&&(i.disable(F),u[F]=!1)}function Ye(F,xe){return f[F]!==xe?(i.bindFramebuffer(F,xe),f[F]=xe,F===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=xe),F===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=xe),!0):!1}function Ce(F,xe){let de=g,Se=!1;if(F){de=m.get(xe),de===void 0&&(de=[],m.set(xe,de));const ce=F.textures;if(de.length!==ce.length||de[0]!==i.COLOR_ATTACHMENT0){for(let ne=0,ye=ce.length;ne<ye;ne++)de[ne]=i.COLOR_ATTACHMENT0+ne;de.length=ce.length,Se=!0}}else de[0]!==i.BACK&&(de[0]=i.BACK,Se=!0);Se&&i.drawBuffers(de)}function We(F){return y!==F?(i.useProgram(F),y=F,!0):!1}const Et={[$i]:i.FUNC_ADD,[Ku]:i.FUNC_SUBTRACT,[Ju]:i.FUNC_REVERSE_SUBTRACT};Et[Zu]=i.MIN,Et[Qu]=i.MAX;const et={[ef]:i.ZERO,[tf]:i.ONE,[nf]:i.SRC_COLOR,[No]:i.SRC_ALPHA,[cf]:i.SRC_ALPHA_SATURATE,[of]:i.DST_COLOR,[sf]:i.DST_ALPHA,[rf]:i.ONE_MINUS_SRC_COLOR,[Ro]:i.ONE_MINUS_SRC_ALPHA,[lf]:i.ONE_MINUS_DST_COLOR,[af]:i.ONE_MINUS_DST_ALPHA,[df]:i.CONSTANT_COLOR,[hf]:i.ONE_MINUS_CONSTANT_COLOR,[uf]:i.CONSTANT_ALPHA,[ff]:i.ONE_MINUS_CONSTANT_ALPHA};function ot(F,xe,de,Se,ce,ne,ye,Ge,St,Je){if(F===hi){_===!0&&(Ne(i.BLEND),_=!1);return}if(_===!1&&(oe(i.BLEND),_=!0),F!==Yu){if(F!==x||Je!==S){if((p!==$i||C!==$i)&&(i.blendEquation(i.FUNC_ADD),p=$i,C=$i),Je)switch(F){case wr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ac:i.blendFunc(i.ONE,i.ONE);break;case Cc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Nc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:ft("WebGLState: Invalid blending: ",F);break}else switch(F){case wr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ac:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Cc:ft("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Nc:ft("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ft("WebGLState: Invalid blending: ",F);break}E=null,T=null,N=null,L=null,D.set(0,0,0),j=0,x=F,S=Je}return}ce=ce||xe,ne=ne||de,ye=ye||Se,(xe!==p||ce!==C)&&(i.blendEquationSeparate(Et[xe],Et[ce]),p=xe,C=ce),(de!==E||Se!==T||ne!==N||ye!==L)&&(i.blendFuncSeparate(et[de],et[Se],et[ne],et[ye]),E=de,T=Se,N=ne,L=ye),(Ge.equals(D)===!1||St!==j)&&(i.blendColor(Ge.r,Ge.g,Ge.b,St),D.copy(Ge),j=St),x=F,S=!1}function je(F,xe){F.side===Nn?Ne(i.CULL_FACE):oe(i.CULL_FACE);let de=F.side===sn;xe&&(de=!de),Fe(de),F.blending===wr&&F.transparent===!1?ot(hi):ot(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),a.setMask(F.colorWrite);const Se=F.stencilWrite;l.setTest(Se),Se&&(l.setMask(F.stencilWriteMask),l.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),l.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),wt(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?oe(i.SAMPLE_ALPHA_TO_COVERAGE):Ne(i.SAMPLE_ALPHA_TO_COVERAGE)}function Fe(F){M!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),M=F)}function vt(F){F!==Xu?(oe(i.CULL_FACE),F!==U&&(F===Tc?i.cullFace(i.BACK):F===$u?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ne(i.CULL_FACE),U=F}function I(F){F!==V&&(J&&i.lineWidth(F),V=F)}function wt(F,xe,de){F?(oe(i.POLYGON_OFFSET_FILL),(H!==xe||K!==de)&&(i.polygonOffset(xe,de),H=xe,K=de)):Ne(i.POLYGON_OFFSET_FILL)}function Ie(F){F?oe(i.SCISSOR_TEST):Ne(i.SCISSOR_TEST)}function ct(F){F===void 0&&(F=i.TEXTURE0+Q-1),me!==F&&(i.activeTexture(F),me=F)}function ge(F,xe,de){de===void 0&&(me===null?de=i.TEXTURE0+Q-1:de=me);let Se=ve[de];Se===void 0&&(Se={type:void 0,texture:void 0},ve[de]=Se),(Se.type!==F||Se.texture!==xe)&&(me!==de&&(i.activeTexture(de),me=de),i.bindTexture(F,xe||te[F]),Se.type=F,Se.texture=xe)}function A(){const F=ve[me];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function v(){try{i.compressedTexImage2D(...arguments)}catch(F){ft("WebGLState:",F)}}function O(){try{i.compressedTexImage3D(...arguments)}catch(F){ft("WebGLState:",F)}}function P(){try{i.texSubImage2D(...arguments)}catch(F){ft("WebGLState:",F)}}function q(){try{i.texSubImage3D(...arguments)}catch(F){ft("WebGLState:",F)}}function G(){try{i.compressedTexSubImage2D(...arguments)}catch(F){ft("WebGLState:",F)}}function Me(){try{i.compressedTexSubImage3D(...arguments)}catch(F){ft("WebGLState:",F)}}function se(){try{i.texStorage2D(...arguments)}catch(F){ft("WebGLState:",F)}}function Re(){try{i.texStorage3D(...arguments)}catch(F){ft("WebGLState:",F)}}function he(){try{i.texImage2D(...arguments)}catch(F){ft("WebGLState:",F)}}function ee(){try{i.texImage3D(...arguments)}catch(F){ft("WebGLState:",F)}}function ae(F){Ke.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),Ke.copy(F))}function Te(F){nt.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),nt.copy(F))}function _e(F,xe){let de=h.get(xe);de===void 0&&(de=new WeakMap,h.set(xe,de));let Se=de.get(F);Se===void 0&&(Se=i.getUniformBlockIndex(xe,F.name),de.set(F,Se))}function ue(F,xe){const Se=h.get(xe).get(F);d.get(xe)!==Se&&(i.uniformBlockBinding(xe,Se,F.__bindingPointIndex),d.set(xe,Se))}function Be(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},me=null,ve={},f={},m=new WeakMap,g=[],y=null,_=!1,x=null,p=null,E=null,T=null,C=null,N=null,L=null,D=new ht(0,0,0),j=0,S=!1,M=null,U=null,V=null,H=null,K=null,Ke.set(0,0,i.canvas.width,i.canvas.height),nt.set(0,0,i.canvas.width,i.canvas.height),a.reset(),o.reset(),l.reset()}return{buffers:{color:a,depth:o,stencil:l},enable:oe,disable:Ne,bindFramebuffer:Ye,drawBuffers:Ce,useProgram:We,setBlending:ot,setMaterial:je,setFlipSided:Fe,setCullFace:vt,setLineWidth:I,setPolygonOffset:wt,setScissorTest:Ie,activeTexture:ct,bindTexture:ge,unbindTexture:A,compressedTexImage2D:v,compressedTexImage3D:O,texImage2D:he,texImage3D:ee,updateUBOMapping:_e,uniformBlockBinding:ue,texStorage2D:se,texStorage3D:Re,texSubImage2D:P,texSubImage3D:q,compressedTexSubImage2D:G,compressedTexSubImage3D:Me,scissor:ae,viewport:Te,reset:Be}}function Dv(i,e,t,n,r,a,o){const l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,d=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new He,u=new WeakMap;let f;const m=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(A,v){return g?new OffscreenCanvas(A,v):ps("canvas")}function _(A,v,O){let P=1;const q=ge(A);if((q.width>O||q.height>O)&&(P=O/Math.max(q.width,q.height)),P<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const G=Math.floor(P*q.width),Me=Math.floor(P*q.height);f===void 0&&(f=y(G,Me));const se=v?y(G,Me):f;return se.width=G,se.height=Me,se.getContext("2d").drawImage(A,0,0,G,Me),qe("WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+G+"x"+Me+")."),se}else return"data"in A&&qe("WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),A;return A}function x(A){return A.generateMipmaps}function p(A){i.generateMipmap(A)}function E(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function T(A,v,O,P,q=!1){if(A!==null){if(i[A]!==void 0)return i[A];qe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let G=v;if(v===i.RED&&(O===i.FLOAT&&(G=i.R32F),O===i.HALF_FLOAT&&(G=i.R16F),O===i.UNSIGNED_BYTE&&(G=i.R8)),v===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.R8UI),O===i.UNSIGNED_SHORT&&(G=i.R16UI),O===i.UNSIGNED_INT&&(G=i.R32UI),O===i.BYTE&&(G=i.R8I),O===i.SHORT&&(G=i.R16I),O===i.INT&&(G=i.R32I)),v===i.RG&&(O===i.FLOAT&&(G=i.RG32F),O===i.HALF_FLOAT&&(G=i.RG16F),O===i.UNSIGNED_BYTE&&(G=i.RG8)),v===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.RG8UI),O===i.UNSIGNED_SHORT&&(G=i.RG16UI),O===i.UNSIGNED_INT&&(G=i.RG32UI),O===i.BYTE&&(G=i.RG8I),O===i.SHORT&&(G=i.RG16I),O===i.INT&&(G=i.RG32I)),v===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.RGB8UI),O===i.UNSIGNED_SHORT&&(G=i.RGB16UI),O===i.UNSIGNED_INT&&(G=i.RGB32UI),O===i.BYTE&&(G=i.RGB8I),O===i.SHORT&&(G=i.RGB16I),O===i.INT&&(G=i.RGB32I)),v===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(G=i.RGBA16UI),O===i.UNSIGNED_INT&&(G=i.RGBA32UI),O===i.BYTE&&(G=i.RGBA8I),O===i.SHORT&&(G=i.RGBA16I),O===i.INT&&(G=i.RGBA32I)),v===i.RGB&&(O===i.UNSIGNED_INT_5_9_9_9_REV&&(G=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&(G=i.R11F_G11F_B10F)),v===i.RGBA){const Me=q?_a:pt.getTransfer(P);O===i.FLOAT&&(G=i.RGBA32F),O===i.HALF_FLOAT&&(G=i.RGBA16F),O===i.UNSIGNED_BYTE&&(G=Me===bt?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(G=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(G=i.RGB5_A1)}return(G===i.R16F||G===i.R32F||G===i.RG16F||G===i.RG32F||G===i.RGBA16F||G===i.RGBA32F)&&e.get("EXT_color_buffer_float"),G}function C(A,v){let O;return A?v===null||v===Kn||v===fs?O=i.DEPTH24_STENCIL8:v===Xn?O=i.DEPTH32F_STENCIL8:v===us&&(O=i.DEPTH24_STENCIL8,qe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Kn||v===fs?O=i.DEPTH_COMPONENT24:v===Xn?O=i.DEPTH_COMPONENT32F:v===us&&(O=i.DEPTH_COMPONENT16),O}function N(A,v){return x(A)===!0||A.isFramebufferTexture&&A.minFilter!==Ht&&A.minFilter!==Jt?Math.log2(Math.max(v.width,v.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?v.mipmaps.length:1}function L(A){const v=A.target;v.removeEventListener("dispose",L),j(v),v.isVideoTexture&&u.delete(v)}function D(A){const v=A.target;v.removeEventListener("dispose",D),M(v)}function j(A){const v=n.get(A);if(v.__webglInit===void 0)return;const O=A.source,P=m.get(O);if(P){const q=P[v.__cacheKey];q.usedTimes--,q.usedTimes===0&&S(A),Object.keys(P).length===0&&m.delete(O)}n.remove(A)}function S(A){const v=n.get(A);i.deleteTexture(v.__webglTexture);const O=A.source,P=m.get(O);delete P[v.__cacheKey],o.memory.textures--}function M(A){const v=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let P=0;P<6;P++){if(Array.isArray(v.__webglFramebuffer[P]))for(let q=0;q<v.__webglFramebuffer[P].length;q++)i.deleteFramebuffer(v.__webglFramebuffer[P][q]);else i.deleteFramebuffer(v.__webglFramebuffer[P]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[P])}else{if(Array.isArray(v.__webglFramebuffer))for(let P=0;P<v.__webglFramebuffer.length;P++)i.deleteFramebuffer(v.__webglFramebuffer[P]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let P=0;P<v.__webglColorRenderbuffer.length;P++)v.__webglColorRenderbuffer[P]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[P]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const O=A.textures;for(let P=0,q=O.length;P<q;P++){const G=n.get(O[P]);G.__webglTexture&&(i.deleteTexture(G.__webglTexture),o.memory.textures--),n.remove(O[P])}n.remove(A)}let U=0;function V(){U=0}function H(){const A=U;return A>=r.maxTextures&&qe("WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+r.maxTextures),U+=1,A}function K(A){const v=[];return v.push(A.wrapS),v.push(A.wrapT),v.push(A.wrapR||0),v.push(A.magFilter),v.push(A.minFilter),v.push(A.anisotropy),v.push(A.internalFormat),v.push(A.format),v.push(A.type),v.push(A.generateMipmaps),v.push(A.premultiplyAlpha),v.push(A.flipY),v.push(A.unpackAlignment),v.push(A.colorSpace),v.join()}function Q(A,v){const O=n.get(A);if(A.isVideoTexture&&Ie(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&O.__version!==A.version){const P=A.image;if(P===null)qe("WebGLRenderer: Texture marked for update but no image data found.");else if(P.complete===!1)qe("WebGLRenderer: Texture marked for update but image is incomplete");else{te(O,A,v);return}}else A.isExternalTexture&&(O.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+v)}function J(A,v){const O=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&O.__version!==A.version){te(O,A,v);return}else A.isExternalTexture&&(O.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+v)}function Y(A,v){const O=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&O.__version!==A.version){te(O,A,v);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+v)}function le(A,v){const O=n.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&O.__version!==A.version){oe(O,A,v);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+v)}const me={[Bo]:i.REPEAT,[di]:i.CLAMP_TO_EDGE,[zo]:i.MIRRORED_REPEAT},ve={[Ht]:i.NEAREST,[gf]:i.NEAREST_MIPMAP_NEAREST,[zs]:i.NEAREST_MIPMAP_LINEAR,[Jt]:i.LINEAR,[Wa]:i.LINEAR_MIPMAP_NEAREST,[Yi]:i.LINEAR_MIPMAP_LINEAR},be={[_f]:i.NEVER,[Mf]:i.ALWAYS,[yf]:i.LESS,[Rl]:i.LEQUAL,[bf]:i.EQUAL,[Pl]:i.GEQUAL,[Sf]:i.GREATER,[wf]:i.NOTEQUAL};function pe(A,v){if(v.type===Xn&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===Jt||v.magFilter===Wa||v.magFilter===zs||v.magFilter===Yi||v.minFilter===Jt||v.minFilter===Wa||v.minFilter===zs||v.minFilter===Yi)&&qe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,me[v.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,me[v.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,me[v.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,ve[v.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,ve[v.minFilter]),v.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,be[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Ht||v.minFilter!==zs&&v.minFilter!==Yi||v.type===Xn&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");i.texParameterf(A,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,r.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function Ke(A,v){let O=!1;A.__webglInit===void 0&&(A.__webglInit=!0,v.addEventListener("dispose",L));const P=v.source;let q=m.get(P);q===void 0&&(q={},m.set(P,q));const G=K(v);if(G!==A.__cacheKey){q[G]===void 0&&(q[G]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,O=!0),q[G].usedTimes++;const Me=q[A.__cacheKey];Me!==void 0&&(q[A.__cacheKey].usedTimes--,Me.usedTimes===0&&S(v)),A.__cacheKey=G,A.__webglTexture=q[G].texture}return O}function nt(A,v,O){return Math.floor(Math.floor(A/O)/v)}function ut(A,v,O,P){const G=A.updateRanges;if(G.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,v.width,v.height,O,P,v.data);else{G.sort((ee,ae)=>ee.start-ae.start);let Me=0;for(let ee=1;ee<G.length;ee++){const ae=G[Me],Te=G[ee],_e=ae.start+ae.count,ue=nt(Te.start,v.width,4),Be=nt(ae.start,v.width,4);Te.start<=_e+1&&ue===Be&&nt(Te.start+Te.count-1,v.width,4)===ue?ae.count=Math.max(ae.count,Te.start+Te.count-ae.start):(++Me,G[Me]=Te)}G.length=Me+1;const se=i.getParameter(i.UNPACK_ROW_LENGTH),Re=i.getParameter(i.UNPACK_SKIP_PIXELS),he=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,v.width);for(let ee=0,ae=G.length;ee<ae;ee++){const Te=G[ee],_e=Math.floor(Te.start/4),ue=Math.ceil(Te.count/4),Be=_e%v.width,F=Math.floor(_e/v.width),xe=ue,de=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Be),i.pixelStorei(i.UNPACK_SKIP_ROWS,F),t.texSubImage2D(i.TEXTURE_2D,0,Be,F,xe,de,O,P,v.data)}A.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,se),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Re),i.pixelStorei(i.UNPACK_SKIP_ROWS,he)}}function te(A,v,O){let P=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(P=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(P=i.TEXTURE_3D);const q=Ke(A,v),G=v.source;t.bindTexture(P,A.__webglTexture,i.TEXTURE0+O);const Me=n.get(G);if(G.version!==Me.__version||q===!0){t.activeTexture(i.TEXTURE0+O);const se=pt.getPrimaries(pt.workingColorSpace),Re=v.colorSpace===Ii?null:pt.getPrimaries(v.colorSpace),he=v.colorSpace===Ii||se===Re?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,he);let ee=_(v.image,!1,r.maxTextureSize);ee=ct(v,ee);const ae=a.convert(v.format,v.colorSpace),Te=a.convert(v.type);let _e=T(v.internalFormat,ae,Te,v.colorSpace,v.isVideoTexture);pe(P,v);let ue;const Be=v.mipmaps,F=v.isVideoTexture!==!0,xe=Me.__version===void 0||q===!0,de=G.dataReady,Se=N(v,ee);if(v.isDepthTexture)_e=C(v.format===Ki,v.type),xe&&(F?t.texStorage2D(i.TEXTURE_2D,1,_e,ee.width,ee.height):t.texImage2D(i.TEXTURE_2D,0,_e,ee.width,ee.height,0,ae,Te,null));else if(v.isDataTexture)if(Be.length>0){F&&xe&&t.texStorage2D(i.TEXTURE_2D,Se,_e,Be[0].width,Be[0].height);for(let ce=0,ne=Be.length;ce<ne;ce++)ue=Be[ce],F?de&&t.texSubImage2D(i.TEXTURE_2D,ce,0,0,ue.width,ue.height,ae,Te,ue.data):t.texImage2D(i.TEXTURE_2D,ce,_e,ue.width,ue.height,0,ae,Te,ue.data);v.generateMipmaps=!1}else F?(xe&&t.texStorage2D(i.TEXTURE_2D,Se,_e,ee.width,ee.height),de&&ut(v,ee,ae,Te)):t.texImage2D(i.TEXTURE_2D,0,_e,ee.width,ee.height,0,ae,Te,ee.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){F&&xe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Se,_e,Be[0].width,Be[0].height,ee.depth);for(let ce=0,ne=Be.length;ce<ne;ce++)if(ue=Be[ce],v.format!==Pn)if(ae!==null)if(F){if(de)if(v.layerUpdates.size>0){const ye=od(ue.width,ue.height,v.format,v.type);for(const Ge of v.layerUpdates){const St=ue.data.subarray(Ge*ye/ue.data.BYTES_PER_ELEMENT,(Ge+1)*ye/ue.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ce,0,0,Ge,ue.width,ue.height,1,ae,St)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ce,0,0,0,ue.width,ue.height,ee.depth,ae,ue.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ce,_e,ue.width,ue.height,ee.depth,0,ue.data,0,0);else qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else F?de&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ce,0,0,0,ue.width,ue.height,ee.depth,ae,Te,ue.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ce,_e,ue.width,ue.height,ee.depth,0,ae,Te,ue.data)}else{F&&xe&&t.texStorage2D(i.TEXTURE_2D,Se,_e,Be[0].width,Be[0].height);for(let ce=0,ne=Be.length;ce<ne;ce++)ue=Be[ce],v.format!==Pn?ae!==null?F?de&&t.compressedTexSubImage2D(i.TEXTURE_2D,ce,0,0,ue.width,ue.height,ae,ue.data):t.compressedTexImage2D(i.TEXTURE_2D,ce,_e,ue.width,ue.height,0,ue.data):qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):F?de&&t.texSubImage2D(i.TEXTURE_2D,ce,0,0,ue.width,ue.height,ae,Te,ue.data):t.texImage2D(i.TEXTURE_2D,ce,_e,ue.width,ue.height,0,ae,Te,ue.data)}else if(v.isDataArrayTexture)if(F){if(xe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Se,_e,ee.width,ee.height,ee.depth),de)if(v.layerUpdates.size>0){const ce=od(ee.width,ee.height,v.format,v.type);for(const ne of v.layerUpdates){const ye=ee.data.subarray(ne*ce/ee.data.BYTES_PER_ELEMENT,(ne+1)*ce/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ne,ee.width,ee.height,1,ae,Te,ye)}v.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,ae,Te,ee.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,_e,ee.width,ee.height,ee.depth,0,ae,Te,ee.data);else if(v.isData3DTexture)F?(xe&&t.texStorage3D(i.TEXTURE_3D,Se,_e,ee.width,ee.height,ee.depth),de&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,ae,Te,ee.data)):t.texImage3D(i.TEXTURE_3D,0,_e,ee.width,ee.height,ee.depth,0,ae,Te,ee.data);else if(v.isFramebufferTexture){if(xe)if(F)t.texStorage2D(i.TEXTURE_2D,Se,_e,ee.width,ee.height);else{let ce=ee.width,ne=ee.height;for(let ye=0;ye<Se;ye++)t.texImage2D(i.TEXTURE_2D,ye,_e,ce,ne,0,ae,Te,null),ce>>=1,ne>>=1}}else if(Be.length>0){if(F&&xe){const ce=ge(Be[0]);t.texStorage2D(i.TEXTURE_2D,Se,_e,ce.width,ce.height)}for(let ce=0,ne=Be.length;ce<ne;ce++)ue=Be[ce],F?de&&t.texSubImage2D(i.TEXTURE_2D,ce,0,0,ae,Te,ue):t.texImage2D(i.TEXTURE_2D,ce,_e,ae,Te,ue);v.generateMipmaps=!1}else if(F){if(xe){const ce=ge(ee);t.texStorage2D(i.TEXTURE_2D,Se,_e,ce.width,ce.height)}de&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ae,Te,ee)}else t.texImage2D(i.TEXTURE_2D,0,_e,ae,Te,ee);x(v)&&p(P),Me.__version=G.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function oe(A,v,O){if(v.image.length!==6)return;const P=Ke(A,v),q=v.source;t.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+O);const G=n.get(q);if(q.version!==G.__version||P===!0){t.activeTexture(i.TEXTURE0+O);const Me=pt.getPrimaries(pt.workingColorSpace),se=v.colorSpace===Ii?null:pt.getPrimaries(v.colorSpace),Re=v.colorSpace===Ii||Me===se?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Re);const he=v.isCompressedTexture||v.image[0].isCompressedTexture,ee=v.image[0]&&v.image[0].isDataTexture,ae=[];for(let ne=0;ne<6;ne++)!he&&!ee?ae[ne]=_(v.image[ne],!0,r.maxCubemapSize):ae[ne]=ee?v.image[ne].image:v.image[ne],ae[ne]=ct(v,ae[ne]);const Te=ae[0],_e=a.convert(v.format,v.colorSpace),ue=a.convert(v.type),Be=T(v.internalFormat,_e,ue,v.colorSpace),F=v.isVideoTexture!==!0,xe=G.__version===void 0||P===!0,de=q.dataReady;let Se=N(v,Te);pe(i.TEXTURE_CUBE_MAP,v);let ce;if(he){F&&xe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Se,Be,Te.width,Te.height);for(let ne=0;ne<6;ne++){ce=ae[ne].mipmaps;for(let ye=0;ye<ce.length;ye++){const Ge=ce[ye];v.format!==Pn?_e!==null?F?de&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ye,0,0,Ge.width,Ge.height,_e,Ge.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ye,Be,Ge.width,Ge.height,0,Ge.data):qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ye,0,0,Ge.width,Ge.height,_e,ue,Ge.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ye,Be,Ge.width,Ge.height,0,_e,ue,Ge.data)}}}else{if(ce=v.mipmaps,F&&xe){ce.length>0&&Se++;const ne=ge(ae[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Se,Be,ne.width,ne.height)}for(let ne=0;ne<6;ne++)if(ee){F?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,ae[ne].width,ae[ne].height,_e,ue,ae[ne].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,Be,ae[ne].width,ae[ne].height,0,_e,ue,ae[ne].data);for(let ye=0;ye<ce.length;ye++){const St=ce[ye].image[ne].image;F?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ye+1,0,0,St.width,St.height,_e,ue,St.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ye+1,Be,St.width,St.height,0,_e,ue,St.data)}}else{F?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,_e,ue,ae[ne]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,Be,_e,ue,ae[ne]);for(let ye=0;ye<ce.length;ye++){const Ge=ce[ye];F?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ye+1,0,0,_e,ue,Ge.image[ne]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ye+1,Be,_e,ue,Ge.image[ne])}}}x(v)&&p(i.TEXTURE_CUBE_MAP),G.__version=q.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function Ne(A,v,O,P,q,G){const Me=a.convert(O.format,O.colorSpace),se=a.convert(O.type),Re=T(O.internalFormat,Me,se,O.colorSpace),he=n.get(v),ee=n.get(O);if(ee.__renderTarget=v,!he.__hasExternalTextures){const ae=Math.max(1,v.width>>G),Te=Math.max(1,v.height>>G);q===i.TEXTURE_3D||q===i.TEXTURE_2D_ARRAY?t.texImage3D(q,G,Re,ae,Te,v.depth,0,Me,se,null):t.texImage2D(q,G,Re,ae,Te,0,Me,se,null)}t.bindFramebuffer(i.FRAMEBUFFER,A),wt(v)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,P,q,ee.__webglTexture,0,I(v)):(q===i.TEXTURE_2D||q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,P,q,ee.__webglTexture,G),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ye(A,v,O){if(i.bindRenderbuffer(i.RENDERBUFFER,A),v.depthBuffer){const P=v.depthTexture,q=P&&P.isDepthTexture?P.type:null,G=C(v.stencilBuffer,q),Me=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;wt(v)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,I(v),G,v.width,v.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,I(v),G,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,G,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Me,i.RENDERBUFFER,A)}else{const P=v.textures;for(let q=0;q<P.length;q++){const G=P[q],Me=a.convert(G.format,G.colorSpace),se=a.convert(G.type),Re=T(G.internalFormat,Me,se,G.colorSpace);wt(v)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,I(v),Re,v.width,v.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,I(v),Re,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,Re,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ce(A,v,O){const P=v.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,A),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const q=n.get(v.depthTexture);if(q.__renderTarget=v,(!q.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),P){if(q.__webglInit===void 0&&(q.__webglInit=!0,v.depthTexture.addEventListener("dispose",L)),q.__webglTexture===void 0){q.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture),pe(i.TEXTURE_CUBE_MAP,v.depthTexture);const he=a.convert(v.depthTexture.format),ee=a.convert(v.depthTexture.type);let ae;v.depthTexture.format===pi?ae=i.DEPTH_COMPONENT24:v.depthTexture.format===Ki&&(ae=i.DEPTH24_STENCIL8);for(let Te=0;Te<6;Te++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,ae,v.width,v.height,0,he,ee,null)}}else Q(v.depthTexture,0);const G=q.__webglTexture,Me=I(v),se=P?i.TEXTURE_CUBE_MAP_POSITIVE_X+O:i.TEXTURE_2D,Re=v.depthTexture.format===Ki?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(v.depthTexture.format===pi)wt(v)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Re,se,G,0,Me):i.framebufferTexture2D(i.FRAMEBUFFER,Re,se,G,0);else if(v.depthTexture.format===Ki)wt(v)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Re,se,G,0,Me):i.framebufferTexture2D(i.FRAMEBUFFER,Re,se,G,0);else throw new Error("Unknown depthTexture format")}function We(A){const v=n.get(A),O=A.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==A.depthTexture){const P=A.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),P){const q=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,P.removeEventListener("dispose",q)};P.addEventListener("dispose",q),v.__depthDisposeCallback=q}v.__boundDepthTexture=P}if(A.depthTexture&&!v.__autoAllocateDepthBuffer)if(O)for(let P=0;P<6;P++)Ce(v.__webglFramebuffer[P],A,P);else{const P=A.texture.mipmaps;P&&P.length>0?Ce(v.__webglFramebuffer[0],A,0):Ce(v.__webglFramebuffer,A,0)}else if(O){v.__webglDepthbuffer=[];for(let P=0;P<6;P++)if(t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[P]),v.__webglDepthbuffer[P]===void 0)v.__webglDepthbuffer[P]=i.createRenderbuffer(),Ye(v.__webglDepthbuffer[P],A,!1);else{const q=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,G=v.__webglDepthbuffer[P];i.bindRenderbuffer(i.RENDERBUFFER,G),i.framebufferRenderbuffer(i.FRAMEBUFFER,q,i.RENDERBUFFER,G)}}else{const P=A.texture.mipmaps;if(P&&P.length>0?t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),Ye(v.__webglDepthbuffer,A,!1);else{const q=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,G=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,G),i.framebufferRenderbuffer(i.FRAMEBUFFER,q,i.RENDERBUFFER,G)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Et(A,v,O){const P=n.get(A);v!==void 0&&Ne(P.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&We(A)}function et(A){const v=A.texture,O=n.get(A),P=n.get(v);A.addEventListener("dispose",D);const q=A.textures,G=A.isWebGLCubeRenderTarget===!0,Me=q.length>1;if(Me||(P.__webglTexture===void 0&&(P.__webglTexture=i.createTexture()),P.__version=v.version,o.memory.textures++),G){O.__webglFramebuffer=[];for(let se=0;se<6;se++)if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer[se]=[];for(let Re=0;Re<v.mipmaps.length;Re++)O.__webglFramebuffer[se][Re]=i.createFramebuffer()}else O.__webglFramebuffer[se]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer=[];for(let se=0;se<v.mipmaps.length;se++)O.__webglFramebuffer[se]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(Me)for(let se=0,Re=q.length;se<Re;se++){const he=n.get(q[se]);he.__webglTexture===void 0&&(he.__webglTexture=i.createTexture(),o.memory.textures++)}if(A.samples>0&&wt(A)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let se=0;se<q.length;se++){const Re=q[se];O.__webglColorRenderbuffer[se]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[se]);const he=a.convert(Re.format,Re.colorSpace),ee=a.convert(Re.type),ae=T(Re.internalFormat,he,ee,Re.colorSpace,A.isXRRenderTarget===!0),Te=I(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,Te,ae,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+se,i.RENDERBUFFER,O.__webglColorRenderbuffer[se])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Ye(O.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(G){t.bindTexture(i.TEXTURE_CUBE_MAP,P.__webglTexture),pe(i.TEXTURE_CUBE_MAP,v);for(let se=0;se<6;se++)if(v.mipmaps&&v.mipmaps.length>0)for(let Re=0;Re<v.mipmaps.length;Re++)Ne(O.__webglFramebuffer[se][Re],A,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Re);else Ne(O.__webglFramebuffer[se],A,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0);x(v)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Me){for(let se=0,Re=q.length;se<Re;se++){const he=q[se],ee=n.get(he);let ae=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ae=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ae,ee.__webglTexture),pe(ae,he),Ne(O.__webglFramebuffer,A,he,i.COLOR_ATTACHMENT0+se,ae,0),x(he)&&p(ae)}t.unbindTexture()}else{let se=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(se=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(se,P.__webglTexture),pe(se,v),v.mipmaps&&v.mipmaps.length>0)for(let Re=0;Re<v.mipmaps.length;Re++)Ne(O.__webglFramebuffer[Re],A,v,i.COLOR_ATTACHMENT0,se,Re);else Ne(O.__webglFramebuffer,A,v,i.COLOR_ATTACHMENT0,se,0);x(v)&&p(se),t.unbindTexture()}A.depthBuffer&&We(A)}function ot(A){const v=A.textures;for(let O=0,P=v.length;O<P;O++){const q=v[O];if(x(q)){const G=E(A),Me=n.get(q).__webglTexture;t.bindTexture(G,Me),p(G),t.unbindTexture()}}}const je=[],Fe=[];function vt(A){if(A.samples>0){if(wt(A)===!1){const v=A.textures,O=A.width,P=A.height;let q=i.COLOR_BUFFER_BIT;const G=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Me=n.get(A),se=v.length>1;if(se)for(let he=0;he<v.length;he++)t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+he,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+he,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Me.__webglMultisampledFramebuffer);const Re=A.texture.mipmaps;Re&&Re.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglFramebuffer);for(let he=0;he<v.length;he++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(q|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(q|=i.STENCIL_BUFFER_BIT)),se){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Me.__webglColorRenderbuffer[he]);const ee=n.get(v[he]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ee,0)}i.blitFramebuffer(0,0,O,P,0,0,O,P,q,i.NEAREST),d===!0&&(je.length=0,Fe.length=0,je.push(i.COLOR_ATTACHMENT0+he),A.depthBuffer&&A.resolveDepthBuffer===!1&&(je.push(G),Fe.push(G),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Fe)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,je))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),se)for(let he=0;he<v.length;he++){t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+he,i.RENDERBUFFER,Me.__webglColorRenderbuffer[he]);const ee=n.get(v[he]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+he,i.TEXTURE_2D,ee,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&d){const v=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function I(A){return Math.min(r.maxSamples,A.samples)}function wt(A){const v=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function Ie(A){const v=o.render.frame;u.get(A)!==v&&(u.set(A,v),A.update())}function ct(A,v){const O=A.colorSpace,P=A.format,q=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||O!==Cr&&O!==Ii&&(pt.getTransfer(O)===bt?(P!==Pn||q!==un)&&qe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ft("WebGLTextures: Unsupported texture color space:",O)),v}function ge(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(h.width=A.naturalWidth||A.width,h.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(h.width=A.displayWidth,h.height=A.displayHeight):(h.width=A.width,h.height=A.height),h}this.allocateTextureUnit=H,this.resetTextureUnits=V,this.setTexture2D=Q,this.setTexture2DArray=J,this.setTexture3D=Y,this.setTextureCube=le,this.rebindTextures=Et,this.setupRenderTarget=et,this.updateRenderTargetMipmap=ot,this.updateMultisampleRenderTarget=vt,this.setupDepthRenderbuffer=We,this.setupFrameBufferTexture=Ne,this.useMultisampledRTT=wt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Iv(i,e){function t(n,r=Ii){let a;const o=pt.getTransfer(r);if(n===un)return i.UNSIGNED_BYTE;if(n===El)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Tl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Xd)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===$d)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Hd)return i.BYTE;if(n===Wd)return i.SHORT;if(n===us)return i.UNSIGNED_SHORT;if(n===Ml)return i.INT;if(n===Kn)return i.UNSIGNED_INT;if(n===Xn)return i.FLOAT;if(n===fi)return i.HALF_FLOAT;if(n===qd)return i.ALPHA;if(n===Yd)return i.RGB;if(n===Pn)return i.RGBA;if(n===pi)return i.DEPTH_COMPONENT;if(n===Ki)return i.DEPTH_STENCIL;if(n===Kd)return i.RED;if(n===Al)return i.RED_INTEGER;if(n===Ar)return i.RG;if(n===Cl)return i.RG_INTEGER;if(n===Nl)return i.RGBA_INTEGER;if(n===pa||n===ma||n===ga||n===xa)if(o===bt)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(n===pa)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ma)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ga)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===xa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(n===pa)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ma)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ga)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===xa)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Go||n===Vo||n===Ho||n===Wo)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(n===Go)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Vo)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ho)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Wo)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Xo||n===$o||n===qo||n===Yo||n===Ko||n===Jo||n===Zo)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(n===Xo||n===$o)return o===bt?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===qo)return o===bt?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(n===Yo)return a.COMPRESSED_R11_EAC;if(n===Ko)return a.COMPRESSED_SIGNED_R11_EAC;if(n===Jo)return a.COMPRESSED_RG11_EAC;if(n===Zo)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Qo||n===el||n===tl||n===nl||n===il||n===rl||n===sl||n===al||n===ol||n===ll||n===cl||n===dl||n===hl||n===ul)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(n===Qo)return o===bt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===el)return o===bt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===tl)return o===bt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===nl)return o===bt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===il)return o===bt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===rl)return o===bt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===sl)return o===bt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===al)return o===bt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ol)return o===bt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ll)return o===bt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===cl)return o===bt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===dl)return o===bt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===hl)return o===bt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ul)return o===bt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===fl||n===pl||n===ml)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(n===fl)return o===bt?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===pl)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ml)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===gl||n===xl||n===vl||n===_l)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(n===gl)return a.COMPRESSED_RED_RGTC1_EXT;if(n===xl)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===vl)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===_l)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===fs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const Uv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Fv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class kv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new lh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Zn({vertexShader:Uv,fragmentShader:Fv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new zt(new Rr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Ov extends Pr{constructor(e,t){super();const n=this;let r=null,a=1,o=null,l="local-floor",d=1,h=null,u=null,f=null,m=null,g=null,y=null;const _=typeof XRWebGLBinding<"u",x=new kv,p={},E=t.getContextAttributes();let T=null,C=null;const N=[],L=[],D=new He;let j=null;const S=new bn;S.viewport=new Pt;const M=new bn;M.viewport=new Pt;const U=[S,M],V=new Xp;let H=null,K=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(te){let oe=N[te];return oe===void 0&&(oe=new fo,N[te]=oe),oe.getTargetRaySpace()},this.getControllerGrip=function(te){let oe=N[te];return oe===void 0&&(oe=new fo,N[te]=oe),oe.getGripSpace()},this.getHand=function(te){let oe=N[te];return oe===void 0&&(oe=new fo,N[te]=oe),oe.getHandSpace()};function Q(te){const oe=L.indexOf(te.inputSource);if(oe===-1)return;const Ne=N[oe];Ne!==void 0&&(Ne.update(te.inputSource,te.frame,h||o),Ne.dispatchEvent({type:te.type,data:te.inputSource}))}function J(){r.removeEventListener("select",Q),r.removeEventListener("selectstart",Q),r.removeEventListener("selectend",Q),r.removeEventListener("squeeze",Q),r.removeEventListener("squeezestart",Q),r.removeEventListener("squeezeend",Q),r.removeEventListener("end",J),r.removeEventListener("inputsourceschange",Y);for(let te=0;te<N.length;te++){const oe=L[te];oe!==null&&(L[te]=null,N[te].disconnect(oe))}H=null,K=null,x.reset();for(const te in p)delete p[te];e.setRenderTarget(T),g=null,m=null,f=null,r=null,C=null,ut.stop(),n.isPresenting=!1,e.setPixelRatio(j),e.setSize(D.width,D.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(te){a=te,n.isPresenting===!0&&qe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(te){l=te,n.isPresenting===!0&&qe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||o},this.setReferenceSpace=function(te){h=te},this.getBaseLayer=function(){return m!==null?m:g},this.getBinding=function(){return f===null&&_&&(f=new XRWebGLBinding(r,t)),f},this.getFrame=function(){return y},this.getSession=function(){return r},this.setSession=async function(te){if(r=te,r!==null){if(T=e.getRenderTarget(),r.addEventListener("select",Q),r.addEventListener("selectstart",Q),r.addEventListener("selectend",Q),r.addEventListener("squeeze",Q),r.addEventListener("squeezestart",Q),r.addEventListener("squeezeend",Q),r.addEventListener("end",J),r.addEventListener("inputsourceschange",Y),E.xrCompatible!==!0&&await t.makeXRCompatible(),j=e.getPixelRatio(),e.getSize(D),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ne=null,Ye=null,Ce=null;E.depth&&(Ce=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ne=E.stencil?Ki:pi,Ye=E.stencil?fs:Kn);const We={colorFormat:t.RGBA8,depthFormat:Ce,scaleFactor:a};f=this.getBinding(),m=f.createProjectionLayer(We),r.updateRenderState({layers:[m]}),e.setPixelRatio(1),e.setSize(m.textureWidth,m.textureHeight,!1),C=new Yn(m.textureWidth,m.textureHeight,{format:Pn,type:un,depthTexture:new xs(m.textureWidth,m.textureHeight,Ye,void 0,void 0,void 0,void 0,void 0,void 0,Ne),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}else{const Ne={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:a};g=new XRWebGLLayer(r,t,Ne),r.updateRenderState({baseLayer:g}),e.setPixelRatio(1),e.setSize(g.framebufferWidth,g.framebufferHeight,!1),C=new Yn(g.framebufferWidth,g.framebufferHeight,{format:Pn,type:un,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:g.ignoreDepthValues===!1,resolveStencilBuffer:g.ignoreDepthValues===!1})}C.isXRRenderTarget=!0,this.setFoveation(d),h=null,o=await r.requestReferenceSpace(l),ut.setContext(r),ut.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function Y(te){for(let oe=0;oe<te.removed.length;oe++){const Ne=te.removed[oe],Ye=L.indexOf(Ne);Ye>=0&&(L[Ye]=null,N[Ye].disconnect(Ne))}for(let oe=0;oe<te.added.length;oe++){const Ne=te.added[oe];let Ye=L.indexOf(Ne);if(Ye===-1){for(let We=0;We<N.length;We++)if(We>=L.length){L.push(Ne),Ye=We;break}else if(L[We]===null){L[We]=Ne,Ye=We;break}if(Ye===-1)break}const Ce=N[Ye];Ce&&Ce.connect(Ne)}}const le=new k,me=new k;function ve(te,oe,Ne){le.setFromMatrixPosition(oe.matrixWorld),me.setFromMatrixPosition(Ne.matrixWorld);const Ye=le.distanceTo(me),Ce=oe.projectionMatrix.elements,We=Ne.projectionMatrix.elements,Et=Ce[14]/(Ce[10]-1),et=Ce[14]/(Ce[10]+1),ot=(Ce[9]+1)/Ce[5],je=(Ce[9]-1)/Ce[5],Fe=(Ce[8]-1)/Ce[0],vt=(We[8]+1)/We[0],I=Et*Fe,wt=Et*vt,Ie=Ye/(-Fe+vt),ct=Ie*-Fe;if(oe.matrixWorld.decompose(te.position,te.quaternion,te.scale),te.translateX(ct),te.translateZ(Ie),te.matrixWorld.compose(te.position,te.quaternion,te.scale),te.matrixWorldInverse.copy(te.matrixWorld).invert(),Ce[10]===-1)te.projectionMatrix.copy(oe.projectionMatrix),te.projectionMatrixInverse.copy(oe.projectionMatrixInverse);else{const ge=Et+Ie,A=et+Ie,v=I-ct,O=wt+(Ye-ct),P=ot*et/A*ge,q=je*et/A*ge;te.projectionMatrix.makePerspective(v,O,P,q,ge,A),te.projectionMatrixInverse.copy(te.projectionMatrix).invert()}}function be(te,oe){oe===null?te.matrixWorld.copy(te.matrix):te.matrixWorld.multiplyMatrices(oe.matrixWorld,te.matrix),te.matrixWorldInverse.copy(te.matrixWorld).invert()}this.updateCamera=function(te){if(r===null)return;let oe=te.near,Ne=te.far;x.texture!==null&&(x.depthNear>0&&(oe=x.depthNear),x.depthFar>0&&(Ne=x.depthFar)),V.near=M.near=S.near=oe,V.far=M.far=S.far=Ne,(H!==V.near||K!==V.far)&&(r.updateRenderState({depthNear:V.near,depthFar:V.far}),H=V.near,K=V.far),V.layers.mask=te.layers.mask|6,S.layers.mask=V.layers.mask&3,M.layers.mask=V.layers.mask&5;const Ye=te.parent,Ce=V.cameras;be(V,Ye);for(let We=0;We<Ce.length;We++)be(Ce[We],Ye);Ce.length===2?ve(V,S,M):V.projectionMatrix.copy(S.projectionMatrix),pe(te,V,Ye)};function pe(te,oe,Ne){Ne===null?te.matrix.copy(oe.matrixWorld):(te.matrix.copy(Ne.matrixWorld),te.matrix.invert(),te.matrix.multiply(oe.matrixWorld)),te.matrix.decompose(te.position,te.quaternion,te.scale),te.updateMatrixWorld(!0),te.projectionMatrix.copy(oe.projectionMatrix),te.projectionMatrixInverse.copy(oe.projectionMatrixInverse),te.isPerspectiveCamera&&(te.fov=gs*2*Math.atan(1/te.projectionMatrix.elements[5]),te.zoom=1)}this.getCamera=function(){return V},this.getFoveation=function(){if(!(m===null&&g===null))return d},this.setFoveation=function(te){d=te,m!==null&&(m.fixedFoveation=te),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=te)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(V)},this.getCameraTexture=function(te){return p[te]};let Ke=null;function nt(te,oe){if(u=oe.getViewerPose(h||o),y=oe,u!==null){const Ne=u.views;g!==null&&(e.setRenderTargetFramebuffer(C,g.framebuffer),e.setRenderTarget(C));let Ye=!1;Ne.length!==V.cameras.length&&(V.cameras.length=0,Ye=!0);for(let et=0;et<Ne.length;et++){const ot=Ne[et];let je=null;if(g!==null)je=g.getViewport(ot);else{const vt=f.getViewSubImage(m,ot);je=vt.viewport,et===0&&(e.setRenderTargetTextures(C,vt.colorTexture,vt.depthStencilTexture),e.setRenderTarget(C))}let Fe=U[et];Fe===void 0&&(Fe=new bn,Fe.layers.enable(et),Fe.viewport=new Pt,U[et]=Fe),Fe.matrix.fromArray(ot.transform.matrix),Fe.matrix.decompose(Fe.position,Fe.quaternion,Fe.scale),Fe.projectionMatrix.fromArray(ot.projectionMatrix),Fe.projectionMatrixInverse.copy(Fe.projectionMatrix).invert(),Fe.viewport.set(je.x,je.y,je.width,je.height),et===0&&(V.matrix.copy(Fe.matrix),V.matrix.decompose(V.position,V.quaternion,V.scale)),Ye===!0&&V.cameras.push(Fe)}const Ce=r.enabledFeatures;if(Ce&&Ce.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&_){f=n.getBinding();const et=f.getDepthInformation(Ne[0]);et&&et.isValid&&et.texture&&x.init(et,r.renderState)}if(Ce&&Ce.includes("camera-access")&&_){e.state.unbindTexture(),f=n.getBinding();for(let et=0;et<Ne.length;et++){const ot=Ne[et].camera;if(ot){let je=p[ot];je||(je=new lh,p[ot]=je);const Fe=f.getCameraImage(ot);je.sourceTexture=Fe}}}}for(let Ne=0;Ne<N.length;Ne++){const Ye=L[Ne],Ce=N[Ne];Ye!==null&&Ce!==void 0&&Ce.update(Ye,oe,h||o)}Ke&&Ke(te,oe),oe.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:oe}),y=null}const ut=new fh;ut.setAnimationLoop(nt),this.setAnimationLoop=function(te){Ke=te},this.dispose=function(){}}}const Xi=new Jn,jv=new At;function Bv(i,e){function t(x,p){x.matrixAutoUpdate===!0&&x.updateMatrix(),p.value.copy(x.matrix)}function n(x,p){p.color.getRGB(x.fogColor.value,ih(i)),p.isFog?(x.fogNear.value=p.near,x.fogFar.value=p.far):p.isFogExp2&&(x.fogDensity.value=p.density)}function r(x,p,E,T,C){p.isMeshBasicMaterial||p.isMeshLambertMaterial?a(x,p):p.isMeshToonMaterial?(a(x,p),f(x,p)):p.isMeshPhongMaterial?(a(x,p),u(x,p)):p.isMeshStandardMaterial?(a(x,p),m(x,p),p.isMeshPhysicalMaterial&&g(x,p,C)):p.isMeshMatcapMaterial?(a(x,p),y(x,p)):p.isMeshDepthMaterial?a(x,p):p.isMeshDistanceMaterial?(a(x,p),_(x,p)):p.isMeshNormalMaterial?a(x,p):p.isLineBasicMaterial?(o(x,p),p.isLineDashedMaterial&&l(x,p)):p.isPointsMaterial?d(x,p,E,T):p.isSpriteMaterial?h(x,p):p.isShadowMaterial?(x.color.value.copy(p.color),x.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(x,p){x.opacity.value=p.opacity,p.color&&x.diffuse.value.copy(p.color),p.emissive&&x.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(x.map.value=p.map,t(p.map,x.mapTransform)),p.alphaMap&&(x.alphaMap.value=p.alphaMap,t(p.alphaMap,x.alphaMapTransform)),p.bumpMap&&(x.bumpMap.value=p.bumpMap,t(p.bumpMap,x.bumpMapTransform),x.bumpScale.value=p.bumpScale,p.side===sn&&(x.bumpScale.value*=-1)),p.normalMap&&(x.normalMap.value=p.normalMap,t(p.normalMap,x.normalMapTransform),x.normalScale.value.copy(p.normalScale),p.side===sn&&x.normalScale.value.negate()),p.displacementMap&&(x.displacementMap.value=p.displacementMap,t(p.displacementMap,x.displacementMapTransform),x.displacementScale.value=p.displacementScale,x.displacementBias.value=p.displacementBias),p.emissiveMap&&(x.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,x.emissiveMapTransform)),p.specularMap&&(x.specularMap.value=p.specularMap,t(p.specularMap,x.specularMapTransform)),p.alphaTest>0&&(x.alphaTest.value=p.alphaTest);const E=e.get(p),T=E.envMap,C=E.envMapRotation;T&&(x.envMap.value=T,Xi.copy(C),Xi.x*=-1,Xi.y*=-1,Xi.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Xi.y*=-1,Xi.z*=-1),x.envMapRotation.value.setFromMatrix4(jv.makeRotationFromEuler(Xi)),x.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,x.reflectivity.value=p.reflectivity,x.ior.value=p.ior,x.refractionRatio.value=p.refractionRatio),p.lightMap&&(x.lightMap.value=p.lightMap,x.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,x.lightMapTransform)),p.aoMap&&(x.aoMap.value=p.aoMap,x.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,x.aoMapTransform))}function o(x,p){x.diffuse.value.copy(p.color),x.opacity.value=p.opacity,p.map&&(x.map.value=p.map,t(p.map,x.mapTransform))}function l(x,p){x.dashSize.value=p.dashSize,x.totalSize.value=p.dashSize+p.gapSize,x.scale.value=p.scale}function d(x,p,E,T){x.diffuse.value.copy(p.color),x.opacity.value=p.opacity,x.size.value=p.size*E,x.scale.value=T*.5,p.map&&(x.map.value=p.map,t(p.map,x.uvTransform)),p.alphaMap&&(x.alphaMap.value=p.alphaMap,t(p.alphaMap,x.alphaMapTransform)),p.alphaTest>0&&(x.alphaTest.value=p.alphaTest)}function h(x,p){x.diffuse.value.copy(p.color),x.opacity.value=p.opacity,x.rotation.value=p.rotation,p.map&&(x.map.value=p.map,t(p.map,x.mapTransform)),p.alphaMap&&(x.alphaMap.value=p.alphaMap,t(p.alphaMap,x.alphaMapTransform)),p.alphaTest>0&&(x.alphaTest.value=p.alphaTest)}function u(x,p){x.specular.value.copy(p.specular),x.shininess.value=Math.max(p.shininess,1e-4)}function f(x,p){p.gradientMap&&(x.gradientMap.value=p.gradientMap)}function m(x,p){x.metalness.value=p.metalness,p.metalnessMap&&(x.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,x.metalnessMapTransform)),x.roughness.value=p.roughness,p.roughnessMap&&(x.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,x.roughnessMapTransform)),p.envMap&&(x.envMapIntensity.value=p.envMapIntensity)}function g(x,p,E){x.ior.value=p.ior,p.sheen>0&&(x.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),x.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(x.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,x.sheenColorMapTransform)),p.sheenRoughnessMap&&(x.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,x.sheenRoughnessMapTransform))),p.clearcoat>0&&(x.clearcoat.value=p.clearcoat,x.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(x.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,x.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(x.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===sn&&x.clearcoatNormalScale.value.negate())),p.dispersion>0&&(x.dispersion.value=p.dispersion),p.iridescence>0&&(x.iridescence.value=p.iridescence,x.iridescenceIOR.value=p.iridescenceIOR,x.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(x.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,x.iridescenceMapTransform)),p.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),p.transmission>0&&(x.transmission.value=p.transmission,x.transmissionSamplerMap.value=E.texture,x.transmissionSamplerSize.value.set(E.width,E.height),p.transmissionMap&&(x.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,x.transmissionMapTransform)),x.thickness.value=p.thickness,p.thicknessMap&&(x.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=p.attenuationDistance,x.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(x.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(x.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=p.specularIntensity,x.specularColor.value.copy(p.specularColor),p.specularColorMap&&(x.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,x.specularColorMapTransform)),p.specularIntensityMap&&(x.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,x.specularIntensityMapTransform))}function y(x,p){p.matcap&&(x.matcap.value=p.matcap)}function _(x,p){const E=e.get(p).light;x.referencePosition.value.setFromMatrixPosition(E.matrixWorld),x.nearDistance.value=E.shadow.camera.near,x.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function zv(i,e,t,n){let r={},a={},o=[];const l=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function d(E,T){const C=T.program;n.uniformBlockBinding(E,C)}function h(E,T){let C=r[E.id];C===void 0&&(y(E),C=u(E),r[E.id]=C,E.addEventListener("dispose",x));const N=T.program;n.updateUBOMapping(E,N);const L=e.render.frame;a[E.id]!==L&&(m(E),a[E.id]=L)}function u(E){const T=f();E.__bindingPointIndex=T;const C=i.createBuffer(),N=E.__size,L=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,C),i.bufferData(i.UNIFORM_BUFFER,N,L),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,T,C),C}function f(){for(let E=0;E<l;E++)if(o.indexOf(E)===-1)return o.push(E),E;return ft("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(E){const T=r[E.id],C=E.uniforms,N=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,T);for(let L=0,D=C.length;L<D;L++){const j=Array.isArray(C[L])?C[L]:[C[L]];for(let S=0,M=j.length;S<M;S++){const U=j[S];if(g(U,L,S,N)===!0){const V=U.__offset,H=Array.isArray(U.value)?U.value:[U.value];let K=0;for(let Q=0;Q<H.length;Q++){const J=H[Q],Y=_(J);typeof J=="number"||typeof J=="boolean"?(U.__data[0]=J,i.bufferSubData(i.UNIFORM_BUFFER,V+K,U.__data)):J.isMatrix3?(U.__data[0]=J.elements[0],U.__data[1]=J.elements[1],U.__data[2]=J.elements[2],U.__data[3]=0,U.__data[4]=J.elements[3],U.__data[5]=J.elements[4],U.__data[6]=J.elements[5],U.__data[7]=0,U.__data[8]=J.elements[6],U.__data[9]=J.elements[7],U.__data[10]=J.elements[8],U.__data[11]=0):(J.toArray(U.__data,K),K+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,V,U.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function g(E,T,C,N){const L=E.value,D=T+"_"+C;if(N[D]===void 0)return typeof L=="number"||typeof L=="boolean"?N[D]=L:N[D]=L.clone(),!0;{const j=N[D];if(typeof L=="number"||typeof L=="boolean"){if(j!==L)return N[D]=L,!0}else if(j.equals(L)===!1)return j.copy(L),!0}return!1}function y(E){const T=E.uniforms;let C=0;const N=16;for(let D=0,j=T.length;D<j;D++){const S=Array.isArray(T[D])?T[D]:[T[D]];for(let M=0,U=S.length;M<U;M++){const V=S[M],H=Array.isArray(V.value)?V.value:[V.value];for(let K=0,Q=H.length;K<Q;K++){const J=H[K],Y=_(J),le=C%N,me=le%Y.boundary,ve=le+me;C+=me,ve!==0&&N-ve<Y.storage&&(C+=N-ve),V.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=C,C+=Y.storage}}}const L=C%N;return L>0&&(C+=N-L),E.__size=C,E.__cache={},this}function _(E){const T={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(T.boundary=4,T.storage=4):E.isVector2?(T.boundary=8,T.storage=8):E.isVector3||E.isColor?(T.boundary=16,T.storage=12):E.isVector4?(T.boundary=16,T.storage=16):E.isMatrix3?(T.boundary=48,T.storage=48):E.isMatrix4?(T.boundary=64,T.storage=64):E.isTexture?qe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):qe("WebGLRenderer: Unsupported uniform value type.",E),T}function x(E){const T=E.target;T.removeEventListener("dispose",x);const C=o.indexOf(T.__bindingPointIndex);o.splice(C,1),i.deleteBuffer(r[T.id]),delete r[T.id],delete a[T.id]}function p(){for(const E in r)i.deleteBuffer(r[E]);o=[],r={},a={}}return{bind:d,update:h,dispose:p}}const Gv=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Vn=null;function Vv(){return Vn===null&&(Vn=new fp(Gv,16,16,Ar,fi),Vn.name="DFG_LUT",Vn.minFilter=Jt,Vn.magFilter=Jt,Vn.wrapS=di,Vn.wrapT=di,Vn.generateMipmaps=!1,Vn.needsUpdate=!0),Vn}class Hv{constructor(e={}){const{canvas:t=Ef(),context:n=null,depth:r=!0,stencil:a=!1,alpha:o=!1,antialias:l=!1,premultipliedAlpha:d=!0,preserveDrawingBuffer:h=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:m=!1,outputBufferType:g=un}=e;this.isWebGLRenderer=!0;let y;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");y=n.getContextAttributes().alpha}else y=o;const _=g,x=new Set([Nl,Cl,Al]),p=new Set([un,Kn,us,fs,El,Tl]),E=new Uint32Array(4),T=new Int32Array(4);let C=null,N=null;const L=[],D=[];let j=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=qn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const S=this;let M=!1;this._outputColorSpace=yn;let U=0,V=0,H=null,K=-1,Q=null;const J=new Pt,Y=new Pt;let le=null;const me=new ht(0);let ve=0,be=t.width,pe=t.height,Ke=1,nt=null,ut=null;const te=new Pt(0,0,be,pe),oe=new Pt(0,0,be,pe);let Ne=!1;const Ye=new kl;let Ce=!1,We=!1;const Et=new At,et=new k,ot=new Pt,je={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Fe=!1;function vt(){return H===null?Ke:1}let I=n;function wt(w,B){return t.getContext(w,B)}try{const w={alpha:!0,depth:r,stencil:a,antialias:l,premultipliedAlpha:d,preserveDrawingBuffer:h,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${wl}`),t.addEventListener("webglcontextlost",Ge,!1),t.addEventListener("webglcontextrestored",St,!1),t.addEventListener("webglcontextcreationerror",Je,!1),I===null){const B="webgl2";if(I=wt(B,w),I===null)throw wt(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw ft("WebGLRenderer: "+w.message),w}let Ie,ct,ge,A,v,O,P,q,G,Me,se,Re,he,ee,ae,Te,_e,ue,Be,F,xe,de,Se,ce;function ne(){Ie=new V0(I),Ie.init(),de=new Iv(I,Ie),ct=new I0(I,Ie,e,de),ge=new Lv(I,Ie),ct.reversedDepthBuffer&&m&&ge.buffers.depth.setReversed(!0),A=new X0(I),v=new xv,O=new Dv(I,Ie,ge,v,ct,de,A),P=new F0(S),q=new G0(S),G=new Kp(I),Se=new L0(I,G),Me=new H0(I,G,A,Se),se=new q0(I,Me,G,A),Be=new $0(I,ct,O),Te=new U0(v),Re=new gv(S,P,q,Ie,ct,Se,Te),he=new Bv(S,v),ee=new _v,ae=new Ev(Ie),ue=new P0(S,P,q,ge,se,y,d),_e=new Rv(S,se,ct),ce=new zv(I,A,ct,ge),F=new D0(I,Ie,A),xe=new W0(I,Ie,A),A.programs=Re.programs,S.capabilities=ct,S.extensions=Ie,S.properties=v,S.renderLists=ee,S.shadowMap=_e,S.state=ge,S.info=A}ne(),_!==un&&(j=new K0(_,t.width,t.height,r,a));const ye=new Ov(S,I);this.xr=ye,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const w=Ie.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=Ie.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return Ke},this.setPixelRatio=function(w){w!==void 0&&(Ke=w,this.setSize(be,pe,!1))},this.getSize=function(w){return w.set(be,pe)},this.setSize=function(w,B,$=!0){if(ye.isPresenting){qe("WebGLRenderer: Can't change size while VR device is presenting.");return}be=w,pe=B,t.width=Math.floor(w*Ke),t.height=Math.floor(B*Ke),$===!0&&(t.style.width=w+"px",t.style.height=B+"px"),j!==null&&j.setSize(t.width,t.height),this.setViewport(0,0,w,B)},this.getDrawingBufferSize=function(w){return w.set(be*Ke,pe*Ke).floor()},this.setDrawingBufferSize=function(w,B,$){be=w,pe=B,Ke=$,t.width=Math.floor(w*$),t.height=Math.floor(B*$),this.setViewport(0,0,w,B)},this.setEffects=function(w){if(_===un){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(w){for(let B=0;B<w.length;B++)if(w[B].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}j.setEffects(w||[])},this.getCurrentViewport=function(w){return w.copy(J)},this.getViewport=function(w){return w.copy(te)},this.setViewport=function(w,B,$,W){w.isVector4?te.set(w.x,w.y,w.z,w.w):te.set(w,B,$,W),ge.viewport(J.copy(te).multiplyScalar(Ke).round())},this.getScissor=function(w){return w.copy(oe)},this.setScissor=function(w,B,$,W){w.isVector4?oe.set(w.x,w.y,w.z,w.w):oe.set(w,B,$,W),ge.scissor(Y.copy(oe).multiplyScalar(Ke).round())},this.getScissorTest=function(){return Ne},this.setScissorTest=function(w){ge.setScissorTest(Ne=w)},this.setOpaqueSort=function(w){nt=w},this.setTransparentSort=function(w){ut=w},this.getClearColor=function(w){return w.copy(ue.getClearColor())},this.setClearColor=function(){ue.setClearColor(...arguments)},this.getClearAlpha=function(){return ue.getClearAlpha()},this.setClearAlpha=function(){ue.setClearAlpha(...arguments)},this.clear=function(w=!0,B=!0,$=!0){let W=0;if(w){let z=!1;if(H!==null){const we=H.texture.format;z=x.has(we)}if(z){const we=H.texture.type,fe=p.has(we),Ee=ue.getClearColor(),Pe=ue.getClearAlpha(),Ue=Ee.r,Ve=Ee.g,ze=Ee.b;fe?(E[0]=Ue,E[1]=Ve,E[2]=ze,E[3]=Pe,I.clearBufferuiv(I.COLOR,0,E)):(T[0]=Ue,T[1]=Ve,T[2]=ze,T[3]=Pe,I.clearBufferiv(I.COLOR,0,T))}else W|=I.COLOR_BUFFER_BIT}B&&(W|=I.DEPTH_BUFFER_BIT),$&&(W|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Ge,!1),t.removeEventListener("webglcontextrestored",St,!1),t.removeEventListener("webglcontextcreationerror",Je,!1),ue.dispose(),ee.dispose(),ae.dispose(),v.dispose(),P.dispose(),q.dispose(),se.dispose(),Se.dispose(),ce.dispose(),Re.dispose(),ye.dispose(),ye.removeEventListener("sessionstart",Fr),ye.removeEventListener("sessionend",ki),In.stop()};function Ge(w){w.preventDefault(),Ic("WebGLRenderer: Context Lost."),M=!0}function St(){Ic("WebGLRenderer: Context Restored."),M=!1;const w=A.autoReset,B=_e.enabled,$=_e.autoUpdate,W=_e.needsUpdate,z=_e.type;ne(),A.autoReset=w,_e.enabled=B,_e.autoUpdate=$,_e.needsUpdate=W,_e.type=z}function Je(w){ft("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Qt(w){const B=w.target;B.removeEventListener("dispose",Qt),fn(B)}function fn(w){Zi(w),v.remove(w)}function Zi(w){const B=v.get(w).programs;B!==void 0&&(B.forEach(function($){Re.releaseProgram($)}),w.isShaderMaterial&&Re.releaseShaderCache(w))}this.renderBufferDirect=function(w,B,$,W,z,we){B===null&&(B=je);const fe=z.isMesh&&z.matrixWorld.determinant()<0,Ee=jr(w,B,$,W,z);ge.setMaterial(W,fe);let Pe=$.index,Ue=1;if(W.wireframe===!0){if(Pe=Me.getWireframeAttribute($),Pe===void 0)return;Ue=2}const Ve=$.drawRange,ze=$.attributes.position;let Qe=Ve.start*Ue,mt=(Ve.start+Ve.count)*Ue;we!==null&&(Qe=Math.max(Qe,we.start*Ue),mt=Math.min(mt,(we.start+we.count)*Ue)),Pe!==null?(Qe=Math.max(Qe,0),mt=Math.min(mt,Pe.count)):ze!=null&&(Qe=Math.max(Qe,0),mt=Math.min(mt,ze.count));const Mt=mt-Qe;if(Mt<0||Mt===1/0)return;Se.setup(z,W,Ee,$,Pe);let Tt,gt=F;if(Pe!==null&&(Tt=G.get(Pe),gt=xe,gt.setIndex(Tt)),z.isMesh)W.wireframe===!0?(ge.setLineWidth(W.wireframeLinewidth*vt()),gt.setMode(I.LINES)):gt.setMode(I.TRIANGLES);else if(z.isLine){let Oe=W.linewidth;Oe===void 0&&(Oe=1),ge.setLineWidth(Oe*vt()),z.isLineSegments?gt.setMode(I.LINES):z.isLineLoop?gt.setMode(I.LINE_LOOP):gt.setMode(I.LINE_STRIP)}else z.isPoints?gt.setMode(I.POINTS):z.isSprite&&gt.setMode(I.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)ms("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),gt.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(Ie.get("WEBGL_multi_draw"))gt.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const Oe=z._multiDrawStarts,it=z._multiDrawCounts,Ze=z._multiDrawCount,Rt=Pe?G.get(Pe).bytesPerElement:1,Sn=v.get(W).currentProgram.getUniforms();for(let kt=0;kt<Ze;kt++)Sn.setValue(I,"_gl_DrawID",kt),gt.render(Oe[kt]/Rt,it[kt])}else if(z.isInstancedMesh)gt.renderInstances(Qe,Mt,z.count);else if($.isInstancedBufferGeometry){const Oe=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,it=Math.min($.instanceCount,Oe);gt.renderInstances(Qe,Mt,it)}else gt.render(Qe,Mt)};function pn(w,B,$){w.transparent===!0&&w.side===Nn&&w.forceSinglePass===!1?(w.side=sn,w.needsUpdate=!0,nn(w,B,$),w.side=Fi,w.needsUpdate=!0,nn(w,B,$),w.side=Nn):nn(w,B,$)}this.compile=function(w,B,$=null){$===null&&($=w),N=ae.get($),N.init(B),D.push(N),$.traverseVisible(function(z){z.isLight&&z.layers.test(B.layers)&&(N.pushLight(z),z.castShadow&&N.pushShadow(z))}),w!==$&&w.traverseVisible(function(z){z.isLight&&z.layers.test(B.layers)&&(N.pushLight(z),z.castShadow&&N.pushShadow(z))}),N.setupLights();const W=new Set;return w.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const we=z.material;if(we)if(Array.isArray(we))for(let fe=0;fe<we.length;fe++){const Ee=we[fe];pn(Ee,$,z),W.add(Ee)}else pn(we,$,z),W.add(we)}),N=D.pop(),W},this.compileAsync=function(w,B,$=null){const W=this.compile(w,B,$);return new Promise(z=>{function we(){if(W.forEach(function(fe){v.get(fe).currentProgram.isReady()&&W.delete(fe)}),W.size===0){z(w);return}setTimeout(we,10)}Ie.get("KHR_parallel_shader_compile")!==null?we():setTimeout(we,10)})};let Qi=null;function Dn(w){Qi&&Qi(w)}function Fr(){In.stop()}function ki(){In.start()}const In=new fh;In.setAnimationLoop(Dn),typeof self<"u"&&In.setContext(self),this.setAnimationLoop=function(w){Qi=w,ye.setAnimationLoop(w),w===null?In.stop():In.start()},ye.addEventListener("sessionstart",Fr),ye.addEventListener("sessionend",ki),this.render=function(w,B){if(B!==void 0&&B.isCamera!==!0){ft("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;const $=ye.enabled===!0&&ye.isPresenting===!0,W=j!==null&&(H===null||$)&&j.begin(S,H);if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),ye.enabled===!0&&ye.isPresenting===!0&&(j===null||j.isCompositing()===!1)&&(ye.cameraAutoUpdate===!0&&ye.updateCamera(B),B=ye.getCamera()),w.isScene===!0&&w.onBeforeRender(S,w,B,H),N=ae.get(w,D.length),N.init(B),D.push(N),Et.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),Ye.setFromProjectionMatrix(Et,$n,B.reversedDepth),We=this.localClippingEnabled,Ce=Te.init(this.clippingPlanes,We),C=ee.get(w,L.length),C.init(),L.push(C),ye.enabled===!0&&ye.isPresenting===!0){const fe=S.xr.getDepthSensingMesh();fe!==null&&gi(fe,B,-1/0,S.sortObjects)}gi(w,B,0,S.sortObjects),C.finish(),S.sortObjects===!0&&C.sort(nt,ut),Fe=ye.enabled===!1||ye.isPresenting===!1||ye.hasDepthSensing()===!1,Fe&&ue.addToRenderList(C,w),this.info.render.frame++,Ce===!0&&Te.beginShadows();const z=N.state.shadowsArray;if(_e.render(z,w,B),Ce===!0&&Te.endShadows(),this.info.autoReset===!0&&this.info.reset(),(W&&j.hasRenderPass())===!1){const fe=C.opaque,Ee=C.transmissive;if(N.setupLights(),B.isArrayCamera){const Pe=B.cameras;if(Ee.length>0)for(let Ue=0,Ve=Pe.length;Ue<Ve;Ue++){const ze=Pe[Ue];er(fe,Ee,w,ze)}Fe&&ue.render(w);for(let Ue=0,Ve=Pe.length;Ue<Ve;Ue++){const ze=Pe[Ue];kr(C,w,ze,ze.viewport)}}else Ee.length>0&&er(fe,Ee,w,B),Fe&&ue.render(w),kr(C,w,B)}H!==null&&V===0&&(O.updateMultisampleRenderTarget(H),O.updateRenderTargetMipmap(H)),W&&j.end(S),w.isScene===!0&&w.onAfterRender(S,w,B),Se.resetDefaultState(),K=-1,Q=null,D.pop(),D.length>0?(N=D[D.length-1],Ce===!0&&Te.setGlobalState(S.clippingPlanes,N.state.camera)):N=null,L.pop(),L.length>0?C=L[L.length-1]:C=null};function gi(w,B,$,W){if(w.visible===!1)return;if(w.layers.test(B.layers)){if(w.isGroup)$=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(B);else if(w.isLight)N.pushLight(w),w.castShadow&&N.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||Ye.intersectsSprite(w)){W&&ot.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Et);const fe=se.update(w),Ee=w.material;Ee.visible&&C.push(w,fe,Ee,$,ot.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||Ye.intersectsObject(w))){const fe=se.update(w),Ee=w.material;if(W&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),ot.copy(w.boundingSphere.center)):(fe.boundingSphere===null&&fe.computeBoundingSphere(),ot.copy(fe.boundingSphere.center)),ot.applyMatrix4(w.matrixWorld).applyMatrix4(Et)),Array.isArray(Ee)){const Pe=fe.groups;for(let Ue=0,Ve=Pe.length;Ue<Ve;Ue++){const ze=Pe[Ue],Qe=Ee[ze.materialIndex];Qe&&Qe.visible&&C.push(w,fe,Qe,$,ot.z,ze)}}else Ee.visible&&C.push(w,fe,Ee,$,ot.z,null)}}const we=w.children;for(let fe=0,Ee=we.length;fe<Ee;fe++)gi(we[fe],B,$,W)}function kr(w,B,$,W){const{opaque:z,transmissive:we,transparent:fe}=w;N.setupLightsView($),Ce===!0&&Te.setGlobalState(S.clippingPlanes,$),W&&ge.viewport(J.copy(W)),z.length>0&&Qn(z,B,$),we.length>0&&Qn(we,B,$),fe.length>0&&Qn(fe,B,$),ge.buffers.depth.setTest(!0),ge.buffers.depth.setMask(!0),ge.buffers.color.setMask(!0),ge.setPolygonOffset(!1)}function er(w,B,$,W){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;if(N.state.transmissionRenderTarget[W.id]===void 0){const Qe=Ie.has("EXT_color_buffer_half_float")||Ie.has("EXT_color_buffer_float");N.state.transmissionRenderTarget[W.id]=new Yn(1,1,{generateMipmaps:!0,type:Qe?fi:un,minFilter:Yi,samples:ct.samples,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:pt.workingColorSpace})}const we=N.state.transmissionRenderTarget[W.id],fe=W.viewport||J;we.setSize(fe.z*S.transmissionResolutionScale,fe.w*S.transmissionResolutionScale);const Ee=S.getRenderTarget(),Pe=S.getActiveCubeFace(),Ue=S.getActiveMipmapLevel();S.setRenderTarget(we),S.getClearColor(me),ve=S.getClearAlpha(),ve<1&&S.setClearColor(16777215,.5),S.clear(),Fe&&ue.render($);const Ve=S.toneMapping;S.toneMapping=qn;const ze=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),N.setupLightsView(W),Ce===!0&&Te.setGlobalState(S.clippingPlanes,W),Qn(w,$,W),O.updateMultisampleRenderTarget(we),O.updateRenderTargetMipmap(we),Ie.has("WEBGL_multisampled_render_to_texture")===!1){let Qe=!1;for(let mt=0,Mt=B.length;mt<Mt;mt++){const Tt=B[mt],{object:gt,geometry:Oe,material:it,group:Ze}=Tt;if(it.side===Nn&&gt.layers.test(W.layers)){const Rt=it.side;it.side=sn,it.needsUpdate=!0,Or(gt,$,W,Oe,it,Ze),it.side=Rt,it.needsUpdate=!0,Qe=!0}}Qe===!0&&(O.updateMultisampleRenderTarget(we),O.updateRenderTargetMipmap(we))}S.setRenderTarget(Ee,Pe,Ue),S.setClearColor(me,ve),ze!==void 0&&(W.viewport=ze),S.toneMapping=Ve}function Qn(w,B,$){const W=B.isScene===!0?B.overrideMaterial:null;for(let z=0,we=w.length;z<we;z++){const fe=w[z],{object:Ee,geometry:Pe,group:Ue}=fe;let Ve=fe.material;Ve.allowOverride===!0&&W!==null&&(Ve=W),Ee.layers.test($.layers)&&Or(Ee,B,$,Pe,Ve,Ue)}}function Or(w,B,$,W,z,we){w.onBeforeRender(S,B,$,W,z,we),w.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),z.onBeforeRender(S,B,$,W,w,we),z.transparent===!0&&z.side===Nn&&z.forceSinglePass===!1?(z.side=sn,z.needsUpdate=!0,S.renderBufferDirect($,B,W,z,w,we),z.side=Fi,z.needsUpdate=!0,S.renderBufferDirect($,B,W,z,w,we),z.side=Nn):S.renderBufferDirect($,B,W,z,w,we),w.onAfterRender(S,B,$,W,z,we)}function nn(w,B,$){B.isScene!==!0&&(B=je);const W=v.get(w),z=N.state.lights,we=N.state.shadowsArray,fe=z.state.version,Ee=Re.getParameters(w,z.state,we,B,$),Pe=Re.getProgramCacheKey(Ee);let Ue=W.programs;W.environment=w.isMeshStandardMaterial?B.environment:null,W.fog=B.fog,W.envMap=(w.isMeshStandardMaterial?q:P).get(w.envMap||W.environment),W.envMapRotation=W.environment!==null&&w.envMap===null?B.environmentRotation:w.envMapRotation,Ue===void 0&&(w.addEventListener("dispose",Qt),Ue=new Map,W.programs=Ue);let Ve=Ue.get(Pe);if(Ve!==void 0){if(W.currentProgram===Ve&&W.lightsStateVersion===fe)return xi(w,Ee),Ve}else Ee.uniforms=Re.getUniforms(w),w.onBeforeCompile(Ee,S),Ve=Re.acquireProgram(Ee,Pe),Ue.set(Pe,Ve),W.uniforms=Ee.uniforms;const ze=W.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(ze.clippingPlanes=Te.uniform),xi(w,Ee),W.needsLights=Br(w),W.lightsStateVersion=fe,W.needsLights&&(ze.ambientLightColor.value=z.state.ambient,ze.lightProbe.value=z.state.probe,ze.directionalLights.value=z.state.directional,ze.directionalLightShadows.value=z.state.directionalShadow,ze.spotLights.value=z.state.spot,ze.spotLightShadows.value=z.state.spotShadow,ze.rectAreaLights.value=z.state.rectArea,ze.ltc_1.value=z.state.rectAreaLTC1,ze.ltc_2.value=z.state.rectAreaLTC2,ze.pointLights.value=z.state.point,ze.pointLightShadows.value=z.state.pointShadow,ze.hemisphereLights.value=z.state.hemi,ze.directionalShadowMap.value=z.state.directionalShadowMap,ze.directionalShadowMatrix.value=z.state.directionalShadowMatrix,ze.spotShadowMap.value=z.state.spotShadowMap,ze.spotLightMatrix.value=z.state.spotLightMatrix,ze.spotLightMap.value=z.state.spotLightMap,ze.pointShadowMap.value=z.state.pointShadowMap,ze.pointShadowMatrix.value=z.state.pointShadowMatrix),W.currentProgram=Ve,W.uniformsList=null,Ve}function Oi(w){if(w.uniformsList===null){const B=w.currentProgram.getUniforms();w.uniformsList=va.seqWithValue(B.seq,w.uniforms)}return w.uniformsList}function xi(w,B){const $=v.get(w);$.outputColorSpace=B.outputColorSpace,$.batching=B.batching,$.batchingColor=B.batchingColor,$.instancing=B.instancing,$.instancingColor=B.instancingColor,$.instancingMorph=B.instancingMorph,$.skinning=B.skinning,$.morphTargets=B.morphTargets,$.morphNormals=B.morphNormals,$.morphColors=B.morphColors,$.morphTargetsCount=B.morphTargetsCount,$.numClippingPlanes=B.numClippingPlanes,$.numIntersection=B.numClipIntersection,$.vertexAlphas=B.vertexAlphas,$.vertexTangents=B.vertexTangents,$.toneMapping=B.toneMapping}function jr(w,B,$,W,z){B.isScene!==!0&&(B=je),O.resetTextureUnits();const we=B.fog,fe=W.isMeshStandardMaterial?B.environment:null,Ee=H===null?S.outputColorSpace:H.isXRRenderTarget===!0?H.texture.colorSpace:Cr,Pe=(W.isMeshStandardMaterial?q:P).get(W.envMap||fe),Ue=W.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,Ve=!!$.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),ze=!!$.morphAttributes.position,Qe=!!$.morphAttributes.normal,mt=!!$.morphAttributes.color;let Mt=qn;W.toneMapped&&(H===null||H.isXRRenderTarget===!0)&&(Mt=S.toneMapping);const Tt=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,gt=Tt!==void 0?Tt.length:0,Oe=v.get(W),it=N.state.lights;if(Ce===!0&&(We===!0||w!==Q)){const Lt=w===Q&&W.id===K;Te.setState(W,w,Lt)}let Ze=!1;W.version===Oe.__version?(Oe.needsLights&&Oe.lightsStateVersion!==it.state.version||Oe.outputColorSpace!==Ee||z.isBatchedMesh&&Oe.batching===!1||!z.isBatchedMesh&&Oe.batching===!0||z.isBatchedMesh&&Oe.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&Oe.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&Oe.instancing===!1||!z.isInstancedMesh&&Oe.instancing===!0||z.isSkinnedMesh&&Oe.skinning===!1||!z.isSkinnedMesh&&Oe.skinning===!0||z.isInstancedMesh&&Oe.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Oe.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Oe.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Oe.instancingMorph===!1&&z.morphTexture!==null||Oe.envMap!==Pe||W.fog===!0&&Oe.fog!==we||Oe.numClippingPlanes!==void 0&&(Oe.numClippingPlanes!==Te.numPlanes||Oe.numIntersection!==Te.numIntersection)||Oe.vertexAlphas!==Ue||Oe.vertexTangents!==Ve||Oe.morphTargets!==ze||Oe.morphNormals!==Qe||Oe.morphColors!==mt||Oe.toneMapping!==Mt||Oe.morphTargetsCount!==gt)&&(Ze=!0):(Ze=!0,Oe.__version=W.version);let Rt=Oe.currentProgram;Ze===!0&&(Rt=nn(W,B,z));let Sn=!1,kt=!1,an=!1;const rt=Rt.getUniforms(),Gt=Oe.uniforms;if(ge.useProgram(Rt.program)&&(Sn=!0,kt=!0,an=!0),W.id!==K&&(K=W.id,kt=!0),Sn||Q!==w){ge.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),rt.setValue(I,"projectionMatrix",w.projectionMatrix),rt.setValue(I,"viewMatrix",w.matrixWorldInverse);const Vt=rt.map.cameraPosition;Vt!==void 0&&Vt.setValue(I,et.setFromMatrixPosition(w.matrixWorld)),ct.logarithmicDepthBuffer&&rt.setValue(I,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&rt.setValue(I,"isOrthographic",w.isOrthographicCamera===!0),Q!==w&&(Q=w,kt=!0,an=!0)}if(Oe.needsLights&&(it.state.directionalShadowMap.length>0&&rt.setValue(I,"directionalShadowMap",it.state.directionalShadowMap,O),it.state.spotShadowMap.length>0&&rt.setValue(I,"spotShadowMap",it.state.spotShadowMap,O),it.state.pointShadowMap.length>0&&rt.setValue(I,"pointShadowMap",it.state.pointShadowMap,O)),z.isSkinnedMesh){rt.setOptional(I,z,"bindMatrix"),rt.setOptional(I,z,"bindMatrixInverse");const Lt=z.skeleton;Lt&&(Lt.boneTexture===null&&Lt.computeBoneTexture(),rt.setValue(I,"boneTexture",Lt.boneTexture,O))}z.isBatchedMesh&&(rt.setOptional(I,z,"batchingTexture"),rt.setValue(I,"batchingTexture",z._matricesTexture,O),rt.setOptional(I,z,"batchingIdTexture"),rt.setValue(I,"batchingIdTexture",z._indirectTexture,O),rt.setOptional(I,z,"batchingColorTexture"),z._colorsTexture!==null&&rt.setValue(I,"batchingColorTexture",z._colorsTexture,O));const $t=$.morphAttributes;if(($t.position!==void 0||$t.normal!==void 0||$t.color!==void 0)&&Be.update(z,$,Rt),(kt||Oe.receiveShadow!==z.receiveShadow)&&(Oe.receiveShadow=z.receiveShadow,rt.setValue(I,"receiveShadow",z.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(Gt.envMap.value=Pe,Gt.flipEnvMap.value=Pe.isCubeTexture&&Pe.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&B.environment!==null&&(Gt.envMapIntensity.value=B.environmentIntensity),Gt.dfgLUT!==void 0&&(Gt.dfgLUT.value=Vv()),kt&&(rt.setValue(I,"toneMappingExposure",S.toneMappingExposure),Oe.needsLights&&tr(Gt,an),we&&W.fog===!0&&he.refreshFogUniforms(Gt,we),he.refreshMaterialUniforms(Gt,W,Ke,pe,N.state.transmissionRenderTarget[w.id]),va.upload(I,Oi(Oe),Gt,O)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(va.upload(I,Oi(Oe),Gt,O),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&rt.setValue(I,"center",z.center),rt.setValue(I,"modelViewMatrix",z.modelViewMatrix),rt.setValue(I,"normalMatrix",z.normalMatrix),rt.setValue(I,"modelMatrix",z.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const Lt=W.uniformsGroups;for(let Vt=0,wn=Lt.length;Vt<wn;Vt++){const qt=Lt[Vt];ce.update(qt,Rt),ce.bind(qt,Rt)}}return Rt}function tr(w,B){w.ambientLightColor.needsUpdate=B,w.lightProbe.needsUpdate=B,w.directionalLights.needsUpdate=B,w.directionalLightShadows.needsUpdate=B,w.pointLights.needsUpdate=B,w.pointLightShadows.needsUpdate=B,w.spotLights.needsUpdate=B,w.spotLightShadows.needsUpdate=B,w.rectAreaLights.needsUpdate=B,w.hemisphereLights.needsUpdate=B}function Br(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return U},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return H},this.setRenderTargetTextures=function(w,B,$){const W=v.get(w);W.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),v.get(w.texture).__webglTexture=B,v.get(w.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:$,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,B){const $=v.get(w);$.__webglFramebuffer=B,$.__useDefaultFramebuffer=B===void 0};const nr=I.createFramebuffer();this.setRenderTarget=function(w,B=0,$=0){H=w,U=B,V=$;let W=null,z=!1,we=!1;if(w){const Ee=v.get(w);if(Ee.__useDefaultFramebuffer!==void 0){ge.bindFramebuffer(I.FRAMEBUFFER,Ee.__webglFramebuffer),J.copy(w.viewport),Y.copy(w.scissor),le=w.scissorTest,ge.viewport(J),ge.scissor(Y),ge.setScissorTest(le),K=-1;return}else if(Ee.__webglFramebuffer===void 0)O.setupRenderTarget(w);else if(Ee.__hasExternalTextures)O.rebindTextures(w,v.get(w.texture).__webglTexture,v.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Ve=w.depthTexture;if(Ee.__boundDepthTexture!==Ve){if(Ve!==null&&v.has(Ve)&&(w.width!==Ve.image.width||w.height!==Ve.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");O.setupDepthRenderbuffer(w)}}const Pe=w.texture;(Pe.isData3DTexture||Pe.isDataArrayTexture||Pe.isCompressedArrayTexture)&&(we=!0);const Ue=v.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Ue[B])?W=Ue[B][$]:W=Ue[B],z=!0):w.samples>0&&O.useMultisampledRTT(w)===!1?W=v.get(w).__webglMultisampledFramebuffer:Array.isArray(Ue)?W=Ue[$]:W=Ue,J.copy(w.viewport),Y.copy(w.scissor),le=w.scissorTest}else J.copy(te).multiplyScalar(Ke).floor(),Y.copy(oe).multiplyScalar(Ke).floor(),le=Ne;if($!==0&&(W=nr),ge.bindFramebuffer(I.FRAMEBUFFER,W)&&ge.drawBuffers(w,W),ge.viewport(J),ge.scissor(Y),ge.setScissorTest(le),z){const Ee=v.get(w.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+B,Ee.__webglTexture,$)}else if(we){const Ee=B;for(let Pe=0;Pe<w.textures.length;Pe++){const Ue=v.get(w.textures[Pe]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Pe,Ue.__webglTexture,$,Ee)}}else if(w!==null&&$!==0){const Ee=v.get(w.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Ee.__webglTexture,$)}K=-1},this.readRenderTargetPixels=function(w,B,$,W,z,we,fe,Ee=0){if(!(w&&w.isWebGLRenderTarget)){ft("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pe=v.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&fe!==void 0&&(Pe=Pe[fe]),Pe){ge.bindFramebuffer(I.FRAMEBUFFER,Pe);try{const Ue=w.textures[Ee],Ve=Ue.format,ze=Ue.type;if(!ct.textureFormatReadable(Ve)){ft("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ct.textureTypeReadable(ze)){ft("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=w.width-W&&$>=0&&$<=w.height-z&&(w.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Ee),I.readPixels(B,$,W,z,de.convert(Ve),de.convert(ze),we))}finally{const Ue=H!==null?v.get(H).__webglFramebuffer:null;ge.bindFramebuffer(I.FRAMEBUFFER,Ue)}}},this.readRenderTargetPixelsAsync=async function(w,B,$,W,z,we,fe,Ee=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pe=v.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&fe!==void 0&&(Pe=Pe[fe]),Pe)if(B>=0&&B<=w.width-W&&$>=0&&$<=w.height-z){ge.bindFramebuffer(I.FRAMEBUFFER,Pe);const Ue=w.textures[Ee],Ve=Ue.format,ze=Ue.type;if(!ct.textureFormatReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ct.textureTypeReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Qe=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Qe),I.bufferData(I.PIXEL_PACK_BUFFER,we.byteLength,I.STREAM_READ),w.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Ee),I.readPixels(B,$,W,z,de.convert(Ve),de.convert(ze),0);const mt=H!==null?v.get(H).__webglFramebuffer:null;ge.bindFramebuffer(I.FRAMEBUFFER,mt);const Mt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Tf(I,Mt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Qe),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,we),I.deleteBuffer(Qe),I.deleteSync(Mt),we}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,B=null,$=0){const W=Math.pow(2,-$),z=Math.floor(w.image.width*W),we=Math.floor(w.image.height*W),fe=B!==null?B.x:0,Ee=B!==null?B.y:0;O.setTexture2D(w,0),I.copyTexSubImage2D(I.TEXTURE_2D,$,0,0,fe,Ee,z,we),ge.unbindTexture()};const zr=I.createFramebuffer(),ir=I.createFramebuffer();this.copyTextureToTexture=function(w,B,$=null,W=null,z=0,we=null){we===null&&(z!==0?(ms("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),we=z,z=0):we=0);let fe,Ee,Pe,Ue,Ve,ze,Qe,mt,Mt;const Tt=w.isCompressedTexture?w.mipmaps[we]:w.image;if($!==null)fe=$.max.x-$.min.x,Ee=$.max.y-$.min.y,Pe=$.isBox3?$.max.z-$.min.z:1,Ue=$.min.x,Ve=$.min.y,ze=$.isBox3?$.min.z:0;else{const $t=Math.pow(2,-z);fe=Math.floor(Tt.width*$t),Ee=Math.floor(Tt.height*$t),w.isDataArrayTexture?Pe=Tt.depth:w.isData3DTexture?Pe=Math.floor(Tt.depth*$t):Pe=1,Ue=0,Ve=0,ze=0}W!==null?(Qe=W.x,mt=W.y,Mt=W.z):(Qe=0,mt=0,Mt=0);const gt=de.convert(B.format),Oe=de.convert(B.type);let it;B.isData3DTexture?(O.setTexture3D(B,0),it=I.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(O.setTexture2DArray(B,0),it=I.TEXTURE_2D_ARRAY):(O.setTexture2D(B,0),it=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,B.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,B.unpackAlignment);const Ze=I.getParameter(I.UNPACK_ROW_LENGTH),Rt=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Sn=I.getParameter(I.UNPACK_SKIP_PIXELS),kt=I.getParameter(I.UNPACK_SKIP_ROWS),an=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,Tt.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Tt.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ue),I.pixelStorei(I.UNPACK_SKIP_ROWS,Ve),I.pixelStorei(I.UNPACK_SKIP_IMAGES,ze);const rt=w.isDataArrayTexture||w.isData3DTexture,Gt=B.isDataArrayTexture||B.isData3DTexture;if(w.isDepthTexture){const $t=v.get(w),Lt=v.get(B),Vt=v.get($t.__renderTarget),wn=v.get(Lt.__renderTarget);ge.bindFramebuffer(I.READ_FRAMEBUFFER,Vt.__webglFramebuffer),ge.bindFramebuffer(I.DRAW_FRAMEBUFFER,wn.__webglFramebuffer);for(let qt=0;qt<Pe;qt++)rt&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,v.get(w).__webglTexture,z,ze+qt),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,v.get(B).__webglTexture,we,Mt+qt)),I.blitFramebuffer(Ue,Ve,fe,Ee,Qe,mt,fe,Ee,I.DEPTH_BUFFER_BIT,I.NEAREST);ge.bindFramebuffer(I.READ_FRAMEBUFFER,null),ge.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(z!==0||w.isRenderTargetTexture||v.has(w)){const $t=v.get(w),Lt=v.get(B);ge.bindFramebuffer(I.READ_FRAMEBUFFER,zr),ge.bindFramebuffer(I.DRAW_FRAMEBUFFER,ir);for(let Vt=0;Vt<Pe;Vt++)rt?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,$t.__webglTexture,z,ze+Vt):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,$t.__webglTexture,z),Gt?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Lt.__webglTexture,we,Mt+Vt):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Lt.__webglTexture,we),z!==0?I.blitFramebuffer(Ue,Ve,fe,Ee,Qe,mt,fe,Ee,I.COLOR_BUFFER_BIT,I.NEAREST):Gt?I.copyTexSubImage3D(it,we,Qe,mt,Mt+Vt,Ue,Ve,fe,Ee):I.copyTexSubImage2D(it,we,Qe,mt,Ue,Ve,fe,Ee);ge.bindFramebuffer(I.READ_FRAMEBUFFER,null),ge.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else Gt?w.isDataTexture||w.isData3DTexture?I.texSubImage3D(it,we,Qe,mt,Mt,fe,Ee,Pe,gt,Oe,Tt.data):B.isCompressedArrayTexture?I.compressedTexSubImage3D(it,we,Qe,mt,Mt,fe,Ee,Pe,gt,Tt.data):I.texSubImage3D(it,we,Qe,mt,Mt,fe,Ee,Pe,gt,Oe,Tt):w.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,we,Qe,mt,fe,Ee,gt,Oe,Tt.data):w.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,we,Qe,mt,Tt.width,Tt.height,gt,Tt.data):I.texSubImage2D(I.TEXTURE_2D,we,Qe,mt,fe,Ee,gt,Oe,Tt);I.pixelStorei(I.UNPACK_ROW_LENGTH,Ze),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Rt),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Sn),I.pixelStorei(I.UNPACK_SKIP_ROWS,kt),I.pixelStorei(I.UNPACK_SKIP_IMAGES,an),we===0&&B.generateMipmaps&&I.generateMipmap(it),ge.unbindTexture()},this.initRenderTarget=function(w){v.get(w).__webglFramebuffer===void 0&&O.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?O.setTextureCube(w,0):w.isData3DTexture?O.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?O.setTexture2DArray(w,0):O.setTexture2D(w,0),ge.unbindTexture()},this.resetState=function(){U=0,V=0,H=null,ge.reset(),Se.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return $n}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=pt._getDrawingBufferColorSpace(e),t.unpackColorSpace=pt._getUnpackColorSpace()}}function ds(i,e,t){const n=(i%360+360)%360;let r="";n>=337.5||n<22.5?r="front":n>=22.5&&n<67.5?r="front-left quarter":n>=67.5&&n<112.5?r="left profile":n>=112.5&&n<157.5?r="back-left quarter":n>=157.5&&n<202.5?r="back":n>=202.5&&n<247.5?r="back-right quarter":n>=247.5&&n<292.5?r="right profile":r="front-right quarter";let a="";e<-15?a="low-angle":e>15?a="high-angle":a="eye-level";let o="";return t<.8?o="close-up":t>1.3?o="wide shot":o="medium shot",`<sks> ${r} view ${a} shot ${o}`}const Ao={turnaround:[{label:"Front",azimuth:0,elevation:0,distance:1},{label:"Front-Left",azimuth:45,elevation:0,distance:1},{label:"Left",azimuth:90,elevation:0,distance:1},{label:"Back-Left",azimuth:135,elevation:0,distance:1},{label:"Back",azimuth:180,elevation:0,distance:1},{label:"Back-Right",azimuth:225,elevation:0,distance:1},{label:"Right",azimuth:270,elevation:0,distance:1},{label:"Front-Right",azimuth:315,elevation:0,distance:1}],cardinal:[{label:"Front",azimuth:0,elevation:0,distance:1},{label:"Right",azimuth:90,elevation:0,distance:1},{label:"Back",azimuth:180,elevation:0,distance:1},{label:"Left",azimuth:270,elevation:0,distance:1}],angles:[{label:"Low Angle",azimuth:0,elevation:-20,distance:1},{label:"Eye Level",azimuth:0,elevation:0,distance:1},{label:"High Angle",azimuth:0,elevation:30,distance:1}],distances:[{label:"Close-Up",azimuth:0,elevation:0,distance:.7},{label:"Medium",azimuth:0,elevation:0,distance:1},{label:"Wide",azimuth:0,elevation:0,distance:1.5}]},Pd=1.6,Co=2.4,da=1.8,Bt=new k(0,.75,0);function Wv({azimuth:i,setAzimuth:e,elevation:t,setElevation:n,distance:r,setDistance:a,subjectImage:o}){const l=Z.useRef(null),d=Z.useRef({scene:null,renderer:null,camera:null,animation:null,handles:{},plane:{},state:{azimuth:i,elevation:t,distance:r}});Z.useEffect(()=>{d.current.state={azimuth:i,elevation:t,distance:r}},[i,t,r]),Z.useEffect(()=>{if(!l.current)return;const u=l.current,f=u.clientWidth,m=400,g=new up;g.background=new ht(1710638),d.current.scene=g;const y=new bn(50,f/m,.1,1e3);y.position.set(3,3,5),y.lookAt(0,.5,0),d.current.camera=y;const _=new Hv({antialias:!0});_.setSize(f,m),_.setPixelRatio(window.devicePixelRatio),u.appendChild(_.domElement),d.current.renderer=_;const x=new Wp(16777215,.6);g.add(x);const p=new Hp(16777215,.8);p.position.set(5,10,7),g.add(p);const E=new qp(8,16,2763326,2763326);E.position.y=0,g.add(E);const T=new Sr,C=new Rr(1.2,1.2),N=new Di({color:3816010,side:Nn}),L=new zt(C,N);T.add(L);const D=document.createElement("canvas");D.width=256,D.height=256;const j=D.getContext("2d");j&&(j.fillStyle="#3a3a4a",j.fillRect(0,0,256,256),j.fillStyle="#f5a623",j.beginPath(),j.arc(128,128,80,0,Math.PI*2),j.fill(),j.fillStyle="#1a1a2e",j.beginPath(),j.arc(100,110,12,0,Math.PI*2),j.fill(),j.beginPath(),j.arc(156,110,12,0,Math.PI*2),j.fill(),j.strokeStyle="#1a1a2e",j.lineWidth=8,j.beginPath(),j.arc(128,130,45,.2,Math.PI-.2),j.stroke());const S=new vp(D),M=new Fl({map:S,transparent:!0,side:Nn}),U=new zt(new Rr(1.1,1.1),M);U.position.z=.01,T.add(U),T.position.set(0,.75,0),g.add(T),d.current.plane={cardGroup:T,smileyPlane:U,smileyMat:M};const V=new zl(Co,.05,16,64),H=new Di({color:65433,emissive:65433,emissiveIntensity:.4}),K=new zt(V,H);K.rotation.x=Math.PI/2,K.position.y=.02,g.add(K);const Q=new cs(.18,16,16),J=new Di({color:65484,emissive:65484,emissiveIntensity:.5}),Y=new zt(Q,J);Y.userData={type:"azimuth"},g.add(Y);const me=(()=>{const he=[];for(let ae=0;ae<=32;ae++){const Te=Yr.degToRad(-30+90*ae/32);he.push(new k(-.5,da*Math.sin(Te)+Bt.y,da*Math.cos(Te)))}const ee=new dh(he);return new Gl(ee,32,.05,8,!1)})(),ve=new Di({color:16738740,emissive:16738740,emissiveIntensity:.4}),be=new zt(me,ve);g.add(be);const pe=new cs(.18,16,16),Ke=new Di({color:16738740,emissive:16738740,emissiveIntensity:.5}),nt=new zt(pe,Ke);nt.userData={type:"elevation"},g.add(nt);const ut=new Zt,te=new Ol({color:16753920}),oe=new oh(ut,te);g.add(oe);const Ne=new cs(.18,16,16),Ye=new Di({color:16763904,emissive:16763904,emissiveIntensity:.5}),Ce=new zt(Ne,Ye);Ce.userData={type:"distance"},g.add(Ce);const We=new Sr,Et=new Ir(.4,.25,.25),et=new Di({color:4871528}),ot=new zt(Et,et);We.add(ot);const je=new jl(.08,.1,.18,16),Fe=new Di({color:2963272}),vt=new zt(je,Fe);vt.rotation.z=Math.PI/2,vt.position.x=-.28,We.add(vt),g.add(We),d.current.handles={azimuthHandle:Y,elevationHandle:nt,distanceHandle:Ce,distanceLine:oe,cameraGroup:We,elevationArc:be,cardGroup:T};const I=()=>{const{azimuth:he,elevation:ee,distance:ae}=d.current.state,Te=Pd*ae,_e=Yr.degToRad(he),ue=Yr.degToRad(ee),Be=Te*Math.sin(_e)*Math.cos(ue),F=Te*Math.sin(ue)+Bt.y,xe=Te*Math.cos(_e)*Math.cos(ue);We.position.set(Be,F,xe),We.lookAt(Bt),Y.position.set(Co*Math.sin(_e),.02,Co*Math.cos(_e)),nt.position.set(-.5,da*Math.sin(ue)+Bt.y,da*Math.cos(ue));const de=.7;Ce.position.set(Bt.x+(Be-Bt.x)*de,Bt.y+(F-Bt.y)*de,Bt.z+(xe-Bt.z)*de);const Se=new Float32Array([Bt.x,Bt.y,Bt.z,Be,F,xe]);ut.setAttribute("position",new Ln(Se,3))};I();const wt=()=>{d.current.animation=requestAnimationFrame(wt),I(),_.render(g,y)};wt();const Ie=new $p,ct=new He;let ge=!1,A=null;const v=he=>{const ee=_.domElement.getBoundingClientRect();ct.x=(he.clientX-ee.left)/ee.width*2-1,ct.y=-((he.clientY-ee.top)/ee.height)*2+1},O=he=>{v(he),Ie.setFromCamera(ct,y);const ee=Ie.intersectObjects([Y,nt,Ce]);ee.length>0&&(ge=!0,A=ee[0].object,A.material.emissiveIntensity=1,A.scale.setScalar(1.3),_.domElement.style.cursor="grabbing")},P=he=>{if(v(he),!ge){Ie.setFromCamera(ct,y);const ee=Ie.intersectObjects([Y,nt,Ce]);_.domElement.style.cursor=ee.length>0?"grab":"default";return}if(A){Ie.setFromCamera(ct,y);const ee=new k,ae=A.userData;if(ae.type==="azimuth"){const Te=new Hn(new k(0,1,0),0);if(Ie.ray.intersectPlane(Te,ee),ee){let _e=Yr.radToDeg(Math.atan2(ee.x,ee.z));_e<0&&(_e+=360),e(Math.round(_e))}}else if(ae.type==="elevation"){const Te=new Hn(new k(1,0,0),.5);if(Ie.ray.intersectPlane(Te,ee),ee){const _e=ee.y-Bt.y,ue=ee.z;let Be=Yr.radToDeg(Math.atan2(_e,ue));Be=Math.max(-30,Math.min(60,Be)),n(Math.round(Be))}}else if(ae.type==="distance"){const Te=new Hn(new k(0,1,0),-Bt.y);if(Ie.ray.intersectPlane(Te,ee),ee){const _e=ee.distanceTo(new k(Bt.x,Bt.y,Bt.z))/Pd,ue=Math.max(.6,Math.min(1.8,_e));a(Math.round(ue*10)/10)}}}},q=()=>{A&&(A.material.emissiveIntensity=.5,A.scale.setScalar(1)),ge=!1,A=null,_.domElement.style.cursor="default"},G=he=>{he.preventDefault();const ee=he.touches[0];O({clientX:ee.clientX,clientY:ee.clientY})},Me=he=>{he.preventDefault();const ee=he.touches[0];P({clientX:ee.clientX,clientY:ee.clientY})},se=he=>{he.preventDefault(),q()};_.domElement.addEventListener("mousedown",O),_.domElement.addEventListener("mousemove",P),_.domElement.addEventListener("mouseup",q),_.domElement.addEventListener("mouseleave",q),_.domElement.addEventListener("touchstart",G,{passive:!1}),_.domElement.addEventListener("touchmove",Me,{passive:!1}),_.domElement.addEventListener("touchend",se,{passive:!1});const Re=()=>{const he=u.clientWidth;y.aspect=he/m,y.updateProjectionMatrix(),_.setSize(he,m)};return window.addEventListener("resize",Re),()=>{d.current.animation&&cancelAnimationFrame(d.current.animation),_.dispose(),u.contains(_.domElement)&&u.removeChild(_.domElement),window.removeEventListener("resize",Re)}},[e,n,a]),Z.useEffect(()=>{if(!o||!d.current.plane.smileyPlane)return;const u=new zp;u.crossOrigin="anonymous",u.load(o,f=>{const{smileyPlane:m}=d.current.plane;m&&(m.material.map=f,m.material.needsUpdate=!0)})},[o]);const h=ds(i,t,r);return s.jsxs("div",{className:"bg-zinc-900/50 rounded-lg border border-zinc-700 p-4",children:[s.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[s.jsx("span",{className:"text-xl",children:"🎬"}),s.jsx("h3",{className:"text-sm font-semibold text-white",children:"3D Camera Control"})]}),s.jsxs("p",{className:"text-xs text-zinc-400 mb-4",children:[s.jsx("em",{children:"Drag the handles:"}),s.jsxs("span",{className:"inline-flex items-center gap-1 ml-2",children:[s.jsx("span",{className:"w-3 h-3 rounded-full",style:{background:"#00ffcc"}})," Azimuth"]}),s.jsxs("span",{className:"inline-flex items-center gap-1 ml-2",children:[s.jsx("span",{className:"w-3 h-3 rounded-full",style:{background:"#ff69b4"}})," Elevation"]}),s.jsxs("span",{className:"inline-flex items-center gap-1 ml-2",children:[s.jsx("span",{className:"w-3 h-3 rounded-full",style:{background:"#ffcc00"}})," Distance"]})]}),s.jsx("div",{ref:l,className:"rounded-xl overflow-hidden",style:{height:400,background:"#1a1a2e"}}),s.jsxs("div",{className:"grid grid-cols-3 gap-3 mt-4",children:[s.jsxs("div",{children:[s.jsx("label",{className:"text-xs text-zinc-400 block mb-1",children:"Azimuth"}),s.jsx("input",{type:"number",value:i,onChange:u=>e(Number(u.target.value)%360),className:"w-full bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-sm text-white",min:0,max:359})]}),s.jsxs("div",{children:[s.jsx("label",{className:"text-xs text-zinc-400 block mb-1",children:"Elevation"}),s.jsx("input",{type:"number",value:t,onChange:u=>n(Math.max(-30,Math.min(60,Number(u.target.value)))),className:"w-full bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-sm text-white",min:-30,max:60})]}),s.jsxs("div",{children:[s.jsx("label",{className:"text-xs text-zinc-400 block mb-1",children:"Distance"}),s.jsx("input",{type:"number",value:r,onChange:u=>a(Math.max(.6,Math.min(1.8,Number(u.target.value)))),className:"w-full bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-sm text-white",min:.6,max:1.8,step:.1})]})]}),s.jsx("div",{className:"mt-4 p-3 rounded-lg",style:{background:"rgba(0, 255, 136, 0.15)"},children:s.jsx("code",{className:"text-green-400 font-mono text-sm",children:h})})]})}const Xv=[{value:"turnaround",label:"Full Turnaround (8 angles)",count:8},{value:"cardinal",label:"Cardinal (4 angles)",count:4},{value:"angles",label:"Elevation (3 angles)",count:3},{value:"distances",label:"Distances (3 shots)",count:3}];function $v({sourceImage:i,onBatchComplete:e,onImageGenerated:t,generateAngleImage:n}){const[r,a]=Z.useState("cardinal"),[o,l]=Z.useState(!1),[d,h]=Z.useState({current:0,total:0}),[u,f]=Z.useState([]),m=Z.useCallback(async()=>{if(!i){alert("Please upload a source image first");return}const _=Ao[r];if(!_)return;l(!0),h({current:0,total:_.length}),f([]);const x=[];for(let p=0;p<_.length;p++){const E=_[p];h({current:p+1,total:_.length});try{const T=await n(E,i),C={angle:E,status:"success",url:T};x.push(C),f([...x]),t&&t(C)}catch(T){const C={angle:E,status:"error",error:T instanceof Error?T.message:"Unknown error"};x.push(C),f([...x])}}l(!1),e?.(x)},[i,r,e,t,n]),g=_=>{const x=Ao[_];return x?x.map(p=>p.label).join(", "):""},y=Ao[r]||[];return s.jsxs("div",{className:"bg-zinc-900/50 rounded-lg border border-zinc-700 p-4 space-y-4",children:[s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx("span",{className:"text-xl",children:"🔄"}),s.jsx("h3",{className:"text-sm font-semibold text-white",children:"Batch Generator"})]}),s.jsxs("div",{className:"space-y-3",children:[s.jsx("p",{className:"text-xs text-zinc-500",children:"Select Preset"}),s.jsx("div",{className:"grid grid-cols-2 gap-2",children:Xv.map(_=>s.jsxs("button",{onClick:()=>a(_.value),className:`p-3 rounded-lg border text-left transition-all ${r===_.value?"border-cyan-500 bg-cyan-500/10":"border-zinc-700 hover:border-zinc-500"}`,children:[s.jsx("div",{className:"font-medium text-sm text-white",children:_.label}),s.jsx("div",{className:"text-xs text-zinc-400 mt-1",children:g(_.value)})]},_.value))})]}),s.jsxs("div",{className:"bg-zinc-800/50 rounded-lg p-4",children:[s.jsx("p",{className:"text-xs text-zinc-500 mb-2",children:"Angles to Generate:"}),s.jsx("div",{className:"flex flex-wrap gap-2",children:y.map((_,x)=>s.jsx("span",{className:"px-2 py-1 text-xs bg-zinc-900 border border-zinc-700 rounded text-zinc-300",title:ds(_.azimuth,_.elevation,_.distance),children:_.label},x))})]}),o&&s.jsxs("div",{className:"space-y-2",children:[s.jsxs("div",{className:"flex justify-between text-xs text-zinc-400",children:[s.jsx("span",{children:"Generating..."}),s.jsxs("span",{children:[d.current," / ",d.total]})]}),s.jsx("div",{className:"h-2 bg-zinc-800 rounded-full overflow-hidden",children:s.jsx("div",{className:"h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all",style:{width:`${d.current/d.total*100}%`}})})]}),u.length>0&&s.jsxs("div",{className:"space-y-2",children:[s.jsxs("p",{className:"text-xs text-zinc-500",children:["Generated (",u.filter(_=>_.status==="success").length," / ",u.length,")"]}),s.jsx("div",{className:"grid grid-cols-4 gap-2",children:u.map((_,x)=>s.jsx("div",{className:`aspect-square rounded-lg border overflow-hidden ${_.status==="success"?"border-green-500/50":_.status==="error"?"border-red-500/50":"border-zinc-700"}`,children:_.status==="success"&&_.url?s.jsx("img",{src:_.url,alt:_.angle?.label,className:"w-full h-full object-cover"}):_.status==="error"?s.jsx("div",{className:"w-full h-full flex items-center justify-center bg-red-500/10 text-red-400 text-xs",children:"Error"}):s.jsx("div",{className:"w-full h-full flex items-center justify-center bg-zinc-800",children:s.jsx("span",{className:"animate-pulse text-zinc-400",children:"..."})})},x))})]}),s.jsx("button",{onClick:m,disabled:o||!i,className:"w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-cyan-500/25",children:o?`Generating ${d.current}/${d.total}...`:`Generate ${y.length} Angles`}),s.jsxs("p",{className:"text-xs text-center text-zinc-500",children:["Estimated cost: ~$",(y.length*.03).toFixed(2)," (",y.length," x $0.03)"]})]})}const Ld={"stanley-kubrick":"Stanley Kubrick","steven-spielberg":"Steven Spielberg","christopher-nolan":"Christopher Nolan","denis-villeneuve":"Denis Villeneuve","david-fincher":"David Fincher","quentin-tarantino":"Quentin Tarantino","wes-anderson":"Wes Anderson","martin-scorsese":"Martin Scorsese","ridley-scott":"Ridley Scott","terrence-malick":"Terrence Malick","akira-kurosawa":"Akira Kurosawa","alfred-hitchcock":"Alfred Hitchcock","bong-joon-ho":"Bong Joon-ho","damien-chazelle":"Damien Chazelle","francis-ford-coppola":"Francis Ford Coppola","james-cameron":"James Cameron","coen-brothers":"Coen Brothers","ari-aster":"Ari Aster","barry-jenkins":"Barry Jenkins","sam-mendes":"Sam Mendes"};function qv({onSelectShots:i,onClose:e,userAssets:t=[],onAddAsset:n,onRemoveAsset:r,selectedAsset:a,onSelectAsset:o}){const[l,d]=Z.useState(null),[h,u]=Z.useState(!0),[f,m]=Z.useState(null),[g,y]=Z.useState(new Map),[_,x]=Z.useState(""),[p,E]=Z.useState(null),[T,C]=Z.useState(null),[N,L]=Z.useState(null),[D,j]=Z.useState(null),[S,M]=Z.useState(null),[U,V]=Z.useState(24),[H,K]=Z.useState(!1),[Q,J]=Z.useState(""),[Y,le]=Z.useState("character"),[me,ve]=Z.useState(""),[be,pe]=Z.useState(null),Ke=Z.useRef(null),[nt,ut]=Z.useState("upload"),[te,oe]=Z.useState([]),[Ne,Ye]=Z.useState(!1),[Ce,We]=Z.useState(null),Et=Z.useRef(null),[et,ot]=Z.useState("shots");Z.useEffect(()=>{(async()=>{try{const q=await fetch("/movie-shots/index.json");if(!q.ok)throw new Error("Failed to load movie shots index");const G=await q.json();d(G)}catch(q){m(q instanceof Error?q.message:"Failed to load")}finally{u(!1)}})()},[]);const je=Z.useMemo(()=>l?l.shots.filter(P=>{if(_){const q=_.toLowerCase();if(!(P.film.toLowerCase().includes(q)||P.prompt.toLowerCase().includes(q)||P.tags.some(Me=>Me.toLowerCase().includes(q))||P.location.toLowerCase().includes(q)))return!1}return!(p&&P.director!==p||T&&P.emotion!==T||N&&P.lighting!==N||D&&P.shot!==D||S&&P.environment!==S)}):[],[l,_,p,T,N,D,S]);Z.useEffect(()=>{V(24)},[_,p,T,N,D,S]);const Fe=()=>{x(""),E(null),C(null),L(null),j(null),M(null)},vt=_||p||T||N||D||S,I=P=>{const q=`/movie-shots/${P.image}`;y(G=>{const Me=new Map(G);return Me.has(P.id)?Me.delete(P.id):Me.size<7&&Me.set(P.id,{shot:P,imageUrl:q}),Me})},wt=()=>{const P=Array.from(g.values());i(P)},Ie=P=>{const q=P.target.files?.[0];if(!q)return;const G=new FileReader;G.onload=Me=>{pe(Me.target?.result)},G.readAsDataURL(q),P.target.value=""},ct=async P=>{const q=P.target.files?.[0];if(!q)return;const G=new FormData;G.append("file",q);try{const se=await(await fetch("/api/cinema/upload",{method:"POST",body:G})).json();se.url?oe(Re=>[...Re.slice(0,6),se.url]):console.error("Upload failed:",se.error)}catch(Me){console.error("Ref upload failed:",Me)}P.target.value=""},ge=P=>{oe(q=>q.filter((G,Me)=>Me!==P))},A=async()=>{if(!(!me||!n)){Ye(!0),We(null);try{const q=`${me}. ${{character:"Character portrait, centered composition, full detail, clean background.",item:"Product shot, centered, clean white background, studio lighting.",vehicle:"Vehicle showcase, 3/4 angle, clean studio environment.",creature:"Fantasy creature portrait, detailed, clean background, concept art style."}[Y]} High quality, 4K, detailed.`,G={type:te.length>0?"edit":"image",prompt:q,aspect_ratio:"1:1"};te.length>0&&(G.image_urls=te);const se=await(await fetch("/api/cinema/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(G)})).json();if(se.image_url){const Re={id:`asset-${Date.now()}`,name:Q||`Generated ${Y}`,type:Y,imageUrl:se.image_url,description:me};n(Re),v()}else We(se.error||"Generation failed")}catch(P){We(P instanceof Error?P.message:"Unknown error")}finally{Ye(!1)}}},v=()=>{J(""),ve(""),pe(null),oe([]),ut("upload"),We(null),K(!1)},O=()=>{if(!Q||!me||!be||!n)return;const P={id:`asset-${Date.now()}`,name:Q,type:Y,imageUrl:be,description:me};n(P),v()};return h?s.jsx("div",{className:"flex items-center justify-center h-64",children:s.jsxs("div",{className:"flex items-center gap-3 text-gray-400",children:[s.jsx("svg",{className:"w-5 h-5 animate-spin",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:s.jsx("path",{d:"M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"})}),"Loading ",l?.count||2100,"+ movie shots..."]})}):f?s.jsx("div",{className:"p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm",children:f}):s.jsxs("div",{className:"flex flex-col h-full",children:[s.jsxs("div",{className:"flex items-center justify-between mb-4",children:[s.jsxs("div",{className:"flex items-center gap-4",children:[s.jsx("h2",{className:"text-lg font-semibold text-white",children:"Movie Shots Library"}),s.jsxs("div",{className:"flex bg-[#2a2a2a] rounded-lg p-0.5",children:[s.jsxs("button",{onClick:()=>ot("shots"),className:`px-3 py-1 rounded-md text-xs font-medium transition-all ${et==="shots"?"bg-amber-500 text-black":"text-gray-400 hover:text-white"}`,children:["Shots (",je.length,")"]}),s.jsxs("button",{onClick:()=>ot("assets"),className:`px-3 py-1 rounded-md text-xs font-medium transition-all ${et==="assets"?"bg-green-500 text-black":"text-gray-400 hover:text-white"}`,children:["My Assets (",t.length,")"]})]})]}),s.jsxs("div",{className:"flex items-center gap-2",children:[g.size>0&&s.jsxs("span",{className:"px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs",children:[g.size,"/7 selected"]}),s.jsx("button",{onClick:e,className:"p-2 hover:bg-gray-700 rounded-lg transition-colors",children:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-5 h-5 text-gray-400",children:s.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]})]}),et==="shots"&&s.jsxs(s.Fragment,{children:[s.jsx("div",{className:"mb-3",children:s.jsx("input",{type:"text",value:_,onChange:P=>x(P.target.value),placeholder:"Search films, tags, locations...",className:"w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"})}),a&&s.jsxs("div",{className:"mb-3 p-2 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3",children:[s.jsx("img",{src:a.imageUrl,alt:a.name,className:"w-10 h-10 rounded object-cover"}),s.jsxs("div",{className:"flex-1",children:[s.jsxs("div",{className:"text-xs text-green-400 font-medium",children:["Swapping with: ",a.name]}),s.jsxs("div",{className:"text-[10px] text-gray-400 truncate",children:[a.description.substring(0,50),"..."]})]}),s.jsx("button",{onClick:()=>o?.(null),className:"px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30",children:"Clear"})]}),s.jsxs("div",{className:"flex flex-wrap gap-2 mb-3",children:[s.jsxs("select",{value:p||"",onChange:P=>E(P.target.value||null),className:"bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50",children:[s.jsx("option",{value:"",children:"All Directors"}),l?.filters.directors.map(P=>s.jsx("option",{value:P,children:Ld[P]||P},P))]}),s.jsxs("select",{value:T||"",onChange:P=>C(P.target.value||null),className:"bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50",children:[s.jsx("option",{value:"",children:"All Emotions"}),l?.filters.emotions.map(P=>s.jsx("option",{value:P,children:P},P))]}),s.jsxs("select",{value:N||"",onChange:P=>L(P.target.value||null),className:"bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50",children:[s.jsx("option",{value:"",children:"All Lighting"}),l?.filters.lighting.map(P=>s.jsx("option",{value:P,children:P},P))]}),s.jsxs("select",{value:D||"",onChange:P=>j(P.target.value||null),className:"bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50",children:[s.jsx("option",{value:"",children:"All Shot Types"}),l?.filters.shotTypes.map(P=>s.jsx("option",{value:P,children:P},P))]}),s.jsxs("select",{value:S||"",onChange:P=>M(P.target.value||null),className:"bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50",children:[s.jsx("option",{value:"",children:"All Environments"}),l?.filters.environments.map(P=>s.jsx("option",{value:P,children:P},P))]}),vt&&s.jsx("button",{onClick:Fe,className:"px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs transition-colors",children:"Clear All"})]}),g.size>0&&s.jsxs("div",{className:"mb-3 p-2 bg-[#1f1f1f] rounded-lg border border-cyan-500/30",children:[s.jsxs("div",{className:"flex items-center justify-between mb-2",children:[s.jsx("span",{className:"text-xs text-cyan-400",children:"Selected Reference Shots"}),s.jsx("button",{onClick:()=>y(new Map),className:"text-xs text-red-400 hover:underline",children:"Clear All"})]}),s.jsx("div",{className:"flex gap-2 flex-wrap",children:Array.from(g.values()).map(({shot:P,imageUrl:q},G)=>s.jsxs("div",{className:"relative group",children:[s.jsx("img",{src:q,alt:P.film,className:"w-16 h-10 object-cover rounded border border-cyan-500/50"}),s.jsx("div",{className:"absolute -top-1 -left-1 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold",children:G+1}),s.jsx("button",{onClick:()=>I(P),className:"absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",children:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"white",strokeWidth:"3",className:"w-2 h-2",children:s.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]},P.id))}),s.jsxs("button",{onClick:wt,className:"mt-2 w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity",children:["Use ",g.size," Shot",g.size>1?"s":""," as Reference"]})]}),s.jsxs("div",{className:"flex-1 overflow-y-auto",children:[s.jsx("div",{className:"grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2",children:je.slice(0,U).map(P=>{const q=g.has(P.id);return s.jsxs("div",{onClick:()=>I(P),className:`group relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${q?"border-cyan-500 ring-2 ring-cyan-500/30":"border-gray-700 hover:border-cyan-500/50"}`,children:[s.jsx("img",{src:`/movie-shots/${P.image}`,alt:P.film,className:"w-full h-full object-cover",loading:"lazy"}),q&&s.jsx("div",{className:"absolute top-1 right-1 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center",children:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"white",strokeWidth:"3",className:"w-3 h-3",children:s.jsx("path",{d:"M20 6L9 17l-5-5"})})}),s.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity",children:s.jsxs("div",{className:"absolute bottom-0 left-0 right-0 p-2",children:[s.jsx("div",{className:"text-[10px] text-white font-medium truncate",children:P.film}),s.jsxs("div",{className:"text-[9px] text-gray-400",children:[P.shot," • ",P.emotion]})]})}),s.jsx("div",{className:"absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[8px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity",children:Ld[P.director]||P.director})]},P.id)})}),U<je.length&&s.jsx("div",{className:"flex justify-center mt-4 pb-4",children:s.jsxs("button",{onClick:()=>V(P=>P+24),className:"px-4 py-2 bg-[#2a2a2a] hover:bg-gray-700 rounded-lg text-sm text-gray-400 transition-colors",children:["Load More (",je.length-U," remaining)"]})}),je.length===0&&s.jsxs("div",{className:"flex flex-col items-center justify-center py-12 text-gray-500",children:[s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-12 h-12 mb-3 opacity-50",children:[s.jsx("circle",{cx:"11",cy:"11",r:"8"}),s.jsx("path",{d:"M21 21l-4.35-4.35"})]}),s.jsx("p",{className:"text-sm",children:"No shots match your filters"}),s.jsx("button",{onClick:Fe,className:"mt-2 text-cyan-400 text-xs hover:underline",children:"Clear filters"})]})]})]}),et==="assets"&&s.jsxs("div",{className:"flex-1 overflow-y-auto",children:[s.jsxs("div",{className:"mb-4",children:[s.jsx("p",{className:"text-xs text-gray-400 mb-3",children:"Upload your own characters, items, or creatures. When you select a movie shot, the subject will be swapped with your asset in the generated prompt."}),!H&&n&&s.jsxs("button",{onClick:()=>K(!0),className:"w-full py-3 border-2 border-dashed border-gray-700 hover:border-green-500/50 rounded-lg text-gray-400 hover:text-green-400 transition-colors flex items-center justify-center gap-2",children:[s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-5 h-5",children:s.jsx("path",{d:"M12 5v14M5 12h14"})}),"Add New Asset"]}),H&&s.jsxs("div",{className:"p-4 bg-[#1f1f1f] rounded-lg border border-green-500/30 mb-4",children:[s.jsxs("div",{className:"flex items-center justify-between mb-3",children:[s.jsx("span",{className:"text-sm text-green-400 font-medium",children:"New Asset"}),s.jsx("button",{onClick:v,className:"text-gray-400 hover:text-white",children:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-4 h-4",children:s.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]}),s.jsxs("div",{className:"flex mb-3 bg-[#2a2a2a] rounded-lg p-1",children:[s.jsx("button",{onClick:()=>ut("upload"),className:`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${nt==="upload"?"bg-green-500 text-white":"text-gray-400 hover:text-white"}`,children:"Upload Image"}),s.jsx("button",{onClick:()=>ut("generate"),className:`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${nt==="generate"?"bg-purple-500 text-white":"text-gray-400 hover:text-white"}`,children:"Generate with AI"})]}),Ce&&s.jsx("div",{className:"mb-3 px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-xs text-red-300",children:Ce}),nt==="upload"&&s.jsxs("div",{className:"mb-3",children:[be?s.jsxs("div",{className:"relative",children:[s.jsx("img",{src:be,alt:"Asset preview",className:"w-full h-32 object-contain bg-[#2a2a2a] rounded-lg"}),s.jsx("button",{onClick:()=>pe(null),className:"absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center",children:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"white",strokeWidth:"2",className:"w-3 h-3",children:s.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]}):s.jsxs("button",{onClick:()=>Ke.current?.click(),className:"w-full h-24 border-2 border-dashed border-gray-700 hover:border-green-500/50 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-green-400 transition-colors",children:[s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-6 h-6 mb-1",children:[s.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2"}),s.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),s.jsx("path",{d:"M21 15l-5-5L5 21"})]}),s.jsx("span",{className:"text-xs",children:"Upload Image"})]}),s.jsx("input",{ref:Ke,type:"file",accept:"image/*",onChange:Ie,className:"hidden"})]}),nt==="generate"&&s.jsxs("div",{className:"mb-3",children:[s.jsx("div",{className:"text-[10px] text-gray-500 uppercase mb-2",children:"Reference Images (Optional)"}),s.jsxs("div",{className:"flex flex-wrap gap-2 mb-2",children:[te.map((P,q)=>s.jsxs("div",{className:"relative w-14 h-14",children:[s.jsx("img",{src:P,alt:`Ref ${q+1}`,className:"w-full h-full object-cover rounded-lg border border-purple-500/50"}),s.jsx("button",{onClick:()=>ge(q),className:"absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center",children:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"white",strokeWidth:"3",className:"w-2 h-2",children:s.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]},q)),te.length<7&&s.jsx("button",{onClick:()=>Et.current?.click(),className:"w-14 h-14 border-2 border-dashed border-gray-700 hover:border-purple-500/50 rounded-lg flex items-center justify-center text-gray-500 hover:text-purple-400 transition-colors",children:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-5 h-5",children:s.jsx("path",{d:"M12 5v14M5 12h14"})})})]}),s.jsx("input",{ref:Et,type:"file",accept:"image/*",onChange:ct,className:"hidden"}),s.jsx("div",{className:"text-[9px] text-gray-500",children:"Add reference images for style/character consistency. Leave empty to generate from description only."})]}),s.jsx("input",{type:"text",value:Q,onChange:P=>J(P.target.value),placeholder:"Asset name (e.g., CHIP, Iron Golem)",className:"w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 mb-2"}),s.jsxs("select",{value:Y,onChange:P=>le(P.target.value),className:"w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50 mb-2",children:[s.jsx("option",{value:"character",children:"Character"}),s.jsx("option",{value:"item",children:"Item / Object"}),s.jsx("option",{value:"vehicle",children:"Vehicle"}),s.jsx("option",{value:"creature",children:"Creature"})]}),s.jsx("textarea",{value:me,onChange:P=>ve(P.target.value),placeholder:nt==="generate"?"Describe what to generate (e.g., 'Fluffy yellow chipmunk with green headphones, red jacket, blue pants, cute cartoon style, 8K')":"Detailed description for AI swapping (e.g., 'Fluffy yellow chipmunk with green headphones, red jacket, blue pants')",rows:3,className:"w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 mb-3 resize-none"}),nt==="upload"?s.jsx("button",{onClick:O,disabled:!Q||!me||!be,className:`w-full py-2 rounded-lg text-sm font-medium transition-colors ${Q&&me&&be?"bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90":"bg-gray-700 text-gray-500 cursor-not-allowed"}`,children:"Save Asset"}):s.jsx("button",{onClick:A,disabled:!me||Ne,className:`w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${me&&!Ne?"bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90":"bg-gray-700 text-gray-500 cursor-not-allowed"}`,children:Ne?s.jsxs(s.Fragment,{children:[s.jsx("div",{className:"w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"}),"Generating..."]}):s.jsx(s.Fragment,{children:"✨ Generate & Add to Assets"})})]})]}),s.jsx("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-3",children:t.map(P=>{const q=a?.id===P.id;return s.jsxs("div",{onClick:()=>o?.(q?null:P),className:`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${q?"bg-green-500/10 border-green-500":"bg-[#1f1f1f] border-gray-700 hover:border-green-500/50"}`,children:[s.jsx("img",{src:P.imageUrl,alt:P.name,className:"w-full h-20 object-contain bg-[#2a2a2a] rounded mb-2"}),s.jsx("div",{className:"text-sm text-white font-medium truncate",children:P.name}),s.jsx("div",{className:"text-[10px] text-gray-400 capitalize",children:P.type}),q&&s.jsx("div",{className:"absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center",children:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"white",strokeWidth:"3",className:"w-3 h-3",children:s.jsx("path",{d:"M20 6L9 17l-5-5"})})}),r&&s.jsx("button",{onClick:G=>{G.stopPropagation(),r(P.id)},className:"absolute top-2 left-2 w-5 h-5 bg-red-500/80 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity",children:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"white",strokeWidth:"2",className:"w-3 h-3",children:s.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]},P.id)})}),t.length===0&&!H&&s.jsxs("div",{className:"text-center py-8 text-gray-500",children:[s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-12 h-12 mx-auto mb-3 opacity-50",children:[s.jsx("circle",{cx:"12",cy:"7",r:"4"}),s.jsx("path",{d:"M5.5 21v-2a6.5 6.5 0 0113 0v2"})]}),s.jsx("p",{className:"text-sm",children:"No assets yet"}),s.jsx("p",{className:"text-xs mt-1",children:"Add your characters or items to swap them into movie shots"})]})]})]})}function ha(i){try{const e=i.match(/```(?:json)?\s*([\s\S]*?)```/);if(e){const n=e[1],r=JSON.parse(n);if(r.shots&&Array.isArray(r.shots)&&r.shots.length>0)return r.created_at=new Date().toISOString(),r.updated_at=new Date().toISOString(),r.character_references=r.character_references||{},r.scene_references=r.scene_references||{},r.shots=r.shots.map((a,o)=>({...a,order:a.order||o+1,status:"pending"})),r}const t=i.match(/\{[\s\S]*"shots"[\s\S]*\}/);if(t){const n=JSON.parse(t[0]);if(n.shots&&Array.isArray(n.shots))return n.created_at=new Date().toISOString(),n.updated_at=new Date().toISOString(),n.character_references=n.character_references||{},n.scene_references=n.scene_references||{},n.shots=n.shots.map((r,a)=>({...r,order:r.order||a+1,status:"pending"})),n}}catch{}return null}const $e={image:s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-5 h-5",children:[s.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2"}),s.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),s.jsx("path",{d:"M21 15l-5-5L5 21"})]}),video:s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-5 h-5",children:[s.jsx("rect",{x:"2",y:"4",width:"16",height:"16",rx:"2"}),s.jsx("path",{d:"M22 8l-4 2v4l4 2V8z"})]}),movement:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-4 h-4",children:s.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})}),aspectRatio:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-4 h-4",children:s.jsx("rect",{x:"3",y:"5",width:"18",height:"14",rx:"2"})}),clock:s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-4 h-4",children:[s.jsx("circle",{cx:"12",cy:"12",r:"9"}),s.jsx("path",{d:"M12 7v5l3 3"})]}),plus:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-5 h-5",children:s.jsx("path",{d:"M12 5v14M5 12h14"})}),minus:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-4 h-4",children:s.jsx("path",{d:"M5 12h14"})}),sparkle:s.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor",className:"w-4 h-4",children:s.jsx("path",{d:"M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"})}),camera:s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-5 h-5",children:[s.jsx("path",{d:"M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"}),s.jsx("circle",{cx:"12",cy:"13",r:"4"})]}),close:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-5 h-5",children:s.jsx("path",{d:"M18 6L6 18M6 6l12 12"})}),style:s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-4 h-4",children:[s.jsx("path",{d:"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.8-.1 2.6-.3"}),s.jsx("path",{d:"M12 2c3 3 4.5 6.5 4.5 10"}),s.jsx("path",{d:"M2 12h10"}),s.jsx("circle",{cx:"19",cy:"19",r:"3"}),s.jsx("path",{d:"M22 22l-1.5-1.5"})]}),light:s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-4 h-4",children:[s.jsx("circle",{cx:"12",cy:"12",r:"5"}),s.jsx("path",{d:"M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"})]}),weather:s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-4 h-4",children:[s.jsx("path",{d:"M8 19v2M8 13v2M16 19v2M16 13v2M12 21v2M12 15v2"}),s.jsx("path",{d:"M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25"})]}),speed:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-4 h-4",children:s.jsx("path",{d:"M13 2L3 14h9l-1 8 10-12h-9l1-8z"})}),director:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-4 h-4",children:s.jsx("path",{d:"M4 20h16M4 4l8 8-8 8M12 4l8 8-8 8"})}),emotion:s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-4 h-4",children:[s.jsx("circle",{cx:"12",cy:"12",r:"10"}),s.jsx("path",{d:"M8 14s1.5 2 4 2 4-2 4-2"}),s.jsx("line",{x1:"9",y1:"9",x2:"9.01",y2:"9",strokeWidth:"2"}),s.jsx("line",{x1:"15",y1:"9",x2:"15.01",y2:"9",strokeWidth:"2"})]}),shot:s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-4 h-4",children:[s.jsx("rect",{x:"2",y:"2",width:"20",height:"20",rx:"2"}),s.jsx("line",{x1:"2",y1:"8",x2:"22",y2:"8"}),s.jsx("line",{x1:"8",y1:"2",x2:"8",y2:"8"}),s.jsx("line",{x1:"16",y1:"2",x2:"16",y2:"8"})]}),framing:s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-4 h-4",children:[s.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"1"}),s.jsx("line",{x1:"8",y1:"3",x2:"8",y2:"21",opacity:"0.3"}),s.jsx("line",{x1:"16",y1:"3",x2:"16",y2:"21",opacity:"0.3"}),s.jsx("line",{x1:"3",y1:"8",x2:"21",y2:"8",opacity:"0.3"}),s.jsx("line",{x1:"3",y1:"16",x2:"21",y2:"16",opacity:"0.3"})]}),setDesign:s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-4 h-4",children:[s.jsx("path",{d:"M3 21h18"}),s.jsx("path",{d:"M5 21V7l7-4 7 4v14"}),s.jsx("rect",{x:"9",y:"13",width:"6",height:"8"})]}),palette:s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-4 h-4",children:[s.jsx("circle",{cx:"12",cy:"12",r:"10"}),s.jsx("circle",{cx:"12",cy:"8",r:"1.5",fill:"currentColor"}),s.jsx("circle",{cx:"8",cy:"12",r:"1.5",fill:"currentColor"}),s.jsx("circle",{cx:"16",cy:"12",r:"1.5",fill:"currentColor"}),s.jsx("circle",{cx:"12",cy:"16",r:"1.5",fill:"currentColor"})]}),character:s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-4 h-4",children:[s.jsx("circle",{cx:"12",cy:"7",r:"4"}),s.jsx("path",{d:"M5.5 21v-2a6.5 6.5 0 0113 0v2"})]})};function ua({items:i,selectedIndex:e,onSelect:t,label:n,renderItem:r,renderLabel:a}){const o=h=>{h.preventDefault();const u=h.deltaY>0?1:-1;let f=e+u;f<0&&(f=i.length-1),f>=i.length&&(f=0),t(f)},l=e>0?e-1:i.length-1,d=e<i.length-1?e+1:0;return s.jsxs("div",{onWheel:o,className:"flex flex-col items-center cursor-ns-resize select-none",children:[s.jsx("div",{className:"text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-medium",children:n}),s.jsx("div",{onClick:()=>t(l),className:"h-12 flex items-center justify-center opacity-20 hover:opacity-40 transition-all cursor-pointer",children:r(i[l],!1)}),s.jsx("div",{className:"w-24 h-24 bg-gray-800/80 rounded-2xl flex flex-col items-center justify-center border border-gray-700 my-1",children:r(i[e],!0)}),s.jsx("div",{className:"text-xs text-white mt-2 font-medium text-center",children:a?a(i[e]):i[e]}),s.jsx("div",{onClick:()=>t(d),className:"h-12 flex items-center justify-center opacity-20 hover:opacity-40 transition-all cursor-pointer mt-1",children:r(i[d],!1)})]})}function a_(){const{currentShot:i,shots:e,selectedPresets:t,selectedLens:n,selectedCamera:r,selectedFocus:a,isGenerating:o,generationProgress:l,error:d,setGenerating:h,setStartFrame:u,setEndFrame:f,setMotionPrompt:m,setModel:g,setDuration:y,setLens:_,setCameraBody:x,setFocus:p,togglePreset:E,clearPresets:T,startGeneration:C,setProgress:N,completeGeneration:L,failGeneration:D,saveCurrentAsShot:j,resetCurrent:S,characterDNA:M,setCharacterDNA:U,sequencePlan:V,isAutoChaining:H,currentSequenceIndex:K,addPlannedShot:Q,updatePlannedShot:J,removePlannedShot:Y,clearSequencePlan:le,setAutoChaining:me,setCurrentSequenceIndex:ve,markPlannedShotComplete:be}=hu(),{currentScene:pe,selectedShotId:Ke,loadScene:nt,clearScene:ut,resetAllGenerated:te,exportSceneJSON:oe,selectShot:Ne,updateShot:Ye,markShotGenerating:Ce,markShotComplete:We,updateCharacter:Et,addSceneRef:et,updateSceneRef:ot}=bu(),[je,Fe]=Z.useState(""),[vt,I]=Z.useState([]),[wt,Ie]=Z.useState(!1),[ct,ge]=Z.useState(!1),[A,v]=Z.useState(!1),[O,P]=Z.useState(!1),[q,G]=Z.useState(!1),[Me,se]=Z.useState(!1),[Re,he]=Z.useState(!1),[ee,ae]=Z.useState(!1),[Te,_e]=Z.useState(!1),[ue,Be]=Z.useState(!1),[F,xe]=Z.useState(!1),[de,Se]=Z.useState(!1),[ce,ne]=Z.useState(!1),[ye,Ge]=Z.useState(!1),[St,Je]=Z.useState(!1),[Qt,fn]=Z.useState("all"),[Zi,pn]=Z.useState(!1),[Qi,Dn]=Z.useState(!1),[Fr,ki]=Z.useState(!1),[In,gi]=Z.useState(!1),[kr,er]=Z.useState([]),[Qn,Or]=Z.useState(null),[nn,Oi]=Z.useState(""),[xi,jr]=Z.useState(null),[tr,Br]=Z.useState(null),[nr,zr]=Z.useState(""),[ir,w]=Z.useState(null),[B,$]=Z.useState(1),[W,z]=Z.useState(!1),[we,fe]=Z.useState(null),[Ee,Pe]=Z.useState(null),Ue=Z.useRef(null),[Ve,ze]=Z.useState(0),[Qe,mt]=Z.useState(0),[Mt,Tt]=Z.useState(1),[gt,Oe]=Z.useState(!1),[it,Ze]=Z.useState(""),[Rt,Sn]=Z.useState(!1),[kt,an]=Z.useState(null),[rt,Gt]=Z.useState("unknown"),[$t,Lt]=Z.useState([]),[Vt]=Z.useState(()=>`cinema-${Date.now()}`),wn=Z.useRef(null),[qt,ys]=Z.useState("chat"),[Wl,Xl]=Z.useState(null),[Ot,vi]=Z.useState([]),[Aa,$l]=Z.useState(null),ql=Z.useRef(null),[_i,ji]=Z.useState([]),[Yl,Gr]=Z.useState(!1),[Yv,bs]=Z.useState(0),[Ca,Vr]=Z.useState(!1),[ei,yi]=Z.useState(!1),[Na,Ra]=Z.useState(!1),[vh,mn]=Z.useState(0),[Un,Kl]=Z.useState(null),[Fn,Jl]=Z.useState(null),[kn,Zl]=Z.useState(null),[On,Pa]=Z.useState(null),[Ss,Ql]=Z.useState([]),[Kv,Jv]=Z.useState(!1),[Bi,_h]=Z.useState("camera"),[_t,bi]=Z.useState("video"),[jn,La]=Z.useState(null),[Bn,yh]=Z.useState(!0),[Zv,Le]=Z.useState(null),[ws,bh]=Z.useState(!1),[Da,ec]=Z.useState(1),[Hr,Ia]=Z.useState(0),[Ms,Ua]=Z.useState(3),[Es,Sh]=Z.useState(3),[Ts,wh]=Z.useState(1),[Si,tc]=Z.useState(null),[wi,nc]=Z.useState(null),[Mi,ic]=Z.useState(null),[Fa,Mh]=Z.useState(2),[xt,ka]=Z.useState(null),[Mn,rc]=Z.useState(null),[En,Eh]=Z.useState(null),[ti,sc]=Z.useState(null),[ni,ac]=Z.useState(null),[Ei,oc]=Z.useState(null),[ii,lc]=Z.useState(null),[zn,cc]=Z.useState("16:9"),[rr,Th]=Z.useState("2K"),[Qv,e_]=Z.useState(!1),[t_,n_]=Z.useState(!1),[gn,Wr]=Z.useState(null),dc=Z.useRef(null),Oa={image:{aspectRatios:["1:1","4:3","3:4","16:9","9:16","21:9"],resolutions:["512","1K","2K","4K"]},"kling-2.6":{aspectRatios:["16:9","9:16","1:1"]}},on=wu,xn=Su,As=Mu,Cs=Eu,Ns=Au,ja=Tu,ln=Ti,Rs=Cu,Ps=Nu,Ls=Ru,Ds=Pu,Is=Lu,Us=Du,Fs=["14","24","35","50","85","135","200"],ks=["f/1.4","f/2.8","f/4","f/5.6","f/8","f/11","f/16"],Ah=c=>{Ia(c),x(on[c])},Ch=c=>{Ua(c),_(xn[c])},hc=()=>{const c=je||i.motionPrompt||t.map(X=>X.prompt.split(",")[0]).join(", ")||"";let b="";if(Bn){const X=on[Hr]?`shot on ${on[Hr].name}`:"",re=xn[Ms]?xn[Ms].name:"",ie=`${Fs[Es]}mm`,ke=ks[Ts];b=[X,re,ie,ke].filter(Boolean).join(", ")}const R=[];return xt!==null&&R.push(ln[xt].prompt.split(",")[0]),Mn!==null&&R.push(Rs[Mn].prompt.split(",")[0]),En!==null&&R.push(Ps[En].prompt.split(",")[0]),ti!==null&&R.push(Ls[ti].prompt.split(",")[0]),ni!==null&&R.push(Ds[ni].prompt.split(",")[0]),Ei!==null&&R.push(Is[Ei].prompt.split(",")[0]),ii!==null&&R.push(Us[ii].prompt.split(",")[0]),Iu({movement:t.length>0?t:void 0,style:Si!==null?As[Si]:void 0,lighting:wi!==null?Cs[wi]:void 0,atmosphere:Mi!==null?Ns[Mi]:void 0,motionSpeed:ja[Fa],customPrompt:[...R,b,c].filter(Boolean).join(", ")||"cinematic"})},Os=()=>{const c=[];if(Un){const X=wc[Un]||Un;c.push(X)}if(Fn){const X=Mc[Fn]||Fn;c.push(X)}if(kn){const X=Ec[kn]||kn;c.push(X)}if(On&&c.push(On),c.length===0&&je)return je;const b=c.join(", "),R=Wu.some(X=>b.toLowerCase().includes(X.replace("then ","").replace("comes to ","")));return b&&!R?b+", then settles":b};Z.useEffect(()=>{if(_t==="video"){const c=Os()||je;if(c){const b=Gu(c);Ql(b.warnings)}else Ql([])}},[_t,Un,Fn,kn,On,je]),Z.useEffect(()=>{if(Zi&&_t==="video"){const c=ds(Ve,Qe,Mt);m(c)}},[Ve,Qe,Mt,Zi]);const sr=()=>i.endFrame?"kling-o1":Mn!==null&&["romance","confession","confrontation"].includes(Rs[Mn].id)||En!==null&&["confession","confrontation"].includes(Ps[En].id)?"seedance-1.5":"kling-2.6",Ba=async c=>{if(c.includes("catbox.moe")&&c.endsWith(".jpg"))return console.log("Already compressed, skipping"),c;console.log("Compressing image for Kling...");try{const b=await fetch("/api/cinema/compress",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image_url:c})}),R=await b.json();if(!b.ok)throw new Error(R.error||"Compression failed");if(R.image_url)return console.log(`Compressed: ${(R.original_size/1024/1024).toFixed(2)}MB → ${(R.compressed_size/1024).toFixed(0)}KB`),R.image_url;throw new Error("No compressed URL returned")}catch(b){throw console.error("Compression failed:",b),new Error("Image compression failed. Cannot send to Kling without compressing first.")}},uc=c=>{Fe(c.photo_prompt),m(c.motion_prompt);const b={"seedance-1.5":"seedance-1.5","kling-o1":"kling-o1","kling-2.6":"kling-2.6"};b[c.model]&&g(b[c.model]),c.start_frame&&u(c.start_frame),c.end_frame&&f(c.end_frame),c.image_url&&Wr(c.image_url),c.dialog&&c.model==="seedance-1.5"&&bi("video"),Le(`Loaded shot: ${c.shot_id} - ${c.subject}`)},Nh=async c=>{Ne(c.shot_id),uc(c),Ce(c.shot_id),Le(`Generating: ${c.shot_id}...`);try{const b=c.photo_prompt||`${c.subject}, ${c.shot_type} shot, ${c.location||""}, cinematic, 8K`,R=c.start_frame||i.startFrame,X=await fetch("/api/cinema/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:R?"edit":"image",prompt:b,aspect_ratio:pe?.aspect_ratio||"16:9",resolution:"4K",reference_image:R||void 0})});if(X.ok){const re=await X.json(),ie=re.image_url||re.images?.[0]?.url;ie?(We(c.shot_id,ie),u(ie),Le(`Generated: ${c.shot_id}`)):(console.error(`No image URL for ${c.shot_id}:`,re),Le(`No image URL returned for ${c.shot_id}`))}else{const re=await X.json().catch(()=>({}));console.error(`Failed ${c.shot_id}:`,re),Le(`Failed: ${re.error||"Unknown error"}`)}}catch(b){console.error(`Error generating ${c.shot_id}:`,b),Le(`Error: ${b instanceof Error?b.message:"Unknown"}`)}},Rh=async c=>{if(!c.image_url){Le("Generate image first!");return}Le(`Generating video for ${c.shot_id}...`);try{let b="video-kling";c.model==="seedance-1.5"?b="video-seedance":(c.model==="kling-o1"||c.end_frame)&&(b="video-kling-o1");const R=await fetch("/api/cinema/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:b,prompt:c.motion_prompt||"subtle motion, cinematic",start_image_url:c.image_url,end_image_url:c.end_frame||void 0,duration:String(c.duration||5)})});if(R.ok){const X=await R.json(),re=X.video_url;re?(We(c.shot_id,c.image_url,re),Le(`Video ready: ${c.shot_id}`)):(console.error(`No video URL for ${c.shot_id}:`,X),Le("No video URL returned"))}else{const X=await R.json().catch(()=>({}));console.error(`Video failed ${c.shot_id}:`,X),Le(`Video failed: ${X.error||"Unknown"}`)}}catch(b){console.error(`Video error ${c.shot_id}:`,b),Le(`Video error: ${b instanceof Error?b.message:"Unknown"}`)}},Ph=async()=>{if(!pe||ei)return;yi(!0),mn(0);const c=De=>De.generate_prompt&&De.generate_prompt.includes("3x3")?De.generate_prompt:`Character reference sheet, 3x3 grid layout, ${`${De.description||De.name}${De.costume?`, wearing ${De.costume}`:""}`}. Top row: front view, 3/4 view, side profile. Middle row: back view, close-up face, expression variations showing happy and serious and surprised. Bottom row: full body standing pose, action pose, costume and prop details. White background, consistent soft studio lighting, character turnaround style, 4K high detail`,b=De=>{if(De.generate_prompt&&De.generate_prompt.includes("3x3"))return De.generate_prompt;const lt=De.description||De.name;return De.type==="location"?`Location reference sheet, 3x3 grid layout, ${lt}. Top row: wide establishing exterior shot, medium exterior angle, exterior architectural detail. Middle row: wide empty interior view, medium interior shot, interior props and details. Bottom row: dawn golden hour lighting, bright daylight, dusk blue hour atmosphere. Architectural visualization style, cinematic composition, no people, empty spaces, 4K`:`Object reference sheet, 3x3 grid layout, ${lt}. Top row: front view, side profile view, rear view. Middle row: 3/4 angle hero shot, top-down view, detail closeup of key features. Bottom row: object in environment context (no people), empty interior view, wide shot showing scale. Product photography style, clean studio lighting, white background, no humans, 4K`},R=Object.values(pe.character_references||{}).filter(De=>!De.ref_url),X=Object.values(pe.scene_references||{}).filter(De=>!De.ref_url),re=R.length+X.length;if(re>0){Le(`Step 1: Generating ${re} reference sheets (3x3 grids) in parallel...`);const De=[...R.map(async lt=>{try{const yt=c(lt);console.log(`Generating char ref: ${lt.name}`,yt);const dt=await fetch("/api/cinema/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"image",prompt:yt,aspect_ratio:"1:1",resolution:"4K"})});if(dt.ok){const Nt=await dt.json(),It=Nt.image_url||Nt.images?.[0]?.url;It&&Et(lt.id,{ref_url:It})}}catch(yt){console.error(`Ref gen failed for ${lt.name}:`,yt)}}),...X.map(async lt=>{try{const yt=b(lt);console.log(`Generating scene ref: ${lt.name} (${lt.type})`,yt);const dt=await fetch("/api/cinema/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"image",prompt:yt,aspect_ratio:"1:1",resolution:"4K"})});if(dt.ok){const Nt=await dt.json(),It=Nt.image_url||Nt.images?.[0]?.url;It&&ot(lt.id,{ref_url:It})}}catch(yt){console.error(`Ref gen failed for ${lt.name}:`,yt)}})];await Promise.all(De),Le("Refs complete! Now generating images...")}const ie=pe.shots.filter(De=>De.status==="pending");if(ie.length===0){yi(!1),Le("All shots already generated!");return}const ke=4;Le(`Step 2: Generating ${ie.length} images (${ke} at a time)...`),ie.forEach(De=>Ce(De.shot_id));for(let De=0;De<ie.length;De+=ke){const lt=ie.slice(De,De+ke);mn(De),Le(`Generating images ${De+1}-${Math.min(De+ke,ie.length)} of ${ie.length}...`);const yt=lt.map(async dt=>{try{const Nt=dt.photo_prompt||`${dt.subject}, ${dt.shot_type} shot, ${dt.location||""}, cinematic, 8K`,It=Uh(dt),cn=await fetch("/api/cinema/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:It.length>0?"edit":"image",prompt:Nt,aspect_ratio:pe.aspect_ratio||"16:9",resolution:"4K",image_urls:It.length>0?It:void 0})});if(cn.ok){const rn=await cn.json(),ri=rn.image_url||rn.images?.[0]?.url;if(ri)return We(dt.shot_id,ri),{shot_id:dt.shot_id,image_url:ri,success:!0}}return{shot_id:dt.shot_id,success:!1}}catch(Nt){return console.error(`Image error for ${dt.shot_id}:`,Nt),{shot_id:dt.shot_id,success:!1}}});await Promise.all(yt)}Le("All images done! Now generating videos in parallel...");const Xe=pe.shots.filter(De=>De.image_url&&!De.video_url);if(Xe.length>0){Le(`Step 3: Generating ${Xe.length} videos (${ke} at a time)...`);for(let De=0;De<Xe.length;De+=ke){const lt=Xe.slice(De,De+ke);mn(De),Le(`Generating videos ${De+1}-${Math.min(De+ke,Xe.length)} of ${Xe.length}...`);const yt=lt.map(async dt=>{try{let Nt="video-kling";dt.model==="seedance-1.5"?Nt="video-seedance":(dt.model==="kling-o1"||dt.end_frame)&&(Nt="video-kling-o1");const It=await fetch("/api/cinema/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:Nt,prompt:dt.motion_prompt||"subtle motion, cinematic",start_image_url:dt.image_url,end_image_url:dt.end_frame||void 0,duration:String(dt.duration||5)})});if(It.ok){const rn=(await It.json()).video_url;if(rn)return We(dt.shot_id,dt.image_url,rn),{shot_id:dt.shot_id,success:!0}}return{shot_id:dt.shot_id,success:!1}}catch(Nt){return console.error(`Video error for ${dt.shot_id}:`,Nt),{shot_id:dt.shot_id,success:!1}}});await Promise.all(yt)}}yi(!1),mn(0),Le(`Plan complete! ${ie.length} shots generated.`)},Lh=()=>{yi(!1),mn(0),Le("Plan execution stopped.")},Dh=async()=>{if(!pe||ei)return;const c=pe.shots.filter(b=>b.image_url&&!b.video_url);if(c.length===0){Le("All videos already generated!");return}yi(!0),mn(0),Le(`Generating ${c.length} videos...`);for(let b=0;b<c.length;b++){const R=c[b];mn(b+1),Le(`Video ${b+1}/${c.length}: ${R.shot_id}`);try{let X="video-kling";R.model==="seedance-1.5"?X="video-seedance":(R.model==="kling-o1"||R.end_frame)&&(X="video-kling-o1");const re=await fetch("/api/cinema/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:X,prompt:R.motion_prompt||"subtle motion, cinematic",start_image_url:R.image_url,end_image_url:R.end_frame||void 0,duration:String(R.duration||5)})});if(re.ok){const ie=await re.json();ie.video_url?(We(R.shot_id,R.image_url,ie.video_url),Le(`Video ${b+1}/${c.length} done!`)):(console.error(`No video URL for ${R.shot_id}`),Le(`Video ${b+1} failed - no URL`))}else{const ie=await re.json().catch(()=>({}));console.error(`Video failed ${R.shot_id}:`,ie),Le(`Video ${b+1} failed: ${ie.error||"Unknown"}`)}}catch(X){console.error(`Video error ${R.shot_id}:`,X),Le(`Video ${b+1} error`)}await new Promise(X=>setTimeout(X,2e3))}yi(!1),mn(0),Le(`All ${c.length} videos generated!`)},Ih=async()=>{if(!pe||ei)return;const c=Object.values(pe.character_references||{}).filter(re=>!re.ref_url&&re.generate_prompt),b=Object.values(pe.scene_references||{}).filter(re=>!re.ref_url&&re.generate_prompt),R=c.length+b.length;if(R===0){Le("All references already generated!");return}yi(!0),mn(0),Le(`Generating ${R} reference images...`);let X=0;for(const re of c){X++,mn(X),Le(`Ref ${X}/${R}: ${re.name} (character sheet)`);try{const ie=await fetch("/api/cinema/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"image",prompt:re.generate_prompt,aspect_ratio:"1:1",resolution:"4K"})});if(ie.ok){const ke=await ie.json(),Xe=ke.image_url||ke.images?.[0]?.url;Xe&&(Et(re.id,{ref_url:Xe}),Le(`✓ ${re.name} ref done`))}}catch(ie){console.error(`Failed to generate ref for ${re.name}:`,ie)}await new Promise(ie=>setTimeout(ie,1500))}for(const re of b){X++,mn(X),Le(`Ref ${X}/${R}: ${re.name} (${re.type} sheet)`);try{const ie=await fetch("/api/cinema/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"image",prompt:re.generate_prompt,aspect_ratio:"1:1",resolution:"4K"})});if(ie.ok){const ke=await ie.json(),Xe=ke.image_url||ke.images?.[0]?.url;Xe&&(ot(re.id,{ref_url:Xe}),Le(`✓ ${re.name} ref done`))}}catch(ie){console.error(`Failed to generate ref for ${re.name}:`,ie)}await new Promise(ie=>setTimeout(ie,1500))}yi(!1),mn(0),Le(`All ${R} reference images generated!`)},Uh=c=>{if(!pe)return[];const b=[];return Object.values(pe.character_references||{}).forEach(R=>{R.ref_url&&(c.subject?.toLowerCase().includes(R.name.toLowerCase())||c.photo_prompt?.toLowerCase().includes(R.name.toLowerCase()))&&b.push(R.ref_url)}),Object.values(pe.scene_references||{}).forEach(R=>{R.ref_url&&R.type==="location"&&c.location?.toLowerCase().includes(R.name.toLowerCase())&&b.push(R.ref_url)}),Object.values(pe.scene_references||{}).forEach(R=>{R.ref_url&&R.type!=="location"&&(c.subject?.toLowerCase().includes(R.name.toLowerCase())||c.photo_prompt?.toLowerCase().includes(R.name.toLowerCase()))&&b.push(R.ref_url)}),b},Fh=async()=>{if(!it.trim()){an("Please enter a description");return}Sn(!0),an(null);try{const c={mode:_t,model:i.model,aspectRatio:zn,resolution:rr,characterDNA:M,isSequenceContinuation:V.length>0,currentPrompt:_t==="image"?je:i.motionPrompt},b=await fetch("/api/ai/prompt",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userInput:it,context:c,model:"mistral"})}),R=await b.json();if(!b.ok)throw new Error(R.error||R.details||"AI generation failed");_t==="image"?Fe(R.prompt):m(R.prompt),Ze(""),Oe(!1)}catch(c){console.error("AI prompt error:",c),an(c instanceof Error?c.message:"Failed to generate prompt")}finally{Sn(!1)}},kh=async()=>{try{const b=await(await fetch("/api/ai/prompt",{method:"GET"})).json();Gt(b.status==="ok"?"ok":"error")}catch{Gt("error")}},fc=async()=>{if(!it.trim()){an("Please enter a message");return}const c=it.trim();Ze(""),Sn(!0),an(null),Lt(b=>[...b,{role:"user",content:c}]),setTimeout(()=>{wn.current&&(wn.current.scrollTop=wn.current.scrollHeight)},100);try{const b=Kh(),R=b?`${c}
${b}`:c,X=await fetch("/api/ai/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:R,sessionId:Vt,model:"qwen3:8b"})}),re=await X.json();if(!X.ok)throw new Error(re.error||re.details||"Chat failed");Lt(ie=>[...ie,{role:"assistant",content:re.response}]),setTimeout(()=>{wn.current&&(wn.current.scrollTop=wn.current.scrollHeight)},100)}catch(b){console.error("AI chat error:",b),an(b instanceof Error?b.message:"Chat failed"),Lt(R=>R.slice(0,-1))}finally{Sn(!1)}},Oh=(c,b)=>{Fe(c),_t==="video"&&m(c),Xl(b),setTimeout(()=>Xl(null),2e3)},jh=async()=>{Lt([]),vi([]);try{await fetch(`/api/ai/chat?sessionId=${Vt}`,{method:"DELETE"})}catch(c){console.error("Failed to clear chat history:",c)}},Bh=async c=>{const b=c.target.files;if(!b||b.length===0)return;if(Ot.length>=7){an("Maximum 7 reference images allowed");return}const R=b[0],X=new FileReader;X.onload=async re=>{const ie=re.target?.result,ke=Ot.length;vi(Xe=>[...Xe,{url:ie,description:null}]),$l(ke);try{const Xe=await fetch("/api/cinema/vision",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image_url:ie,prompt:"Describe this image in detail for a cinematographer. Include: subject, composition, lighting, colors, mood, camera angle, and any notable visual elements."})});if(Xe.ok){const De=await Xe.json();vi(lt=>lt.map((yt,dt)=>dt===ke?{...yt,description:De.description||"Image uploaded"}:yt))}else vi(De=>De.map((lt,yt)=>yt===ke?{...lt,description:"Reference image "+(ke+1)}:lt))}catch(Xe){console.error("Vision analysis failed:",Xe),vi(De=>De.map((lt,yt)=>yt===ke?{...lt,description:"Reference image "+(ke+1)}:lt))}finally{$l(null)}},X.readAsDataURL(R),c.target.value=""},pc=c=>{vi(b=>b.filter((R,X)=>X!==c))},mc=async c=>{try{const b=await fetch(c);if(!b.ok)return null;const R=await b.blob(),X=new FormData;X.append("reqtype","fileupload"),X.append("fileToUpload",R,"movie-shot.jpg");const ie=await(await fetch("https://catbox.moe/user/api.php",{method:"POST",body:X})).text();return ie&&ie.startsWith("https://")?ie.trim():null}catch(b){return console.error("Failed to upload movie shot to Catbox:",b),null}},zh=async c=>{if(c.length!==0){ki(!1),h(!0),N(0),Le("Uploading movie shot references...");try{const b=c[0];N(10);const R=await mc(b.imageUrl);if(!R)throw new Error("Failed to upload primary shot");if(Wr(R),u(R),N(40),c.length>1){const ke=[];for(let Xe=1;Xe<c.length;Xe++){N(40+Xe/c.length*50),Le(`Uploading reference ${Xe+1}/${c.length}...`);const De=await mc(c[Xe].imageUrl);De&&ke.push({url:De,description:c[Xe].shot.prompt})}ke.length>0&&vi(Xe=>[...Xe,...ke].slice(0,7))}let X=b.shot.prompt||"";Qn&&X?X=`USE MY CHARACTER REFERENCE: ${Qn.description}. Replace any person/character in this shot with my character from the reference image. ${X}. THIS EXACT CHARACTER from reference, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.`:M&&X?X=`USE MY CHARACTER REFERENCE: ${M}. Replace any person/character in this shot with my character from the reference image. ${X}. THIS EXACT CHARACTER from reference, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.`:gn&&X&&(X=`USE CHARACTER FROM REFERENCE IMAGE: Replace any person/character in this shot with the character shown in my reference image. Maintain exact appearance, clothing, features. ${X}. THIS EXACT CHARACTER from reference, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.`),X&&Fe(X),b.shot.camera3d&&(ze(b.shot.camera3d.azimuth||0),mt(b.shot.camera3d.elevation||0),Tt(b.shot.camera3d.distance||1));const re={"stanley-kubrick":0,"steven-spielberg":1,"quentin-tarantino":2,"david-fincher":3,"christopher-nolan":4,"denis-villeneuve":5,"wes-anderson":6,"terrence-malick":10};b.shot.director&&re[b.shot.director]!==void 0&&ka(re[b.shot.director]);const ie={awe:0,melancholy:1,tense:2,love:3,fear:4,loneliness:5,mysterious:6,hope:7,sadness:8,contemplative:9,peaceful:10};b.shot.emotion&&ie[b.shot.emotion]!==void 0&&rc(ie[b.shot.emotion]),Le("Movie shot references ready!"),N(100)}catch(b){console.error("Failed to process movie shots:",b),Le("Failed to upload movie shots")}finally{setTimeout(()=>{h(!1),Le(null),N(0)},1500)}}},Gh=c=>{er(b=>[...b,c]),localStorage.setItem("cinema-user-assets",JSON.stringify([...kr,c]))},Vh=c=>{er(b=>{const R=b.filter(X=>X.id!==c);return localStorage.setItem("cinema-user-assets",JSON.stringify(R)),R}),Qn?.id===c&&Or(null)};Z.useEffect(()=>{const c=localStorage.getItem("cinema-user-assets");if(c)try{er(JSON.parse(c))}catch(b){console.error("Failed to load saved assets:",b)}},[]);const Hh=c=>ha(c)?!0:[/SHOT\s*\d+\s*[:\(]/i,/Shot\s*\d+\s*[:\(]/i,/^\d+\.\s*(WIDE|MEDIUM|CLOSE|ESTABLISHING|ECU|POV)/im,/\(ESTABLISHING\)|\(WIDE\)|\(MEDIUM\)|\(CLOSE-UP\)|\(ECU\)/i].some(R=>R.test(c)),gc=c=>ha(c)!==null,xc=c=>{const b=[],R=c.split(/(?=SHOT\s*\d+|Shot\s*\d+|^\d+\.\s*\()/im).filter(Boolean);for(const X of R){const re=X.match(/(?:SHOT|Shot)\s*(\d+)|^(\d+)\./i);if(!re)continue;const ie=parseInt(re[1]||re[2]),ke=X.match(/\((ESTABLISHING|WIDE|MEDIUM|CLOSE-UP|CLOSE|ECU|POV|FULL|MASTER)\)/i),Xe=ke?ke[1].toUpperCase():"MEDIUM",De=X.match(/(?:camera|movement|motion)[:\s]+([^,\n]+)/i),lt=De?De[1].trim():"static",yt=X.match(/(?:subject|action|actor)[:\s]+([^,\n]+)/i),dt=yt?yt[1].trim():"";let Nt=X.replace(/^(?:SHOT|Shot)\s*\d+\s*[:\(]?[^:]*[:\)]?\s*/i,"").replace(/^\d+\.\s*\([^)]*\)\s*/i,"").trim();const It=Nt.match(/(?:VIDEO|MOTION)[:\s]+([^\n]+)/i),cn=It?It[1].trim():void 0;It&&(Nt=Nt.replace(/(?:VIDEO|MOTION)[:\s]+[^\n]+/i,"").trim()),b.push({shotNumber:ie,shotType:Xe,cameraMovement:lt,subjectAction:dt,prompt:Nt,motionPrompt:cn,status:"pending"})}return b},Wh=c=>{const b=ha(c);if(b){nt(b),Ra(!1);return}const R=xc(c);R.length>0&&(ji(R),bs(0),Gr(!1),Vr(!1))},Xh=c=>ha(c)?.shots?.length||0,za=async()=>{if(_i.length===0)return;if(Gr(!0),Vr(!1),!i.startFrame&&!gn){Vr(!0),Gr(!1);return}let c=i.startFrame||gn||"";const b="THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.";for(let R=0;R<_i.length;R++){bs(R);const X=_i[R];try{ji(cn=>cn.map((rn,ri)=>ri===R?{...rn,status:"generating-image"}:rn));let re=X.prompt;const ie=M||"";R>0?re=`${b} ${X.shotType} shot. ${ie?ie+". ":""}${X.prompt}`:ie&&(re=`${ie}. ${X.prompt}`);const Xe=await(await fetch("/api/cinema/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"image",prompt:re,aspect_ratio:zn,resolution:rr,reference_image:c})})).json();if(!Xe.image_url)throw new Error("Image generation failed");ji(cn=>cn.map((rn,ri)=>ri===R?{...rn,imageUrl:Xe.image_url,status:"generating-video"}:rn));const De=await Ba(Xe.image_url),lt=X.motionPrompt||`${X.cameraMovement}, ${X.subjectAction}, then settles`,yt=sr(),Nt=await(await fetch("/api/cinema/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:yt==="kling-o1"?"video-kling-o1":yt==="seedance-1.5"?"video-seedance":"video-kling",prompt:lt,[yt==="kling-o1"?"start_image_url":"image_url"]:De,duration:String(i.duration),aspect_ratio:zn})})).json();if(!Nt.video_url)throw new Error("Video generation failed");ji(cn=>cn.map((rn,ri)=>ri===R?{...rn,videoUrl:Nt.video_url,status:"completed"}:rn));const It=await Va(Nt.video_url);It&&(c=It),await new Promise(cn=>setTimeout(cn,500))}catch(re){console.error(`Shot ${R+1} failed:`,re),ji(ie=>ie.map((ke,Xe)=>Xe===R?{...ke,status:"error",error:re instanceof Error?re.message:"Unknown error"}:ke))}}Gr(!1),bs(_i.length)},$h=()=>{Ca&&i.startFrame&&(Vr(!1),za())},qh=()=>{ji([]),bs(0),Gr(!1),Vr(!1)},Yh=()=>{if(V.length===0)return;if(!i.startFrame&&!gn){Le("Add a START FRAME or REF image first"),setTimeout(()=>Le(null),2e3);return}const c=V.map((b,R)=>({shotNumber:R+1,shotType:b.angle,cameraMovement:b.cameraMove,subjectAction:b.action,prompt:`${b.angle}. ${M?M+". ":""}${b.action}`,motionPrompt:`${b.cameraMove}, ${b.action}, then settles`,status:"pending"}));ji(c),Ge(!1),le(),Le(`Starting sequence: ${c.length} shots`),setTimeout(()=>Le(null),2e3),setTimeout(()=>{za()},100)},Kh=()=>{let c="";return(i.startFrame||je||i.motionPrompt)&&(c+=`

=== CURRENT SHOT ===
`,i.startFrame&&(c+=`HAS IMAGE: Yes
`),je&&(c+=`IMAGE PROMPT: "${je}"
`),i.motionPrompt&&(c+=`MOTION PROMPT: "${i.motionPrompt}"
`),i.model&&(c+=`MODEL: ${i.model}
`),c+=`MODE: ${_t==="image"?"Image":"Video"}
`,c+=`ASPECT: ${zn} | RES: ${rr}
`,M&&(c+=`CHARACTER DNA: ${M}
`)),e.length>0&&(c+=`
=== SHOT HISTORY (for sequence planning) ===
`,e.slice(-5).forEach((b,R)=>{c+=`Shot ${R+1}: ${b.motionPrompt||"No prompt"}
`}),c+=`Total shots: ${e.length}
`,c+=`
You can plan the NEXT shot in the sequence. Use consistency phrases!
`),V.length>0&&(c+=`
=== PLANNED SEQUENCE ===
`,V.forEach((b,R)=>{const X=R<K?"DONE":R===K?"CURRENT":"PENDING";c+=`[${X}] Shot ${R+1}: ${b.angle} - ${b.action}
`})),Ot.length>0&&(c+=`
=== REFERENCE IMAGES ===
`,Ot.forEach((b,R)=>{c+=`[Ref ${R+1}]: ${b.description||"No description"}
`})),c&&(c+=`
---
You can: modify prompts, plan sequences, suggest next shots, explain cinematography.
`),c},Jh=async()=>{Bs(null);const c=hc();if(_t==="image"){if(!je&&!c){alert("Please enter a prompt to generate an image!");return}C(),N(10);try{const b=[],R=i.startFrame||gn;R&&b.push(R),Ot.length>0&&b.push(...Ot.map(ie=>ie.url));const X=await fetch("/api/cinema/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"image",prompt:c,aspect_ratio:zn,resolution:rr,image_urls:b.length>0?b:void 0})});N(50);const re=await X.json();if(!X.ok)throw new Error(re.error||re.details||"Image generation failed");if(re.image_url)N(100),jn==="end"?(f(re.image_url),bi("video"),D(""),alert("END image generated! Both frames ready - Kling O1 will be used for transition video.")):jn==="start"?(u(re.image_url),D(""),La("end")):(u(re.image_url),bi("video"),D(""));else throw new Error("No image URL in response")}catch(b){D(b instanceof Error?b.message:"Unknown error")}return}if(!i.startFrame){alert("Please add a start frame first! Switch to Image mode to generate one.");return}C(),N(5);try{const b=sr();g(b),N(10);const R=await Ba(i.startFrame);N(15);let X;i.endFrame&&(X=await Ba(i.endFrame)),N(20);let re={prompt:c,duration:String(i.duration),aspect_ratio:zn};b==="kling-o1"?(re.type="video-kling-o1",re.start_image_url=R,X&&(re.end_image_url=X)):b==="seedance-1.5"?(re.type="video-seedance",re.image_url=R,X&&(re.end_image_url=X)):(re.type="video-kling",re.image_url=R),N(25);const ie=await fetch("/api/cinema/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(re)});N(40);const ke=await ie.json();if(!ie.ok)throw new Error(ke.error||ke.details||"Generation failed");if(N(80),ke.video_url)N(100),L(ke.video_url),e.length<3&&Xr(!0);else throw new Error("No video URL in response")}catch(b){D(b instanceof Error?b.message:"Unknown error")}},[Zh,Xr]=Z.useState(!1),[$r,Ga]=Z.useState(""),[vc,_c]=Z.useState(!1),[Gn,Qh]=Z.useState(null),[js,Bs]=Z.useState(null);Z.useEffect(()=>{Bs(null)},[xt]),Z.useEffect(()=>{if(je.length>10){const c=Ou(je);I(c.warnings)}else I([])},[je]);const Va=async c=>{try{_c(!0);const R=await(await fetch("/api/cinema/extract-frame",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({video_url:c,position:"last"})})).json();return R.success&&R.frame_url?R.frame_url:null}catch(b){return console.error("Frame extraction failed:",b),null}finally{_c(!1)}},eu=async()=>{if(!nn){fe("Please enter a video URL");return}z(!0),fe(null);try{const c=await Va(nn);c?(jr(c),$(2)):fe("Failed to extract frame from video")}catch(c){fe("Error extracting frame: "+(c instanceof Error?c.message:"Unknown"))}finally{z(!1)}},tu=async()=>{if(!xi){fe("No frame extracted");return}z(!0),fe(null);try{let c="";try{const X=await fetch("/api/cinema/vision",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image_url:xi,task:"closeup",character_dna:M||void 0})});if(X.ok){const re=await X.json();re.success&&re.closeup_prompt&&(c=re.closeup_prompt,console.log("Vision Agent close-up prompt:",c))}}catch{console.warn("Vision Agent not available, using fallback prompt")}c||(c=`${M?`${M}. `:""}THIS EXACT CHARACTER, THIS EXACT LIGHTING, THIS EXACT COLOR GRADE.
Cinematic close-up shot, face fills 70% of frame, shallow depth of field f/1.4,
soft bokeh background, prepared for dialogue scene, expressive eyes with catchlight,
natural skin texture, subtle rim light. Same costume, same lighting direction.
8K detail, photorealistic, cinematic color grading.`);const R=await(await fetch("/api/cinema/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"edit",image_urls:[xi],prompt:c,aspect_ratio:"16:9",resolution:"2K"})})).json();R.image_url?(Br(R.image_url),$(3)):fe("Failed to generate close-up: "+(R.error||"Unknown error"))}catch(c){fe("Error generating close-up: "+(c instanceof Error?c.message:"Unknown"))}finally{z(!1)}},nu=async()=>{if(!tr||!nr.trim()){fe("Please enter the dialogue text");return}z(!0),fe(null);try{const c=`Close-up on face, soft focus on eyes, natural expressions.
Slow push-in, focus locked on eyes, minimal shake.
Subject speaks warmly: "${nr}"
Cinematic UGC style, clean audio, natural room tone, then settles.`,R=await(await fetch("/api/cinema/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"video-seedance",image_url:tr,prompt:c,duration:"5",aspect_ratio:"16:9"})})).json();R.video_url?(w(R.video_url),$(4)):fe("Failed to generate dialogue video: "+(R.error||"Unknown error"))}catch(c){fe("Error generating dialogue: "+(c instanceof Error?c.message:"Unknown"))}finally{z(!1)}},iu=async()=>{if(!nn||!ir){fe("Missing videos to stitch");return}z(!0),fe(null);try{const b=await(await fetch("/api/cinema/stitch",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({videos:[nn,ir]})})).json();b.video_url?(window.open(b.video_url,"_blank"),gi(!1),Oi(""),jr(null),Br(null),zr(""),w(null),$(1)):fe("Failed to stitch videos: "+(b.error||"Unknown error"))}catch(c){fe("Error stitching: "+(c instanceof Error?c.message:"Unknown"))}finally{z(!1)}},yc=()=>{Oi(""),jr(null),Br(null),zr(""),w(null),$(1),fe(null),z(!1),Pe(null),Ue.current&&(Ue.current.value="")},ru=async c=>{const b=c.target.files?.[0];if(b){if(!b.type.startsWith("video/")){fe("Please select a video file");return}if(b.size>200*1024*1024){fe("Video file too large (max 200MB)");return}z(!0),fe(null),Pe(b.name);try{const R=new FormData;R.append("reqtype","fileupload"),R.append("fileToUpload",b);const re=await(await fetch("https://catbox.moe/user/api.php",{method:"POST",body:R})).text();re&&re.startsWith("https://")?(Oi(re.trim()),fe(null)):(fe("Upload failed: "+re),Pe(null))}catch(R){fe("Upload error: "+(R instanceof Error?R.message:"Unknown")),Pe(null)}finally{z(!1)}}},su=async(c,b,R,X,re,ie=[])=>{console.log("🎬 Calling Vision Agent...",{hasDirector:!!R,directorName:R?.name||"NONE",storyBeat:X,shotNumber:re,historyLength:ie.length});try{const ke=await fetch("http://localhost:5678/webhook/vision-edit-prompt",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({reference_image_url:c,previous_prompt:b,shot_history:ie.map((De,lt)=>({shot_number:lt+1,prompt:De.prompt,image_url:De.startFrame})),director:R?{name:R.name,director:R.director,description:R.description,prompt:R.prompt,rules:R.rules,sceneResponses:R.sceneResponses,avoidPrompts:R.avoidPrompts,shotLibrary:R.shotLibrary,colorPalette:R.colorPalette,recommendedCamera:R.recommendedCamera,recommendedLens:R.recommendedLens,recommendedMovement:R.recommendedMovement,recommendedLighting:R.recommendedLighting,recommendedFraming:R.recommendedFraming,recommendedStyle:R.recommendedStyle,recommendedAtmosphere:R.recommendedAtmosphere,recommendedSetDesign:R.recommendedSetDesign,recommendedColorPalette:R.recommendedColorPalette,recommendedCharacterStyle:R.recommendedCharacterStyle}:null,story_beat:X,shot_number:re})});if(!ke.ok)return console.warn("❌ Vision agent returned non-OK status:",ke.status),null;const Xe=await ke.json();return console.log("📥 Vision Agent Response:",Xe),Xe.success&&Xe.edit_prompt?(console.log("✅ VISION AGENT SUCCESS!"),console.log("🔍 Detected in image:",Xe.detected_in_image),console.log("📝 Changes from original:",Xe.changes_from_original),console.log("🎬 Director reasoning:",Xe.director_reasoning),`🤖 ${Xe.edit_prompt}`):(console.warn("⚠️ Vision agent response missing data:",Xe),null)}catch(ke){return console.error("❌ Vision agent FAILED:",ke),null}},au=async()=>{let c=null;i.videoUrl?c=await Va(i.videoUrl)||i.startFrame:c=i.startFrame;const b=je;Ga(b),j(),c&&u(c),Fe(""),Xr(!1),bi("image");const R=xt!==null?Ti[xt]:null,X=e.length+1,re=b.toLowerCase();let ie="journey";const ke={danger:["danger","threat","enemy","attack","chase","run"],emotion:["cry","sad","happy","love","fear","angry"],confrontation:["face","confront","argue","fight","stand"],calm:["rest","peace","quiet","sit","think","look"]};for(const[De,lt]of Object.entries(ke))if(lt.some(yt=>re.includes(yt))){ie=De;break}let Xe=null;if(c){const De=e.map(lt=>({prompt:lt.motionPrompt,startFrame:lt.startFrame||void 0}));Xe=await su(c,b,R,ie,X,De)}Xe||(console.log("⚠️ Using LOCAL fallback (generateEditPrompt) - Vision Agent did not respond"),Xe=`📋 ${Fu(R,b,X)}`),Bs(Xe)},ou=c=>{Qh(Gn===c?null:c)},lu=async()=>{if(e.length<2){alert("Need at least 2 shots to concatenate!");return}C();try{const c=e.map(X=>X.videoUrl).filter(Boolean),R=await(await fetch("http://localhost:5678/webhook/ffmpeg-concat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({videos:c})})).json();if(R.output_url)L(R.output_url),alert("Videos concatenated! Final video ready.");else throw new Error("Concatenation failed")}catch(c){D(c instanceof Error?c.message:"Concatenation failed")}},cu=i.duration===5?8:16,du=`${on[Hr]?.name||"Camera"}, ${xn[Ms]?.name||"Lens"}, ${Fs[Es]}mm, ${ks[Ts]}`;return s.jsx("div",{className:"min-h-screen bg-[#0d0d0d] text-white flex",children:s.jsxs("div",{className:"flex-1 flex flex-col overflow-hidden",children:[s.jsx("div",{className:"flex-1 flex items-center justify-center p-6",children:s.jsxs("div",{className:"w-full max-w-5xl",children:[s.jsxs("div",{className:"relative aspect-video bg-[#151515] rounded-xl overflow-hidden border border-gray-800/30",children:[Gn&&e.find(c=>c.id===Gn)?.videoUrl?s.jsx("video",{src:e.find(c=>c.id===Gn)?.videoUrl||void 0,controls:!0,autoPlay:!0,loop:!0,className:"w-full h-full object-contain"},Gn):i.videoUrl?s.jsx("video",{src:i.videoUrl,controls:!0,autoPlay:!0,loop:!0,className:"w-full h-full object-contain"}):i.startFrame?s.jsx("img",{src:i.startFrame,alt:"Preview",className:"w-full h-full object-contain"}):s.jsxs("div",{className:"absolute inset-0 flex flex-col items-center justify-center",children:[s.jsx("div",{className:"w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-gray-800 flex items-center justify-center mb-4",children:_t==="image"?$e.image:$e.video}),s.jsx("div",{className:"text-gray-500 text-xs uppercase tracking-widest mb-1 font-medium",children:"CINEMA STUDIO"}),s.jsx("div",{className:"text-gray-600 text-[11px]",children:_t==="image"?"Enter a prompt and click Generate to create a start frame":"Switch to Image mode or upload a frame to begin"})]}),o&&s.jsxs("div",{className:"absolute inset-0 bg-black/95 flex flex-col items-center justify-center",children:[s.jsx("div",{className:"w-12 h-12 border-2 border-[#e8ff00] border-t-transparent rounded-full animate-spin mb-4"}),s.jsxs("div",{className:"text-[#e8ff00] text-sm font-medium",children:["Generating... ",l,"%"]})]})]}),d&&s.jsx("div",{className:"mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm",children:d}),e.length>0&&s.jsxs("div",{className:"mt-4",children:[s.jsxs("div",{className:"flex items-center justify-between mb-2",children:[s.jsxs("div",{className:"flex items-center gap-3",children:[s.jsxs("span",{className:"text-xs text-gray-500 uppercase tracking-wider",children:["Shot Timeline (",e.length,")"]}),$r&&s.jsxs("span",{className:"text-[10px] text-gray-600 italic truncate max-w-xs",children:['Prev: "',$r.slice(0,40),'..."']})]}),s.jsx("div",{className:"flex gap-2",children:e.length>=2&&s.jsx("button",{onClick:lu,className:"px-3 py-1.5 bg-[#e8ff00] text-black rounded-lg text-xs font-semibold hover:bg-[#f0ff4d] transition-colors",children:"Export All"})})]}),s.jsxs("div",{className:"flex gap-2 overflow-x-auto pb-2",children:[e.map((c,b)=>s.jsxs("button",{onClick:()=>ou(c.id),className:`relative group flex-shrink-0 transition-all ${Gn===c.id?"ring-2 ring-[#e8ff00] scale-105":"hover:scale-105"}`,children:[s.jsxs("div",{className:`w-32 aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden border ${Gn===c.id?"border-[#e8ff00]":"border-gray-800"}`,children:[c.videoUrl?Gn===c.id?s.jsx("video",{src:c.videoUrl,className:"w-full h-full object-cover",autoPlay:!0,loop:!0,muted:!0}):s.jsx("video",{src:c.videoUrl,className:"w-full h-full object-cover",muted:!0}):c.startFrame?s.jsx("img",{src:c.startFrame,className:"w-full h-full object-cover"}):s.jsxs("div",{className:"w-full h-full flex items-center justify-center text-gray-600 text-xs",children:["Shot ",b+1]}),c.videoUrl&&Gn!==c.id&&s.jsx("div",{className:"absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",children:s.jsx("div",{className:"w-8 h-8 rounded-full bg-white/90 flex items-center justify-center",children:s.jsx("svg",{viewBox:"0 0 24 24",fill:"black",className:"w-4 h-4 ml-0.5",children:s.jsx("path",{d:"M8 5v14l11-7z"})})})}),Gn===c.id&&s.jsx("div",{className:"absolute top-1 right-1 px-1.5 py-0.5 bg-[#e8ff00] rounded text-[9px] text-black font-bold",children:"PLAYING"})]}),s.jsxs("div",{className:"absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/80 rounded text-[9px] text-gray-300",children:["#",b+1," - ",c.duration,"s"]})]},c.id)),s.jsxs("button",{onClick:()=>{if(i.videoUrl)Xr(!0);else if(e.length>0){const c=e[e.length-1];c.startFrame&&(u(c.startFrame),bi("image"),Ga(je||c.motionPrompt),Fe(""))}},className:"w-32 aspect-video bg-[#151515] rounded-lg border border-dashed border-gray-700 flex flex-col items-center justify-center flex-shrink-0 hover:border-[#e8ff00] hover:bg-[#1a1a1a] transition-all group",children:[s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-5 h-5 text-gray-600 group-hover:text-[#e8ff00] mb-1",children:s.jsx("path",{d:"M12 5v14M5 12h14"})}),s.jsx("span",{className:"text-gray-600 group-hover:text-[#e8ff00] text-[10px]",children:"Next Shot"})]})]}),vc&&s.jsxs("div",{className:"mt-2 text-xs text-[#e8ff00] flex items-center gap-2",children:[s.jsx("div",{className:"w-3 h-3 border border-[#e8ff00] border-t-transparent rounded-full animate-spin"}),"Extracting last frame for next shot..."]})]})]})}),Zh&&s.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center",children:s.jsx("div",{className:"bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-md w-full mx-4",children:s.jsx("div",{className:"text-center",children:vc?s.jsxs(s.Fragment,{children:[s.jsx("div",{className:"w-16 h-16 rounded-2xl bg-[#e8ff00]/10 flex items-center justify-center mx-auto mb-4",children:s.jsx("div",{className:"w-8 h-8 border-2 border-[#e8ff00] border-t-transparent rounded-full animate-spin"})}),s.jsx("h3",{className:"text-lg font-semibold text-white mb-2",children:"Setting up next shot..."}),s.jsx("p",{className:"text-gray-400 text-sm mb-6",children:"Extracting last frame from video to use as your next starting point."})]}):s.jsxs(s.Fragment,{children:[s.jsx("div",{className:"w-16 h-16 rounded-2xl bg-[#e8ff00]/10 flex items-center justify-center mx-auto mb-4",children:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"#e8ff00",strokeWidth:"2",className:"w-8 h-8",children:s.jsx("path",{d:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"})})}),s.jsxs("h3",{className:"text-lg font-semibold text-white mb-2",children:["Shot ",e.length+1," Complete!"]}),s.jsx("p",{className:"text-gray-400 text-sm mb-2",children:"Continue to the next shot?"}),s.jsx("p",{className:"text-gray-500 text-xs mb-6",children:"We'll use the last frame of this video as your next starting point."}),s.jsxs("div",{className:"flex gap-3",children:[s.jsx("button",{onClick:()=>Xr(!1),className:"flex-1 px-4 py-3 bg-[#2a2a2a] text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors",children:"Stay Here"}),s.jsxs("button",{onClick:au,className:"flex-1 px-4 py-3 bg-[#e8ff00] text-black rounded-xl text-sm font-semibold hover:bg-[#f0ff4d] transition-colors flex items-center justify-center gap-2",children:[s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-4 h-4",children:s.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})}),"Next Shot"]})]})]})})})}),wt&&s.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center",onClick:()=>Ie(!1),children:s.jsxs("div",{className:"bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-8 shadow-2xl max-w-4xl w-full mx-4",onClick:c=>c.stopPropagation(),children:[s.jsxs("div",{className:"flex items-center justify-between mb-8",children:[s.jsxs("div",{className:"flex gap-2",children:[s.jsx("button",{onClick:()=>fn("all"),className:`px-5 py-2 rounded-lg text-xs font-semibold transition-colors ${Qt==="all"?"bg-white text-black":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,children:"All"}),s.jsx("button",{onClick:()=>fn("recommended"),className:`px-5 py-2 rounded-lg text-xs font-semibold transition-colors ${Qt==="recommended"?"bg-white text-black":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,children:"By Director"})]}),s.jsx("button",{onClick:()=>Ie(!1),className:"w-10 h-10 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors",children:$e.close})]}),Qt==="recommended"&&s.jsxs("div",{className:"space-y-4",children:[s.jsx("div",{className:"text-sm text-gray-400 mb-4",children:"Select a director to see their signature camera setups:"}),s.jsx("div",{className:"grid grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto",children:ln.map((c,b)=>s.jsxs("button",{onClick:()=>{if(c.recommendedCamera){const R=on.findIndex(X=>X.id===c.recommendedCamera);R!==-1&&(Ia(R),x(on[R]))}if(c.recommendedLens){const R=xn.findIndex(X=>X.id===c.recommendedLens);R!==-1&&(Ua(R),_(xn[R]))}c.recommendedMovement&&(T(),c.recommendedMovement.forEach(R=>{const X=qr.find(re=>re.id===R);X&&E(X)})),ka(b),Ie(!1)},className:"rounded-xl p-4 bg-[#2a2a2a] text-left hover:bg-gray-700 transition-all hover:scale-[1.02]",children:[s.jsx("div",{className:"text-sm font-bold text-white",children:c.name}),s.jsx("div",{className:"text-[10px] text-gray-500 mt-0.5",children:c.director}),s.jsxs("div",{className:"mt-3 space-y-1",children:[c.recommendedCamera&&s.jsxs("div",{className:"text-[10px] text-gray-400",children:[s.jsx("span",{className:"text-gray-600",children:"Camera:"})," ",on.find(R=>R.id===c.recommendedCamera)?.name]}),c.recommendedLens&&s.jsxs("div",{className:"text-[10px] text-gray-400",children:[s.jsx("span",{className:"text-gray-600",children:"Lens:"})," ",xn.find(R=>R.id===c.recommendedLens)?.name]}),c.recommendedMovement&&s.jsxs("div",{className:"text-[10px] text-gray-400",children:[s.jsx("span",{className:"text-gray-600",children:"Motion:"})," ",c.recommendedMovement.map(R=>qr.find(X=>X.id===R)?.name).join(", ")]})]})]},c.id))})]}),Qt==="all"&&s.jsxs(s.Fragment,{children:[s.jsxs("div",{className:"flex justify-center gap-10",children:[s.jsx(ua,{items:on.map(c=>c.id),selectedIndex:Hr,onSelect:Ah,label:"CAMERA",renderItem:(c,b)=>s.jsx("div",{className:`${b?"w-14 h-14":"w-8 h-8"} rounded-lg bg-gray-700 flex items-center justify-center transition-all`,children:s.jsx("span",{className:`${b?"text-white":"text-gray-400"}`,children:$e.camera})}),renderLabel:c=>on.find(R=>R.id===c)?.name||""}),s.jsx(ua,{items:xn.map(c=>c.id),selectedIndex:Ms,onSelect:Ch,label:"LENS",renderItem:(c,b)=>s.jsx("div",{className:`${b?"w-14 h-14":"w-8 h-8"} rounded-full border-2 ${b?"border-white":"border-gray-600"} flex items-center justify-center transition-all`,children:s.jsx("div",{className:`${b?"w-6 h-6":"w-3 h-3"} rounded-full bg-gray-400 transition-all`})}),renderLabel:c=>xn.find(R=>R.id===c)?.name||""}),s.jsx(ua,{items:Fs,selectedIndex:Es,onSelect:Sh,label:"FOCAL LENGTH",renderItem:(c,b)=>s.jsx("span",{className:`font-bold ${b?"text-3xl text-white":"text-lg text-gray-500"} transition-all`,children:c}),renderLabel:c=>`${c}mm`}),s.jsx(ua,{items:ks,selectedIndex:Ts,onSelect:wh,label:"APERTURE",renderItem:(c,b)=>{const R={"f/1.4":90,"f/2.8":75,"f/4":60,"f/5.6":50,"f/8":40,"f/11":30,"f/16":20},X=b?R[c]:R[c]*.5;return s.jsx("div",{className:`${b?"w-14 h-14":"w-8 h-8"} rounded-full border-2 ${b?"border-gray-500":"border-gray-700"} flex items-center justify-center transition-all`,children:s.jsx("div",{className:"rounded-full bg-gray-400 transition-all",style:{width:`${X}%`,height:`${X}%`}})})},renderLabel:c=>c})]}),s.jsx("div",{className:"mt-8 text-center text-gray-500 text-xs",children:du})]})]})}),ct&&s.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center",onClick:()=>ge(!1),children:s.jsxs("div",{className:"bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden",onClick:c=>c.stopPropagation(),children:[s.jsxs("div",{className:"flex items-center justify-between mb-5",children:[s.jsx("span",{className:"px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300",children:"Camera movement"}),s.jsx("button",{onClick:()=>ge(!1),className:"w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors",children:$e.close})]}),s.jsx("div",{className:"grid grid-cols-6 gap-3 overflow-y-auto max-h-[60vh] pr-2",children:qr.map(c=>s.jsxs("button",{onClick:()=>E(c),className:`rounded-xl overflow-hidden transition-all hover:scale-[1.02] ${t.some(b=>b.id===c.id)?"ring-2 ring-[#e8ff00] ring-offset-2 ring-offset-[#1a1a1a]":""}`,children:[s.jsxs("div",{className:"aspect-square bg-[#2a2a2a] flex items-center justify-center relative",children:[s.jsx("div",{className:"w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center",children:s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-5 h-5 text-gray-400",children:[c.category==="dolly"&&s.jsx("path",{d:"M12 19V5M5 12l7-7 7 7"}),c.category==="pan"&&s.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"}),c.category==="tilt"&&s.jsx("path",{d:"M12 5v14M5 12l7 7 7-7"}),c.category==="orbit"&&s.jsx("circle",{cx:"12",cy:"12",r:"7"}),c.category==="zoom"&&s.jsxs(s.Fragment,{children:[s.jsx("circle",{cx:"11",cy:"11",r:"6"}),s.jsx("path",{d:"M21 21l-4.35-4.35"})]}),c.category==="special"&&s.jsx("path",{d:"M12 2l2 7h7l-5.5 4 2 7-5.5-4-5.5 4 2-7L3 9h7l2-7z"}),c.category==="static"&&s.jsx("rect",{x:"6",y:"6",width:"12",height:"12",rx:"2"})]})}),t.some(b=>b.id===c.id)&&s.jsx("div",{className:"absolute top-1.5 right-1.5 w-5 h-5 bg-[#e8ff00] rounded-md flex items-center justify-center",children:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"black",strokeWidth:"3",className:"w-3 h-3",children:s.jsx("path",{d:"M20 6L9 17l-5-5"})})})]}),s.jsx("div",{className:"py-2 px-1.5 bg-[#222] text-center",children:s.jsx("div",{className:"text-[10px] text-gray-300 font-medium truncate",children:c.name})})]},c.id))})]})}),A&&s.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center",onClick:()=>v(!1),children:s.jsxs("div",{className:"bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-3xl w-full mx-4",onClick:c=>c.stopPropagation(),children:[s.jsxs("div",{className:"flex items-center justify-between mb-5",children:[s.jsx("span",{className:"px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300",children:"Visual Style"}),s.jsx("button",{onClick:()=>v(!1),className:"w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors",children:$e.close})]}),s.jsx("div",{className:"grid grid-cols-5 gap-3",children:As.map((c,b)=>s.jsxs("button",{onClick:()=>{tc(Si===b?null:b),v(!1)},className:`rounded-xl p-4 transition-all hover:scale-[1.02] text-center ${Si===b?"bg-[#e8ff00] text-black":"bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,children:[s.jsx("div",{className:"text-sm font-medium",children:c.name}),s.jsx("div",{className:`text-[10px] mt-1 ${Si===b?"text-black/60":"text-gray-500"}`,children:c.description})]},c.id))})]})}),O&&s.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center",onClick:()=>P(!1),children:s.jsxs("div",{className:"bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-3xl w-full mx-4",onClick:c=>c.stopPropagation(),children:[s.jsxs("div",{className:"flex items-center justify-between mb-5",children:[s.jsx("span",{className:"px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300",children:"Lighting"}),s.jsx("button",{onClick:()=>P(!1),className:"w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors",children:$e.close})]}),s.jsx("div",{className:"grid grid-cols-5 gap-3",children:Cs.map((c,b)=>s.jsxs("button",{onClick:()=>{nc(wi===b?null:b),P(!1)},className:`rounded-xl p-4 transition-all hover:scale-[1.02] text-center ${wi===b?"bg-[#e8ff00] text-black":"bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,children:[s.jsx("div",{className:"text-sm font-medium",children:c.name}),s.jsx("div",{className:`text-[10px] mt-1 ${wi===b?"text-black/60":"text-gray-500"}`,children:c.description})]},c.id))})]})}),q&&s.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center",onClick:()=>G(!1),children:s.jsxs("div",{className:"bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-3xl w-full mx-4",onClick:c=>c.stopPropagation(),children:[s.jsxs("div",{className:"flex items-center justify-between mb-5",children:[s.jsx("span",{className:"px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300",children:"Weather / Atmosphere"}),s.jsx("button",{onClick:()=>G(!1),className:"w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors",children:$e.close})]}),s.jsx("div",{className:"grid grid-cols-5 gap-3",children:Ns.map((c,b)=>s.jsxs("button",{onClick:()=>{ic(Mi===b?null:b),G(!1)},className:`rounded-xl p-4 transition-all hover:scale-[1.02] text-center ${Mi===b?"bg-[#e8ff00] text-black":"bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,children:[s.jsx("div",{className:"text-sm font-medium",children:c.name}),s.jsx("div",{className:`text-[10px] mt-1 ${Mi===b?"text-black/60":"text-gray-500"}`,children:c.description})]},c.id))})]})}),Me&&s.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center",onClick:()=>se(!1),children:s.jsxs("div",{className:"bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-5xl w-full mx-4 max-h-[85vh] overflow-hidden",onClick:c=>c.stopPropagation(),children:[s.jsxs("div",{className:"flex items-center justify-between mb-5",children:[s.jsx("span",{className:"px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300",children:"Director Styles"}),s.jsx("button",{onClick:()=>se(!1),className:"w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors",children:$e.close})]}),s.jsx("div",{className:"grid grid-cols-4 gap-3 overflow-y-auto max-h-[50vh]",children:ln.map((c,b)=>s.jsxs("button",{onClick:()=>{ka(xt===b?null:b)},className:`rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${xt===b?"bg-[#e8ff00] text-black":"bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,children:[s.jsx("div",{className:"text-sm font-bold",children:c.name}),s.jsx("div",{className:`text-[10px] mt-0.5 ${xt===b?"text-black/60":"text-gray-500"}`,children:c.director}),s.jsx("div",{className:`text-[10px] mt-2 ${xt===b?"text-black/70":"text-gray-400"}`,children:c.description})]},c.id))}),xt!==null&&s.jsxs("div",{className:"mt-5 pt-5 border-t border-gray-700",children:[s.jsxs("div",{className:"flex items-center justify-between mb-4",children:[s.jsxs("div",{className:"text-sm font-medium text-white",children:["Recommended for ",ln[xt].name]}),s.jsx("button",{onClick:()=>{const c=ln[xt];if(c.recommendedCamera){const b=on.findIndex(R=>R.id===c.recommendedCamera);b!==-1&&(Ia(b),x(on[b]))}if(c.recommendedLens){const b=xn.findIndex(R=>R.id===c.recommendedLens);b!==-1&&(Ua(b),_(xn[b]))}if(c.recommendedMovement&&(T(),c.recommendedMovement.forEach(b=>{const R=qr.find(X=>X.id===b);R&&E(R)})),c.recommendedLighting){const b=Cs.findIndex(R=>R.id===c.recommendedLighting);b!==-1&&nc(b)}if(c.recommendedStyle){const b=As.findIndex(R=>R.id===c.recommendedStyle);b!==-1&&tc(b)}if(c.recommendedAtmosphere){const b=Ns.findIndex(R=>R.id===c.recommendedAtmosphere);b!==-1&&ic(b)}if(c.recommendedFraming){const b=Ls.findIndex(R=>R.id===c.recommendedFraming);b!==-1&&sc(b)}if(c.recommendedSetDesign){const b=Ds.findIndex(R=>R.id===c.recommendedSetDesign);b!==-1&&ac(b)}if(c.recommendedColorPalette){const b=Is.findIndex(R=>R.id===c.recommendedColorPalette);b!==-1&&oc(b)}if(c.recommendedCharacterStyle){const b=Us.findIndex(R=>R.id===c.recommendedCharacterStyle);b!==-1&&lc(b)}se(!1)},className:"px-4 py-2 bg-[#e8ff00] text-black rounded-lg text-xs font-semibold hover:bg-[#f0ff4d] transition-colors",children:"Apply All Recommended"})]}),s.jsxs("div",{className:"grid grid-cols-3 gap-4",children:[s.jsxs("div",{className:"bg-[#2a2a2a] rounded-xl p-4",children:[s.jsx("div",{className:"text-[10px] text-gray-500 uppercase tracking-wider mb-2",children:"Camera"}),ln[xt].recommendedCamera?s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx("div",{className:"w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center",children:$e.camera}),s.jsx("div",{className:"text-sm text-white",children:on.find(c=>c.id===ln[xt].recommendedCamera)?.name||"Any"})]}):s.jsx("div",{className:"text-sm text-gray-500",children:"Any camera works"})]}),s.jsxs("div",{className:"bg-[#2a2a2a] rounded-xl p-4",children:[s.jsx("div",{className:"text-[10px] text-gray-500 uppercase tracking-wider mb-2",children:"Lens"}),ln[xt].recommendedLens?s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx("div",{className:"w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center",children:s.jsx("div",{className:"w-3 h-3 rounded-full bg-gray-400"})}),s.jsx("div",{className:"text-sm text-white",children:xn.find(c=>c.id===ln[xt].recommendedLens)?.name||"Any"})]}):s.jsx("div",{className:"text-sm text-gray-500",children:"Any lens works"})]}),s.jsxs("div",{className:"bg-[#2a2a2a] rounded-xl p-4",children:[s.jsx("div",{className:"text-[10px] text-gray-500 uppercase tracking-wider mb-2",children:"Movements"}),ln[xt].recommendedMovement&&ln[xt].recommendedMovement.length>0?s.jsx("div",{className:"flex flex-wrap gap-1",children:ln[xt].recommendedMovement.map(c=>{const b=qr.find(R=>R.id===c);return b?s.jsx("span",{className:"px-2 py-1 bg-gray-700 rounded text-[10px] text-gray-300",children:b.name},c):null})}):s.jsx("div",{className:"text-sm text-gray-500",children:"Any movement"})]})]})]})]})}),ce&&s.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center",onClick:()=>ne(!1),children:s.jsxs("div",{className:"bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-2xl w-full mx-4",onClick:c=>c.stopPropagation(),children:[s.jsxs("div",{className:"flex items-center justify-between mb-5",children:[s.jsxs("div",{className:"flex items-center gap-3",children:[s.jsx("span",{className:"px-4 py-1.5 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-lg text-xs font-medium text-teal-300",children:"Character DNA"}),s.jsx("span",{className:"text-xs text-gray-500",children:"Consistent character for shot chaining"})]}),s.jsx("button",{onClick:()=>ne(!1),className:"w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors",children:$e.close})]}),s.jsx("div",{className:"bg-[#2a2a2a] rounded-xl p-4 mb-5 border border-gray-700/50",children:s.jsxs("div",{className:"flex items-start gap-3",children:[s.jsx("div",{className:"w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0",children:s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-4 h-4 text-teal-400",children:[s.jsx("circle",{cx:"12",cy:"12",r:"10"}),s.jsx("path",{d:"M12 16v-4M12 8h.01"})]})}),s.jsxs("div",{children:[s.jsx("div",{className:"text-sm text-gray-300 font-medium mb-1",children:"Why Character DNA?"}),s.jsx("div",{className:"text-xs text-gray-500 leading-relaxed",children:"When chaining multiple shots, AI can drift character features (face, clothing, colors). Character DNA is your reusable description that stays constant across ALL shots. Copy-paste this exact text into every prompt for consistent characters."})]})]})}),s.jsxs("div",{className:"space-y-3",children:[s.jsx("label",{className:"text-xs text-gray-400 block",children:"Character Description (copy-paste this into all prompts)"}),s.jsx("textarea",{value:M||"",onChange:c=>U(c.target.value||null),placeholder:"Example: Asian man in his 40s, weathered face, salt-pepper stubble, worn tan flight suit with mission patches, determined eyes, short cropped black hair",className:"w-full h-32 bg-[#252525] rounded-xl border border-gray-700/50 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 resize-none"})]}),s.jsxs("div",{className:"mt-5 pt-5 border-t border-gray-700",children:[s.jsx("div",{className:"text-xs text-gray-400 mb-3",children:"Quick Templates (click to use)"}),s.jsx("div",{className:"flex flex-wrap gap-2",children:["Young woman, mid-20s, long dark hair, casual outfit, confident expression","Elderly man, white beard, weathered face, warm eyes, comfortable sweater","Child, about 8 years old, curious expression, colorful clothes, messy hair","Professional in suit, sharp features, glasses, serious demeanor"].map((c,b)=>s.jsxs("button",{onClick:()=>U(c),className:"px-3 py-1.5 bg-[#2a2a2a] hover:bg-gray-700 rounded-lg text-[10px] text-gray-400 hover:text-gray-200 transition-colors",children:[c.substring(0,40),"..."]},b))})]}),M&&s.jsxs("div",{className:"mt-5 pt-5 border-t border-gray-700",children:[s.jsx("div",{className:"text-xs text-gray-400 mb-3",children:"Generate Character Image from DNA"}),s.jsxs("div",{className:"flex gap-2",children:[s.jsxs("select",{value:zn,onChange:c=>cc(c.target.value),className:"bg-[#2a2a2a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white",children:[s.jsx("option",{value:"1:1",children:"1:1 (Square)"}),s.jsx("option",{value:"16:9",children:"16:9 (Wide)"}),s.jsx("option",{value:"21:9",children:"21:9 (Cinema)"}),s.jsx("option",{value:"9:16",children:"9:16 (Portrait)"})]}),s.jsx("button",{onClick:async()=>{if(M){ne(!1),C(),N(10),Le("Generating character from DNA...");try{const c=`${M}. Character portrait, high quality, 4K, detailed, clean background, centered composition.`,b=await fetch("/api/cinema/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"image",prompt:c,aspect_ratio:zn,resolution:"4K"})});N(50);const R=await b.json();if(R.image_url)N(100),Wr(R.image_url),u(R.image_url),Le("Character generated! Set as reference."),setTimeout(()=>{D(""),Le(null)},2e3);else throw new Error(R.error||"Generation failed")}catch(c){D(c instanceof Error?c.message:"Unknown error")}}},disabled:o,className:"flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2",children:o?s.jsxs(s.Fragment,{children:[s.jsx("div",{className:"w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"}),"Generating..."]}):s.jsx(s.Fragment,{children:"Generate Character Image"})})]}),s.jsx("div",{className:"text-[10px] text-gray-500 mt-2",children:"Creates a character image from your DNA description and sets it as the reference for all shots."})]}),s.jsxs("div",{className:"flex gap-3 mt-6",children:[s.jsx("button",{onClick:()=>U(null),className:"px-4 py-2.5 bg-[#2a2a2a] hover:bg-gray-700 rounded-xl text-xs text-gray-400 transition-colors",children:"Clear"}),s.jsx("button",{onClick:()=>ne(!1),className:"flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-black rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity",children:"Save Character DNA"})]})]})}),ye&&s.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center",onClick:()=>Ge(!1),children:s.jsxs("div",{className:"bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[85vh] overflow-hidden",onClick:c=>c.stopPropagation(),children:[s.jsxs("div",{className:"flex items-center justify-between mb-5",children:[s.jsxs("div",{className:"flex items-center gap-3",children:[s.jsx("span",{className:"px-4 py-1.5 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-lg text-xs font-medium text-orange-300",children:"Sequence Planner"}),s.jsx("span",{className:"text-xs text-gray-500",children:"Plan multiple shots before generating"})]}),s.jsx("button",{onClick:()=>Ge(!1),className:"w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors",children:$e.close})]}),M&&s.jsxs("div",{className:"bg-teal-950/30 border border-teal-700/50 rounded-xl p-3 mb-4",children:[s.jsx("div",{className:"text-[9px] text-teal-400 uppercase mb-1 font-medium",children:"Character DNA (applied to all shots)"}),s.jsx("div",{className:"text-xs text-teal-200",children:M})]}),s.jsx("div",{className:"space-y-3 mb-5 max-h-[40vh] overflow-y-auto",children:V.length===0?s.jsxs("div",{className:"text-center py-8 text-gray-500",children:[s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-12 h-12 mx-auto mb-3 opacity-50",children:[s.jsx("rect",{x:"3",y:"3",width:"7",height:"7",rx:"1"}),s.jsx("rect",{x:"14",y:"3",width:"7",height:"7",rx:"1"}),s.jsx("rect",{x:"3",y:"14",width:"7",height:"7",rx:"1"}),s.jsx("path",{d:"M14 17.5h7M17.5 14v7"})]}),s.jsx("div",{className:"text-sm",children:"No shots planned yet"}),s.jsx("div",{className:"text-xs mt-1",children:"Add shots below to build your sequence"})]}):V.map((c,b)=>s.jsxs("div",{className:`flex items-center gap-3 p-3 rounded-xl border transition-all ${c.status==="complete"?"bg-green-950/30 border-green-700/50":c.status==="generating"?"bg-orange-950/30 border-orange-700/50":"bg-[#2a2a2a] border-gray-700/50"}`,children:[s.jsx("div",{className:`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${c.status==="complete"?"bg-green-500/20 text-green-400":c.status==="generating"?"bg-orange-500/20 text-orange-400":"bg-gray-700 text-gray-400"}`,children:c.status==="complete"?s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",className:"w-4 h-4",children:s.jsx("path",{d:"M5 13l4 4L19 7"})}):c.status==="generating"?s.jsx("div",{className:"w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"}):s.jsx("span",{className:"text-sm font-bold",children:b+1})}),s.jsxs("div",{className:"flex-1 min-w-0",children:[s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx("span",{className:"text-xs font-medium text-white",children:c.angle}),s.jsx("span",{className:"text-[10px] text-gray-500",children:"•"}),s.jsx("span",{className:"text-xs text-gray-400",children:c.cameraMove})]}),s.jsx("div",{className:"text-[11px] text-gray-500 truncate",children:c.action})]}),c.status==="planned"&&s.jsx("button",{onClick:()=>Y(c.id),className:"w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors",children:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-3.5 h-3.5",children:s.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]},c.id))}),s.jsxs("div",{className:"bg-[#252525] rounded-xl p-4 border border-gray-700/50",children:[s.jsx("div",{className:"text-xs text-gray-400 mb-3",children:"Add New Shot"}),s.jsxs("div",{className:"grid grid-cols-3 gap-3",children:[s.jsxs("div",{children:[s.jsx("label",{className:"text-[10px] text-gray-500 block mb-1",children:"Shot Type"}),s.jsxs("select",{id:"seq-angle",className:"w-full h-9 bg-[#1a1a1a] rounded-lg border border-gray-700 text-xs text-white px-2",defaultValue:"",children:[s.jsx("option",{value:"",children:"Select..."}),s.jsx("option",{value:"Wide shot",children:"Wide shot"}),s.jsx("option",{value:"Medium shot",children:"Medium shot"}),s.jsx("option",{value:"Closeup",children:"Closeup"}),s.jsx("option",{value:"Extreme closeup",children:"Extreme closeup"}),s.jsx("option",{value:"Over shoulder",children:"Over shoulder"}),s.jsx("option",{value:"Side profile",children:"Side profile"}),s.jsx("option",{value:"Low angle",children:"Low angle"}),s.jsx("option",{value:"High angle",children:"High angle"})]})]}),s.jsxs("div",{children:[s.jsx("label",{className:"text-[10px] text-gray-500 block mb-1",children:"Camera Move"}),s.jsxs("select",{id:"seq-camera",className:"w-full h-9 bg-[#1a1a1a] rounded-lg border border-gray-700 text-xs text-white px-2",defaultValue:"",children:[s.jsx("option",{value:"",children:"Select..."}),s.jsx("option",{value:"static",children:"Static"}),s.jsx("option",{value:"dolly in",children:"Dolly in"}),s.jsx("option",{value:"dolly out",children:"Dolly out"}),s.jsx("option",{value:"orbit left",children:"Orbit left"}),s.jsx("option",{value:"orbit right",children:"Orbit right"}),s.jsx("option",{value:"pan left",children:"Pan left"}),s.jsx("option",{value:"pan right",children:"Pan right"}),s.jsx("option",{value:"push in",children:"Push in"}),s.jsx("option",{value:"steadicam follow",children:"Steadicam follow"})]})]}),s.jsxs("div",{children:[s.jsx("label",{className:"text-[10px] text-gray-500 block mb-1",children:"Action/Description"}),s.jsx("input",{id:"seq-action",type:"text",placeholder:"e.g., character turns head",className:"w-full h-9 bg-[#1a1a1a] rounded-lg border border-gray-700 text-xs text-white px-3"})]})]}),s.jsx("button",{onClick:()=>{const c=document.getElementById("seq-angle"),b=document.getElementById("seq-camera"),R=document.getElementById("seq-action");c.value&&b.value&&R.value&&(Q({angle:c.value,cameraMove:b.value,action:R.value}),c.value="",b.value="",R.value="")},className:"mt-3 w-full h-9 bg-orange-500 hover:bg-orange-600 text-black rounded-lg text-xs font-semibold transition-colors",children:"+ Add Shot to Sequence"})]}),s.jsxs("div",{className:"flex items-center justify-between mt-5 pt-5 border-t border-gray-700",children:[s.jsxs("div",{className:"flex items-center gap-3",children:[s.jsx("button",{onClick:()=>me(!H),className:`w-12 h-6 rounded-full transition-colors relative ${H?"bg-orange-500":"bg-gray-700"}`,children:s.jsx("div",{className:`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${H?"left-6":"left-0.5"}`})}),s.jsxs("div",{children:[s.jsx("div",{className:"text-xs text-white font-medium",children:"Auto-Chain Mode"}),s.jsx("div",{className:"text-[10px] text-gray-500",children:"Automatically generate next shot when current completes"})]})]}),s.jsxs("div",{className:"flex gap-2",children:[s.jsx("button",{onClick:le,className:"px-4 py-2 bg-[#2a2a2a] hover:bg-gray-700 rounded-lg text-xs text-gray-400 transition-colors",children:"Clear All"}),s.jsx("button",{onClick:Yh,disabled:V.length===0||!i.startFrame&&!gn,className:"px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed",title:!i.startFrame&&!gn?"Add a START FRAME or REF image first":"",children:V.length===0?"Add shots first":!i.startFrame&&!gn?"Need ref image":`Generate ${V.length} shots`})]})]})]})}),Zi&&s.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center",onClick:()=>pn(!1),children:s.jsxs("div",{className:"bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden",onClick:c=>c.stopPropagation(),children:[s.jsxs("div",{className:"flex items-center justify-between mb-5",children:[s.jsxs("div",{className:"flex items-center gap-3",children:[s.jsx("span",{className:"px-4 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg text-xs font-medium text-cyan-300",children:"3D Camera Control"}),s.jsx("span",{className:"text-xs text-gray-500",children:"Drag handles to set angle"})]}),s.jsx("button",{onClick:()=>pn(!1),className:"w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors",children:$e.close})]}),s.jsx(Wv,{azimuth:Ve,setAzimuth:ze,elevation:Qe,setElevation:mt,distance:Mt,setDistance:Tt,subjectImage:i.startFrame}),s.jsxs("div",{className:"flex gap-3 mt-5 pt-5 border-t border-gray-700",children:[s.jsx("button",{onClick:()=>{const c=ds(Ve,Qe,Mt),b=i.motionPrompt;m(b?`${b}, ${c}`:c),pn(!1)},className:"flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity",children:"Apply Angle to Prompt"}),s.jsx("button",{onClick:()=>pn(!1),className:"px-4 py-2 bg-[#2a2a2a] hover:bg-gray-700 rounded-lg text-xs text-gray-400 transition-colors",children:"Cancel"})]})]})}),Qi&&s.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center",onClick:()=>Dn(!1),children:s.jsxs("div",{className:"bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden",onClick:c=>c.stopPropagation(),children:[s.jsxs("div",{className:"flex items-center justify-between mb-5",children:[s.jsxs("div",{className:"flex items-center gap-3",children:[s.jsx("span",{className:"px-4 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-xs font-medium text-purple-300",children:"Batch Generator"}),s.jsx("span",{className:"text-xs text-gray-500",children:"Generate multiple angles at once"})]}),s.jsx("button",{onClick:()=>Dn(!1),className:"w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors",children:$e.close})]}),s.jsx($v,{sourceImage:i.startFrame,onBatchComplete:c=>{console.log("Batch complete:",c),Dn(!1)},onImageGenerated:c=>{console.log("Image generated:",c)},generateAngleImage:async(c,b)=>{const R=ds(c.azimuth,c.elevation,c.distance);throw console.log("Generating image with angle:",c,"prompt:",R),new Error("Batch generation API not implemented yet. Use the 3D Camera Control to set individual angles.")}})]})}),Fr&&s.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center",onClick:()=>ki(!1),children:s.jsx("div",{className:"bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-6xl w-full mx-4 h-[85vh] flex flex-col",onClick:c=>c.stopPropagation(),children:s.jsx(qv,{onSelectShots:zh,onClose:()=>ki(!1),userAssets:kr,onAddAsset:Gh,onRemoveAsset:Vh,selectedAsset:Qn,onSelectAsset:Or})})}),In&&s.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center",onClick:()=>gi(!1),children:s.jsxs("div",{className:"bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-2xl w-full mx-4",onClick:c=>c.stopPropagation(),children:[s.jsxs("div",{className:"flex items-center justify-between mb-6",children:[s.jsxs("div",{className:"flex items-center gap-3",children:[s.jsx("span",{className:"px-4 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-xs font-medium text-purple-300",children:"🎬 Continue from Video"}),s.jsx("span",{className:"text-[10px] text-gray-500",children:"Video → Extract → Close-up → Dialogue → Stitch"})]}),s.jsx("button",{onClick:()=>gi(!1),className:"w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors",children:$e.close})]}),s.jsx("div",{className:"flex items-center justify-between mb-6 px-4",children:[1,2,3,4].map(c=>s.jsxs("div",{className:"flex items-center",children:[s.jsx("div",{className:`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${B>=c?B===c?"bg-purple-500 text-white":"bg-green-500 text-white":"bg-gray-700 text-gray-400"}`,children:B>c?"✓":c}),c<4&&s.jsx("div",{className:`w-16 h-0.5 mx-1 ${B>c?"bg-green-500":"bg-gray-700"}`})]},c))}),we&&s.jsx("div",{className:"mb-4 px-4 py-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300",children:we}),B===1&&s.jsxs("div",{className:"space-y-4",children:[s.jsx("div",{className:"text-sm text-gray-300 mb-2",children:"Step 1: Choose your video"}),s.jsxs("div",{className:"space-y-2",children:[s.jsx("div",{className:"text-[10px] text-gray-500 uppercase",children:"Upload from computer"}),s.jsxs("label",{className:"block",children:[s.jsx("input",{ref:Ue,type:"file",accept:"video/*",onChange:ru,className:"hidden"}),s.jsx("div",{onClick:()=>Ue.current?.click(),className:`w-full px-4 py-4 border-2 border-dashed rounded-lg cursor-pointer transition-all flex items-center justify-center gap-3 ${Ee?"border-green-500/50 bg-green-500/10":"border-gray-600 hover:border-purple-500 hover:bg-purple-500/5"}`,children:W&&!nn?s.jsxs(s.Fragment,{children:[s.jsx("div",{className:"w-5 h-5 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"}),s.jsxs("span",{className:"text-sm text-gray-400",children:["Uploading ",Ee,"..."]})]}):Ee?s.jsxs(s.Fragment,{children:[s.jsx("span",{className:"text-green-400",children:"✓"}),s.jsx("span",{className:"text-sm text-gray-300",children:Ee})]}):s.jsxs(s.Fragment,{children:[s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-5 h-5 text-gray-500",children:[s.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),s.jsx("polyline",{points:"17 8 12 3 7 8"}),s.jsx("line",{x1:"12",y1:"3",x2:"12",y2:"15"})]}),s.jsx("span",{className:"text-sm text-gray-400",children:"Click to select video file"})]})})]})]}),s.jsxs("div",{className:"flex items-center gap-3",children:[s.jsx("div",{className:"flex-1 h-px bg-gray-700"}),s.jsx("span",{className:"text-xs text-gray-500",children:"or paste URL"}),s.jsx("div",{className:"flex-1 h-px bg-gray-700"})]}),s.jsx("input",{type:"text",value:nn,onChange:c=>{Oi(c.target.value),Pe(null)},placeholder:"https://example.com/video.mp4",className:"w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"}),s.jsx("button",{onClick:eu,disabled:W||!nn,className:"w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2",children:W&&nn?s.jsxs(s.Fragment,{children:[s.jsx("div",{className:"w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"}),"Extracting last frame..."]}):s.jsx(s.Fragment,{children:"📸 Extract Last Frame"})})]}),B===2&&s.jsxs("div",{className:"space-y-4",children:[s.jsx("div",{className:"text-sm text-gray-300 mb-2",children:"Step 2: Generate dialogue-ready close-up"}),xi&&s.jsxs("div",{className:"flex gap-4",children:[s.jsxs("div",{className:"flex-1",children:[s.jsx("div",{className:"text-[10px] text-gray-500 uppercase mb-1",children:"Extracted Frame"}),s.jsx("img",{src:xi,alt:"Extracted",className:"w-full h-32 object-cover rounded-lg border border-gray-700"})]}),s.jsx("div",{className:"flex-1 flex items-center justify-center text-4xl",children:"→"}),s.jsxs("div",{className:"flex-1",children:[s.jsx("div",{className:"text-[10px] text-gray-500 uppercase mb-1",children:"Will Generate"}),s.jsx("div",{className:"w-full h-32 bg-[#2a2a2a] rounded-lg border border-gray-700 flex items-center justify-center text-gray-500",children:"Close-up shot"})]})]}),s.jsxs("div",{className:"flex gap-2",children:[s.jsx("button",{onClick:()=>$(1),className:"px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors",children:"← Back"}),s.jsx("button",{onClick:tu,disabled:W,className:"flex-1 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2",children:W?s.jsxs(s.Fragment,{children:[s.jsx("div",{className:"w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"}),"Generating close-up..."]}):s.jsx(s.Fragment,{children:"🎯 Generate Close-up"})})]})]}),B===3&&s.jsxs("div",{className:"space-y-4",children:[s.jsx("div",{className:"text-sm text-gray-300 mb-2",children:"Step 3: Enter dialogue for character to speak"}),tr&&s.jsxs("div",{className:"mb-4",children:[s.jsx("div",{className:"text-[10px] text-gray-500 uppercase mb-1",children:"Generated Close-up"}),s.jsx("img",{src:tr,alt:"Close-up",className:"w-48 h-28 object-cover rounded-lg border border-gray-700"})]}),s.jsxs("div",{children:[s.jsx("div",{className:"text-[10px] text-gray-500 uppercase mb-1",children:"What should they say?"}),s.jsx("textarea",{value:nr,onChange:c=>zr(c.target.value),placeholder:"Hello everyone! Welcome to my video. Today I'm going to show you something amazing...",className:"w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 h-24 resize-none"})]}),s.jsxs("div",{className:"flex gap-2",children:[s.jsx("button",{onClick:()=>$(2),className:"px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors",children:"← Back"}),s.jsx("button",{onClick:nu,disabled:W||!nr.trim(),className:"flex-1 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2",children:W?s.jsxs(s.Fragment,{children:[s.jsx("div",{className:"w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"}),"Generating with Seedance..."]}):s.jsx(s.Fragment,{children:"🗣️ Generate Dialogue (Seedance)"})})]})]}),B===4&&s.jsxs("div",{className:"space-y-4",children:[s.jsx("div",{className:"text-sm text-gray-300 mb-2",children:"Step 4: Stitch videos together"}),s.jsx("div",{className:"flex gap-4 items-center",children:ir&&s.jsxs(s.Fragment,{children:[s.jsxs("div",{className:"flex-1",children:[s.jsx("div",{className:"text-[10px] text-gray-500 uppercase mb-1",children:"Original Video"}),s.jsx("video",{src:nn,className:"w-full h-24 object-cover rounded-lg border border-gray-700",muted:!0})]}),s.jsx("div",{className:"text-2xl",children:"+"}),s.jsxs("div",{className:"flex-1",children:[s.jsx("div",{className:"text-[10px] text-gray-500 uppercase mb-1",children:"Dialogue Video"}),s.jsx("video",{src:ir,className:"w-full h-24 object-cover rounded-lg border border-purple-500",muted:!0,controls:!0})]})]})}),s.jsxs("div",{className:"flex gap-2",children:[s.jsx("button",{onClick:()=>$(3),className:"px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors",children:"← Back"}),s.jsx("button",{onClick:iu,disabled:W,className:"flex-1 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2",children:W?s.jsxs(s.Fragment,{children:[s.jsx("div",{className:"w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"}),"Stitching videos..."]}):s.jsx(s.Fragment,{children:"🎬 Stitch & Download"})})]}),s.jsx("div",{className:"text-center",children:s.jsx("button",{onClick:yc,className:"text-xs text-gray-500 hover:text-gray-300",children:"Start Over"})})]})]})}),gt&&s.jsx("div",{className:"fixed inset-0 bg-black/95 z-50 flex flex-col",onClick:()=>Oe(!1),children:s.jsxs("div",{className:"flex-1 bg-[#0f0f0f] flex flex-col h-full w-full overflow-hidden",onClick:c=>c.stopPropagation(),children:[s.jsxs("div",{className:"flex items-center justify-between p-4 border-b border-gray-800/50 flex-shrink-0",children:[s.jsxs("div",{className:"flex items-center gap-3",children:[s.jsxs("span",{className:"px-4 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg text-sm font-medium text-yellow-300 flex items-center gap-2",children:[$e.sparkle,"AI Assistant"]}),s.jsxs("div",{className:"flex bg-[#2a2a2a] rounded-lg p-0.5",children:[s.jsx("button",{onClick:()=>ys("chat"),className:`px-3 py-1 rounded-md text-xs font-medium transition-all ${qt==="chat"?"bg-purple-500 text-white":"text-gray-400 hover:text-white"}`,children:"Chat"}),s.jsx("button",{onClick:()=>ys("quick"),className:`px-3 py-1 rounded-md text-xs font-medium transition-all ${qt==="quick"?"bg-yellow-500 text-black":"text-gray-400 hover:text-white"}`,children:"Prompt"}),s.jsx("button",{onClick:()=>ys("settings"),className:`px-3 py-1 rounded-md text-xs font-medium transition-all ${qt==="settings"?"bg-gray-600 text-white":"text-gray-400 hover:text-white"}`,children:"Settings"})]})]}),s.jsxs("div",{className:"flex items-center gap-2",children:[qt==="chat"&&$t.length>0&&s.jsx("button",{onClick:jh,className:"px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs transition-colors",children:"Clear"}),s.jsx("button",{onClick:()=>Oe(!1),className:"w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors",children:$e.close})]})]}),s.jsxs("div",{className:"flex items-center gap-2 px-6 py-2 bg-[#1a1a1a] border-b border-gray-800/30 flex-shrink-0",children:[s.jsx("div",{className:`w-2 h-2 rounded-full ${rt==="ok"?"bg-green-500":rt==="error"?"bg-red-500":"bg-yellow-500"}`}),s.jsx("span",{className:"text-xs text-gray-400",children:rt==="ok"?`Ollama connected (${qt==="chat"?"Qwen3":"Mistral"})`:rt==="error"?"Ollama not running - start with: ollama serve":"Checking Ollama..."}),s.jsx("span",{className:`ml-auto px-2 py-0.5 rounded text-xs font-medium ${_t==="image"?"bg-blue-500/20 text-blue-300":"bg-green-500/20 text-green-300"}`,children:_t==="image"?"Image":"Video"})]}),s.jsxs("div",{className:"flex-1 overflow-hidden flex flex-col p-6",children:[qt==="quick"&&s.jsxs(s.Fragment,{children:[s.jsx("div",{className:"mb-4",children:s.jsx("textarea",{value:it,onChange:c=>Ze(c.target.value),placeholder:_t==="image"?'e.g., "woman in cafe, lonely, Fincher style" or "epic battle, Nolan, IMAX"':'e.g., "slow push in, eyes widen" or "orbit around, hair blows in wind"',className:"w-full h-24 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 resize-none",disabled:Rt})}),kt&&s.jsx("div",{className:"mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs",children:kt}),s.jsxs("div",{className:"mb-4",children:[s.jsx("div",{className:"text-xs text-gray-500 mb-2",children:"Examples (click to try):"}),s.jsx("div",{className:"flex flex-wrap gap-2",children:_t==="image"?s.jsxs(s.Fragment,{children:[s.jsx("button",{onClick:()=>Ze("woman in cafe, lonely, Fincher style"),className:"px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors",children:"lonely cafe, Fincher"}),s.jsx("button",{onClick:()=>Ze("epic battle scene, Nolan, IMAX"),className:"px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors",children:"epic battle, Nolan"}),s.jsx("button",{onClick:()=>Ze("romantic scene, Wong Kar-wai, neon rain"),className:"px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors",children:"romantic, Wong Kar-wai"}),s.jsx("button",{onClick:()=>Ze("symmetrical hotel, Kubrick stare"),className:"px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors",children:"hotel, Kubrick"})]}):s.jsxs(s.Fragment,{children:[s.jsx("button",{onClick:()=>Ze("slow push in, subject turns head"),className:"px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors",children:"push in + head turn"}),s.jsx("button",{onClick:()=>Ze("orbit around, hair blows in wind"),className:"px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors",children:"orbit + wind"}),s.jsx("button",{onClick:()=>Ze("static shot, rain falls, eyes blink"),className:"px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors",children:"static + rain"}),s.jsx("button",{onClick:()=>Ze("dolly out reveal, smoke rises"),className:"px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors",children:"dolly out reveal"})]})})]}),s.jsx("button",{onClick:Fh,disabled:Rt||!it.trim()||rt==="error",className:`w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${Rt||!it.trim()||rt==="error"?"bg-gray-700 text-gray-500 cursor-not-allowed":"bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400"}`,children:Rt?s.jsxs(s.Fragment,{children:[s.jsx("svg",{className:"w-4 h-4 animate-spin",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:s.jsx("path",{d:"M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"})}),"Generating with Mistral..."]}):s.jsxs(s.Fragment,{children:[$e.sparkle,"Generate ",_t==="image"?"Image":"Motion"," Prompt"]})}),s.jsx("div",{className:"mt-4 text-[10px] text-gray-500 text-center",children:"Quick mode: One-shot prompt generation with Mistral"})]}),qt==="chat"&&s.jsxs(s.Fragment,{children:[pe&&s.jsxs("div",{className:"mb-4 rounded-xl border border-green-500/30 overflow-hidden",children:[s.jsx("div",{onClick:()=>Ra(!Na),className:"p-3 bg-[#1f1f1f] cursor-pointer hover:bg-[#252525] transition-colors",children:s.jsxs("div",{className:"flex items-center justify-between",children:[s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:`w-4 h-4 text-gray-400 transition-transform ${Na?"":"rotate-90"}`,children:s.jsx("path",{d:"M9 18l6-6-6-6"})}),s.jsx("h3",{className:"text-sm font-medium text-white",children:pe.name}),s.jsxs("span",{className:"text-xs text-gray-500",children:[pe.shots.filter(c=>c.status==="done").length,"/",pe.shots.length," shots"]})]}),s.jsxs("span",{className:"text-xs text-green-400",children:["~",pe.duration_estimate,"s"]})]})}),!Na&&s.jsxs("div",{className:"p-3 bg-[#1a1a1a] border-t border-gray-800/50 max-h-[300px] overflow-y-auto",children:[s.jsxs("div",{className:"text-xs text-gray-500 mb-3",children:[pe.mood&&s.jsxs("span",{className:"mr-3",children:["Mood: ",pe.mood]}),pe.director&&s.jsxs("span",{children:["Director: ",pe.director]})]}),s.jsx("div",{className:"mb-3",children:s.jsx("div",{className:"h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden",children:s.jsx("div",{className:"h-full bg-green-500 transition-all",style:{width:`${pe.shots.filter(c=>c.status==="done").length/pe.shots.length*100}%`}})})}),(()=>{const c=Object.values(pe.character_references||{}),b=Object.values(pe.scene_references||{}),R=c.length+b.length,X=[...c,...b].filter(ie=>!ie.ref_url&&ie.generate_prompt).length,re=R-X;return R===0?null:s.jsxs("div",{className:"mb-3 p-2 bg-[#252525] rounded-lg border border-gray-700/50",children:[s.jsxs("div",{className:"flex items-center justify-between mb-2",children:[s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx("span",{className:"text-xs font-medium text-orange-300",children:"References"}),s.jsxs("span",{className:"text-[10px] text-gray-500",children:["(",re,"/",R," done)"]})]}),s.jsxs("button",{onClick:Ih,disabled:X===0||ei,className:`px-2 py-1 rounded text-[10px] font-medium transition-all ${X===0||ei?"bg-gray-700 text-gray-500 cursor-not-allowed":"bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 border border-orange-500/30"}`,children:["Generate Refs (",X,")"]})]}),s.jsxs("div",{className:"grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pb-2",children:[c.map(ie=>{const ke=ei&&!ie.ref_url;return s.jsxs("div",{className:`relative aspect-square rounded-lg overflow-hidden cursor-pointer group ${ie.ref_url?"ring-2 ring-green-500":ke?"ring-2 ring-yellow-500":"ring-1 ring-purple-500/50"}`,title:`${ie.name} - Character Sheet
${ie.description}`,children:[ie.ref_url?s.jsx("img",{src:ie.ref_url,alt:ie.name,className:"w-full h-full object-cover"}):s.jsx("div",{className:"w-full h-full bg-purple-500/20 flex flex-col items-center justify-center",children:s.jsx("span",{className:"text-2xl",children:"👤"})}),ke&&s.jsx("div",{className:"absolute inset-0 bg-black/60 flex items-center justify-center",children:s.jsx("svg",{className:"w-6 h-6 text-yellow-400 animate-spin",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:s.jsx("path",{d:"M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"})})}),s.jsx("div",{className:"absolute bottom-0 left-0 right-0 bg-black/70 px-1.5 py-1",children:s.jsxs("div",{className:"flex items-center justify-between",children:[s.jsx("span",{className:"text-[9px] text-purple-300 font-medium truncate",children:ie.name}),ie.ref_url&&s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",className:"w-3 h-3 text-green-400",children:s.jsx("path",{d:"M20 6L9 17l-5-5"})})]})})]},ie.id)}),b.filter(ie=>ie.type==="location").map(ie=>{const ke=ei&&!ie.ref_url;return s.jsxs("div",{className:`relative aspect-square rounded-lg overflow-hidden cursor-pointer group ${ie.ref_url?"ring-2 ring-green-500":ke?"ring-2 ring-yellow-500":"ring-1 ring-cyan-500/50"}`,title:`${ie.name} - Location Sheet (INT/EXT)
${ie.description}`,children:[ie.ref_url?s.jsx("img",{src:ie.ref_url,alt:ie.name,className:"w-full h-full object-cover"}):s.jsx("div",{className:"w-full h-full bg-cyan-500/20 flex flex-col items-center justify-center",children:s.jsx("span",{className:"text-2xl",children:"📍"})}),ke&&s.jsx("div",{className:"absolute inset-0 bg-black/60 flex items-center justify-center",children:s.jsx("svg",{className:"w-6 h-6 text-yellow-400 animate-spin",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:s.jsx("path",{d:"M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"})})}),s.jsx("div",{className:"absolute bottom-0 left-0 right-0 bg-black/70 px-1.5 py-1",children:s.jsxs("div",{className:"flex items-center justify-between",children:[s.jsx("span",{className:"text-[9px] text-cyan-300 font-medium truncate",children:ie.name}),ie.ref_url&&s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",className:"w-3 h-3 text-green-400",children:s.jsx("path",{d:"M20 6L9 17l-5-5"})})]})})]},ie.id)}),b.filter(ie=>ie.type!=="location").map(ie=>{const ke=ei&&!ie.ref_url;return s.jsxs("div",{className:`relative aspect-square rounded-lg overflow-hidden cursor-pointer group ${ie.ref_url?"ring-2 ring-green-500":ke?"ring-2 ring-yellow-500":"ring-1 ring-green-500/50"}`,title:`${ie.name} - ${ie.type==="vehicle"?"Vehicle":"Object"} Sheet
${ie.description}`,children:[ie.ref_url?s.jsx("img",{src:ie.ref_url,alt:ie.name,className:"w-full h-full object-cover"}):s.jsx("div",{className:"w-full h-full bg-green-500/20 flex flex-col items-center justify-center",children:s.jsx("span",{className:"text-2xl",children:ie.type==="vehicle"?"🚗":"📦"})}),ke&&s.jsx("div",{className:"absolute inset-0 bg-black/60 flex items-center justify-center",children:s.jsx("svg",{className:"w-6 h-6 text-yellow-400 animate-spin",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:s.jsx("path",{d:"M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"})})}),s.jsx("div",{className:"absolute bottom-0 left-0 right-0 bg-black/70 px-1.5 py-1",children:s.jsxs("div",{className:"flex items-center justify-between",children:[s.jsx("span",{className:"text-[9px] text-green-300 font-medium truncate",children:ie.name}),ie.ref_url&&s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",className:"w-3 h-3 text-green-400",children:s.jsx("path",{d:"M20 6L9 17l-5-5"})})]})})]},ie.id)})]})]})})(),s.jsx("div",{className:"mt-4 flex flex-col gap-2",children:ei?s.jsxs("div",{className:"flex gap-2",children:[s.jsxs("div",{className:"flex-1 py-2.5 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm font-medium flex items-center justify-center gap-2",children:[s.jsx("svg",{className:"w-4 h-4 animate-spin",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:s.jsx("path",{d:"M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"})}),"Generating ",vh,"..."]}),s.jsx("button",{onClick:Lh,className:"px-4 py-2.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium transition-colors",children:"Stop"})]}):s.jsxs("div",{className:"flex gap-2",children:[s.jsxs("button",{onClick:Ph,disabled:pe.shots.filter(c=>c.status==="pending").length===0,className:`flex-1 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${pe.shots.filter(c=>c.status==="pending").length===0?"bg-gray-700 text-gray-500 cursor-not-allowed":"bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500"}`,children:[s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-4 h-4",children:[s.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2"}),s.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),s.jsx("path",{d:"M21 15l-5-5L5 21"})]}),"Images (",pe.shots.filter(c=>c.status==="pending").length,")"]}),s.jsxs("button",{onClick:Dh,disabled:pe.shots.filter(c=>c.image_url&&!c.video_url).length===0,className:`flex-1 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${pe.shots.filter(c=>c.image_url&&!c.video_url).length===0?"bg-gray-700 text-gray-500 cursor-not-allowed":"bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-400 hover:to-pink-500"}`,children:[s.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor",className:"w-4 h-4",children:s.jsx("path",{d:"M8 5v14l11-7z"})}),"Videos (",pe.shots.filter(c=>c.image_url&&!c.video_url).length,")"]}),s.jsxs("button",{onClick:te,className:"px-3 py-2.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-sm font-medium transition-colors flex items-center gap-1",title:"Reset all refs, images, videos - keep plan",children:[s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-4 h-4",children:[s.jsx("path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"}),s.jsx("path",{d:"M3 3v5h5"})]}),"Reset"]})]})}),s.jsx("div",{className:"grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mt-3",children:pe.shots.map((c,b)=>{const R=!!c.dialog,X=!!c.video_url;return s.jsxs("div",{onClick:()=>{Ne(c.shot_id),uc(c)},className:`relative rounded-lg cursor-pointer transition-all overflow-hidden group ${Ke===c.shot_id?"ring-2 ring-purple-500":"hover:ring-1 hover:ring-gray-500"}`,title:`${c.shot_id}: ${c.subject}
${c.shot_type} • ${c.duration}s`,children:[s.jsxs("div",{className:"aspect-video bg-[#2a2a2a] relative",children:[c.image_url?s.jsx("img",{src:c.image_url,alt:"",className:"w-full h-full object-cover"}):s.jsx("div",{className:"w-full h-full flex items-center justify-center text-gray-600",children:s.jsx("span",{className:"text-[10px]",children:b+1})}),s.jsx("div",{className:`absolute top-0.5 left-0.5 w-2 h-2 rounded-full ${c.status==="done"?"bg-green-500":c.status==="generating"?"bg-yellow-500 animate-pulse":"bg-gray-600"}`}),X&&s.jsx("div",{className:"absolute top-0.5 right-0.5 bg-green-500 rounded px-1",children:s.jsx("span",{className:"text-[8px] text-white",children:"▶"})}),s.jsx("div",{className:`absolute bottom-0.5 left-0.5 px-1 rounded text-[7px] font-medium ${c.model==="seedance-1.5"?"bg-purple-500/80 text-white":c.model==="kling-o1"?"bg-blue-500/80 text-white":"bg-gray-600/80 text-white"}`,children:c.model==="seedance-1.5"?"S":c.model==="kling-o1"?"O1":"2.6"}),R&&s.jsx("div",{className:"absolute bottom-0.5 right-0.5 bg-yellow-500/80 rounded px-1",children:s.jsx("span",{className:"text-[8px]",children:"🗣"})})]}),s.jsx("div",{className:"bg-[#1a1a1a] px-1 py-0.5 text-center",children:s.jsx("span",{className:"text-[9px] text-gray-400 truncate block",children:c.shot_id.replace("S0","").replace("_B0",".").replace("_C0",".")})}),s.jsxs("div",{className:"absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1",children:[s.jsx("span",{className:"text-[8px] text-white text-center line-clamp-2",children:c.subject}),c.status==="pending"&&s.jsx("button",{onClick:re=>{re.stopPropagation(),Nh(c)},className:"px-2 py-0.5 rounded bg-green-500 text-[8px] text-white hover:bg-green-400",children:"Gen"}),c.status==="done"&&!c.video_url&&s.jsx("button",{onClick:re=>{re.stopPropagation(),Rh(c)},className:"px-2 py-0.5 rounded bg-purple-500 text-[8px] text-white hover:bg-purple-400",children:"Video"})]})]},c.shot_id)})})]})]}),s.jsxs("div",{ref:wn,className:"flex-1 overflow-y-auto mb-4 space-y-3 min-h-0",children:[$t.length===0?s.jsxs("div",{className:"text-center text-gray-500 py-8",children:[s.jsx("div",{className:"text-lg mb-2",children:"Chat with Qwen3"}),s.jsx("div",{className:"text-xs",children:"Ask about cinematography, get prompts, plan videos..."}),s.jsx("div",{className:"text-xs mt-1 text-purple-400",children:"Memory is saved to disk!"}),s.jsx("div",{className:"mt-4 text-xs text-gray-600",children:'Try: "Plan a 30 second video of..."'})]}):$t.map((c,b)=>s.jsx("div",{className:`flex ${c.role==="user"?"justify-end":"justify-start"}`,children:s.jsxs("div",{className:`max-w-[85%] rounded-xl p-3 ${c.role==="user"?"bg-purple-500/20 border border-purple-500/30 text-purple-100":"bg-[#2a2a2a] border border-gray-700 text-gray-200"}`,children:[s.jsx("div",{className:"text-xs opacity-50 mb-1",children:c.role==="user"?"You":"Qwen3"}),s.jsx("div",{className:"text-sm whitespace-pre-wrap",children:c.content}),c.role==="assistant"&&s.jsxs("div",{className:"flex flex-wrap gap-2 mt-2",children:[s.jsx("button",{onClick:()=>Oh(c.content,b),className:`px-2 py-1 rounded text-xs transition-colors ${Wl===b?"bg-green-500/30 text-green-400":"bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400"}`,children:Wl===b?"Copied to Prompt!":"Use as Prompt"}),Hh(c.content)&&s.jsxs("button",{onClick:()=>Wh(c.content),className:`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 ${gc(c.content)?"bg-green-500/20 hover:bg-green-500/30 text-green-400":"bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"}`,children:[s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-3 h-3",children:[s.jsx("path",{d:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"}),s.jsx("path",{d:"M9 12l2 2 4-4"})]}),gc(c.content)?`Load to Grid (${Xh(c.content)} shots)`:`Load Plan (${xc(c.content).length} shots)`]})]})]})},b)),Rt&&s.jsx("div",{className:"flex justify-start",children:s.jsx("div",{className:"bg-[#2a2a2a] border border-gray-700 rounded-xl p-3",children:s.jsxs("div",{className:"flex items-center gap-2 text-gray-400",children:[s.jsx("svg",{className:"w-4 h-4 animate-spin",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:s.jsx("path",{d:"M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"})}),s.jsx("span",{className:"text-xs",children:"Qwen3 thinking..."})]})})})]}),_i.length>0&&s.jsxs("div",{className:"mb-3 p-3 bg-[#1f1f1f] rounded-xl border border-cyan-500/30",children:[s.jsxs("div",{className:"flex items-center justify-between mb-2",children:[s.jsxs("span",{className:"text-xs text-cyan-400 font-medium",children:["Shot Sequence (",_i.filter(c=>c.status==="completed").length,"/",_i.length," complete)"]}),s.jsxs("div",{className:"flex gap-2",children:[!Yl&&!Ca&&s.jsxs("button",{onClick:za,className:"px-2 py-1 rounded text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors flex items-center gap-1",children:[s.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor",className:"w-3 h-3",children:s.jsx("path",{d:"M8 5v14l11-7z"})}),"Execute All"]}),Yl&&s.jsxs("span",{className:"px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400 flex items-center gap-1",children:[s.jsx("svg",{className:"w-3 h-3 animate-spin",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:s.jsx("path",{d:"M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"})}),"Generating..."]}),s.jsx("button",{onClick:qh,className:"px-2 py-1 rounded text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors",children:"Clear"})]})]}),Ca&&s.jsxs("div",{className:"mb-2 p-2 bg-orange-500/10 border border-orange-500/30 rounded-lg text-orange-400 text-xs",children:["Add a reference image first! Upload a start frame or generate an image before executing.",s.jsx("button",{onClick:$h,disabled:!i.startFrame,className:`ml-2 px-2 py-0.5 rounded ${i.startFrame?"bg-green-500/20 text-green-400 hover:bg-green-500/30":"bg-gray-700 text-gray-500 cursor-not-allowed"}`,children:"Resume"})]}),s.jsx("div",{className:"mb-2",children:s.jsx("input",{type:"text",value:M||"",onChange:c=>U(c.target.value),placeholder:"Character DNA (e.g., 'Asian man, 40s, tan flight suit')",className:"w-full bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"})}),s.jsx("div",{className:"grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1.5 max-h-40 overflow-y-auto p-1",children:_i.map((c,b)=>s.jsxs("div",{className:`relative aspect-video rounded overflow-hidden cursor-pointer group ${c.status==="completed"?"ring-1 ring-green-500":c.status==="generating-image"||c.status==="generating-video"?"ring-1 ring-yellow-500":c.status==="error"?"ring-1 ring-red-500":"ring-1 ring-gray-700"}`,title:`${c.shotType}: ${c.prompt.substring(0,60)}...`,children:[c.imageUrl?s.jsx("img",{src:c.imageUrl,alt:"",className:"w-full h-full object-cover"}):s.jsx("div",{className:"w-full h-full bg-[#2a2a2a] flex items-center justify-center",children:s.jsx("span",{className:"text-[10px] text-gray-500",children:c.shotNumber})}),s.jsx("div",{className:`absolute inset-0 flex items-center justify-center ${c.status==="generating-image"||c.status==="generating-video"?"bg-black/50":""}`,children:(c.status==="generating-image"||c.status==="generating-video")&&s.jsx("svg",{className:"w-4 h-4 text-yellow-400 animate-spin",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:s.jsx("path",{d:"M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"})})}),s.jsx("div",{className:"absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-0.5",children:s.jsxs("div",{className:"flex items-center justify-between",children:[s.jsx("span",{className:"text-[8px] text-cyan-300 font-medium truncate",children:c.shotType}),c.status==="completed"&&s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",className:"w-2.5 h-2.5 text-green-400",children:s.jsx("path",{d:"M20 6L9 17l-5-5"})}),c.status==="error"&&s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-2.5 h-2.5 text-red-400",children:s.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})]})}),s.jsx("div",{className:"absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1",children:s.jsxs("span",{className:"text-[8px] text-white text-center line-clamp-2",children:[c.prompt.substring(0,30),"..."]})})]},b))})]}),s.jsxs("div",{className:"mb-3",children:[s.jsxs("div",{className:"flex items-center justify-between mb-2",children:[s.jsxs("span",{className:"text-xs text-gray-500",children:["Reference Images (",Ot.length,"/7)"]}),Ot.length<7&&s.jsxs("button",{onClick:()=>ql.current?.click(),className:"px-2 py-1 bg-[#2a2a2a] hover:bg-gray-700 rounded text-xs text-gray-400 transition-colors flex items-center gap-1",children:[s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-3 h-3",children:s.jsx("path",{d:"M12 5v14M5 12h14"})}),"Add Image"]}),s.jsx("input",{ref:ql,type:"file",accept:"image/*",onChange:Bh,className:"hidden"})]}),Ot.length>0&&s.jsx("div",{className:"flex gap-2 flex-wrap",children:Ot.map((c,b)=>s.jsxs("div",{className:"relative group",children:[s.jsx("img",{src:c.url,alt:`Ref ${b+1}`,className:`w-16 h-16 object-cover rounded-lg border ${Aa===b?"border-yellow-500 animate-pulse":"border-gray-700"}`}),s.jsx("div",{className:"absolute -top-1 -left-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold",children:b+1}),s.jsx("button",{onClick:()=>pc(b),className:"absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity",children:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",className:"w-3 h-3",children:s.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})}),Aa===b&&s.jsx("div",{className:"absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center",children:s.jsx("svg",{className:"w-4 h-4 animate-spin text-yellow-400",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:s.jsx("path",{d:"M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"})})}),c.description&&!Aa&&s.jsx("div",{className:"absolute inset-0 bg-black/70 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity p-1 overflow-hidden",children:s.jsx("div",{className:"text-[8px] text-gray-300 line-clamp-4",children:c.description})})]},b))})]}),kt&&s.jsx("div",{className:"mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs",children:kt}),s.jsxs("div",{className:"flex gap-2",children:[s.jsx("input",{type:"text",value:it,onChange:c=>Ze(c.target.value),onKeyDown:c=>{c.key==="Enter"&&!c.shiftKey&&(c.preventDefault(),fc())},placeholder:"Ask about cinematography, get prompts, refine ideas...",className:"flex-1 bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50",disabled:Rt}),s.jsx("button",{onClick:fc,disabled:Rt||!it.trim()||rt==="error",className:`px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${Rt||!it.trim()||rt==="error"?"bg-gray-700 text-gray-500 cursor-not-allowed":"bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-400 hover:to-pink-400"}`,children:s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-4 h-4",children:s.jsx("path",{d:"M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"})})})]}),s.jsx("div",{className:"mt-3 text-[10px] text-gray-500 text-center",children:s.jsxs("div",{className:"flex items-center justify-center gap-2 flex-wrap",children:[s.jsx("span",{children:"Qwen3 sees:"}),je&&s.jsx("span",{className:"px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded",children:"Prompt"}),i.startFrame&&s.jsx("span",{className:"px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded",children:"Image"}),i.motionPrompt&&s.jsx("span",{className:"px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded",children:"Motion"}),e.length>0&&s.jsxs("span",{className:"px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded",children:[e.length," Shots"]}),V.length>0&&s.jsx("span",{className:"px-1.5 py-0.5 bg-pink-500/20 text-pink-400 rounded",children:"Sequence"}),Ot.length>0&&s.jsxs("span",{className:"px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded",children:[Ot.length," Refs"]}),!je&&!i.startFrame&&e.length===0&&Ot.length===0&&s.jsx("span",{className:"text-gray-600",children:"No context yet"})]})})]}),qt==="settings"&&s.jsxs("div",{className:"flex-1 overflow-y-auto p-4",children:[s.jsx("h3",{className:"text-sm font-medium text-white mb-4",children:"AI Assistant Settings"}),s.jsxs("div",{className:"mb-4",children:[s.jsx("label",{className:"text-xs text-gray-400 mb-2 block",children:"Character DNA"}),s.jsx("textarea",{value:M||"",onChange:c=>U(c.target.value||null),placeholder:"Describe your consistent character (e.g., 'Asian man, 40s, tan flight suit, short black hair')",className:"w-full bg-[#2a2a2a] border border-gray-700 rounded-xl px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50 min-h-[80px] resize-none"}),s.jsx("p",{className:"text-[10px] text-gray-500 mt-1",children:"Applied to all generated prompts for consistency"})]}),pe&&s.jsxs("div",{className:"mb-4 p-3 bg-[#1f1f1f] rounded-xl border border-gray-700",children:[s.jsx("div",{className:"text-xs text-gray-400 mb-2",children:"Loaded Scene"}),s.jsx("div",{className:"text-sm text-white font-medium",children:pe.name}),s.jsxs("div",{className:"text-xs text-gray-500 mt-1",children:[pe.shots.length," shots • ",pe.shots.filter(c=>c.status==="done").length," complete"]}),s.jsx("button",{onClick:()=>{ut(),Ra(!1)},className:"mt-2 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs transition-colors",children:"Clear Scene"})]}),s.jsxs("div",{className:"mb-4",children:[s.jsx("label",{className:"text-xs text-gray-400 mb-2 block",children:"Import Scene Plan"}),s.jsxs("div",{className:"flex gap-2",children:[s.jsx("input",{type:"file",accept:".json",onChange:c=>{const b=c.target.files?.[0];if(b){const R=new FileReader;R.onload=X=>{try{const re=X.target?.result;nt(re),ys("chat")}catch(re){console.error("Failed to parse scene JSON:",re)}},R.readAsText(b)}},className:"hidden",id:"scene-file-input"}),s.jsx("label",{htmlFor:"scene-file-input",className:"flex-1 py-2 px-4 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 text-gray-300 text-sm text-center cursor-pointer transition-colors border border-gray-700 border-dashed",children:"Choose JSON file..."})]})]}),pe&&s.jsxs("div",{className:"mb-4",children:[s.jsx("label",{className:"text-xs text-gray-400 mb-2 block",children:"Export Scene"}),s.jsx("button",{onClick:()=>{const c=oe(),b=new Blob([c],{type:"application/json"}),R=URL.createObjectURL(b),X=document.createElement("a");X.href=R,X.download=`${pe.name.replace(/\s+/g,"_")}_export.json`,X.click(),URL.revokeObjectURL(R)},className:"w-full py-2 px-4 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm transition-colors",children:"Download Scene JSON"})]}),s.jsxs("div",{className:"mb-4 p-3 bg-[#1f1f1f] rounded-xl border border-gray-700",children:[s.jsxs("div",{className:"flex items-center justify-between mb-2",children:[s.jsx("span",{className:"text-xs text-gray-400",children:"Ollama Status"}),s.jsx("span",{className:`text-xs px-2 py-0.5 rounded ${rt==="ok"?"bg-green-500/20 text-green-400":rt==="unknown"?"bg-yellow-500/20 text-yellow-400":"bg-red-500/20 text-red-400"}`,children:rt==="ok"?"Connected":rt==="unknown"?"Checking...":"Offline"})]}),rt==="error"&&s.jsx("p",{className:"text-[10px] text-gray-500",children:"Make sure Ollama is running with Qwen3:4B model"})]}),s.jsx("div",{className:"text-[10px] text-gray-500 text-center mt-4",children:"Cinema Studio v2.0 • AI Assistant powered by Qwen3"})]})]})]})}),Re&&s.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center",onClick:()=>he(!1),children:s.jsxs("div",{className:"bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden",onClick:c=>c.stopPropagation(),children:[s.jsxs("div",{className:"flex items-center justify-between mb-5",children:[s.jsx("span",{className:"px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300",children:"Emotion / Mood"}),s.jsx("button",{onClick:()=>he(!1),className:"w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors",children:$e.close})]}),s.jsx("div",{className:"grid grid-cols-4 gap-3 overflow-y-auto max-h-[60vh]",children:Rs.map((c,b)=>s.jsxs("button",{onClick:()=>{rc(Mn===b?null:b),he(!1)},className:`rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${Mn===b?"bg-[#e8ff00] text-black":"bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,children:[s.jsx("div",{className:"text-sm font-bold",children:c.name}),s.jsx("div",{className:`text-[10px] mt-0.5 ${Mn===b?"text-black/60":"text-gray-500"}`,children:c.emotion}),s.jsx("div",{className:`text-[10px] mt-2 ${Mn===b?"text-black/70":"text-gray-400"}`,children:c.description})]},c.id))})]})}),ee&&s.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center",onClick:()=>ae(!1),children:s.jsxs("div",{className:"bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-5xl w-full mx-4 max-h-[80vh] overflow-hidden",onClick:c=>c.stopPropagation(),children:[s.jsxs("div",{className:"flex items-center justify-between mb-5",children:[s.jsx("span",{className:"px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300",children:"Story Beat / Shot Setup"}),s.jsx("button",{onClick:()=>ae(!1),className:"w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors",children:$e.close})]}),s.jsx("div",{className:"grid grid-cols-4 gap-3 overflow-y-auto max-h-[60vh]",children:Ps.map((c,b)=>s.jsxs("button",{onClick:()=>{Eh(En===b?null:b),ae(!1)},className:`rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${En===b?"bg-[#e8ff00] text-black":"bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,children:[s.jsx("div",{className:"text-sm font-bold",children:c.name}),s.jsx("div",{className:`text-[10px] mt-0.5 ${En===b?"text-black/60":"text-gray-500"}`,children:c.storyBeat}),s.jsx("div",{className:`text-[10px] mt-2 ${En===b?"text-black/70":"text-gray-400"}`,children:c.description})]},c.id))})]})}),Te&&s.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center",onClick:()=>_e(!1),children:s.jsxs("div",{className:"bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden",onClick:c=>c.stopPropagation(),children:[s.jsxs("div",{className:"flex items-center justify-between mb-5",children:[s.jsx("span",{className:"px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300",children:"Framing / Composition"}),s.jsx("button",{onClick:()=>_e(!1),className:"w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors",children:$e.close})]}),s.jsx("div",{className:"grid grid-cols-5 gap-3 overflow-y-auto max-h-[60vh]",children:Ls.map((c,b)=>s.jsxs("button",{onClick:()=>{sc(ti===b?null:b),_e(!1)},className:`rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${ti===b?"bg-[#e8ff00] text-black":"bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,children:[s.jsx("div",{className:"text-sm font-bold",children:c.name}),s.jsx("div",{className:`text-[10px] mt-1 ${ti===b?"text-black/70":"text-gray-400"}`,children:c.description}),c.example&&s.jsx("div",{className:`text-[9px] mt-2 italic ${ti===b?"text-black/50":"text-gray-500"}`,children:c.example})]},c.id))})]})}),ue&&s.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center",onClick:()=>Be(!1),children:s.jsxs("div",{className:"bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden",onClick:c=>c.stopPropagation(),children:[s.jsxs("div",{className:"flex items-center justify-between mb-5",children:[s.jsx("span",{className:"px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300",children:"Set Design / Environment"}),s.jsx("button",{onClick:()=>Be(!1),className:"w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors",children:$e.close})]}),s.jsx("div",{className:"grid grid-cols-5 gap-3 overflow-y-auto max-h-[60vh]",children:Ds.map((c,b)=>s.jsxs("button",{onClick:()=>{ac(ni===b?null:b),Be(!1)},className:`rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${ni===b?"bg-[#e8ff00] text-black":"bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,children:[s.jsx("div",{className:"text-sm font-bold",children:c.name}),s.jsx("div",{className:`text-[10px] mt-1 ${ni===b?"text-black/70":"text-gray-400"}`,children:c.description}),c.director&&s.jsx("div",{className:`text-[9px] mt-2 italic ${ni===b?"text-black/50":"text-gray-500"}`,children:c.director})]},c.id))})]})}),F&&s.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center",onClick:()=>xe(!1),children:s.jsxs("div",{className:"bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden",onClick:c=>c.stopPropagation(),children:[s.jsxs("div",{className:"flex items-center justify-between mb-5",children:[s.jsx("span",{className:"px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300",children:"Color Palette"}),s.jsx("button",{onClick:()=>xe(!1),className:"w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors",children:$e.close})]}),s.jsx("div",{className:"grid grid-cols-5 gap-3 overflow-y-auto max-h-[60vh]",children:Is.map((c,b)=>s.jsxs("button",{onClick:()=>{oc(Ei===b?null:b),xe(!1)},className:`rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${Ei===b?"bg-[#e8ff00] text-black":"bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,children:[s.jsx("div",{className:"text-sm font-bold",children:c.name}),s.jsx("div",{className:"flex gap-1 mt-2",children:c.colors.slice(0,5).map((R,X)=>s.jsx("div",{className:"w-4 h-4 rounded-sm",style:{backgroundColor:R}},X))}),s.jsx("div",{className:`text-[10px] mt-2 ${Ei===b?"text-black/70":"text-gray-400"}`,children:c.description})]},c.id))})]})}),de&&s.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center",onClick:()=>Se(!1),children:s.jsxs("div",{className:"bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden",onClick:c=>c.stopPropagation(),children:[s.jsxs("div",{className:"flex items-center justify-between mb-5",children:[s.jsx("span",{className:"px-4 py-1.5 bg-[#2a2a2a] rounded-lg text-xs font-medium text-gray-300",children:"Character Style / Costume"}),s.jsx("button",{onClick:()=>Se(!1),className:"w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors",children:$e.close})]}),s.jsx("div",{className:"grid grid-cols-5 gap-3 overflow-y-auto max-h-[60vh]",children:Us.map((c,b)=>s.jsxs("button",{onClick:()=>{lc(ii===b?null:b),Se(!1)},className:`rounded-xl p-4 transition-all hover:scale-[1.02] text-left ${ii===b?"bg-[#e8ff00] text-black":"bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,children:[s.jsx("div",{className:"text-sm font-bold",children:c.name}),s.jsx("div",{className:`text-[10px] mt-1 ${ii===b?"text-black/70":"text-gray-400"}`,children:c.description}),c.director&&s.jsx("div",{className:`text-[9px] mt-2 italic ${ii===b?"text-black/50":"text-gray-500"}`,children:c.director})]},c.id))})]})}),St&&s.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center",onClick:()=>Je(!1),children:s.jsxs("div",{className:"bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6 shadow-2xl max-w-5xl w-full mx-4 max-h-[85vh] overflow-hidden",onClick:c=>c.stopPropagation(),children:[s.jsxs("div",{className:"flex items-center justify-between mb-4",children:[s.jsxs("div",{className:"flex items-center gap-3",children:[s.jsx("span",{className:"px-4 py-1.5 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg text-xs font-medium text-white",children:"Video Motion Builder"}),s.jsx("span",{className:"text-[10px] text-gray-500",children:"Motion only - image has all visual info!"})]}),s.jsx("button",{onClick:()=>Je(!1),className:"w-9 h-9 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors",children:$e.close})]}),s.jsx("div",{className:"flex gap-2 mb-4 border-b border-gray-800 pb-3",children:["camera","subject","background","objects","templates","dialogue"].map(c=>s.jsx("button",{onClick:()=>_h(c),className:`px-4 py-2 rounded-lg text-xs font-medium transition-all ${Bi===c?"bg-purple-600 text-white":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,children:c==="dialogue"?"🗣️ Dialogue":c.charAt(0).toUpperCase()+c.slice(1)},c))}),s.jsxs("div",{className:"overflow-y-auto max-h-[50vh] pr-2",children:[Bi==="camera"&&s.jsx("div",{className:"grid grid-cols-4 gap-2",children:Object.entries(wc).map(([c,b])=>s.jsxs("button",{onClick:()=>Kl(Un===c?null:c),className:`rounded-lg p-3 text-left transition-all ${Un===c?"bg-purple-600 text-white ring-2 ring-purple-400":"bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,children:[s.jsx("div",{className:"text-xs font-medium",children:c.replace(/_/g," ")}),s.jsxs("div",{className:`text-[9px] mt-1 ${Un===c?"text-purple-200":"text-gray-500"}`,children:[b.substring(0,50),"..."]})]},c))}),Bi==="subject"&&s.jsx("div",{className:"grid grid-cols-4 gap-2",children:Object.entries(Mc).map(([c,b])=>s.jsxs("button",{onClick:()=>Jl(Fn===c?null:c),className:`rounded-lg p-3 text-left transition-all ${Fn===c?"bg-blue-600 text-white ring-2 ring-blue-400":"bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,children:[s.jsx("div",{className:"text-xs font-medium",children:c.replace(/_/g," ")}),s.jsxs("div",{className:`text-[9px] mt-1 ${Fn===c?"text-blue-200":"text-gray-500"}`,children:[b.substring(0,50),"..."]})]},c))}),Bi==="background"&&s.jsx("div",{className:"grid grid-cols-4 gap-2",children:Object.entries(Ec).map(([c,b])=>s.jsxs("button",{onClick:()=>Zl(kn===c?null:c),className:`rounded-lg p-3 text-left transition-all ${kn===c?"bg-green-600 text-white ring-2 ring-green-400":"bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,children:[s.jsx("div",{className:"text-xs font-medium",children:c.replace(/_/g," ")}),s.jsx("div",{className:`text-[9px] mt-1 ${kn===c?"text-green-200":"text-gray-500"}`,children:b})]},c))}),Bi==="objects"&&s.jsxs("div",{className:"space-y-4",children:[s.jsxs("div",{children:[s.jsx("div",{className:"text-[10px] text-gray-500 uppercase mb-2 font-medium",children:"Natural Elements"}),s.jsx("div",{className:"grid grid-cols-5 gap-2",children:Object.entries(Vu).map(([c,b])=>Object.entries(b).map(([R,X])=>s.jsx("button",{onClick:()=>Pa(On===X?null:X),className:`rounded-lg p-2 text-left transition-all ${On===X?"bg-orange-600 text-white ring-2 ring-orange-400":"bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,children:s.jsxs("div",{className:"text-[10px] font-medium",children:[c,": ",R]})},`${c}-${R}`)))})]}),s.jsxs("div",{children:[s.jsx("div",{className:"text-[10px] text-gray-500 uppercase mb-2 font-medium",children:"Weather"}),s.jsx("div",{className:"grid grid-cols-4 gap-2",children:Object.entries(Hu).map(([c,b])=>Object.entries(b).map(([R,X])=>s.jsx("button",{onClick:()=>Pa(On===X?null:X),className:`rounded-lg p-2 text-left transition-all ${On===X?"bg-cyan-600 text-white ring-2 ring-cyan-400":"bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"}`,children:s.jsxs("div",{className:"text-[10px] font-medium",children:[c,": ",R]})},`weather-${c}-${R}`)))})]})]}),Bi==="templates"&&s.jsxs("div",{className:"space-y-4",children:[s.jsxs("div",{children:[s.jsx("div",{className:"text-[10px] text-gray-500 uppercase mb-2 font-medium",children:"Quick Templates (click to use)"}),s.jsx("div",{className:"grid grid-cols-2 gap-3",children:Object.entries(vn.full).map(([c,b])=>s.jsxs("button",{onClick:()=>{Fe(b),Je(!1)},className:"rounded-lg p-4 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 hover:border-purple-500/50 border border-gray-700 text-left transition-all",children:[s.jsx("div",{className:"text-xs font-medium text-purple-400 mb-1",children:c}),s.jsx("div",{className:"text-[10px] text-gray-400",children:b})]},c))})]}),s.jsxs("div",{children:[s.jsx("div",{className:"text-[10px] text-gray-500 uppercase mb-2 font-medium",children:"Simple Presets"}),s.jsx("div",{className:"grid grid-cols-4 gap-2",children:Object.entries(vn.simple).map(([c,b])=>s.jsx("button",{onClick:()=>{Fe(b),Je(!1)},className:"rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-gray-700 text-left transition-all",children:s.jsx("div",{className:"text-[10px] font-medium",children:c})},c))})]})]}),Bi==="dialogue"&&s.jsxs("div",{className:"space-y-4",children:[s.jsxs("div",{className:"p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg",children:[s.jsx("div",{className:"text-xs text-purple-400 font-medium mb-1",children:"Seedance 1.5 Pro - Dialogue & Lip Sync"}),s.jsx("div",{className:"text-[10px] text-gray-400",children:"These templates use Seedance for perfect lip-sync and audio generation. Replace [DIALOGUE] with your actual spoken text."})]}),s.jsxs("div",{children:[s.jsx("div",{className:"text-[10px] text-gray-500 uppercase mb-2 font-medium",children:"UGC / Talking Head"}),s.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[s.jsxs("button",{onClick:()=>{m(vn.seedance.ugc_basic),Je(!1)},className:"rounded-lg p-4 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 hover:border-purple-500/50 border border-gray-700 text-left transition-all",children:[s.jsx("div",{className:"text-xs font-medium text-purple-400 mb-1",children:"Basic UGC"}),s.jsx("div",{className:"text-[10px] text-gray-400",children:"Confident presenter, soft bokeh, push-in"})]}),s.jsxs("button",{onClick:()=>{m(vn.seedance.ugc_energetic),Je(!1)},className:"rounded-lg p-4 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 hover:border-purple-500/50 border border-gray-700 text-left transition-all",children:[s.jsx("div",{className:"text-xs font-medium text-purple-400 mb-1",children:"Energetic Creator"}),s.jsx("div",{className:"text-[10px] text-gray-400",children:"High energy, handheld movement, excited"})]})]})]}),s.jsxs("div",{children:[s.jsx("div",{className:"text-[10px] text-gray-500 uppercase mb-2 font-medium",children:"Scene Types"}),s.jsxs("div",{className:"grid grid-cols-3 gap-2",children:[s.jsx("button",{onClick:()=>{m(vn.seedance.product_demo),Je(!1)},className:"rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all",children:s.jsx("div",{className:"text-[10px] font-medium text-amber-400",children:"Product Demo"})}),s.jsx("button",{onClick:()=>{m(vn.seedance.emotional),Je(!1)},className:"rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all",children:s.jsx("div",{className:"text-[10px] font-medium text-red-400",children:"Emotional"})}),s.jsx("button",{onClick:()=>{m(vn.seedance.interview),Je(!1)},className:"rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all",children:s.jsx("div",{className:"text-[10px] font-medium text-blue-400",children:"Interview"})}),s.jsx("button",{onClick:()=>{m(vn.seedance.dialogue_two),Je(!1)},className:"rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all",children:s.jsx("div",{className:"text-[10px] font-medium text-green-400",children:"Two Characters"})}),s.jsx("button",{onClick:()=>{m(vn.seedance.social_hook),Je(!1)},className:"rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all",children:s.jsx("div",{className:"text-[10px] font-medium text-pink-400",children:"Social Hook"})})]})]}),s.jsxs("div",{children:[s.jsx("div",{className:"text-[10px] text-gray-500 uppercase mb-2 font-medium",children:"Multi-Language"}),s.jsxs("div",{className:"grid grid-cols-3 gap-2",children:[s.jsx("button",{onClick:()=>{m(vn.seedance.mandarin),Je(!1)},className:"rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all",children:s.jsx("div",{className:"text-[10px] font-medium",children:"🇨🇳 Mandarin"})}),s.jsx("button",{onClick:()=>{m(vn.seedance.spanish),Je(!1)},className:"rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all",children:s.jsx("div",{className:"text-[10px] font-medium",children:"🇪🇸 Spanish"})}),s.jsx("button",{onClick:()=>{m(vn.seedance.japanese),Je(!1)},className:"rounded-lg p-3 bg-[#2a2a2a] text-gray-300 hover:bg-purple-900/30 text-left transition-all",children:s.jsx("div",{className:"text-[10px] font-medium",children:"🇯🇵 Japanese"})})]})]}),s.jsxs("div",{className:"p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg",children:[s.jsx("div",{className:"text-[10px] text-gray-500 uppercase mb-2",children:"Seedance Tips"}),s.jsxs("ul",{className:"text-[10px] text-gray-400 space-y-1",children:[s.jsx("li",{children:"• Replace [DIALOGUE] with actual speech"}),s.jsx("li",{children:'• Specify emotion: "speaks warmly", "exclaims excitedly"'}),s.jsx("li",{children:'• Add language: "speaks in Mandarin with professional tone"'}),s.jsx("li",{children:'• Include camera: "slow push-in", "handheld slight movement"'}),s.jsx("li",{children:"• Audio is generated automatically - no separate TTS needed!"})]})]})]})]}),s.jsxs("div",{className:"mt-4 pt-4 border-t border-gray-800",children:[s.jsx("div",{className:"text-[9px] text-gray-500 uppercase mb-2",children:"Video Motion Prompt Preview:"}),s.jsx("div",{className:"px-3 py-2 bg-[#0a0a0a] rounded-lg text-xs text-gray-300 min-h-[40px]",children:Os()||s.jsx("span",{className:"text-gray-600 italic",children:"Select motions above..."})}),Ss.length>0&&s.jsx("div",{className:"mt-2 px-3 py-2 bg-orange-950/50 border border-orange-700/50 rounded-lg",children:Ss.map((c,b)=>s.jsxs("div",{className:"text-[10px] text-orange-300",children:["⚠ ",c]},b))}),s.jsxs("div",{className:"flex gap-2 mt-3",children:[s.jsx("button",{onClick:()=>{Kl(null),Jl(null),Zl(null),Pa(null)},className:"px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs text-gray-400 transition-colors",children:"Clear All"}),s.jsx("button",{onClick:()=>{const c=Os();c&&(Fe(c),m(c)),Je(!1)},className:"px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs text-white font-medium transition-colors",children:"Apply to Prompt"})]})]})]})}),s.jsx("div",{className:"border-t border-gray-800/50 bg-[#1a1a1a] px-6 py-4",children:s.jsxs("div",{className:"max-w-6xl mx-auto flex items-center gap-4",children:[s.jsxs("div",{className:"flex flex-col gap-1",children:[s.jsxs("button",{onClick:()=>bi("image"),className:`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all ${_t==="image"?"bg-gray-700 text-white":"bg-transparent text-gray-500 hover:bg-gray-800 hover:text-gray-300"}`,children:[$e.image,s.jsx("span",{className:"text-[9px] mt-1 font-medium",children:"Image"})]}),s.jsxs("button",{onClick:()=>bi("video"),className:`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all ${_t==="video"?"bg-gray-700 text-white":"bg-transparent text-gray-500 hover:bg-gray-800 hover:text-gray-300"}`,children:[$e.video,s.jsx("span",{className:"text-[9px] mt-1 font-medium",children:"Video"})]})]}),_t==="image"&&s.jsxs("div",{className:"flex flex-col gap-1",children:[s.jsxs("button",{onClick:()=>La(jn==="start"?null:"start"),className:`px-3 py-2 rounded-lg text-[10px] font-semibold transition-all ${jn==="start"?"bg-[#e8ff00] text-black":i.startFrame?"bg-green-900 text-green-400":"bg-gray-800 text-gray-400 hover:bg-gray-700"}`,title:"Click to select, click again to deselect",children:["START ",i.startFrame&&"✓"]}),s.jsxs("button",{onClick:()=>La(jn==="end"?null:"end"),className:`px-3 py-2 rounded-lg text-[10px] font-semibold transition-all ${jn==="end"?"bg-[#e8ff00] text-black":i.endFrame?"bg-green-900 text-green-400":"bg-gray-800 text-gray-400 hover:bg-gray-700"}`,title:"Click to select, click again to deselect",children:["END ",i.endFrame&&"✓"]}),jn===null&&s.jsx("div",{className:"text-[9px] text-gray-500",children:"Normal → Kling 2.6"}),jn==="start"&&!i.startFrame&&s.jsx("div",{className:"text-[9px] text-gray-500",children:"Transition mode"}),jn==="end"&&!i.startFrame&&s.jsx("div",{className:"text-[9px] text-orange-400",children:"Generate START first!"}),jn==="end"&&i.startFrame&&!i.endFrame&&s.jsx("div",{className:"text-[9px] text-[#e8ff00]",children:"Using START as ref →"})]}),s.jsxs("div",{className:"flex-1 min-w-[280px] flex flex-col gap-2",children:[$r&&i.startFrame&&!je&&s.jsxs("div",{className:"text-[10px] text-gray-500 px-1",children:['Continuing from: "',$r.slice(0,50),'..." - What happens next?']}),js&&xt!==null&&i.startFrame&&s.jsxs("button",{onClick:()=>{Fe(c=>c?`${c}, ${js}`:js),Bs(null)},className:"flex items-center gap-2 px-3 py-2 bg-purple-900/30 border border-purple-500/50 rounded-lg text-left hover:bg-purple-900/50 transition-all group",children:[s.jsx("span",{className:"text-purple-400 text-lg",children:"💡"}),s.jsxs("div",{className:"flex-1 min-w-0",children:[s.jsxs("div",{className:"text-[10px] text-purple-400 font-medium",children:[Ti[xt].name," would:"]}),s.jsxs("div",{className:"text-xs text-gray-300 group-hover:text-white truncate",children:['"',js,'"']})]}),s.jsx("span",{className:"text-[9px] text-purple-500 opacity-0 group-hover:opacity-100 whitespace-nowrap",children:"Click to add →"})]}),xt!==null&&Ti[xt].shotLibrary&&s.jsxs("div",{className:"flex flex-wrap gap-1.5 px-1",children:[s.jsxs("span",{className:"text-[9px] text-gray-500 uppercase mr-1 self-center",children:[Ti[xt].name," shots:"]}),Ti[xt].shotLibrary.slice(0,6).map(c=>s.jsx("button",{onClick:()=>Fe(c.prompt),className:"px-2 py-1 bg-[#2a2a2a] hover:bg-purple-900/30 border border-gray-700 hover:border-purple-500/50 rounded text-[10px] text-gray-400 hover:text-purple-300 transition-all",title:`${c.name}
When: ${c.whenToUse.join(", ")}
Lens: ${c.lens||"varies"}`,children:c.name},c.id)),Ti[xt].shotLibrary.length>6&&s.jsxs("span",{className:"text-[9px] text-gray-600 self-center",children:["+",Ti[xt].shotLibrary.length-6," more"]})]}),s.jsxs("div",{className:"relative",children:[s.jsx("input",{type:"text",value:je,onChange:c=>{Fe(c.target.value),m(c.target.value)},placeholder:$r&&i.startFrame?"What happens next in the scene...":"Describe the scene you imagine...",className:"w-full px-5 py-3.5 bg-[#2a2a2a] border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 text-sm pr-20"}),s.jsx("button",{onClick:()=>bh(!ws),className:`absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-[9px] font-medium transition-all ${ws?"bg-[#e8ff00] text-black":"bg-gray-700 text-gray-400 hover:bg-gray-600"}`,children:ws?"HIDE":"PREVIEW"})]}),_t==="image"&&vt.length>0&&s.jsxs("div",{className:"px-3 py-2 bg-orange-950/50 border border-orange-700/50 rounded-lg",children:[s.jsx("div",{className:"text-[9px] text-orange-400 uppercase mb-1 font-medium",children:"Image Prompt Tips:"}),vt.map((c,b)=>s.jsxs("div",{className:"text-[10px] text-orange-300",children:["• ",c]},b))]}),_t==="video"&&Ss.length>0&&s.jsxs("div",{className:"px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg",children:[s.jsx("div",{className:"text-[9px] text-purple-400 uppercase mb-1 font-medium",children:"Video Prompt Tips:"}),Ss.map((c,b)=>s.jsxs("div",{className:"text-[10px] text-purple-300",children:["• ",c]},b))]}),_t==="video"&&(Un||Fn||kn||On)&&s.jsxs("div",{className:"px-3 py-2 bg-purple-950/30 border border-purple-800/50 rounded-lg",children:[s.jsx("div",{className:"text-[9px] text-purple-400 uppercase mb-1 font-medium",children:"Video Motion:"}),s.jsx("div",{className:"text-[10px] text-purple-200",children:Os()})]}),ws&&s.jsxs("div",{className:"px-3 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg",children:[s.jsx("div",{className:"text-[9px] text-gray-500 uppercase mb-1",children:"Full prompt being sent:"}),s.jsx("div",{className:"text-[11px] text-gray-300 break-words",children:hc()||s.jsx("span",{className:"text-gray-600 italic",children:"Enter a prompt above"})}),!Bn&&s.jsx("div",{className:"text-[9px] text-orange-400 mt-1",children:"Camera settings OFF"})]}),s.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[s.jsxs("button",{onClick:()=>{ge(!0),Ie(!1),v(!1),P(!1),G(!1),se(!1),he(!1),ae(!1)},className:`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${t.length>0?"bg-gray-700 text-white":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,children:[$e.movement,s.jsx("span",{children:"Motion"})]}),_t==="video"&&s.jsxs("button",{onClick:()=>Je(!0),className:`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${Un||Fn||kn||On?"bg-purple-700 text-white":"bg-gradient-to-r from-purple-900/50 to-blue-900/50 text-purple-300 hover:from-purple-800/50 hover:to-blue-800/50 border border-purple-700/50"}`,children:[$e.video,s.jsx("span",{children:"Video Motion"}),(Un||Fn||kn||On)&&s.jsx("span",{className:"w-2 h-2 bg-purple-400 rounded-full animate-pulse"})]}),s.jsxs("button",{onClick:()=>{se(!0),ge(!1),Ie(!1),v(!1),P(!1),G(!1),he(!1),ae(!1)},className:`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${xt!==null?"bg-gray-700 text-white":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,children:[$e.director,s.jsx("span",{children:xt!==null?ln[xt].name:"Director"})]}),s.jsxs("button",{onClick:()=>{ne(!0),ge(!1),Ie(!1),v(!1),P(!1),G(!1),se(!1),he(!1),ae(!1)},className:`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${M?"bg-gradient-to-r from-teal-500 to-cyan-500 text-white":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,title:"Character DNA - consistent character description for shot chaining",children:[s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-4 h-4",children:[s.jsx("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"}),s.jsx("path",{d:"M12 6v2M12 16v2M8 12H6M18 12h-2"}),s.jsx("circle",{cx:"12",cy:"12",r:"3"})]}),s.jsx("span",{children:M?"DNA Set":"Character"})]}),s.jsxs("button",{onClick:()=>{Ge(!0),ge(!1),Ie(!1),v(!1),P(!1),G(!1),se(!1),he(!1),ae(!1),ne(!1),pn(!1),Dn(!1)},className:`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${V.length>0?"bg-gradient-to-r from-orange-500 to-amber-500 text-white":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,title:"Sequence Planner - plan multiple shots before generating",children:[s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-4 h-4",children:[s.jsx("rect",{x:"3",y:"3",width:"7",height:"7",rx:"1"}),s.jsx("rect",{x:"14",y:"3",width:"7",height:"7",rx:"1"}),s.jsx("rect",{x:"3",y:"14",width:"7",height:"7",rx:"1"}),s.jsx("rect",{x:"14",y:"14",width:"7",height:"7",rx:"1"})]}),s.jsx("span",{children:V.length>0?`${V.length} Shots`:"Sequence"})]}),s.jsxs("button",{onClick:()=>{pn(!0),ge(!1),Ie(!1),v(!1),P(!1),G(!1),se(!1),he(!1),ae(!1),ne(!1),Ge(!1),Dn(!1)},className:`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${Zi?"bg-gradient-to-r from-cyan-500 to-blue-500 text-white":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,title:"3D Camera Control - set angle with visual 3D preview",children:[s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-4 h-4",children:[s.jsx("path",{d:"M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"}),s.jsx("circle",{cx:"12",cy:"13",r:"4"})]}),s.jsx("span",{children:"3D Angle"})]}),s.jsxs("button",{onClick:()=>{Dn(!0),ge(!1),Ie(!1),v(!1),P(!1),G(!1),se(!1),he(!1),ae(!1),ne(!1),Ge(!1),pn(!1)},className:`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${Qi?"bg-gradient-to-r from-purple-500 to-pink-500 text-white":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,title:"Batch Generator - generate multiple angles at once",children:[s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-4 h-4",children:[s.jsx("path",{d:"M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"}),s.jsx("polyline",{points:"7.5 4.21 12 6.81 16.5 4.21"}),s.jsx("polyline",{points:"7.5 19.79 7.5 14.6 3 12"}),s.jsx("polyline",{points:"21 12 16.5 14.6 16.5 19.79"}),s.jsx("polyline",{points:"3.27 6.96 12 12.01 20.73 6.96"}),s.jsx("line",{x1:"12",y1:"22.08",x2:"12",y2:"12"})]}),s.jsx("span",{children:"Batch"})]}),s.jsxs("button",{onClick:()=>{ki(!0),ge(!1),Ie(!1),v(!1),P(!1),G(!1),se(!1),he(!1),ae(!1),ne(!1),Ge(!1),pn(!1),Dn(!1)},className:`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${Fr?"bg-gradient-to-r from-amber-500 to-red-500 text-white":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,title:"Movie Shots Library - 2100+ professional film shots",children:[s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-4 h-4",children:[s.jsx("rect",{x:"2",y:"2",width:"20",height:"20",rx:"2.18",ry:"2.18"}),s.jsx("line",{x1:"7",y1:"2",x2:"7",y2:"22"}),s.jsx("line",{x1:"17",y1:"2",x2:"17",y2:"22"}),s.jsx("line",{x1:"2",y1:"12",x2:"22",y2:"12"}),s.jsx("line",{x1:"2",y1:"7",x2:"7",y2:"7"}),s.jsx("line",{x1:"2",y1:"17",x2:"7",y2:"17"}),s.jsx("line",{x1:"17",y1:"17",x2:"22",y2:"17"}),s.jsx("line",{x1:"17",y1:"7",x2:"22",y2:"7"})]}),s.jsx("span",{children:"Shots"})]}),s.jsxs("button",{onClick:()=>{gi(!0),yc()},className:`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${In?"bg-gradient-to-r from-purple-500 to-pink-500 text-white":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,title:"Continue from Video - Extract frame → Close-up → Dialogue → Stitch",children:[s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-4 h-4",children:[s.jsx("polygon",{points:"5 3 19 12 5 21 5 3"}),s.jsx("line",{x1:"19",y1:"5",x2:"19",y2:"19"})]}),s.jsx("span",{children:"Continue"})]}),s.jsxs("button",{onClick:()=>{Oe(!0),kh(),ge(!1),Ie(!1),v(!1),P(!1),G(!1),se(!1),he(!1),ae(!1),ne(!1),Ge(!1),pn(!1),Dn(!1)},className:`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${gt?"bg-gradient-to-r from-yellow-500 to-orange-500 text-black":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,title:"AI Prompt Assistant - describe what you want in simple terms",children:[$e.sparkle,s.jsx("span",{children:"AI"})]}),s.jsxs("button",{onClick:()=>{he(!0),ge(!1),Ie(!1),v(!1),P(!1),G(!1),se(!1),ae(!1)},className:`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${Mn!==null?"bg-gray-700 text-white":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,children:[$e.emotion,s.jsx("span",{children:Mn!==null?Rs[Mn].name:"Emotion"})]}),s.jsxs("button",{onClick:()=>{ae(!0),ge(!1),Ie(!1),v(!1),P(!1),G(!1),se(!1),he(!1)},className:`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${En!==null?"bg-gray-700 text-white":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,children:[$e.shot,s.jsx("span",{children:En!==null?Ps[En].name:"Shot"})]}),s.jsx("div",{className:"w-px h-6 bg-gray-700 mx-1"}),s.jsxs("button",{onClick:()=>{v(!0),ge(!1),Ie(!1),P(!1),G(!1),se(!1),he(!1),ae(!1)},className:`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${Si!==null?"bg-gray-700 text-white":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,children:[$e.style,s.jsx("span",{children:Si!==null?As[Si].name:"Style"})]}),s.jsxs("button",{onClick:()=>{P(!0),ge(!1),Ie(!1),v(!1),G(!1),se(!1),he(!1),ae(!1)},className:`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${wi!==null?"bg-gray-700 text-white":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,children:[$e.light,s.jsx("span",{children:wi!==null?Cs[wi].name:"Light"})]}),s.jsxs("button",{onClick:()=>{G(!0),ge(!1),Ie(!1),v(!1),P(!1),se(!1),he(!1),ae(!1),_e(!1),Be(!1),xe(!1),Se(!1)},className:`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${Mi!==null?"bg-gray-700 text-white":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,children:[$e.weather,s.jsx("span",{children:Mi!==null?Ns[Mi].name:"Weather"})]}),s.jsx("div",{className:"w-px h-6 bg-gray-700 mx-1"}),s.jsxs("button",{onClick:()=>{_e(!0),ge(!1),Ie(!1),v(!1),P(!1),G(!1),se(!1),he(!1),ae(!1),Be(!1),xe(!1),Se(!1)},className:`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${ti!==null?"bg-gray-700 text-white":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,children:[$e.framing,s.jsx("span",{children:ti!==null?Ls[ti].name:"Framing"})]}),s.jsxs("button",{onClick:()=>{Be(!0),ge(!1),Ie(!1),v(!1),P(!1),G(!1),se(!1),he(!1),ae(!1),_e(!1),xe(!1),Se(!1)},className:`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${ni!==null?"bg-gray-700 text-white":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,children:[$e.setDesign,s.jsx("span",{children:ni!==null?Ds[ni].name:"Set"})]}),s.jsxs("button",{onClick:()=>{xe(!0),ge(!1),Ie(!1),v(!1),P(!1),G(!1),se(!1),he(!1),ae(!1),_e(!1),Be(!1),Se(!1)},className:`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${Ei!==null?"bg-gray-700 text-white":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,children:[$e.palette,s.jsx("span",{children:Ei!==null?Is[Ei].name:"Colors"})]}),s.jsxs("button",{onClick:()=>{Se(!0),ge(!1),Ie(!1),v(!1),P(!1),G(!1),se(!1),he(!1),ae(!1),_e(!1),Be(!1),xe(!1)},className:`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all ${ii!==null?"bg-gray-700 text-white":"bg-[#2a2a2a] text-gray-400 hover:bg-gray-700"}`,children:[$e.character,s.jsx("span",{children:ii!==null?Us[ii].name:"Costume"})]}),s.jsx("div",{className:"w-px h-6 bg-gray-700 mx-1"}),s.jsxs("button",{onClick:()=>{const c=_t==="image"?Oa.image.aspectRatios:Oa["kling-2.6"].aspectRatios,R=(c.indexOf(zn)+1)%c.length;cc(c[R])},className:"h-8 px-3 bg-[#2a2a2a] rounded-lg text-xs text-gray-400 hover:bg-gray-700 transition-colors flex items-center gap-1.5",children:[$e.aspectRatio,s.jsx("span",{children:zn})]}),_t==="image"&&s.jsxs("button",{onClick:()=>{const c=Oa.image.resolutions,R=(c.indexOf(rr)+1)%c.length;Th(c[R])},className:"h-8 px-3 bg-[#2a2a2a] rounded-lg text-xs text-gray-400 hover:bg-gray-700 transition-colors flex items-center gap-1.5",children:[s.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"w-4 h-4",children:[s.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2"}),s.jsx("path",{d:"M3 9h18M9 3v18"})]}),s.jsx("span",{children:rr})]}),_t==="video"&&s.jsxs("button",{onClick:()=>y(i.duration===5?10:5),className:"h-8 px-3 bg-[#2a2a2a] rounded-lg text-xs text-gray-400 hover:bg-gray-700 transition-colors flex items-center gap-1.5",children:[$e.clock,s.jsxs("span",{children:[i.duration,"s"]})]}),_t==="video"&&s.jsxs("div",{className:"relative group",children:[s.jsx("button",{className:`h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${sr()==="seedance-1.5"?"bg-purple-500/20 text-purple-400 border border-purple-500/30":sr()==="kling-o1"?"bg-blue-500/20 text-blue-400 border border-blue-500/30":"bg-amber-500/20 text-amber-400 border border-amber-500/30"}`,children:sr()==="seedance-1.5"?"🗣️ Seedance":sr()==="kling-o1"?"🎬 Kling O1":"🎥 Kling 2.6"}),s.jsxs("div",{className:"absolute bottom-full left-0 mb-2 w-64 p-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50",children:[s.jsx("div",{className:"font-medium text-white mb-1",children:"Model Auto-Selection"}),s.jsx("div",{className:"text-gray-400",children:fu({startFrame:i.startFrame,endFrame:i.endFrame,motionPrompt:i.motionPrompt})}),s.jsxs("div",{className:"mt-2 pt-2 border-t border-gray-700 text-gray-500",children:[s.jsxs("div",{children:["• ",s.jsx("span",{className:"text-purple-400",children:"Seedance"}),": Dialogue/Lip-sync"]}),s.jsxs("div",{children:["• ",s.jsx("span",{className:"text-blue-400",children:"Kling O1"}),": Start→End transitions"]}),s.jsxs("div",{children:["• ",s.jsx("span",{className:"text-amber-400",children:"Kling 2.6"}),": General action"]})]})]})]}),s.jsxs("button",{onClick:()=>Mh((Fa+1)%ja.length),className:"h-8 px-3 bg-[#2a2a2a] rounded-lg text-xs text-gray-400 hover:bg-gray-700 transition-colors flex items-center gap-1.5",children:[$e.speed,s.jsx("span",{children:ja[Fa].name})]}),s.jsxs("div",{className:"flex items-center gap-1 ml-1 text-gray-500",children:[s.jsx("button",{onClick:()=>ec(Math.max(1,Da-1)),className:"w-6 h-6 rounded-md bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center transition-colors",children:$e.minus}),s.jsxs("span",{className:"text-xs font-medium w-6 text-center",children:[Da,"/4"]}),s.jsx("button",{onClick:()=>ec(Math.min(4,Da+1)),className:"w-6 h-6 rounded-md bg-[#2a2a2a] hover:bg-gray-700 flex items-center justify-center transition-colors",children:$e.plus})]})]})]}),s.jsxs("div",{className:"flex items-center gap-3",children:[s.jsx("div",{className:"cursor-pointer group",children:s.jsx("div",{onClick:()=>{const c=document.createElement("input");c.type="file",c.accept="image/*",c.onchange=async b=>{const R=b.target.files?.[0];if(!R)return;Le("Uploading start frame...");const X=new FormData;X.append("file",R);try{const ie=await(await fetch("/api/cinema/upload",{method:"POST",body:X})).json();ie.url?(u(ie.url),Le("Start frame uploaded!")):Le("Upload failed")}catch{Le("Upload failed")}setTimeout(()=>Le(null),1500)},c.click()},className:`w-16 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${i.startFrame?"border-transparent":"border-gray-600 hover:border-gray-400 group-hover:bg-gray-800/30"}`,children:i.startFrame?s.jsxs("div",{className:"relative w-full h-full",children:[s.jsx("img",{src:i.startFrame,className:"w-full h-full object-cover rounded-lg"}),s.jsx("button",{onClick:c=>{c.stopPropagation(),u("")},className:"absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]",children:"x"})]}):s.jsxs(s.Fragment,{children:[s.jsx("span",{className:"text-gray-500",children:$e.plus}),s.jsx("span",{className:"text-[9px] text-gray-500 uppercase font-medium mt-1",children:"START"}),s.jsx("span",{className:"text-[9px] text-gray-500 uppercase font-medium",children:"FRAME"})]})})}),s.jsx("div",{className:"cursor-pointer group",children:s.jsx("div",{onClick:()=>{const c=document.createElement("input");c.type="file",c.accept="image/*",c.onchange=async b=>{const R=b.target.files?.[0];if(!R)return;Le("Uploading end frame...");const X=new FormData;X.append("file",R);try{const ie=await(await fetch("/api/cinema/upload",{method:"POST",body:X})).json();ie.url?(f(ie.url),Le("End frame uploaded!")):Le("Upload failed")}catch{Le("Upload failed")}setTimeout(()=>Le(null),1500)},c.click()},className:`w-16 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${i.endFrame?"border-transparent":"border-gray-600 hover:border-gray-400 group-hover:bg-gray-800/30"}`,children:i.endFrame?s.jsxs("div",{className:"relative w-full h-full",children:[s.jsx("img",{src:i.endFrame,className:"w-full h-full object-cover rounded-lg"}),s.jsx("button",{onClick:c=>{c.stopPropagation(),f("")},className:"absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]",children:"x"})]}):s.jsxs(s.Fragment,{children:[s.jsx("span",{className:"text-gray-500",children:$e.plus}),s.jsx("span",{className:"text-[9px] text-gray-500 uppercase font-medium mt-1",children:"END"}),s.jsx("span",{className:"text-[9px] text-gray-500 uppercase font-medium",children:"FRAME"})]})})}),s.jsxs("div",{className:"cursor-pointer group",children:[s.jsx("div",{onClick:()=>!gn&&dc.current?.click(),className:`w-16 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${gn?"border-purple-500 border-solid":"border-gray-600 hover:border-purple-400 group-hover:bg-purple-900/10"}`,children:gn?s.jsxs("div",{className:"relative w-full h-full",children:[s.jsx("img",{src:gn,className:"w-full h-full object-cover rounded-lg"}),s.jsx("button",{onClick:c=>{c.stopPropagation(),Wr(null)},className:"absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]",children:"x"})]}):s.jsxs(s.Fragment,{children:[s.jsx("span",{className:"text-purple-400",children:$e.plus}),s.jsx("span",{className:"text-[9px] text-purple-400 uppercase font-medium mt-1",children:"REF"}),s.jsx("span",{className:"text-[9px] text-purple-400 uppercase font-medium",children:"CHAR"})]})}),s.jsx("input",{type:"file",accept:"image/*",className:"hidden",ref:dc,onChange:async c=>{const b=c.target.files?.[0];if(!b)return;console.log("REF CHAR upload started:",b.name),Le("Uploading reference...");const R=new FormData;R.append("file",b);try{const re=await(await fetch("/api/cinema/upload",{method:"POST",body:R})).json();console.log("Upload response:",re),re.url?(Wr(re.url),Le("Reference uploaded!")):Le("Upload failed: "+(re.error||"Unknown"))}catch(X){console.error("Upload error:",X),Le("Upload failed")}setTimeout(()=>Le(null),2e3),c.target.value=""}})]}),Ot.length>0&&s.jsxs("div",{className:"flex items-center gap-1",children:[Ot.slice(0,3).map((c,b)=>s.jsxs("div",{className:"relative w-10 h-10 group",children:[s.jsx("img",{src:c.url,className:"w-full h-full object-cover rounded-lg border border-yellow-500/50"}),s.jsx("button",{onClick:()=>pc(b),className:"absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",children:s.jsx("span",{className:"text-white text-[8px]",children:"x"})})]},b)),Ot.length>3&&s.jsxs("div",{className:"w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center text-yellow-400 text-[10px]",children:["+",Ot.length-3]})]}),s.jsx("div",{className:"cursor-pointer",children:s.jsxs("div",{onClick:()=>{const c=document.createElement("input");c.type="file",c.accept="image/*",c.onchange=async b=>{const R=b.target.files?.[0];if(!R||Ot.length>=7)return;console.log("Additional ref upload started:",R.name),Le("Uploading ref image...");const X=new FormData;X.append("file",R);try{const ie=await(await fetch("/api/cinema/upload",{method:"POST",body:X})).json();console.log("Upload response:",ie),ie.url?(vi(ke=>[...ke,{url:ie.url,description:null}]),Le("Reference added!")):Le("Upload failed: "+(ie.error||"Unknown"))}catch(re){console.error("Upload error:",re),Le("Upload failed")}setTimeout(()=>Le(null),2e3)},c.click()},className:"w-10 h-16 rounded-lg border border-dashed border-yellow-500/30 hover:border-yellow-500/60 flex flex-col items-center justify-center text-yellow-400/60 hover:text-yellow-400 transition-all",children:[s.jsx("span",{className:"text-lg",children:"+"}),s.jsx("span",{className:"text-[8px]",children:"REF"})]})})]}),s.jsxs("div",{className:"flex items-center gap-1",children:[s.jsxs("button",{onClick:()=>Ie(!0),className:`h-16 px-4 rounded-xl flex items-center gap-3 transition-all ${Bn?"bg-[#2a2a2a] hover:bg-gray-700":"bg-[#1a1a1a] opacity-50 hover:opacity-70"}`,children:[s.jsx("div",{className:`w-8 h-8 rounded-lg flex items-center justify-center ${Bn?"bg-gray-700":"bg-gray-800"}`,children:$e.camera}),s.jsxs("div",{className:"text-left",children:[s.jsx("div",{className:`text-xs font-medium ${Bn?"text-white":"text-gray-500"}`,children:on[Hr]?.name||"Camera"}),s.jsx("div",{className:"text-[10px] text-gray-500",children:Bn?`${Fs[Es]}mm, ${ks[Ts]}`:"OFF - not in prompt"})]})]}),s.jsx("button",{onClick:()=>yh(!Bn),className:`h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${Bn?"bg-green-600 text-white hover:bg-green-500":"bg-gray-700 text-gray-400 hover:bg-gray-600"}`,title:Bn?"Camera settings ON - click to disable":"Camera settings OFF - click to enable",children:Bn?"ON":"OFF"})]}),s.jsx("button",{onClick:Jh,disabled:o,className:`h-16 px-8 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${o?"bg-gray-700 text-gray-400":"bg-[#e8ff00] text-black hover:bg-[#f0ff4d] shadow-lg shadow-[#e8ff00]/20"}`,children:o?s.jsx("span",{className:"w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"}):s.jsxs(s.Fragment,{children:[s.jsx("span",{children:_t==="image"?"GENERATE IMAGE":"GENERATE VIDEO"}),s.jsxs("span",{className:"opacity-60 flex items-center gap-1",children:[$e.sparkle," ",_t==="image"?3:cu]})]})}),(i.videoUrl||e.length>0)&&!o&&s.jsxs("button",{onClick:()=>{if(i.videoUrl)Xr(!0);else if(e.length>0){const c=e[e.length-1];c.startFrame&&(u(c.startFrame),bi("image"),Ga(je||c.motionPrompt),Fe(""))}},className:"h-16 px-6 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 bg-[#2a2a2a] text-white hover:bg-gray-700 border border-gray-700",children:[s.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",className:"w-5 h-5",children:s.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})}),s.jsx("span",{children:"NEXT SHOT"})]})]})})]})})}export{a_ as CinemaStudio};
