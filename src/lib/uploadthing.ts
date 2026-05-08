import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const f = createUploadthing()

export const ourFileRouter = {
  receiptUploader: f({ pdf: { maxFileSize: '8MB' }, image: { maxFileSize: '8MB' } })
    .middleware(async () => {
      const session = await getServerSession(authOptions)
      if (!session) throw new Error('Unauthorized')
      return { userId: session.user?.name }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for:', metadata.userId, file.url)
      return { url: file.url, name: file.name }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
