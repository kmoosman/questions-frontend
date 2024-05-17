import React, { useState, Fragment, useEffect } from "react";

import Header from "../partials/Header";
import { NavLink } from "react-router-dom";
import Modal from "../partials/Modal";
import Questions from "../partials/Questions";

export const Dashboard = ({ type }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [acceptedAcknowledgement, setAcceptedAcknowledgement] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("acknowledgement")
      : "false"
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      checkAcknowledgement();
    }
  }, []);

  function checkAcknowledgement() {
    const ackData = JSON.parse(localStorage.getItem("AcceptedAcknowledgement"));
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();

    if (!ackData || now - new Date(ackData.date).getTime() > oneWeek) {
      // If data doesn't exist or it's been a week, prompt the user
      openModal();
    } else {
      setAcceptedAcknowledgement("true");
      closeModal();
    }
  }

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  //add the acknowledgment to local storage
  const handleAcknowledgement = () => {
    localStorage.setItem(
      "AcceptedAcknowledgement",
      JSON.stringify({ accepted: true, date: new Date() })
    );
    setAcceptedAcknowledgement("true");
    closeModal();
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden ">
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden w-full">
          <Header />
          <main>
            {acceptedAcknowledgement !== "true" && (
              <Modal
                show={isModalOpen}
                fragment={Fragment}
                closeModal={closeModal}
              >
                <div>
                  <div className="w-full mb-5 mt-10"></div>
                  <h1 className="w-full text-center text-2xl font-semibold">
                    Terms
                  </h1>

                  <p className="w-full pl-20 pr-20 pt-7 text-left text-sm">
                    The tools and questions provided on this platform are
                    intended solely for general informational purposes. We do
                    not guarantee the accuracy or completeness of any content,
                    and you are using these tools at your own discretion and
                    risk. No warranty, express or implied, is provided, and we
                    disclaim all implied warranties.
                  </p>
                  <div className="w-full text-center">
                    <button
                      onClick={handleAcknowledgement}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10"
                    >
                      Accept and Continue
                    </button>
                  </div>
                </div>
              </Modal>
            )}
            <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto">
              <div className="flex flex-row mt-8 gap-4">
                <div className="text-3xl font-bold text-slate-800 mb-2">
                  Questions List
                </div>
              </div>

              <div className="mt-5">
                <Questions type={type} />
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export const Footer = () => {
  return (
    <footer className="bottom-20 left-0 w-full p-4">
      <div className="container mx-auto text-left text-sm">
        <NavLink to="/privacy" className="text-gray-500">
          Privacy Policy
        </NavLink>
      </div>
    </footer>
  );
};

export default Dashboard;
