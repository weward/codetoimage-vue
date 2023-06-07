<template>
    <div class="flex flex-column">
        <div class="form-control">
            <input 
                v-model="obj.title"
                type="text" 
                class="form-input"
                placeholder="Input title here...">
            <span v-if="obj.err.title" class="text-danger text-sm">{{ obj.err.title }}</span>

        </div>

        <div class="styling-container">
            <div class="form-control mr-15">
                <select @change="changeStyle($event)" v-model="obj.style_id" class="form-input">
                    <option value="" disabled :selected="obj.style_id == ''">{{ "Select a style" }}</option>
                    <option v-if="obj.hasBackend" v-for="(style, key) in obj.listStyle" :value="style.id">{{ style.name }}
                    </option>
                </select>
                <span v-if="obj.err.style_id" class="text-danger text-sm">{{ obj.err.style_id }}</span>
            </div>

            <div class="form-control ml-15">
                <select @change="changeLanguage($event)" v-model="obj.language_id" class="form-input">
                    <option value="" disabled :selected="obj.language_id == ''">{{ "Select a Language" }}</option>
                    <option v-if="obj.hasBackend" v-for="(lang, key) in obj.listLanguage" :value="lang.id">{{ lang.name }}
                    </option>
                </select>
                <span v-if="obj.err.language_id" class="text-danger text-sm">{{ obj.err.language_id }}</span>
            </div>
        </div>

        <div class="bg-selection-container align-self-center">
            <div v-for="bg in obj.bgs" :key="bg" class="bg-selection-box-container">
                <div @click="changeBg($event, bg)" :class="`${bg} bg-selection-box`"></div>
            </div>
        </div>

        <div v-if="obj.showMsg" class="margin-top align-self-center text-success bold">
            <span >Saved!</span>
        </div>

        <div id="code" :class="`${obj.code_bg} bg-code margin-bottom`" ref="codeEditor">
            <Suspense>
                <CodeInput :key="obj.refreshComponent"/>
            </Suspense>
        </div>
        <span v-if="obj.err.code" class="text-danger text-sm align-self-center margin-bottom">{{ obj.err.code }}</span>

        <div class="align-center">
            <button 
                @click="downloadBtn()" 
                :disabled="obj.processing || codeStore.code.length == 0"
                class="btn">
                <font-awesome-icon icon="download" />

            </button>

            <button 
                @click="saveBtn()" 
                :disabled="obj.processing || codeStore.code.length == 0"
                class="btn">

                <font-awesome-icon icon="floppy-disk" />

            </button>

            <button 
                @click="clearBtn()" 
                :disabled="obj.processing || codeStore.code.length == 0"
                class="btn btn-default">
                
                <font-awesome-icon icon="arrows-rotate" />

            </button>
        </div>

    </div>
</template>

<script setup>
import { reactive, onMounted, ref, getCurrentInstance } from 'vue'
import CodeInput from '@/components/Code/CodeInput.vue'
import { useCodeStore } from '@/stores/code'

const app = getCurrentInstance()
const codeStore = useCodeStore()

const obj = reactive({
    showMsg: false,
    title: '',
    style_id: '',
    language_id: '',
    listStyle: [],
    listLanguage: [],
    hasBackend: import.meta.env.VITE_HAS_BACKEND,
    selectedStyle: '',
    selectedLanguage: '',
    refreshComponent: 0,
    processing: false,
    bgs: ['bg-dark', 'bg-light', 'bg-blue', 'bg-mango', 'bg-blue-pink', 'bg-sun', 'bg-coffee-dark', 'bg-coffee-light'],
    code_bg: '',
    printURL: '',
    err: {
        title: '',
        code: '',
        style_id: '',
        langauge_id: '',
    }
})

const codeEditor = ref('codeEditor')

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

const changeBg = async ($event, selectedBg) => {
    await document.querySelectorAll('.bg-selection-box-container')
        .forEach(async (el) => { 
            await el.classList.remove('bg-selection-box-container-active')
        })
    
    await $event.target.parentNode.classList.add('bg-selection-box-container-active')

    obj.code_bg = selectedBg

    codeStore.$patch({
        code_bg: obj.code_bg,
    })
}

const downloadBtn = async() => {
    const options = {
        type: 'dataURL',
        backgroundColor: "rgba(0,0,0,0)",
        dpi: 192, // 1.5x resolution
        // scale: 4,
    }
    
    obj.printURL = await app.ctx.$html2canvas(codeEditor.value, options)
        .then((canvas) => {
            // Preview
            let a = document.createElement('a')
            a.href = canvas
            a.download = "CodeToImage"
            a.click()
        })
}

const saveBtn = async() => {
    obj.processing = true
    clearErrors()

    codeStore.save(obj)
        .then((res) => {
            clearBtn()
            showMsg()
        })
        .catch((err) => {
            console.log(err)
            console.log(err.response.data)
            if (err.response.status == 422) {
                for (const [key, value]  of Object.entries(err.response.data.errors)) {
                    obj.err[`${key}`] = value[0]
                    console.log(`${key} ${value[0]}`)
                }
            }
        })
        .finally(() => {
            obj.processing = false
        })
}

const clearBtn = () => {
    codeStore.clearCode()

    obj.id = ''
    obj.title = ''
    obj.style_id = ''
    obj.language_id = ''
    obj.code_bg = ''

    obj.refreshComponent += 1
}

const showMsg = async (msg) => {
    obj.showMsg = await!obj.showMsg

    await setTimeout(() => {
        obj.showMsg = !obj.showMsg
    }, 5000)
}

const clearErrors = () => {
    for (const [key, value] of Object.entries(obj.err)) {
        obj.err[`${key}`] = ''
    }
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