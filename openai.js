// openai.js - Node.js backend for OpenAI API integration and process.report configuration

// Initialize OpenTelemetry tracing first (before any other imports)
const { initializeTracing } = require("./src/config/tracing.js");
initializeTracing("codespaces-react-backend");

import "dotenv/config";
import express from "express";
import fetch from "node-fetch";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

const app = express();
app.use(express.json());
app.use(express.static('dist'));

// Serve React app for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

// --- Azure AI Inference setup ---
const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT || "https://models.inference.ai.azure.com";
const AZURE_MODEL = process.env.AZURE_MODEL || "gpt-4o"; // Supports gpt-4o, gpt-4o-mini, claude-3.5-sonnet, etc.
const AZURE_API_KEY = process.env.AZURE_API_KEY;
const clientAI = AZURE_API_KEY ? ModelClient(AZURE_ENDPOINT, new AzureKeyCredential(AZURE_API_KEY)) : null;

// Advanced agentic capabilities configuration
const ENABLE_FUNCTION_CALLING = process.env.ENABLE_FUNCTION_CALLING !== 'false';
const MAX_ITERATIONS = parseInt(process.env.MAX_ITERATIONS) || 5;

// --- Azure Cosmos DB setup ---
const COSMOS_ENDPOINT = process.env.COSMOS_ENDPOINT || "https://localhost:8081";
const COSMOS_KEY = process.env.COSMOS_KEY || "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";
const client = new CosmosClient({ endpoint: COSMOS_ENDPOINT, key: COSMOS_KEY });
const databaseId = "EliteDB";
const containerId = "ChatHistory";
const transactionsContainerId = "Transactions";
const todosContainerId = "Todos";
const portfolioContainerId = "Portfolio";

// Initialize database and container
async function initCosmos() {
  try {
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    await database.containers.createIfNotExists({
      id: containerId,
      partitionKey: "/userId"
    });
    await database.containers.createIfNotExists({
      id: transactionsContainerId,
      partitionKey: "/userId"
    });
    await database.containers.createIfNotExists({
      id: todosContainerId,
      partitionKey: "/userId"
    });
    await database.containers.createIfNotExists({
      id: portfolioContainerId,
      partitionKey: "/userId"
    });
    console.log("Cosmos DB initialized successfully");
  } catch (error) {
    console.error("Error initializing Cosmos DB:", error);
  }
}

initCosmos();

// --- Socket.IO for real-time updates ---
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Broadcast crypto prices every 30 seconds
setInterval(async () => {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,litecoin,ethereum&vs_currencies=usd");
    const data = await response.json();
    io.emit('crypto-prices', data);
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
  }
}, 30000);

// --- process.report configuration ---
// Note: process.report is read-only in Node.js, so these settings are commented out
// process.report = process.report || {};
// process.report.reportOnFatalError = false;
// process.report.reportOnSignal = false;
// process.report.reportOnUncaughtException = true;
// process.report.reportOnFatalError = true;
// process.report.reportOnSignal = true;
// process.report.reportOnUncaughtException = false;
// process.report.reportOnFatalError = false;
// process.report.reportOnUncaughtException = false;
// process.report.reportOnSignal = true;
// process.report.signal = "SIGQUIT";
// process.report.excludeNetwork = true;
// process.report.excludeNetwork = true;

