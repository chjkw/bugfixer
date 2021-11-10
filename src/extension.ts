// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { BugfixerController } from './controller/bugfixerController';
import { FileController } from './controller/fileController';
import {WebviewController} from './controller/webviewController';
import {ResultView} from './view/resultView';
import {TreeviewController} from "./controller/treeviewController";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let bugfixer = new BugfixerController(context);
	context.subscriptions.push(bugfixer);

	const r = new ResultView(context);
	const wc = new WebviewController(context);
	const tc = new TreeviewController(context);
	const f = new FileController(context);	
}

// this method is called when your extension is deactivated
export function deactivate() {}
