// 设置画布
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数
function random(min,max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

// 生成随机颜色值的函数
function randomColor() {
  const color = 'rgb(' +
                random(0, 255) + ',' +
                random(0, 255) + ',' +
                random(0, 255) + ')';
  return color;
}

// 定义 Ball 构造器
function Ball(x, y, velX, velY, color, size) {
  this.x = x;  //圆心横坐标
  this.y = y;  //圆心纵坐标
  this.velX = velX;  //小球水平速度
  this.velY = velY;  //小球垂直速度
  this.color = color;  //小球的颜色
  this.size = size;  //小球的半径
}

// 定义彩球绘制函数
Ball.prototype.draw = function() {
  ctx.beginPath(); //画图声明
  ctx.fillStyle = this.color;   //定义小球的颜色
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);  //参数包括圆心坐标，小球半径，圆弧夹角
  ctx.fill();  //结束绘画声明
};

// 定义彩球更新函数
Ball.prototype.update = function() {
  if((this.x + this.size) >= width) { //如果小球碰到画布右边界，反转小球水平速度
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) { //如果小球碰到画布左边界，同理
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {  //如果小球碰到画布下边界，反转小球垂直速度
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) { //如果小球碰到画布上边界，同理
    this.velY = -(this.velY);
  }

  this.x += this.velX;  //根据速度更新每一帧的小球横坐标
  this.y += this.velY;   //更新小球纵坐标
};

// 定义碰撞检测函数
Ball.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) { //遍历数组中的每一个小球
    if(this !== balls[j]) {   //排除自身，即只检测其他小球
      const dx = this.x - balls[j].x;   //小球之间的横坐标差，用于计算两个小球之间的距离
      const dy = this.y - balls[j].y;   //小球之间的纵坐标差
      const distance = Math.sqrt(dx * dx + dy * dy);   //根据勾股定理计算小球之间的距离

      if (distance < this.size + balls[j].size) {    //如果两个小球之间的距离小于两个小球半径之和，则发生碰撞
        balls[j].color = this.color = randomColor();  //碰撞后，两个小球的颜色都变为随机颜色
      }
    }
  }
};

// 定义一个数组，生成并保存所有的球
let balls = [];

while(balls.length < 25) {
  const size = random(10,20);
  let ball = new Ball(
    // 为避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
    random(0 + size, width - size),    //随机生成圆心横坐标
    random(0 + size, height - size),   //随机生成圆心纵坐标
    random(-7, 7),  //随机生成水平速度
    random(-7, 7),  //随机生成垂直速度
    randomColor(),  //随机生成颜色
    size
  );
  balls.push(ball);
}

// 定义一个循环来不停地播放
function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';  //让背景填充色半透明，形成拖影效果
  ctx.fillRect(0,0,width,height);  //在屏幕上画一个矩形，清除上一帧的画面，实现动画效果

  for(let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  requestAnimationFrame(loop); // 循环调用函数，得到流畅的动画效果
}

loop();