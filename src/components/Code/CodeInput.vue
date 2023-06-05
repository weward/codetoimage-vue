<template>
    <div id="code-parent"></div>
</template>

<script setup>

    import { reactive, onMounted } from 'vue'
    import { useCodeStore } from '@/stores/code'

    import { basicSetup } from "codemirror"
    import { EditorView } from "@codemirror/view";
    import { EditorState } from "@codemirror/state";
    import { selectedLanguage } from '@/static/languages.js'

    const componentRefresh = defineProps(['componentRefresh'])

    const codeStore = useCodeStore()

    const obj = reactive({
        code: '.',
        hasBackend: import.meta.env.VITE_HAS_BACKEND,
    })

    const currentLanguage = async (selected) => {

        let language = await selectedLanguage(selected)

        return await language[`${selected}`]()
    }

    let editor = new EditorView({
        state: EditorState.create({

        doc: codeStore.code,
        extensions: [
            basicSetup,
            await currentLanguage(codeStore.selectedLanguage),
        ],
        parent: document.querySelector("#code-parent")
        })
    })

    onMounted(() => {
        console.log('[Loaded Module]: CodeInput')
        obj.code = codeStore.code
        // Load Editor
        document.querySelector("#code-parent").appendChild(editor.dom)
    })

</script>

<style scope>

</style>