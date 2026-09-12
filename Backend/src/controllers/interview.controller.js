const pdfParse = require("pdf-parse");

const { generateInterviewReport } = require("../services/ai.service");

async function generateInterviewReportController(req, res) {
  const resumeFile = req.file;
  const { selfDescription, jobDescription } = req.body;

  const resumeContent = await new pdfParse.PDFParse(
    Uint8Array.from(req.file.buffer),
  ).getText();

  const interviewReportByAi = await generateInterviewReport({
    resume: resumeContent,
    selfDescription,
    jobDescription,
  });

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
  });

  res.status(200).json({
    message: "Interview report generated successfully",
    report: interviewReport,
  });
}

async function getIntrviewReportByIdController(req, res) {
  const { id } = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: id,
    user: req.params.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found",
    });
  }

  res.status(200).json({
    message: "Interview report fetched successfully",
    interviewReport,
  });
}
