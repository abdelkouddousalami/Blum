"use client"

import { PageTransition } from "../components/page-transition"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"
import { Search, HelpCircle, Mail, MessageSquare, Phone, FileText } from "lucide-react"
import { useState } from "react"

// Sample FAQ data
const faqs = [
  {
    question: "How often are material prices updated?",
    answer:
      "Material prices on our dashboard are updated in real-time during market hours. For most materials, this means updates every few minutes. Historical data is updated daily after market close.",
  },
  {
    question: "Can I set price alerts for specific materials?",
    answer:
      "Yes, you can set custom price alerts for any material in our database. Navigate to the material's detail page, click on 'Set Alert', and configure your desired price threshold. You'll receive notifications via email or push notification based on your settings.",
  },
  {
    question: "What sources do you use for material price data?",
    answer:
      "We aggregate data from multiple reputable sources including major commodities exchanges, financial data providers, and industry-specific sources. This ensures our prices are accurate and comprehensive.",
  },
  {
    question: "How can I export data from the dashboard?",
    answer:
      "Premium users can export data in various formats including CSV, Excel, and PDF. Simply navigate to the data you wish to export, click the 'Export' button, and select your preferred format.",
  },
  {
    question: "Do you provide historical price data?",
    answer:
      "Yes, we provide historical price data going back up to 10 years for most materials. Premium subscribers have access to the full historical dataset, while free users can access up to 1 year of historical data.",
  },
  {
    question: "How do I interpret the charts and technical indicators?",
    answer:
      "We offer comprehensive guides on interpreting charts and technical indicators in our Knowledge Base. Additionally, you can hover over any indicator or chart element to see a brief explanation of what it represents.",
  },
  {
    question: "Is there an API available for developers?",
    answer:
      "Yes, we offer a RESTful API for developers who want to integrate our material price data into their own applications. API access is available on our Enterprise plan. Contact our sales team for more information.",
  },
  {
    question: "How do I cancel or change my subscription?",
    answer:
      "You can manage your subscription from the Account Settings page. Navigate to the 'Billing' tab to upgrade, downgrade, or cancel your subscription. Changes will take effect at the end of your current billing cycle.",
  },
]

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter FAQs based on search term
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <PageTransition>
      <div className="container py-6 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Help & Support
          </h1>
          <p className="text-muted-foreground mt-2">Find answers to common questions or contact our support team</p>
        </motion.div>

        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for answers..."
              className="pl-10 py-6 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            {
              title: "Knowledge Base",
              description: "Browse our comprehensive guides and tutorials",
              icon: FileText,
              color: "bg-blue-500/10 text-blue-500",
              link: "#knowledge-base",
            },
            {
              title: "Live Chat",
              description: "Chat with our support team in real-time",
              icon: MessageSquare,
              color: "bg-green-500/10 text-green-500",
              link: "#live-chat",
            },
            {
              title: "Contact Us",
              description: "Get in touch via email or phone",
              icon: Mail,
              color: "bg-purple-500/10 text-purple-500",
              link: "#contact",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <a href={item.link}>
                <Card className="border-none shadow-lg h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center mb-2`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-none shadow-lg mb-10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Quick answers to common questions about our platform</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <AccordionItem value={`item-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-10">
                  <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-4">We couldn't find any FAQs matching your search</p>
                  <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6" id="contact">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-none shadow-lg h-full">
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>Get in touch with our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input id="name" placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="Your email" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input id="subject" placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button type="submit" className="w-full">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-none shadow-lg h-full">
              <CardHeader>
                <CardTitle>Other Ways to Reach Us</CardTitle>
                <CardDescription>We're here to help you with any questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Phone Support</h3>
                      <p className="text-muted-foreground text-sm mb-1">Available Monday-Friday, 9am-5pm EST</p>
                      <p className="font-medium">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email Support</h3>
                      <p className="text-muted-foreground text-sm mb-1">We'll respond within 24 hours</p>
                      <p className="font-medium">support@materialstrack.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Live Chat</h3>
                      <p className="text-muted-foreground text-sm mb-1">Chat with our support team in real-time</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Start Chat
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-4">Office Location</h3>
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src="/placeholder.svg?height=300&width=600"
                      alt="Office Map"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">123 Financial District, New York, NY 10005, USA</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}

