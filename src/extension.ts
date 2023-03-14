// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


function transCamelCase(txt:string){
	let pattern = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/g;
	let slices = txt.split(pattern)
	let items = new Array();
	
	if (slices.length > 1){
		slices.forEach(item => {
			item = item.trim();
			if (item){
				if (items.length>0){
					item = item[0].toUpperCase() + item.substring(1);
				}
				items.push(item)
			}
		});
		txt = items.join("");
	}
	return txt
}



function transSnakeCase(txt:string){
	let items = new Array();
	let isPreLower = false;

	for (let c of txt){
		if(!/^[a-zA-Z]*$/.test(c)){
			isPreLower = false
		}
		else if (c == c.toUpperCase()){
			if (isPreLower){
				items.push("_");
			}
			isPreLower = false
			c = c.toLowerCase();
		}
		else {
			isPreLower = true
		}
		items.push(c);
	}
	let transtxt = items.join("");
	return transtxt
}


export function activate(context: vscode.ExtensionContext) {
	vscode.commands.registerCommand('vscode-extensions-txtrans.toggleJsonCase', () => {
		const editor = vscode.window.activeTextEditor;

		let txt = editor?.document.getText(editor.selection).trim();
		if (!txt) {
			return
		}

		let items = new Array();
		let flag = 0;

		txt?.split(/[,]*\n/).forEach(line => {
			line = line.trim();
			// key = "value"
			if (/^[a-zA-Z0-9\-]+\s*=\s*".+"[,]*$/.test(line)){
				let [k, v] = line.split("=", 2);
				k = k.trim();
				v = v.trim();
				if (v.endsWith(",")){
					v = v.substring(0, v.length-1)
				}
				if (flag == 0 || flag == 1){
					items.push(`"${k}": ${v},`)
					flag = 1;
				}
				else if (flag == 2){
					items.push(`${k} = ${v}`)
				}
			}

			// key = value
			else if (/^[a-zA-Z0-9\-]+\s*=.+$/.test(line)){
				let [k, v] = line.split("=", 2);
				k = k.trim();
				v = v.trim();
				if (flag == 0 || flag == 1){
					items.push(`"${k}": "${v}",`)
					flag = 1;
				}
				else if (flag == 2){
					items.push(`${k} = "${v}"`)
				}
			}

			// key : value
			else if (/^[a-zA-Z0-9\-]+\s*:.+$/.test(line)){
				let [k, v] = line.split(":", 2);
				k = k.trim();
				v = v.trim();
				if (flag == 0 || flag == 1){
					items.push(`"${k}": "${v}",`)
					flag = 1;
				}
				else if (flag == 2){
					items.push(`${k} = "${v}"`)
				}
			}
			// "key": "value"
			else if (/^"[a-zA-Z0-9\-]+"\s*:\s*".+"[,]*$/.test(line)){
				let [k, v] = line.split(":", 2);
				k = k.trim();
				v = v.trim();
				if (v.endsWith(",")){
					v = v.substring(0, v.length-1)
				}

				if (flag == 0 || flag == 2){
					items.push(`${k.substring(1, k.length-1)} = ${v}`)
					flag = 2
				}
				else if (flag == 1){
					items.push(`"${k}": "${v}",`)
				}
			}
			// 不符合情况的也保留
			else{
				items.push(line)
			}

		});

		if (items.length < 1){
			return
		}

		let transtxt = "";
		transtxt = items.join("\n");


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

		let upperlines = new Array();
		let lowerlines = new Array();
		let isupper = false

		txt.split("\n").forEach(line => {
			let pattern = /\s*=\s*/;
			let upperline = line.toUpperCase();
			let lowerline = line.toLowerCase();


			if (pattern.test(line)){
				let [left, right] = line.split(pattern, 2);
				let upperleft = left.toUpperCase();
				let lowerleft = left.toLowerCase();
				if (upperleft!= left){
					isupper = true
				}
				upperline = `${upperleft} = ${right}`
				lowerline = `${lowerleft} = ${right}`
			}
			else{
				if (upperline != line){
					isupper = true
				}
			}
			upperlines.push(upperline || line);
			lowerlines.push(lowerline || line);
		});
		let transtxt = "";
		if (isupper){
			transtxt = upperlines.join("\n");
		}
		else{
			transtxt = lowerlines.join("\n");
		}

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

		let camellines = new Array();
		let snakelines = new Array();
		let iscamel = false;

		txt.split("\n").forEach(line => {
			let pattern = /\s*=\s*/;
			let camelline = "";
			let snakeline = "";

			if (pattern.test(line)){
				let [left, right] = line.split(pattern, 2);
				let camelleft = transCamelCase(left);
				let snakeleft = transSnakeCase(left);
				camelline = `${camelleft} = ${right}`;
				snakeline = `${snakeleft} = ${right}`;
				if (camelleft != left){
					iscamel = true
				}
			}
			else{
				camelline = transCamelCase(line);
				snakeline = transSnakeCase(line);
				if(camelline != line){
					iscamel = true;
				}
			}
			camellines.push(camelline || line);
			snakelines.push(snakeline || line);

		});
		let transtxt = "";
		if (iscamel){
			transtxt = camellines.join("\n");
		}
		else{
			transtxt = snakelines.join("\n");
		}

		editor?.edit((editBuilder) => {
			editBuilder.replace(editor.selection, transtxt)
		})
	});

}

// This method is called when your extension is deactivated
export function deactivate() { }
