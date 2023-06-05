/**
 * CodeMirror 6 Modes
 * aka Languages
 * 
 * https://codemirror.net/#languages
 * 
 */
export const selectedLanguage = async (selected) => {
    switch(selected) {
        case 'javascript':
            return await import("@codemirror/lang-javascript")
        case 'angular':
            return await import("@codemirror/lang-angular")
        case 'css':
            return await import("@codemirror/lang-css")
        case 'cpp':
            return await import("@codemirror/lang-cpp")
        case 'html':
            return await import("@codemirror/lang-html")
        case 'java':
            return await import("@codemirror/lang-java")
        case 'javascript':
            return await import("@codemirror/lang-javascript")
        case 'json':
            return await import("@codemirror/lang-json")
        case 'markdown':
            return await import("@codemirror/lang-markdown")
        case 'php':
            return await import("@codemirror/lang-php")
        case 'python':
            return await import("@codemirror/lang-python")
        case 'rust':
            return await import("@codemirror/lang-rust")
        case 'sass':
            return await import("@codemirror/lang-sass")
        case 'vue':
            return await import("@codemirror/lang-vue")
        case 'xml':
            return await import("@codemirror/lang-xml")

        default:
            return await import("@codemirror/lang-javascript")
    }
}
