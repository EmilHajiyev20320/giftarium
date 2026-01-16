'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import { MysteryBoxFormData } from '@/src/types'

export function MysteryBoxForm() {
  const t = useTranslations('mysteryBox.form')
  const router = useRouter()
  const [formData, setFormData] = useState<MysteryBoxFormData>({
    recipientGender: 'male',
    recipientAge: 18,
    budget: 30,
    interests: [],
    occasion: '',
    customOccasion: '',
    comments: '',
  })
  const [showCustomOccasion, setShowCustomOccasion] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const interests = [
    { key: 'sports', label: t('interestsList.sports') },
    { key: 'music', label: t('interestsList.music') },
    { key: 'reading', label: t('interestsList.reading') },
    { key: 'gaming', label: t('interestsList.gaming') },
    { key: 'art', label: t('interestsList.art') },
    { key: 'technology', label: t('interestsList.technology') },
    { key: 'fashion', label: t('interestsList.fashion') },
    { key: 'cooking', label: t('interestsList.cooking') },
    { key: 'travel', label: t('interestsList.travel') },
    { key: 'movies', label: t('interestsList.movies') },
    { key: 'photography', label: t('interestsList.photography') },
    { key: 'fitness', label: t('interestsList.fitness') },
  ]

  const occasions = [
    { key: 'birthday', label: t('occasionsList.birthday') },
    { key: 'anniversary', label: t('occasionsList.anniversary') },
    { key: 'valentines', label: t('occasionsList.valentines') },
    { key: 'wedding', label: t('occasionsList.wedding') },
    { key: 'graduation', label: t('occasionsList.graduation') },
    { key: 'new_baby', label: t('occasionsList.newBaby') },
    { key: 'thank_you', label: t('occasionsList.thankYou') },
    { key: 'get_well', label: t('occasionsList.getWell') },
    { key: 'congratulations', label: t('occasionsList.congratulations') },
    { key: 'christmas', label: t('occasionsList.christmas') },
    { key: 'just_because', label: t('occasionsList.justBecause') },
    { key: 'custom', label: t('occasionsList.custom') },
  ]

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleOccasionChange = (occasion: string) => {
    if (occasion === 'custom') {
      setShowCustomOccasion(true)
      setFormData((prev) => ({
        ...prev,
        occasion: 'custom',
        customOccasion: '',
      }))
    } else {
      setShowCustomOccasion(false)
      setFormData((prev) => ({
        ...prev,
        occasion,
        customOccasion: '',
      }))
    }
  }

  // Map interest keys back to original format for API
  const getInterestsForAPI = () => {
    return interests
      .filter((i) => formData.interests.includes(i.key))
      .map((i) => i.key.toUpperCase())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderType: 'MYSTERY',
          recipientGender: formData.recipientGender,
          recipientAge: formData.recipientAge,
          budget: formData.budget,
          interests: getInterestsForAPI(),
          occasion: showCustomOccasion && formData.customOccasion 
            ? formData.customOccasion 
            : formData.occasion,
          comments: formData.comments,
          // Note: Delivery info will be collected in checkout
          // For now, we'll redirect to checkout to complete the order
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store order ID in sessionStorage to complete checkout
        sessionStorage.setItem('pendingMysteryOrderId', data.order.id)
        router.push('/checkout?orderId=' + data.order.id)
      } else {
        alert(data.error || 'Failed to create mystery box order')
      }
    } catch (error) {
      console.error('Error submitting mystery box:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2 text-neutral-200">
          {t('recipientGender')}
        </label>
        <select
          value={formData.recipientGender}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              recipientGender: e.target.value as 'male' | 'female',
            }))
          }
          className="input-field"
          required
        >
          <option value="male">{t('genders.male')}</option>
          <option value="female">{t('genders.female')}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-neutral-200">
          {t('recipientAge')}
        </label>
        <input
          type="number"
          min="1"
          max="120"
          value={isNaN(formData.recipientAge) ? '' : formData.recipientAge}
          onChange={(e) => {
            const value = e.target.value
            const parsed = value === '' ? NaN : parseInt(value, 10)
            setFormData((prev) => ({
              ...prev,
              recipientAge: isNaN(parsed) ? prev.recipientAge : parsed,
            }))
          }}
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-neutral-200">
          {t('budget')}
        </label>
        <input
          type="number"
          min="30"
          step="5"
          value={isNaN(formData.budget) ? '' : formData.budget}
          onChange={(e) => {
            const value = e.target.value
            const parsed = value === '' ? NaN : parseFloat(value)
            setFormData((prev) => ({
              ...prev,
              budget: isNaN(parsed) ? prev.budget : parsed,
            }))
          }}
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-neutral-200">
          {t('occasion')}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
          {occasions.map((occasion) => (
            <button
              key={occasion.key}
              type="button"
              onClick={() => handleOccasionChange(occasion.key)}
              className={`px-4 py-2.5 border rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-magic-gold/50 ${
                (formData.occasion === occasion.key || (occasion.key === 'custom' && showCustomOccasion))
                  ? 'bg-gradient-magic text-cosmic-800 border-magic-gold shadow-glow-gold'
                  : 'bg-cosmic-800/50 border-cosmic-500/50 text-neutral-200 hover:border-magic-gold/50 hover:bg-cosmic-700'
              }`}
            >
              {occasion.label}
            </button>
          ))}
        </div>
        {showCustomOccasion && (
          <input
            type="text"
            value={formData.customOccasion}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                customOccasion: e.target.value,
              }))
            }
            className="input-field mt-2"
            placeholder={t('customOccasionPlaceholder')}
            required
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-neutral-200">
          {t('interests')}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {interests.map((interest) => (
            <button
              key={interest.key}
              type="button"
              onClick={() => handleInterestToggle(interest.key)}
              className={`px-4 py-2.5 border rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-magic-gold/50 ${
                formData.interests.includes(interest.key)
                  ? 'bg-gradient-magic text-cosmic-800 border-magic-gold shadow-glow-gold'
                  : 'bg-cosmic-800/50 border-cosmic-500/50 text-neutral-200 hover:border-magic-gold/50 hover:bg-cosmic-700'
              }`}
            >
              {interest.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-neutral-200">
          {t('additionalComments')}
        </label>
        <textarea
          value={formData.comments}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              comments: e.target.value,
            }))
          }
          rows={4}
          className="input-field"
          placeholder={t('placeholder')}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting} size="lg">
        {isSubmitting ? t('submitting') : t('submit')}
      </Button>
    </form>
    </div>
  )
}

