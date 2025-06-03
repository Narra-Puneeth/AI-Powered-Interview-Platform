"use client"

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts"

const data = [
  {
    subject: "Technical",
    score: 8,
    fullMark: 10,
  },
  {
    subject: "Communication",
    score: 9,
    fullMark: 10,
  },
  {
    subject: "Problem Solving",
    score: 7,
    fullMark: 10,
  },
  {
    subject: "Experience",
    score: 6,
    fullMark: 10,
  },
  {
    subject: "Cultural Fit",
    score: 8,
    fullMark: 10,
  },
]

export function SkillsRadarChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
      </RadarChart>
    </ResponsiveContainer>
  )
}
