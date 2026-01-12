import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_D36LV4Rf.mjs';
import { manifest } from './manifest_C_1c8yNj.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/ai/chat.astro.mjs');
const _page2 = () => import('./pages/api/ai/prompt.astro.mjs');
const _page3 = () => import('./pages/api/auth/login.astro.mjs');
const _page4 = () => import('./pages/api/auth/logout.astro.mjs');
const _page5 = () => import('./pages/api/auth/register.astro.mjs');
const _page6 = () => import('./pages/api/chat/send.astro.mjs');
const _page7 = () => import('./pages/api/cinema/compress.astro.mjs');
const _page8 = () => import('./pages/api/cinema/extract-frame.astro.mjs');
const _page9 = () => import('./pages/api/cinema/generate.astro.mjs');
const _page10 = () => import('./pages/api/cinema/plan.astro.mjs');
const _page11 = () => import('./pages/api/cinema/stitch.astro.mjs');
const _page12 = () => import('./pages/api/cinema/upload.astro.mjs');
const _page13 = () => import('./pages/api/cinema/vision.astro.mjs');
const _page14 = () => import('./pages/api/feedback/like.astro.mjs');
const _page15 = () => import('./pages/api/files/_---path_.astro.mjs');
const _page16 = () => import('./pages/api/insights.astro.mjs');
const _page17 = () => import('./pages/api/n8n/executions.astro.mjs');
const _page18 = () => import('./pages/api/preferences/upload.astro.mjs');
const _page19 = () => import('./pages/api/preferences.astro.mjs');
const _page20 = () => import('./pages/api/projects/migrate.astro.mjs');
const _page21 = () => import('./pages/api/projects/_projectid_/files.astro.mjs');
const _page22 = () => import('./pages/api/projects/_projectid_/open-folder.astro.mjs');
const _page23 = () => import('./pages/api/projects/_projectid_/state.astro.mjs');
const _page24 = () => import('./pages/api/projects/_projectid_/upload-ref.astro.mjs');
const _page25 = () => import('./pages/api/projects/_projectid_/workflows.astro.mjs');
const _page26 = () => import('./pages/api/projects/_projectid_.astro.mjs');
const _page27 = () => import('./pages/api/projects.astro.mjs');
const _page28 = () => import('./pages/api/styles.astro.mjs');
const _page29 = () => import('./pages/api/upload.astro.mjs');
const _page30 = () => import('./pages/cinema.astro.mjs');
const _page31 = () => import('./pages/dashboard.astro.mjs');
const _page32 = () => import('./pages/insights.astro.mjs');
const _page33 = () => import('./pages/login.astro.mjs');
const _page34 = () => import('./pages/register.astro.mjs');
const _page35 = () => import('./pages/settings.astro.mjs');
const _page36 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/api/ai/chat.ts", _page1],
    ["src/pages/api/ai/prompt.ts", _page2],
    ["src/pages/api/auth/login.ts", _page3],
    ["src/pages/api/auth/logout.ts", _page4],
    ["src/pages/api/auth/register.ts", _page5],
    ["src/pages/api/chat/send.ts", _page6],
    ["src/pages/api/cinema/compress.ts", _page7],
    ["src/pages/api/cinema/extract-frame.ts", _page8],
    ["src/pages/api/cinema/generate.ts", _page9],
    ["src/pages/api/cinema/plan.ts", _page10],
    ["src/pages/api/cinema/stitch.ts", _page11],
    ["src/pages/api/cinema/upload.ts", _page12],
    ["src/pages/api/cinema/vision.ts", _page13],
    ["src/pages/api/feedback/like.ts", _page14],
    ["src/pages/api/files/[...path].ts", _page15],
    ["src/pages/api/insights/index.ts", _page16],
    ["src/pages/api/n8n/executions.ts", _page17],
    ["src/pages/api/preferences/upload.ts", _page18],
    ["src/pages/api/preferences/index.ts", _page19],
    ["src/pages/api/projects/migrate.ts", _page20],
    ["src/pages/api/projects/[projectId]/files.ts", _page21],
    ["src/pages/api/projects/[projectId]/open-folder.ts", _page22],
    ["src/pages/api/projects/[projectId]/state.ts", _page23],
    ["src/pages/api/projects/[projectId]/upload-ref.ts", _page24],
    ["src/pages/api/projects/[projectId]/workflows.ts", _page25],
    ["src/pages/api/projects/[projectId].ts", _page26],
    ["src/pages/api/projects/index.ts", _page27],
    ["src/pages/api/styles/index.ts", _page28],
    ["src/pages/api/upload.ts", _page29],
    ["src/pages/cinema.astro", _page30],
    ["src/pages/dashboard.astro", _page31],
    ["src/pages/insights.astro", _page32],
    ["src/pages/login.astro", _page33],
    ["src/pages/register.astro", _page34],
    ["src/pages/settings.astro", _page35],
    ["src/pages/index.astro", _page36]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///C:/Users/yodes/Documents/n8n/video-studio/dist/client/",
    "server": "file:///C:/Users/yodes/Documents/n8n/video-studio/dist/server/",
    "host": true,
    "port": 3000,
    "assets": "_astro",
    "experimentalStaticHeaders": false
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
