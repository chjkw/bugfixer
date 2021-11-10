import * as vscode from 'vscode';
import {ResultNodeProvider, ResultItem} from './nodeProvider/resultNodeProvider';

export class ResultView {
  private view: vscode.TreeView<ResultItem>;
  private provider: vscode.TreeDataProvider<ResultItem>;

  constructor(private context: vscode.ExtensionContext) {
    this.provider = new ResultNodeProvider(context);
    this.view = vscode.window.createTreeView('bugfixerResult', {treeDataProvider: this.provider, showCollapseAll:false});
  }
  
}