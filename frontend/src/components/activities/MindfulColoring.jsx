import { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography, Slider } from '@mui/material';
import { motion } from 'framer-motion';
import sounds from '../../utils/sounds';

function MindfulColoring() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FF9AA2');
  const [brushSize, setBrushSize] = useState(5);
  const [context, setContext] = useState(null);

  const colors = [
    '#FF9AA2', // Pink
    '#FFB7B2', // Light Pink
    '#FFDAC1', // Peach
    '#E2F0CB', // Light Green
    '#B5EAD7', // Mint
    '#C7CEEA', // Light Blue
    '#9B9B9B', // Gray
    '#FFFFFF', // White
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setContext(ctx);

    // Set white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw mandala outline
    drawMandalaOutline(ctx, canvas.width / 2, canvas.height / 2);

    // Play background sound
    sounds.meditation.play();
    sounds.meditation.volume(0.2);

    return () => {
      sounds.meditation.stop();
    };
  }, []);

  const drawMandalaOutline = (ctx, centerX, centerY) => {
    ctx.beginPath();
    ctx.strokeStyle = '#DDDDDD';
    ctx.lineWidth = 1;

    // Draw circles
    for (let r = 40; r <= 300; r += 60) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw radial lines
    for (let angle = 0; angle < 360; angle += 30) {
      const radian = (angle * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(radian) * 300,
        centerY + Math.sin(radian) * 300
      );
      ctx.stroke();
    }
  };

  const startDrawing = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
    sounds.star.play();
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineTo(x, y);
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawMandalaOutline(ctx, canvas.width / 2, canvas.height / 2);
    sounds.match.play();
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '80vh',
        position: 'relative',
        backgroundColor: '#FFF5F5',
        borderRadius: '20px',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Mindful Coloring 🎨
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        {colors.map((c) => (
          <motion.div
            key={c}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Box
              onClick={() => {
                setColor(c);
                sounds.match.play();
              }}
              sx={{
                width: 40,
                height: 40,
                backgroundColor: c,
                borderRadius: '50%',
                cursor: 'pointer',
                border: c === color ? '3px solid #444' : '1px solid #ddd',
              }}
            />
          </motion.div>
        ))}
      </Box>

      <Box sx={{ width: 300, mb: 2 }}>
        <Typography gutterBottom>Brush Size</Typography>
        <Slider
          value={brushSize}
          onChange={(e, newValue) => setBrushSize(newValue)}
          min={1}
          max={30}
          valueLabelDisplay="auto"
        />
      </Box>

      <Box
        sx={{
          border: '1px solid #ddd',
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: '#fff',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          style={{ touchAction: 'none' }}
        />
      </Box>

      <Button
        variant="contained"
        onClick={clearCanvas}
        sx={{ mt: 2, fontSize: '1.1rem', px: 4 }}
      >
        Clear Canvas
      </Button>
    </Box>
  );
}

export default MindfulColoring; 