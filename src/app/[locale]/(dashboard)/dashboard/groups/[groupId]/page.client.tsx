'use client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import { useState, FormEvent } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Terminal } from 'lucide-react'
import { toast } from 'sonner'
import { groupApi } from '@/lib/client-api'

export default function GroupClientPage({
  group,
  groupId,
}: {
  group: Group
  groupId: string
}) {
  const router = useRouter()
  const [groupConfigData, setGroupConfigData] = useState(
    JSON.stringify(group, null, 2)
  )
  const handleModuleConfigSave = async (event: FormEvent) => {
    event.preventDefault()

    try {
      const updatedGroup = JSON.parse(groupConfigData)
      if (updatedGroup.name !== group.name) {
        toast.warning('Group name has been changed!')
        return
      }

      const response = await groupApi.update(updatedGroup)

      if (response) {
        toast.success('Group config updated successfully')
      }
    } catch (error) {
      toast.error('Invalid JSON format.')
    }
  }

  const handleUninstall = async () => {
    const response = await groupApi.delete(groupId)
    if (response.status === 204) {
      toast.success('Group has been uninstalled.')
      router.push('.')
    }
  }

  return (
    <>
      <div className={'w-full flex justify-between'}>
        <div>
          {groupConfigData && (
            <Button
              variant="outline"
              type="button"
              onClick={handleModuleConfigSave}
            >
              Save
            </Button>
          )}
        </div>
        <div className={'flex gap-4 items-center'}>
          <Button
            type={'button'}
            variant="destructive"
            onClick={handleUninstall}
          >
            Delete
          </Button>
        </div>
      </div>

      <Alert className={'mt-8'}>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          Editing the &quot;name&quot; field will not change the group name.
          Instead, it will create a new group with the new name.
        </AlertDescription>
      </Alert>

      {groupConfigData && (
        <div className="w-full mt-8">
          <Label htmlFor="json">JSON</Label>
          <div className="mt-2">
            <Textarea
              name="json"
              id="json"
              className={'h-96'}
              required
              value={groupConfigData}
              onChange={(event) => setGroupConfigData(event.target.value)}
            />
          </div>
        </div>
      )}
    </>
  )
}
