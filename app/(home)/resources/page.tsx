import ResourcesPage from '@/components/frontend/resource-listing'
export const dynamic = "force-dynamic";
import { getData } from '@/lib/getData';
import React from 'react'

export default async function Resources() {
    const resourcesData = await getData("resources");
    const resources = Array.isArray(resourcesData) ? resourcesData : (resourcesData.resources || []);
    const campuses = await getData("campuses");
    const courses = await getData("courses");
    const categories = await getData("categories");
  return (
    <div>
      <ResourcesPage resources={resources} courses={courses} categories={categories} campuses={campuses}/>
    </div>
  )
}
