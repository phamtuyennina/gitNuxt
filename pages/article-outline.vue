<template>
    <div class="box-main !max-w-[90%] !shadow-none">
        <div v-if="loadingStore.isLoading"><Loadding /></div>
        <div class="container-get-info-1 mb-3">
            <p>Tiêu đề nội dung</p>
            <span>Easily write articles of 800 - 3500 words in less than 5 minutes!</span>
        </div>
        <div class="grid grid-cols-3 gap-4">
            <div class="container-get-info-2">
                <div class="card">
                    <div class="card-header flex items-center justify-between">
                        <div class="btn-return !mb-0 px-3 bg-[#ccc] overflow-hidden rounded-[10px]">
                            <NuxtLink to="/"><i class="fa-solid fa-arrow-left-long"></i> Quay lại</NuxtLink>
                        </div>
                        <div class="edit-content">
                            <div class="" :class="{active: isEditing}" @click="isEditing = !isEditing">
                                <span></span>
                            </div>
                            <p>Chỉnh sửa dàn ý</p>
                        </div>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="submitForm">
                            <div class="container-load-content !px-0 !mb-0 !pb-0" :class="{active: isEditing}">
                                <div class="btn-add-h2" @click="addH2()"><i class="fa-solid fa-plus"></i>Thêm h2</div>
                                <div class="main-content-wrapper">
                                    <draggable :list="dataJson" item-key="id" group="h2" class="" :disabled="isEditing">
                                        <template #item="{ element, index }">
                                            <div class="main-content">
                                                <div class="heading-2" :ref="index === dataJson.length - 1 ? (el) => lastH2Ref = el : null">
                                                    <div>
                                                        <span>H2</span>
                                                        <p class="text-[15px]">{{ element.tieude }}</p>
                                                        <input type="text" required class="form-control text-sm" v-model="element.tieude" placeholder="Nhập tiêu đề H2" :ref="index === dataJson.length - 1 ? (el) => lastH2InputRef = el : null">
                                                    </div>
                                                    <div class="btn-h2-delete" @click="deleteH2(index)"><i class="fa-solid fa-trash-can"></i></div>
                                                </div>
                                                <draggable :list="element.child" item-key="id" :group="{ name: 'h3-group-' + index, pull: false }"  class="heading-3-container" handle=".heading-3" :disabled="isEditing" >
                                                    <template #item="{ element: childElement, index: childIndex }">
                                                        <div class="heading-3" >
                                                            <div>
                                                                <span>H3</span>
                                                                <p class="text-[14px]">{{ childElement }}</p>
                                                                <input type="text" required class="form-control text-sm" v-model="element.child[childIndex]" placeholder="Nhập tiêu đề H3" :ref="childIndex === element.child.length - 1 ? (el) => lastH3InputRef = el : null">
                                                            </div>
                                                            <div class="btn-h3-delete" @click="deleteH3(index, childIndex)"><i class="fa-solid fa-trash-can"></i></div>
                                                        </div>
                                                    </template>
                                                </draggable>
                                                <div class="btn-add-h3" @click="AddH3(index)"><i class="fa-solid fa-plus"></i>Thêm h3</div>
                                            </div>
                                        </template>
                                    </draggable>
                                </div>
                                <div class="container-form">
                                    <div class="row">
                                        <div class="col-6">
                                            <div class="form-group mb-2">
                                                <label for="content_keyword">Chiều dài bài viết</label>
                                                <select v-model="form.content_length" id="content_length" class="form-control text-sm form-select">
                                                    <option value="800 - 1000">Medium (800 - 1000 từ)</option>
                                                    <option value="1000 - 1500">Large (1000 - 1500 từ)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="form-group mb-2">
                                                <label for="content_style">Phong cách viết</label>
                                                <select v-model="form.content_style" id="content_style" class="form-control text-sm form-select">
                                                    <option value="Chuyên nghiệp">Chuyên nghiệp</option>
                                                    <option value="Hài hước">Hài hước</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="form-group mb-0">
                                                <label for="content_note">Ghi chú</label>
                                                <textarea cols="5" v-model="form.content_note" class="form-control text-sm !resize-none"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="btn-submit-get-info !mt-0"><button type="submit">Tạo bài viết</button></div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-span-2">
                <div class="card">
                    <div class="card-header flex items-center justify-between">
                        <p class="!mb-0 py-[10px]"><b>Nội dung bài viết</b></p>
                        <p class="!mb-0 py-[10px]"><b>Token đã sử dụng: {{ websiteStore.tokenTotal }}</b></p>
                    </div>
                    <div class="card-body">
                        <div ></div>
                        <div class="container_content" ref="contentRef" v-html="displayedContent"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>
