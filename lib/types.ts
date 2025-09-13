import { ObjectId } from 'mongodb'

export interface User {
  _id?: ObjectId
  id: string
  email: string
  name: string
  role: "student" | "teacher"
  school: string
  ecoPoints: number
  badges: string[]
  streak: number
  joinedAt: string
  completedLessons: string[]
  lessonProgress: { [lessonId: string]: LessonProgress }
}

export interface Task {
  _id?: ObjectId
  id: string
  title: string
  description: string
  category: "planting" | "waste" | "energy" | "water"
  points: number
  createdBy: string
  createdAt: string
}

export interface Submission {
  _id?: ObjectId
  id: string
  taskId: string
  studentId: string
  evidence: string
  location?: string
  description?: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  comments?: string
  mlConfidence?: number
}

export interface GlobalStats {
  _id?: ObjectId
  totalSaplings: number
  totalWasteSaved: number
  totalStudents: number
  totalTasks: number
  lastUpdated: string
}

export interface LessonProgress {
  lessonId: string
  completed: boolean
  progress: number
  completedAt?: string
  pointsEarned: number
}
