<template>
  <div class="canvas-container">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>



<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Application, Assets, Container, Graphics, Sprite, Text, TextStyle,  } from 'pixi.js';
import { initDevtools} from '@pixi/devtools';
const canvasRef = ref<HTMLCanvasElement | null>(null);
let app: Application | null = null;
onMounted(async () => {
  if (!canvasRef.value) return;


  // 创建一个app
  app = new Application();
  //初始化到现有的canvas中
  await app.init({
    background: '#000',
    canvas: canvasRef.value,
    resizeTo: canvasRef.value.parentElement || window,
    backgroundAlpha: 0.8,
    antialias: true, // 开启抗锯齿
  })
  // 设置透明度或者：app.renderer.background.alpha = 0.5;
  initDevtools({app});

// 创建一个容器，用来存放所有的元素
const container = new Container();
app.stage.addChild(container);

// 填充一个矩形
  const rectangle = new Graphics();
  

  rectangle.rect(0, 0, 100, 100).fill({
    color:'#00FFFF',
    alpha:0.5
  });
// container.addChild(rectangle);


app.stage.addChild(rectangle);

// 填充一个星星
  const star = new Graphics().star(
    100, 200, 20, 80, 4, Math.PI / 2,
  ).fill({
    color:'#fff',
  });
  app.stage.addChild(star);

// 填充一个圆
  const circle = new Graphics().circle(100, 400, 50).fill({
    color:'#00FFFF',
  });
  app.stage.addChild(circle);

  // 填充一个倒圆角矩形
  const chamferRect = new Graphics().chamferRect(200, 400, 100, 100, 10).fill({
    color:'#00FFFF',
  });
  app.stage.addChild(chamferRect);

  await Assets.load({
    src: '/src/assets/font/清韵文楷.ttf',
    data: {
      family: '清韵文楷',
    }
  })

  // 填充文本
  const text1 = new Text({
    
    text: 'hello world',
    x: 50,
    y: 150,
    style:{
      fontSize:32,
      fill:'#fff',
    }
  });

  app.stage.addChild(text1);


const style = new TextStyle({
    fill: "#33d771",
    fontFamily: "清韵文楷",
    fontStyle: "italic",
    fontWeight: '500',
});

  const text2 = new Text({
    x: 50,
    y: 200,
    text:'你好，世界',
    style:style,
});

  app.stage.addChild(text2);

  // 创建精灵

  const texture = await Assets.load('/src/assets/images/vue.jpg')
  const sprite1 = new Sprite({
    texture,
    x: 200,
    y: 200,
    // scale: {x:0.01,y:0.02}
    width: 200,
    height: 200,
  })
  const sprite2 = new Sprite({
    texture,
    x: 400,
    y: 400,
    // scale: {x:0.01,y:0.02}
    width: 200,
    height: 200,
  })
  app.stage.addChild(sprite1)
  app.stage.addChild(sprite2)


  // 变换
  // sprite.rotation = Math.PI / 6;  // 默认旋转点是左上角


  // 使用pivot设置旋转中心  不改变精灵位置
  sprite1.pivot.set(100, 100);

  const centerMarker = new Graphics();
  centerMarker.circle(0, 0, 5).fill({ color: '#ff0000' });
  // 红点位置 = 精灵位置 + pivot偏移
  centerMarker.x = sprite1.x - sprite1.pivot.x;
  centerMarker.y = sprite1.y - sprite1.pivot.y;
  app.stage.addChild(centerMarker);




// 使用anchor设置旋转中心  改变精灵位置
  sprite2.anchor.set(0.5, 0.5);

  const centerMarker2 = new Graphics();
  centerMarker2.circle(0, 0, 5).fill({ color: '#ff0000' });
  // 红点位置 = 精灵位置 + anchor偏移
  centerMarker2.x = sprite2.x - sprite2.anchor.x * sprite2.width;
  centerMarker2.y = sprite2.y - sprite2.anchor.y * sprite2.height;
  app.stage.addChild(centerMarker2);



  // 旋转动画
  const rotationFn = () => {
    sprite1.rotation += Math.PI / 120;
    sprite2.rotation += Math.PI / 120;
  }
  app.ticker.add(rotationFn);


  // 鼠标事件
  sprite2.eventMode = 'static';
  sprite2.cursor = 'pointer';
  sprite2.on('pointerdown', () => {
    sprite2.x+=5;
  })
  const screenStar = new Graphics()
  app.ticker.add(() => {
    screenStar.star(Math.random() * (app?.screen.width || 0), Math.random() * (app?.screen.height || 0), 20, 80, 4, Math.PI / 2,).fill({
      color:'#fff',
    });
  })
  container.addChild(screenStar);



const container2 = new Container();
app.stage.addChild(container2);
container2.position.set(600,0)
  // 预加载本地图片资源
  const karinaTexture1 = await Assets.load("/assets/images/karina1.webp");
  const karinaSprite1 = new Sprite(karinaTexture1);
  karinaSprite1.x = 0;
  karinaSprite1.y = 0;

  const karinaTexture2 = await Assets.load("/assets/images/karina2.webp");
  const karinaSprite2 = new Sprite(karinaTexture2);
  karinaSprite2.x = 300;
  karinaSprite2.y = 0;
  karinaSprite1.scale.set(0.5,0.5);
  karinaSprite2.scale.set(0.5,0.5);

  container2.addChild(karinaSprite1);
  container2.addChild(karinaSprite2);

  const getPosition = () => { 
    console.log(`精灵图1的相对位置: x=${karinaSprite1.x}, y=${karinaSprite1.y}`);
    console.log(`精灵图2的相对位置: x=${karinaSprite2.x}, y=${karinaSprite2.y}`);
    console.log(`精灵图1的全局位置: x=${karinaSprite1.getGlobalPosition().x}, y=${karinaSprite1.getGlobalPosition().y}`);
    console.log(`精灵图2的全局位置: x=${karinaSprite2.getGlobalPosition().x}, y=${karinaSprite2.getGlobalPosition().y}`);
  }
  getPosition()



});

onUnmounted(() => {
  // Clean up PixiJS application when component is unmounted
  app?.destroy(true);
});
</script>


<style lang="scss" scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  overflow: auto;

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
