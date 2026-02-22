export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="skeleton h-8 w-36 rounded-lg" />
          <div className="skeleton h-5 w-24 rounded-lg" />
        </div>

        {/* Usage Stats */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex gap-6 flex-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="skeleton h-7 w-8 rounded" />
                <div className="skeleton h-3 w-16 rounded" />
              </div>
            ))}
          </div>
          <div className="sm:w-56 space-y-2">
            <div className="flex justify-between">
              <div className="skeleton h-3 w-24 rounded" />
              <div className="skeleton h-3 w-8 rounded" />
            </div>
            <div className="skeleton h-2 w-full rounded-full" />
            <div className="skeleton h-3 w-32 rounded" />
          </div>
        </div>

        {/* Upload Area */}
        <div className="skeleton rounded-2xl h-44 w-full" />

        {/* Books */}
        <div className="mt-10">
          <div className="skeleton h-6 w-28 rounded-lg mb-4" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 flex items-center justify-between">
                <div className="space-y-2 flex-1 pr-6">
                  <div className="skeleton h-5 rounded" style={{ width: `${55 + i * 15}%` }} />
                  <div className="skeleton h-4 w-24 rounded" />
                </div>
                <div className="skeleton h-4 w-4 rounded shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
