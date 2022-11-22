<template>
    <div>
        
        <textarea 
            @keydown.tab.prevent="pressedTab"
            @change="updateStore"
            ref="inputTextArea"
            v-model.trim="obj.code"
            id="" 
            name="code" 
            cols="30" 
            rows="10"
            style="width: 100%;">
        </textarea>

        <highlightjs 
            v-if="obj.code.length"
            language='vue' 
            :code="obj.code" 
            contenteditable="true" 
            class="tabbed" 
        />

    </div>
</template>

<script setup>

    import { reactive, onMounted, ref } from 'vue'
    import { useCodeStore } from '@/stores/code'
    import hljsVuePlugin from "@highlightjs/vue-plugin";
    
    import 'highlight.js/lib/common'
    import 'highlight.js/styles/stackoverflow-light.css'
    
    const componentRefresh = defineProps(['componentRefresh'])

    const highlightjs = hljsVuePlugin.component

    const codeStore = useCodeStore()
    
    const inputTextArea = ref('')

    const obj = reactive({
        code: '',
        hasBackend: import.meta.env.VITE_HAS_BACKEND,
    })

    
    function pressedTab($event)
    {    
        let textArea = inputTextArea.value
        let start = $event.target.selectionStart
        let end = $event.target.selectionEnd

        textArea = `${textArea.value.substring(0, start)}\t${textArea.value.substring(end)}`
        $event.target.value = textArea
        $event.target.selectionStart = $event.target.selectionEnd = start + 1
    }

    function updateStore($event)
    {
        codeStore.code = obj.code
        console.log(codeStore.code)
    }

    onMounted(() => {
        console.log('[Loaded Module]: CodeInput')
        obj.code = codeStore.code
    })

</script>

<style scope>

</style>