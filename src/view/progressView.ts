import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ProgressView {
  private static panel: vscode.WebviewPanel | undefined = undefined;
  private static htmlSrc: string = "";

  public static createPanel(context: vscode.ExtensionContext) {
    this.panel = vscode.window.createWebviewPanel(
      'bugfixerProgress',
      "[Bugfixer] 도구 실행 로그",
      vscode.ViewColumn.One,
      {
          enableScripts: true,
          localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'resources'))]
      }
    );

    this.panel.onDidDispose(() => this.panel = undefined);
	return this.panel;
  }

  public static async showWebPanel(context: vscode.ExtensionContext) {
    if(this.panel === undefined) {
      this.panel = this.createPanel(context);
    }

    // And set its HTML content
    const contents = await this.getWebviewContent(context.extensionPath);

    const resourceRoot = this.panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'resources')));
    this.panel.webview.html = contents.replace(/LOCAL_RESOURCE/g, resourceRoot.toString());
    this.panel.reveal(vscode.ViewColumn.One);
  }
  
  private static async getWebviewContent(extensionPath: string) {
    if(!this.htmlSrc) {
		const filePath = path.join(extensionPath, 'src', 'static', 'timeline.html');
		vscode.window.showInformationMessage(filePath);
      this.htmlSrc = fs.readFileSync(filePath, 'utf-8').toString();
    }
        
    const contents = this.htmlSrc;

    return contents;
  }

  public static async addBox(title: string) {
    if(this.panel) {
      this.panel.webview.postMessage({ 
        command: 'addBox',
        data: {
          "title": title
        }
      });
    }
  }

  public static async addLog(log: string) {
    if(this.panel) {
      this.panel.webview.postMessage({ 
        command: 'addLog',
        data: {
          "log": log
        }
      });
    }
  }

  public static close() {
    this.panel?.dispose(); 
    this.panel = undefined;
  }
}



