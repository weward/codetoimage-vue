// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia'
import axios from 'axios'
import { config } from '@/config/general'

export const useCodeStore = defineStore({
  id: 'codeStore',
  
  state: () => ({
    user_id: '',
    style_id: '',
    language_id: '',
    font_id: '',
    title: '',
    code: '',
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
          url: `${config.apiUrl}/get-code-styles`,
        })
        .then((res) => {
          if (res.data != null) {
            resolve(res)
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
    save(payload) {
      return new Promise((resolve, reject) => {
        let data = {
          title: payload.title,
          code: this.code,
          style_id: payload.style_id,
        }

        console.log(data)
        
        axios({
          method: 'POST',
          url: `${config.apiUrl}/save-code`,
          data,
        })
        .then((res) => {
          if (res.status == 200) {
            resolve(res)
          }
        })
        .catch((err) => {
          console.log(err)
          reject()
        })
        .finally(() => {
          
        })
      })
    },

    getRecord() {
        // view, edit
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
