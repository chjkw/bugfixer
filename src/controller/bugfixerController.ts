import {
  commands,
  window,
  Disposable,
  ProgressLocation   } from "vscode";

import * as child_process from "child_process";
import * as path from "path";
import * as vscode from "vscode";
import {Logger} from "../logger/logger";

export class BugfixerController {
  private _commandForAnalysis: Disposable;
  private logger:Logger;

  public constructor(private context: vscode.ExtensionContext) {
    this._commandForAnalysis = commands.registerCommand("bugfixer.run", 
    (uri:vscode.Uri) => {
      this.analyse(uri);
    });

    this.logger = new Logger("b");
  }

  public dispose() {
    this._commandForAnalysis.dispose();
  }

  protected analyse(uri: vscode.Uri) {    
    let location = uri.fsPath;
    let id = path.basename(location);

    const outputPath = path.join(location, "output");
    this.context.globalState.update("bugfixer.outputPath", outputPath);

    let args: string[] = [
    "run",
    "--rm",
    "-v",
    `${outputPath}:/results`,
    "tdurieux/astor",
    "-i",
    `${id}`, 
    "--scope",
    "package",
    "--parameters",
    "mode:jGenProg"];
    
    vscode.window.showInformationMessage(args.join(" "));

    vscode.commands.executeCommand('bugfixer.showProgress');

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
            //result += log;

            if (log.startsWith("[")) {
              let re = /^.* - /g;
              log = log.replace(re, "");

              this.pushLog(log);
              progress.report({ message: log});
            }
        });

        bugfixer.on("exit", (code) => {
          if(code === 0) {
            progress.report({ increment: 100, message: "실행 완료" });
            vscode.window.showInformationMessage("Astor 실행이 완료되었습니다.");
          } else if (canceled) {
            vscode.window.showInformationMessage(`Astor 실행이 취소되었습니다.`);
            bugfixer.kill();
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

  private pushLog(log: string) {
    this.logger.info("!! " + log + " !!");

    vscode.commands.executeCommand('bugfixer.pushLog', log);
  }
}