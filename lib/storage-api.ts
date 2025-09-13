// API-based storage utilities for EcoCred platform
// This replaces localStorage with MongoDB via API calls

export interface User {
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
  id: string
  title: string
  description: string
  category: "planting" | "waste" | "energy" | "water"
  points: number
  createdBy: string
  createdAt: string
}

export interface Submission {
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

// API helper functions
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`)
  }

  return response.json()
}

// User management
export const getUsers = async (): Promise<User[]> => {
  try {
    return await apiCall('/api/users')
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export const saveUser = async (user: User): Promise<void> => {
  try {
    await apiCall('/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
    })
  } catch (error) {
    console.error('Error saving user:', error)
    throw error
  }
}

export const getCurrentUser = async (userId: string): Promise<User | null> => {
  try {
    return await apiCall(`/api/users/user?userId=${userId}`)
  } catch (error) {
    console.error('Error fetching current user:', error)
    return null
  }
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    return await apiCall(`/api/users/user?email=${email}`)
  } catch (error) {
    console.error('Error fetching user by email:', error)
    return null
  }
}

// Task management
export const getTasks = async (): Promise<Task[]> => {
  try {
    return await apiCall('/api/tasks')
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
}

export const saveTask = async (task: Task): Promise<void> => {
  try {
    await apiCall('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    })
  } catch (error) {
    console.error('Error saving task:', error)
    throw error
  }
}

export const getTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    return await apiCall(`/api/tasks?taskId=${taskId}`)
  } catch (error) {
    console.error('Error fetching task by ID:', error)
    return null
  }
}

// Submission management
export const getSubmissions = async (): Promise<Submission[]> => {
  try {
    return await apiCall('/api/submissions')
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return []
  }
}

export const saveSubmission = async (submission: Submission): Promise<void> => {
  try {
    await apiCall('/api/submissions', {
      method: 'POST',
      body: JSON.stringify(submission),
    })
  } catch (error) {
    console.error('Error saving submission:', error)
    throw error
  }
}

export const getSubmissionsByStudent = async (studentId: string): Promise<Submission[]> => {
  try {
    return await apiCall(`/api/submissions?studentId=${studentId}`)
  } catch (error) {
    console.error('Error fetching submissions by student:', error)
    return []
  }
}

export const getSubmissionsByTask = async (taskId: string): Promise<Submission[]> => {
  try {
    return await apiCall(`/api/submissions?taskId=${taskId}`)
  } catch (error) {
    console.error('Error fetching submissions by task:', error)
    return []
  }
}

// Global stats
export const getGlobalStats = async (): Promise<GlobalStats> => {
  try {
    return await apiCall('/api/stats')
  } catch (error) {
    console.error('Error fetching global stats:', error)
    return {
      totalSaplings: 0,
      totalWasteSaved: 0,
      totalStudents: 0,
      totalTasks: 0,
      lastUpdated: new Date().toISOString(),
    }
  }
}

export const updateGlobalStats = async (stats: Partial<GlobalStats>): Promise<void> => {
  try {
    await apiCall('/api/stats', {
      method: 'POST',
      body: JSON.stringify(stats),
    })
  } catch (error) {
    console.error('Error updating global stats:', error)
    throw error
  }
}

// Lesson progress
export const completeLesson = async (userId: string, lessonId: string, points: number): Promise<void> => {
  try {
    await apiCall('/api/lessons', {
      method: 'POST',
      body: JSON.stringify({ userId, lessonId, points }),
    })
  } catch (error) {
    console.error('Error completing lesson:', error)
    throw error
  }
}

export const getUserLessonProgress = async (userId: string, lessonId: string): Promise<LessonProgress> => {
  try {
    return await apiCall(`/api/lessons?userId=${userId}&lessonId=${lessonId}&action=progress`)
  } catch (error) {
    console.error('Error fetching lesson progress:', error)
    return {
      lessonId,
      completed: false,
      progress: 0,
      pointsEarned: 0,
    }
  }
}

export const getCompletedLessonsCount = async (userId: string): Promise<number> => {
  try {
    const result = await apiCall(`/api/lessons?userId=${userId}&action=count`)
    return result.count || 0
  } catch (error) {
    console.error('Error fetching completed lessons count:', error)
    return 0
  }
}

// Initialize demo data
export const initializeDemoData = async (): Promise<void> => {
  try {
    await apiCall('/api/init', {
      method: 'POST',
    })
  } catch (error) {
    console.error('Error initializing demo data:', error)
    throw error
  }
}

// Session management (still using localStorage for session data)
export const setCurrentUser = (user: User | null): void => {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem("ecocred_current_user", JSON.stringify(user))
  } else {
    localStorage.removeItem("ecocred_current_user")
  }
}

export const getCurrentUserFromSession = (): User | null => {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("ecocred_current_user")
  return user ? JSON.parse(user) : null
}
