import React, { useState } from 'react'
import {
  Archive,
  Trash2,
  Mail,
  Clock,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Sparkles,
  Send,
  Figma
} from 'lucide-react'
import SimilarEmailsScroll from './SimilarEmailsScroll'

function EmailViewer({ email, onSendReply, onAutoReply }) {
  const [replyText, setReplyText] = useState('')
  const [similarEmails, setSimilarEmails] = useState([])
  const [originalEmail, setOriginalEmail] = useState(null)
  const [currentViewEmail, setCurrentViewEmail] = useState(null)

  const handleSendReply = () => {
    if (replyText.trim()) {
      onSendReply(replyText)
      setReplyText('')
    }
  }

  const handleAutoReply = async () => {
    const result = await onAutoReply()
    if (result) {
      setReplyText(result.generated_reply)
      if (result.similar_emails && result.similar_emails.length > 0) {
        setSimilarEmails(result.similar_emails)
        setOriginalEmail(email)
      }
    }
  }

  const handleSelectSimilarEmail = (similarEmail) => {
    setCurrentViewEmail(similarEmail)
  }

  const handleBackToOriginal = () => {
    setCurrentViewEmail(null)
  }

  if (!email) {
    return (
      <main className="flex-1 flex flex-col h-full bg-white min-w-0 relative">
        <div className="flex items-center justify-center h-full text-gray-400">
          Выберите письмо для просмотра
        </div>
      </main>
    )
  }

  // Используем похожее письмо если выбрано, иначе оригинальное
  const displayEmail = currentViewEmail || email

  return (
    <main className="flex-1 flex flex-col h-full bg-white min-w-0 relative">
      {/* Toolbar */}
      <header className="h-16 flex items-center px-8 border-b border-gray-300 bg-gray-50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-all">
            <Archive className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-all">
            <Mail className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-all">
            <Clock className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Subject & Meta */}
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-2xl text-gray-900 font-medium tracking-tight leading-tight">
              {displayEmail.subject}
              {displayEmail.tags && displayEmail.tags.length > 0 && (
                <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                  {displayEmail.tags[0]}
                </span>
              )}
            </h1>
          </div>

          <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm border-2 border-indigo-300">
                {displayEmail.sender.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-sm text-gray-900">{displayEmail.sender}</span>
                  {displayEmail.senderEmail && (
                    <span className="text-xs text-gray-400">&lt;{displayEmail.senderEmail}&gt;</span>
                  )}
                </div>
                <div className="text-xs text-gray-500">Кому: мне</div>
              </div>
            </div>
            <div className="text-xs text-gray-400 font-medium">
              {displayEmail.timestamp}
            </div>
          </div>

          {/* Body Text */}
          <div className="prose prose-sm max-w-none text-gray-600 leading-7 font-normal">
            <p className="mb-4">{displayEmail.body}</p>
            {displayEmail.hasAttachment && (
              <div className="flex gap-4 mb-8">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors w-64">
                </div>
              </div>
            )}

            <p className="">С уважением, {displayEmail.sender.split(' ')[0]}</p>
          </div>
        </div>
      </div>

      {/* Reply Area */}
      <div className="border-t border-gray-300 bg-gray-50 p-6 pb-8 z-10 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          {/* Similar Emails Scroll */}
          <SimilarEmailsScroll
            similarEmails={similarEmails}
            onSelectEmail={handleSelectSimilarEmail}
            onBackToOriginal={handleBackToOriginal}
            showBackButton={currentViewEmail !== null}
          />

          <div className="relative group rounded-xl border-2 border-gray-300 bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
            {/* Text Area */}
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full h-32 p-4 text-sm text-gray-900 bg-transparent resize-none focus:outline-none placeholder:text-gray-400"
              placeholder="Напишите ответ..."
            />

            {/* Action Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-b-xl border-t border-gray-300">
              <div className="flex items-center gap-1">
                <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors">
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors">
                  <Smile className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* AI Generation Button */}
                <button
                  onClick={handleAutoReply}
                  className="group flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                  <span>Авто-ответ</span>
                </button>

                {/* Send Button */}
                <button
                  onClick={handleSendReply}
                  className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded-md shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  Отправить
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default EmailViewer
