"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Mic, MicOff, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

export default function InterviewPage() {
  const [questions, setQuestions] = useState<string[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [finalTranscript, setFinalTranscript] = useState("")
  const [answers, setAnswers] = useState<string[]>([])
  const recognitionRef = useRef<any>(null)

  const totalQuestions = questions.length

  useEffect(() => {
    const stored = localStorage.getItem("questions")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setQuestions(parsed)
        }
      } catch (e) {
        console.error("Invalid questions JSON:", e)
      }
    }
  }, [])

  const toggleRecording = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true)
      setTranscript("")
      setFinalTranscript("")

      const SpeechRecognition =
        (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition

      let fullTranscript = ""

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onresult = (event: any) => {
        let live = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const text = result[0].transcript
          if (result.isFinal) {
            fullTranscript += text + " "
          } else {
            live += text
          }
        }
        setTranscript(live) // Update live transcript during recording
      }

      recognition.onend = () => {
        setIsRecording(false)
        const cleaned = fullTranscript.trim()
        setTranscript("") // Clear live transcript
        setFinalTranscript(cleaned) // Set final transcript when mic ends

        console.log("Final transcript:", cleaned)

        setAnswers((prev) => {
          const updated = [...prev]
          updated[currentQuestion - 1] = cleaned
          return updated
        })
      }

      recognition.start()
    } else {
      // Stop recording
      recognitionRef.current?.stop()
      setIsRecording(false)
    }
  }

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => prev + 1)
    setTranscript("")
    setFinalTranscript("")
    setIsRecording(false)
  }

  const sendAnswers = async () => {
    try {
      const res = await fetch("http://localhost:8000/evaluate-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers })
      })
      const data = await res.json()
      localStorage.setItem("feedback", JSON.stringify(data));
    } catch (error) {
      console.error("Error sending answers:", error)
    }
  }

  

  const showCompletion = currentQuestion > totalQuestions

  if (!questions.length)
    return <p className="text-center py-10">No questions found in localStorage.</p>

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Interview</h1>
          <p className="text-muted-foreground">
            Question {Math.min(currentQuestion, totalQuestions)} of {totalQuestions}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
          <Timer className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">12:34</span>
        </div>
      </div>

      {!showCompletion && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Question</CardTitle>
            <CardDescription>Answer using your voice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-lg">{questions[currentQuestion - 1]}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!showCompletion && (
        <div className="mb-8 flex flex-col items-center gap-4">
          <Button
            size="lg"
            variant={isRecording ? "destructive" : "default"}
            className="h-24 w-24 rounded-full"
            onClick={toggleRecording}
          >
            {isRecording ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {isRecording
              ? "Recording... Click again to stop"
              : "Click to start recording your answer"}
          </p>
        </div>
      )}

      {transcript && (
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Live Transcript:</span> {transcript}
          </p>
        </div>
      )}

      {finalTranscript && (
        <Card className="mb-8 border-dashed">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Your Answer:</span>{" "}
              {finalTranscript || "(No response recorded)"}
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleNextQuestion} className="gap-2">
              Next Question <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {showCompletion && (
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="mb-4 text-2xl font-bold">Interview Complete!</h2>
            <p className="mb-6 text-muted-foreground">
              You've completed all the questions. View your detailed feedback now.
            </p>
            <Button asChild className="gap-2">
              <Link href="/feedback" onClick={(e) => sendAnswers()}>
                View Feedback <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
