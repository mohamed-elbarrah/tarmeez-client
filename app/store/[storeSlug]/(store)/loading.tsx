export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 border-4 border-[var(--p-color)] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-500 font-bold text-sm animate-pulse">
          جاري تحميل المتجر...
        </p>
      </div>
    </div>
  );
}
