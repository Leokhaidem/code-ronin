import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <Card className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary">
            <Sparkles className="h-6 w-6 mr-2 text-yellow-500" />
            Featured Algorithm
          </CardTitle>
          <CardDescription className="text-lg">Master this fundamental sorting algorithm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-2xl font-semibold text-primary">Merge Sort</h3>
              <p className="text-base text-muted-foreground">Efficient, stable sorting algorithm</p>
              <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
                <li>Divide and conquer approach</li>
                <li>Time complexity: O(n log n)</li>
                <li>Space complexity: O(n)</li>
              </ul>
            </div>
            <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="dashboard/learn" className="flex items-center justify-center w-full">
                Learn Merge Sort
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}