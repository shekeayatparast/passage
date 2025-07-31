"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Github, 
  ExternalLink, 
  Star, 
  GitFork, 
  Code, 
  Users,
  Calendar,
  Globe,
  Shield,
  Zap
} from "lucide-react";
import { Locale, defaultLocale, translations } from "@/lib/i18n";
import { AuthGuard } from "@/components/auth-guard";

interface GitHubRepo {
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  created_at: string;
  updated_at: string;
}

export default function AboutPage() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const t = translations[locale];

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch('https://api.github.com/users/najidevs/repos');
        const data = await response.json();
        
        // Sort by stars and get top 6
        const sortedRepos = data
          .sort((a: GitHubRepo, b: GitHubRepo) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6);
        
        setRepos(sortedRepos);
      } catch (error) {
        console.error('Error fetching repos:', error);
        // Fallback with mock data
        setRepos([
          {
            name: "passage-panel",
            description: "Modern Passage panel management interface for Cloudflare Workers",
            language: "TypeScript",
            stargazers_count: 150,
            forks_count: 30,
            html_url: "https://github.com/najidevs/passage-panel",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-15T00:00:00Z"
          },
          {
            name: "cloudflare-vpn",
            description: "VPN solutions on Cloudflare Workers",
            language: "JavaScript",
            stargazers_count: 89,
            forks_count: 15,
            html_url: "https://github.com/najidevs/cloudflare-vpn",
            created_at: "2023-12-01T00:00:00Z",
            updated_at: "2024-01-10T00:00:00Z"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      TypeScript: "bg-blue-100 text-blue-800",
      JavaScript: "bg-yellow-100 text-yellow-800",
      Python: "bg-green-100 text-green-800",
      Go: "bg-cyan-100 text-cyan-800",
      Rust: "bg-orange-100 text-orange-800",
      Java: "bg-red-100 text-red-800",
    };
    return colors[language] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <AuthGuard>
      <DashboardLayout locale={locale} onLocaleChange={setLocale}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex items-center gap-3">
                <Github className="h-12 w-12" />
                <h1 className="text-4xl font-bold">NajiDevs</h1>
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {locale === "fa" 
                ? "ما تیمی از توسعه‌دهندگان پرشور هستیم که بر ساخت راه‌حل‌های نوآورانه برای شبکه و امنیت تمرکز داریم."
                : "We are a team of passionate developers focused on building innovative solutions for networking and security."
              }
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <a href="https://github.com/najidevs" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  {locale === "fa" ? "مشاهده پروفایل" : "View Profile"}
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://github.com/najidevs?tab=repositories" target="_blank" rel="noopener noreferrer">
                  <Code className="w-4 h-4 mr-2" />
                  {locale === "fa" ? "مخازن کد" : "Repositories"}
                </a>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {locale === "fa" ? "مخازن عمومی" : "Public Repos"}
                </CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25</div>
                <p className="text-xs text-muted-foreground">
                  {locale === "fa" ? "مخازن منتشر شده" : "Published repositories"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {locale === "fa" ? "ستاره‌ها" : "Stars"}
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === "fa" ? "ستاره دریافتی" : "Total stars received"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {locale === "fa" ? "فورک‌ها" : "Forks"}
                </CardTitle>
                <GitFork className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {repos.reduce((sum, repo) => sum + repo.forks_count, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === "fa" ? "فورک شده" : "Times forked"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {locale === "fa" ? "زبان‌ها" : "Languages"}
                </CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(repos.map(repo => repo.language)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === "fa" ? "زبان‌های برنامه‌نویسی" : "Programming languages"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Featured Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                {locale === "fa" ? "پروژه‌های ویژه" : "Featured Projects"}
              </CardTitle>
              <CardDescription>
                {locale === "fa" 
                  ? "محبوب‌ترین مخازن ما در GitHub"
                  : "Our most popular repositories on GitHub"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i}>
                      <CardHeader>
                        <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                        <div className="h-3 bg-muted animate-pulse rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-3 bg-muted animate-pulse rounded"></div>
                          <div className="h-3 bg-muted animate-pulse rounded w-5/6"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {repos.map((repo) => (
                    <Card key={repo.name} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">
                              <a 
                                href={repo.html_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors flex items-center gap-2"
                              >
                                {repo.name}
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge className={getLanguageColor(repo.language)}>
                                {repo.language}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="text-sm">
                          {repo.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              <span>{repo.stargazers_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GitFork className="h-4 w-4" />
                              <span>{repo.forks_count}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {locale === "fa" ? "ایجاد شده در" : "Created"} {formatDate(repo.created_at)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              <span>
                                {locale === "fa" ? "به‌روزرسانی در" : "Updated"} {formatDate(repo.updated_at)}
                              </span>
                            </div>
                          </div>
                          
                          <Button asChild className="w-full">
                            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4 mr-2" />
                              {locale === "fa" ? "مشاهده در GitHub" : "View on GitHub"}
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* About Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {locale === "fa" ? "درباره این پنل" : "About This Panel"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold">
                    {locale === "fa" ? "فناوری‌های استفاده شده" : "Technologies Used"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Next.js 15</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                    <Badge variant="secondary">Tailwind CSS</Badge>
                    <Badge variant="secondary">shadcn/ui</Badge>
                    <Badge variant="secondary">Cloudflare Workers</Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">
                    {locale === "fa" ? "ویژگی‌های اصلی" : "Key Features"}
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• {locale === "fa" ? "رابط کاربری مدرن و واکنش‌گرا" : "Modern and responsive UI"}</li>
                    <li>• {locale === "fa" ? "پشتیبانی از چندین زبان" : "Multi-language support"}</li>
                    <li>• {locale === "fa" ? "حالت روشن و تاریک" : "Light and dark mode"}</li>
                    <li>• {locale === "fa" ? "پشتیبانی از پروتکل‌های متعدد" : "Multiple protocol support"}</li>
                    <li>• {locale === "fa" ? "مدیریت کاربران پیشرفته" : "Advanced user management"}</li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {locale === "fa" 
                    ? "این پنل با ❤️ توسط تیم NajiDevs توسعه داده شده است و تحت лиценз MIT منتشر می‌شود."
                    : "This panel is developed with ❤️ by NajiDevs team and is released under MIT license."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}