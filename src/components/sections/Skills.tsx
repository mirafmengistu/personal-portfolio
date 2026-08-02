import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import * as Icons from "lucide-react";
import { toast } from "sonner";

interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  display_order: number;
}

interface Skill {
  id: string;
  category_id: string;
  name: string;
  proficiency: number;
  display_order: number;
}

export const Skills = () => {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('skill_categories')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (categoriesError) throw categoriesError;
      
      // Fetch skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (skillsError) throw skillsError;
      
      setCategories(categoriesData || []);
      setSkills(skillsData || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  const getSkillsByCategory = (categoryId: string) => {
    return skills.filter(skill => skill.category_id === categoryId);
  };

  const getIconComponent = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="h-5 w-5 text-primary" /> : null;
  };

  if (loading) {
    return (
      <section id="skills" className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading skills...</p>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, idx) => {
            const categorySkills = getSkillsByCategory(category.id);
            return (
              <motion.div
                key={category.id}
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
                      {getIconComponent(category.icon)}
                    </div>
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="relative group/skill">
                        <span className="px-3 py-1 bg-secondary rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-default">
                          {skill.name}
                        </span>
                        {skill.proficiency && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover/skill:opacity-100 transition-opacity whitespace-nowrap">
                            Proficiency: {skill.proficiency}%
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};