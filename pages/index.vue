
<template>
    <div class="box-main">
        <div class="container-get-info-1">
            <p>Content SEO standards - NINA</p>
            <span>Easily write articles of 800 - 3500 words in less than 5 minutes!</span>
        </div>
        <div class="container-get-info-2">
            <div v-if="loadingStore.isLoading"><Loadding /></div>
            <div class="title-main">Cấu hình thông tin</div>
            <form class="container-form" @submit.prevent="submitForm">
                <div class="form-group mb-2">
                    <label for="content_length">Độ dài</label>
                    <select v-model="form.content_length" id="content_length" class="form-control text-sm form-select">
                        <option value="800 - 1000">Medium (800 - 1000 từ)</option>
                        <option value="1000 - 1500">Large (1000 - 1500 từ)</option>
                    </select>
                </div>
                <div class="form-group mb-2">
                    <label for="content_keyword">Từ khóa mục tiêu (<span>*</span>)</label>
                    <p>Nhập từ khóa mục tiêu mà bạn muốn Google/Bing xếp hạng.</p>
                    <input type="text" v-model="form.content_keyword" id="content_keyword" class="form-control text-sm" placeholder="Nhập từ khóa mục tiêu">
                </div>
                <div class="form-group">
                    <label for="content_title">Tiêu đề bài viết (<span>*</span>)</label>
                    <p>Nhập tiêu đề của bạn hoặc dùng AI gợi ý tiêu đề</p>
                    <input type="text" v-model="form.content_title" id="content_title" class="form-control text-sm" placeholder="Nhập tiêu đề bài viết">
                    <div class="count-title">Số ký tự: <span>{{ form.content_title.length }}</span> ký tự. Khuyến nghị dưới 70 ký tự.</div>
                </div>
                <div class="btn-submit-get-info">
                    <span v-if="!isValid" class="alert-get-info">Bạn chưa nhập từ khóa và tiêu đề</span>
                    <button type="submit" :disabled="!isValid" :class="{ disabled: !isValid }">Tạo dàn ý</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script setup>
    import { useLoading } from '#imports'
import { ref, computed } from 'vue'
    const form = ref({
        content_length: "800 - 1000",
        content_keyword: "",
        content_title: ""
    })
    const isValid = computed(() => {
        return form.value.content_keyword.trim() !== "" && form.value.content_title.trim() !== ""
    })
    const websiteStore = useWebsiteStore()
    const loadingStore = useLoading()
    const submitForm = async () => {
        if (!isValid.value) return
        loadingStore.setLoading(true)
        websiteStore.setContentLenght(form.value.content_length)
        websiteStore.setContentKeyword(form.value.content_keyword)
        websiteStore.setContentTitle(form.value.content_title)
        const Prompt = `Trong vai một nhà sáng tao nội dung. Hãy cho tôi dàn ý để viết một bài blog thỏa các tiêu chí bên dưới:
            1. Độ dài bài viết: ${form.value.content_length}
            2. Từ khóa mục tiêu: ${form.value.content_keyword}
            3. Tiêu đề bài viết: ${form.value.content_title}
            4. Dàn ý chỉ cần trả về thẻ H2 và H3, không cần nội dung chi tiết, không dùng từ kế luận, tóm lại, tổng kết... trong dàn ý.
            5. Dàn ý trả về dạng markdown theo cấu trúc JSON bên dưới.
            \`\`\`json
            [
                {
                    "tieude": "<Tiêu đề H2>",
                    "child": [
                        "<Tiêu đề H3>",
                        "<Tiêu đề H3>"
                    ]
                },
                ...
            ]
            ** Chỉ trả về markdown json, ko cần thêm câu chào khác
            \`\`\`
        `
        const { data, error } = await useFetch('http://210.2.87.10:9000/api/create-outline', {
            method: 'POST',
            body: JSON.stringify({ length: form.value.content_length, keyword: form.value.content_keyword, title: form.value.content_title}),
            headers: { 'Content-Type': 'application/json' }
        })
        if (error.value) {
            console.error('Lỗi:', error.value)
        } else {
            const text = data.value.content
            console.log(data.value)
            const match = text?.match(/```json\n([\s\S]*?)\n```/) 
            if (match && match[1]) {
                const jsonData = JSON.parse(match[1])
                websiteStore.AddJsonData(jsonData)
                websiteStore.setTokenTotal(data.value.totalTokenCount)
                navigateTo('/article-outline');
            } else {
                console.error('Không tìm thấy JSON hợp lệ trong phản hồi API')
            }
        }
        loadingStore.setLoading(false)
    }
</script>