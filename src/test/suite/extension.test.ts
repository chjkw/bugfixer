import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import {getAllFilesSync } from 'get-all-files';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		const files = getAllFilesSync(`/Users/chjkw/dev/autofix/bugfixerJ/bugfixerj/test/chart_1/output`).toArray().filter(f => f.endsWith("astor_output.json"));
		console.log(files);
		
	
	});
});
