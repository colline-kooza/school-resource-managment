import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import CreateQuestions from "../backend/forms/CreateQuestions"
import { getServerSession } from "next-auth";
import { getData } from "@/lib/getData";
import { authOptions } from "@/config/auth";
  
  export async function CreateQuestionPopOver() {
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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="bg-purple-950">Ask Question</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            {/* <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle> */}
            <AlertDialogDescription>
           <CreateQuestions user={user} categories={categories} courses={courses} campuses={campuses}/>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  