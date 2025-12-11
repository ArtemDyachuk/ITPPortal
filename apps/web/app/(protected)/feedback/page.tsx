"use client";

import { useState } from "react";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState("");

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
        Feedback
      </h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 max-w-2xl">
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          We value your feedback! Please share your thoughts, suggestions, or report any issues.
        </p>
        
        <form className="space-y-4">
          <div>
            <label
              htmlFor="feedback"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Your Feedback
            </label>
            <textarea
              id="feedback"
              rows={8}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              placeholder="Enter your feedback here..."
            />
          </div>
          
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}