<style>
@import url("~/assets/fontawesome611/all.css");
</style>

<script setup>
    import { ref,computed,nextTick } from 'vue'
    import draggable from 'vuedraggable';
    import { useHead } from '#imports'
    import { marked } from 'marked';

    useHead({
    script: [
        {
        src: "https://unpkg.com/@tailwindcss/browser@4",
        async: true
        }
    ]
    })
    const websiteStore = useWebsiteStore()
    const loadingStore = useLoading()
    const isEditing = ref(false)
    const lastH2Ref = ref(null)
    const lastH2InputRef = ref(null) 
    const lastH3InputRef = ref(null)
    const displayedContent = ref('');
    const fullContent = ref('');
    const contentRef = ref(null);
    const dataJson = computed(() => websiteStore.getDataJson)
    const form = ref({
        content_length: websiteStore.content_length,
        content_keyword: websiteStore.content_keyword,
        content_title: websiteStore.content_title,
        content_style:'Chuyên nghiệp',
        content_note:''
    })

    const deleteH2 = (index) => {
        dataJson.value.splice(index, 1)
    }
    const AddH3 = async (index) => {
        dataJson.value[index].child.push("")
        await nextTick()
        lastH3InputRef.value?.focus()
    }
    const deleteH3 = (index, childIndex) => {
        dataJson.value[index].child.splice(childIndex, 1)
    }
    const addH2 = async () => {
        dataJson.value.push({
            tieude: "",
            child: []
        });
        await nextTick();
        lastH2Ref.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        lastH2InputRef.value?.focus()
    }
    const convertToMarkdown = () => {
        let markdown = ""
        dataJson.value.forEach((element, index) => {
            markdown += `## ${element.tieude}\n`
            element.child.forEach((childElement, childIndex) => {
                markdown += `### ${childElement}\n`
            })
        })
        return markdown
    }
    const typeEffect = (text, speed = 5) => {
        let index = 0;
        displayedContent.value = '';
        const type = async () => {
        if (index < text.length) {
            displayedContent.value += text.charAt(index);
            index++;
            await nextTick();
            if (contentRef.value && contentRef.value.scrollHeight+300 > document.documentElement.clientHeight) {
                window.scrollTo({ top: contentRef.value.scrollHeight, left: 0, behavior: 'smooth' });
            }
            setTimeout(type, speed);
        }
    };

        type();
    }
    const submitForm = async () => {
        loadingStore.setLoading(true)
        const markdown = convertToMarkdown()
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        const PromptDefault = `Trong vai một nhà sáng tao nội dung. Hãy viết một bài blog thỏa các tiêu chí bên dưới:
            1. Độ dài bài viết: ${form.value.content_length}
            2. Từ khóa mục tiêu: ${form.value.content_keyword}
            3. Tiêu đề bài viết: ${form.value.content_title}
            4. Phong cách viết: ${form.value.content_style}
            5. Dàn ý bàn viết theo cấu trúc mardown sau đây:
            ${markdown} \n\n
            6. In đậm từ khóa mục tiêu trong nội dung
            ${form.value.content_note}
            *Lưu ý: chỉ trả về nội dung bài blog, không cần thêm câu chào hay hướng dẫn.
            \`\`\`
        `
        const messages = [{ role: "user", content: PromptDefault }]
        const { data, error } = await useFetch('https://ai.nina.vn/api/create-content', {
            method: 'POST',
            body: JSON.stringify({ length: form.value.content_length, keyword: form.value.content_keyword, title: form.value.content_title, style: form.value.content_style, note: form.value.content_note, outline: markdown}),
            headers: { 'Content-Type': 'application/json' }
        })
        if (error.value) {
            console.error('Lỗi:', error.value)
        } else {
            loadingStore.setLoading(false)
            websiteStore.setTokenTotal(data.value.totalTokenCount)
            fullContent.value = marked(data.value.content)
            typeEffect(fullContent.value)
        }
    }
</script>