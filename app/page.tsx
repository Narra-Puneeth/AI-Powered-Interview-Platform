import type React from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle, FileText, Mic, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-20 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex flex-col space-y-6 md:w-1/2">
              <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                Ace Your Interview <span className="text-primary">with AI</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Practice interviews with our AI-powered platform. Get personalized feedback and improve your skills.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/resume">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Interview illustration"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Key Features</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<FileText className="h-10 w-10 text-primary" />}
              title="Upload Resume"
              description="Upload your resume and get personalized interview questions based on your experience."
            />
            <FeatureCard
              icon={<Mic className="h-10 w-10 text-primary" />}
              title="AI-Generated Questions"
              description="Get realistic interview questions tailored to your skills and job preferences."
            />
            <FeatureCard
              icon={<Star className="h-10 w-10 text-primary" />}
              title="Voice Interaction"
              description="Practice answering questions verbally for a realistic interview experience."
            />
            <FeatureCard
              icon={<CheckCircle className="h-10 w-10 text-primary" />}
              title="Detailed Feedback"
              description="Receive comprehensive feedback to improve your interview performance."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary px-4 py-16 text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to ace your next interview?</h2>
          <p className="mb-8 text-xl">Start practicing today and build your confidence for your dream job.</p>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link href="/resume">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardContent className="flex flex-col items-center p-6 text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="mb-2 text-xl font-medium">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
