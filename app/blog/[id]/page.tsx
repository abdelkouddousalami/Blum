"use client"

import { PageTransition } from "../../components/page-transition"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Calendar, Clock, ArrowLeft, Tag, Share2, Bookmark, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

// Sample blog data (same as in blog/page.tsx)
const blogPosts = [
  {
    id: 1,
    title: "Gold's Historical Performance During Economic Downturns",
    excerpt: "Analyzing how gold has performed as a safe-haven asset during major economic crises throughout history.",
    content: `
      <p>Gold has long been considered a safe-haven asset during times of economic uncertainty and market volatility. This article examines gold's performance during major economic downturns throughout history and analyzes patterns that investors should be aware of.</p>
      
      <h2>The Great Depression (1929-1939)</h2>
      <p>During the Great Depression, after the initial market crash, gold actually performed exceptionally well. In 1934, the U.S. government raised the price of gold from $20.67 to $35 per ounce, representing a 69% increase. This move was part of the government's strategy to devalue the dollar and stimulate the economy.</p>
      
      <h2>The 1970s Stagflation</h2>
      <p>The 1970s were characterized by high inflation, high unemployment, and slow economic growth - a phenomenon known as stagflation. During this period, gold prices soared from around $35 per ounce in 1971 to over $850 by January 1980, representing an astounding 2,300% increase.</p>
      
      <h2>The 2008 Financial Crisis</h2>
      <p>During the 2008 global financial crisis, gold initially fell along with other assets as investors sold holdings to cover losses and meet margin calls. However, it quickly recovered and entered a bull market that lasted until 2011, with prices rising from around $700 in late 2008 to over $1,900 by September 2011 - a gain of more than 170%.</p>
      
      <h2>The COVID-19 Pandemic</h2>
      <p>When the COVID-19 pandemic hit global markets in early 2020, gold once again demonstrated its safe-haven status. As stock markets plummeted in March 2020, gold prices initially dipped but then rallied strongly, reaching an all-time high of over $2,075 per ounce in August 2020.</p>
      
      <h2>Key Patterns and Insights</h2>
      <p>Several patterns emerge from analyzing gold's performance during economic crises:</p>
      <ul>
        <li>Gold often experiences initial selling pressure during the early stages of a crisis as investors liquidate assets to raise cash</li>
        <li>Once monetary policy responses kick in (usually involving interest rate cuts and quantitative easing), gold typically begins to rally</li>
        <li>Gold tends to perform best during periods of negative real interest rates (when inflation exceeds nominal interest rates)</li>
        <li>The metal often continues to rise even after the initial crisis has passed, sometimes for several years</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>While past performance doesn't guarantee future results, gold has consistently served as a store of value during economic downturns. Its performance during crises suggests that it can be an effective portfolio diversifier and potential hedge against extreme market events. Investors should consider gold's historical role when developing strategies for navigating uncertain economic times.</p>
    `,
    category: "Gold",
    date: "March 12, 2025",
    readTime: "8 min read",
    image: "/placeholder.svg?height=400&width=800",
    author: {
      name: "Michael Johnson",
      title: "Senior Market Analyst",
      image: "/placeholder.svg?height=100&width=100",
    },
    tags: ["Gold", "Investment", "Economy"],
  },
  {
    id: 2,
    title: "Silver: Industrial Demand vs Investment Appeal",
    excerpt: "Exploring the dual nature of silver as both an industrial metal and an investment asset.",
    content: `
      <p>Silver occupies a unique position in the world of commodities, straddling the line between industrial metal and investment asset. This dual nature creates a complex market dynamic that investors need to understand.</p>
      
      <h2>Silver's Industrial Applications</h2>
      <p>Unlike gold, silver has extensive industrial applications due to its unique properties:</p>
      <ul>
        <li><strong>Electrical conductivity:</strong> Silver is the most electrically conductive element, making it essential for electronics</li>
        <li><strong>Thermal conductivity:</strong> Silver efficiently transfers heat, useful in thermal management applications</li>
        <li><strong>Antibacterial properties:</strong> Silver is used in medical applications and water purification</li>
        <li><strong>Photosensitivity:</strong> Though declining with digital photography, silver is still used in specialized photographic applications</li>
      </ul>
      
      <p>Key industrial sectors driving silver demand include:</p>
      <ul>
        <li>Electronics and electrical applications (approximately 25% of industrial demand)</li>
        <li>Photovoltaics/solar panels (approximately 20% of industrial demand)</li>
        <li>Brazing alloys and solders</li>
        <li>Medical applications</li>
        <li>Automotive industry</li>
      </ul>
      
      <h2>Silver as an Investment Asset</h2>
      <p>Despite its industrial uses, silver maintains strong investment appeal:</p>
      <ul>
        <li><strong>Store of value:</strong> Like gold, silver has been used as money for thousands of years</li>
        <li><strong>Inflation hedge:</strong> Precious metals often perform well during periods of high inflation</li>
        <li><strong>Portfolio diversification:</strong> Silver typically has a low correlation with stocks and bonds</li>
        <li><strong>Accessibility:</strong> Lower price point than gold, making it accessible to more investors</li>
      </ul>
      
      <h2>The Market Dynamics</h2>
      <p>The interplay between industrial and investment demand creates unique market dynamics:</p>
      <ul>
        <li><strong>Higher volatility:</strong> Silver is typically more volatile than gold, partly due to its smaller market size</li>
        <li><strong>Economic sensitivity:</strong> Industrial demand makes silver more sensitive to economic cycles</li>
        <li><strong>Gold-silver ratio:</strong> The ratio between gold and silver prices is closely watched by investors</li>
        <li><strong>Supply constraints:</strong> Unlike gold, much silver is consumed in industrial processes and not recycled</li>
      </ul>
      
      <h2>Current Trends and Future Outlook</h2>
      <p>Several trends are shaping the silver market:</p>
      <ul>
        <li><strong>Green energy transition:</strong> Growing demand from solar panels and electric vehicles</li>
        <li><strong>5G technology:</strong> Increased use in electronics and telecommunications</li>
        <li><strong>Investment demand:</strong> Rising interest in physical silver and ETFs</li>
        <li><strong>Supply challenges:</strong> Approximately 75% of silver comes as a byproduct of other metal mining</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Silver's dual nature as both an industrial metal and an investment asset creates both opportunities and challenges for investors. Understanding the interplay between these two demand drivers is essential for anyone looking to invest in this versatile precious metal. As the world transitions to green energy and advanced technologies, silver's industrial demand may provide a solid foundation for its price, while its monetary history and investment appeal continue to attract those seeking portfolio diversification and inflation protection.</p>
    `,
    category: "Silver",
    date: "March 10, 2025",
    readTime: "6 min read",
    image: "/placeholder.svg?height=400&width=800",
    author: {
      name: "Sarah Chen",
      title: "Commodities Analyst",
      image: "/placeholder.svg?height=100&width=100",
    },
    tags: ["Silver", "Industry", "Investment"],
  },
  // Other blog posts would be defined here
]

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])

  useEffect(() => {
    // In a real app, you would fetch the post from an API
    // For this demo, we'll use the sample data
    const postId = Number(params.id)
    const foundPost = blogPosts.find((p) => p.id === postId)

    if (foundPost) {
      setPost(foundPost)

      // Find related posts based on tags
      const related = blogPosts
        .filter((p) => p.id !== postId && p.tags.some((tag) => foundPost.tags.includes(tag)))
        .slice(0, 2)

      setRelatedPosts(related)
    }

    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="container py-6 mt-16 flex justify-center items-center min-h-[50vh]">
        <motion.div
          className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container py-6 mt-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Link href="/blog">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="container py-6 mt-16">
        <div className="mb-6">
          <Link href="/blog">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <img
                  src={post.author.image || "/placeholder.svg"}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">{post.author.name}</div>
                  <div className="text-xs text-muted-foreground">{post.author.title}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {post.date}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </div>
            </div>

            <div className="mb-8">
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-[300px] object-cover rounded-lg"
              />
            </div>

            <div className="flex gap-2 mb-8">
              {post.tags.map((tag: string) => (
                <span key={tag} className="inline-flex items-center px-3 py-1 text-sm bg-accent rounded-full">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            <div
              className="prose prose-lg dark:prose-invert max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="flex justify-between items-center border-t border-b py-4 mb-8">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Like
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>

            {relatedPosts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Related Articles</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <motion.div key={relatedPost.id} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                      <Link href={`/blog/${relatedPost.id}`}>
                        <Card className="overflow-hidden border-none shadow-lg h-full">
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={relatedPost.image || "/placeholder.svg"}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="pt-4">
                            <h3 className="font-semibold mb-2 hover:text-primary transition-colors">
                              {relatedPost.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}

