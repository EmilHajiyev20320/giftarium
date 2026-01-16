'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Button } from '@/src/components/ui/button'
import { ContactCategory } from '@prisma/client'

export function ContactForm() {
  const t = useTranslations('contact.form')
  const tSuccess = useTranslations('contact.success')
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'OTHER' as ContactCategory,
    orderId: '',
    message: '',
    agreeToContact: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Pre-fill name and email when session loads
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user?.name || '',
        email: session.user?.email || '',
      }))
    }
  }, [session, status])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t('validation.nameRequired')
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('validation.nameMinLength')
    } else if (formData.name.trim().length > 100) {
      newErrors.name = t('validation.nameMaxLength')
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t('validation.emailRequired')
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = t('validation.emailInvalid')
      }
    }

    // Subject validation (optional but recommended)
    if (formData.subject && formData.subject.trim().length > 200) {
      newErrors.subject = t('validation.subjectMaxLength')
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = t('validation.messageRequired')
    } else if (formData.message.trim().length < 20) {
      newErrors.message = t('validation.messageMinLength')
    } else if (formData.message.trim().length > 5000) {
      newErrors.message = t('validation.messageMaxLength')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim() || null,
          category: formData.category,
          orderId: formData.orderId.trim() || null,
          message: formData.message.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        // Reset form
        setFormData({
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          subject: '',
          category: 'OTHER',
          orderId: '',
          message: '',
          agreeToContact: false,
        })
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setErrors({ _general: data.error || 'Failed to send message. Please try again.' })
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setErrors({ _general: 'An error occurred. Please try again.' })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 bg-gradient-magic rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-gold">
          <span className="text-3xl">✓</span>
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-neutral-50">{tSuccess('title')}</h2>
        <p className="text-neutral-300 mb-6">
          {tSuccess('message')}
        </p>
        <Button
          onClick={() => setIsSuccess(false)}
          variant="outline"
        >
          {tSuccess('sendAnother')}
        </Button>
      </div>
    )
  }

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-semibold mb-6 text-neutral-50 font-display">{t('title')}</h2>
      
      {errors._general && (
        <div className="mb-6 p-4 bg-error-500/20 border border-error-500/50 rounded-lg">
          <p className="text-error-400 text-sm">{errors._general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-200">
              {t('name')} *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }))
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: '' }))
                }
              }}
              className={`input-field w-full ${errors.name ? 'border-error-500' : ''} ${session?.user?.name ? 'opacity-75' : ''}`}
              required
              disabled={!!session?.user?.name}
              title={session?.user?.name ? t('prefilled') : ''}
            />
            {errors.name && (
              <p className="text-sm text-error-500 mt-1">{errors.name}</p>
            )}
            {session?.user?.name && (
              <p className="text-xs text-neutral-400 mt-1">{t('prefilled')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-200">
              {t('email')} *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }))
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: '' }))
                }
              }}
              className={`input-field w-full ${errors.email ? 'border-error-500' : ''} ${session?.user?.email ? 'opacity-75' : ''}`}
              required
              disabled={!!session?.user?.email}
              title={session?.user?.email ? t('prefilled') : ''}
            />
            {errors.email && (
              <p className="text-sm text-error-500 mt-1">{errors.email}</p>
            )}
            {session?.user?.email && (
              <p className="text-xs text-neutral-400 mt-1">{t('prefilled')}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-neutral-200">
            {t('category')} *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as ContactCategory }))}
            className="input-field w-full text-neutral-50 bg-cosmic-800"
            required
          >
            <option value="WEBSITE">{t('categories.website')}</option>
            <option value="ORDER">{t('categories.order')}</option>
            <option value="BOX_REQUEST">{t('categories.boxRequest')}</option>
            <option value="PAYMENT">{t('categories.payment')}</option>
            <option value="DELIVERY">{t('categories.delivery')}</option>
            <option value="OTHER">{t('categories.other')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-neutral-200">
            {t('subject')}
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, subject: e.target.value }))
              if (errors.subject) {
                setErrors((prev) => ({ ...prev, subject: '' }))
              }
            }}
            className={`input-field w-full ${errors.subject ? 'border-error-500' : ''}`}
            placeholder={t('subjectPlaceholder')}
          />
          {errors.subject && (
            <p className="text-sm text-error-500 mt-1">{errors.subject}</p>
          )}
          <p className="text-xs text-neutral-400 mt-1">{t('optionalRecommended')}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-neutral-200">
            {t('orderId')}
          </label>
          <input
            type="text"
            value={formData.orderId}
            onChange={(e) => setFormData((prev) => ({ ...prev, orderId: e.target.value }))}
            className="input-field w-full"
            placeholder={t('orderIdPlaceholder')}
          />
          <p className="text-xs text-neutral-400 mt-1">{t('optionalOrder')}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-neutral-200">
            {t('message')} *
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, message: e.target.value }))
              if (errors.message) {
                setErrors((prev) => ({ ...prev, message: '' }))
              }
            }}
            className={`input-field w-full ${errors.message ? 'border-error-500' : ''}`}
            rows={6}
            required
            placeholder={t('messagePlaceholder')}
          />
          {errors.message && (
            <p className="text-sm text-error-500 mt-1">{errors.message}</p>
          )}
          <p className="text-xs text-neutral-400 mt-1">
            {t('characters', { count: formData.message.length })}
          </p>
        </div>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="agreeToContact"
            checked={formData.agreeToContact}
            onChange={(e) => setFormData((prev) => ({ ...prev, agreeToContact: e.target.checked }))}
            className="mt-1"
          />
          <label htmlFor="agreeToContact" className="text-sm text-neutral-300">
            {t('agreeToContact')}
          </label>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('sending') : t('send')}
        </Button>
      </form>
    </div>
  )
}

