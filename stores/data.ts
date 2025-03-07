export const useWebsiteStore = defineStore('websiteStore', {
    state: () => ({
        dataJson:[],
        content:[],
        content_length:'800 - 1000',
        content_keyword:'',
        content_title:'',
        tokenTotal:0,
    }),
    actions: {
        setContentLenght(length: string) {
            this.content_length = length
        },
        setContentKeyword(keyword: string) {
            this.content_keyword = keyword
        },
        setContentTitle(title: string) {
            this.content_title = title
        },
        AddJsonData(data: any) {
            this.dataJson = data
        },
        AddContentData(data: any) {
            this.content = data
        },
        setTokenTotal(tokenTotal: number) {
            this.tokenTotal+= tokenTotal
        }
    },
    getters: {
        getDataJson(state) {
            return this.dataJson;
        },
        getContent(state) {
            return this.content;
        }
    },
    persist: {
        storage: piniaPluginPersistedstate.sessionStorage(),
    },
})