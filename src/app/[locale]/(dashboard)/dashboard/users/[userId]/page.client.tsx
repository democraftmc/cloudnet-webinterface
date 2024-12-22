'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from '@/utils/types/users'
import { useState } from 'react'
import { updateUser } from '@/utils/actions/users/updateUser'
import MultipleSelector, { Option } from '@/components/ui/custom/multi-select'
import { OPTIONS } from './options'
import { toast } from 'sonner'

export default function UserClientPage({ user }: { user: User }) {
  const [username, setUsername] = useState(user.username)
  const [password, setPassword] = useState('')

  function getLabelForScope(scope: string): string {
    const option = OPTIONS.find((option) => option.value === scope)
    return option ? option.label : scope
  }

  const [scopes, setScopes] = useState<Option[]>(
    user.scopes.map((scope) => ({
      label: getLabelForScope(scope),
      value: scope,
    }))
  )

  const handleSave = async (event: any) => {
    event.preventDefault()

    if (username === '') {
      toast.error('Username cannot be empty.')
      return
    }

    // Check if password is empty, if so don't send it
    let body = {
      id: username,
      scopes: scopes.map((scope) => scope.value),
    }
    if (password !== '') {
      // @ts-ignore
      body = { ...body, password: password }
    }

    const response = await updateUser(user.id, body)

    if (response.status === 200) {
      toast.success('User updated successfully')
    } else if (response.status === 401) {
      toast.error('No permission to update user.')
    } else if (response.status === 500) {
      toast.error('Failed to update module')
    }
  }

  return (
    <>
      <form onSubmit={handleSave}>
        <div className={'w-full flex justify-between'}>
          <div>
            <Button variant="outline" type="submit">
              Save
            </Button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-6 gap-y-8">
          <div className="col-span-6 sm:col-span-6 md:col-span-2">
            <Label htmlFor="username">Username</Label>
            <div className="mt-2">
              <Input
                type="text"
                name="username"
                id="username"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-6 gap-y-8">
          <div className="col-span-6 sm:col-span-6 md:col-span-2">
            <Label htmlFor="password">Password</Label>
            <div className="mt-2">
              <Input
                type="text"
                name="password"
                id="password"
                autoComplete="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 w-full">
          <Label>Permissions / Scopes</Label>
          <div className="mt-2">
            <MultipleSelector
              defaultOptions={OPTIONS}
              placeholder="Select scopes..."
              value={scopes}
              emptyIndicator={
                <p className="text-center text-lg leading-10">
                  No results found.
                </p>
              }
              groupBy="group"
              onChange={(value) => setScopes(value)}
            />
          </div>
        </div>
      </form>
    </>
  )
}
