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
                    <option v-if="obj.hasBackend" v-for="(style, key) in obj.listStyle" :value="style.id" :selected="obj.style_id === style.id">{{ style.name }}
                    </option>
                </select>
                <span v-if="obj.err.style_id" class="text-danger text-sm">{{ obj.err.style_id }}</span>
            </div>

            <div class="form-control ml-15">
                <select @change="changeLanguage($event)" v-model="obj.language_id" class="form-input">
                    <option value="" disabled :selected="obj.language_id == ''">{{ "Select a Language" }}</option>
                    <option v-if="obj.hasBackend" v-for="(lang, key) in obj.listLanguage" :value="lang.id" :selected="obj.language_id == lang.id">{{ lang.name }}
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

        <div v-if="obj.showMsg" class="mt align-self-center text-success bold">
            <span >{{ obj.msg }}</span>
        </div>

        <div id="code" :class="`${obj.code_bg} bg-code mb`" ref="codeEditor">
            <Suspense>
                <CodeInput :key="obj.refreshComponent"/>
            </Suspense>
        </div>
        <span v-if="obj.err.code" class="text-danger text-sm align-self-center mb">{{ obj.err.code }}</span>

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

        <CodeIndex></CodeIndex>

    </div>
</template>

<script setup>
import { reactive, onMounted, ref, getCurrentInstance } from 'vue'
import CodeInput from '@/components/Code/CodeInput.vue'
import CodeIndex from '@/components/Code/CodeIndex.vue'
import { useCodeStore } from '@/stores/code'

const app = getCurrentInstance()
const codeStore = useCodeStore()

const obj = reactive({
    showMsg: false,
    msg: "Saved!",
    id: '',
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

const save = () => {
    codeStore.save(obj)
    .then((res) => {
        clearBtn()
        showMsg("Saved!")
    })
    .catch((err) => {
        processErrors(err)
    })
    .finally(() => {
        obj.processing = false
    })
}

const update = () => {
    codeStore.update(obj)
    .then((res) => {
        clearBtn()
        showMsg("Updated!")
    })
    .catch((err) => {
        processErrors(err)
    })
    .finally(() => {
        obj.processing = false
    })
}

const saveBtn = async() => {
    obj.processing = true
    clearErrors()

    if (codeStore.editing) {
        update()

        return
    }

    save()
}

const clearBtn = () => {
    codeStore.clearCode()

    obj.id = ''
    obj.title = ''
    obj.style_id = ''
    obj.language_id = ''
    obj.code_bg = ''
    obj.selectedLanguage = ''
    obj.selectedStyle = ''
    

    obj.refreshComponent += 1
}

const updateFormValues = () => {
    obj.title   = codeStore.title
    obj.code    = codeStore.code
    obj.style_id   = codeStore.style_id
    obj.language_id   = codeStore.language_id
    obj.code_bg   = codeStore.code_bg
    obj.selectedStyle = codeStore.selectedStyle
    obj.selectedLanguage = codeStore.selectedLanguage
}

const showMsg = async (msg) => {
    obj.msg = await msg
    obj.showMsg = await!obj.showMsg

    await setTimeout(() => {
        obj.showMsg = !obj.showMsg
    }, 5000)
}

const processErrors = (err) => {
    if (err.response.status == 422) {
        for (const [key, value] of Object.entries(err.response.data.errors)) {
            obj.err[`${key}`] = value[0]
        }
    }
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

    codeStore.$subscribe(async (mutation, state) => {
        // IF changed dropdown value of code style
        if (mutation.payload?.hasOwnProperty('editing')) {
            updateFormValues()   
        }
    })

    obj.id = codeStore.id
    obj.title = codeStore.title
    obj.style_id = codeStore.style_id
    obj.language_id = codeStore.language_id
})


</script>

<style lang="scss">

    @import '@/../assets/scss/bg.scss';

</style>