![cover](cover.png)

# Schedule AI Backend

> Serverless AI-powered service that converts audio to text and extracts structured task information using Cloudflare Workers AI.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/muhammadazhariqbal/schedule-ai-backend)

## ✨ Features

- 🎤 **Audio-to-Text Transcription** - Convert audio files to text using OpenAI Whisper
- 📋 **Task Extraction** - Extract structured schedule/task information from text using Cloudflare AI (gpt-oss-120b)
- ⚡ **Serverless Architecture** - Runs on Cloudflare Workers for global edge deployment
- 🚀 **High Performance** - Low latency with Cloudflare's edge network
- 💰 **Cost Effective** - Pay only for what you use

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  HTTP Layer     │  (src/index.js)
│  Request Router │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Service Layer   │  (src/schedular/)
│ Orchestration   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   AI Layer      │  (src/llms/)
│ Whisper & GPT   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Utility Layer   │  (src/utils/)
│  JSON Parsing   │
└─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [Cloudflare Account](https://dash.cloudflare.com/sign-up) (free tier available)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/muhammadazhariqbal/schedule-ai-backend.git
   cd schedule-ai-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Login to Cloudflare**

   ```bash
   wrangler login
   ```

4. **Deploy to Cloudflare Workers**

   ```bash
   wrangler deploy
   ```

   After deployment, you'll receive a URL like:

   ```
   https://schedule-ai-backend.<your-subdomain>.workers.dev
   ```

## 📡 API Endpoints

### 1. Audio-to-Text Transcription

Convert audio files to text using OpenAI Whisper model.

**Endpoint:** `POST /audio-to-text`

**Request:**

```bash
curl -X POST https://your-worker.workers.dev/audio-to-text \
  -H "Content-Type: application/octet-stream" \
  --data-binary @audio-file.wav
```

Or with JavaScript/TypeScript:

```javascript
const audioFile = await fetch('audio.wav').then((r) => r.arrayBuffer());

const response = await fetch('https://your-worker.workers.dev/audio-to-text', {
	method: 'POST',
	body: audioFile,
	headers: {
		'Content-Type': 'application/octet-stream',
	},
});

const result = await response.json();
```

**Response:**

```json
{
	"text": "Schedule a meeting with the team tomorrow at 3 PM",
	"word_count": 9,
	"words": [
		{
			"word": "Schedule",
			"start": 0.0,
			"end": 0.5
		},
		{
			"word": "a",
			"start": 0.5,
			"end": 0.6
		},
		{
			"word": "meeting",
			"start": 0.6,
			"end": 1.0
		}
		// ... more words
	],
	"vtt": "WEBVTT\n\n00:00:00.000 --> 00:00:05.000\nSchedule a meeting with the team tomorrow at 3 PM"
}
```

**Response Fields:**

- `text` (string) - Complete transcribed text
- `word_count` (number) - Total number of words transcribed
- `words` (array) - Individual words with timestamps
  - `word` (string) - The word itself
  - `start` (number) - Start time in seconds
  - `end` (number) - End time in seconds
- `vtt` (string) - WebVTT format subtitle data

---

### 2. Extract Task Information

Extract structured schedule/task information from transcribed text.

**Endpoint:** `POST /extract-values`

**Request:**

```bash
curl -X POST https://your-worker.workers.dev/extract-values \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Schedule a meeting with John tomorrow at 3 PM",
    "now": "2024-01-15T10:00:00Z"
  }'
```

**Request Body:**

```json
{
	"text": "Remind me to call mom next Monday at 5 PM",
	"now": "2024-01-15T10:00:00Z"
}
```

**Parameters:**

- `text` (string, required) - The text to extract task information from
- `now` (string, required) - Current datetime in ISO 8601 format (used for relative date calculations)

**Response:**

```json
{
	"task": "Call mom",
	"date": "2024-01-22",
	"time": "17:00",
	"priority": "medium",
	"reminder_type": "scheduled"
}
```

**Note:** The exact response structure depends on your `extractReminderData()` parser and SYSTEM_PROMPT configuration.

## 🔧 Configuration

### Environment Variables

No API keys or environment variables are required! Cloudflare Workers AI is automatically bound to your worker.

### AI Models Used

- **Whisper (`@cf/openai/whisper`)** - Audio transcription
- **GPT-OSS-120B (`@cf/openai/gpt-oss-120b`)** - Text-based task extraction

## 🛠️ Development

### Local Development

```bash
# Start local development server
npm run dev
# or
wrangler dev
```

This will start a local server at `http://localhost:8787`

### Project Structure

```
schedule-ai-backend/
├── src/
│   ├── index.js           # Main HTTP handler & routing
│   ├── schedular/         # Service orchestration layer
│   ├── llms/              # AI model interaction logic
│   └── utils/             # Helper functions & parsers
├── wrangler.toml          # Cloudflare Workers configuration
├── package.json           # Node.js dependencies
└── README.md              # This file
```

### Testing

```bash
# Test audio-to-text endpoint with an audio file
curl -X POST http://localhost:8787/audio-to-text \
  -H "Content-Type: application/octet-stream" \
  --data-binary @sample-audio.wav

# Test extract-values endpoint
curl -X POST http://localhost:8787/extract-values \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Book dentist appointment next Monday at 2pm",
    "now": "2024-01-15T10:00:00Z"
  }'
```

## 📊 Use Cases

### Voice-to-Schedule App

Build a mobile/web app where users can speak their tasks and automatically add them to their calendar.

### Meeting Transcription

Record meetings and automatically extract action items and deadlines.

### Voice Notes Organization

Convert voice memos into structured, searchable task lists.

### Smart Assistants

Power voice-based personal assistants with task extraction capabilities.

## 🔒 Security

- ✅ No API keys required in code
- ✅ Runs on Cloudflare's secure edge network
- ✅ HTTPS by default
- ✅ No sensitive data stored

### Best Practices

1. **Input Validation** - Always validate audio data before processing
2. **Rate Limiting** - Implement rate limiting for production use
3. **Authentication** - Add authentication layer for production deployments
4. **Error Handling** - The service includes comprehensive error handling

## 🌍 Deployment

### Deploy to Production

```bash
# Deploy to production
wrangler deploy

# Deploy to a custom route
wrangler deploy --route "api.yourdomain.com/*"
```

### Custom Domain

1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to Workers & Pages
3. Select your worker
4. Add a custom domain or route

## 📈 Performance

- **Global Edge Network** - Deployed across 300+ cities worldwide
- **Low Latency** - ~50ms response times globally
- **High Availability** - 99.99% uptime SLA
- **Auto-scaling** - Handles traffic spikes automatically

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Keep commits atomic and well-described

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Muhammad Azhar Iqbal**

- GitHub: [@muhammadazhariqbal](https://github.com/muhammadazhariqbal)

## 🙏 Acknowledgments

- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless platform
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) - AI models
- [OpenAI Whisper](https://openai.com/research/whisper) - Audio transcription model

## 📚 Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)

## 🐛 Troubleshooting

### Common Issues

**Issue:** `Error: Not authenticated`

```bash
# Solution: Login to Cloudflare
wrangler login
```

**Issue:** `Error: No account_id found`

```bash
# Solution: Check wrangler.toml has correct account_id
wrangler whoami
```

**Issue:** Audio transcription fails

- Ensure audio data is in correct format (8-bit unsigned integer array)
- Check audio file size is within limits
- Verify audio is clear and audible

## 💬 Support

- 📧 Open an [Issue](https://github.com/muhammadazhariqbal/schedule-ai-backend/issues)
- 💡 Start a [Discussion](https://github.com/muhammadazhariqbal/schedule-ai-backend/discussions)
- 📖 Check the [Wiki](https://github.com/muhammadazhariqbal/schedule-ai-backend/wiki)

---

**Built with ❤️ using Cloudflare Workers AI**

⭐ Star this repo if you find it helpful!
