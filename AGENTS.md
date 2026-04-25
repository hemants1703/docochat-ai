# Docochat AI - Talk to your documents!

## 100% Local & Private Document Chat

A sleek, modern yet minimal application that lets you talk to your documents with a user-centric UI. The application is built with a focus on great UX, ensuring a robust, secure, and intuitive experience while keeping all your documents and data completely private by running entirely on local infrastructure.

## System & Engineering Design
This project is engineered for zero-configuration, containerized local deployment. Under the hood, it leverages Next.js executing in `standalone` output mode packaged inside a lightweight, multi-stage Docker container. The application networks directly to an isolated local Qdrant container for vector similarity search, bypassing third-party cloud database providers entirely. Inference (embeddings and generative responses) is offloaded directly to the host machine's Ollama instance, ensuring hardware-accelerated, 100% locally isolated, private completions without external API dependencies.

## Supported Documents
- **PDF, DOCX, TXT, MD, CSV, RTF**

## Tech Stack
- Frontend: **Next.js 15 (App Router, API Routes)**
- Deployment: **Docker & Docker Compose**
- Styling: **Tailwind CSS 4 & shadcn/ui**
- AI Framework: **Vercel AI SDK & AI Elements**
- Vector Store: **Qdrant (Local Docker Container Rest API)**
- LLM & Embeddings: **Ollama (Host Machine inference: llama3.2 / nomic-embed-text)**
