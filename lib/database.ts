import { getDatabase } from './mongodb'
import type { User, Task, Submission, GlobalStats, LessonProgress } from './types'

// User management
export async function getUsers(): Promise<User[]> {
  try {
    const db = await getDatabase()
    const users = await db.collection<User>('users').find({}).toArray()
    return users.map(user => ({ ...user, _id: undefined }))
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export async function saveUser(user: User): Promise<void> {
  try {
    const db = await getDatabase()
    await db.collection<User>('users').replaceOne(
      { id: user.id },
      user,
      { upsert: true }
    )
  } catch (error) {
    console.error('Error saving user:', error)
    throw error
  }
}

export async function getCurrentUser(userId: string): Promise<User | null> {
  try {
    const db = await getDatabase()
    const user = await db.collection<User>('users').findOne({ id: userId })
    return user ? { ...user, _id: undefined } : null
  } catch (error) {
    console.error('Error fetching current user:', error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const db = await getDatabase()
    const user = await db.collection<User>('users').findOne({ email })
    return user ? { ...user, _id: undefined } : null
  } catch (error) {
    console.error('Error fetching user by email:', error)
    return null
  }
}

// Task management
export async function getTasks(): Promise<Task[]> {
  try {
    const db = await getDatabase()
    const tasks = await db.collection<Task>('tasks').find({}).toArray()
    return tasks.map(task => ({ ...task, _id: undefined }))
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
}

export async function saveTask(task: Task): Promise<void> {
  try {
    const db = await getDatabase()
    await db.collection<Task>('tasks').replaceOne(
      { id: task.id },
      task,
      { upsert: true }
    )
  } catch (error) {
    console.error('Error saving task:', error)
    throw error
  }
}

export async function getTaskById(taskId: string): Promise<Task | null> {
  try {
    const db = await getDatabase()
    const task = await db.collection<Task>('tasks').findOne({ id: taskId })
    return task ? { ...task, _id: undefined } : null
  } catch (error) {
    console.error('Error fetching task by ID:', error)
    return null
  }
}

// Submission management
export async function getSubmissions(): Promise<Submission[]> {
  try {
    const db = await getDatabase()
    const submissions = await db.collection<Submission>('submissions').find({}).toArray()
    return submissions.map(submission => ({ ...submission, _id: undefined }))
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return []
  }
}

export async function saveSubmission(submission: Submission): Promise<void> {
  try {
    const db = await getDatabase()
    await db.collection<Submission>('submissions').replaceOne(
      { id: submission.id },
      submission,
      { upsert: true }
    )
  } catch (error) {
    console.error('Error saving submission:', error)
    throw error
  }
}

export async function getSubmissionsByStudent(studentId: string): Promise<Submission[]> {
  try {
    const db = await getDatabase()
    const submissions = await db.collection<Submission>('submissions')
      .find({ studentId }).toArray()
    return submissions.map(submission => ({ ...submission, _id: undefined }))
  } catch (error) {
    console.error('Error fetching submissions by student:', error)
    return []
  }
}

export async function getSubmissionsByTask(taskId: string): Promise<Submission[]> {
  try {
    const db = await getDatabase()
    const submissions = await db.collection<Submission>('submissions')
      .find({ taskId }).toArray()
    return submissions.map(submission => ({ ...submission, _id: undefined }))
  } catch (error) {
    console.error('Error fetching submissions by task:', error)
    return []
  }
}

// Global stats
export async function getGlobalStats(): Promise<GlobalStats> {
  try {
    const db = await getDatabase()
    const stats = await db.collection<GlobalStats>('globalStats').findOne({})
    
    if (stats) {
      return { ...stats, _id: undefined }
    }
    
    // Return default stats if none exist
    return {
      totalSaplings: 1247,
      totalWasteSaved: 892,
      totalStudents: 156,
      totalTasks: 89,
      lastUpdated: new Date().toISOString(),
    }
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

export async function updateGlobalStats(stats: Partial<GlobalStats>): Promise<void> {
  try {
    const db = await getDatabase()
    const updatedStats = {
      ...stats,
      lastUpdated: new Date().toISOString(),
    }
    await db.collection<GlobalStats>('globalStats').replaceOne(
      {},
      updatedStats,
      { upsert: true }
    )
  } catch (error) {
    console.error('Error updating global stats:', error)
    throw error
  }
}

// Lesson progress
export async function completeLesson(userId: string, lessonId: string, points: number): Promise<void> {
  try {
    const db = await getDatabase()
    const user = await db.collection<User>('users').findOne({ id: userId })
    
    if (!user) {
      throw new Error('User not found')
    }

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

    await db.collection<User>('users').replaceOne(
      { id: userId },
      user,
      { upsert: true }
    )
  } catch (error) {
    console.error('Error completing lesson:', error)
    throw error
  }
}

export async function getUserLessonProgress(userId: string, lessonId: string): Promise<LessonProgress> {
  try {
    const db = await getDatabase()
    const user = await db.collection<User>('users').findOne({ id: userId })

    if (user && user.lessonProgress && user.lessonProgress[lessonId]) {
      return user.lessonProgress[lessonId]
    }

    return {
      lessonId,
      completed: false,
      progress: 0,
      pointsEarned: 0,
    }
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

export async function getCompletedLessonsCount(userId: string): Promise<number> {
  try {
    const db = await getDatabase()
    const user = await db.collection<User>('users').findOne({ id: userId })
    return user && user.completedLessons ? user.completedLessons.length : 0
  } catch (error) {
    console.error('Error fetching completed lessons count:', error)
    return 0
  }
}

// Initialize demo data
export async function initializeDemoData(): Promise<void> {
  try {
    const db = await getDatabase()
    
    // Initialize global stats if not exists
    const existingStats = await db.collection<GlobalStats>('globalStats').findOne({})
    if (!existingStats) {
      await db.collection<GlobalStats>('globalStats').insertOne({
        totalSaplings: 23,
        totalWasteSaved: 15,
        totalStudents: 8,
        totalTasks: 12,
        lastUpdated: new Date().toISOString(),
      })
    }

    // Initialize demo tasks if not exists
    const existingTasks = await db.collection<Task>('tasks').findOne({})
    if (!existingTasks) {
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

      await db.collection<Task>('tasks').insertMany(demoTasks)
    }

    // Initialize demo users if not exists
    const existingUsers = await db.collection<User>('users').findOne({})
    if (!existingUsers) {
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

      await db.collection<User>('users').insertMany(demoUsers)
    }
  } catch (error) {
    console.error('Error initializing demo data:', error)
    throw error
  }
}
