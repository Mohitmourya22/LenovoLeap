import { ENV } from "../lib/env.js";

function generateOfflineAiAssist({ mode = "explain", code = "", language = "javascript" }) {
  const codeLines = code.split("\n");
  const hasNestedLoops =
    /for\s*\(.*for\s*\(|while\s*\(.*while\s*\(|for\s*\(.*while\s*\(|while\s*\(.*for\s*\(/s.test(code) ||
    /for\s+.*in\s+.*:[\s\S]*for\s+.*in\s+.*:/s.test(code);
  const hasSingleLoop = /for\s*\(|while\s*\(|\.forEach|\.map|for\s+.*in\s+/s.test(code);
  const hasMapOrSet = /new\s+Map|new\s+Set|\{\}|dict\(|set\(|map\.set|map\.has/s.test(code);
  const hasRecursion = /\b([a-zA-Z0-9_$]+)\s*\([^)]*\)\s*\{[\s\S]*\1\s*\(/.test(code);

  let timeComplexity = "O(1)";
  let spaceComplexity = "O(1)";
  let complexityReason = "Constant time operations without variable-length loops.";

  if (hasNestedLoops) {
    timeComplexity = "O(n²)";
    complexityReason = "Nested iteration across input elements scales quadratically.";
  } else if (hasSingleLoop) {
    timeComplexity = "O(n)";
    complexityReason = "Single linear traversal through the collection.";
  } else if (hasRecursion) {
    timeComplexity = "O(2ⁿ) or O(n)";
    complexityReason = "Recursive call stack branching detected. Ensure memoization is in place.";
  }

  if (hasMapOrSet) {
    spaceComplexity = "O(n)";
    complexityReason += " Auxiliary hash-based lookup structure scales proportionally with input size.";
  }

  switch (mode) {
    case "complexity":
      return `📊 **Algorithmic Complexity Analysis**

⏱️ **Time Complexity**: \`${timeComplexity}\`
• ${complexityReason}

💾 **Space Complexity**: \`${spaceComplexity}\`
• Memory footprint is determined by data structures instantiated during execution.

💡 **Interviewer Insight**:
Discussing the trade-off between time complexity and space complexity (e.g. trading O(n) auxiliary space for O(n) runtime instead of an O(1) space O(n²) brute force) is the exact quality top tech interviewers look for.`;

    case "optimize":
      return `⚡ **Optimization Recommendations**

1. **Algorithmic Optimization**:
   ${hasMapOrSet ? "✓ Excellent choice using a Hash Map/Set for O(1) lookups." : "• Replace nested search loops with a Hash Map or Set to lower runtime from O(n²) to O(n)."}

2. **Early Boundary Exit**:
   • Verify boundary conditions upfront (null/empty checks, size < 2) to skip unnecessary iterations.

3. **Memory Optimization**:
   • If memory footprint is constrained, evaluate if a two-pointer or in-place sorting technique can eliminate auxiliary collections.

4. **Edge Cases to Guard**:
   • Empty inputs or single-element inputs
   • Negative integers and zeroes
   • Duplicates and large arrays triggering recursion/call stack limits`;

    case "hint":
      return `💡 **Progressive Interview Hints & Questions**

• **Hint 1**: What happens if the input has no valid solution, or multiple solutions? Always clarify expectations.
• **Hint 2**: If comparing every item to every other item with two loops, ask: *"Can I store items I've already seen in a lookup table?"*
• **Hint 3**: When looking for \`target - current\`, a hash map lets you test for the complement's existence in O(1) average time!
• **Interviewer Question to Ask**: *"How would your solution behave if the input array had 10 million elements and memory was tightly capped?"*`;

    case "explain":
    default:
      return `🔍 **Code Explanation & Logic Walkthrough**

• **Language**: ${language.toUpperCase()} (${codeLines.length} lines)
• **Key Construct**: ${hasMapOrSet ? "Hash Map / Lookup strategy" : hasSingleLoop ? "Linear Traversal loop" : "Sequential logical operations"}
• **Logic Breakdown**:
  1. Initializes auxiliary data structures and validates parameters.
  2. Iterates over elements, evaluating problem constraints at each step.
  3. Yields optimal return value or index coordinates upon meeting matching criteria.
• **Readability**: Code structure follows clean idiomatic conventions suitable for peer review.`;
  }
}

export async function postAiAssist(req, res) {
  try {
    const { prompt = "", mode = "explain", code = "", language = "javascript" } = req.body;

    if (!ENV.OPENAI_API_KEY) {
      const fallbackResult = generateOfflineAiAssist({ mode, prompt, code, language });
      return res.status(200).json({ result: fallbackResult, source: "heuristic" });
    }

    const systemPrompt =
      "You are an expert technical interview co-pilot. Give structured, concise, practical, interview-ready guidance in formatted markdown. Return plain text only.";

    try {
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
        throw new Error(`OpenAI error status: ${response.status}`);
      }

      const data = await response.json();
      const result = data.choices?.[0]?.message?.content || generateOfflineAiAssist({ mode, prompt, code, language });

      return res.status(200).json({ result, source: "openai" });
    } catch (aiError) {
      console.warn("OpenAI API call failed, falling back to heuristic engine:", aiError.message);
      const fallbackResult = generateOfflineAiAssist({ mode, prompt, code, language });
      return res.status(200).json({ result: fallbackResult, source: "heuristic-fallback" });
    }
  } catch (error) {
    console.error("Error in postAiAssist controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}