# Persistent Memory Guidelines (ZeroDB)

This project has persistent memory configured via ZeroDB MCP (`ainative-zerodb-memory-mcp`).

## Instructions for Agent:
1. **Recalling Context:** When starting a new task, session, or when previous context/decisions are referenced, use the `recall` tool from `zerodb-memory` to query relevant prior memories, decisions, and user preferences.
2. **Storing Context:** When key architectural decisions, user preferences, requirements, or milestones are established, use the `remember` tool to persist them for future sessions.
3. **Reflecting:** Use `reflect` or `profile` to update user preferences or summarize progress across tasks.
