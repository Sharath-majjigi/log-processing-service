<p align="center">
  <img src="https://img.shields.io/badge/Version-2.0-blue.svg" alt="Version 2.0">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen.svg" alt="Active">
</p>

<h1 align="center">Real-Time LogFile Processing Microservice</h1>

<p align="center">
  A powerful full-stack application for asynchronous processing and real-time analytics of large log files
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#challenges--improvements">Challenges & Improvements</a>
</p>

---

## Overview

This application is designed to handle large-scale log file processing with efficiency and provide real-time analytics through a modern, scalable architecture. <br> 
If you are signing up first time, you get a confirmation email make sure to click on that then you can login.

### Versions
- **v1 (Main Branch)**: Basic implementation without performance optimizations or containerization.
- **[v2](https://github.com/Sharath-majjigi/log-processing-service/pull/1)**: Enhanced version with improved performance, JWT authentication, and Docker containerization. Check out the [feat/log-processor-v2](https://github.com/Sharath-majjigi/log-processing-service/pull/1) branch!


## 🎥 Demo Video & explaination

 [Part-1](https://www.loom.com/share/601d14fe2f7142b088d9b043e4bf07dc?sid=029b9e9b-1caf-4991-b57e-5d3176077932) <br> <br>
 [Part-2](https://www.loom.com/share/0a9e1db75fae464cbf1d2e0477ea7889?sid=59ad94b5-1f97-4457-8839-00e9d622e9b6) <br> <br>
 [Part-3](https://www.loom.com/share/6c370c2e60d14a48a61aab67abb4dd18?sid=214370fb-ecbf-4e2a-a224-96d60cd9ddd1) <br> <br>
---

## Code walkthrough
**[Video](https://www.loom.com/share/7df1ed964bf74469b42f394d4b5f7da2?sid=69616172-d75f-4ddf-bf5b-b40a81456a43)**

## Features

### v2 Highlights
- 🚀 **Asynchronous Workers**: Process log files efficiently using streams and worker threads.
- 🛠️ **BullMQ Job Management**: Robust job queuing with retries and concurrency support.
- ⚡ **Real-Time Updates**: WebSocket-powered live analytics and status updates.
- 🔒 **User Authentication**: Secure login system powered by Supabase.
- ⏳ **Rate Limiting**: Protect the application from abuse and ensure fair usage.
- 🐳 **Containerization**: Fully containerized with Docker for seamless deployment.

---

## Architecture

This microservice leverages a modern stack to ensure scalability and performance:

- **Frontend**: React.js/Next.js for a dynamic user interface.
- **Backend**: Node.js with clustering for multi-core utilization.
- **Queue**: BullMQ with Redis for job management.
- **Storage**: Supabase for authentication and file storage.
- **Real-Time**: WebSockets for live updates.
- **Deployment**: Docker for containerized environments.

---

## Getting Started

### Prerequisites
- **Node.js**: v20.x
- **Docker**: Latest version
- **Redis**: For job queue management
- **Supabase**: Account for authentication and storage

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Sharath-majjigi/log-processing-service.git
   cd log-processing-service

2. **Install Dependencies**:
      ```bash
      npm install

3. **Set Up Environment Variables: Create a .env file in the root directory and add**:
      ```bash
         PORT=3000
         REDIS_URL=your_redis_url
         SUPABASE_URL=your_supabase_url
         SUPABASE_KEY=your_supabase_key
         NO_OF_WORKERS=5
         PORT=5001
         QUEUE_NAME=log-processing-queue
         REDIS_EVENT=job-updates
         JOB_NAME=processLogFile
         SUPABASE_STORAGE_NAME=log-files

4. **Run with Docker**:
   ```bash
      docker-compose up --build


## Challenges & Improvements

| Category        | Details                                                                                          |
|-----------------|--------------------------------------------------------------------------------------------------|
| **Challenges**  | - **React/Next.js**: My first frontend project! <br> - **WebSockets**: Steep learning curve for real-time updates. |
| **Approach**    | - **Clustering**: Leveraged Node.js clustering for multi-core processing. <br> - **BullMQ**: Configured for retries and concurrency. <br> - **Streams**: Efficient parsing of large log files. <br> - **Supabase**: Simplified auth setup. |
| **Improvements**| - **Caching**: Cache stats page, refresh every 5 minutes. <br> - **UI**: Add loading indicators and error handling. <br> - **Indexing**: Index `jobID` for faster queries. <br> - **Storage**: Persist keywords for better analytics. <br> - **Partitioning**: Partition data by creation date for scalability. |
