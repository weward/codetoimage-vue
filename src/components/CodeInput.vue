<template>
    <div>
        <textarea 
            v-model="obj.code"
            id="" 
            name="code" 
            cols="30" 
            rows="10"
            style="width: 100%;">
        </textarea>

        <highlightjs language='vue' :code="obj.code" />

    </div>
</template>

<script setup>
    import 'highlight.js/lib/common'
    import 'highlight.js/styles/stackoverflow-light.css'
    
    import { reactive, onMounted } from 'vue'
    import hljsVuePlugin from "@highlightjs/vue-plugin";
    
    const highlightjs = hljsVuePlugin.component

    const obj = reactive({
        code: '',
    })

    onMounted(() => {
        console.log(import.meta.env.VITE_APP_NAME)
        console.log('[Loaded Module]: CodeInput');
    })

</script>

<style>
    
</style>