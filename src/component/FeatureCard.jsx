
export default function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
      <div className="text-4xl mb-3 text-primary">{icon}</div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm opacity-80">{desc}</p>
      <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
        Buka
      </button>
    </div>
  );
}
