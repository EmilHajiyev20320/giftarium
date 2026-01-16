# Internationalization (i18n) Implementation Guide

This guide explains how to implement multi-language support (English, Azerbaijani, Russian) in the Giftarium app.

## Overview

We're using `next-intl` for internationalization, which is the recommended solution for Next.js 15 App Router.

## Structure

- **Translation files**: `messages/{locale}.json` (en, az, ru)
- **i18n config**: `src/i18n/routing.ts` and `src/i18n/request.ts`
- **Middleware**: `middleware.ts` (handles locale detection)
- **Language switcher**: `src/components/layout/language-switcher.tsx`

## How to Use Translations in Components

### Server Components

```typescript
import { useTranslations } from 'next-intl'

export default function MyPage() {
  const t = useTranslations('common')
  
  return <h1>{t('welcome')}</h1>
}
```

### Client Components

```typescript
'use client'
import { useTranslations } from 'next-intl'

export function MyComponent() {
  const t = useTranslations('common')
  
  return <button>{t('submit')}</button>
}
```

### Using Links with Locale

```typescript
import { Link } from '@/src/i18n/routing'

<Link href="/products">Products</Link> // Automatically includes locale
```

## Adding New Translations

1. Add the key to all three language files:
   - `messages/en.json`
   - `messages/az.json`
   - `messages/ru.json`

2. Use nested objects for organization:
```json
{
  "section": {
    "key": "Translation"
  }
}
```

## Next Steps

1. Move all public pages to `app/[locale]/` directory
2. Update all components to use `useTranslations` hook
3. Replace all `next/link` imports with `@/src/i18n/routing` Link
4. Add language switcher to navbar

