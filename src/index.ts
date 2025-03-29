#!/usr/bin/env node

/**
 * MCP-Server-Inbox - An MCP server for creating notes in inBox.
 * This service connects to inBox API and allows creating notes through MCP.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { InboxClient } from "./inbox.js";

/**
 * Parse command line arguments
 * Example: node index.js --inbox_user_token=your_token
 */
function parseArgs() {
  const args: Record<string, string> = {};
  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith("--")) {
      const [key, value] = arg.slice(2).split("=");
      if (key && value) {
        args[key] = value;
      }
    }
  });
  return args;
}

// 解析命令行参数
const args = parseArgs();

/**
 * Create an MCP server with capabilities for tools (to create notes in inBox).
 */
const server = new Server(
  {
    name: "mcp-server-inbox",
    version: "0.1.0",
    description: "MCP服务对接inBox笔记API，实现对话形式创建笔记功能"
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handler that lists available tools.
 * Exposes a single "write_note" tool that lets clients create notes in inBox.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "write_note",
        description: "Write note to inBox",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Optional title of the note",
            },
            content: {
              type: "string",
              description: "Text content of the note with markdown format",
            },
          },
          required: ["content"],
        },
      },
    ],
  };
});

/**
 * Handler for the write_note tool.
 * Creates a new note in inBox with the provided content.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "write_note": {
      const content = String(request.params.arguments?.content);
      const title = request.params.arguments?.title ? String(request.params.arguments.title) : undefined;
      
      if (!content) {
        throw new Error("Content is required");
      }

      // 获取用户Token，优先使用命令行参数，其次使用环境变量
      const userToken = args.inbox_user_token || process.env.INBOX_USER_TOKEN;
      if (!userToken) {
        throw new Error("inBox token or URL not set. Please provide it via:\n" +
          "1. Token format: --inbox_user_token=your_token\n" +
          "2. URL format: --inbox_user_token=@https://inbox.gudong.site/api/inbox/your_token");
      }

      // 创建inBox客户端并写入笔记
      const inbox = new InboxClient({ userToken });
      const result = await inbox.writeNote({ title, content });

      // 返回成功信息
      let successMessage = `笔记已成功保存到inBox!`;
      if (title) {
        successMessage += `\n\n标题: ${title}`;
      }
      successMessage += `\n\n${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`;
      
      return {
        content: [
          {
            type: "text",
            text: successMessage
          },
        ],
      };
    }

    default:
      throw new Error("Unknown tool");
  }
});

/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
