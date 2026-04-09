import Link from "next/link";
import { FileText } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-12">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">ConsentFlow</span>
        </div>

        {/* 404 */}
        <p className="text-[8rem] font-bold text-gray-100 leading-none select-none">404</p>

        <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Page not found</h1>
        <p className="text-sm text-gray-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center bg-gray-900 text-white h-11 px-8 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors"
        >
          Go to Dashboard
        </Link>

        <div className="mt-4">
          <Link href="/" className="text-sm text-[var(--color-primary)] hover:underline font-medium">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
