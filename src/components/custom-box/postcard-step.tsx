'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/src/components/ui/button'
import { useCustomBoxStore } from '@/src/store/custom-box-store'

interface PostcardStepProps {
  onComplete: () => void
  onSkip: () => void
}

export function PostcardStep({ onComplete, onSkip }: PostcardStepProps) {
  const t = useTranslations('customBox.postcard')
  const { postcardText, setPostcardText } = useCustomBoxStore()
  const [text, setText] = useState(postcardText)

  const handleSave = () => {
    setPostcardText(text)
    onComplete()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-neutral-50">{t('title')}</h2>
      <p className="text-neutral-300 mb-6">
        {t('description')}
      </p>

      <div className="card">
        <div className="mb-6">
          <label htmlFor="postcard" className="block text-sm font-medium mb-2 text-neutral-200">
            {t('label')}
          </label>
          <textarea
            id="postcard"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('placeholder')}
            rows={8}
            className="input-field w-full resize-none"
            maxLength={500}
          />
          <p className="text-xs text-neutral-400 mt-2">
            {t('characters', { count: text.length })}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onSkip}
          >
            {t('skip')}
          </Button>
          <Button
            className="flex-1"
            onClick={handleSave}
          >
            {t('save')}
          </Button>
        </div>
        <div className="mt-4 p-4 bg-cosmic-800/50 border border-magic-gold/30 rounded-lg">
          <p className="text-sm text-neutral-300 text-center">
            💝 {t('tip')}
          </p>
        </div>
      </div>
    </div>
  )
}

