import PageLayout from '@/components/pageLayout'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { getPermissions } from '@/utils/server-api/user/getPermissions'
import Link from 'next/link'
import NoAccess from '@/components/static/noAccess'
import { getServices } from '@/utils/server-api/services/getServices'
import { formatBytes } from '@/components/formatBytes'
import NoRecords from '@/components/static/noRecords'

export const runtime = 'edge'

export default async function ServicesPage({ params: { lang } }) {
  const services: Services = await getServices()
  const permissions: string[] = await getPermissions()
  const requiredPermissions = [
    'cloudnet_rest:service_read',
    'cloudnet_rest:service_list',
    'global:admin',
  ]

  // check if user has required permissions
  const hasPermissions = requiredPermissions.some((permission) =>
    permissions.includes(permission)
  )

  if (!hasPermissions) {
    return <NoAccess />
  }

  if (!services.services) {
    return <NoRecords />
  }

  return (
    <PageLayout title={'Services'}>
      <Table>
        <TableCaption>A list of your services.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>CPU Usage</TableHead>
            <TableHead>RAM Usage</TableHead>
            {requiredPermissions.some((permission) =>
              permissions.includes(permission)
            ) && <TableHead className="sr-only">Edit</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {services?.services
            .sort((a, b) =>
              a.configuration.serviceId.nodeUniqueId.localeCompare(
                b.configuration.serviceId.nodeUniqueId
              )
            )
            .map((service) => (
              <TableRow key={service?.configuration.serviceId.uniqueId}>
                <TableCell className="font-medium">
                  {service?.configuration.serviceId.taskName}
                  {service?.configuration.serviceId.nameSplitter}
                  {service?.configuration.serviceId.taskServiceId}
                </TableCell>
                <TableCell>
                  {service?.processSnapshot.cpuUsage.toFixed(2) + '%'}
                </TableCell>
                <TableCell>
                  {formatBytes(service?.processSnapshot.heapUsageMemory)} /{' '}
                  {formatBytes(service?.processSnapshot.maxHeapMemory)}
                </TableCell>
                {requiredPermissions.some((permission) =>
                  permissions.includes(permission)
                ) && (
                  <TableCell>
                    <Link
                      href={`/${lang}/dashboard/services/${service?.configuration.serviceId.uniqueId}`}
                    >
                      <Button
                        size={'sm'}
                        variant={'link'}
                        className={'p-0 text-right'}
                      >
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PageLayout>
  )
}
