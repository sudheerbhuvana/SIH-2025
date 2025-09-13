"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { InteractiveMap } from "@/components/interactive-map"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Leaf, TreePine, Recycle, Users, Trophy, Star } from "lucide-react"
import { getGlobalStats, initializeDemoData, getUsers, getSchoolRankings } from "@/lib/storage-api"
import type { GlobalStats, User, School } from "@/lib/storage-api"
import Link from "next/link"

export default function HomePage() {
  const [stats, setStats] = useState<GlobalStats | null>(null)
  const [topStudents, setTopStudents] = useState<User[]>([])
  const [topSchools, setTopSchools] = useState<Array<{school: School, totalPoints: number, studentCount: number}>>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Initialize demo data and load stats
    const loadData = async () => {
      try {
        await initializeDemoData()
        const globalStats = await getGlobalStats()
        const users = await getUsers()
        
        // Calculate top students
        const studentUsers = users.filter((user) => user.role === "student")
        const sortedStudents = studentUsers.sort((a, b) => b.ecoPoints - a.ecoPoints).slice(0, 5)

        // Get school rankings
        const schoolRankings = await getSchoolRankings(5)

        setStats(globalStats)
        setTopStudents(sortedStudents)
        setTopSchools(schoolRankings)
        setIsLoaded(true)
      } catch (error) {
        console.error('Error loading data:', error)
        setIsLoaded(true)
      }
    }

    loadData()
  }, [])

  if (!isLoaded || !stats) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Leaf className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold text-primary">EcoCred Web</h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Gamified Environmental Education & Verified Actions Platform
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join students and teachers worldwide in making a real environmental impact through verified actions,
            interactive learning, and community engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/student">Join as Student</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Link href="/teacher">Teacher Portal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Global Impact Stats */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Global Impact This Week</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader className="pb-3">
                <TreePine className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold text-primary">
                  {stats?.totalSaplings?.toLocaleString() || '0'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Saplings Planted</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-3">
                <Recycle className="h-8 w-8 text-secondary mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold text-secondary">{stats?.totalWasteSaved || 0} kg</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Waste Saved</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-3">
                <Users className="h-8 w-8 text-accent mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold text-accent">{stats?.totalStudents?.toLocaleString() || '0'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Active Students</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-3">
                <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold text-primary">{stats?.totalTasks || 0}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Tasks Completed</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Impact Map */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Interactive Impact Map</h2>
          <InteractiveMap />
        </div>
      </section>

      {/* School Leaderboard */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Top Environmental Champions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Top Students */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Student Leaderboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topStudents.length > 0 ? (
                  <div className="space-y-4">
                    {topStudents.map((student, index) => (
                      <div key={student.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0
                                ? "bg-yellow-500"
                                : index === 1
                                  ? "bg-gray-400"
                                  : index === 2
                                    ? "bg-amber-600"
                                    : "bg-primary"
                            }`}
                          >
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.ecoPoints} eco-points • {student.streak} day streak
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          {student.badges.slice(0, 3).map((badge, badgeIndex) => (
                            <Badge key={badgeIndex} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No students registered yet</p>
                    <Button asChild className="mt-4">
                      <Link href="/student">Be the first to join!</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* School Rankings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span>School Rankings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSchools.length > 0 ? (
                    topSchools.map((ranking, index) => {
                      const rankColors = [
                        "bg-yellow-500", // 1st place - Gold
                        "bg-gray-400",   // 2nd place - Silver
                        "bg-amber-600",  // 3rd place - Bronze
                        "bg-primary",    // 4th place
                        "bg-blue-500"    // 5th place
                      ]
                      
                      const maxPoints = topSchools[0]?.totalPoints || 1
                      const progressValue = (ranking.totalPoints / maxPoints) * 100
                      
                      return (
                        <div key={ranking.school.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                          <div className={`w-8 h-8 rounded-full ${rankColors[index] || "bg-gray-400"} flex items-center justify-center text-white font-bold`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{ranking.school.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {ranking.totalPoints.toLocaleString()} eco-points • {ranking.studentCount} students
                            </p>
                          </div>
                          <Progress value={progressValue} className="w-20" />
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No school rankings available yet</p>
                      <p className="text-sm">Schools will appear here once students start earning eco-points</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of students and teachers making a real difference for our planet
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link href="/student">Start Learning</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              <Link href="/teacher">Teach & Guide</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
