import React from 'react'
import { X } from 'lucide-react'

function RatingPopup({ onRate, onClose }) {
  const ratings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border-2 border-indigo-200 p-5 max-w-sm z-50 animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">
          Оцените качество ответа
        </h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Насколько хорошо сгенерированный ответ соответствует письму?
      </p>

      <div className="grid grid-cols-5 gap-2">
        {ratings.map((rating) => (
          <button
            key={rating}
            onClick={() => onRate(rating)}
            className="px-3 py-2 text-sm font-semibold rounded-md border-2 border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-500 hover:text-indigo-700 transition-all active:scale-95"
          >
            {rating}
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-3 text-xs text-gray-500">
        <span>Плохо</span>
        <span>Отлично</span>
      </div>
    </div>
  )
}

export default RatingPopup
