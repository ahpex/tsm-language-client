import { workspace, ExtensionContext } from "vscode";

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  const configuration = workspace.getConfiguration(
    "tsm-language-server-client"
  );

  const executable = configuration.get<string>("executable");
  const varName = configuration.get<string>("varname");
  const suggestionsDir = configuration.get<string>("suggestionsdir");

  const runOptions = {
    command: executable,
    args: ["--varname", varName, "--suggestionsdir", suggestionsDir],
    transport: TransportKind.stdio,
  };
  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: runOptions,
    debug: runOptions,
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for all documents by default
    documentSelector: [{ scheme: "file", language: "*" }],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
    },
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    "tsm-language-server-id",
    "tsm-language-server-name",
    serverOptions,
    clientOptions
  );

  // Start the client. This will also launch the server
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
