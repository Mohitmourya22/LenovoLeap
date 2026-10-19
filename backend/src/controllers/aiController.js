import { ENV } from "../lib/env.js";

export async function postAiAssist(req, res) {
  try {
    const { prompt, mode = "explain", code = "", language = "javascript" } = req.body;

    if (!ENV.OPENAI_API_KEY) {
      return res.status(200).json({
        result: `OpenAI is not configured. Requested mode: ${mode}.\n\nPrompt: ${prompt}`,
      });
    }

    const systemPrompt =
      "You are an interview coding assistant. Give concise, practical guidance. Return plain text only.";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Mode: ${mode}\nLanguage: ${language}\nPrompt: ${prompt}\n\nCode:\n${code}`,
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "No response from OpenAI.";

    res.status(200).json({ result });
  } catch (error) {
    console.error("Error in postAiAssist controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}