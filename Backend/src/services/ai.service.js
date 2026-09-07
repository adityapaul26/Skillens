const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

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
    model: "gemini-3.8-flash",
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
  console.log(interviewReport);
}

module.exports = { generateInterviewReport };
