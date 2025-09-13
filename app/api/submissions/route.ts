import { NextRequest, NextResponse } from 'next/server'
import { 
  getSubmissions, 
  saveSubmission, 
  getSubmissionsByStudent, 
  getSubmissionsByTask 
} from '@/lib/database'
import type { Submission } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const taskId = searchParams.get('taskId')

    if (studentId) {
      const submissions = await getSubmissionsByStudent(studentId)
      return NextResponse.json(submissions)
    } else if (taskId) {
      const submissions = await getSubmissionsByTask(taskId)
      return NextResponse.json(submissions)
    } else {
      const submissions = await getSubmissions()
      return NextResponse.json(submissions)
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const submission: Submission = await request.json()
    await saveSubmission(submission)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
  }
}
