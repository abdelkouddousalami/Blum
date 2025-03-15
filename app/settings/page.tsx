"use client"

import { PageTransition } from "../components/page-transition"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { Bell, User, Shield, Eye, EyeOff, Save, RefreshCw } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
    }, 1500)
  }

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
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
        </motion.div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="account">
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Update your account details and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" defaultValue="Acme Inc." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select defaultValue="analyst">
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="analyst">Analyst</SelectItem>
                          <SelectItem value="trader">Trader</SelectItem>
                          <SelectItem value="investor">Investor</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="Materials market analyst with 5+ years of experience in precious metals."
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Preferences</h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="currency">Currency</Label>
                        <p className="text-sm text-muted-foreground">Select your preferred currency for prices</p>
                      </div>
                      <Select defaultValue="usd">
                        <SelectTrigger id="currency" className="w-[180px]">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="jpy">JPY (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Time Zone</Label>
                        <p className="text-sm text-muted-foreground">Set your local time zone</p>
                      </div>
                      <Select defaultValue="utc">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                          <SelectItem value="est">EST (GMT-5)</SelectItem>
                          <SelectItem value="pst">PST (GMT-8)</SelectItem>
                          <SelectItem value="cet">CET (GMT+1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how and when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>

                    {[
                      {
                        id: "price-alerts",
                        label: "Price Alerts",
                        description: "Receive notifications when materials reach your target price",
                      },
                      {
                        id: "market-reports",
                        label: "Market Reports",
                        description: "Weekly summary of market movements and trends",
                      },
                      {
                        id: "news-updates",
                        label: "News Updates",
                        description: "Breaking news about materials markets",
                      },
                      {
                        id: "blog-articles",
                        label: "New Blog Articles",
                        description: "Be notified when new articles are published",
                      },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor={item.id}>{item.label}</Label>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <Switch id={item.id} defaultChecked={item.id !== "blog-articles"} />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Push Notifications</h3>

                    {[
                      {
                        id: "push-price-alerts",
                        label: "Price Alerts",
                        description: "Instant notifications for significant price movements",
                      },
                      {
                        id: "push-breaking-news",
                        label: "Breaking News",
                        description: "Critical market developments and news",
                      },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor={item.id}>{item.label}</Label>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <Switch id={item.id} defaultChecked />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="security">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your password and security preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Change Password</h3>

                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input id="current-password" type={showPassword ? "text" : "password"} placeholder="••••••••" />
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input id="new-password" type={showPassword ? "text" : "password"} placeholder="••••••••" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Input id="confirm-password" type={showPassword ? "text" : "password"} placeholder="••••••••" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch id="2fa" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Session Management</h3>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Active Sessions</p>
                          <p className="text-sm text-muted-foreground">You're currently logged in on these devices</p>
                        </div>
                      </div>

                      <div className="space-y-3 mt-4">
                        {[
                          { device: "Windows PC", location: "New York, USA", current: true, lastActive: "Now" },
                          { device: "iPhone 13", location: "New York, USA", current: false, lastActive: "2 hours ago" },
                          { device: "MacBook Pro", location: "Boston, USA", current: false, lastActive: "Yesterday" },
                        ].map((session, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                          >
                            <div>
                              <div className="font-medium flex items-center">
                                {session.device}
                                {session.current && (
                                  <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                    Current
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {session.location} • {session.lastActive}
                              </div>
                            </div>
                            {!session.current && (
                              <Button variant="outline" size="sm">
                                Log Out
                              </Button>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}

