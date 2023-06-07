// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia'
import axios from 'axios'
import { config } from '@/config/general'
import _ from 'lodash'

export const useCodeStore = defineStore({
  id: 'codeStore',
  
  state: () => ({
    id: '',
    title: '',
    user_id: '',
    style_id: '',
    language_id: '',
    code: '',
    updated_at: '',
    created_at: '',
    font_id: '',
    codes: [],
    selectedLanguage: '',
    selectedStyle: '',
    code_bg: '',
  }),

  getters: {
    
  },

  actions: {
    init() {
        console.log('[Store]: useCodeStore is working!')
        return
    },
    getCodeStyles() {
      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: `${config.apiUrl}/code-style`,
        })
        .then((res) => {
          if (res.data != null) {
            resolve(res.data)
          }
        })
        .catch((err) => {
          console.log(err)
          reject()
        })
        .finally(() => {
          console.log('done fetching code styles!')
        })
      })
    },

    getCodeLanguages() {
      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: `${config.apiUrl}/code-language`,
        })
        .then((res) => {
          if (res.data != null) {
            resolve(res.data)
          }
        })
        .catch((err) => {
          console.log(err)
          reject()
        })
        .finally(() => {
          console.log('done fetching code languages!')
        })
      })
    },

    getAll() {
        return new Promise((resolve, reject) => {
          axios({
            method: 'GET',
            url: `${config.apiUrl}/code`
          })
          .then((res) => {
            if (res.data != null) {
              this.codes = res.data.data
              resolve(res.data)
            }
          })
          .catch((err) => {
            console.log(err)

            reject()
          })
        })
    },
    
    save(payload) {
      return new Promise((resolve, reject) => {
        let data = {
          title: payload.title,
          code: this.code,
          style_id: this.style_id,
          language_id: this.language_id,
          code_bg: this.code_bg,
        }
        
        axios({
          method: 'POST',
          url: `${config.apiUrl}/code`,
          data,
        })
        .then((res) => {
          if (res.status == 200) {
            let resData = res.data.data
            this.codes.unshift(resData)

            resolve(res)
          }
        })
        .catch((err) => {
          console.log("[ERROR]: Code.save()")
          reject(err)
        })
      })
    },

    getRecord() {
        return new Promise((resolve, reject) => {
          axios({
            method: 'GET',
            url: `${config.apiUrl}/code/${this.id}}`
          })
          .then((res) => {
            if (res.data.length) {
              resolve(res.data)
            }
          })
          .catch((err) => {
            console.log(err)

            reject()
          })
        })
    },

    update() {

    },

    destroy(codeId) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'DELETE',
          url: `${config.apiUrl}/code/${codeId}`
        })
        .then((res) => {
          this.codes = this.codes.filter((each) => each.id != codeId)
          resolve(true)
        })
        .catch((err) => {
          console.log('failed!')
        })
      })
    },

    getStyleId() {
      return new Promise((resolve, reject) => {
        resolve(this.$state.style_id)
      })
    },

    clearCode() {
      this.code = ''

    }

  }

})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCodeStore, import.meta.hot))
}
