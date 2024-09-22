'use client'

import React, { useState, useEffect } from 'react'
import { FaUser, FaMap } from 'react-icons/fa'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Topic {
  name: string;
  progress: number;
}

const topics: Topic[] = [
  { name: 'Sorting', progress: 75 },
  { name: 'Arrays', progress: 60 },
  { name: 'Hashing', progress: 40 },
  { name: 'Trees', progress: 30 },
  { name: 'Graphs', progress: 20 },
]

const generateYearData = (): number[][] => {
  const year: number[][] = []
  for (let i = 0; i < 52; i++) {
    const week: number[] = []
    for (let j = 0; j < 7; j++) {
      week.push(Math.floor(Math.random() * 5))
    }
    year.push(week)
  }
  return year
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface ProblemCircleProps {
  easy: number;
  medium: number;
  hard: number;
  total: number;
}

const ProblemCircle: React.FC<ProblemCircleProps> = ({ easy, medium, hard, total }) => (
  <div className="relative w-32 h-32">
    <svg className="w-full h-full" viewBox="0 0 36 36">
      <path
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="2"
      />
      <path
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="#10B981"
        strokeWidth="2"
        strokeDasharray={`${(easy / total) * 100}, 100`}
      />
      <path
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="#FBBF24"
        strokeWidth="2"
        strokeDasharray={`${(medium / total) * 100}, 100`}
        strokeDashoffset={`-${(easy / total) * 100}`}
      />
      <path
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="#EF4444"
        strokeWidth="2"
        strokeDasharray={`${(hard / total) * 100}, 100`}
        strokeDashoffset={`-${((easy + medium) / total) * 100}`}
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-2xl font-bold">{total}</span>
    </div>
  </div>
)

interface ActivityHeatmapProps {
    data: number[][];
  }
  
  const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data }) => {
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  
    // Get the day of the week (0-6) for the first day of the year
    const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1).getDay()
    
    // Create an array of 7 rows, each containing 53 cells (52 weeks + 1 for potential overflow)
    const heatmapData = Array(7).fill(null).map(() => Array(53).fill(null))
  
    // Fill the heatmapData array with the provided data
    data.forEach((week, weekIndex) => {
      week.forEach((value, dayIndex) => {
        const rowIndex = (dayIndex + firstDayOfYear) % 7
        heatmapData[rowIndex][weekIndex] = value
      })
    })
  
    return (
      <div className="relative mt-4">
        <div className="flex">
          <div className="flex flex-col justify-between text-xs text-gray-400 pr-2 py-[10px]">
            {['Mon', '', 'Wed', '', 'Fri', ''].map((day, index) => (
              <div key={index} className="h-[15px] leading-[15px]">{day}</div>
            ))}
          </div>
          <div className="flex-1">
            <div className="grid grid-rows-7 grid-flow-col gap-[2px]">
              {heatmapData.map((row, rowIndex) => (
                row.map((value, colIndex) => {
                  if (value === null) return <div key={`${rowIndex}-${colIndex}`} className="w-[10px] h-[10px]" />
                  
                  const date = new Date(new Date().getFullYear(), 0, 1 + colIndex * 7 + ((rowIndex - firstDayOfYear + 7) % 7))
                  
                  return (
                    <TooltipProvider key={`${rowIndex}-${colIndex}`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-[10px] h-[10px] rounded-sm transition-colors duration-200 ${
                              value === 0 ? 'bg-gray-200' :
                              value <= 2 ? 'bg-green-200' :
                              value <= 4 ? 'bg-green-400' : 'bg-green-600'
                            } hover:ring-2 hover:ring-offset-2 hover:ring-blue-500`}
                            onMouseEnter={() => setHoveredDate(date)}
                            onMouseLeave={() => setHoveredDate(null)}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{`${value} submissions on ${date.toDateString()}`}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              {months.map((month, index) => (
                <div key={index} style={{width: `${100/12}%`}}>{month}</div>
              ))}
            </div>
          </div>
        </div>
        {hoveredDate && (
          <div className="absolute top-[-24px] left-0 text-sm bg-gray-800 text-white px-2 py-1 rounded">
            {hoveredDate.toDateString()}: {data[Math.floor((hoveredDate.getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))][hoveredDate.getDay()]} submissions
          </div>
        )}
      </div>
    )
  }

const DashboardPage: React.FC = () => {
  const [yearData, setYearData] = useState<number[][]>([])
  const [totalSubmissions, setTotalSubmissions] = useState<number>(0)

  useEffect(() => {
    const data = generateYearData()
    setYearData(data)
    setTotalSubmissions(data.flat().reduce((a, b) => a + b, 0))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">CodeRonin</h1>
          <nav className="flex space-x-4">
            <Button variant="ghost" className="flex items-center">
              <FaUser className="mr-2" /> Dashboard
            </Button>
            <Button variant="ghost" className="flex items-center">
              <FaMap className="mr-2" /> Learning Roadmap
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUser className="text-4xl text-gray-400" />
              </div>
              <div className="space-y-2">
                <p><strong>Name:</strong> John Doe</p>
                <p><strong>Plan:</strong> Premium</p>
                <p><strong>Rank:</strong> Advanced</p>
              </div>
            </CardContent>
          </Card>

          {/* Problems Solved */}
          <Card>
            <CardHeader>
              <CardTitle>Problems Solved</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <ProblemCircle easy={50} medium={30} hard={20} total={100} />
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span>Easy: 50</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                  <span>Medium: 30</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  <span>Hard: 20</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Topic Progress */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Topic Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topics.map((topic) => (
                  <div key={topic.name} className="space-y-2">
                    <div className="flex justify-between">
                      <span>{topic.name}</span>
                      <span>{topic.progress}%</span>
                    </div>
                    <Progress value={topic.progress} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Heatmap */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Activity Heatmap</span>
                <span className="text-sm font-normal text-gray-500">{totalSubmissions} submissions in the last year</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityHeatmap data={yearData} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage