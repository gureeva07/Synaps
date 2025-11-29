import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import EmailList from './components/EmailList'
import EmailViewer from './components/EmailViewer'
import { emailAPI } from './services/api'

function App() {
  // Список отображаемых писем
  const initialEmails = []
  const [emails, setEmails] = useState(initialEmails)
  const [selectedEmail, setSelectedEmail] = useState(initialEmails[0])

  // Обработчик выбора письма
  const handleSelectEmail = async (email) => {
    setSelectedEmail(email)

    // Помечаем письмо как прочитанное
    if (!email.is_read && !email.isRead) {
      try {
        await emailAPI.markAsRead(email.id)

        // Обновляем состояние локально
        setEmails(prevEmails =>
          prevEmails.map(e =>
            e.id === email.id
              ? { ...e, is_read: true, isRead: true }
              : e
          )
        )
      } catch (error) {
        console.error('Ошибка при пометке письма как прочитанного:', error)
      }
    }
  }

  // Загрузка писем из API (опционально)
  useEffect(() => {
    const loadEmails = async () => {
      const fetchedEmails = await emailAPI.getEmails()
      // Если API вернуло письма, используем их, иначе оставляем начальные
      if (fetchedEmails && fetchedEmails.length > 0) {
        setEmails(fetchedEmails)
        setSelectedEmail(fetchedEmails[0])
      }
    }

    loadEmails()
  }, [])

  // Обработчик отправки письма
  const handleSendReply = async (replyText) => {
    if (!selectedEmail) return

    try {
      const emailData = {
        to: selectedEmail.senderEmail,
        subject: `Re: ${selectedEmail.subject}`,
        body: replyText,
        reply_to_id: selectedEmail.id
      }

      const result = await emailAPI.sendEmail(emailData)
      console.log('Письмо отправлено:', result)
    } catch (error) {
      console.error('Ошибка при отправке:', error)
    }
  }

  // Обработчик автоответа
  const handleAutoReply = async () => {
    if (!selectedEmail) return

    try {
      const result = await emailAPI.generateAutoReply(
        selectedEmail.id,
        selectedEmail.body
      )
      console.log('Автоответ сгенерирован:', result)
      return result
    } catch (error) {
      console.error('Ошибка при генерации автоответа:', error)
    }
  }

  return (
    <div className="flex overflow-hidden selection:bg-gray-100 selection:text-black text-gray-900 bg-white w-full h-screen">
      <Sidebar />
      <EmailList
        emails={emails}
        selectedEmail={selectedEmail}
        onSelectEmail={handleSelectEmail}
      />
      <EmailViewer
        email={selectedEmail}
        onSendReply={handleSendReply}
        onAutoReply={handleAutoReply}
      />
    </div>
  )
}

export default App
