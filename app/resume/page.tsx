"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, FileUp, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check if a resume exists on page load
  useEffect(() => {
  const checkResumeExists = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:8000/resume", {
        method: "HEAD", // Use HEAD to just check existence without downloading
      })

      if (response.ok) {
        // If resume exists, set the URL with a timestamp to prevent caching
        setFileUrl(`http://localhost:8000/resume?t=${Date.now()}`)
      } else {
        setFileUrl(null)
      }
    } catch (error) {
      console.error("Error checking resume:", error)
      setFileUrl(null)
    } finally {
      setLoading(false)
    }
  }

  checkResumeExists()
}, [])

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile)
      setFileUrl(url)
    }
  }

  // Remove uploaded file
  const handleRemoveFile = () => {
    setFile(null)
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl)
      setFileUrl(null)
    }
  }

  // Trigger file input click
  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) return

    setLoading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setFileUrl(data.url)  // Assuming the response contains the URL to access the uploaded file
      } else {
        console.error("Error uploading file")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upload Your Resume</h1>
        <p className="text-muted-foreground">Upload your resume to get personalized interview questions</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Upload Section - Takes 1/3 of width */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Upload Resume</CardTitle>
              <CardDescription>Upload your resume in PDF format</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="resume">Resume File</Label>
                  <div className="relative">
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <div 
                      onClick={handleClickUpload}
                      className="flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-8"
                    >
                      <div className="flex flex-col items-center gap-2 text-center">
                        <FileUp className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm font-medium">Drag & drop or click to upload</p>
                        <p className="text-xs text-muted-foreground">Supports PDF (Max 5MB)</p>
                      </div>
                    </div>
                  </div>
                  {file && (
                    <div className="flex items-center justify-between rounded-md border bg-muted p-2">
                      <div className="flex items-center gap-2">
                        <FileUp className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">{file.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section - Takes 2/3 of width with increased height */}
        <div className="lg:col-span-2">
          <Card className="h-full min-h-[600px]">
            <CardHeader>
              <CardTitle>Resume Preview</CardTitle>
              <CardDescription>View your uploaded resume</CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-72px)]"> {/* Subtract card header height */}
              {loading ? (
                <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                  <p>Loading...</p>
                </div>
              ) : fileUrl ? (
                <iframe 
                  src={fileUrl} 
                  width="100%" 
                  height="100%"
                  className="border rounded-md"
                  title="Resume Preview"
                  style={{ minHeight: '500px' }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                  <p>Upload your resume to preview it here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button 
          disabled={!file || loading} 
          className="gap-2" 
          onClick={handleFileUpload} 
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </Button>
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button disabled={!file} className="gap-2" asChild>
          <Link href="/setup">
            Next: Setup Interview <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
