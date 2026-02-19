import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
 campusLogo: f({ image: { maxFileSize: "1MB" } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("file url", file.url);
      return { uploadedBy: "admin"};
    }
  ),
  resourceUploader: f({ 
    pdf: { maxFileSize: "32MB" },
    blob: { maxFileSize: "32MB" } 
  }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("resource uploaded:", file.url);
      return { url: file.url };
    }
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// import { createUploadthing, type FileRouter } from "uploadthing/next";

// const f = createUploadthing();

// export const ourFileRouter = {
//   // Define an uploader for multiple file types
//   documentUploader: f({
//     fileTypes: [
//       "application/pdf",                              // PDF
//       "application/msword",                           // DOC
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
//       "text/plain",                                   // TXT
//       "application/vnd.ms-excel",                    // Excel (XLS)
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel (XLSX)
//       "application/vnd.ms-powerpoint",               // PPT
//       "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
//     ],
//     maxFileSize: "10MB", // Set maximum file size to 10MB (adjust as needed)
//   })
//     .middleware(async ({ req }) => {
//       // Optionally validate user or perform authentication here
//       const user = req.headers["user-id"]; // Example header validation
//       if (!user) throw new Error("Unauthorized upload");

//       return { uploadedBy: user }; // Pass metadata to the next step
//     })
//     .onUploadComplete(async ({ metadata, file }) => {
//       // Post-upload logic, such as logging the uploaded file or saving metadata
//       console.log("Document uploaded by:", metadata.uploadedBy);
//       console.log("File URL:", file.url);

//       return { uploadedBy: metadata.uploadedBy };
//     }),
// } satisfies FileRouter;

// export type OurFileRouter = typeof ourFileRouter;
