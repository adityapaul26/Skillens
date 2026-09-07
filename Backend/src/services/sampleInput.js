const resume = `
ADITYA SHARMA
Software Engineer | Full-Stack Developer

EDUCATION
B.Tech in Information Technology
Techno India University | 2023 - 2027
CGPA: 8.6/10

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, Java, C++
Frontend: React.js, Next.js, HTML, CSS, Tailwind CSS
Backend: Node.js, Express.js, FastAPI
Databases: MongoDB, PostgreSQL, Redis
Cloud & DevOps: AWS, Docker, GitHub Actions
Other: REST APIs, WebSockets, Git, Linux

PROJECTS

DevCollab - Real-Time Collaboration Platform
- Built a full-stack collaboration platform using React, Node.js, Express, MongoDB and Socket.IO.
- Implemented real-time messaging, online presence and collaborative rooms.
- Added JWT-based authentication and role-based authorization.
- Used Redis for caching.
- Dockerized the application.

AI Resume Analyzer
- Built an AI-powered application that analyzes resumes against job descriptions.
- Developed the backend using Node.js and Express.
- Integrated the Google Gemini API for resume analysis and interview question generation.
- Used Zod for structured response validation.
- Implemented REST APIs for generating interview reports.

Task Management API
- Developed a REST API using FastAPI and PostgreSQL.
- Implemented CRUD operations, authentication and pagination.
- Used SQLAlchemy for database interaction.
- Added Docker support and automated testing using GitHub Actions.

EXPERIENCE

Software Engineering Intern
TechNova Solutions | May 2026 - July 2026
- Developed REST APIs using Node.js and Express.
- Optimized MongoDB queries and implemented Redis caching.
- Fixed production bugs and participated in code reviews.
- Worked with Git and GitHub in an Agile environment.

ACHIEVEMENTS
- Selected for TCS Prime.
- Contributed to multiple open-source projects.
- Solved 300+ problems across LeetCode and CodeChef.
`;

const selfDescription = `
I am a B.Tech Information Technology student and aspiring software engineer with a strong interest in backend development, distributed systems and cloud technologies.

My strongest area is JavaScript and TypeScript backend development using Node.js and Express. I also have experience with Python, FastAPI, React, MongoDB and PostgreSQL.

I enjoy building real-world applications and have worked with Redis, Docker, REST APIs, WebSockets and AWS. I am comfortable working in Linux environments and using Git and GitHub.

Recently, I built an AI-powered resume analyzer using the Gemini API. This project gave me experience with integrating LLMs into applications, structured JSON output, schema validation and designing APIs around AI functionality.

I consider myself a fast learner and I am comfortable learning unfamiliar technologies when required.

However, I have limited experience with large-scale system design, distributed systems, Kubernetes and production cloud architecture.

My long-term goal is to become a strong backend engineer capable of designing reliable and scalable systems.
`;

const jobDescription = `
SOFTWARE ENGINEER - BACKEND

Company: TechScale Technologies

We are looking for a Software Engineer to join our backend engineering team and help build scalable, reliable and high-performance services.

RESPONSIBILITIES

- Design, develop and maintain backend services using Node.js and TypeScript.
- Build scalable REST APIs and event-driven services.
- Work with PostgreSQL, MongoDB and Redis.
- Design efficient database schemas and optimize queries.
- Implement authentication, authorization and API security.
- Develop highly available and fault-tolerant services.
- Work with AWS services such as EC2, S3, Lambda, RDS and CloudWatch.
- Containerize applications using Docker.
- Participate in code reviews and engineering best practices.
- Write unit and integration tests.
- Troubleshoot production issues and improve system reliability.
- Collaborate with frontend engineers and other developers.

REQUIRED SKILLS

- Strong knowledge of JavaScript and TypeScript.
- Good understanding of Node.js and asynchronous programming.
- Experience building REST APIs.
- Strong knowledge of data structures and algorithms.
- Good understanding of SQL and relational databases.
- Experience with MongoDB or other NoSQL databases.
- Understanding of Redis and caching.
- Familiarity with Docker and CI/CD.
- Understanding of AWS fundamentals.
- Knowledge of Git and Linux.
- Good problem-solving and communication skills.

PREFERRED SKILLS

- Experience with microservices architecture.
- Experience with Kafka or RabbitMQ.
- Knowledge of Kubernetes.
- Understanding of distributed systems.
- Experience with observability and monitoring.
- Strong system design knowledge.
- Experience with automated testing.

QUALIFICATIONS

- Bachelor's degree in Computer Science, Information Technology or related field.
- Strong communication and analytical skills.
- Ability to work independently and as part of a team.
- Willingness to learn new technologies and solve complex engineering problems.
`;

module.exports = {
  resume,
  selfDescription,
  jobDescription,
};
