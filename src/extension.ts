// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { toggleJsonCase, toggleUpperCase, toggleCamelCase } from './main'


export function activate(context: vscode.ExtensionContext) {
	vscode.commands.registerCommand('vscode-extensions-txtrans.toggleJsonCase', () => {
		const editor = vscode.window.activeTextEditor;
		let txt = editor?.document.getText(editor.selection).trim();
		if (!txt) {
			return
		}
		let transtxt = toggleJsonCase(txt);
		editor?.edit((editBuilder) => {
			editBuilder.replace(editor.selection, transtxt)
		})
	});


	vscode.commands.registerCommand('vscode-extensions-txtrans.toggleUpperCase', () => {
		const editor = vscode.window.activeTextEditor;

		let txt = editor?.document.getText(editor.selection).trim();
		if (!txt) {
			return
		}
		let transtxt = toggleUpperCase(txt);
		editor?.edit((editBuilder) => {
			editBuilder.replace(editor.selection, transtxt)
		})
	});


	vscode.commands.registerCommand('vscode-extensions-txtrans.toggleCamelCase', () => {
		const editor = vscode.window.activeTextEditor;

		let txt = editor?.document.getText(editor.selection).trim();
		if (!txt) {
			return
		}
		let transtxt = toggleCamelCase(txt);
		editor?.edit((editBuilder) => {
			editBuilder.replace(editor.selection, transtxt)
		})
	});

}

// This method is called when your extension is deactivated
export function deactivate() { }
