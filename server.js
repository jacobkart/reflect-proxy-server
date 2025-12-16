// proxy-server/server.js
// Прокси-сервер для Reflect App
// Перенаправляет запросы к AssemblyAI и Claude API

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Здоровье сервера
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Reflect Proxy Server' });
});

// ==========================================
// AssemblyAI Proxy
// ==========================================

// Загрузка аудио в AssemblyAI
app.post('/api/assemblyai/upload', async (req, res) => {
  try {
    const { audioBase64 } = req.body;
    const apiKey = process.env.ASSEMBLYAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'AssemblyAI API key not configured' });
    }

    const response = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'content-type': 'application/octet-stream',
      },
      body: Buffer.from(audioBase64, 'base64'),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('AssemblyAI upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Создание транскрипции в AssemblyAI
app.post('/api/assemblyai/transcript', async (req, res) => {
  try {
    const transcriptRequest = req.body;
    const apiKey = process.env.ASSEMBLYAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'AssemblyAI API key not configured' });
    }

    const response = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(transcriptRequest),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('AssemblyAI transcript error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Получение статуса транскрипции
app.get('/api/assemblyai/transcript/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const apiKey = process.env.ASSEMBLYAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'AssemblyAI API key not configured' });
    }

    const response = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
      headers: {
        'authorization': apiKey,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('AssemblyAI status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// Claude API Proxy
// ==========================================

app.post('/api/claude/messages', async (req, res) => {
  try {
    const messageRequest = req.body;
    const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Claude API key not configured' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(messageRequest),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Claude API error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Reflect Proxy Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
