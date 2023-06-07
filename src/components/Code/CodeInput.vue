<template>
    <div id="code-parent"></div>
</template>

<script setup>

    import { reactive, onMounted } from 'vue'
    import { useCodeStore } from '@/stores/code'

    import { basicSetup } from "codemirror"
    import { EditorView, placeholder } from "@codemirror/view"
    import { EditorState } from "@codemirror/state"
    import { selectedLanguage } from '@/static/languages.js'
    import { selectedTheme } from '@/static/themes.js'

    const componentRefresh = defineProps(['componentRefresh'])

    const codeStore = useCodeStore()

    const obj = reactive({
        code: '.',
        hasBackend: import.meta.env.VITE_HAS_BACKEND,
        placeholder: 'Input code here...',
    })

    const currentLanguage = async (selected) => {
        let language = await selectedLanguage(selected)

        return await language[`${selected}`]()
    }

    const editorStateExtensions = async () => {
        let arr = [
            basicSetup,
            placeholder(obj.placeholder),
            await EditorView.updateListener.of(function (e) {
                codeStore.code = e.state.doc.toString();
            })
        ];
        
        if (codeStore.selectedLanguage) {
            await arr.push(await currentLanguage(codeStore.selectedLanguage)) 
        }

        if (codeStore.selectedStyle) {
            await arr.push(await selectedTheme(codeStore.selectedStyle)) 
        }

        return await arr
    }

    const editorState = {
        doc: codeStore.code,
        lineWrapping: true,
        extensions: await editorStateExtensions(),
        parent: document.querySelector("#code-parent"),
    }

    let editor = new EditorView({
        state: EditorState.create(editorState),
    })

    const updateEditorConfig = async () => {
        // CREATE NEW INSTANCE
        await editor.destroy()

        let newState = await editorState
        newState.doc = await codeStore.code

        newState.extensions = await editorStateExtensions()
        editor = await new EditorView({
            state: EditorState.create(newState)
        })

        await document.querySelector("#code-parent").appendChild(editor.dom)
    }

    onMounted(() => {
        console.log('[Loaded Module]: CodeInput')
        obj.code = codeStore.code
        // Load Editor
        document.querySelector("#code-parent").appendChild(editor.dom)

        codeStore.$subscribe(async (mutation, state) => {
            // IF changed dropdown value of code style
            if (mutation.payload?.hasOwnProperty('selectedStyle') || 
                mutation.payload?.hasOwnProperty('selectedLanguage')
            ) {
                await updateEditorConfig()
            }
        })
        
    })

</script>

<style scope>
.cm-content {
    max-width: 95% !important;
    text-wrap: wrap !important;
}
.cm-scroller {
    overflow-x: hidden !important;
    word-break: break-word !important;
}
</style>