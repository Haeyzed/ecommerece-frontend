import { IdCardDesigner } from '@/features/settings/id-card-templates/components/id-card-designer'

export const metadata = {
  title: 'ID Card Designer | Settings',
}

export default function IdCardSettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">ID Card Designer</h2>
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
        {/* Render your component here */}
        <IdCardDesigner />
      </div>
    </div>
  )
}