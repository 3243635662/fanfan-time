<template>
  <div v-if="showDetailModal" class="modal-overlay" @click.self="closeDetailModal">
    <div class="modal-content">
      <div class="modal-left">
        <img :src="post.image" alt="post" class="post-image" />
      </div>
      
      <div class="modal-right">
        <div class="modal-header">
          <div class="user-info">
            <img :src="post.author.avatar" alt="avatar" class="avatar" />
            <div class="user-details">
              <h3>{{ post.author.username }}</h3>
              <button class="follow-btn" @click="toggleFollow">
                {{ isFollowing ? '已关注' : '关注' }}
              </button>
            </div>
          </div>
          <button class="close-btn" @click="closeDetailModal">&times;</button>
        </div>
        
        <div class="post-text">
          <p>{{ post.content }}</p>
          <div class="hashtags">
            <span v-for="tag in post.tags" :key="tag" class="tag">
              #{{ tag }}
            </span>
          </div>
        </div>
        
        <div class="post-actions">
          <div class="action-btn" @click="toggleLike">
            <i :class="['fas', 'fa-heart', { active: isLiked }]"></i>
            <span>{{ post.likes }}</span>
          </div>
          <div class="action-btn">
            <i class="fas fa-comment"></i>
            <span>{{ post.comments }}</span>
          </div>
          <div class="action-btn">
            <i class="fas fa-share"></i>
            <span>{{ post.shares }}</span>
          </div>
        </div>
        
        <div class="comments-section">
          <h4>评论 ({{ post.comments }})</h4>
          <div class="comments-list">
            <div v-for="comment in post.commentsList" :key="comment.id" class="comment">
              <img :src="comment.avatar" alt="comment-avatar" class="comment-avatar" />
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.author }}</span>
                  <span class="comment-time">{{ comment.time }}</span>
                </div>
                <p>{{ comment.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePhotoStore } from '@/store/photo'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const { showDetailModal } = storeToRefs(usePhotoStore())
const { closeDetailModal } = usePhotoStore()

const isFollowing = ref(false)
const isLiked = ref(false)

const post = ref({
  id: 1,
  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  content: '这是一张美丽的风景照片，记录了美好的瞬间。大自然的力量总是让人感到震撼和敬畏。',
  likes: 128,
  comments: 32,
  shares: 15,
  tags: ['风景', '摄影', '自然'],
  author: {
    username: 'fanfan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fanfan'
  },
  commentsList: [
    {
      id: 1,
      author: 'user1',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
      text: '太美了！请问这是在哪里拍的？',
      time: '2小时前'
    },
    {
      id: 2,
      author: 'user2',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
      text: '构图很棒，色彩也很和谐',
      time: '1小时前'
    },
    {
      id: 3,
      author: 'user3',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
      text: '学习了，下次我也试试这种拍摄角度',
      time: '30分钟前'
    }
  ]
})

const toggleFollow = () => {
  isFollowing.value = !isFollowing.value
}

const toggleLike = () => {
  isLiked.value = !isLiked.value
  post.value.likes += isLiked.value ? 1 : -1
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 1000px;
  max-height: 85vh;
  display: flex;
  overflow: hidden;
  position: relative;
}

.modal-left {
  flex: 1;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.modal-right {
  flex: 0 0 400px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details h3 {
  margin: 0;
  font-size: 16px;
}

.follow-btn {
  background: #ff2442;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.follow-btn:hover {
  background: #ff1f3d;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #333;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.post-text {
  padding: 15px;
  line-height: 1.6;
  border-bottom: 1px solid #eee;
}

.hashtags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.tag {
  color: #ff2442;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.tag:hover {
  opacity: 0.7;
}

.post-actions {
  display: flex;
  justify-content: space-around;
  padding: 15px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

.action-btn i {
  font-size: 20px;
  color: #666;
  transition: color 0.3s ease;
}

.action-btn i.active {
  color: #ff2442;
}

.action-btn span {
  font-size: 12px;
  color: #666;
}

.comments-section {
  padding: 15px;
  flex: 1;
  overflow-y: auto;
}

.comments-section h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
}

.comments-list {
  margin-top: 15px;
}

.comment {
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.comment:last-child {
  border-bottom: none;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.comment-author {
  font-weight: bold;
  font-size: 14px;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.dark-mode {
  .modal-content {
    background: #1a1a1a;
  }

  .modal-header {
    border-bottom-color: #333;
  }

  .user-details h3 {
    color: #fff;
  }

  .close-btn {
    color: #999;
  }

  .close-btn:hover {
    color: #fff;
  }

  .post-text {
    color: #e0e0e0;
    border-bottom-color: #333;
  }

  .post-actions {
    border-bottom-color: #333;
  }

  .action-btn i {
    color: #999;
  }

  .action-btn span {
    color: #999;
  }

  .comments-section h4 {
    color: #fff;
  }

  .comment {
    border-bottom-color: #333;
  }

  .comment-author {
    color: #fff;
  }

  .comment p {
    color: #e0e0e0;
  }
}

@media (max-width: 768px) {
  .modal-content {
    flex-direction: column;
    max-height: 90vh;
  }

  .modal-left {
    flex: 0 0 auto;
    height: 50%;
  }

  .modal-right {
    flex: 1;
    width: 100%;
  }
}
</style>
