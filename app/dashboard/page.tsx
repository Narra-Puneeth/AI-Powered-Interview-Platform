import Link from "next/link"
import { ArrowRight, Calendar, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PerformanceLineChart } from "@/components/performance-line-chart"
import { SkillsRadarChart } from "@/components/skills-radar-chart"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Track your interview performance and progress</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.8</div>
            <p className="text-xs text-muted-foreground">+0.3 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Practice Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2 hrs</div>
            <p className="text-xs text-muted-foreground">+1.2 hrs from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
            <CardDescription>Your interview scores for the past 6 sessions</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <PerformanceLineChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills Assessment</CardTitle>
            <CardDescription>Your performance across different skill areas</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <SkillsRadarChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Your most recent interview sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "May 10, 2025", type: "Technical", score: 8.2 },
                { date: "May 5, 2025", type: "HR", score: 7.5 },
                { date: "Apr 28, 2025", type: "Mixed", score: 7.8 },
                { date: "Apr 20, 2025", type: "Technical", score: 6.9 },
              ].map((session, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium">{session.date}</span>
                    <span className="text-sm text-muted-foreground">{session.type} Interview</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
                      {session.score}/10
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/session/1">View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/history">View All Sessions</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Follow-up Questions</CardTitle>
            <CardDescription>Questions that need more practice</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="mb-4 grid w-full grid-cols-2">
                <TabsTrigger value="pending">Pending (3)</TabsTrigger>
                <TabsTrigger value="completed">Completed (5)</TabsTrigger>
              </TabsList>
              <TabsContent value="pending">
                <div className="space-y-4">
                  {[
                    "How do you handle situations where your initial approach to solving a problem doesn't work?",
                    "Can you explain the concept of database indexing and when you would use it?",
                    "Describe a situation where you had to work with a difficult team member and how you handled it.",
                  ].map((question, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <p className="mb-4">{question}</p>
                      <Button size="sm" className="gap-2">
                        Answer Now <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="completed">
                <div className="space-y-4">
                  {[
                    "What is your approach to learning new technologies?",
                    "Describe your experience with agile development methodologies.",
                    "How do you prioritize tasks when working on multiple projects?",
                    "What are your strengths and weaknesses as a developer?",
                    "How do you stay updated with the latest industry trends?",
                  ].map((question, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <p className="mb-2">{question}</p>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                          Completed
                        </span>
                        <Button variant="ghost" size="sm">
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
