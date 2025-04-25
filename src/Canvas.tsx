import React, { useRef, useEffect } from 'react';

interface CanvasProps {
  width: number;
  height: number;
}

export default function Canvas({ width, height }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [prediction, setPrediction] = React.useState('');

  const handleAIPrediction = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const imageData = canvas.toDataURL('image/png');
      console.log('开始发送预测请求:', imageData.substring(0, 50) + '...');
      
      const response = await fetch('http://localhost:3000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP错误! 状态码: ${response.status}`);
      }

      const result = await response.json();
      console.log('预测结果:', result);
      
      if (!result || typeof result !== 'object') {
        throw new Error('API返回无效响应格式');
      }
      
      if (!result.prediction && !result.predictions) {
        throw new Error('API返回数据缺少预测结果');
      }
      
      const finalPrediction = result.prediction || result.predictions?.join('、') || '未知结果';
      setPrediction(finalPrediction);
    } catch (error) {
      console.error('预测失败:', error);
      setPrediction(`预测失败: ${error.message}`);
    }
  };

  // 初始化画布
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
  }, []);

  // 绘制逻辑
  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={() => setIsDrawing(false)}
          style={{ border: '1px solid black', background: 'white' }}
        />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ margin: '20px', fontSize: '24px', minHeight: '30px' }}>
          {prediction}
        </div>
        <div>
          <button onClick={clearCanvas} style={{ margin: '10px' }}>清空画布</button>
          <button onClick={handleAIPrediction} style={{ margin: '10px' }}>AI 猜一猜</button>
        </div>
      </div>
    </div>
  );
}