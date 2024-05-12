import React, { useState, useRef, useEffect, Fragment } from "react";

import {
  faStar,
  faClipboard,
  faSearch,
  faTrophy,
  faHeart,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../partials/Modal";
import SearchQuestions from "./QuestionsSearch";
import { usePDF } from "react-to-pdf";
import toast from "react-hot-toast";

const Questions = () => {
  const [collection, setCollection] = useState(() => {
    // Attempt to load saved data from localStorage
    const saved = localStorage.getItem("myCollection");
    if (saved) {
      return JSON.parse(saved); // Parse saved JSON back into an array
    }
    return []; // Default to an empty array if nothing is in localStorage
  });
  const [title, setTitle] = useState("");
  const [important, setImportant] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("question");
  const [generatePDF, setGeneratePDF] = useState(false);
  const ref = useRef();
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  const lableLookup = {
    question: "Question",
    goals: "What are you goals for this visit or treatment?",
    values: "What is most important to you in your care?",
  };

  const placeholderLookup = {
    question: "eg: How frequently will I need to come in for follow-up visits?",
    goals:
      "eg: I want to see the birth of my first grandchild... I want to be able to do x, y, z...",
    values: "eg: Quality of life is important to me. I want to be able to...",
  };

  const faIconLookup = {
    question: faQuestionCircle,
    goals: faTrophy,
    values: faHeart,
  };

  const addSubgroup = () => {
    // Add subgroup to list
    const newSubgroup = {
      type: activeTab,
      title,
      important,
    };
    setCollection([...collection, newSubgroup]);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const downloadPdf = () => {
    setGeneratePDF(true);
  };

  useEffect(() => {
    localStorage.setItem("myCollection", JSON.stringify(collection));
  }, [collection]);

  useEffect(() => {
    if (generatePDF) {
      toPDF()
        .then(() => {
          toast.success("PDF generated successfully");
          setGeneratePDF(false);
        })
        .catch((error) => {
          toast.error("Failed to generate PDF:", error);
        });
    }
  }, [generatePDF]);

  const clearCollection = () => {
    localStorage.removeItem("myCollection");
    setCollection([]);
  };

  return (
    <div>
      {isModalOpen && (
        <Modal show={isModalOpen} fragment={Fragment} closeModal={closeModal}>
          <SearchQuestions
            setCollection={setCollection}
            collection={collection}
          />
        </Modal>
      )}
      <button onClick={() => downloadPdf()}>Download PDF</button>
      <div onClick={() => setIsModalOpen(true)}>
        {/* <div className="font-md text-slate-800 mb-5 p-4 bg-blue-100 rounded flex flex-row justify-between">
          <div>
            <div className="font-semibold flex flex-row lg:text-lg text-md">
              Search for questions to add to your list
            </div>
            <div className="text-xs font-md italic">
              Search for question by disease type and those suggested by AI
            </div>
          </div>

          <div className="h-full self-center p-2 text-slate-500">
            <div className="hidden lg:block">
              <FontAwesomeIcon icon={faSquareArrowUpRight} />
            </div>
          </div>
        </div> */}
      </div>
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold mb-2">
          Search for questions or add your own
        </h1>
        <h2 className="text-md font-semibold text-slate-500">
          Search{" "}
          <FontAwesomeIcon
            onClick={() => setIsModalOpen(true)}
            icon={faSearch}
            className="w-4 h-4 text-gray-400"
          />
        </h2>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex gap-1">
          <div
            className={`font-md text-slate-800 p-2 bg-blue-100 rounded flex font-medium flex-row justify-between ${
              activeTab === "question" ? "bg-blue-300" : ""
            }`}
            onClick={() => setActiveTab("question")}
          >
            Questions{" "}
          </div>
          <div
            className={`font-md text-slate-800 p-2 bg-blue-100 rounded flex font-medium flex-row justify-between ${
              activeTab === "goals" ? "bg-blue-300" : ""
            }`}
            onClick={() => setActiveTab("goals")}
          >
            Goals{" "}
          </div>
          <div
            className={`font-md text-slate-800 p-2 bg-blue-100 rounded flex font-medium flex-row justify-between ${
              activeTab === "values" ? "bg-blue-300" : ""
            }`}
            onClick={() => setActiveTab("values")}
          >
            Values{" "}
          </div>
        </div>
        <button onClick={() => clearCollection()} className="mt-4 text-sm">
          Reset
        </button>
      </div>
      <hr className="my-2 mb-3" />
      <div
        className="grid grid-cols-1 lg:grid-cols-7 gap-4 bg-slate-600 rounded text-white p-6 pt-8"
        ref={ref}
      >
        <div className="flex flex-col lg:flex-row gap-2 items-center col-span-6">
          {/* on hover display this tooltop */}
          {activeTab === "question" ? (
            <div className="col-span-4 w-full flex-row flex gap-2 self-center justify-center ">
              <div className="w-full">
                <label className="self-center text-md font-semibold">
                  {lableLookup[activeTab]}
                </label>
                <input
                  className="border-2 text-black border-gray-300 rounded-md p-2 w-full text-left"
                  type="text"
                  value={title}
                  placeholder={placeholderLookup[activeTab]}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              {/* Checkbox to mark as important  */}
              <div className="flex flex-col lg:flex-row gap-2 items-center self-center h-full mt-4">
                <div className="self-center text-md font-semibold whitespace-nowrap">
                  High Priority?
                </div>
                <input
                  className="rounded-md w-7 h-7 self-center"
                  type="checkbox"
                  checked={important}
                  onChange={(e) => setImportant(e.target.checked)}
                />
              </div>
            </div>
          ) : (
            <div className="col-span-6 w-full">
              <label className="self-center text-lg font-semibold">
                {lableLookup[activeTab]}
              </label>
              <textarea
                className="border-2 mt-2 text-black border-gray-300 rounded-md p-2 w-full text-left"
                type="text"
                rows="4"
                value={title}
                placeholder={placeholderLookup[activeTab]}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="col-span-1 lg:col-span-1 flex xl:justify-end self-center w-full xl:mr-12 mt-4">
          <button
            className="w-40 bg-blue-500 h-10 hover:bg-blue-700 text-white font-bold py-1 px-2 capitalize rounded"
            onClick={addSubgroup}
          >
            Add {activeTab}
          </button>
        </div>
      </div>
      <div ref={targetRef} className={`${generatePDF ? "pl-2 pr-2 pt-2" : ""}`}>
        {generatePDF && (
          <div className="text-center text-4xl pb-5 font-semibold text-slate-800">
            Questions List
          </div>
        )}
        {collection.length > 0 ? (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 ${
              generatePDF ? "lg:grid-cols-1" : ""
            } gap-8 mt-5`}
          >
            {collection.length > 0 &&
              collection
                .sort(
                  //sort by goals, values, then questions then by important
                  (a, b) => {
                    if (a.type === "goals" && b.type !== "goals") return -3;
                    if (a.type === "values" && b.type === "question") return -2;
                    if (a.type === "values" && b.type === "goals") return -1;
                    if (a.type === "question" && b.type !== "question")
                      return 1;
                    if (a.important && !b.important) return -1;
                    if (!a.important && b.important) return 1;
                    return 0;
                  }
                )
                .map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 bg-white pb-10 shadow-lg rounded border ${
                      generatePDF ? "max-h-32" : ""
                    }`}
                  >
                    <div className="w-full flex flex-row gap-2 justify-between self-center">
                      <div className="text-xl font-semibold self-center">
                        <FontAwesomeIcon
                          icon={faIconLookup[item.type]}
                          className="w-6 h-6 text-red-200"
                        />
                      </div>
                      <div className="text-xl font-semibold self-center text-left w-full flex">
                        {item.title}
                      </div>
                      <div className="">
                        {item.important && (
                          <FontAwesomeIcon
                            icon={faStar}
                            className="w-6 h-6 text-orange-200"
                          />
                        )}
                      </div>
                    </div>

                    {item.type === "question" && (
                      <>
                        <hr className="my-2" />
                        <div className="overflow-x-auto flex flex-col lg:flex-row justify-between ">
                          <div className="w-full">
                            <table className="mt-1 mb-2 ml-2">
                              <tbody className="w-full ">
                                <tr className="">
                                  <td className="text-left font-medium w-full text-xs">
                                    Area of expertise?{" "}
                                    <span className="pr-5 pl-2">Yes</span>{" "}
                                    <span> No</span>
                                  </td>
                                </tr>
                                <tr className="">
                                  <td className="text-left font-medium w-full">
                                    Answer:
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
          </div>
        ) : (
          <div className="p-4 bg-white pb-10 shadow-lg rounded mt-7">
            <div className="h-full self-center p-2 text-slate-500 text-center">
              <div className="hidden lg:block">
                <FontAwesomeIcon
                  icon={faClipboard}
                  className="w-10 h-10 text-slate-300"
                />
                <h3 className="p-2 font-semibold">No questions added</h3>
                <h3 className="text-sm">
                  Add questions above to view them here
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questions;
