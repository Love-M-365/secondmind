import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema 
} from '@modelcontextprotocol/sdk/types.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import Mongoose schemas
import User from '../models/user.model.js';
import Memory from '../models/memory.model.js';
import DigitalTwin from '../models/digitalTwin.model.js';

// Load env
dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/secondmind';

// Initialize the MCP server
const server = new Server(
  {
    name: 'secondmind-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Expose tools list
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_memories',
        description: 'Retrieve memories and documents stored in the SecondMind database for a given user email.',
        inputSchema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'The email address of the user.',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of memories to return (default 10).',
            }
          },
          required: ['email'],
        },
      },
      {
        name: 'get_digital_twin',
        description: 'Fetch the structured Digital Twin (skills, goals, interests, strengths, weaknesses) of a user.',
        inputSchema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'The email address of the user.',
            }
          },
          required: ['email'],
        },
      },
      {
        name: 'add_memory_note',
        description: 'Inject a custom text note or goal directly into the user\'s memory store.',
        inputSchema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'The email address of the user.',
            },
            content: {
              type: 'string',
              description: 'The text content to store as memory.',
            },
            sourceType: {
              type: 'string',
              enum: ['note', 'goal', 'conversation'],
              description: 'Category of the memory (default note).',
            }
          },
          required: ['email', 'content'],
        },
      }
    ],
  };
});

// Expose tool handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Ensure DB connection is active
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri);
    }

    // Lookup user by email
    const user = await User.findOne({ email: args.email });
    if (!user) {
      return {
        content: [
          {
            type: 'text',
            text: `User with email "${args.email}" not found in database.`,
          },
        ],
        isError: true,
      };
    }

    if (name === 'list_memories') {
      const limit = args.limit || 10;
      const memories = await Memory.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(limit);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(memories, null, 2),
          },
        ],
      };
    }

    if (name === 'get_digital_twin') {
      const twin = await DigitalTwin.findOne({ userId: user._id });
      if (!twin) {
        return {
          content: [
            {
              type: 'text',
              text: `No Digital Twin profile generated yet for user "${args.email}".`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(twin, null, 2),
          },
        ],
      };
    }

    if (name === 'add_memory_note') {
      const { content, sourceType = 'note' } = args;
      
      const newMemory = await Memory.create({
        userId: user._id,
        sourceType,
        content,
        summary: content.substring(0, 100) + '...',
        metadata: {
          wordCount: content.split(/\s+/).filter(Boolean).length
        }
      });

      return {
        content: [
          {
            type: 'text',
            text: `Successfully injected note to database. Memory ID: ${newMemory._id}`,
          },
        ],
      };
    }

    throw new Error(`Tool ${name} not found`);
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `MCP Server Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Run the stdio transport server
const runServer = async () => {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('SecondMind MCP Server started on stdio transport.');
  } catch (error) {
    console.error('Failed to launch SecondMind MCP Server:', error);
  }
};

runServer();
