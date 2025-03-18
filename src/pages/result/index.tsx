import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { redirect, useLocation, useNavigate } from "react-router-dom";
import QuestionnnaireCard from "./components/questionnaire-card";
import storageHandler from "@/appwrite/storage";
import ImageCard from "./components/image-card";
import TestResultCard from "./components/test-result-card";
import PatientCard from "./components/patient-card";
import db from "@/appwrite/databases";
import toast from "react-hot-toast";

const TSTResultPage = () => {
  const { state } = useLocation();
  const { patient, questionnaire, analysis } = state || {};

  const [questions, setQuestions] = useState<any[]>([]);

  const fetchQuestionnaire = async () => {
    try {
      const fileViewUrl = await storageHandler.Questionnaire.getFileView(
        questionnaire?.questionId
      );
      const response = await fetch(fileViewUrl);
      const data = await response.json();
      const combinedQuestions = [...data.part1, ...data.part2];
      setQuestions(combinedQuestions);
    } catch (error) {
      console.log("error fetching url: " + error);
    }
  };

  /*   useEffect(() => {
    if (questionnaire) {
      fetchQuestionnaire();
    }
  }, [questionnaire]); */
  const navigate = useNavigate();
  const updateAnalysisStatus = async (newStatus: string) => {
    try {
      const response = await db.Analysis.update(analysis.id, {
        status: newStatus,
      });
      console.log("Analysis status updated successfully", response);
      toast.success("Analysis " + newStatus + " successfully");
      navigate("/");
    } catch (error) {
      console.log("Error during updating analysis status" + error);
    }
  };

  if (!patient || !questionnaire || !questions) {
    return (
      <p className="text-center text-lg text-gray-600">No data available.</p>
    );
  }

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Tuberculosis Skin Test Result
      </h2>

      {/* Patient Information */}
      <PatientCard patient={patient} />
      <Separator />
      <QuestionnnaireCard questions={questions} questionnaire={questionnaire} />
      <Separator />
      <TestResultCard />
      <Separator />
      <ImageCard analysis={analysis} />

      <div className="space-x-4 justify-end flex">
        <Button onClick={() => updateAnalysisStatus("approved")}>
          Approve
        </Button>
        <Button
          variant="destructive"
          onClick={() => updateAnalysisStatus("rejected")}
        >
          Reject
        </Button>
      </div>
    </div>
  );
};

export default TSTResultPage;
