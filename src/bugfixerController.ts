import {
  commands,
  window,
  Disposable,
  ProgressLocation   } from "vscode";

import * as child_process from "child_process";
import * as vscode from "vscode";

export class BugfixerController {
  private _commandForAnalysis: Disposable;

  public constructor(private context: vscode.ExtensionContext) {
    this._commandForAnalysis = commands.registerCommand("extension.runBugfixer", 
    (uri:vscode.Uri) => {
      this.analyse(uri.fsPath);
    });
  }

  public dispose() {
    this._commandForAnalysis.dispose();
  }

  protected analyse(location: string) {    
    let args: string[] = [
    "run",
    "--rm",
    "-v",
    "D:\\dev\\autofix\\astor\\output:/results",
    "-v",
    `${location}:/mnt/src`,
    "tdurieux/astor",
    "-i",
    "Math_70", 
    "--scope",
    "package",
    "--parameters",
    "mode:jGenProg:location:/mnt/src"];
    
    vscode.window.showInformationMessage(args.join(" "));

    window.withProgress({
      location: ProgressLocation.Notification,
      title: "Astor 실행",
      cancellable: true
    }, 
    async (progress, token) => {
      let canceled = false;

      const p = new Promise(resolve => {
        let result = "";
        let errmsg = "";

        let bugfixer = child_process.spawn(
          'docker',
          args,
          {cwd:""}
        );
        
        bugfixer.stderr.on("data", data => (errmsg += data.toString()));
        bugfixer.stdout.on("data", data => {
            let log: string = data.toString();
            result += log;

            if(log.toString().trim().startsWith("[")) {
              let re = /\[[^\]]*\]/g;
              log = log.replace(re, "");
              progress.report({ message: log});
            }
        });

        bugfixer.on("exit", (code) => {
          if(code === 0) {
            progress.report({ increment: 100, message: "실행 완료" });
            vscode.window.showInformationMessage("Astor 실행이 완료되었습니다.");
          } else if (canceled) {
            vscode.window.showInformationMessage(`Astor 실행이 취소되었습니다.`);
          }
          else {
            progress.report({ increment: 100, message: "실행 실패" });
            vscode.window.showErrorMessage("Astor 실행이 실패했습니다.\n" + errmsg);
          }
          resolve(0);
        });
      });;  

      
      return p;
    });
  }
}