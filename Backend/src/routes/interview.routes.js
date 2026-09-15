const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

const interviewRouter = express.Router();

/**
 * Middleware to support both "resume" and "resumeFile" fields in multipart/form-data.
 */
const uploadResume = (req, res, next) => {
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (req.files) {
      req.file = req.files.resumeFile?.[0] || req.files.resume?.[0];
    }
    next();
  });
};

/**
 * @route POST /api/interview/ or /api/interview/generate-interview-report
 * @description generate new interview report on the basis of user self description, resume pdf and job description.
 * @access private
 */
interviewRouter.post(
  "/",
  authMiddleware.authUser,
  uploadResume,
  interviewController.generateInterviewReportController,
);

interviewRouter.post(
  "/generate-interview-report",
  authMiddleware.authUser,
  uploadResume,
  interviewController.generateInterviewReportController,
);

/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get(
  "/",
  authMiddleware.authUser,
  interviewController.getAllInterviewReportsController,
);

/**
 * @route GET /api/interview/:interviewReportId or /api/interview/report/:interviewId
 * @description get interview report by ID.
 * @access private
 */
interviewRouter.get(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.getInterviewReportByIdController,
);

interviewRouter.get(
  "/:interviewReportId",
  authMiddleware.authUser,
  interviewController.getInterviewReportByIdController,
);

/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post(
  "/resume/pdf/:interviewReportId",
  authMiddleware.authUser,
  interviewController.generateResumePdfController,
);

module.exports = interviewRouter;
