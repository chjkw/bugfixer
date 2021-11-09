import * as vscode from 'vscode';
import * as util from '../common/util';

export class FileController {
  constructor(private context: vscode.ExtensionContext) {
    vscode.commands.registerCommand('bugfixer.diff', (src, dst) => this.diff(src, dst));
  }

  private async diff(src: string, dst: string) {

    const a = util.pathExists(src);
    const b = util.pathExists(dst);

    await vscode.commands.executeCommand('vscode.diff', vscode.Uri.file(src), vscode.Uri.file(dst));
  }
  
}