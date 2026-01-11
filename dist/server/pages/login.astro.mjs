/* empty css                                  */
import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BJ9NHA2f.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DznVaL5_.mjs';
export { renderers } from '../renderers.mjs';

const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Login" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen flex items-center justify-center p-4"> <div class="w-full max-w-md"> <!-- Logo --> <div class="text-center mb-8"> <h1 class="text-3xl font-bold text-vs-accent mb-2">Video Studio</h1> <p class="text-white/50">AI-powered video generation</p> </div> <!-- Login Form --> <div class="bg-vs-card border border-vs-border rounded-xl p-8"> <h2 class="text-xl font-semibold mb-6">Sign In</h2> <form id="loginForm" class="space-y-4"> <div> <label for="username" class="block text-sm text-white/70 mb-2">Username</label> <input type="text" id="username" name="username" required class="w-full px-4 py-3 bg-vs-dark border border-vs-border rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-vs-accent transition-colors" placeholder="Enter your username"> </div> <div> <label for="password" class="block text-sm text-white/70 mb-2">Password</label> <input type="password" id="password" name="password" required class="w-full px-4 py-3 bg-vs-dark border border-vs-border rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-vs-accent transition-colors" placeholder="Enter your password"> </div> <div id="errorMessage" class="hidden text-red-400 text-sm py-2"></div> <button type="submit" class="w-full py-3 bg-vs-accent hover:bg-vs-accent-hover text-white font-medium rounded-lg transition-colors">
Sign In
</button> </form> <div class="mt-6 text-center text-white/50">
Don't have an account?
<a href="/register" class="text-vs-accent hover:underline">Create one</a> </div> </div> <!-- Demo credentials --> <div class="mt-4 text-center text-white/40 text-sm">
Demo: admin / admin123
</div> </div> </div> ` })} ${renderScript($$result, "C:/Users/yodes/Documents/n8n/video-studio/src/pages/login.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/yodes/Documents/n8n/video-studio/src/pages/login.astro", void 0);

const $$file = "C:/Users/yodes/Documents/n8n/video-studio/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
