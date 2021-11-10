import * as vscode from 'vscode';
import * as util from '../common/util';

export class FileController {
  constructor(private context: vscode.ExtensionContext) {
    vscode.commands.registerCommand('bugfixer.diff', (src, dst) => this.diff(src, dst));
  }

  private async diff(src: string, dst: string) {
    if(!util.pathExists(src) || !util.pathExists(dst)) {
      await vscode.window.showErrorMessage("파일을 찾을 수 없습니다.");
      return;
    }

    await vscode.commands.executeCommand('vscode.diff', vscode.Uri.file(src), vscode.Uri.file(dst));
  }
  
}