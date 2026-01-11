/* empty css                                  */
import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BJ9NHA2f.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DznVaL5_.mjs';
export { renderers } from '../renderers.mjs';

const $$Register = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Register" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen flex items-center justify-center p-4"> <div class="w-full max-w-md"> <!-- Logo --> <div class="text-center mb-8"> <h1 class="text-3xl font-bold text-vs-accent mb-2">Video Studio</h1> <p class="text-white/50">Create your account</p> </div> <!-- Register Form --> <div class="bg-vs-card border border-vs-border rounded-xl p-8"> <h2 class="text-xl font-semibold mb-6">Create Account</h2> <form id="registerForm" class="space-y-4"> <div> <label for="username" class="block text-sm text-white/70 mb-2">Username</label> <input type="text" id="username" name="username" required pattern="[a-zA-Z0-9_]{3,20}" class="w-full px-4 py-3 bg-vs-dark border border-vs-border rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-vs-accent transition-colors" placeholder="Choose a username"> <p class="text-xs text-white/40 mt-1">3-20 characters, letters, numbers, underscores</p> </div> <div> <label for="email" class="block text-sm text-white/70 mb-2">Email</label> <input type="email" id="email" name="email" required class="w-full px-4 py-3 bg-vs-dark border border-vs-border rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-vs-accent transition-colors" placeholder="your@email.com"> </div> <div> <label for="password" class="block text-sm text-white/70 mb-2">Password</label> <input type="password" id="password" name="password" required minlength="6" class="w-full px-4 py-3 bg-vs-dark border border-vs-border rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-vs-accent transition-colors" placeholder="At least 6 characters"> </div> <div> <label for="confirmPassword" class="block text-sm text-white/70 mb-2">Confirm Password</label> <input type="password" id="confirmPassword" name="confirmPassword" required class="w-full px-4 py-3 bg-vs-dark border border-vs-border rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-vs-accent transition-colors" placeholder="Confirm your password"> </div> <div id="errorMessage" class="hidden text-red-400 text-sm py-2"></div> <button type="submit" class="w-full py-3 bg-vs-accent hover:bg-vs-accent-hover text-white font-medium rounded-lg transition-colors">
Create Account
</button> </form> <div class="mt-6 text-center text-white/50">
Already have an account?
<a href="/login" class="text-vs-accent hover:underline">Sign in</a> </div> </div> </div> </div> ` })} ${renderScript($$result, "C:/Users/yodes/Documents/n8n/video-studio/src/pages/register.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/yodes/Documents/n8n/video-studio/src/pages/register.astro", void 0);

const $$file = "C:/Users/yodes/Documents/n8n/video-studio/src/pages/register.astro";
const $$url = "/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Register,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
