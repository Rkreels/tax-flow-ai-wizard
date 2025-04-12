
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Book, FileText, Search, Star, Bookmark, Clock, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ArticleType {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const KnowledgeBasePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  
  const isAdmin = user?.role === "admin";
  const isSupport = user?.role === "support";
  
  // Sample articles
  const [articles, setArticles] = useState<ArticleType[]>([
    {
      id: "1",
      title: "Understanding Tax Filing Deadlines",
      description: "A comprehensive guide to tax filing deadlines in the current tax year",
      content: "Content goes here...",
      category: "tax-basics",
      tags: ["deadlines", "filing", "calendar"],
      createdAt: "2025-01-15",
      updatedAt: "2025-03-02"
    },
    {
      id: "2",
      title: "How to Document Business Expenses",
      description: "Learn how to properly document and report business expenses for tax purposes",
      content: "Content goes here...",
      category: "business-taxes",
      tags: ["business", "expenses", "deductions"],
      createdAt: "2025-02-10",
      updatedAt: "2025-02-10"
    },
    {
      id: "3",
      title: "Child Tax Credit: Complete Guide",
      description: "Everything you need to know about claiming the Child Tax Credit",
      content: "Content goes here...",
      category: "tax-credits",
      tags: ["children", "credit", "dependents"],
      createdAt: "2025-01-22",
      updatedAt: "2025-03-15"
    },
    {
      id: "4",
      title: "Itemized vs Standard Deductions",
      description: "How to decide between itemizing deductions or taking the standard deduction",
      content: "Content goes here...",
      category: "tax-basics",
      tags: ["deductions", "itemized", "standard"],
      createdAt: "2025-02-05",
      updatedAt: "2025-02-05"
    },
    {
      id: "5",
      title: "Self-Employment Tax Guide",
      description: "Guide to understanding and calculating self-employment taxes",
      content: "Content goes here...",
      category: "business-taxes",
      tags: ["self-employed", "freelance", "taxes"],
      createdAt: "2025-01-30",
      updatedAt: "2025-03-10"
    },
    {
      id: "6",
      title: "Foreign Income Reporting Requirements",
      description: "Requirements for reporting income from foreign sources",
      content: "Content goes here...",
      category: "international",
      tags: ["foreign", "income", "international"],
      createdAt: "2025-02-20",
      updatedAt: "2025-02-20"
    }
  ]);

  // Filter articles based on search term
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group articles by category
  const articlesByCategory = filteredArticles.reduce<Record<string, ArticleType[]>>((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {});

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "tax-basics": return "Tax Basics";
      case "business-taxes": return "Business Taxes";
      case "tax-credits": return "Tax Credits";
      case "international": return "International Taxes";
      default: return category.replace("-", " ").replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          {(isAdmin || isSupport) && (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Article
            </Button>
          )}
        </div>

        <div className="relative bg-primary/10 rounded-lg p-6 mb-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-2xl font-bold">Search our Knowledge Base</h2>
            <form className="flex max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="search"
                placeholder="Search for articles..."
                className="rounded-r-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" className="rounded-l-none">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 md:grid-cols-4">
            <TabsTrigger value="all">All Articles</TabsTrigger>
            <TabsTrigger value="tax-basics">Tax Basics</TabsTrigger>
            <TabsTrigger value="business-taxes">Business Taxes</TabsTrigger>
            <TabsTrigger value="tax-credits">Tax Credits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6 pt-4">
            {Object.entries(articlesByCategory).map(([category, articles]) => (
              <div key={category} className="space-y-4">
                <h2 className="text-2xl font-semibold">{getCategoryTitle(category)}</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {articles.map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            ))}

            {Object.keys(articlesByCategory).length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No articles found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms</p>
              </div>
            )}
          </TabsContent>
          
          {["tax-basics", "business-taxes", "tax-credits"].map(category => (
            <TabsContent key={category} value={category} className="space-y-4 pt-4">
              <div className="grid gap-4 md:grid-cols-2">
                {(articlesByCategory[category] || []).map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {(!articlesByCategory[category] || articlesByCategory[category].length === 0) && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No articles found in this category</h3>
                  <p className="text-muted-foreground">Try adjusting your search terms or checking another category</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
};

interface ArticleCardProps {
  article: ArticleType;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{article.title}</CardTitle>
        <CardDescription>{article.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map(tag => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            <span>Updated {article.updatedAt}</span>
          </div>
          <Button size="sm">Read Article</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeBasePage;
