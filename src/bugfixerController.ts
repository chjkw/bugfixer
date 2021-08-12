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
    this._commandForAnalysis = commands.registerCommand("extension.runBugfixer", () => this.analyse());
  }

  public dispose() {
    this._commandForAnalysis.dispose();
  }

  protected analyse() {    
    let args: string[] = [];

    args.push("-jar"); 
    args.push("D:\\dev\\autofix\\astor\\target\\astor-1.1.0-jar-with-dependencies.jar");
    args.push("-location");
    args.push("D:\\dev\\autofix\\astor\\examples\\math_70");
    args.push("-mode");
    args.push("jKali" );
    args.push("-package");
    args.push("org.apache.commons" );
    args.push("-jvm4testexecution");
    args.push("C:\\open-jdk8.0-x64\\bin\\" );
    args.push("-failing" );
    args.push("org.apache.commons.math.analysis.solvers.BisectionSolverTest" );
    args.push("-srcjavafolder");
    args.push("/src/java/" );
    args.push("-srctestfolder" );
    args.push("/src/test/" );
    args.push("-binjavafolder" );
    args.push("/target/classes" );
    args.push("-bintestfolder" );
    args.push("/target/test-classes" );
    args.push("-flthreshold" );
    args.push("0.5" );
    args.push("-stopfirst" );
    args.push("true" );
    args.push("-dependencies" );
    args.push("D:\\dev\\autofix\\astor\\examples\\libs\\junit-4.4.jar");

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
          "java",
          args,
          {cwd:""}
        );
        
        bugfixer.stderr.on("data", data => (errmsg += data.toString()));
        bugfixer.stdout.on("data", data => {
            let log: string = data.toString();
            result += log;
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