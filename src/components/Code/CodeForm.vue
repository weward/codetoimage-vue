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
                <option v-if="obj.hasBackend" v-for="(style, key) in obj.listStyle" :value="style.id">{{ style.name }}
                </option>
            </select>
        </div>

        <div>
            <select @change="changeLanguage($event)" v-model="obj.language_id">
                <option value="" disabled :selected="obj.language_id == ''">{{ "Select a Language" }}</option>
                <option v-if="obj.hasBackend" v-for="(lang, key) in obj.listLanguage" :value="lang.id">{{ lang.name }}
                </option>
            </select>
        </div>

        <div>
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
    processing: false
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
                // obj.style_id = res.data[0].id
                // obj.selectedStyle = res.data[0].code
            })

        codeStore.getCodeLanguages()
            .then((res) => {
                obj.listLanguage = res.data
                // obj.language_id = res.data[0].id
                // obj.selectedLanguage = res.data[0].code
            })
    }

    obj.id = codeStore.id
    obj.title = codeStore.title
    obj.style_id = codeStore.style_id
    obj.language_id = codeStore.language_id

})


</script>

<style>
</style>