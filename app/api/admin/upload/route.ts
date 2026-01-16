import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Allowed image MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
]

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif']

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// Validate file extension
function isValidExtension(filename: string): boolean {
  const extension = filename.split('.').pop()?.toLowerCase()
  return extension ? ALLOWED_EXTENSIONS.includes(extension) : false
}

// Validate file magic bytes (first few bytes to detect actual file type)
function validateImageBuffer(buffer: Buffer): boolean {
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true
  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return true
  // GIF: 47 49 46 38
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) return true
  // WebP: Check for RIFF...WEBP
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return true
  // AVIF: ftyp...avif
  if (buffer.toString('ascii', 4, 8) === 'ftyp' && buffer.toString('ascii', 8, 12).includes('avif')) return true
  return false
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    let session
    try {
      session = await auth()
    } catch (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    // Parse form data
    let formData: FormData
    try {
      formData = await request.formData()
    } catch (error) {
      console.error('Error parsing form data:', error)
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      )
    }

    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file name
    if (!file.name || file.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid file name' },
        { status: 400 }
      )
    }

    // Validate file extension
    if (!isValidExtension(file.name)) {
      return NextResponse.json(
        { 
          error: 'Invalid file type. Allowed types: JPG, PNG, GIF, WebP, AVIF',
          allowedTypes: ALLOWED_EXTENSIONS
        },
        { status: 400 }
      )
    }

    // Validate MIME type
    if (!file.type || !ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          error: 'Invalid file type. Only image files are allowed.',
          allowedTypes: ALLOWED_MIME_TYPES
        },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size === 0) {
      return NextResponse.json(
        { error: 'File is empty' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
          maxSize: MAX_FILE_SIZE
        },
        { status: 400 }
      )
    }

    // Read file buffer
    let buffer: Buffer
    try {
      const bytes = await file.arrayBuffer()
      buffer = Buffer.from(bytes)
    } catch (error) {
      console.error('Error reading file:', error)
      return NextResponse.json(
        { error: 'Failed to read file' },
        { status: 500 }
      )
    }

    // Validate file content (magic bytes)
    if (!validateImageBuffer(buffer)) {
      return NextResponse.json(
        { error: 'File content does not match image format. File may be corrupted or not an image.' },
        { status: 400 }
      )
    }

    // Create uploads directory
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    try {
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }
    } catch (error) {
      console.error('Error creating uploads directory:', error)
      return NextResponse.json(
        { error: 'Failed to create upload directory' },
        { status: 500 }
      )
    }

    // Generate secure filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${timestamp}-${randomString}.${extension}`
    const filepath = join(uploadsDir, filename)

    // Sanitize filename to prevent path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      )
    }

    // Write file
    try {
      await writeFile(filepath, buffer)
    } catch (error) {
      console.error('Error writing file:', error)
      return NextResponse.json(
        { error: 'Failed to save file' },
        { status: 500 }
      )
    }

    // Return the public URL
    const url = `/uploads/${filename}`

    return NextResponse.json({ 
      url,
      filename,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('Unexpected error uploading file:', error)
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

