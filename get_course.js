const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getCourse() {
  const course = await prisma.course.findUnique({
    where: { slug: 'operational-excellence-in-project-delivery' }
  });
  console.log(course ? course.customContent : 'Course not found');
}
getCourse().catch(console.error).finally(() => prisma.$disconnect());
