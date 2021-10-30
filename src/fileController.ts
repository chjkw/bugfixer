import * as vscode from 'vscode';
import { readFileSync } from 'fs';

import EditorManager from './ide/editorManager';

export class FileController {
  constructor(private context: vscode.ExtensionContext) {
    vscode.commands.registerCommand('extension.open', (file) => this.open(file));
    vscode.commands.registerCommand('extension.setFocus', () => this.echo());
    vscode.commands.registerCommand('extension.deco', () => this.echo());	
  }

  private echo() {
	  console.log("hello");
  }

  private async open(path: string) {
	  const em = new EditorManager();

    var path = '/Users/chjkw/dev/autofix/astor/examples/chart_output/Defects4J/Chart/5/jGenProg/0/astor_output.json';
		const jsonString = readFileSync(path, 'utf-8');
		var data = JSON.parse(jsonString);
    var variantId = data.patches[0].VARIANT_ID;
    var line = data.patches[0].patchhunks[0].LINE;
		
		var org =      data.patches[0].patchhunks[0].PATH              .replace(/\\/g, "").replace("/script/jGenProg_Defects4J_Chart_5/output_astor/AstorMain-Chart-5", "/Users/chjkw/dev/autofix/astor/examples/chart_output/Defects4J/Chart/5/jGenProg/0");;
    var modified = org.replace("default", "variant-" + variantId);

    await vscode.commands.executeCommand('vscode.diff', vscode.Uri.file(org), vscode.Uri.file(modified));
    //await em.hilight(line, org, vscode.ViewColumn.One);
    //await em.hilight(line, modified, vscode.ViewColumn.Two);
  }
  
}