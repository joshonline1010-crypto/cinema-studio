import { e as createComponent, f as createAstro, p as renderComponent, r as renderTemplate, m as maybeRenderHead, ai as renderSlot } from './astro/server_D9cEOE7x.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from './BaseLayout_COul5jZt.mjs';

const $$Astro = createAstro();
const $$DashboardLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashboardLayout;
  const { title } = Astro2.props;
  const user = Astro2.locals.user;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen flex flex-col"> <!-- Header --> <header class="bg-vs-card border-b border-vs-border px-6 py-4 flex items-center justify-between"> <div class="flex items-center gap-4"> <a href="/dashboard" class="text-xl font-bold text-vs-accent">
Video Studio
</a> </div> <div class="flex items-center gap-4"> <span class="text-white/60">
Hey, <span class="text-white">${user?.username}</span> </span> <a href="/insights" class="px-3 py-1.5 text-sm text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1"> <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"> <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path> </svg>
Insights
</a> <a href="/settings" class="px-3 py-1.5 text-sm text-white/70 hover:text-white transition-colors">
Settings
</a> <a href="/api/auth/logout" class="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 transition-colors">
Logout
</a> </div> </header> <!-- Main Content --> <main class="flex-1"> ${renderSlot($$result2, $$slots["default"])} </main> </div> ` })}`;
}, "C:/Users/yodes/Documents/n8n/video-studio/src/layouts/DashboardLayout.astro", void 0);

export { $$DashboardLayout as $ };
