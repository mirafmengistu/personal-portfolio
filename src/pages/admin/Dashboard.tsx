import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { 
  FolderGit2, 
  Code2, 
  Mail, 
  User, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    loading: true,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch projects count
      const { count: projectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });
      
      // Fetch skills count
      const { count: skillsCount } = await supabase
        .from('skills')
        .select('*', { count: 'exact', head: true });

      setStats({
        projects: projectsCount || 0,
        skills: skillsCount || 0,
        messages: 0,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const statCards = [
    { 
      title: "Total Projects", 
      value: stats.projects, 
      icon: FolderGit2, 
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    { 
      title: "Skills", 
      value: stats.skills, 
      icon: Code2, 
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    { 
      title: "Messages", 
      value: stats.messages, 
      icon: Mail, 
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    { 
      title: "Profile Views", 
      value: "N/A", 
      icon: User, 
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
  ];

  const recentActivities = [
    {
      icon: CheckCircle2,
      title: "Project Published",
      description: "Your latest project is now live",
      time: "2 hours ago",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: Clock,
      title: "Profile Updated",
      description: "You updated your professional summary",
      time: "Yesterday",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: AlertCircle,
      title: "New Message",
      description: "You have a new contact form submission",
      time: "2 days ago",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: TrendingUp,
      title: "Skill Added",
      description: "Added React Native to your skills",
      time: "3 days ago",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Welcome back! Here is an overview of your portfolio.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Last updated: Today
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.title} 
              className="hover:shadow-md transition-shadow border"
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-2 md:p-3 rounded-lg`}>
                    <Icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className={`${activity.bgColor} p-2 rounded-lg flex-shrink-0`}>
                        <Icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs md:text-sm text-muted-foreground truncate">
                          {activity.description}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full text-left px-3 py-2.5 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                <p className="text-sm font-medium text-primary">Add New Project</p>
                <p className="text-xs text-muted-foreground">Showcase your latest work</p>
              </button>
              <button className="w-full text-left px-3 py-2.5 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors">
                <p className="text-sm font-medium text-emerald-500">Update Skills</p>
                <p className="text-xs text-muted-foreground">Add new technologies</p>
              </button>
              <button className="w-full text-left px-3 py-2.5 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 transition-colors">
                <p className="text-sm font-medium text-purple-500">View Messages</p>
                <p className="text-xs text-muted-foreground">Check your inbox</p>
              </button>
              <button className="w-full text-left px-3 py-2.5 rounded-lg bg-blue-500/5 hover:bg-blue-500/10 transition-colors">
                <p className="text-sm font-medium text-blue-500">Edit Profile</p>
                <p className="text-xs text-muted-foreground">Update your information</p>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};