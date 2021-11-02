import * as progressView from '../view/progressView';

import * as vscode from 'vscode';

export class WebviewController {
  
  constructor(private context: vscode.ExtensionContext) {
    vscode.commands.registerCommand('bugfixer.showProgress', () => this.showProgress());
  }

  public async showProgress() {
    await progressView.progressView.showWebPanel(this.context);
  }  
}

