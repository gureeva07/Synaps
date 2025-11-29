const API_BASE_URL = 'http://localhost:8000/api'

export const emailAPI = {
  // Получить все письма
  async getEmails() {
    try {
      const response = await fetch(`${API_BASE_URL}/emails`)
      if (!response.ok) throw new Error('Failed to fetch emails')
      return await response.json()
    } catch (error) {
      console.error('Error fetching emails:', error)
      return []
    }
  },

  // Получить письмо по ID
  async getEmail(emailId) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/${emailId}`)
      if (!response.ok) throw new Error('Failed to fetch email')
      return await response.json()
    } catch (error) {
      console.error('Error fetching email:', error)
      return null
    }
  },

  // Отправить письмо
  async sendEmail(emailData) {
    try {
      console.log('API: Отправка запроса на', `${API_BASE_URL}/emails/send`)
      console.log('API: Данные:', emailData)

      const response = await fetch(`${API_BASE_URL}/emails/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      })

      console.log('API: Статус ответа:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API: Ошибка сервера:', errorText)
        throw new Error(`Server error: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log('API: Успешный ответ:', result)
      return result
    } catch (error) {
      console.error('API: Ошибка при отправке:', error)
      throw error
    }
  },

  // Генерировать автоматический ответ
  async generateAutoReply(emailId, originalMessage) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/auto-reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_id: emailId,
          original_message: originalMessage,
        }),
      })
      if (!response.ok) throw new Error('Failed to generate auto reply')
      return await response.json()
    } catch (error) {
      console.error('Error generating auto reply:', error)
      throw error
    }
  },

  // Пометить письмо как прочитанное
  async markAsRead(emailId) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/${emailId}/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) throw new Error('Failed to mark email as read')
      return await response.json()
    } catch (error) {
      console.error('Error marking email as read:', error)
      throw error
    }
  },

  // Сохранить оценку ответа
  async saveRating(ratingData) {
    try {
      const response = await fetch(`${API_BASE_URL}/ratings/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratingData),
      })
      if (!response.ok) throw new Error('Failed to save rating')
      return await response.json()
    } catch (error) {
      console.error('Error saving rating:', error)
      throw error
    }
  }
}
