# AI 你画我猜网页游戏

## 项目概述
一个在线你画我猜游戏，玩家可以在画布上作画，AI系统负责猜测画的是什么内容。

## 功能特点
- 实时画布绘制
- AI智能识别画作内容
- 支持多轮猜测
- 简洁友好的用户界面

## 技术栈
- 前端: React + TypeScript + Vite
- 画布: HTML5 Canvas
- 后端: Node.js + Express
- AI集成: OpenAI Vision API (通过DashScope兼容模式)

## 安装指南
1. 克隆仓库
```bash
git clone https://github.com/your-repo/trea-test.git
```
2. 安装依赖
```bash
cd trea-test
npm install
```
3. 配置环境变量
创建`.env`文件并添加:
```
DASHSCOPE_API_KEY=your-api-key
```

## 使用说明
1. 启动开发服务器
```bash
npm start
```
2. 在画布上绘制图像
3. 点击"AI猜一猜"按钮获取AI预测结果
4. 点击"清空画布"可重新开始

## 注意事项
- 确保已安装Node.js v16+
- 需要有效的DashScope API密钥