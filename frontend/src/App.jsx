import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import EmailList from './components/EmailList'
import EmailViewer from './components/EmailViewer'
import { emailAPI } from './services/api'

function App() {
  // Начальные данные для демонстрации интерфейса
  const initialEmails = [
    {
      id: 1,
      sender: "Алексей Смирнов",
      senderEmail: "alexey@design.studio",
      subject: "Обновление дизайн-системы",
      preview: "Привет! Мы закончили работу над новыми компонентами для дашборда. Прошу посмотреть и дать фидбек до...",
      body: "Привет,\n\nМы закончили работу над новыми компонентами для дашборда. В этом релизе мы сфокусировались на улучшении производительности и доступности.",
      timestamp: "10:42",
      isRead: false,
      hasAttachment: true,
      tags: ["Проект X"]
    },
    {
      id: 2,
      sender: "Команда Stripe",
      senderEmail: "support@stripe.com",
      subject: "Ваш ежемесячный отчет",
      preview: "Сводка по транзакциям за октябрь уже доступна в личном кабинете. Посмотрите детали...",
      body: "Сводка по транзакциям за октябрь уже доступна в личном кабинете.",
      timestamp: "Вчера",
      isRead: true,
      hasAttachment: false,
      tags: []
    },
    {
      id: 3,
      sender: "Мария Иванова",
      senderEmail: "maria@company.com",
      subject: "Встреча по проекту",
      preview: "Подготовила презентацию к завтрашнему созвону. Ссылка внутри.",
      body: "Подготовила презентацию к завтрашнему созвону. Ссылка внутри.",
      timestamp: "Пн",
      isRead: true,
      hasAttachment: false,
      tags: []
    }
  ]

  const [emails, setEmails] = useState(initialEmails)
  const [selectedEmail, setSelectedEmail] = useState(initialEmails[0])

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
        onSelectEmail={setSelectedEmail}
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
