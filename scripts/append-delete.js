const fs = require('fs');
const content = fs.readFileSync('app/actions/lms.ts', 'utf8');

const newAction = `
export async function deleteCourse(slug: string) {
  const user = await getSessionUser()
  if (user.role !== 'admin' || user.email !== 'michael.marquis@eibgroup.com') {
    throw new Error('Unauthorized: Only the super admin (michael.marquis@eibgroup.com) can delete courses.')
  }

  const course = await getCourseBySlug(slug)
  if (!course) {
    throw new Error('Course not found')
  }

  // Delete all dependencies manually
  await db.delete(certificates).where(eq(certificates.courseId, course.id))
  await db.delete(quizAttempts).where(eq(quizAttempts.courseId, course.id))
  await db.delete(lessonProgress).where(eq(lessonProgress.courseId, course.id))
  await db.delete(enrollments).where(eq(enrollments.courseId, course.id))
  
  // Delete the course
  await db.delete(courses).where(eq(courses.id, course.id))
  
  revalidatePath('/lms')
  revalidatePath('/lms/admin')
}
`;

fs.writeFileSync('app/actions/lms.ts', content + '\n' + newAction);
console.log('Appended deleteCourse action successfully');
