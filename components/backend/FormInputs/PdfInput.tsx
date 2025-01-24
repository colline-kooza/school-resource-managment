// import { UploadDropzone } from "@/libs/uploadthing";
import { UploadDropzone } from "@/lib/uploadthing";
import { Pencil } from "lucide-react";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";
// import toast from "react-hot-toast";

export default function Pdfinput({
  label,
  pdfUrl = "",
  setPdfUrl,
  className = "col-span-full",
  endpoint = "categoryImage",
}:{label:string,
  pdfUrl:any,
  setPdfUrl:any,
  className?:any,
  endpoint:any}) {

  
  return (
    <div className={className}>
      <div className="flex mt-4 justify-between items-center mb-4">
        <label
          htmlFor="course-image"
          className="block text-sm font-medium leading-6 text-gray-900 mb-2"
        >
          {label}
        </label>
        {pdfUrl && (
          <button
            onClick={() => setPdfUrl("")}
            type="button"
            className="flex space-x-2  bg-slate-900 rounded-md shadow text-slate-50  py-2 px-4"
          >
            <Pencil className="w-5 h-5" />
            <span>Change document</span>
          </button>
        )}
      </div>
      {pdfUrl ? (

         <div className="h-48">
          {/* pdf */}
          <iframe
         src={pdfUrl}
         width="100%"
         height="100%"
         title="Embedded PDF Viewer"
       ></iframe>
        {/* word */}
          {/* <iframe 
    src={`https://view.officeapps.live.com/op/embed.aspx?src=${pdfUrl}`} 
    width="100%" 
    height="200px">
  </iframe> */}
  {/* ppt */}
  {/* <iframe 
    src={`https://view.officeapps.live.com/op/embed.aspx?src=${pdfUrl}`} 
    width="100%" 
    height="600px">
  </iframe> */}
         </div>
         
      ) : (
        <UploadDropzone
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            setPdfUrl(res[0].url);
            // Do something with the response
            toast.success("pdf upload complete")
            // console.log("Files: ", res[0].url);
            const companyLogo=res[0].url
            console.log(companyLogo)
            setPdfUrl(companyLogo)
          }}
          onUploadError={(error) => {
            // Do something with the error.
            toast.error("pdf upload failed, try again")
            console.log(`ERROR! ${error.message}`);
          }}
        />
      )}
    </div>
  );
}