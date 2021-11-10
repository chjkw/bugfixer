import * as vscode from "vscode";
import * as util from '../common/util';

export class TreeviewController {
  //private readonly logger = new Logger("TreeviewController");

  constructor(private context: vscode.ExtensionContext) {
    vscode.commands.registerCommand('bugfixer.setOutputPath2', () => this.setOutputPath());
  }

  private async setOutputPath() {
    const path = await vscode.window.showInputBox({ 
      placeHolder: '결과 경로를 입력하세요'
    });
    
    if (path !== null && path !== undefined) {
      if(!util.pathExists(path)) {
        vscode.window.showErrorMessage(`경로가 없습니다. ${path}`);
        return;
      }
  
      this.context.globalState.update("bugfixer.outputPath", path);
      vscode.window.showInformationMessage(`결과 경로가 설정되었습니다. ${path}`);
    }
		
  }
}