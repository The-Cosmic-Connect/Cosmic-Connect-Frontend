import { GetStaticPaths, GetStaticProps } from 'next'
import CoursePageTemplate from '@/components/courses/CoursePageTemplate'
import { courses, CourseData, getCourseBySlug } from '@/lib/coursesData'

export default function CourseDetailPage({ course }: { course: CourseData }) {
  return <CoursePageTemplate course={course} />
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: courses.map(c => ({ params: { slug: c.slug } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const course = getCourseBySlug(params?.slug as string)
  if (!course) return { notFound: true }
  return { props: { course } }
}
