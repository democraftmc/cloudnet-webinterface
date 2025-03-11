'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function DoesNotExist({ name }) {
  const router = useRouter()
  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">401</h1>
        <span className="font-medium">{name} not found!</span>
        <p className="text-center text-muted-foreground">
          It looks like you&apos;re trying to access a {name} that doesn&apos;t
          exist.
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            Go back
          </Button>
        </div>
      </div>
    </div>
  )
}
