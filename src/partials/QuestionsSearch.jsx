import React, { useState, useEffect, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faPlusCircle,
  faQuestion,
  faQuestionCircle,
  faSearch,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { questionsByCancerType } from "../utils/Data";
import { useGetQuestions } from "../api/api";

const diseaseOptions = [
  "Select option",
  "cancer",
  "diabetes",
  "heart disease",
  "kidney disease",
  "liver disease",
  "mental health",
  "pain",
  "other",
];

const cancerStages = [
  "Select stage",
  "Stage 0",
  "Stage I",
  "Stage II",
  "Stage III",
  "Stage IV",
];

const cancerTypes = [
  {
    type: "Select type",
    subtypes: [],
  },
  {
    type: "kidney cancer",
    subtypes: [
      "select subtype",
      "clear cell renal cell carcinoma",
      "papillary renal cell carcinoma",
      "chromophobe renal cell carcinoma",
      "HLRCC",
      "renal medullary carcinoma",
      "transitional cell carcinoma",
      "wilms tumor",
      "other",
    ],
  },
  {
    type: "bladder cancer",
    subtypes: [
      "select subtype",
      "urothelial carcinoma",
      "squamous cell carcinoma",
      "adenocarcinoma",
      "small cell carcinoma",
      "other",
    ],
  },
  {
    type: "prostate cancer",
    subtypes: [
      "select subtype",
      "adenocarcinoma",
      "small cell",
      "transitional cell",
      "squamous cell",
      "other",
    ],
  },
  {
    type: "lung",
    subtypes: [
      "select subtype",
      "non-small cell lung cancer",
      "small cell lung cancer",
      "other",
    ],
  },
];

const SearchQuestions = ({ collection, setCollection }) => {
  const [cancerType, setCancerType] = useState("");
  const [cancerSubtype, setCancerSubtype] = useState("");
  const [diseaseType, setDiseaseType] = useState("");
  const [cancerStage, setCancerStage] = useState("");
  const [selectorsVisible, setSelectorsVisible] = useState(true);
  const [questionOptions, setQuestionOptions] = useState([]);

  const { data: questions } = useGetQuestions();

  const onAddQuestion = (question, priority) => {
    question.important = priority === "priority";

    const newSubgroup = {
      type: "question",
      title: question.question,
      important: question?.important ? question.important : false,
    };
    setCollection([...collection, newSubgroup]);
  };

  //   {"question":"Are there specific risk factors for kidney cancer that may affect my treatment?","isMetastatic":false,"category":"disease specific","diseaseTypes":["kidney cancer"],"diseaseSubtypes":null},{"question":"What are the chances of recurrence?","isMetastatic":false,"category":"general","diseaseTypes":["cancer"],"diseaseSubtypes":null},{"question":"How will my kidney function be monitored during and after treatment?","isMetastatic":false,"category":"disease specific","diseaseTypes":["kidney cancer"],"diseaseSubtypes":null},{"question":"What lifestyle changes should I consider to support my treatment and recovery?","isMetastatic":false,"category":"lifestyle","diseaseTypes":["cancer"],"diseaseSubtypes":null},{"question":"Does my tumor have sarcomatoid features?","isMetastatic":true,"category":"disease specific","diseaseTypes":["kidney cancer"],"diseaseSubtypes":["chromophobe renal cell carcinoma","clear cell renal cell carcinoma"]}]
  useEffect(() => {
    if (!questions) return;

    // set the question options based on the disease type
    const filteredQuestions = questions.filter((question) => {
      return question.diseaseTypes.includes(diseaseType);
    });

    //todo: positive there is a better way to do this
    const sortedQuestions = filteredQuestions.sort((a, b) => {
      // First, sort by category
      if (a.category === "general" && b.category !== "general") {
        return -1;
      } else if (b.category === "general" && a.category !== "general") {
        return 1;
      } else if (
        a.category === "disease specific" &&
        b.category !== "disease specific"
      ) {
        return 1;
      } else if (
        b.category === "disease specific" &&
        a.category !== "disease specific"
      ) {
        return -1;
      }

      // Then by selectCount within those categories (higher count first)
      return b.selectCount - a.selectCount;
    });

    setQuestionOptions(sortedQuestions);
  }, [diseaseType]);

  useEffect(() => {
    if (!questions) return;
    // set the question options based on the cancer type
    const filteredQuestions = questions.filter((question) => {
      const generalQuestions =
        question.diseaseTypes.includes("cancer") &&
        question.category === "general";
      const cancerSpecificQuestions =
        question.diseaseTypes.includes(cancerType);
      return { generalQuestions, cancerSpecificQuestions };
    });

    const sortedQuestions = filteredQuestions.sort((a, b) => {
      // Sorting by category first
      if (a.category === "general" && b.category !== "general") {
        return 1; // General should be lower, so return positive if a is general and b is not
      } else if (b.category === "general" && a.category !== "general") {
        return -1; // General should be lower, so return negative if b is general and a is not
      } else if (
        a.category === "disease specific" &&
        b.category !== "disease specific"
      ) {
        return -1; // Disease specific should be higher, so return negative if a is disease specific and b is not
      } else if (
        b.category === "disease specific" &&
        a.category !== "disease specific"
      ) {
        return 1; // Disease specific should be higher, so return positive if b is disease specific and a is not
      }

      // Then sort by selectCount within those categories (higher count first)
      return b.selectCount - a.selectCount;
    });

    setQuestionOptions(sortedQuestions);
  }, [cancerType]);

  useEffect(() => {
    if (!questions) return;

    const sortedQuestions = questions
      // First, filter out questions that don't include the cancerSubtype in diseaseSubtypes
      .filter(
        (question) =>
          Array.isArray(question.diseaseSubtypes) &&
          question.diseaseSubtypes.includes(cancerSubtype)
      )
      // Then, sort the filtered results
      .sort((a, b) => {
        // Compare selectCounts first (if you want this to be the primary sort criterion)
        if (a.selectCount > b.selectCount) {
          return -1;
        } else if (a.selectCount < b.selectCount) {
          return 1;
        }

        // If selectCounts are equal or if you don't want it as the primary criterion, compare by category
        if (
          a.category === "disease specific" &&
          b.category !== "disease specific"
        ) {
          return -1;
        } else if (
          b.category === "disease specific" &&
          a.category !== "disease specific"
        ) {
          return 1;
        }

        if (a.category === "general" && b.category !== "general") {
          return 1;
        } else if (b.category === "general" && a.category !== "general") {
          return -1;
        }

        // If all else is equal, return 0 (though in practice this line may never be reached if all categories are covered)
        return 0;
      });

    setQuestionOptions(sortedQuestions);
  }, [cancerSubtype]);

  return (
    <div className="h-full">
      <div className="w-full mx-auto flex justify-center mb-4">
        <FontAwesomeIcon icon={faSearch} className="w-10 h-10 text-slate-300" />
      </div>
      {selectorsVisible ? (
        <div>
          {/* drop down to select disease type */}
          <div className="flex flex-col">
            <h2 className="text-lg mb-2 text-center">
              Select which type of disease you'd like to search questions for
            </h2>
            <select
              className="border-2 h-10 border-gray-300 text-slate-800s rounded-md text-md text-center capitalize"
              id="diseaseType"
              name="diseaseType"
              value={diseaseType}
              onChange={(e) => setDiseaseType(e.target.value)}
            >
              {diseaseOptions.map((disease) => (
                <option key={disease} value={disease}>
                  {disease}
                </option>
              ))}
            </select>
          </div>

          {/* drop down to select cancer type */}
          {diseaseType === "cancer" && (
            <div className="mt-5 mb-5 flex flex-col md:flex-row gap-2 ">
              <div className="flex flex-col md:flex-row">
                <div
                  htmlFor="cancerType"
                  className="mr-2 font-medium self-center"
                >
                  Type
                </div>
                <select
                  className="border-1 h-10 border-gray-300 text-slate-800 rounded-md text-sm text-center capitalize self-center"
                  id="cancerType"
                  name="cancerType"
                  value={cancerType}
                  onChange={(e) => setCancerType(e.target.value)}
                >
                  {cancerTypes.map((cancer) => (
                    <option key={cancer.type} value={cancer.type}>
                      {cancer.type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                {/* drop down to select cancer subtype */}
                {cancerType && (
                  <div className="flex flex-col md:flex-row">
                    <Fragment>
                      <div
                        htmlFor="cancerSubtype"
                        className="mr-2 font-medium self-center"
                      >
                        Subtype
                      </div>
                      <select
                        className="border-1 h-10 border-gray-300  text-slate-800 rounded-md text-sm text-center capitalize"
                        id="cancerSubtype"
                        name="cancerSubtype"
                        value={cancerSubtype}
                        onChange={(e) => setCancerSubtype(e.target.value)}
                      >
                        {cancerTypes
                          .find((cancer) => cancer.type === cancerType)
                          .subtypes?.map((subtype) => (
                            <option key={subtype} value={subtype}>
                              {subtype}
                            </option>
                          ))}
                      </select>
                    </Fragment>
                  </div>
                )}
              </div>
              <div>
                {/* drop down to select cancer subtype */}
                {/* {cancerType && (
                  <div className="flex flex-col md:flex-row">
                    <Fragment>
                      <div
                        htmlFor="cancerSubtype"
                        className="mr-2 font-medium self-center"
                      >
                        Stage
                      </div>
                      <select
                        className="border-1 h-10 border-gray-300  text-slate-800 rounded-md text-sm text-center"
                        id="cancerStage"
                        name="cancerStage"
                        value={cancerStage}
                        onChange={(e) => setCancerStage(e.target.value)}
                      >
                        {cancerStages.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>
                    </Fragment>
                  </div>
                )} */}
              </div>
            </div>
          )}

          <div className="max-h-[450px] overflow-scroll">
            {questionOptions?.map((question) => (
              <div
                key={question.id}
                className="p-4 bg-slate-100 mb-4 shadow-lg rounded self-center"
              >
                <div className="w-full flex flex-row gap-2">
                  <div className="self-center"></div>
                  <div className="font-semibold self-center text-lg w-full flex justify-between">
                    {question.question}
                    <div className="flex gap-4">
                      <button
                        onClick={() => onAddQuestion(question, "standard")}
                      >
                        {" "}
                        <FontAwesomeIcon
                          icon={faPlusCircle}
                          className="w-4 h-4 text-blue-300"
                        />
                      </button>

                      <button
                        onClick={() => onAddQuestion(question, "priority")}
                      >
                        <FontAwesomeIcon
                          icon={faStar}
                          className="w-4 h-4 text-orange-300"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* display the selectors */}
          {cancerType && (
            <div>
              <div className="text-lg font-semibold w-full text-center">
                {diseaseType === "Cancer"
                  ? `${cancerType} Cancer`
                  : diseaseType}
                {cancerSubtype && ` - ${cancerSubtype}`}
                {/* {cancerStage && ` - ${cancerStage}`} */}
              </div>
            </div>
          )}

          <div className="mt-5 text-sm">
            {questionsByCancerType
              .filter((question) => question.type === cancerType)
              .map((question) => (
                <div
                  key={question.id}
                  className="p-4 bg-slate-100 mb-4 shadow-lg rounded self-center"
                >
                  <div className="w-full flex flex-row gap-2">
                    <div className="self-center">
                      <FontAwesomeIcon
                        icon={faQuestionCircle}
                        className="w-4 h-4 text-orange-200"
                      />
                    </div>
                    <div className="font-semibold self-center text-lg">
                      <div>{question.question}</div>
                      <div>
                        {" "}
                        <FontAwesomeIcon
                          icon={faPlusCircle}
                          className="w-4 h-4 text-orange-200"
                        />
                      </div>
                      <button>Add as priority question</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchQuestions;
