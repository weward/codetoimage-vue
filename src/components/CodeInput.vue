<template>
    <div>
        <select @change="changeStyle($event)" v-model="obj.styleId">
            <option v-if="!obj.hasBackend" v-for="style in styleList" :value="style">{{ style }}</option>
            <option v-if="obj.hasBackend" v-for="(style, id) in styleList" :value="id">{{ style }}</option>
        </select>

        <textarea 
            v-model.trim="obj.code"
            id="" 
            name="code" 
            cols="30" 
            rows="10"
            style="width: 100%;">
        </textarea>

        <highlightjs 
            language='vue' 
            :code="obj.code" 
            contenteditable="true" 
            class="tabbed" 
        />

    </div>
</template>

<script setup>

    import { reactive, onMounted } from 'vue'
    import { styleList } from '@/static/styleList'

    import hljsVuePlugin from "@highlightjs/vue-plugin";

    import 'highlight.js/lib/common'
    import 'highlight.js/styles/stackoverflow-light.css'

    const highlightjs = hljsVuePlugin.component

    const obj = reactive({
        code: '',
        styleId: '',
        hasBackend: import.meta.env.VITE_HAS_BACKEND,
        chosenStyle: '../../css/atom-one-dark.css',
    })

    async function changeStyle(event) {
        this.obj.styleId = event.target.value
        this.obj.chosenStyle = `${this.obj.styleId}.css`

        await this.removeStyle()

        await this.appendStyle()

        // set store value - this.obj.chosenStyle
        
    }

    function appendStyle() {
        let assetUrl = this.getAssetUrl()

        let style = document.createElement('link');
        style.type = "text/css"
        style.rel = "stylesheet"
        style.id = "chosenStyle"
        style.href = assetUrl

        document.head.appendChild(style);
    }

    function getAssetUrl() {
        return new URL(`../../public/css/${this.obj.chosenStyle}`, import.meta.url)
    }

    function removeStyle() {
        let oldStyle = document.getElementById('chosenStyle')

        if (oldStyle != null) {
            oldStyle.remove()
        }
    }

    onMounted(() => {
        console.log(import.meta.env.VITE_APP_NAME)
        console.log('[Loaded Module]: CodeInput');
    })

</script>

<style scope>
.tabbed {
    tab-size: 4;
}
</style>