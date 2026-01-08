<template>
  <div class="photo-page">
    <div class="photo-header">
      <h1>照片墙</h1>
      <p>记录每一个精彩瞬间</p>
    </div>

    <div class="photo-actions">
      <a-button type="primary" @click="handleUpload">
        <template #icon>
          <AppIcon name="mdi:upload" />
        </template>
        上传照片
      </a-button>
    </div>

    <ImageGroup v-if="photos.length > 0" :photos="photos" />

    <a-empty v-else description="暂无照片">
      <template #image>
        <AppIcon name="mdi:image-off" :size="64" />
      </template>
      <a-button type="primary" @click="handleUpload">上传第一张照片</a-button>
    </a-empty>
    <a-modal v-model:visible="uploadVisible" title="上传照片" :footer="false" width="500px" centered>
      <a-form :model="uploadForm" layout="vertical" @submit.prevent="handleSubmitUpload">
        <a-form-item label="选择照片" required>
          <a-upload list-type="picture-card" :custom-request="handleCustomUpload" :show-upload-list="false"
            accept="image/*" @change="handleUploadChange">
            <div v-if="uploadFileUrl" class="upload-preview">
              <img :src="uploadFileUrl" alt="预览" />
              <div class="upload-preview-overlay">
                <AppIcon name="mdi:refresh" size="24" />
                <span>点击重新选择</span>
              </div>
            </div>
            <div v-else class="upload-placeholder">
              <AppIcon name="mdi:plus" size="32" />
              <span>上传照片</span>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item field="title" label="照片标题" :rules="[{ required: true, message: '请输入标题' }]">
          <a-input v-model="uploadForm.title" placeholder="为照片起个名字" size="large" />
        </a-form-item>

        <a-form-item field="description" label="描述">
          <a-textarea v-model="uploadForm.description" placeholder="描述这张照片的故事" :rows="3" :max-length="200"
            show-word-limit />
        </a-form-item>

        <a-form-item>
          <div class="upload-actions">
            <a-button @click="uploadVisible = false">取消</a-button>
            <a-button type="primary" html-type="submit" :loading="uploading" :disabled="!canSubmit">
              {{ uploading ? '上传中...' : '确认上传' }}
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

  </div>
</template>

<script setup lang="ts">
import ImageGroup from "./components/ImageGroup.vue";
import { ref, computed, onMounted } from "vue";
import AppIcon from "@/components/AppIcon.vue";

interface Photo {
  id: number;
  url: string;
  title: string;
  description: string;
  createdAt: string;
}

/** 改动2：给 photos 一个初始值，包含你这 4 张图的数据 */
const photos = ref<Photo[]>([
  {
    id: 1,
    url: "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp",
    title: "照片1",
    description: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    url: "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp",
    title: "照片2",
    description: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    url: "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp",
    title: "照片3",
    description: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    url: "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp",
    title: "照片4",
    description: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    url: "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp",
    title: "照片5",
    description: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    url: "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp",
    title: "照片6",
    description: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: 7,
    url: "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp",
    title: "照片7",
    description: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: 8,
    url: "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp",
    title: "照片8",
    description: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: 9,
    url: "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp",
    title: "照片9",
    description: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: 10,
    url: "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp",
    title: "照片10",
    description: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: 11,
    url: "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp",
    title: "照片11",
    description: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: 12,
    url: "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp",
    title: "照片12",
    description: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: 13,
    url: "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp",
    title: "照片13",
    description: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: 14,
    url: "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp",
    title: "照片14",
    description: "",
    createdAt: new Date().toISOString(),
  },
]);

const uploadVisible = ref(false);
const uploading = ref(false);
const uploadFileUrl = ref("");
const uploadForm = ref({
  title: "",
  description: "",
});

const canSubmit = computed(() => {
  return uploadForm.value.title.trim() && uploadFileUrl.value;
});
const handleUpload = () => {
  uploadForm.value = { title: "", description: "" };
  uploadFileUrl.value = "";
  uploadVisible.value = true;
};

const handleUploadChange = (info: { file: { originFile?: File } }) => {
  const file = info.file?.originFile;
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadFileUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const handleCustomUpload = () => {
  return {
    abort() { },
  };
};

const handleSubmitUpload = async () => {
  if (!canSubmit.value) return;

  uploading.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newPhoto: Photo = {
      id: Date.now(),
      url: uploadFileUrl.value,
      title: uploadForm.value.title,
      description: uploadForm.value.description,
      createdAt: new Date().toISOString(),
    };

    photos.value.unshift(newPhoto);
    uploadVisible.value = false;
  } catch (error) {
    console.error("上传失败:", error);
  } finally {
    uploading.value = false;
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.photo-page {
  min-height: calc(100vh - 20px);
  padding: $padding-24;
}

.photo-header {
  text-align: center;
  margin-bottom: $padding-24;

  h1 {
    font-size: $font-size-28;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0 0 $padding-8;
  }

  p {
    font-size: $font-size-14;
    color: var(--color-text-tertiary);
    margin: 0;
  }
}

.photo-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: $padding-24;

  :deep(.arco-btn-primary) {
    background: linear-gradient(135deg, $primary 0%, darken($primary, 10%) 100%);
    border: none;
    border-radius: $radius-8;

    &:hover {
      background: linear-gradient(135deg, darken($primary, 5%) 0%, darken($primary, 15%) 100%);
    }
  }
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $padding-24;
}



:deep(.arco-empty) {
  padding: $padding-48 0;
}


.upload-preview {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: $radius-8;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .upload-preview-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: $gray-0;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }
  }

  &:hover .upload-preview-overlay {
    opacity: 1;
  }
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  aspect-ratio: 4 / 3;
  border: 2px dashed var(--color-border);
  border-radius: $radius-8;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: $primary;
    color: $primary;
  }
}

.upload-actions {
  display: flex;
  justify-content: flex-end;
  gap: $padding-12;
  margin-top: $padding-16;
}

@media (max-width: $mobile) {
  .photo-page {
    padding: $padding-16;
  }

  .photo-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: $padding-12;
  }

  .photo-actions {
    margin-bottom: $padding-16;
  }
}
</style>
