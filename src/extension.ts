// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { BugfixerController } from './controller/bugfixerController';
import { FileController } from './controller/fileController';
import {WebviewController} from './controller/webviewController'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const bugfixer = new BugfixerController(context);
	context.subscriptions.push(bugfixer);
	
	const f = new FileController(context);	
	const wc = new WebviewController(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}
