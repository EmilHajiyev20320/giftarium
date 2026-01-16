# 🎨 GiftBoxApp Design System
## Complete UI/UX Design Specification

---

## 1. 🌈 Color Palette

### Primary Colors
```css
Primary (Coral/Pink - CTAs, Accents):
  - Base: #FF6B6B (Soft Coral)
  - Hover: #FF5252 (Deeper Coral)
  - Active: #FF3D3D (Vibrant Coral)
  - Light: #FFE5E5 (10% opacity)
  - Dark: #E53935 (Darker shade for text on light)

Secondary (Blush Pink - Backgrounds, Subtle Accents):
  - Base: #FCE4EC (Soft Blush)
  - Hover: #F8BBD0 (Medium Blush)
  - Light: #FFF0F5 (Very Light Blush)
```

### Neutral Scale (Gray Palette)
```css
Neutral 50:  #FAFAFA (Lightest background)
Neutral 100: #F5F5F5 (Subtle backgrounds)
Neutral 200: #EEEEEE (Borders, dividers)
Neutral 300: #E0E0E0 (Light borders)
Neutral 400: #BDBDBD (Placeholder text)
Neutral 500: #9E9E9E (Disabled text)
Neutral 600: #757575 (Secondary text)
Neutral 700: #616161 (Body text)
Neutral 800: #424242 (Headings)
Neutral 900: #2E2E2E (Primary text - Charcoal)
```

### Background Layers
```css
Main Background: #FFF9F9 (Warm off-white)
Card Surface: #FFFFFF (Pure white)
Elevated Surface: #FFFFFF (with shadow)
Overlay: rgba(46, 46, 46, 0.5) (Modal backdrop)
```

### Semantic Colors
```css
Success:
  - Base: #6EE7B7 (Mint Green)
  - Background: #D1FAE5 (Light mint)
  - Text: #065F46 (Dark green)

Warning:
  - Base: #FCD34D (Soft Yellow)
  - Background: #FEF3C7 (Light yellow)
  - Text: #92400E (Dark yellow)

Error:
  - Base: #EF4444 (Coral Red)
  - Background: #FEE2E2 (Light red)
  - Text: #991B1B (Dark red)

Info:
  - Base: #60A5FA (Soft Blue)
  - Background: #DBEAFE (Light blue)
  - Text: #1E40AF (Dark blue)
```

### Border & Divider Colors
```css
Border Default: #F0F0F0 (Very light gray)
Border Hover: #E0E0E0 (Light gray)
Border Focus: #FF6B6B (Primary color)
Divider: #F5F5F5 (Subtle separator)
```

### Gradient Options
```css
Primary Gradient: linear-gradient(135deg, #FF6B6B 0%, #FCE4EC 100%)
Soft Gradient: linear-gradient(135deg, #FFF9F9 0%, #FFFFFF 100%)
Accent Gradient: linear-gradient(135deg, #FFE5E5 0%, #FCE4EC 100%)
```

---

## 2. ✨ Typography System

### Font Family
**Primary Font: Inter** (Modern, friendly, excellent readability)
- Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

**Display Font (Optional):** Plus Jakarta Sans (for hero sections, large headings)