// --- Advanced Tool Definitions for Agentic Capabilities ---
const TOOLS = [
  {
    type: "function",
    function: {
      name: "get_crypto_price",
      description: "Get current cryptocurrency prices in USD",
      parameters: {
        type: "object",
        properties: {
          symbols: {
            type: "array",
            items: { type: "string" },
            description: "Cryptocurrency symbols (e.g., ['bitcoin', 'ethereum', 'litecoin'])"
          }
        },
        required: ["symbols"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "analyze_portfolio",
      description: "Analyze user's cryptocurrency portfolio and provide insights",
      parameters: {
        type: "object",
        properties: {
          userId: {
            type: "string",
            description: "User ID to analyze portfolio for"
          }
        },
        required: ["userId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "execute_code",
      description: "Execute Python or JavaScript code for advanced analysis",
      parameters: {
        type: "object",
        properties: {
          code: {
            type: "string",
            description: "Code to execute"
          },
          language: {
            type: "string",
            enum: ["python", "javascript"],
            description: "Programming language"
          }
        },
        required: ["code", "language"]
      }
    }
  }
];

// Tool execution functions
async function executeTool(toolName, args) {
  switch (toolName) {
    case "get_crypto_price":
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${args.symbols.join(',')}&vs_currencies=usd`);
      return await response.json();
    
    case "analyze_portfolio":
      const container = client.database(databaseId).container(portfolioContainerId);
      const querySpec = {
        query: "SELECT * FROM c WHERE c.userId = @userId",
        parameters: [{ name: "@userId", value: args.userId }]
      };
      const { resources } = await container.items.query(querySpec).fetchAll();
      return { holdings: resources, totalValue: resources.reduce((sum, h) => sum + (h.quantity * h.price), 0) };
    
    case "execute_code":
      if (args.language === "javascript") {
        try {
          const result = eval(args.code);
          return { result, success: true };
        } catch (err) {
          return { error: err.message, success: false };
        }
      }
      return { error: "Python execution not implemented in this environment", success: false };
    
    default:
      return { error: "Unknown tool" };
  }
}

// --- Azure AI Inference integration ---

app.post("/api/openai", async (req, res) => {
  const { messages, model = AZURE_MODEL, userId = "default", enableTools = ENABLE_FUNCTION_CALLING } = req.body;
  if (!clientAI)
    return res.status(500).json({ error: "Missing Azure AI configuration" });
  try {
    const systemMessage = {
      role: "system",
      content: "You are an elite cryptocurrency analysis and trading assistant with advanced agentic coding capabilities. You can execute code, analyze data, call functions, and perform multi-step reasoning tasks. Provide insights on Litecoin, Bitcoin, Ethereum, and other cryptos. Analyze market trends, give trading advice, explain blockchain concepts, and help with portfolio management. Use your tools when needed to provide accurate, data-driven analysis. Be precise, methodical, and cautious with financial advice."
    };
    const fullMessages = [systemMessage, ...messages];

    let iteration = 0;
    let currentMessages = fullMessages;
    let finalResponse = null;

    // Agentic loop for multi-step reasoning with tool calling
    while (iteration < MAX_ITERATIONS) {
      const requestBody = {
        messages: currentMessages,
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 4096,
        model: model
      };

      if (enableTools && TOOLS.length > 0) {
        requestBody.tools = TOOLS;
        requestBody.tool_choice = "auto";
      }

      const response = await clientAI.path("/chat/completions").post({
        body: requestBody
      });

      if (isUnexpected(response)) {
        throw response.body.error;
      }

      const data = response.body;
      const assistantMessage = data.choices[0].message;

      // Check if the model wants to call a tool
      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        // Add assistant message with tool calls to conversation
        currentMessages.push(assistantMessage);

        // Execute each tool call
        for (const toolCall of assistantMessage.tool_calls) {
          try {
            const toolName = toolCall.function.name;
            const toolArgs = JSON.parse(toolCall.function.arguments);
            
            console.log(`Executing tool: ${toolName} with args:`, toolArgs);
            const toolResult = await executeTool(toolName, toolArgs);
            
            // Add tool response to conversation
            currentMessages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify(toolResult)
            });
          } catch (toolError) {
            console.error(`Tool execution error for ${toolCall.function.name}:`, toolError);
            currentMessages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify({ error: toolError.message })
            });
          }
        }
        
        iteration++;
        // Continue the loop to get the next response
      } else {
        // No tool calls, we have the final response
        finalResponse = data;
        break;
      }
    }

    // If we hit max iterations, use the last response
    if (!finalResponse && iteration >= MAX_ITERATIONS) {
      console.warn(`Max iterations (${MAX_ITERATIONS}) reached`);
      finalResponse = {
        choices: [{
          message: {
            role: "assistant",
            content: "I've reached the maximum number of reasoning steps. Please try breaking down your request."
          }
        }]
      };
    }

    // Store chat history in Cosmos DB
    try {
      const container = client.database(databaseId).container(containerId);
      await container.items.create({
        id: `${userId}-${Date.now()}`,
        userId,
        messages: fullMessages,
        response: finalResponse,
        iterations: iteration,
        toolsUsed: enableTools,
        timestamp: new Date().toISOString()
      });
    } catch (cosmosError) {
      console.error("Error storing to Cosmos DB:", cosmosError);
    }

    res.json(finalResponse);
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Elite Terminal Command Execution ---
app.post("/api/terminal", async (req, res) => {
  const { command } = req.body;
  if (!command) return res.status(400).json({ error: "No command provided" });

  try {
    const { stdout, stderr } = await execAsync(command, { timeout: 10000 });
    res.json({ output: stdout || stderr });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Self-Aware System Status ---
app.get("/api/status", (req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
    platform: process.platform,
    features: [
      "OpenAI Integration",
      "Elite Terminal",
      "Persmix Module",
      "Adaptive UI",
    ],
    status: "Elite Operational",
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(
    `Elite Backend Server running on port ${PORT} - State of the Art, Adaptive, Self-Aware`
  );
});
