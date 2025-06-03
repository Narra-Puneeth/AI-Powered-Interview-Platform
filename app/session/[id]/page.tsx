import Link from "next/link"
import { ArrowLeft, Calendar, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function SessionDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Session Details</h1>
          <p className="text-muted-foreground">Review your interview session</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
          <CardDescription>Details about this interview session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Date</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium">May 10, 2025</span>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Duration</span>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">32 minutes</span>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Type</span>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                Technical Interview
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Difficulty</span>
              <span className="font-medium">Intermediate</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Questions</span>
              <span className="font-medium">5 questions</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Overall Score</span>
              <span className="font-medium">8.2/10</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions and Responses</CardTitle>
          <CardDescription>Your answers and feedback for each question</CardDescription>
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
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Play Recording
                </Button>
                <Button variant="outline" size="sm">
                  View Transcript
                </Button>
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
    </div>
  )
}
