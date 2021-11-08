import * as progressView from '../view/progressView';

import * as vscode from 'vscode';

export class WebviewController {
  
  constructor(private context: vscode.ExtensionContext) {
    vscode.commands.registerCommand('bugfixer.showProgress', () => this.showProgress());
    vscode.commands.registerCommand('bugfixer.pushLog', log => this.pushLog(log));
  }

  public async showProgress() {
    await progressView.progressView.showWebPanel(this.context);
  }

  public async pushLog(log: string) {
    if (log.startsWith("[")){
      if(log.startsWith("----")) {
        let re = /^----/g;
        const title = log.replace(re, "");
        await progressView.progressView.addBox(title);
      } else {
        let re = /^.* - /g;
        const newLog = log.replace(re, "");
        await progressView.progressView.addLog(newLog);
      }
    }
  }
}

