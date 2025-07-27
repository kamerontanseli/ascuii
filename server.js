const express = require('express');
const multer = require('multer');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

app.use(express.static('public'));

const { streamOpenRouter } = require('./utils/streamOpenRouter');
const { chat } = require('./utils/chat');

const { validateUpload } = require('./utils/validate');

app.post('/upload', upload.single('image'), async (req, res) => {
  if (validateUpload(req, res)) return;

  const base64Image = req.file.buffer.toString('base64');
  const model = 'openai/gpt-4.1-mini';
  const messages = [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Convert this UI sketch to ASCII art for wireframing. Use Unicode box drawing characters like ┏━━━┓ ┃ ┗━━━┛ ┌───┐ │ └───┘ for clean borders and structure. Output ONLY the ASCII art wireframe, with NO explanation, NO heading, NO markdown, and NO code block. Do not include any commentary or extra text—just the ASCII art itself.' },
        { type: 'image_url', image_url: { url: `data:${req.file.mimetype};base64,${base64Image}` } }
      ]
    }
  ];
  try {
    const openrouterRes = await chat({ model, messages, stream: true });
    streamOpenRouter({ axios, res, axiosConfig: { ...openrouterRes.config, data: openrouterRes.data } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process image with AI.' });
  }
});


app.post('/refine', upload.single('image'), async (req, res) => {
  if (validateUpload(req, res, { requireAscii: true, requireMessage: true })) return;
  const base64Image = req.file.buffer.toString('base64');
  const ascii = req.body.ascii;
  const message = req.body.message;
  const prompt = `Refine this ASCII art wireframe based on the following feedback: ${message}\n\nHere is the previous ASCII art:\n${ascii}\n\nOutput ONLY the ASCII art wireframe, with NO explanation, NO heading, NO markdown, and NO code block. Do not include any commentary or extra text—just the ASCII art itself.`;
  const model = 'openai/gpt-4.1-mini';
  const messages = [
    {
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: `data:${req.file.mimetype};base64,${base64Image}` } }
      ]
    }
  ];
  try {
    const openrouterRes = await chat({ model, messages, stream: true });
    streamOpenRouter({ axios, res, axiosConfig: { ...openrouterRes.config, data: openrouterRes.data } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to refine ASCII art.' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));