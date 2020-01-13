import runJS from "./run/runJS";
import runJudge0 from "./run/runJudge0";

export default function runCode(code, lang, input, outputEle) {
    if (lang === "javascript" || lang === "js") {
        runJS(code, outputEle);
    } else {
        runJudge0(
            code,
            window.origamiConfig.runCodeLangList[lang],
            input,
            outputEle
        );
    }
}
