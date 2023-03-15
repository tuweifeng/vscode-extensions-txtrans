
function splitKeyValue(txt:string):string[]{
    let midchars = [":", "="];
    let mid = midchars.pop() ?? "";
    let [left, right] = _splitKeyValue(txt, mid);
    
    while (!right && midchars.length > 0){
        mid = midchars.pop() ?? "";
        [left, right] = _splitKeyValue(txt, mid);
    }
    return [left.trim(), mid.trim(), right.trim()]
}

function _splitKeyValue(txt:string, mid:string=":"){
    
    let keys = new Array();
    let values = new Array();
    let p = new Array();
    let arr = keys;

    for (let c of txt){
        
        if (c == `"` || c == `'` || c == '`'){
            if (p.length>0 && p[p.length-1] == c){
                p.pop();
            }
            else{
                p.push(c)
            }
        }
        else if (Object.is(arr, keys) && p.length == 0 && c == mid){
            arr = values;
            continue
        }
        arr.push(c);
    }
    let key = keys.join("");
    let value = values.join("");
    return [key, value]
}


function transCamelCase(txt:string){
    let fixchars = new Array();
    if (/^['"`].+['"`]$/.test(txt)){
        fixchars = [txt[0], txt[txt.length-1]];
        txt = txt.substring(1, txt.length-1)
    }
    let pattern = /[^a-zA-Z0-9]+/;
	let words = new Array();

    txt.split(pattern).forEach(word => {
        if (word){
            if (words.length>0){
                word = word[0].toUpperCase() + word.substring(1);
            }
            words.push(word);
        }
    });
    let transtxt = words.join("");

    if (fixchars.length>1){
        transtxt = fixchars[0] + transtxt + fixchars[1];
    }
	return transtxt
}



function transSnakeCase(txt:string){
    let fixchars = new Array();
    if (/^['"`].+['"`]$/.test(txt)){
        fixchars = [txt[0], txt[txt.length-1]];
        txt = txt.substring(1, txt.length-1)
    }
	let chars = new Array();

	for (let c of txt){
        if (/[^A-Z]/.test(c)){
            chars.push(c);
        }
        else if (/[A-Z]/.test(c)){
            if (chars.length>0){
                chars.push("_");
                c = c.toLowerCase();
            }
            chars.push(c);
        }
	}
	let transtxt = chars.join("");
    if (fixchars.length>1){
        transtxt = fixchars[0] + transtxt + fixchars[1];
    }
	return transtxt
}


function transJsonValue(value:string){
	value = value.trim();

	while (value.endsWith(",")){
		value = value.substring(0, value.length-1)
	}

	if (value.length<1){
		return `""`
	}

	if (/(?=^'[^']*'$)|(?=^"[^"]*"$)|(?=^`[^`]*`)/.test(value)){
		return `"` + value.substring(1, value.length-1) + `"`
	}

	// 整型数字 2342
	if (/^\d+$/.test(value)){
		return value
	}
	// 浮点型数字 343.445
	else if (/^\d+\.\d+$/.test(value)){
		return value
	}
	// bool型
	let lowerfield = value.toLowerCase()
	for (let b of ["false", "true"]){
		if (b == lowerfield){
			return lowerfield
		}
	}
	// null
	for (let b of ["none", "null"]){
		if (b == lowerfield){
			return "null"
		}
	}
	return `"${value}"`
}


export function toggleJsonCase(txt:string){

    let jsonlines = new Array();
    let rawlines = new Array();
    let isjsoncase = false;
    

    txt.split(/[,]*\n/).forEach(line => {
        let [left, mid, right] = splitKeyValue(line);
        let key = left;
        let value = right;
        if (mid != ":"){
            isjsoncase = true
        }
        if (left && mid && right){
            if (/(?=^'[^']*'$)|(?=^"[^"]*"$)|(?=^`[^`]*`)/.test(left)){
                key = left.substring(1, left.length-1);
                left = `"` + key + `"`;
            }
    
            value = transJsonValue(right);
            jsonlines.push(`"${key}" : ${value},`);

            if (/^[a-zA-Z_]+[a-zA-Z_0-9]*$/.test(key)){
                rawlines.push(`${key} = ${value}`);
            }
            else{
                rawlines.push(`${left} = ${value}`)
            }

        }
        else{
            jsonlines.push(line);
            rawlines.push(line);
        }

    });
    let transtxt = "";
    if (isjsoncase){
        transtxt = jsonlines.join("\n");
    }
    else{
        transtxt = rawlines.join("\n")
    }
    return transtxt
}


export function toggleUpperCase(txt:string){
    let uppertxt = txt.toUpperCase();
    if (uppertxt != txt){
        return uppertxt
    }
    return txt.toLowerCase()
}


export function toggleCamelCase(txt:string){
    let camellines = new Array();
    let snakelines = new Array();
    let iscamel = false;


    txt.split("\n").forEach(line => {
        let camelline = "";
        let snakeline = "";

        let [left, mid, right] = splitKeyValue(line);

        if (left && mid && right){
            let camelleft = transCamelCase(left);
            let snakeleft = transSnakeCase(left);
            camelline = `${camelleft} ${mid} ${right}`;
            snakeline = `${snakeleft} ${mid} ${right}`;
    
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
    return transtxt
}