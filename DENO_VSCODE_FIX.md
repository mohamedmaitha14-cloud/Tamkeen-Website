# Deno and formatting fix

- Open the **tamkeen_conversational_ai** folder itself in VS Code (File > Open Folder), so `.vscode/settings.json` applies.
- Install Deno extension (already installed according to your message).
- Run **Developer: Reload Window** from the Command Palette.
- The Edge Function now uses `Deno.serve()` rather than a remote `serve` import and has typed request arguments.
- `index.ts` is expanded into readable sections with 2-space indentation, semicolons and trailing commas, consistent with the included Prettier configuration.
- To format again: right-click inside `index.ts` > **Format Document** > select **Deno**. For other website files select Prettier.
- To deploy and activate AI, follow `CHATBOT_SETUP_README.md`; credentials are not included.
