'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import { getCookie } from '@/lib/server-calls'
import { createTicket } from '@/utils/actions/user/createTicket'
import { executeCommand } from '@/utils/actions/commands/executeCommand'

interface ConsoleEntry {
  command: string
  output: string
}

interface ServiceConsoleProps {
  webSocketPath: string
  serviceName?: string
  disableCommands?: boolean
  type?: 'service' | 'node'
}

export default function ServiceConsole({
  webSocketPath,
  serviceName,
  disableCommands = false,
  type,
}: ServiceConsoleProps) {
  const [history, setHistory] = useState<ConsoleEntry[]>([])
  const [input, setInput] = useState('')
  const consoleEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let socket: WebSocket | null = null

    const initializeSocket = async () => {
      const ticket = await createTicket(type)
      const cookieAddress = await getCookie('add')
      const address = cookieAddress.replace(/^(http:\/\/|https:\/\/)/, '')

      const socket = new WebSocket(
        `ws://${address}${webSocketPath}?ticket=${ticket}`
      )
      socket.onmessage = (event) => {
        const newEntry: ConsoleEntry = {
          command: 'Server',
          output: event.data,
        }
        setHistory((prev) => [...prev, newEntry])
      }
    }

    initializeSocket().then()

    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [webSocketPath])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const requiredPermissions = [
      'cloudnet_rest:service_write',
      'cloudnet_rest:service_send_commands',
      'global:admin',
    ]

    if (input.trim()) {
      await executeCommand(
        `/service/${serviceName}/command`,
        input,
        requiredPermissions
      )
      setInput('')
    }
  }

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  return (
    <div className="w-full mx-auto h-[80vh] bg-gray-800 text-gray-200 rounded-lg overflow-hidden flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
        {history.map((entry, index) => (
          <div key={index} className="mb-2">
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 mr-1 text-green-400" />
              <span className="text-yellow-400">{entry.command}</span>
            </div>
            <div className="pl-5 text-gray-400">{entry.output}</div>
          </div>
        ))}
        <div ref={consoleEndRef} />
      </div>
      {disableCommands ? null : (
        <form onSubmit={handleSubmit} className="p-2 bg-gray-900">
          <div className="flex items-center">
            <ChevronRight className="w-5 h-5 mr-1 text-green-400" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-200 font-mono"
              placeholder="Type your command..."
            />
          </div>
        </form>
      )}
    </div>
  )
}
