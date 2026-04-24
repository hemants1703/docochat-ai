# 🤖 DocoChat AI — Intelligent Document Conversations

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Local-blue?style=for-the-badge&logo=postgresql)](https://postgresql.org/)
[![Qdrant](https://img.shields.io/badge/Qdrant-Vector%20Store-red?style=for-the-badge&logo=qdrant)](https://qdrant.tech/)
[![Ollama](https://img.shields.io/badge/Ollama-Local%20AI-black?style=for-the-badge&logo=ollama)](https://ollama.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

**Transform your documents into intelligent conversation partners**

*Upload • Train • Chat • Discover*

**_100% Local & Private. All your documents and chat history remain on your machine._**

</div>

---

## 🌟 What Makes DocoChat AI Special

DocoChat AI revolutionizes document interaction by combining cutting-edge **Retrieval-Augmented Generation (RAG)** with an intuitive, modern interface. Built for developers, researchers, and professionals who need to extract insights from their documents instantly, whilst respecting total privacy through local AI models.

### ✨ Key Highlights

- 🎯 **Zero Learning Curve** — Upload, train, and start chatting in seconds
- 🧠 **Advanced RAG Pipeline** — Semantic search with Qdrant and Ollama embeddings
- 🏗️ **Local Architecture** — Runs entirely locally with Postgres and Ollama for total privacy
- 🎨 **Beautiful UX** — Modern glassmorphism design with thoughtful animations matching Apple HIG and Vercel aesthetics
- ⚡ **Lightning Fast** — Optimized vector search with intelligent chunking
- 🔒 **Privacy-First** — Your documents stay secure and are never sent to external APIs

---

## 🚀 Features

### 📄 Document Support
- **PDF** — Full text extraction
- **DOCX** — Microsoft Word documents
- **TXT & MD** — Plain text and Markdown files
- **RTF** — Rich Text Format documents
- **CSV** — Structured data files

### 🤖 AI-Powered Intelligence
- **Semantic Search** — Find relevant content using meaning, not just keywords
- **Contextual Responses** — AI understands your document's context with local LLMs (llama3.2, etc.)
- **Conversation Memory** — Maintains chat history for coherent discussions
- **Multi-Document Training** — Train multiple files for comprehensive knowledge

### 🎨 User Experience
- **Responsive Design** — Perfect on desktop, tablet, and mobile
- **Refined Interface** — Floating inputs, glassmorphic download buttons, custom rounded bubbles
- **Real-time Feedback** — Live upload progress, streaming text, and generation status

---

## 🏗️ System Architecture

<div align="center">

### Data Flow Pipeline

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI["🌐 Next.js App<br/>• Landing Page<br/>• Train Interface<br/>• Chat Interface"]
        Components["🧩 UI Components<br/>• shadcn/ui<br/>• TailwindCSS 4<br/>• AI Elements"]
    end

    subgraph "API Layer"
        ConfirmAPI["📋 /api/document/confirm-support<br/>• File type/size validation"]
        TrainAPI["🎯 /api/document/train<br/>• Text extraction & chunking<br/>• Qdrant storage indexing"]
        ChatAPI["💬 /api/chat<br/>• Query embedding<br/>• Qdrant search<br/>• AI streaming response"]
    end

    subgraph "Processing Pipeline"
        Extract["📄 Text Extraction<br/>• Format parsers"]
        Chunk["✂️ Text Chunking<br/>• Intelligent context splitting"]
        Embed["🔢 Text Embedding<br/>• Ollama (nomic-embed-text)<br/>• Local embeddings"]
    end

    subgraph "Local Backends"
        Qdrant["🔮 Qdrant Vector Store<br/>• Cosine similarity search<br/>• Local index"]
        PG["🗄️ PostgreSQL DB<br/>• Users & metadata"]
        Ollama["🧠 Ollama Inference<br/>• nomic-embed-text<br/>• llama3.2"]
    end

    UI --> ConfirmAPI
    UI --> TrainAPI
    UI --> ChatAPI
    
    TrainAPI --> Extract
    Extract --> Chunk
    Chunk --> Embed
    Embed --> Ollama
    TrainAPI --> Qdrant
    
    ChatAPI --> Embed
    ChatAPI --> Qdrant
    ChatAPI --> Ollama
    
    TrainAPI --> PG
    ChatAPI --> PG
```

</div>

### 🏛️ Technical Architecture

```typescript
// Modern Tech Stack
Frontend: Next.js 15 (App Router) + React 19
Styling: Tailwind CSS 4 + shadcn/ui
UI framework: Vercel AI SDK + AI Elements
Backend Database: PostgreSQL (Local via pg)
Vector Database: Qdrant (Local REST API)
AI Embeddings & Chat: Ollama (llama3.2 / nomic-embed-text)
```

---

## 🛠️ Installation

### Prerequisites

- **Node.js** 18+ with pnpm
- **PostgreSQL** running locally
- **Qdrant** running locally (e.g. via Docker)
- **Ollama** running locally (with models pulled: `nomic-embed-text`, `llama3.2`)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/docochat-ai.git
cd docochat-ai

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your local DB and Qdrant credentials

# Start development server
pnpm dev

# Pull necessary LLM models
ollama pull llama3.2
ollama pull nomic-embed-text
```

### Environment Configuration

Create `.env.local` in the project root:

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/docochat

# Qdrant Vector Store
QDRANT_REST_API=http://localhost:6333

# Ollama
OLLAMA_URL=http://localhost:11434
```

---

## 🎨 UI/UX Features

### Design System
- **Glassmorphism** — Modern blur effects, floating elements and transparency
- **Micro-interactions** — Smooth animations and transitions out of conversational flow
- **Refined Typography** — Leading-relaxed, clear and accessible font weights
- **Responsive Design** — Desktop and Mobile optimized

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### 🌟 Star this project if you find it useful!

**Made with ❤️ by [Hemant Sharma](https://github.com/hemants1703)**

</div>
