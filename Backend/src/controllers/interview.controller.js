const pdfParse = require("pdf-parse");
const interviewReportModel = require("../models/interviewReportModel");
const {
  generateInterviewReport,
  generateResumePdf,
} = require("../services/ai.service");

/**
 * @description Controller to generate new interview report based on resume PDF, self description and job description.
 */
async function generateInterviewReportController(req, res) {
  try {
    const resumeFile = req.file;
    const { selfDescription, jobDescription } = req.body;

    if (!resumeFile) {
      return res.status(400).json({
        message: "Resume file is required.",
      });
    }

    if (!jobDescription) {
      return res.status(400).json({
        message: "Job description is required.",
      });
    }

    const pdfData = await new pdfParse.PDFParse(
      Uint8Array.from(resumeFile.buffer),
    ).getText();

    const resumeText = pdfData?.text || "";

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeText,
      selfDescription: selfDescription || "",
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeText,
      selfDescription: selfDescription || "",
      jobDescription,
      ...interviewReportByAi,
    });

    return res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
      report: interviewReport,
    });
  } catch (err) {
    console.error("Error generating interview report:", err);
    return res.status(500).json({
      message: "Internal server error while generating interview report",
      error: err.message,
    });
  }
}

/**
 * @description Controller to get single interview report by ID.
 */
async function getInterviewReportByIdController(req, res) {
  try {
    const id =
      req.params.interviewReportId ||
      req.params.interviewId ||
      req.params.id;

    if (!id) {
      return res.status(400).json({
        message: "Interview report ID is required.",
      });
    }

    const interviewReport = await interviewReportModel.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found",
      });
    }

    return res.status(200).json({
      message: "Interview report fetched successfully",
      interviewReport,
      report: interviewReport,
    });
  } catch (err) {
    console.error("Error fetching interview report:", err);
    return res.status(500).json({
      message: "Internal server error while fetching interview report",
      error: err.message,
    });
  }
}

/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await interviewReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
      );

    return res.status(200).json({
      message: "Interview reports fetched successfully.",
      interviewReports,
      reports: interviewReports,
    });
  } catch (err) {
    console.error("Error fetching all interview reports:", err);
    return res.status(500).json({
      message: "Internal server error while fetching interview reports",
      error: err.message,
    });
  }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
  try {
    const interviewReportId =
      req.params.interviewReportId || req.params.id;

    if (!interviewReportId) {
      return res.status(400).json({
        message: "Interview report ID is required.",
      });
    }

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewReportId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;

    const pdfBuffer = await generateResumePdf({
      resume,
      jobDescription,
      selfDescription,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
    });

    return res.send(pdfBuffer);
  } catch (err) {
    console.error("Error generating resume PDF:", err);
    return res.status(500).json({
      message: "Internal server error while generating resume PDF",
      error: err.message,
    });
  }
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
};
