import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Admin client using service role
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(_req: NextRequest) {
  try {
    // Ensure bucket exists
    const bucketName = 'products'

    // List buckets to check existence
    const { data: buckets, error: listErr } = await supabaseAdmin.storage.listBuckets()
    if (listErr) {
      console.error('Failed to list buckets', listErr)
    }

    const exists = Array.isArray(buckets) && buckets.some(b => b.name === bucketName)

    if (!exists) {
      const { error: createErr } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      })
      if (createErr) {
        console.error('Create bucket failed', createErr)
        return NextResponse.json({ error: 'Create bucket failed' }, { status: 500 })
      }
    } else {
      // If bucket exists but is not public, update it to be public
      const current = buckets!.find(b => b.name === bucketName)
      if (current && !current.public) {
        const { error: updateErr } = await supabaseAdmin.storage.updateBucket(bucketName, {
          public: true,
          fileSizeLimit: 10 * 1024 * 1024,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        })
        if (updateErr) {
          console.error('Update bucket failed', updateErr)
          return NextResponse.json({ error: 'Update bucket failed' }, { status: 500 })
        }
      }
    }

    // Return public URL base for client if needed
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('init-storage error', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
