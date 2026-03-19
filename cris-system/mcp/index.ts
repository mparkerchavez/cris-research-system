import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { extractionTools, handleExtractionTool } from "./tools/extraction.ts";
import { intakeTools, handleIntakeTool } from "./tools/intake.ts";
import { queryTools, handleQueryTool } from "./tools/query.ts";
import { synthesisTools, handleSynthesisTool } from "./tools/synthesis.ts";

const server = new Server(
  { name: "cris-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

const allTools = [
  ...intakeTools,
  ...extractionTools,
  ...queryTools,
  ...synthesisTools,
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: allTools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (intakeTools.find((tool) => tool.name === name)) {
      return await handleIntakeTool(name, args);
    }
    if (extractionTools.find((tool) => tool.name === name)) {
      return await handleExtractionTool(name, args);
    }
    if (queryTools.find((tool) => tool.name === name)) {
      return await handleQueryTool(name, args);
    }
    if (synthesisTools.find((tool) => tool.name === name)) {
      return await handleSynthesisTool(name, args);
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
