export const useLoading = defineStore('loadingStore', {
    state: () => ({
        isLoading: false
    }),
    actions: {
        setLoading(status: boolean) {
            this.isLoading = status;
        }
    },
})