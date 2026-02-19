"use client"
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';



export default function DeleteButton({id,redirect,resource,apiEndPoint}:{id:any,redirect:any,resource:any,apiEndPoint:any}) {
    const router=useRouter();

    async function handleDelete(){
        
   const comfirmed =confirm(`Are you sure you want to delete this ${resource}?`)
   if(comfirmed){
    const baseUrl=process.env.NEXT_PUBLIC_BASE_URL
    const response =await fetch(`${baseUrl}/${apiEndPoint}/${id}`,{
        method:"DELETE",

    });
    if(response.ok){
        toast.success(`${resource} deleted successfully`);
        // router.push(`${redirect}`);
        location.reload()

    }
   }

    }
  return (
    <button className='text-red-600' onClick={handleDelete}>Delete</button>
  )
}
