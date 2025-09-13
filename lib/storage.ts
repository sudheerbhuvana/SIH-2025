// Local storage utilities for EcoCred platform

export interface User {
  id: string
  email: string
  name: string
  role: "student" | "teacher"
  school: string // Added school field
  ecoPoints: number
  badges: string[]
  streak: number
  joinedAt: string
  completedLessons: string[] // Added completed lessons tracking
  lessonProgress: { [lessonId: string]: LessonProgress } // Added lesson progress tracking
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
  evidence: string // Now stores image link instead of filename
  location?: string // Added location field
  description?: string // Added description field
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

// Storage keys
const STORAGE_KEYS = {
  USERS: "ecocred_users",
  CURRENT_USER: "ecocred_current_user",
  TASKS: "ecocred_tasks",
  SUBMISSIONS: "ecocred_submissions",
  GLOBAL_STATS: "ecocred_global_stats",
} as const

// User management
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem(STORAGE_KEYS.USERS)
  return users ? JSON.parse(users) : []
}

export const saveUser = (user: User): void => {
  if (typeof window === "undefined") return
  const users = getUsers()
  const existingIndex = users.findIndex((u) => u.id === user.id)

  if (existingIndex >= 0) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return user ? JSON.parse(user) : null
}

export const setCurrentUser = (user: User | null): void => {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}

// Task management
export const getTasks = (): Task[] => {
  if (typeof window === "undefined") return []
  const tasks = localStorage.getItem(STORAGE_KEYS.TASKS)
  return tasks ? JSON.parse(tasks) : []
}

export const saveTask = (task: Task): void => {
  if (typeof window === "undefined") return
  const tasks = getTasks()
  const existingIndex = tasks.findIndex((t) => t.id === task.id)

  if (existingIndex >= 0) {
    tasks[existingIndex] = task
  } else {
    tasks.push(task)
  }

  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
}

// Submission management
export const getSubmissions = (): Submission[] => {
  if (typeof window === "undefined") return []
  const submissions = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)
  return submissions ? JSON.parse(submissions) : []
}

export const saveSubmission = (submission: Submission): void => {
  if (typeof window === "undefined") return
  const submissions = getSubmissions()
  const existingIndex = submissions.findIndex((s) => s.id === submission.id)

  if (existingIndex >= 0) {
    submissions[existingIndex] = submission
  } else {
    submissions.push(submission)
  }

  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions))
}

// Global stats
export const getGlobalStats = (): GlobalStats => {
  if (typeof window === "undefined")
    return {
      totalSaplings: 0,
      totalWasteSaved: 0,
      totalStudents: 0,
      totalTasks: 0,
      lastUpdated: new Date().toISOString(),
    }

  const stats = localStorage.getItem(STORAGE_KEYS.GLOBAL_STATS)
  return stats
    ? JSON.parse(stats)
    : {
        totalSaplings: 1247,
        totalWasteSaved: 892,
        totalStudents: 156,
        totalTasks: 89,
        lastUpdated: new Date().toISOString(),
      }
}

export const updateGlobalStats = (stats: Partial<GlobalStats>): void => {
  if (typeof window === "undefined") return
  const currentStats = getGlobalStats()
  const updatedStats = {
    ...currentStats,
    ...stats,
    lastUpdated: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEYS.GLOBAL_STATS, JSON.stringify(updatedStats))
}

export const completeLesson = (userId: string, lessonId: string, points: number): void => {
  if (typeof window === "undefined") return

  const users = getUsers()
  const userIndex = users.findIndex((u) => u.id === userId)

  if (userIndex >= 0) {
    const user = users[userIndex]

    if (!user.completedLessons) {
      user.completedLessons = []
    }
    if (!user.lessonProgress) {
      user.lessonProgress = {}
    }

    // Add to completed lessons if not already completed
    if (!user.completedLessons.includes(lessonId)) {
      user.completedLessons.push(lessonId)
      user.ecoPoints += points
    }

    // Update lesson progress
    user.lessonProgress[lessonId] = {
      lessonId,
      completed: true,
      progress: 100,
      completedAt: new Date().toISOString(),
      pointsEarned: points,
    }

    users[userIndex] = user
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))

    // Update current user if it's the same user
    const currentUser = getCurrentUser()
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(user)
    }
  }
}

