<template>
    <div>
        <div>
            <input 
                v-model="obj.title"
                type="text" 
                placeholder="Input title here...">
        </div>

        <div>
            <select @change="changeStyle($event)" v-model="obj.style_id">
                <option value="" disabled :selected="obj.style_id == ''">{{"Select a style"}}</option>
                <option v-if="!obj.hasBackend" v-for="style in styleList" :value="style">{{ style }}</option>
                <option v-if="obj.hasBackend" v-for="(style, key) in obj.styleList" :value="style.id">{{ style.name }}
                </option>
            </select>
        </div>

        <div>
            <CodeInput :key="obj.refreshComponent"/>
        </div>

        <div class="align-center">
            <button 
                @click="saveBtn()" 
                :disabled="obj.processing || codeStore.code.length == 0"
                class="btn">
                Save
            </button>

            <button 
                @click="clearBtn()" 
                :disabled="obj.processing || codeStore.code.length == 0"
                class="btn">
                Clear
            </button>
        </div>

    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import CodeInput from '@/components/Code/CodeInput.vue'
import { useCodeStore } from '@/stores/code'

import { styleList } from '@/static/styleList'

const codeStore = useCodeStore()

const obj = reactive({
    title: '',
    style_id: '',
    styleList: [],
    hasBackend: import.meta.env.VITE_HAS_BACKEND,
    chosenStyle: '',
    defaultStyle: '../../../assets/css/highlightjs/astackoverflow-light.css',
    refreshComponent: 0,
    processing: false
})

async function changeStyle(event) {
    let style = (!obj.hasBackend) ? event.target.value : obj.styleList.filter((item, key) => item.id === obj.style_id)[0].name
    
    obj.chosenStyle = `${style}.css`
    
    codeStore.$patch({
        style_id: obj.style_id
    })

    await removeStyle()

    await appendStyle()
}

async function appendStyle() {
    let assetUrl = await getAssetUrl()

    let style = document.createElement('link');
    style.type = "text/css"
    style.rel = "stylesheet"
    style.id = "chosenStyle"
    style.href = assetUrl

    document.head.appendChild(style);
}

function getAssetUrl() {
    return new URL(`../../../assets/css/highlightjs/${obj.chosenStyle}`, import.meta.url)
}

function removeStyle() {
    let oldStyle = document.getElementById('chosenStyle')

    if (oldStyle != null) {
        oldStyle.remove()
    }
}

function saveBtn()
{
    obj.processing = true

    codeStore.save(obj)
        .then((res) => {
            clearBtn()
        })
        .catch((err) => {

        })
        .finally(() => {
            obj.processing = false
        })
}

function clearBtn()
{
    codeStore.clearCode()

    obj.id = ''
    obj.title = ''
    obj.style_id = ''

    obj.refreshComponent += 1
}

onMounted(() => {
    console.log('[Loaded Module] CodeForm')

    if (obj.hasBackend) {
        codeStore.getCodeStyles()
            .then((res) => {
                obj.styleList = res.data
            })
    } else {
        obj.styleList = styleList
    }

    obj.id = codeStore.id
    obj.title = codeStore.title
    obj.style_id = codeStore.style_id

})


</script>

<style>
</style>