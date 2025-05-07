import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-4 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-blue-600">چت‌نگار</h1>
          <div className="space-x-4 space-x-reverse">
            <Link 
              href="/auth/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              ورود
            </Link>
            <Link 
              href="/auth/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              ثبت‌نام
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                گفتگو، به آسانی هرچه تمام‌تر!
              </h2>
              <p className="mt-4 text-xl text-gray-500">
                با چت‌نگار، به راحتی با دوستان و همکاران خود ارتباط برقرار کنید. امن، سریع و ساده.
              </p>
              <div className="mt-8">
                <Link
                  href="/auth/signup"
                  className="px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  همین حالا شروع کنید
                </Link>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/2">
              <Image
                src="/chat-illustration.svg"
                alt="تصویر چت"
                width={600}
                height={400}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 bg-gray-100">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} چت‌نگار. تمامی حقوق محفوظ است.
          </p>
        </div>
      </footer>
    </div>
  );
}