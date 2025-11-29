import React from 'react'
import { ChevronLeft } from 'lucide-react'

function SimilarEmailsScroll({ similarEmails, onSelectEmail, onBackToOriginal, showBackButton }) {
  if (!similarEmails || similarEmails.length === 0) {
    return null
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-gray-600">Похожие письма:</span>
        {showBackButton && (
          <button
            onClick={onBackToOriginal}
            className="ml-auto flex items-center gap-1 px-3 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors"
          >
            <ChevronLeft className="w-3 h-3" />
            Вернуться к исходному
          </button>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {similarEmails.map((email) => (
          <button
            key={email.id}
            onClick={() => onSelectEmail(email)}
            className="flex-shrink-0 w-72 p-3 border-2 border-gray-300 rounded-lg bg-white hover:border-indigo-400 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                {email.subject}
              </h3>
            </div>
            <p className="text-xs text-gray-500 mb-2">{email.sender}</p>
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
              {email.preview}
            </p>
            <span className="text-xs text-gray-400">{email.timestamp}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SimilarEmailsScroll
