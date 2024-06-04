import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // Create a status bar item
  let statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = "extension.toggleFormatOnSave";
  context.subscriptions.push(statusBarItem);

  // Function to update the status bar item text
  const updateStatusBarItem = () => {
    const config = vscode.workspace.getConfiguration();
    const phpConfig = config.inspect<{ "editor.formatOnSave": boolean }>(
      "[php]"
    );
    const formatOnSave =
      phpConfig?.globalValue?.["editor.formatOnSave"] ?? false;

    statusBarItem.text = formatOnSave ? "F-On" : "F-Off";
    statusBarItem.show();
  };

  // Register the command to toggle the setting
  let disposable = vscode.commands.registerCommand(
    "extension.toggleFormatOnSave",
    async () => {
      const config = vscode.workspace.getConfiguration();
      const phpConfig = config.inspect<{ "editor.formatOnSave": boolean }>(
        "[php]"
      );
      const formatOnSave =
        phpConfig?.globalValue?.["editor.formatOnSave"] || false;

      const newConfig = {
        ...(phpConfig?.globalValue || {}),
        "editor.formatOnSave": !formatOnSave,
      };

      await config.update(
        "[php]",
        newConfig,
        vscode.ConfigurationTarget.Global
      );
      updateStatusBarItem();
    }
  );

  context.subscriptions.push(disposable);

  // Update the status bar item initially
  updateStatusBarItem();
}

export function deactivate() {}
