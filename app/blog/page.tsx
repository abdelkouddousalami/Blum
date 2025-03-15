"use client"

import { PageTransition } from "../components/page-transition"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Search, Calendar, Clock, ArrowRight, BookOpen, Tag } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Navbar } from "../components/navbar"

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: "Gold's Historical Performance During Economic Downturns",
    excerpt: "Analyzing how gold has performed as a safe-haven asset during major economic crises throughout history.",
    category: "Gold",
    date: "March 12, 2025",
    readTime: "8 min read",
    image: "https://img.freepik.com/vecteurs-libre/fond-noir-degrade-elements-realistes_52683-76356.jpg?t=st=1742081786~exp=1742085386~hmac=ac416051ce5074ce4939801fe8a31dc39ab1125b2cb9403141099e00f1258a48&w=1380",
    featured: true,
    tags: ["Gold", "Investment", "Economy"],
  },
  {
    id: 2,
    title: "Silver: Industrial Demand vs Investment Appeal",
    excerpt: "Exploring the dual nature of silver as both an industrial metal and an investment asset.",
    category: "Silver",
    date: "March 10, 2025",
    readTime: "6 min read",
    image: "https://img.freepik.com/photos-gratuite/peindre-toile_53876-88711.jpg?t=st=1742081846~exp=1742085446~hmac=309d6e5186cbc3e5040040342c0fec24db3d699388d4ebaefc5a0a451b6fe197&w=1380",
    featured: true,
    tags: ["Silver", "Industry", "Investment"],
  },
  {
    id: 3,
    title: "Copper's Role in the Green Energy Transition",
    excerpt: "How copper demand is being driven by renewable energy technologies and electric vehicles.",
    category: "Copper",
    date: "March 8, 2025",
    readTime: "7 min read",
    image: "https://img.freepik.com/photos-gratuite/abstrait-geometrique-3d_1048-16201.jpg?t=st=1742081896~exp=1742085496~hmac=9be4ba03355c0326703d481ea0d37ec12e81a9e9faabb35d20ff6b29466678ad&w=1380",
    featured: false,
    tags: ["Copper", "Green Energy", "EV"],
  },
  {
    id: 4,
    title: "Platinum Group Metals: Supply Constraints and Future Outlook",
    excerpt: "Analyzing the supply challenges facing platinum group metals and what it means for prices.",
    category: "Platinum",
    date: "March 5, 2025",
    readTime: "9 min read",
    image: "https://img.freepik.com/vecteurs-libre/illustration-concept-portefeuille_114360-1647.jpg?t=st=1742081951~exp=1742085551~hmac=97dacf0d70f7e36cc7b4450bcd267c41208473558084dc67afd98d3c67adea78&w=826",
    featured: false,
    tags: ["Platinum", "Palladium", "Mining"],
  },
  {
    id: 5,
    title: "The Impact of Central Bank Policies on Precious Metals",
    excerpt: "How monetary policy decisions affect gold, silver, and other precious metals markets.",
    category: "Analysis",
    date: "March 3, 2025",
    readTime: "10 min read",
    image: "https://img.freepik.com/vecteurs-libre/illustration-concept-statistiques-site_114360-1434.jpg?t=st=1742081992~exp=1742085592~hmac=5a6f8fcbfe5f7e8caaaf53c00b67d078f13df43ec4f500b8b629ef1c4b8117d3&w=826",
    featured: false,
    tags: ["Central Banks", "Monetary Policy", "Gold"],
  },
  {
    id: 6,
    title: "Aluminum: The Backbone of Modern Manufacturing",
    excerpt: "Exploring aluminum's critical role in various industries and its price drivers.",
    category: "Aluminum",
    date: "February 28, 2025",
    readTime: "5 min read",
    image: "https://img.freepik.com/vecteurs-libre/illustration-concept-menuisier_114360-2773.jpg?t=st=1742082047~exp=1742085647~hmac=2ac80f9bf5f55b19039c5e2b62522becbef38d0e476cdf1fe0fad1b453948572&w=826",
    featured: false,
    tags: ["Aluminum", "Manufacturing", "Industry"],
  },
]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  // Filter posts based on search term and category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = activeCategory === "all" || post.category.toLowerCase() === activeCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  // Get featured posts
  const featuredPosts = blogPosts.filter((post) => post.featured)

  return (
    <PageTransition>
      <Navbar />
      <div className="container py-6 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Materials Insights Blog
          </h1>
          <p className="text-muted-foreground mt-2">
            Expert analysis and insights on precious metals and materials markets
          </p>
        </motion.div>

        {/* Featured posts */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Featured Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/blog/${post.id}`}>
                  <Card className="overflow-hidden border-none shadow-lg h-full">
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500"
                        whileHover={{ scale: 1.05 }}
                      />
                      <div className="absolute top-0 left-0 m-3">
                        <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2 hover:text-primary transition-colors">{post.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                        <span className="mx-1">•</span>
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="p-0 h-auto font-medium text-primary hover:text-primary/80">
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveCategory}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Gold">Gold</TabsTrigger>
              <TabsTrigger value="Silver">Silver</TabsTrigger>
              <TabsTrigger value="Copper">Copper</TabsTrigger>
              <TabsTrigger value="Platinum">Platinum</TabsTrigger>
              <TabsTrigger value="Analysis">Analysis</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* All posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/blog/${post.id}`}>
                  <Card className="overflow-hidden border-none shadow-lg h-full">
                    <div className="relative h-40 overflow-hidden">
                      <motion.img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500"
                        whileHover={{ scale: 1.05 }}
                      />
                      <div className="absolute top-0 left-0 m-3">
                        <span className="px-2 py-1 text-xs font-medium bg-primary/80 text-primary-foreground rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-2 hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                        <span className="mx-1">•</span>
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.map((tag) => (
                          <span key={tag} className="inline-flex items-center px-2 py-1 text-xs bg-accent rounded-full">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex justify-center py-12">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No articles found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}

