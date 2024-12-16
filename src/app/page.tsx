import ModeToggle from "@/components/ModeToggle";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <section className="h-screen w-full bg-neutral-950 rounded-md !overflow-visible relative flex flex-col items-center antialiased">4
        <div className="absolute inset-0 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_35%,#223_100%)]">
          <div className="flex flex-col items-center mt-24">
            <h1 className="font-semibold text-6xl text-center first-line:tracking-tighter max-w-4xl bg-gradient-to-tl from-neutral-500 to-white text-transparent bg-clip-text">Automate Your Social Media, Elevate Your Brand</h1>
          </div>
        </div>
      </section>
    </main>
  );
}
