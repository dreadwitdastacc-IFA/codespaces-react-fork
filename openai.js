// openai.js - Node.js backend for OpenAI API integration and process.report configuration
import "dotenv/config";
import express from "express";
import fetch from "node-fetch";
import { exec } from "child_process";
import { promisify } from "util";
import { CosmosClient } from "@azure/cosmos";

const execAsync = promisify(exec);

const app = express();
app.use(express.json());

// Simple auth middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = Buffer.from(token, 'base64').toString().split(':');
    if (decoded.length !== 2) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.userId = decoded[0];
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// --- Azure AI Inference setup ---
const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT || "https://models.inference.ai.azure.com";
const AZURE_MODEL = process.env.AZURE_MODEL || "gpt-4o"; // Supports gpt-4o, gpt-4o-mini, claude-3.5-sonnet, etc.
const AZURE_API_KEY = process.env.AZURE_API_KEY;

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
const usersContainerId = "Users";

// --- GitHub OAuth setup ---
const GITHUB_CLIENT_ID = process.env.GITHUB_APP_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_APP_CLIENT_SECRET;
const GITHUB_REDIRECT_URI = process.env.GITHUB_APP_REDIRECT_URI || "http://localhost:3002/auth/github/callback";

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
    await database.containers.createIfNotExists({
      id: usersContainerId,
      partitionKey: "/email"
    });
    console.log("Cosmos DB initialized successfully");
  } catch (error) {
    console.error("Error initializing Cosmos DB:", error);
  }
}

initCosmos();

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

// --- Authentication routes ---

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    const container = database.container(usersContainerId);

    // Check if user already exists
    const { resources } = await container.items
      .query({ query: "SELECT * FROM c WHERE c.email = @email", parameters: [{ name: "@email", value: email }] })
      .fetchAll();

    if (resources.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      id: userId,
      email,
      password: Buffer.from(password).toString('base64'), // Simple encoding - use proper hashing in production
      createdAt: new Date().toISOString()
    };

    await container.items.create(user);
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    const container = database.container(usersContainerId);

    const { resources } = await container.items
      .query({ query: "SELECT * FROM c WHERE c.email = @email", parameters: [{ name: "@email", value: email }] })
      .fetchAll();

    if (resources.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = resources[0];
    const storedPassword = Buffer.from(user.password, 'base64').toString();

    if (storedPassword !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate simple token (use JWT in production)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    res.json({ token, userId: user.id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// GitHub OAuth routes
app.get("/auth/github", (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}&scope=user:email`;
  res.redirect(githubAuthUrl);
});

app.get("/auth/github/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}`
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description });
    }

    const accessToken = tokenData.access_token;

    // Get user info from GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "User-Agent": "codespaces-react-app"
      }
    });

    const githubUser = await userResponse.json();

    // Get user email
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "User-Agent": "codespaces-react-app"
      }
    });

    const emails = await emailResponse.json();
    const primaryEmail = emails.find(email => email.primary)?.email || githubUser.email;

    // Check if user exists in Cosmos DB
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    const container = database.container(usersContainerId);

    const { resources } = await container.items
      .query({ query: "SELECT * FROM c WHERE c.githubId = @githubId", parameters: [{ name: "@githubId", value: githubUser.id.toString() }] })
      .fetchAll();

    let user;
    if (resources.length > 0) {
      user = resources[0];
    } else {
      // Create new user
      const userId = `github_${githubUser.id}`;
      user = {
        id: userId,
        githubId: githubUser.id.toString(),
        email: primaryEmail,
        name: githubUser.name,
        avatar: githubUser.avatar_url,
        createdAt: new Date().toISOString()
      };
      await container.items.create(user);
    }

    // Generate token
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    // Redirect to frontend with token
    res.redirect(`http://localhost:3001?token=${token}&userId=${user.id}`);
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    res.status(500).json({ error: "OAuth failed" });
  }
});

// --- Azure AI Inference integration ---

app.post("/api/openai", authenticate, async (req, res) => {
  const { messages, model = AZURE_MODEL, userId = "default", enableTools = ENABLE_FUNCTION_CALLING } = req.body;
  if (!AZURE_API_KEY)
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

      const url = `${AZURE_ENDPOINT}/chat/completions`;
      const headers = {
        "Authorization": `Bearer ${AZURE_API_KEY}`,
        "Content-Type": "application/json"
      };
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
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
