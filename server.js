const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const OpenAI = require('openai');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 初始化 DashScope 客户端（兼容 OpenAI SDK）
const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY || 'your-api-key', // 从环境变量或直接填写
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
});

// AI 预测端点
app.post('/api/predict', async (req, res) => {
  try {
    const imageData = req.body.image;
    if (!imageData) {
      return res.status(400).json({ error: '缺少图像数据' });
    }

    // 调用 DashScope 视觉模型
    const response = await openai.chat.completions.create({
      model: 'qwen-vl-max', // 或其他视觉模型
      messages: [{
        role: 'user',
        content: [
          { 
            type: 'text', 
            text: '这是一幅画作，请用简体中文回答画的是什么？只返回最可能的3个猜测，用顿号分隔。例如：猫、狗、树' 
          },
          { 
            type: 'image_url',
            image_url: { url: imageData } // 支持 base64 或 URL
          }
        ]
      }],
      max_tokens: 300
    });

    const aiResponse = response.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error('AI返回无效响应');
    }
    
    const predictions = aiResponse.split('、').map(item => item.trim());
    if (predictions.length === 0) {
      throw new Error('AI未返回有效预测结果');
    }

    res.status(200).json({ 
      prediction: predictions.join('、'),
      predictions: predictions,
      fullResponse: aiResponse
    });

  } catch (error) {
    console.error('API 调用失败:', error);
    res.status(500).json({ 
      error: 'AI 服务暂时不可用',
      details: error.message
    });
  }
});

// WebSocket 部分（保持不变）
wss.on('connection', (ws) => {
  console.log('New client connected');
  ws.on('message', (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });
  ws.on('close', () => console.log('Client disconnected'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});