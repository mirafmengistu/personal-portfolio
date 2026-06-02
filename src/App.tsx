import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main>
          {/* Sections will go here */}
          <section id="home" className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">Hello, I'm <span className="text-primary">Your Name</span></h1>
              <p className="text-xl text-muted-foreground">Full Stack Developer</p>
            </div>
          </section>
          
          <section id="projects" className="min-h-screen py-20">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center">Projects</h2>
              <p className="text-center text-muted-foreground mt-2">Coming soon...</p>
            </div>
          </section>
          
          <section id="skills" className="min-h-screen py-20">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center">Skills</h2>
              <p className="text-center text-muted-foreground mt-2">Coming soon...</p>
            </div>
          </section>
          
          <section id="contact" className="min-h-screen py-20">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center">Contact</h2>
              <p className="text-center text-muted-foreground mt-2">Coming soon...</p>
            </div>
          </section>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;