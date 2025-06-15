
import { useState } from "react";
import FeatureCard from "./components/FeatureCard";
import { Sun, Moon, Video, Image, Film } from "lucide-react";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark bg-gray-900 text-white min-h-screen" : "bg-white text-black min-h-screen"}>
      <header className="text-center py-6 border-b border-gray-300 dark:border-gray-700 relative">
        <h1 className="text-3xl font-bold tracking-wide">IME AI STUDIO</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-6 right-6 text-xl"
        >
          {darkMode ? <Sun /> : <Moon />}
        </button>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
        <FeatureCard icon={<Video />} title="AI Video Generator" desc="Buat video otomatis dengan teknologi AI, termasuk face swap." />
        <FeatureCard icon={<Image />} title="Image Editor" desc="Edit gambar layaknya CapCut atau Canva." />
        <FeatureCard icon={<Film />} title="Short Video Editor" desc="Edit video pendek dengan efek dan musik trending." />
      </main>
    </div>
  );
}