### Type Scale
```css
H1 (Hero/Page Title):
  - Size: 3rem (48px) mobile, 4rem (64px) desktop
  - Weight: 700 (Bold)
  - Line Height: 1.2
  - Letter Spacing: -0.02em
  - Color: #2E2E2E

H2 (Section Headings):
  - Size: 2.25rem (36px) mobile, 2.5rem (40px) desktop
  - Weight: 600 (Semi-bold)
  - Line Height: 1.3
  - Letter Spacing: -0.01em
  - Color: #2E2E2E

H3 (Subsection Headings):
  - Size: 1.75rem (28px)
  - Weight: 600
  - Line Height: 1.4
  - Color: #424242

H4 (Card Titles):
  - Size: 1.25rem (20px)
  - Weight: 600
  - Line Height: 1.5
  - Color: #424242

H5 (Small Headings):
  - Size: 1.125rem (18px)
  - Weight: 600
  - Line Height: 1.5
  - Color: #424242

H6 (Labels):
  - Size: 1rem (16px)
  - Weight: 600
  - Line Height: 1.5
  - Color: #616161

Body Large:
  - Size: 1.125rem (18px)
  - Weight: 400
  - Line Height: 1.7
  - Color: #424242

Body (Default):
  - Size: 1rem (16px)
  - Weight: 400
  - Line Height: 1.6
  - Color: #424242

Body Small:
  - Size: 0.875rem (14px)
  - Weight: 400
  - Line Height: 1.6
  - Color: #616161

Caption:
  - Size: 0.75rem (12px)
  - Weight: 400
  - Line Height: 1.5
  - Color: #757575

Button Text:
  - Size: 1rem (16px)
  - Weight: 500 (Medium)
  - Line Height: 1.5
  - Letter Spacing: 0.01em
```

