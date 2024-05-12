import React from "react";

// Import utilities
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";

export const nomogramCard = ({ title, link, blurb, type, image }) => {
  library.add(fab);

  return (
    <a
      href={link}
      target="_blank"
      className="flex flex-col col-span-full sm:col-span-4 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200"
    >
      <div>
        <div className="px-5 pt-5">
          <header className="flex justify-between items-start mb-2">
            {/* Icon */}
            <div
              className={`flex items-center justify-center w-20 h-20 rounded-lg  ${
                image
                  ? ""
                  : "bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-blue-200 to-blue-700 opacity-50 shadow-md"
              }`}
            >
              <img
                src={image}
                alt=""
                className={`${image ? "rounded w-20" : "hidden"}`}
              />
            </div>
          </header>
          <h2 className="text-xl max-h-14 overflow-scroll font-semibold text-slate-800 mb-2 mt-4">
            {title}
          </h2>
          <hr className="mb-4" />
          <div className={`${type !== "media" ? `hidden` : ""}`}>
            <div className="flex items-start">
              {/*<div className="text-3xl font-bold text-slate-800 mr-2">info</div>*/}
            </div>
          </div>
          <div className="self-center">
            <p className="text-sm text-slate-600 mb-5">{blurb}</p>
          </div>
        </div>
      </div>
    </a>
  );
};

export default nomogramCard;
