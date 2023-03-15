import { expect, test } from 'vitest';
import { toggleCamelCase, toggleJsonCase, toggleUpperCase } from '../src/main'


const rawtxt = `
"/view/video/456?id" : "a?b?=c"
name.space = tuweifeng;
"Asd==:::as::ff" = "EddE"

age = 18
weight = 18.9
flag = False
X-Request-Id: fe7e712bcb4d53171f4801c7b084559a
`;

test("toggleJsonCase", () => {
    let jsoncasetxt = `
"/view/video/456?id" : "a?b?=c",
"name.space" : "tuweifeng;",
"Asd==:::as::ff" : "EddE",

"age" : 18,
"weight" : 18.9,
"flag" : false,
"X-Request-Id" : "fe7e712bcb4d53171f4801c7b084559a",
`;
    let rawcasetxt = `
"/view/video/456?id" = "a?b?=c"
"name.space" = "tuweifeng;"
"Asd==:::as::ff" = "EddE"

age = 18
weight = 18.9
flag = false
"X-Request-Id" = "fe7e712bcb4d53171f4801c7b084559a"
`;
    expect(toggleJsonCase(rawtxt)).toBe(jsoncasetxt);
    expect(toggleJsonCase(jsoncasetxt)).toBe(rawcasetxt);
    expect(toggleJsonCase(rawcasetxt)).toBe(jsoncasetxt);
})




test("toggleCamelCase", () => {
    let camelcasetxt = `
"viewVideo456Id" : "a?b?=c"
nameSpace = tuweifeng;
"AsdAsFf" = "EddE"

age = 18
weight = 18.9
flag = False
XRequestId : fe7e712bcb4d53171f4801c7b084559a
`
    let snakecasetxt = `
"view_video456_id" : "a?b?=c"
name_space = tuweifeng;
"Asd_as_ff" = "EddE"

age = 18
weight = 18.9
flag = False
X_request_id : fe7e712bcb4d53171f4801c7b084559a
`
    expect(toggleCamelCase(rawtxt)).toBe(camelcasetxt);
    expect(toggleCamelCase(camelcasetxt)).toBe(snakecasetxt);
    expect(toggleCamelCase(snakecasetxt)).toBe(camelcasetxt);
})






test("toggleUpperCase", () => {
    let uppercasetxt = `
"/VIEW/VIDEO/456?ID" : "A?B?=C"
NAME.SPACE = TUWEIFENG;
"ASD==:::AS::FF" = "EDDE"

AGE = 18
WEIGHT = 18.9
FLAG = FALSE
X-REQUEST-ID: FE7E712BCB4D53171F4801C7B084559A
`
    let lowercasetxt = `
"/view/video/456?id" : "a?b?=c"
name.space = tuweifeng;
"asd==:::as::ff" = "edde"

age = 18
weight = 18.9
flag = false
x-request-id: fe7e712bcb4d53171f4801c7b084559a
`
    expect(toggleUpperCase(rawtxt)).toBe(uppercasetxt);
    expect(toggleUpperCase(uppercasetxt)).toBe(lowercasetxt);
    expect(toggleUpperCase(lowercasetxt)).toBe(uppercasetxt);
})




