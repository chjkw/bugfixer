import * as vscode from 'vscode';
import * as path from "path";
import {getAllFilesSync } from 'get-all-files';
import { readFileSync} from 'fs';
import { Result, Patch, PatchChunk } from '../../dto/jGenProgDto';
import * as util from '../../common/util';

export class ResultNodeProvider implements vscode.TreeDataProvider<ResultItem> {
	private outputPath: string = this.context.globalState.get<string>("bugfixer.outputPath", "");
	private currentResultFilePath: string = "";

	private _onDidChangeTreeData: vscode.EventEmitter<ResultItem | undefined> = new vscode.EventEmitter<ResultItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<ResultItem | undefined> = this._onDidChangeTreeData.event;

	constructor(private context: vscode.ExtensionContext) {
		vscode.commands.registerCommand("bugfixer.refreshResult", () => this.refresh());
	}

	refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
	}

	getTreeItem(element: ResultItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: ResultItem): Thenable<ResultItem[]> {
		this.outputPath = this.context.globalState.get<string>("bugfixer.outputPath", "");

		if(!util.pathExists(this.outputPath)) {
			return Promise.resolve([]);
		}

		if(element?.contextValue === "File") {
			const r = element as FileItem;
			return Promise.resolve(this.getPatchItems(r.file));
		} else if(element?.contextValue === "Patch") {
			const p = element as PatchItem;
			return Promise.resolve(this.getChunkItems(p.chunks));
		} else if(element?.contextValue === "Chunk") {
			return Promise.resolve([]);
		} else {
			return Promise.resolve(this.getFileItems());
		}
	}

	private getFileItems() {
		// glob output_path
		const files = getAllFilesSync(this.outputPath).toArray().filter(f => f.endsWith("astor_output.json"));
		return files.map(f => new FileItem(f, vscode.TreeItemCollapsibleState.Collapsed));
	}

	private getPatchItems(file: string) {
		const jsonString = readFileSync(file, 'utf-8');
		var data: Result = JSON.parse(jsonString);
		this.currentResultFilePath = path.dirname(file);

		return data.patches.map(p => new PatchItem(p.VARIANT_ID, file, p.patchhunks, vscode.TreeItemCollapsibleState.Collapsed));
	}

	private getChunkItems(chunks: PatchChunk[]) {
		return chunks.map(c => {
			let re = /^.*\/src/g;
			const src = this.currentResultFilePath + c.PATH.replace(re,"/src").replace(/\\\//g, "/");
			const dst = this.currentResultFilePath + c.MODIFIED_FILE_PATH.replace(re,"/src").replace(/\\\//g, "/");

			const filename = path.parse(src).base;


			return new ChunkItem(src, dst, filename, vscode.TreeItemCollapsibleState.None);
		});
	}
}

export class ResultItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
		this.tooltip = `${this.label}`;
		this.description = "";
	}
}

export class FileItem extends ResultItem {
	constructor (
		public readonly file: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
	) {
		super(file, collapsibleState);
		this.tooltip = `${this.label}`;
		this.description = ``;
		this.contextValue = 'File';
	}
}

export class PatchItem extends ResultItem {
	constructor (
		public readonly variantId: string,
		public readonly path: string,
		public readonly chunks: PatchChunk[],
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
	) {
		super(variantId, collapsibleState);
		this.tooltip = `${this.label}`;
		this.description = `${this.chunks.length}`;
		this.contextValue = 'Patch';
	}
}

export class ChunkItem extends ResultItem {
	constructor (
		public readonly src: string,
		public readonly dst: string,
		public readonly index: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(index, collapsibleState);
		this.command = {
			command: 'bugfixer.diff',
			arguments: [src, dst],
			title: "패치 확인"
		};

		this.tooltip = `${this.label}`;
		this.description = ``;
		this.contextValue = 'Chunk';
	}
}



