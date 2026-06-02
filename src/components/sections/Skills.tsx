import { motion } from "framer-motion";
import { 
  Code2, 
  Database, 
  Globe, 
  Layout, 
  Server, 
  Smartphone,
  GitBranch,
  Terminal,
  Cloud
} from "lucide-react";

import { FaFigma } from "react-icons/fa";

interface SkillCategory {
  title: string;
  icon: React.ElementType;
  skills: string[];
  color: string;
}

const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    icon: Layout,
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "HTML/CSS"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Backend",
    icon: Server,
    skills: ["Node.js", "Express", "Python", "Java", "PHP"],
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Database",
    icon: Database,
    skills: ["MongoDB", "PostgreSQL", "MySQL", "Firebase", "Prisma"],
    color: "from-yellow-500 to-orange-500"
  },
  {
    title: "DevOps & Tools",
    icon: Cloud,
    skills: ["Docker", "AWS", "Git", "CI/CD", "Linux"],
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Mobile",
    icon: Smartphone,
    skills: ["React Native", "Flutter", "iOS", "Android"],
    color: "from-red-500 to-rose-500"
  },
  {
    title: "Design",
    icon: FaFigma,
    skills: ["UI/UX", "Figma", "Adobe XD", "Responsive Design"],
    color: "from-indigo-500 to-purple-500"
  }
];

// Additional skills for the marquee
const additionalSkills = [
  "REST APIs", "GraphQL", "WebSockets", "Jest", "Cypress",
  "Webpack", "Vite", "Redis", "RabbitMQ", "Kubernetes"
];

export const Skills = () => {
  return (
    <section id="skills" className="py-20 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Technologies</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Technologies and tools I work with to bring ideas to life
          </p>
        </motion.div>

        {/* Skill Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {skillCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-card rounded-lg p-6 border hover:shadow-lg transition-all h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} bg-opacity-10`}>
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-secondary rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Skills Showcase with Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8">What I Bring to the Table</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mx-auto">
                <Code2 className="h-6 w-6" />
              </div>
              <div className="font-semibold">Clean Code</div>
              <div className="text-sm text-muted-foreground">Writing maintainable, scalable solutions</div>
            </div>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mx-auto">
                <GitBranch className="h-6 w-6" />
              </div>
              <div className="font-semibold">Version Control</div>
              <div className="text-sm text-muted-foreground">Git workflow & collaboration</div>
            </div>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mx-auto">
                <Globe className="h-6 w-6" />
              </div>
              <div className="font-semibold">Responsive Design</div>
              <div className="text-sm text-muted-foreground">Mobile-first, cross-browser compatible</div>
            </div>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mx-auto">
                <Terminal className="h-6 w-6" />
              </div>
              <div className="font-semibold">Problem Solving</div>
              <div className="text-sm text-muted-foreground">Analytical thinking & debugging</div>
            </div>
          </div>
        </motion.div>

        {/* Marquee of Additional Skills */}
        <div className="mt-12 overflow-hidden">
          <h3 className="text-xl font-semibold text-center mb-6">Additional Expertise</h3>
          <div className="relative">
            <div className="flex animate-marquee whitespace-nowrap gap-8">
              {[...additionalSkills, ...additionalSkills].map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex px-4 py-2 bg-secondary rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};