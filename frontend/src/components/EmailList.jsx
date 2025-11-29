import React from 'react'
import { Search } from 'lucide-react'

function EmailList({ emails, selectedEmail, onSelectEmail }) {
  return (
    <aside className="w-96 md:w-[450px] lg:w-[500px] flex flex-col border-r border-gray-300 bg-gray-50 flex-shrink-0 z-10">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-gray-300 bg-white">
        <h2 className="font-semibold text-base text-gray-900 tracking-tight">Входящие</h2>
      </div>

      {/* Search */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="relative group">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            placeholder="Поиск..."
            className="w-full bg-gray-50 border border-gray-300 text-sm rounded-lg py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {emails.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Нет сообщений
          </div>
        ) : (
          emails.map((email) => (
            <div
              key={email.id}
              onClick={() => onSelectEmail(email)}
              className={`group px-4 py-4 cursor-pointer border-l-3 transition-colors ${
                selectedEmail?.id === email.id
                  ? 'bg-indigo-50 border-indigo-600'
                  : 'hover:bg-gray-50 border-transparent'
              } ${!(email.isRead || email.is_read) ? '' : 'opacity-60'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  {!(email.isRead || email.is_read) && (
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  )}
                  <span className={`font-medium text-sm ${
                    (email.isRead || email.is_read) ? 'text-gray-700' : 'text-gray-900'
                  }`}>
                    {email.sender}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {email.tags && email.tags.length > 0 && (
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      email.tags[0] === 'Срочно'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : email.tags[0] === 'Регуляторное' || email.tags[0] === 'Регуляторный запрос'
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : email.tags[0] === 'Партнерство'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : email.tags[0] === 'Юридическое'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : email.tags[0] === 'Благотворительность'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}>
                      {email.tags[0]}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                    {email.timestamp}
                  </span>
                </div>
              </div>
              <h3 className={`text-sm mb-1 ${
                (email.isRead || email.is_read) ? 'font-normal text-gray-900' : 'font-medium text-gray-800'
              }`}>
                {email.subject}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {email.preview}
              </p>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}

export default EmailList
