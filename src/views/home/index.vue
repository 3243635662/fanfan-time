<template>
  <div class="home-page">
    <TextCursor
      text="💚"
      :delay="0.5"
      :spacing="60"
      :follow-mouse-direction="true"
      :random-float="true"
      :exit-duration="0.8"
      :removal-interval="500"
      :max-points="10"
    />
    <!-- 内容层 -->
    <div class="title">
      <Magnet
        :padding="120"
        :disabled="false"
        :magnet-strength="3"
        active-transition="transform 0.2s ease-out"
        inactive-transition="transform 0.6s ease-in-out"
        wrapper-class-name="custom-wrapper"
        inner-class-name="custom-inner"
      >
        <div class="magnet-element">
          <h1>{{ DockTitle }}</h1>
          <p>值得记录，当然也值得回味。</p>
        </div>
      </Magnet>
    </div>
    <div class="tabs-container">
      <div class="tabs-wrapper">
        <a-tabs
          type="rounded"
          :default-active-key="1"
          lazy-load
          :animation="true"
          class="custom-tabs"
        >
          <a-tab-pane v-for="item in tabsData" :key="item.key" :title="item.title" >
            <!-- 内容区域 -->
            <div class="tab-content">
              <div class="cards-grid">
                <Card 
                  v-for="(msg, index) in messages" 
                  :key="index"
                  :item="msg"
                  :background-color="getCardColor(index)"
                />
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
  

   
</template>

<script setup lang="ts">
import type { TabsDataItem } from "@/types/home"; // 引入类型
  import { ref } from "vue";
import { useSettingStore } from "@/store/setting";
import Magnet from "@/components/MotionEffect/Magnet.vue";
import TextCursor from "@/components/MotionEffect/TextCursor.vue";
import { storeToRefs } from "pinia";
import { tabsDataJSON } from "@/utils/data.json";
import Card from "./components/card.vue";

const { DockTitle } = storeToRefs(useSettingStore());
// 使用 TabsDataItem[] 表示这是一个对象数组
const tabsData = ref<TabsDataItem[]>(
  tabsDataJSON
)

const messages = [
  { time: '11/23 16:50', tag: '留言', content: 'jiayi udhwuida', likedCount: 2, commentCount: 3, username: '2769566671' },
  { time: '11/22 11:36', tag: '留言', content: 'UI设计地像是一个商业网站', likedCount: 1, commentCount: 0, username: '友迪' },
  { time: '11/20 22:55', tag: '留言', content: '感谢分享！已经在学习博主的项目啦~', likedCount: 1, commentCount: 0, username: '匿名' },
  { time: '11/19 21:13', tag: '留言', content: '学习', likedCount: 2, commentCount: 1, username: '匿名' },
  { time: '11/18 10:34', tag: '门标', content: '确实很好看，已经在模仿学习了', likedCount: 2, commentCount: 0, username: '匿名' },
  { time: '11/15 13:11', tag: '留言', content: '细节做得真好', likedCount: 1, commentCount: 0, username: 'lq' },
];

const cardColors = [
  '#ebd4d0', '#efe4fd', '#efe4fd', // rose, lavender
  '#cbe4e9', '#fef6de', '#e2f7d9', // sky, cream, mint
  '#cbe4e9', '#ebd4d0'
];

const getCardColor = (index: number) => {
  return cardColors[index % cardColors.length];
};

</script>

<style scoped lang="scss">
.home-page {
  position: relative;
  min-height: calc(100vh - 20px);
  overflow: hidden;

  .title {
    position: relative;
    z-index: 1;
    margin-bottom: 20px;
    padding: $padding-16;
    text-align: center;

    h1 {
      font-size: 1.6rem;
      margin-bottom: 0.5rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    p {
      font-size: 12px;
      opacity: 0.8;
    }
  }
}
.tabs-container {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $padding-16;
  margin-bottom: 20px;

  .tabs-wrapper {
    width: 100%;
    
    .custom-tabs {
      :deep(.arco-tabs-nav) {
        display: flex;
        justify-content: center;
        width: 100%;
        
        .arco-tabs-nav-tab-list {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
          width: fit-content;
        }
        
        .arco-tabs-nav-wrap {
          display: flex;
          justify-content: center;
          width: 100%;
        }
      }
      
      :deep(.arco-tabs-content) {
        .arco-tabs-content-item {
          padding: 0;
        }
      }
    }
    
    .tab-content {
      padding: 24px;
      min-height: 200px;
       display: flex; // This was centering content, we want grid
       align-items: center;
       justify-content: center;
      font-size: 16px;
      
      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
      }
    }
  }
}
</style>
