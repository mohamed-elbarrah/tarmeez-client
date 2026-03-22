"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
          !
        </div>
        <h2 className="text-2xl font-black text-gray-900">عذراً، حدث خطأ ما</h2>
        <p className="text-gray-500 font-medium">
          {error.message || "لم نتمكن من تحميل الصفحة المطلوبة حالياً."}
        </p>
        <button
          onClick={() => reset()}
          className="w-full py-3 bg-[var(--p-color)] text-white rounded-xl font-bold hover:shadow-lg transition-all"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}
