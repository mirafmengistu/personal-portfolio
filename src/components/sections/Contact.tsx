import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  availability: string;
  contact_form_enabled: boolean;
  success_message: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

// EmailJS configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const Contact = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    fetchData();
    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const fetchData = async () => {
    try {
      // Fetch contact info
      const { data: contactData, error: contactError } = await supabase
        .from('contact_info')
        .select('*')
        .single();
      
      if (contactData) setContactInfo(contactData);
      
      // Fetch social links
      const { data: socialData, error: socialError } = await supabase
        .from('social_links')
        .select('*');
      
      if (socialData) setSocialLinks(socialData);
    } catch (error) {
      console.error("Error fetching contact data:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendEmail = async (formData: FormData) => {
    try {
      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: contactInfo?.email || 'your-email@example.com',
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log("Email sent successfully:", response);
      return true;
    } catch (error) {
      console.error("Email send error:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Send email
    const emailSent = await sendEmail(formData);
    
    if (emailSent) {
      setIsSubmitted(true);
      toast.success(contactInfo?.success_message || "Message sent successfully! I'll get back to you soon.");
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", email: "", message: "" });
      }, 5000);
    } else {
      toast.error("Failed to send message. Please try again or contact me directly via email.");
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    if (errors[e.target.id as keyof FormData]) {
      setErrors({
        ...errors,
        [e.target.id]: "",
      });
    }
  };

  if (loading) {
    return (
      <section id="contact" className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading contact info...</p>
        </div>
      </section>
    );
  }

  const contactItems = [
    { icon: Mail, title: "Email", content: contactInfo?.email, link: `mailto:${contactInfo?.email}` },
    { icon: Phone, title: "Phone", content: contactInfo?.phone, link: `tel:${contactInfo?.phone}` },
    { icon: MapPin, title: "Location", content: contactInfo?.location, link: "#" },
  ].filter(item => item.content);

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {contactInfo?.availability || "Have a project in mind? I'd love to hear about it."}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Let's Talk</h3>
              <p className="text-muted-foreground">
                I'd love to hear about your project. Send me a message and I'll respond within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              {contactItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.link}
                    className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300"
                  >
                    <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.title}</p>
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {item.content}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="pt-6">
                <h4 className="font-semibold mb-4">Connect with me</h4>
                <div className="flex gap-4">
                  {socialLinks.map((link) => (
                    <Button key={link.platform} variant="outline" size="icon" asChild>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.platform === 'github' && (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                        )}
                        {link.platform === 'linkedin' && (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z" />
                          </svg>
                        )}
                        {link.platform === 'email' && <Mail className="h-4 w-4" />}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {!contactInfo?.contact_form_enabled ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Contact form is currently disabled. Please use the contact information to reach out.</p>
              </div>
            ) : isSubmitted ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-green-500/10 border border-green-500 rounded-lg p-8 text-center"
              >
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">
                  {contactInfo?.success_message || "Thanks for reaching out! I'll get back to you soon."}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project..."
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? "border-red-500" : ""}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500">{errors.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};