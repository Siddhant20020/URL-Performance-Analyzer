import URLForm from './components/URLForm';

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          🚀 URL Performance Analyzer
        </h1>
        <URLForm />
        <p className="text-center text-xs text-gray-500 mt-6">
          Built with ❤️ using React & Puppeteer
        </p>
      </div>
    </div>
  );
}
