const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// async function askAi() {
//   const interaction = await ai.interactions.create({
//     model: "gemini-3.8-flash",
//     input: "Explain how AI works in a few words",
//   });
// }

const interviewReportJsonSchema = {
  type: "object",
  properties: {
    matchScore: {
      type: "number",
      description:
        "A score between 0 and 100 indicating how well the candidate's profile matches the job description.",
    },

    technicalQuestions: {
      type: "array",
      description:
        "Technical questions that can be asked in the interview along with their intention and how to answer them.",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description:
              "The technical question that can be asked in the interview.",
          },
          intention: {
            type: "string",
            description:
              "The intention of the interviewer behind asking this question.",
          },
          answer: {
            type: "string",
            description:
              "How to answer this question, what points to cover, and what approach to take.",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },

    behavioralQuestions: {
      type: "array",
      description:
        "Behavioral questions that can be asked in the interview along with their intention and how to answer them.",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description:
              "The behavioral question that can be asked in the interview.",
          },
          intention: {
            type: "string",
            description:
              "The intention of the interviewer behind asking this question.",
          },
          answer: {
            type: "string",
            description:
              "How to answer this question, what points to cover, and what approach to take.",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },

    skillGaps: {
      type: "array",
      description:
        "List of skill gaps in the candidate's profile along with their severity.",
      items: {
        type: "object",
        properties: {
          skill: {
            type: "string",
            description: "The skill which the candidate is lacking.",
          },
          severity: {
            type: "string",
            enum: ["low", "medium", "high"],
            description:
              "The severity of this skill gap, i.e. how important this skill is for the job and how much it can impact the candidate's chances.",
          },
        },
        required: ["skill", "severity"],
      },
    },

    preparationPlan: {
      type: "array",
      description:
        "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively.",
      items: {
        type: "object",
        properties: {
          day: {
            type: "number",
            description:
              "The day number in the preparation plan, starting from 1.",
          },
          focus: {
            type: "string",
            description:
              "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews, etc.",
          },
          tasks: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "List of tasks to be done on this day to follow the preparation plan.",
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },

    title: {
      type: "string",
      description:
        "The title of the job for which the interview report is generated.",
    },
  },

  required: [
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
    "title",
  ],
};

const interviewSchema = z.fromJSONSchema(interviewReportJsonSchema);

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
Please generate an interview report for the following candidate.

Here is the candidate's resume:
${resume}

Here is the candidate's self-description:
${selfDescription}

Here is the job description for the position:
${jobDescription}

Based on these details, analyze how well the candidate's profile matches the job.
Generate a match score, technical interview questions, behavioral interview questions,
skill gaps, and a day-wise preparation plan. For every interview question, explain
the interviewer's intention and how the candidate should approach the answer.

Generate the response according to the provided schema.
`;

  const interaction = await ai.interactions.create({
    model: "gemini-3.1-flash-lite",
    input: prompt,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: interviewReportJsonSchema,
    },
  });

  const interviewReport = interviewSchema.parse(
    JSON.parse(interaction.output_text),
  );
  return interviewReport;
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle2" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();

  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfJsonSchema = {
    type: "object",
    properties: {
      html: {
        type: "string",
        description:
          "The HTML content of the resume which can be converted to PDF using a library like Puppeteer.",
      },
    },
    required: ["html"],
  };

  const prompt = `Generate a resume for a candidate with the following details:

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Generate a JSON object with a single field "html" containing the complete HTML content of the resume.

Requirements:
- Tailor the resume specifically to the given job description.
- Highlight the candidate's strengths, relevant skills, projects, and experience.
- Make the content sound natural and human-written, not AI-generated.
- Use a simple, professional, and visually appealing design.
- The resume must be ATS-friendly and easy for applicant tracking systems to parse.
- You may use subtle colors and different font styles for emphasis.
- Keep the resume concise and ideally 1–2 pages when converted to PDF.
- Prioritize relevant and impactful information over unnecessary content.
- The HTML should be self-contained and ready to be converted directly into a PDF using Puppeteer.`;

  const interaction = await ai.interactions.create({
    model: "gemini-3.1-flash-lite",
    input: prompt,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: resumePdfJsonSchema,
    },
  });

  const jsonContent = JSON.parse(interaction.output_text);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };
