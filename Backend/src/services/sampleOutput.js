const sampleOutput = {
  matchScore: 84,
  technicalQuestions: [
    {
      question:
        "In Node.js, how does the event loop handle asynchronous I/O operations, and how do worker threads differ from standard asynchronous execution?",
      intention:
        "To assess the candidate's deep understanding of the Node.js runtime environment, single-threaded concurrency model, libuv, and the distinction between I/O-bound and CPU-bound task handling.",
      answer:
        "Begin by explaining the single-threaded nature of the main JavaScript execution thread backed by libuv's event loop and internal thread pool. Describe the event loop phases (timers, pending callbacks, poll, check, close callbacks) and microtask queues (process.nextTick, Promise callbacks). Then, explain that standard async operations (like network I/O) are handled asynchronously by the kernel or libuv thread pool without blocking execution, whereas heavy computational or CPU-bound tasks block the main thread and necessitate using the Worker Threads module (`worker_threads`) to parallelize execution across separate OS threads.",
    },
    {
      question:
        "You implemented Redis caching in DevCollab and during your internship. What caching strategies (e.g., Cache-Aside, Write-Through) did you use, and how do you handle cache invalidation and the 'cache stampede' problem?",
      intention:
        "To evaluate practical knowledge of caching patterns, real-world consistency trade-offs, and resilience against common production pitfalls like cache stampedes and stale data.",
      answer:
        "Define the chosen pattern (such as Cache-Aside/Lazy Loading) where the application checks Redis first, loads from the database on a cache miss, and writes back to Redis with a TTL. Discuss cache invalidation challenges when updating records—either proactively invalidating/updating the key upon write or relying on TTLs. Address cache stampede (thundering herd) by discussing mitigation techniques such as mutex locking (locking the key so only one worker queries the DB to refresh cache), probabilistic early expiration (XFetch), or background cache warmers.",
    },
    {
      question:
        "In PostgreSQL, how do indexes (like B-Tree) optimize query performance, and what trade-offs do they introduce during high-write workloads?",
      intention:
        "To test the candidate's core relational database knowledge, indexing mechanisms, and awareness of write penalties and storage overhead.",
      answer:
        "Explain that B-Tree indexes provide logarithmic time complexity O(log N) for lookups, range scans, and sorting by organizing keys in a balanced tree structure. Highlight the trade-offs: every index adds overhead during `INSERT`, `UPDATE`, and `DELETE` operations because the database must keep the tree structure balanced and update index pages. Mention that over-indexing consumes disk space and memory (buffer pool). Conclude by discussing tools like `EXPLAIN ANALYZE` to assess index usage and avoid unnecessary indexes on low-cardinality columns.",
    },
    {
      question:
        "How would you design a rate-limiting middleware for your REST APIs to prevent abuse, and how does a token bucket algorithm work in a distributed environment with Redis?",
      intention:
        "To verify API security best practices, system reliability awareness, and distributed state management using Redis.",
      answer:
        "Walk through the purpose of rate limiting to prevent brute force and DDoS attacks. Explain the Token Bucket algorithm where tokens are refilled at a constant rate up to a bucket capacity, and requests consume tokens. In a distributed environment across multiple Node.js instances, explain how to store the bucket state (timestamp and token count) in Redis using an atomic Lua script to prevent race conditions without acquiring slow distributed locks. Discuss responding with HTTP 429 Too Many Requests and returning headers like `Retry-After`.",
    },
    {
      question:
        "Given that the job requires building event-driven services, how would you decouple synchronous REST endpoints using a message broker like RabbitMQ or Kafka for long-running operations?",
      intention:
        "To gauge readiness to transition from synchronous REST/WebSocket patterns to asynchronous, distributed message queuing systems.",
      answer:
        "Explain the architectural limitation of synchronous HTTP requests for heavy operations (e.g., report generation, email dispatch, data aggregation). Describe the publisher-subscriber/producer-consumer pattern: the API server accepts the client request, validates payload, pushes an event/message to an exchange/topic in RabbitMQ or Kafka, and immediately returns a `202 Accepted` status with a task ID. A background worker consumer processes the task from the queue, handling retries and dead-letter queues (DLQ), and updates state in PostgreSQL or notifies the client via WebSockets upon completion.",
    },
  ],
  behavioralQuestions: [
    {
      question:
        "During your internship at TechNova Solutions, you worked on fixing production bugs. Can you describe a critical bug you encountered, how you identified the root cause, and how you resolved it under pressure?",
      intention:
        "To evaluate debugging capability, composure under pressure, methodical troubleshooting, and willingness to learn from failures.",
      answer:
        "Use the STAR method (Situation, Task, Action, Result). State the context of the bug (e.g., query latency, unhandled promise rejection, memory spike). Explain the methodical steps taken: checking application logs, reproducing in staging, profiling the query or code path, and identifying the root cause. Describe the fix, how it was reviewed and tested, and mention any post-incident measures implemented (e.g., adding integration tests, alerts, or documentation) to prevent recurrence.",
    },
    {
      question:
        "The job description mentions technologies like Kafka, Kubernetes, and large-scale distributed systems, which you identified as growth areas. How do you approach learning and contributing effectively when thrown into an unfamiliar tech stack?",
      intention:
        "To evaluate adaptability, self-directed learning, intellectual humility, and problem-solving initiative.",
      answer:
        "Emphasize your proactive learning framework: breaking down the technology into core concepts, reading official documentation, inspecting existing production implementations within the codebase, and building small proof-of-concept projects. Reference a time you quickly mastered an unfamiliar tool (e.g., integrating Gemini API with Zod or learning FastAPI). Highlight that you ask targeted questions after attempting to find the answer independently, ensuring team efficiency.",
    },
    {
      question:
        "Can you describe a situation where you had to make a trade-off between writing clean, scalable architecture and meeting a tight delivery deadline?",
      intention:
        "To assess pragmatic engineering judgment, technical debt management, and communication with stakeholders.",
      answer:
        "Describe a project scenario where time constraints required balancing speed against perfection. Explain how you prioritized critical functional requirements, security, and data integrity while deferring non-essential optimizations. Show that you consciously documented the technical debt, created tickets/TODOs for refactoring, and communicated clearly to ensure the system could be safely iterated on later.",
    },
  ],
  skillGaps: [
    {
      skill: "Message Brokers & Event-Driven Systems (Kafka / RabbitMQ)",
      severity: "high",
    },
    {
      skill: "Large-Scale Distributed Systems & System Design",
      severity: "high",
    },
    {
      skill:
        "Container Orchestration (Kubernetes) & Production Cloud Infrastructure",
      severity: "medium",
    },
    {
      skill:
        "Automated Testing (Unit/Integration with Jest/Supertest) & Observability (CloudWatch/APM)",
      severity: "medium",
    },
  ],
  preparationPlan: [
    {
      day: 1,
      focus: "Node.js Internals, TypeScript & Concurrency",
      tasks: [Array],
    },
    {
      day: 2,
      focus: "Database Optimization (PostgreSQL & MongoDB)",
      tasks: [Array],
    },
    {
      day: 3,
      focus: "Caching Patterns, Redis & Security",
      tasks: [Array],
    },
    {
      day: 4,
      focus: "Message Brokers & Event-Driven Architecture",
      tasks: [Array],
    },
    {
      day: 5,
      focus: "System Design & Scalability Fundamentals",
      tasks: [Array],
    },
    {
      day: 6,
      focus: "Docker, Kubernetes Basics, AWS & Observability",
      tasks: [Array],
    },
    {
      day: 7,
      focus: "Automated Testing, Behavioral Review & Mock Interview",
      tasks: [Array],
    },
  ],
  title: "Software Engineer - Backend",
};
