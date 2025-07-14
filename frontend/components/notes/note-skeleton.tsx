export default function NoteSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-lg p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-white/10 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded"></div>
          <div className="h-4 bg-white/10 rounded w-5/6"></div>
          <div className="h-4 bg-white/10 rounded w-4/6"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-white/10 rounded w-20"></div>
          <div className="h-3 bg-white/10 rounded w-16"></div>
        </div>
      </div>
    </div>
  )
}
