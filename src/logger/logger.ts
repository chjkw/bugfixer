import * as fs from 'fs';
import {workspace, window} from 'vscode';
import * as path from 'path';

export enum LOG_LEVEL {
  ERROR,
  INFO,
  DEBUG,
  TRACE
}

export class Logger {
  private logPath: string = "";
  private ts: number = 0;

  constructor(private name: string) {
	const time = this.getDateString();
    this.logPath = path.resolve("/Users/chjkw/dev/autofix/bugfixerJ/bugfixerj", "logs", `vscode-extension.${time}.log`);
  }

  public info(m: string) {
    this.log(LOG_LEVEL.INFO, m);
  }

  public debug(m: string) {
    this.log(LOG_LEVEL.DEBUG, m);
  }

  public error(m: string) {
    this.log(LOG_LEVEL.ERROR, m);
  }

  public trace(m: string) {
    this.log(LOG_LEVEL.TRACE, m);
  }

  private showInfo(level: LOG_LEVEL, m: string) {
    window.showInformationMessage(level.toString(), m);
  }

  public increaseTab() {
    this.ts += 1;
  }

  public decreaseTab() {
    if(this.ts > 0) {
      this.ts -= 1;
    } else {
      this.ts = 0;
    }
  }

  public start(m: string) {
    this.trace("");
    this.trace(`[ Start ${m} ]`);
    this.increaseTab();
  }

  public end(m: string) {
    this.decreaseTab();
    this.trace(`[ End ${m} ]`);
    this.trace("");
  }

  private log(level: LOG_LEVEL, m: string) {
    const workspace_config = workspace.getConfiguration();
    const logLevel = workspace_config.get("sparrow.logLevel", "debug");

    let currentLogLevel: LOG_LEVEL | undefined = (<any>LOG_LEVEL)[logLevel.toUpperCase()];
    if (currentLogLevel === undefined) {
      currentLogLevel = LOG_LEVEL.DEBUG;
    }
    
    if(level > currentLogLevel ) {
      return;
    }
    
    const logPath = this.getLogPath();
    const contents = this.makeLogString(level, m);

    const logDir = path.resolve(logPath, "..");

    if(!fs.existsSync(logDir)) { fs.mkdirSync(logDir); }
    
    try {
      if(!fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, contents);
      } else {
        fs.appendFileSync(logPath, contents);
      }
    } catch (err) {
      console.error(err);
    }
  }

  public getLogPath() {
    return this.logPath;
  }

  public makeLogString(level: LOG_LEVEL, m: string) {
    const levelName = LOG_LEVEL[level];
    const time = this.getTimeString();

    const tab = "|    ".repeat(this.ts);

    return `[${levelName.padEnd(5, ' ')}][${time}][${this.name.padEnd(20, ' ')}] ${tab}${m}\n`;
  }


  private getDateString() {
    const date = new Date();

    const year = date.getFullYear();
    const m = date.getMonth();
    const month = (m+1).toString().padStart(2,'0');
    const day = date.getDate().toString().padStart(2,'0');

    return `${year}-${month}-${day}`;
  }


  private getTimeString() {
    const date = new Date();

    const hour = date.getHours().toString().padStart(2,'0');
    const minnites = date.getMinutes().toString().padStart(2,'0');
    const sencond = date.getSeconds().toString().padStart(2,'0');

    return `${this.getDateString()} ${hour}:${minnites}:${sencond}`;
  }
}