### Typography Usage Guidelines
- **Headings**: Use for hierarchy, maximum 3 levels deep per page
- **Body**: Default for all content, maintain 1.6-1.7 line height for readability
- **Captions**: Use for metadata, timestamps, helper text
- **Emphasis**: Use weight 600 for important inline text, avoid italics
- **Links**: Use primary color (#FF6B6B) with underline on hover

---

## 3. 📏 Spacing System

### Base Unit: 4px

```css
Spacing Scale:
  0: 0px
  1: 4px   (0.25rem)
  2: 8px   (0.5rem)
  3: 12px  (0.75rem)
  4: 16px  (1rem)      - Base spacing unit
  5: 20px  (1.25rem)
  6: 24px  (1.5rem)    - Common padding
  8: 32px  (2rem)      - Section spacing
  10: 40px (2.5rem)    - Large section spacing
  12: 48px (3rem)      - Page section spacing
  16: 64px (4rem)      - Hero spacing
  20: 80px (5rem)      - Major section spacing
  24: 96px (6rem)      - Page top/bottom padding
```

### Spacing Guidelines
- **Component Padding**: 16-24px (4-6 units)
- **Card Padding**: 20-24px (5-6 units)
- **Section Spacing**: 48-64px (12-16 units)
- **Grid Gaps**: 24-32px (6-8 units)
- **Form Field Spacing**: 16-20px (4-5 units)

---

## 4. 🎭 Shadow System

### Elevation Levels
```css
Shadow None:
  - box-shadow: none

Shadow Sm (Subtle):
  - box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
  - Use: Borders, subtle separation

Shadow Base (Default):
  - box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)
  - Use: Cards, buttons

Shadow Md (Medium):
  - box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)
  - Use: Elevated cards, dropdowns

Shadow Lg (Large):
  - box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)
  - Use: Modals, popovers

Shadow Xl (Extra Large):
  - box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)
  - Use: Hero sections, major CTAs

Shadow Soft (Brand-specific):
  - box-shadow: 0 4px 20px rgba(255, 107, 107, 0.15)
  - Use: Primary buttons, featured items
```

### Shadow Usage
- **Cards**: Shadow Base or Shadow Md
- **Buttons**: Shadow Base (hover: Shadow Md)
- **Modals**: Shadow Lg
- **Floating Elements**: Shadow Md or Shadow Lg
- **Hover States**: Increase shadow by one level

---

## 5. 🔲 Border Radius System

```css
Radius None: 0px
Radius Sm: 4px   (0.25rem)   - Small elements, badges
Radius Base: 8px (0.5rem)    - Buttons, inputs
Radius Md: 12px  (0.75rem)   - Cards, containers
Radius Lg: 16px  (1rem)      - Large cards, modals
Radius Xl: 20px  (1.25rem)   - Hero sections, featured boxes
Radius Full: 9999px          - Pills, avatars, fully rounded
```

### Radius Guidelines
- **Buttons**: 12px (Radius Md)
- **Cards**: 16px (Radius Lg)
- **Inputs**: 12px (Radius Md)
- **Badges**: 20px (Radius Xl) or Full
- **Modals**: 20px (Radius Xl)
- **Product Images**: 12px top, 0px bottom (or 12px all around)

---

## 6. 🧱 Component Library

### 6.1 Buttons

#### Primary Button
```css
Background: #FF6B6B
Text: #FFFFFF
Border: None
Radius: 12px
Padding: 12px 24px
Shadow: Shadow Base
Hover: Background #FF5252, Shadow Md
Active: Background #FF3D3D
Disabled: Background #E0E0E0, Text #9E9E9E
```

#### Secondary Button
```css
Background: #FFFFFF
Text: #FF6B6B
Border: 2px solid #FF6B6B
Radius: 12px
Padding: 12px 24px
Shadow: Shadow Sm
Hover: Background #FFF9F9, Border #FF5252
```

#### Ghost Button
```css
Background: Transparent
Text: #424242
Border: None
Hover: Background #F5F5F5
```

#### Destructive Button
```css
Background: #EF4444
Text: #FFFFFF
Hover: Background #DC2626
```

**Button Sizes:**
- Small: 10px 16px, text 14px
- Medium (default): 12px 24px, text 16px
- Large: 16px 32px, text 18px

---

### 6.2 Input Fields

```css
Container:
  - Background: #FFFFFF
  - Border: 1px solid #E0E0E0
  - Radius: 12px
  - Padding: 12px 16px
  - Font: Body (16px)

Focus State:
  - Border: 2px solid #FF6B6B
  - Shadow: 0 0 0 3px rgba(255, 107, 107, 0.1)

Error State:
  - Border: 2px solid #EF4444
  - Background: #FEE2E2 (light)

Disabled State:
  - Background: #F5F5F5
  - Border: #E0E0E0
  - Text: #9E9E9E

Label:
  - Font: Body Small (14px)
  - Weight: 500
  - Color: #424242
  - Margin-bottom: 8px

Helper Text:
  - Font: Caption (12px)
  - Color: #757575
  - Margin-top: 4px
```

---

### 6.3 Product Card

```css
Container:
  - Background: #FFFFFF
  - Border: 1px solid #F0F0F0
  - Radius: 16px
  - Padding: 0
  - Shadow: Shadow Base
  - Overflow: hidden
  - Transition: all 0.3s ease

Hover:
  - Shadow: Shadow Md
  - Transform: translateY(-4px)

Image Container:
  - Height: 240px (mobile), 280px (desktop)
  - Background: #F5F5F5
  - Position: relative
  - Overflow: hidden

Content Area:
  - Padding: 20px

Product Name:
  - Font: H4 (20px)
  - Weight: 600
  - Color: #2E2E2E
  - Margin-bottom: 8px
  - Line-clamp: 2

Description:
  - Font: Body Small (14px)
  - Color: #616161
  - Line-clamp: 2
  - Margin-bottom: 12px

Price:
  - Font: 1.25rem (20px)
  - Weight: 700
  - Color: #FF6B6B
  - Margin-bottom: 16px

Stock Badge:
  - Background: #D1FAE5
  - Text: #065F46
  - Padding: 4px 12px
  - Radius: 20px
  - Font: Caption (12px)
  - Weight: 500

Actions:
  - Display: flex
  - Gap: 8px
  - Margin-top: 16px
```

---

### 6.4 Gift Box Card (Pre-Made Box)

```css
Container:
  - Background: #FFFFFF
  - Border: 1px solid #F0F0F0
  - Radius: 20px
  - Padding: 0
  - Shadow: Shadow Base
  - Position: relative
  - Overflow: hidden

Special Accent:
  - Top border: 4px solid #FF6B6B (optional gradient)

Image:
  - Height: 300px
  - Background: linear-gradient(135deg, #FFE5E5 0%, #FCE4EC 100%)

Content:
  - Padding: 24px
  - Background: #FFFFFF

Title:
  - Font: H3 (28px)
  - Weight: 700
  - Color: #2E2E2E
  - Margin-bottom: 12px

Description:
  - Font: Body (16px)
  - Color: #616161
  - Line-height: 1.6
  - Margin-bottom: 20px

Price:
  - Font: 2rem (32px)
  - Weight: 700
  - Color: #FF6B6B
  - Margin-bottom: 20px

Items Preview:
  - Display: flex
  - Gap: 8px
  - Margin-bottom: 20px
  - Font: Body Small (14px)
  - Color: #757575

CTA Button:
  - Full width
  - Primary button style
```

---

### 6.5 Custom Box Builder Component

```css
Layout:
  - Grid: 2 columns (desktop), 1 column (mobile)
  - Gap: 32px

Product Selection Area:
  - Background: #FFFFFF
  - Border-radius: 16px
  - Padding: 24px
  - Shadow: Shadow Base

Box Preview Sidebar:
  - Background: #FFF9F9
  - Border: 1px solid #F0F0F0
  - Border-radius: 16px
  - Padding: 24px
  - Position: sticky
  - Top: 24px

Box Item:
  - Background: #FFFFFF
  - Border-radius: 12px
  - Padding: 16px
  - Margin-bottom: 12px
  - Shadow: Shadow Sm

Quantity Controls:
  - Border: 1px solid #E0E0E0
  - Border-radius: 8px
  - Padding: 4px
  - Display: inline-flex
  - Gap: 8px

Total Display:
  - Border-top: 2px solid #F0F0F0
  - Padding-top: 20px
  - Margin-top: 20px
  - Font: H3 (28px)
  - Weight: 700
  - Color: #FF6B6B
```

---

### 6.6 Navigation Header

```css
Container:
  - Background: #FFFFFF
  - Border-bottom: 1px solid #F0F0F0
  - Padding: 16px 0
  - Position: sticky
  - Top: 0
  - Z-index: 100
  - Shadow: Shadow Sm

Logo:
  - Font: H3 (28px)
  - Weight: 700
  - Color: #FF6B6B
  - Letter-spacing: -0.02em

Nav Links:
  - Font: Body (16px)
  - Weight: 500
  - Color: #424242
  - Padding: 8px 16px
  - Border-radius: 8px
  - Hover: Background #FFF9F9, Color #FF6B6B

Cart Badge:
  - Background: #FF6B6B
  - Color: #FFFFFF
  - Size: 20px
  - Border-radius: 10px
  - Font: Caption (12px)
  - Position: absolute
  - Top: -4px
  - Right: -4px
```

---

### 6.7 Checkout Form

```css
Layout:
  - Grid: 2 columns (desktop), 1 column (mobile)
  - Gap: 32px

Form Section:
  - Background: #FFFFFF
  - Border-radius: 16px
  - Padding: 32px
  - Shadow: Shadow Base

Order Summary:
  - Background: #FFF9F9
  - Border: 1px solid #F0F0F0
  - Border-radius: 16px
  - Padding: 24px
  - Position: sticky
  - Top: 24px

Form Group:
  - Margin-bottom: 24px

Input Group:
  - Margin-bottom: 20px

Summary Item:
  - Display: flex
  - Justify-content: space-between
  - Padding: 12px 0
  - Border-bottom: 1px solid #F5F5F5

Total Row:
  - Border-top: 2px solid #E0E0E0
  - Padding-top: 20px
  - Margin-top: 20px
  - Font: H4 (20px)
  - Weight: 700
```

---

### 6.8 Order Status Badge

```css
Pending:
  - Background: #FEF3C7
  - Text: #92400E
  - Border: 1px solid #FCD34D

Confirmed:
  - Background: #DBEAFE
  - Text: #1E40AF
  - Border: 1px solid #60A5FA

Processing:
  - Background: #E0E7FF
  - Text: #3730A3
  - Border: 1px solid #818CF8

Shipped:
  - Background: #D1FAE5
  - Text: #065F46
  - Border: 1px solid #6EE7B7

Delivered:
  - Background: #D1FAE5
  - Text: #065F46
  - Border: 1px solid #10B981

All Badges:
  - Padding: 6px 12px
  - Border-radius: 20px
  - Font: Caption (12px)
  - Weight: 600
  - Display: inline-flex
  - Align-items: center
  - Gap: 6px
```

---

### 6.9 Toast Notifications

```css
Container:
  - Background: #FFFFFF
  - Border-radius: 12px
  - Padding: 16px 20px
  - Shadow: Shadow Lg
  - Border-left: 4px solid (color varies)
  - Min-width: 300px
  - Max-width: 400px

Success:
  - Border-color: #6EE7B7
  - Icon: Green checkmark

Error:
  - Border-color: #EF4444
  - Icon: Red X

Info:
  - Border-color: #60A5FA
  - Icon: Blue info

Position:
  - Top-right: 24px from top, 24px from right
  - Z-index: 1000
```

---

### 6.10 Empty States

```css
Container:
  - Text-align: center
  - Padding: 64px 24px

Icon:
  - Size: 80px
  - Color: #E0E0E0
  - Margin-bottom: 24px

Title:
  - Font: H3 (28px)
  - Weight: 600
  - Color: #424242
  - Margin-bottom: 12px

Description:
  - Font: Body (16px)
  - Color: #757575
  - Max-width: 400px
  - Margin: 0 auto 32px

CTA:
  - Primary button
  - Margin-top: 24px
```

---

## 7. 📄 Page Layouts

### 7.1 Home Page

```
┌─────────────────────────────────────────┐
│           Navigation Header              │
├─────────────────────────────────────────┤
│                                         │
│         Hero Section (Full Width)       │
│   - Large heading (H1)                  │
│   - Subheading (Body Large)             │
│   - CTA Buttons (Primary + Secondary)   │
│   - Background: Gradient or image       │
│   - Padding: 96px vertical              │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│    Features Section (3 columns)          │
│   ┌──────┐ ┌──────┐ ┌──────┐          │
│   │ Pre- │ │Custom│ │Mystery│          │
│   │ Made │ │ Box  │ │ Box  │          │
│   └──────┘ └──────┘ └──────┘          │
│   - Cards with icons                    │
│   - Short descriptions                  │
│   - Padding: 64px vertical              │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│   Featured Boxes Section                 │
│   - Grid: 3 columns (desktop)           │
│   - Show 3 pre-made boxes               │
│   - "View All" link                     │
│   - Padding: 64px vertical              │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│   How It Works Section                   │
│   - 4 steps in a row                    │
│   - Icons + descriptions                │
│   - Padding: 64px vertical              │
│                                         │
├─────────────────────────────────────────┤
│              Footer                      │
└─────────────────────────────────────────┘
```

**Mobile Layout:**
- Single column
- Stacked sections
- Reduced padding (48px)
- Full-width cards

---

### 7.2 Pre-Made Boxes Page

```
┌─────────────────────────────────────────┐
│           Navigation Header              │
├─────────────────────────────────────────┤
│                                         │
│   Page Title (H1)                        │
│   - "Pre-Made Gift Boxes"                │
│   - Description (Body Large)            │
│   - Padding: 48px top, 32px bottom      │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│   Filters Sidebar │  Boxes Grid         │
│   ┌──────────┐    │  ┌──┐ ┌──┐ ┌──┐    │
│   │ Category │    │  │  │ │  │ │  │    │
│   │ Price    │    │  └──┘ └──┘ └──┘    │
│   │ Sort    │    │  ┌──┐ ┌──┐ ┌──┐    │
│   └──────────┘    │  │  │ │  │ │  │    │
│                   │  └──┘ └──┘ └──┘    │
│   - Sticky sidebar│  - 3 columns        │
│   - Width: 250px  │  - Gap: 24px       │
│                   │  - Responsive grid  │
│                                         │
├─────────────────────────────────────────┤
│           Footer                         │
└─────────────────────────────────────────┘
```

---

### 7.3 Custom Box Builder Page

```
┌─────────────────────────────────────────┐
│           Navigation Header              │
├─────────────────────────────────────────┤
│                                         │
│   Page Title (H1)                        │
│   - "Build Your Custom Box"             │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│   Products Grid │  Box Preview          │
│   ┌──────────┐  │  ┌──────────────┐   │
│   │          │  │  │ Your Box     │   │
│   │ Products │  │  │              │   │
│   │          │  │  │ Items List   │   │
│   │          │  │  │              │   │
│   │          │  │  │ Total: XX    │   │
│   │          │  │  │              │   │
│   │          │  │  │ [Checkout]   │   │
│   └──────────┘  │  └──────────────┘   │
│                 │                      │
│   - 2/3 width   │  - 1/3 width         │
│   - Scrollable  │  - Sticky sidebar    │
│   - Grid layout │  - Fixed position    │
│                                         │
└─────────────────────────────────────────┘
```

---

### 7.4 Mystery Box Form Page

```
┌─────────────────────────────────────────┐
│           Navigation Header              │
├─────────────────────────────────────────┤
│                                         │
│   Page Title (H1)                        │
│   - "Create a Mystery Box"               │
│   - Description (Body Large)            │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│         Form Container (Centered)        │
│   ┌─────────────────────────────────┐ │
│   │                                 │ │
│   │  Recipient Gender (Select)      │ │
│   │                                 │ │
│   │  Recipient Age (Number)         │ │
│   │                                 │ │
│   │  Budget (Number)                │ │
│   │                                 │ │
│   │  Interests (Multi-select)       │ │
│   │  [ ] Sports [ ] Music ...       │ │
│   │                                 │ │
│   │  Comments (Textarea)            │ │
│   │                                 │ │
│   │  [Create Mystery Box]           │ │
│   │                                 │ │
│   └─────────────────────────────────┘ │
│                                         │
│   - Max-width: 600px                    │
│   - Centered                            │
│   - Padding: 32px                       │
│                                         │
└─────────────────────────────────────────┘
```

---

### 7.5 Checkout Page

```
┌─────────────────────────────────────────┐
│           Navigation Header              │
├─────────────────────────────────────────┤
│                                         │
│   Progress Stepper                       │
│   [Cart] → [Delivery] → [Payment]       │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│   Delivery Form │  Order Summary        │
│   ┌──────────┐  │  ┌──────────────┐   │
│   │ Full Name│  │  │ Items        │   │
│   │ Email    │  │  │ Subtotal     │   │
│   │ Phone    │  │  │ Tax          │   │
│   │ Address  │  │  │ Shipping     │   │
│   │ City     │  │  │ ────────────│   │
│   │ Postal   │  │  │ Total        │   │
│   │          │  │  │              │   │
│   │ [Place   │  │  │              │   │
│   │  Order]  │  │  │              │   │
│   └──────────┘  │  └──────────────┘   │
│                 │                      │
│   - 2/3 width   │  - 1/3 width         │
│                 │  - Sticky            │
│                                         │
└─────────────────────────────────────────┘
```

---

### 7.6 Order Tracking Page

```
┌─────────────────────────────────────────┐
│           Navigation Header              │
├─────────────────────────────────────────┤
│                                         │
│   Order #12345                           │
│   Status: [Shipped Badge]                │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│   Timeline (Vertical)                    │
│   ● Order Placed                         │
│     ┃                                    │
│   ● Order Confirmed                      │
│     ┃                                    │
│   ● Processing                           │
│     ┃                                    │
│   ● Shipped                              │
│     ┃                                    │
│   ○ Delivered                            │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│   Order Details │  Delivery Info        │
│   ┌──────────┐  │  ┌──────────────┐   │
│   │ Items    │  │  │ Address      │   │
│   │          │  │  │ Tracking #   │   │
│   │          │  │  │ Courier      │   │
│   └──────────┘  │  └──────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 8. 🎯 Design Principles

### 8.1 Visual Hierarchy
- **Size**: Larger = more important
- **Color**: Primary color (#FF6B6B) draws attention
- **Weight**: Bold text for emphasis
- **Spacing**: More space = more importance
- **Position**: Top-left to bottom-right reading flow

### 8.2 Consistency
- Use design tokens (colors, spacing, typography)
- Consistent component patterns
- Uniform border radius (12-16px standard)
- Standardized shadows and elevations

### 8.3 Accessibility
- **Contrast**: Minimum 4.5:1 for text
- **Focus States**: Clear, visible outlines
- **Touch Targets**: Minimum 44x44px
- **Text Size**: Minimum 16px for body
- **Color Independence**: Don't rely solely on color

### 8.4 Micro-interactions
- **Hover**: Subtle lift (translateY -4px), shadow increase
- **Click**: Slight scale (0.98), immediate feedback
- **Loading**: Smooth transitions, skeleton screens
- **Success**: Gentle bounce, color change
- **Transitions**: 200-300ms ease-in-out

### 8.5 Emotional Design
- **Warmth**: Pastel colors, rounded corners
- **Delight**: Surprise animations, celebratory moments
- **Trust**: Clear information, professional layout
- **Joy**: Positive imagery, friendly copy

---

## 9. 🎨 Tailwind CSS Configuration

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFE5E5',
          100: '#FFCCCC',
          500: '#FF6B6B',
          600: '#FF5252',
          700: '#FF3D3D',
          900: '#E53935',
        },
        secondary: {
          50: '#FFF0F5',
          100: '#FCE4EC',
          200: '#F8BBD0',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#2E2E2E',
        },
        success: {
          50: '#D1FAE5',
          500: '#6EE7B7',
          700: '#065F46',
        },
        error: {
          50: '#FEE2E2',
          500: '#EF4444',
          700: '#991B1B',
        },
        warning: {
          50: '#FEF3C7',
          500: '#FCD34D',
          700: '#92400E',
        },
        background: {
          main: '#FFF9F9',
          card: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'sm': '4px',
        'base': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'soft': '0 4px 20px rgba(255, 107, 107, 0.15)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
}
```

---

## 10. 🚀 UX Enhancement Suggestions

### 10.1 Trust Building
- **Testimonials**: Show customer reviews with avatars
- **Security Badges**: Display payment security icons
- **Guarantee**: "100% Satisfaction Guarantee" badge
- **Social Proof**: "Join 10,000+ happy customers"

### 10.2 Conversion Optimization
- **Urgency**: "Only 3 left in stock" for low inventory
- **Scarcity**: "Limited edition" badges
- **Value**: Show savings, bundle deals
- **Free Shipping**: Prominent threshold indicator

### 10.3 Clarity
- **Progress Indicators**: Show steps in checkout
- **Clear CTAs**: Obvious, contrasting buttons
- **Help Text**: Tooltips for complex fields
- **Error Prevention**: Inline validation

### 10.4 Delight
- **Confetti**: On order completion
- **Smooth Animations**: Page transitions
- **Personalization**: "Recommended for you"
- **Surprise**: Easter eggs, hidden messages

### 10.5 Mobile Experience
- **Thumb-Friendly**: Bottom navigation, large buttons
- **Swipe Gestures**: Swipe to add to cart
- **Quick Actions**: Floating action buttons
- **Simplified Forms**: Auto-fill, smart defaults

---

## 11. 📱 Responsive Breakpoints

```css
Mobile: < 640px
  - Single column
  - Stacked components
  - Full-width cards
  - Bottom navigation (optional)

Tablet: 640px - 1024px
  - 2-column grids
  - Sidebar becomes dropdown
  - Adjusted spacing

Desktop: > 1024px
  - 3-4 column grids
  - Full sidebar navigation
  - Optimal spacing
  - Hover states active
```

---

## 12. 🎭 Component States

### Interactive States
- **Default**: Base styling
- **Hover**: Elevated shadow, color shift
- **Active**: Pressed state, darker color
- **Focus**: Outline ring, accessibility
- **Disabled**: Reduced opacity, no interaction
- **Loading**: Skeleton or spinner
- **Error**: Red border, error message
- **Success**: Green accent, checkmark

---

This design system provides the foundation for a cohesive, delightful, and conversion-optimized e-commerce experience that embodies the warmth and joy of gift-giving.

