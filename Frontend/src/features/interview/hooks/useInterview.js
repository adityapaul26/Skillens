import {
  getAllInterviewReports,
  generateInterviewReport,
} from "../services/interview.api";
import { useContext } from "react";
import { InterviewContext } from "../interview.context";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used within a InterviewProvider");
  }
  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);
    try {
      const data = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      setReport(data.interviewReport);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (interviewId) => {
    setLoading(true);
    try {
      const report = await getAllInterviewReports(interviewId);
      setReport(report.interviewReport);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getReports = async () => {
    setLoading(true);
    try {
      const reports = await getAllInterviewReports();
      setReports(reports);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
  };
};
