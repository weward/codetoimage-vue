<template>
    <div class="flex flex-column">
        <div class="form-control">
            <input 
                v-model="obj.title"
                type="text" 
                class="form-input"
                placeholder="Input title here...">
        </div>

        <div class="styling-container">
            <div class="form-control mr-15">
                <select @change="changeStyle($event)" v-model="obj.style_id" class="form-input">
                    <option value="" disabled :selected="obj.style_id == ''">{{ "Select a style" }}</option>
                    <option v-if="obj.hasBackend" v-for="(style, key) in obj.listStyle" :value="style.id">{{ style.name }}
                    </option>
                </select>
            </div>

            <div class="form-control ml-15">
                <select @change="changeLanguage($event)" v-model="obj.language_id" class="form-input">
                    <option value="" disabled :selected="obj.language_id == ''">{{ "Select a Language" }}</option>
                    <option v-if="obj.hasBackend" v-for="(lang, key) in obj.listLanguage" :value="lang.id">{{ lang.name }}
                    </option>
                </select>
            </div>
        </div>

        <div class="bg-selection-container align-self-center">
            <div v-for="bg in obj.bgs" :key="bg" class="bg-selection-box-container">
                <div @click="selectBgBox($event, bg)" :class="`${bg} bg-selection-box`"></div>
            </div>
        </div>

        <div id="code" :class="`${obj.codeBg} bg-code margin-bottom`">
            <Suspense>
                <CodeInput :key="obj.refreshComponent"/>
            </Suspense>
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

const codeStore = useCodeStore()

const obj = reactive({
    title: '',
    style_id: '',
    listStyle: [],
    listLanguage: [],
    hasBackend: import.meta.env.VITE_HAS_BACKEND,
    selectedStyle: '',
    selectedLanguage: '',
    refreshComponent: 0,
    processing: false,
    bgs: ['bg-dark', 'bg-light', 'bg-blue', 'bg-mango', 'bg-blue-pink', 'bg-sun', 'bg-coffee-dark', 'bg-coffee-light'],
})

async function changeStyle(event) {
    let code = (!obj.hasBackend) ? event.target.value : obj.listStyle.filter((item, key) => item.id === obj.style_id)[0].code
    obj.selectedStyle = code

    codeStore.$patch({
        style_id: obj.style_id, 
        selectedStyle: code
    })
}

async function changeLanguage(event) {
    let code = (!obj.hasBackend) ? event.target.value : obj.listLanguage.filter((item, key) => item.id === obj.language_id)[0].code
    obj.selectedLanguage = code

    codeStore.$patch({
        language_id: obj.language_id,
        selectedLanguage: code
    })
}

const selectBgBox = async ($event, selectedBg) => {
    await document.querySelectorAll('.bg-selection-box-container')
        .forEach(async (el) => { 
            await el.classList.remove('bg-selection-box-container-active')
        })
    
    await $event.target.parentNode.classList.add('bg-selection-box-container-active')

    obj.codeBg = selectedBg
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
    obj.language_id = ''

    obj.refreshComponent += 1
}

onMounted(() => {
    console.log('[Loaded Module] CodeForm')

    if (obj.hasBackend) {
        codeStore.getCodeStyles()
        .then((res) => {
            obj.listStyle = res.data
        })

        codeStore.getCodeLanguages()
        .then((res) => {
            obj.listLanguage = res.data
        })
    }

    obj.id = codeStore.id
    obj.title = codeStore.title
    obj.style_id = codeStore.style_id
    obj.language_id = codeStore.language_id

})


</script>

<style lang="scss">

    @import '@/../assets/scss/bg.scss';

</style>