export const getUserLessonProgress = (userId: string, lessonId: string): LessonProgress => {
  const users = getUsers()
  const user = users.find((u) => u.id === userId)

  if (user && user.lessonProgress && user.lessonProgress[lessonId]) {
    return user.lessonProgress[lessonId]
  }

  return {
    lessonId,
    completed: false,
    progress: 0,
    pointsEarned: 0,
  }
}

export const getCompletedLessonsCount = (userId: string): number => {
  const users = getUsers()
  const user = users.find((u) => u.id === userId)
  return user && user.completedLessons ? user.completedLessons.length : 0
}

export const initializeDemoData = (): void => {
  if (typeof window === "undefined") return

  // Initialize global stats if not exists
  if (!localStorage.getItem(STORAGE_KEYS.GLOBAL_STATS)) {
    updateGlobalStats({
      totalSaplings: 23,
      totalWasteSaved: 15,
      totalStudents: 8,
      totalTasks: 12,
    })
  }

  // Initialize demo tasks if not exists
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    const demoTasks: Task[] = [
      {
        id: "1",
        title: "Plant a Sapling",
        description: "Plant a tree sapling and upload a photo as evidence",
        category: "planting",
        points: 50,
        createdBy: "system",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Waste Segregation",
        description: "Properly segregate waste and document the process",
        category: "waste",
        points: 30,
        createdBy: "system",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        title: "Energy Conservation",
        description: "Document energy-saving practices at home or school",
        category: "energy",
        points: 40,
        createdBy: "system",
        createdAt: new Date().toISOString(),
      },
    ]

    demoTasks.forEach(saveTask)
  }

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const demoUsers: User[] = [
      {
        id: "student1",
        email: "student@example.com",
        name: "Demo Student",
        role: "student",
        school: "Government Senior Secondary School, Chandigarh",
        ecoPoints: 45,
        badges: [],
        streak: 3,
        joinedAt: new Date().toISOString(),
        completedLessons: [],
        lessonProgress: {},
      },
      {
        id: "student2",
        email: "arjun@example.com",
        name: "Arjun Singh",
        role: "student",
        school: "DAV Public School, Ludhiana",
        ecoPoints: 120,
        badges: ["Eco Warrior"],
        streak: 7,
        joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedLessons: ["tree-planting", "waste-management"],
        lessonProgress: {},
      },
      {
        id: "student3",
        email: "priya@example.com",
        name: "Priya Kaur",
        role: "student",
        school: "Sacred Heart Convent School, Amritsar",
        ecoPoints: 95,
        badges: ["Green Champion"],
        streak: 5,
        joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        completedLessons: ["energy-conservation"],
        lessonProgress: {},
      },
      {
        id: "student4",
        email: "rohit@example.com",
        name: "Rohit Sharma",
        role: "student",
        school: "St. Joseph's Senior Secondary School, Patiala",
        ecoPoints: 78,
        badges: [],
        streak: 2,
        joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        completedLessons: ["water-conservation"],
        lessonProgress: {},
      },
      {
        id: "student5",
        email: "simran@example.com",
        name: "Simran Gill",
        role: "student",
        school: "Ryan International School, Mohali",
        ecoPoints: 156,
        badges: ["Eco Warrior", "Tree Planter"],
        streak: 12,
        joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        completedLessons: ["tree-planting", "waste-management", "energy-conservation"],
        lessonProgress: {},
      },
      {
        id: "teacher1",
        email: "teacher@example.com",
        name: "Demo Teacher",
        role: "teacher",
        school: "Government Senior Secondary School, Chandigarh",
        ecoPoints: 0,
        badges: [],
        streak: 0,
        joinedAt: new Date().toISOString(),
        completedLessons: [],
        lessonProgress: {},
      },
    ]

    demoUsers.forEach(saveUser)
  }
}
