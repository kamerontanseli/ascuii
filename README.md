# ASCII Wireframe Builder

A minimal web application that converts images to ASCII art for wireframing AI agent interfaces.

<img width="817" height="691" alt="Screenshot 2025-07-27 at 18 27 43" src="https://github.com/user-attachments/assets/42428561-5b80-4714-9912-0048efea3d62" />


## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your_actual_api_key_here
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   Open your browser and go to `http://localhost:3000`

## Features

- Upload images (JPEG, PNG, GIF) up to 5MB
- AI-powered conversion to ASCII art using OpenRouter API
- Edit ASCII output directly in the browser
- Export ASCII as a text file

## Usage

1. Click "Choose File" and select an image
2. Click "Upload" to convert to ASCII
3. Edit the ASCII art in the text area if needed
4. Click "Download ASCII" to save as a .txt file

## Requirements

- Node.js 14+
- OpenRouter API key (get one at https://openrouter.ai/)
- Modern web browser
