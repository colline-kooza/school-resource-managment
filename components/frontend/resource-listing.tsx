// 'use client'
// import { useState, useEffect, useCallback, useRef } from 'react'
// import { Button } from "@/components/ui/button"
// import { Search, Loader2, FileText, Download } from 'lucide-react'
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
// import Link from 'next/link'


// const ITEMS_PER_PAGE = 20;

// export default function ResourcesPage({resources,campuses,courses,categories}:{resources:any,categories:any,courses:any,campuses:any,}) {

//   const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE)
//   const [loading, setLoading] = useState(false)
//   const loaderRef = useRef(null)

//   const loadMoreItems = useCallback(() => {
//     if (visibleItems < resources.length) {
//       setLoading(true);
//       setTimeout(() => {
//         setVisibleItems(prevVisibleItems => prevVisibleItems + ITEMS_PER_PAGE);
//         setLoading(false);
//       }, 500); // Simulating network delay
//     }
//   }, [visibleItems, resources.length]);

//   useEffect(() => {
//     const options = {
//       root: null,
//       rootMargin: "20px",
//       threshold: 1.0
//     };

//     const observer = new IntersectionObserver((entries) => {
//       const target = entries[0];
//       if (target.isIntersecting && !loading) {
//         loadMoreItems();
//       }
//     }, options);

//     if (loaderRef.current) {
//       observer.observe(loaderRef.current);
//     }

//     return () => {
//       if (loaderRef.current) {
//         observer.unobserve(loaderRef.current);
//       }
//     };
//   }, [loadMoreItems, loading]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//           <h1 className="text-3xl font-bold text-gray-900">Kampus Access Ug Resources</h1>
//         </div>
//       </header>
//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {resources.map((resource:any) => (
//               <Card key={resource.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <FileText className="h-4 w-4 text-purple-500 flex-shrink-0" />
//                   <span className="truncate" title={resource.title}>{resource.title}</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="py-2 flex-grow">
//                 <p className="text-sm"><span className="font-semibold">Course:</span> {resource.course.title}</p>
//                 <p className="text-sm"><span className="font-semibold">Unit:</span> {resource.courseUnit.title}</p>
//                 <p className="text-sm"><span className="font-semibold">Campus:</span> {resource.campus.title}</p>
//                 <p className="text-sm"><span className="font-semibold">Category:</span> {resource.category.title}</p>
//                 <p className="text-sm"><span className="font-semibold">By</span> {resource.user.firstName}</p>
//               </CardContent>
//               <CardFooter className="pt-2">
//                 <Link className='w-full' target='_blank' href={resource.pdfUrl}>
//                 <Button variant="outline" className="w-full text-sm group hover:bg-purple-500 hover:text-white">
//                   <Download className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
//                   Download
//                 </Button>
//                 </Link>
               
//               </CardFooter>
//             </Card>
//             ))}
//           </div>

//           {visibleItems < resources.length && (
//             <div ref={loaderRef} className="flex justify-center items-center mt-8">
//               {loading ? (
//                 <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
//               ) : (
//                 <Button onClick={loadMoreItems} variant="outline">
//                   Load More
//                 </Button>
//               )}
//             </div>
//           )}

//           {resources.length === 0 && (
//             <div className="text-center py-8">
//               <p className="text-xl text-gray-500">No resources found matching your criteria.</p>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   )
// }

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Search, Loader2, FileText, Download, X } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'

const ITEMS_PER_PAGE = 20;

export default function ResourcesPage({
  resources = [],
  campuses = [],
  courses = [],
  categories = []
}: {
  resources?: any[],
  categories?: any[],
  courses?: any[],
  campuses?: any[]
}) {
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCampus, setSelectedCampus] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const loaderRef = useRef(null)

  const filteredResources = (resources || []).filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.courseUnit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCampus = selectedCampus ? resource.campus.id === selectedCampus : true
    const matchesCourse = selectedCourse ? resource.course.id === selectedCourse : true
    const matchesCategory = selectedCategory ? resource.category.id === selectedCategory : true

    return matchesSearch && matchesCampus && matchesCourse && matchesCategory
  })

  const loadMoreItems = useCallback(() => {
    if (visibleItems < filteredResources.length) {
      setLoading(true);
      setTimeout(() => {
        setVisibleItems(prevVisibleItems => prevVisibleItems + ITEMS_PER_PAGE);
        setLoading(false);
      }, 500); // Simulating network delay
    }
  }, [visibleItems, filteredResources.length]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading) {
        loadMoreItems();
      }
    }, options);

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loadMoreItems, loading]);

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCampus('')
    setSelectedCourse('')
    setSelectedCategory('')
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow">
        <div className="max-w-7xl flex justify-between mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-gray-900">Kampus Access Ug Resources</h1>
          <Link href="/upload" className='px-4 py-2 bg-purple-600 rounded-lg text-white'>add a resource</Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-grow">
                <Input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Campus" />
                </SelectTrigger>
                <SelectContent>
                  {campuses.map((campus) => (
                    <SelectItem key={campus.id} value={campus.id}>{campus.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(searchQuery || selectedCampus || selectedCourse || selectedCategory) && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <span>{searchQuery}</span>
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                  </Badge>
                )}
                {selectedCampus && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <span>{campuses.find(c => c.id === selectedCampus)?.title}</span>
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCampus('')} />
                  </Badge>
                )}
                {selectedCourse && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <span>{courses.find(c => c.id === selectedCourse)?.title}</span>
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCourse('')} />
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <span>{categories.find(c => c.id === selectedCategory)?.title}</span>
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={resetFilters}>Clear all</Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredResources.slice(0, visibleItems).map((resource) => (
              <Card key={resource.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="truncate" title={resource.title}>{resource.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2 flex-grow">
                  <p className="text-sm"><span className="font-semibold">Course:</span> {resource.course.title}</p>
                  <p className="text-sm"><span className="font-semibold">Unit:</span> {resource.courseUnit.title}</p>
                  <p className="text-sm"><span className="font-semibold">Campus:</span> {resource.campus.title}</p>
                  <p className="text-sm"><span className="font-semibold">Category:</span> {resource.category.title}</p>
                  <p className="text-sm"><span className="font-semibold">By</span> {resource.user.firstName}</p>
                </CardContent>
                <CardFooter className="pt-2">
                  <Link className='w-full' target='_blank' href={resource.pdfUrl}>
                    <Button variant="outline" className="w-full text-sm group hover:bg-purple-500 hover:text-white">
                      <Download className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                      Download
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {visibleItems < filteredResources.length && (
            <div ref={loaderRef} className="flex justify-center items-center mt-8">
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              ) : (
                <Button onClick={loadMoreItems} variant="outline">
                  Load More
                </Button>
              )}
            </div>
          )}

          {filteredResources.length === 0 && (
            <div className="text-center py-8">
              <p className="text-xl text-gray-500">No resources found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


