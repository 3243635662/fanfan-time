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

    <div class="photo-grid" v-if="photos.length > 0">
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="photo-item"
        @click="handlePhotoClick(photo)"
      >
        <div class="photo-wrapper">
          <img :src="photo.url" :alt="photo.title" loading="lazy" />
          <div class="photo-overlay">
            <div class="photo-info">
              <h3>{{ photo.title }}</h3>
              <p>{{ photo.description }}</p>
              <span class="photo-date">{{ formatDate(photo.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <a-empty v-else description="暂无照片">
      <template #image>
        <AppIcon name="mdi:image-off" :size="64" />
      </template>
      <a-button type="primary" @click="handleUpload">上传第一张照片</a-button>
    </a-empty>

    <a-modal
      v-model:visible="previewVisible"
      :footer="false"
      width="900px"
      centered
      :body-style="{ padding: '0' }"
    >
      <div class="preview-container" v-if="currentPhoto">
        <img :src="currentPhoto.url" :alt="currentPhoto.title" class="preview-image" />
        <div class="preview-info">
          <h2>{{ currentPhoto.title }}</h2>
          <p>{{ currentPhoto.description }}</p>
          <span class="preview-date">发布于 {{ formatDate(currentPhoto.createdAt) }}</span>
        </div>
      </div>
    </a-modal>

    <a-modal
      v-model:visible="uploadVisible"
      title="上传照片"
      :footer="false"
      width="500px"
      centered
    >
      <a-form :model="uploadForm" layout="vertical" @submit.prevent="handleSubmitUpload">
        <a-form-item label="选择照片" required>
          <a-upload
            list-type="picture-card"
            :custom-request="handleCustomUpload"
            :show-upload-list="false"
            accept="image/*"
            @change="handleUploadChange"
          >
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
          <a-textarea
            v-model="uploadForm.description"
            placeholder="描述这张照片的故事"
            :rows="3"
            :max-length="200"
            show-word-limit
          />
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
import { ref, computed, onMounted } from "vue";
import AppIcon from "@/components/AppIcon.vue";

interface Photo {
  id: number;
  url: string;
  title: string;
  description: string;
  createdAt: string;
}

const photos = ref<Photo[]>([]);
const previewVisible = ref(false);
const uploadVisible = ref(false);
const currentPhoto = ref<Photo | null>(null);
const uploading = ref(false);
const uploadFileUrl = ref("");

const uploadForm = ref({
  title: "",
  description: "",
});

const canSubmit = computed(() => {
  return uploadForm.value.title.trim() && uploadFileUrl.value;
});

const mockPhotos: Photo[] = [
  {
    id: 1,
    url: "https://picsum.photos/400/300?random=1",
    title: "美丽的风景",
    description: "这是一张美丽的风景照片",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    url: "https://picsum.photos/400/300?random=2",
    title: "城市夜景",
    description: "城市的夜晚灯火通明",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    url: "https://picsum.photos/400/300?random=3",
    title: "自然风光",
    description: "大自然的鬼斧神工",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 4,
    url: "https://picsum.photos/400/300?random=4",
    title: "海边日落",
    description: "夕阳西下，海边美景",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 5,
    url: "https://picsum.photos/400/300?random=5",
    title: "山间清晨",
    description: "清晨的山间雾气缭绕",
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: 6,
    url: "https://picsum.photos/400/300?random=6",
    title: "花海漫步",
    description: "漫步在花海中",
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
];

onMounted(() => {
  photos.value = mockPhotos;
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const handlePhotoClick = (photo: Photo) => {
  currentPhoto.value = photo;
  previewVisible.value = true;
};

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
    abort() {},
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

.photo-item {
  border-radius: $radius-12;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px var(--color-shadow);

    .photo-overlay {
      opacity: 1;
    }
  }

  .photo-wrapper {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .photo-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 60%);
      opacity: 0;
      transition: opacity 0.3s ease;
      display: flex;
      align-items: flex-end;
      padding: $padding-16;

      .photo-info {
        color: $gray-0;

        h3 {
          font-size: $font-size-16;
          font-weight: 600;
          margin: 0 0 4px;
        }

        p {
          font-size: $font-size-12;
          color: rgba($gray-0, 0.8);
          margin: 0 0 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .photo-date {
          font-size: $font-size-12;
          color: rgba($gray-0, 0.6);
        }
      }
    }
  }
}

:deep(.arco-empty) {
  padding: $padding-48 0;
}

.preview-container {
  display: flex;
  flex-direction: column;
  gap: $padding-16;

  .preview-image {
    width: 100%;
    max-height: 500px;
    object-fit: contain;
    border-radius: $radius-8;
  }

  .preview-info {
    padding: $padding-16;

    h2 {
      font-size: $font-size-20;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 $padding-8;
    }

    p {
      font-size: $font-size-14;
      color: var(--color-text-secondary);
      margin: 0 0 $padding-8;
    }

    .preview-date {
      font-size: $font-size-12;
      color: var(--color-text-tertiary);
    }
  }
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
