# Real-Time LogFile Processing Microservice

## Overview

A Full-stack application that processes large log files asynchronously and provides real-time analytics.

It has 2 versions:
- v1 : Basic working code without any improved performance or containerization (main branch)
- [v2](https://github.com/Sharath-majjigi/log-processing-service/pull/1) : Improved performance, JWT auth, containerization of application. [feat/log-processor-v2](https://github.com/Sharath-majjigi/log-processing-service/pull/1)

## Features of v2
 **Asynchronous Workers to process log files with streams**  <br>
 **BullMq Job Management**   <br>
 **Real-Time Updates using websockets** <br>
 **User Authentication using supabase**    <br>
 **Rate Limiting** <br>
 **Containerization using Docker**   <br>



## Challenges, Approach & Improvements

| Category | Details |
|------------------|-------------------------------------------------------------------------------------------------------------------|
| Challenges | ReactJs/NextJs: This is my first frontend project :) <br> <br> WebSocket Setup: WebSocket connection for real-time updates was a learning curve and consumed a good amount of time. |
| Approach | **Clustering:** Utilized Node.js clustering to maximize CPU core utilization by spawning multiple worker processes for concurrent log file processing. <br> <br> BullMQ Configuration: Chose BullMQ for its retries and concurrency in job management. <br> <br> Stream Processing: Used streams to efficiently parse large log files, minimizing memory usage. <br> <br> Supabase for Auth: Implemented Supabase for user authentication to simplify the backend setup and focus on core functionality. |
| Improvements | Caching: We can cache the stats page and refresh it every 5 minutes. <br> <br> Better UI: The user interface should be enhanced for a more intuitive experience, including loading indicators and error messages. <br> <br> Indexing: We can create an index on jobID for faster data retrieval. <br> <br> Data Storage: More useful data can be persisted, like keywords, which helps in overall analytics. <br> <br> Partitioning: If the dataset becomes huge, searching will be expensive; we can consider partitioning the table based on the creation date or any relevant piece. |
## Getting Started

### Prerequisites

- Node.js 20.x
- Docker
- Redis
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sharath-majjigi/log-processing-service.git
   cd log-processing-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in a `.env` file:
   ```plaintext
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
   ```

4. Run the application using Docker:
   ```bash
   docker-compose up --build
   ```
