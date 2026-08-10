# 🚀 EQUORA AI — Conversational Financial Market Intelligence

Ask Anything. Understand the Market.

EQUORA AI is a conversational financial AI platform where users can ask natural-language questions about stocks, companies, markets, investing, trading, technical analysis, fundamental metrics, IPOs, ETFs, options, futures, macroeconomics, calculations, and uploaded annual reports.

---

## 🏗️ Architecture

```
User Query ("Why did TCS fall today?")
                 │
                 ▼
       ┌───────────────────┐
       │     EQUORA AI     │
       │   AI Orchestrator │
       └─────────┬─────────┘
                 │ (Intent Routing & Tool Calling)
     ┌───────────┼───────────┬─────────────┐
     ▼           ▼           ▼             ▼
  Gemini LLM  Market Data  News Search  Python Engine
     │           │           │             │
     └───────────┼───────────┴─────────────┘
                 ▼
          Reasoned Response
                 │
   ┌─────────────┼─────────────┐
   ▼             ▼             ▼
Text Answer  Stock Cards  Interactive Charts & Sources
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons, Axios.
- **Backend**: Node.js, Express, TypeScript, Gemini API (`@google/genai`), Tool Calling, RAG Engine.
- **Analytics Engine**: Python (Pandas, NumPy, Technical Indicators: RSI, MACD, Moving Averages, Ratios).
- **Database**: PostgreSQL (Relational Market Data & Metrics) + MongoDB (Users, Conversations, Messages, Portfolios, Documents).
- **Voice**: Web Speech Recognition API & Edge-TTS Speech Synthesis.

---

## 🚀 Quick Start

### 1. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 2. Install & Run Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Install & Run Analytics Engine
```bash
cd analytics
pip install -r requirements.txt
python main.py
```

### 4. Install & Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📊 Features

- 💬 **Category-Free Conversational AI**: Instant handling of basic concepts, live quotes, technicals, news, calculations, and PDFs without manual filtering.
- 📈 **Interactive Financial Charts**: Dynamic Recharts rendering line, candlestick, volume, and technical indicators.
- ⚡ **Tool Calling & Reasoning**: Deterministic Python calculation execution + LLM explanation.
- 📰 **Source-Grounded Answers**: Real-time citations with verified market data, news sources, and timestamps.
- 📑 **Document Analysis**: PDF annual report parsing and chunked vector question answering.
- 💼 **Portfolio & Watchlist**: Multi-asset tracking, concentration breakdown, and scenario stress testing.
- 🎓 **Learning Mode**: Step-by-step financial curriculum (Stock Basics → Advanced Risk Management).
- 🛡️ **Scam Detector**: Natural language investment scheme risk analysis.
- 🎙️ **Voice Integration**: Hands-free voice commands and audio response listening.
