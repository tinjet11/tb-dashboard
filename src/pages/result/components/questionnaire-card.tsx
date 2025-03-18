import { Questionnaire } from "@/appwrite/model";
import React from "react";

type QuestionnnaireCardProps = {
  questions: any[];
  questionnaire: Questionnaire;
};

const QuestionnnaireCard = ({
  questions,
  questionnaire,
}: QuestionnnaireCardProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Questionnaire Result
      </h2>
      {questions.length > 0 && (
        <div className="shadow-sm p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.length > 0 &&
            questions?.map((question, i) => (
              <div key={i} className="mb-6">
                <p className="font-medium text-gray-700">
                  Question {i + 1}: {question?.question}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Answer:</span>{" "}
                  {questionnaire?.answer?.[i] || "No answer provided"}
                </p>
              </div>
            ))}
        </div>
      )}
      {questions.length == 0 && <p>Error Fetching Questionaire Result</p>}
    </div>
  );
};

export default QuestionnnaireCard;
