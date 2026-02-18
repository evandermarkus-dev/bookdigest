export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Hero Section */}
        <div className="space-y-8">
          {/* Logo/Title */}
          <h1 className="text-7xl font-bold text-gray-900 mb-4">
            📚 BookDigest
          </h1>

          {/* Tagline */}
          <p className="text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform any PDF book into personalized AI summaries
          </p>

          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-white/50 backdrop-blur p-6 rounded-xl">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-sm text-gray-600">Get summaries in 2-3 minutes</p>
            </div>

            <div className="bg-white/50 backdrop-blur p-6 rounded-xl">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-2">3 Unique Styles</h3>
              <p className="text-sm text-gray-600">Executive, Study, Action-focused</p>
            </div>

            <div className="bg-white/50 backdrop-blur p-6 rounded-xl">
              <div className="text-3xl mb-2">🆓</div>
              <h3 className="font-semibold text-gray-900 mb-2">Free to Start</h3>
              <p className="text-sm text-gray-600">3 summaries per month</p>
            </div>
          </div>

          {/* CTA Button */}
          <button className="px-10 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg">
            Get Started - Free
          </button>

          {/* Trust Badge */}
          <p className="text-sm text-gray-500 mt-6">
            No credit card required • 3 free summaries per month
          </p>
        </div>
      </div>
    </main>
  );
}
