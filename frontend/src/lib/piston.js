// Judge0 CE — free public API, no key required
// Docs: https://ce.judge0.com/

const JUDGE0_API = "https://ce.judge0.com";

// Judge0 language IDs
const LANGUAGE_IDS = {
  javascript: 93, // Node.js 18.15.0
  python: 71,     // Python 3.8.1
  java: 62,       // Java 13.0.1
};

/**
 * @param {string} language - programming language
 * @param {string} code - source code to execute
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const languageId = LANGUAGE_IDS[language];

    if (!languageId) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    // Judge0 requires source_code to be base64-encoded
    const encodedCode = btoa(unescape(encodeURIComponent(code)));

    // Submit code — use ?wait=true for synchronous result (no polling needed)
    const response = await fetch(`${JUDGE0_API}/submissions?base64_encoded=true&wait=true&fields=stdout,stderr,status,compile_output`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_code: encodedCode,
        language_id: languageId,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        success: false,
        error: `Judge0 error ${response.status}: ${errText}`,
      };
    }

    const data = await response.json();

    // Decode base64 fields
    const decode = (b64) => (b64 ? decodeURIComponent(escape(atob(b64))) : "");

    const stdout = decode(data.stdout);
    const stderr = decode(data.stderr);
    const compileOutput = decode(data.compile_output);
    const statusId = data.status?.id;

    // Status IDs: 3 = Accepted (success), 6 = Compilation Error, others = runtime/TLE etc.
    if (statusId === 3) {
      return {
        success: true,
        output: stdout || "No output",
      };
    }

    // Compilation error
    if (statusId === 6) {
      return {
        success: false,
        error: compileOutput || "Compilation error",
      };
    }

    // Runtime error or other failure
    const errorMsg = stderr || compileOutput || data.status?.description || "Execution failed";
    return {
      success: false,
      output: stdout || "",
      error: errorMsg,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}

