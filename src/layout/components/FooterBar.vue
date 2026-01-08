<template>
  <footer class="footer-bar">
    <div class="footer-content">
      <!-- 简介与链接区域 -->
      <div class="main-info">
        <div class="brand-section">
          <h3 class="title">fanfan Time</h3>
          <p class="desc">为便于交流的留言平台，不仅用于交流，也是一场记录。</p>
        </div>

        <div class="links-section">
          <a href="https://github.com/3243635662" target="_blank" title="GitHub" class="link-item github">
            <Icon icon="mdi:github" width="20" />
            <span>GitHub</span>
          </a>
          <a href="https://gitee.com/Fan_Fan_Fan8" target="_blank" title="Gitee" class="link-item gitee">
            <Icon icon="simple-icons:gitee" width="20" />
            <span>Gitee</span>
          </a>
          <a href="https://fanblog.top" target="_blank" title="个人站点" class="link-item blog">
            <Icon icon="mdi:web" width="20" />
            <span>个人站点</span>
          </a>
        </div>
      </div>

      <!-- 底部版权与备案 -->
      <div class="bottom-info">
        <div class="copyright-row">
          <span>Copyright ©2025 @fanfan</span>
          <span class="divider">|</span>
          <a href="https://beian.miit.gov.cn/" target="_blank">赣ICP备2025074747号-1</a>
        </div>
        <div class="beian-row">
          <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=36048202000129" target="_blank"
            class="beian-link">
            <img src="@/assets/images/beian.png" alt="备案图标" class="beian-icon" />
            <span>赣公网安备36048202000129号</span>
          </a>
          <span class="divider">|</span>
          <span>Powered by 火山云</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.footer-bar {
  width: 100%;
  position: relative;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  padding: 0.8rem 1rem;
  font-size: $font-size-12;
  flex-shrink: 0;
  height: auto;
  min-height: 135px;
  box-sizing: border-box;
  transition: all var(--transition-duration) ease;
  border-top: 1px solid var(--color-border);

  .footer-content {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .main-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.8rem;
    border-bottom: 1px solid var(--color-border);

    .brand-section {
      text-align: left;

      .title {
        font-size: 1.1rem;
        font-weight: 700;
        margin-bottom: 0.2rem;
        background: linear-gradient(90deg, #a18cd1 0%, #fbc2eb 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .desc {
        font-size: $font-size-12;
        color: var(--color-text-tertiary);
        max-width: 400px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .links-section {
      display: flex;
      gap: 1rem;
      align-items: center;

      .link-item {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        text-decoration: none;
        font-size: $font-size-12;
        font-weight: 500;
        transition: all 0.3s ease;
        padding: 0.4rem 0.8rem;
        border-radius: $radius-6;
        background: var(--color-bg-tertiary);
        color: var(--color-text-secondary);

        &:hover {
          transform: translateY(-2px);
          background: var(--color-bg-secondary);
          color: var(--color-text-primary);
        }

        &.github {
          color: var(--color-text-secondary);

          &:hover {
            color: #888383;
          }
        }

        &.gitee {
          color: #e6a23c;

          &:hover {
            color: #ffc53d;
          }
        }

        &.blog {
          color: $primary;

          &:hover {
            color: #69c0ff;
          }
        }
      }
    }
  }

  .bottom-info {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    font-size: 12px;
    color: var(--color-text-tertiary);

    a {
      color: var(--color-text-tertiary);
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: var(--color-text-primary);
        text-decoration: underline;
      }
    }

    .divider {
      margin: 0 0.5rem;
      color: var(--color-border);
    }

    .copyright-row,
    .beian-row {
      display: flex;
      align-items: center;
    }

    .beian-link {
      display: flex;
      align-items: center;
      gap: 0.3rem;

      .beian-icon {
        width: 14px;
        height: 14px;
        filter: brightness(0.8);
      }
    }
  }
}

@media (max-width: $mobile) {
  .footer-bar {
    padding: 1rem;

    .main-info {
      flex-direction: column;
      text-align: center;
      gap: 1rem;

      .brand-section {
        text-align: center;

        .desc {
          white-space: normal;
        }
      }

      .links-section {
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
      }
    }

    .bottom-info {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
}
</style>
