# 趣味数学 - 10以内加减法

一个帮助儿童学习基础数学的互动游戏。

## 功能特点

- 生动的动画效果
- 直观的积木展示
- 错题记录功能
- 音效反馈
- 适合5-7岁儿童使用

## 使用方法

### 在线访问
访问 [在线地址] 即可开始游戏。

### 本地运行
1. 解压下载的 `math-game.zip` 文件
2. 选择以下任一方式启动本地服务器：

#### 方式一：使用 Python（推荐）
如果你已安装 Python，打开终端，进入解压后的目录，运行：
```bash
# Python 3.x
python -m http.server 8000

# 或 Python 2.x
python -m SimpleHTTPServer 8000
```
然后在浏览器中访问：http://localhost:8000

#### 方式二：使用 Node.js
如果你已安装 Node.js，打开终端，进入解压后的目录，运行：
```bash
# 全局安装 http-server
npm install -g http-server

# 启动服务器
http-server
```
然后在浏览器中访问显示的地址（通常是 http://localhost:8080）

## 游戏说明

1. 游戏会随机生成10以内的加减法题目
2. 使用积木动画展示计算过程
3. 在输入框中输入答案
4. 点击"✓"按钮或按回车键提交答案
5. 答对会播放音效并进入下一题
6. 答错会显示正确答案和计算过程
7. 点击右上角的"📝"按钮可以查看错题记录
8. 点击右上角的"🔊"按钮可以开关音效

## 注意事项

- 请使用现代浏览器（Chrome、Firefox、Safari、Edge等）访问
- 确保浏览器允许播放声音
- 建议使用全屏模式以获得最佳体验

## 技术栈

- React
- TypeScript
- Styled Components
- Vite 