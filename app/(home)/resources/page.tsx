import ResourcesPage from '@/components/frontend/resource-listing'
import { getData } from '@/lib/getData';
import React from 'react'

export default async function page() {
    const resources = await getData("resources");
    const campuses = await getData("campuses");
    const courses = await getData("courses");
    const categories = await getData("categories");
  return (
    <div>
      <ResourcesPage resources={resources} courses={courses} categories={categories} campuses={campuses}/>
    </div>
  )
}
