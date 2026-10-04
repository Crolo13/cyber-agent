import { Ollama } from "ollama";
import { Agent, fetch as undiciFetch } from "undici";
import { analyzeLogin } from "./tools/analyzeLogin.js";

const dispatcher = new Agent({
  headersTimeout: 600000,
  bodyTimeout: 600000,
});

const customFetch = (url, options = {}) => {
  return undiciFetch(url, {
    ...options,
    dispatcher,
  });
};

const ollama = new Ollama({
  host: "http://127.0.0.1:11434",
  fetch: customFetch,
});

const tools = [
  {
    type: "function",
    function: {
      name: "analyze_login",
      description:
        "Analyze failed login attempts and determine whether the login activity appears suspicious.",
      parameters: {
        type: "object",
        properties: {
          username: {
            type: "string",
            description: "Username associated with the login attempts.",
          },
          failedAttempts: {
            type: "number",
            description: "Number of failed login attempts.",
          },
          ipAddress: {
            type: "string",
            description: "IP address associated with the login attempts.",
          },
        },
        required: ["failedAttempts"],
      },
    },
  },
];

export async function runAgent(userMessage) {
  console.log("runAgent started");
  console.log("User message:", userMessage);

  const messages = [
    {
      role: "system",
      content: `
You are a cybersecurity assistant that analyzes failed login activity.

When the user gives you information about failed login attempts,
use the analyze_login tool.

After receiving the tool result, explain:

- the risk level
- why the activity may be suspicious
- whether it could indicate brute-force behavior
- what should be investigated next

Do not say an attack definitely occurred unless there is enough evidence.

Keep the response clear and concise.
`,
    },
    {
      role: "user",
      content: userMessage,
    },
  ];

  while (true) {
    console.log("Sending request to Ollama...");

    const response = await ollama.chat({
      model: "qwen3:1.7b",
      messages,
      tools,
      stream: false,
      keep_alive: "10m",
    });

    console.log("Ollama responded");

    const assistantMessage = response.message;

    messages.push(assistantMessage);

    if (
      !assistantMessage.tool_calls ||
      assistantMessage.tool_calls.length === 0
    ) {
      console.log("Final response received");
      return assistantMessage.content;
    }

    for (const toolCall of assistantMessage.tool_calls) {
      const toolName = toolCall.function.name;
      const args = toolCall.function.arguments;

      console.log("Tool requested:", toolName);
      console.log("Tool arguments:", args);

      let result;

      if (toolName === "analyze_login") {
        result = await analyzeLogin(args);
      } else {
        result = {
          error: `Unknown tool: ${toolName}`,
        };
      }

      console.log("Tool result:", result);

      messages.push({
        role: "tool",
        tool_name: toolName,
        content: JSON.stringify(result),
      });
    }
  }
}
