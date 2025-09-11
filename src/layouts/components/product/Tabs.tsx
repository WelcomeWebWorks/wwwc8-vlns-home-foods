"use client";

import { useEffect, useState } from "react";

const Tabs = ({ descriptionHtml }: { descriptionHtml: string }) => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const contentArray = description.split(`--- split content ---`);

  useEffect(() => {
    setDescription(descriptionHtml);
    setLoading(false);
  }, [descriptionHtml]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="bg-white dark:bg-darkmode-body rounded-xl shadow-lg overflow-hidden">
      <div className="border-b border-border dark:border-darkmode-border">
        <div className="flex">
          <button
            onClick={() => setSelectedTab(0)}
            className={`flex-1 px-6 py-4 text-left font-semibold transition-all duration-300 ease-in-out ${
              selectedTab === 0
                ? "bg-primary text-white border-b-2 border-primary"
                : "text-text-dark dark:text-darkmode-text-dark hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Description</span>
            </div>
          </button>
          {contentArray[1] && (
            <button
              onClick={() => setSelectedTab(1)}
              className={`flex-1 px-6 py-4 text-left font-semibold transition-all duration-300 ease-in-out ${
                selectedTab === 1
                  ? "bg-primary text-white border-b-2 border-primary"
                  : "text-text-dark dark:text-darkmode-text-dark hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>More Info</span>
              </div>
            </button>
          )}
        </div>
      </div>
      <div className="p-8">
        {selectedTab === 0 && (
          <div
            className="space-y-4 prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: contentArray[0] }}
          />
        )}
        {selectedTab === 1 && contentArray[1] && (
          <div
            className="space-y-4 prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: contentArray[1] }}
          />
        )}
      </div>
    </div>
  );
};

export default Tabs;
