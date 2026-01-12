import { b as buildContextString, A as AI_SYSTEM_PROMPT } from '../../../chunks/aiPromptSystem_DUfgpd9k.mjs';
export { renderers } from '../../../renderers.mjs';

const OLLAMA_URL = "http://localhost:11434/api/generate";
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { userInput, context, model = "mistral" } = body;
    if (!userInput) {
      return new Response(JSON.stringify({ error: "userInput is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const contextString = buildContextString(context || { mode: "image" });
    const fullPrompt = `${contextString}

USER REQUEST: ${userInput}

Output ONLY the ${context?.mode || "image"} prompt, nothing else:`;
    console.log("AI Prompt Request:", { userInput, context, model });
    const ollamaResponse = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt: fullPrompt,
        system: AI_SYSTEM_PROMPT,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9
        }
      })
    });
    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error("Ollama error:", ollamaResponse.status, errorText);
      if (ollamaResponse.status === 0 || errorText.includes("ECONNREFUSED")) {
        return new Response(JSON.stringify({
          error: "Ollama is not running. Start it with: ollama serve",
          details: errorText
        }), {
          status: 503,
          headers: { "Content-Type": "application/json" }
        });
      }
      return new Response(JSON.stringify({
        error: `Ollama error: ${ollamaResponse.status}`,
        details: errorText
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const data = await ollamaResponse.json();
    const generatedPrompt = data.response?.trim() || "";
    console.log("AI Generated Prompt:", generatedPrompt);
    return new Response(JSON.stringify({
      prompt: generatedPrompt,
      model,
      mode: context?.mode || "image"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("AI Prompt API error:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return new Response(JSON.stringify({
        error: "Cannot connect to Ollama. Make sure Ollama is running.",
        details: 'Run "ollama serve" in a terminal to start Ollama.'
      }), {
        status: 503,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const GET = async () => {
  try {
    const response = await fetch("http://localhost:11434/api/tags", {
      method: "GET"
    });
    if (!response.ok) {
      return new Response(JSON.stringify({
        status: "error",
        message: "Ollama not responding"
      }), {
        status: 503,
        headers: { "Content-Type": "application/json" }
      });
    }
    const data = await response.json();
    const models = data.models?.map((m) => m.name) || [];
    return new Response(JSON.stringify({
      status: "ok",
      models,
      hasMistral: models.some((m) => m.includes("mistral"))
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: "error",
      message: 'Cannot connect to Ollama. Run "ollama serve" to start.'
    }), {
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
