"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Mic } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input" // Optional if you're adding topics

export default function SetupPage() {
  const router = useRouter()

  const [interviewTypes, setInterviewTypes] = useState({
    technical: true,
    hr: false,
    mixed: false,
  })

  const [difficulty, setDifficulty] = useState("intermediate")
  const [topics, setTopics] = useState("DSA, DBMS, OS")
  const [numQuestions, setNumQuestions] = useState(5)
  const [loading, setLoading] = useState(false)

  const handleStartInterview = async () => {
    const selectedType = Object.entries(interviewTypes)
      .filter(([_, value]) => value)
      .map(([key]) => key)
      .join(" and ") || "technical"

    const payload = {
      topics,
      num_questions: numQuestions,
      interview_type: selectedType,
    }

    setLoading(true)

    try {
      const res = await fetch("http://localhost:8000/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error("Failed to generate questions")
      }

      const data = await res.json()

      localStorage.setItem("questions", JSON.stringify(data.questions))
      router.push("/interview")
    } catch (err) {
      console.error(err)
      alert("Could not start the interview. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Setup Your Interview</h1>
        <p className="text-muted-foreground">Customize your interview experience</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interview Configuration</CardTitle>
          <CardDescription>Select the type and difficulty of your interview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="space-y-4">
            <Label>Interview Type</Label>
            <div className="grid gap-4 sm:grid-cols-3">
              {["technical", "hr", "mixed"].map((type) => (
                <div className="flex items-center space-x-2" key={type}>
                  <Checkbox
                    id={type}
                    checked={interviewTypes[type as keyof typeof interviewTypes]}
                    onCheckedChange={(checked) =>
                      setInterviewTypes({ ...interviewTypes, [type]: !!checked })
                    }
                  />
                  <Label htmlFor={type} className="cursor-pointer capitalize">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label htmlFor="topics">Topics</Label>
            <Input
              id="topics"
              placeholder="e.g. DSA, DBMS, OS"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="numQuestions">Number of Questions</Label>
            <Input
              id="numQuestions"
              type="number"
              min={1}
              max={20}
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
            />
          </div>

          <div className="rounded-md bg-muted p-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <Mic className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Voice-Only Interaction</h3>
                <p className="text-sm text-muted-foreground">
                  This interview will be conducted via voice input only. Make sure your microphone is working properly.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-end">
        <Button
          disabled={!Object.values(interviewTypes).some(Boolean) || loading}
          className="gap-2"
          onClick={handleStartInterview}
        >
          {loading ? "Loading..." : "Start Interview"} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
