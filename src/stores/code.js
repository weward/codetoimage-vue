// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia'
import axios from 'axios'
import { config } from '@/config/general'

export const useCodeStore = defineStore({
  id: 'codeStore',
  
  state: () => ({
    id: '',
    title: '',
    user_id: '',
    style_id: '',
    code: '',
    updated_at: '',
    created_at: '',
    language_id: '',
    font_id: '',
    codes: [],
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
          style_id: payload.style_id,
        }
        
        axios({
          method: 'POST',
          url: `${config.apiUrl}/code`,
          data,
        })
        .then((res) => {
          if (res.status == 201) {
            let resData = res.data.data
            this.codes.unshift(resData)

            resolve(res)
          }
        })
        .catch((err) => {
          console.log(err)
          reject()
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

    destroy() {

    },

    getStyleId() {
      return new Promise((resolve, reject) => {
        resolve(this.$state.style_id)
      })
    },

  }

})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCodeStore, import.meta.hot))
}
