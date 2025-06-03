import Link from "next/link"
import { ArrowLeft, Download, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeedbackRadarChart } from "@/components/feedback-radar-chart"

export default function FeedbackPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Interview is Complete</h1>
        <p className="text-muted-foreground">Review your performance and feedback</p>
      </div>

      <Tabs defaultValue="summary">
        <TabsList className="mb-8 grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="details">Detailed Feedback</TabsTrigger>
          <TabsTrigger value="scores">Score Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Interview Summary</CardTitle>
              <CardDescription>Overall assessment of your interview performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-lg">
                  You demonstrated good understanding of your projects and technical skills, particularly in frontend
                  development. Your communication was clear and structured, though you could improve on providing more
                  concrete examples when discussing your experience. You struggled somewhat with DBMS indexing concepts,
                  which is an area for improvement. Overall, you presented yourself as a competent candidate with good
                  problem-solving abilities.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-medium">Strengths</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 rounded-full bg-green-500/10 p-1">
                        <svg className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Clear communication style</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 rounded-full bg-green-500/10 p-1">
                        <svg className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Strong frontend development knowledge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 rounded-full bg-green-500/10 p-1">
                        <svg className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Structured problem-solving approach</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">Areas for Improvement</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 rounded-full bg-red-500/10 p-1">
                        <svg className="h-3 w-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                      <span>DBMS indexing concepts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 rounded-full bg-red-500/10 p-1">
                        <svg className="h-3 w-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                      <span>Providing concrete examples</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 rounded-full bg-red-500/10 p-1">
                        <svg className="h-3 w-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                      <span>Conciseness in responses</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                <div className="text-lg font-medium">Overall Score</div>
                <div className="text-3xl font-bold text-primary">7.5/10</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Feedback</CardTitle>
              <CardDescription>Question-by-question analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3, 4, 5].map((question) => (
                <div key={question} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Question {question}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Score:</span>
                      <span className="rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
                        {Math.floor(Math.random() * 3) + 7}/10
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium">Question:</p>
                    <p className="text-muted-foreground">
                      {question === 1
                        ? "Can you explain your approach to solving complex problems, and provide an example from your past experience?"
                        : `Sample interview question ${question}`}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium">Your Response:</p>
                    <p className="text-muted-foreground">
                      {question === 1
                        ? "When I approach complex problems, I first break them down into smaller, manageable parts. This allows me to tackle each component systematically. For example, in my last project, we faced a performance issue with our application..."
                        : "Your response to question " + question}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium">Feedback:</p>
                    <p className="text-muted-foreground">
                      {question === 1
                        ? "Good explanation of your problem-solving approach. You provided a clear methodology, but could have elaborated more on the specific example to demonstrate your skills in action."
                        : "Feedback for question " + question}
                    </p>
                  </div>
                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scores">
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
                <CardDescription>Performance by topic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Technical Knowledge</span>
                      <span className="text-sm">8/10</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Communication</span>
                      <span className="text-sm">9/10</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Problem Solving</span>
                      <span className="text-sm">7/10</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Experience</span>
                      <span className="text-sm">6/10</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Cultural Fit</span>
                      <span className="text-sm">8/10</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Radar</CardTitle>
                <CardDescription>Visual representation of your skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <FeedbackRadarChart />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex flex-wrap justify-between gap-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Download Feedback
          </Button>
          <Button variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" /> Retry Weak Areas
          </Button>
        </div>
      </div>
    </div>
  )
}
