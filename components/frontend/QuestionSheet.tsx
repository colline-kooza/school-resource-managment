import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { authOptions } from "@/config/auth";
import { getData } from "@/lib/getData";
import { getServerSession } from "next-auth";
import CreateQuestions from "../backend/forms/CreateQuestions";

export async function QuestionSheet() {
     const courseData=await getData("courses");
           const categoryData=await getData("categories");
           const campusData=await getData("campuses");
           const session = await getServerSession(authOptions);
           const user =session?.user
            const courses= courseData.map((item:any,i:any)=>{
              return(
                {
                  title:item.title,
                  id:item.id
                }
              )
            })
            const categories= categoryData.map((item:any,i:any)=>{
              return(
                {
                  title:item.title,
                  id:item.id
                }
              )
            })
            const campuses= campusData.map((item:any,i:any)=>{
              return(
                {
                  title:item.title,
                  id:item.id
                }
              )
            })
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-purple-600 text-white">Ask Question</Button>
      </SheetTrigger>
      <SheetContent className="w-1/2">
         <CreateQuestions user={user} categories={categories} courses={courses} campuses={campuses}/>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">
                Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
