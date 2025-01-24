// import { db } from "@/prisma/db";
// import { NextRequest, NextResponse } from "next/server";

// // Type for the context parameter
// interface RouteContext {
//   params: {
//     id: string;
//   };
// }

// // GET - Fetch a single question
// export async function GET(request: NextRequest, context: RouteContext) {
//   try {
//     const id = await context.params.id;

//     const question = await db.question.findUnique({
//       where: { id },
//       include: {
//         user: true,
//         course: true,
//       },
//     });

//     if (!question) {
//       return NextResponse.json(
//         { message: "Question not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(question);
//   } catch (error) {
//     console.error("Error fetching question:", error);
//     return NextResponse.json(
//       {
//         message: "Failed to fetch question",
//         error: error instanceof Error ? error.message : "Unknown error occurred",
//       },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Remove a question
// export async function DELETE(request: NextRequest, context: RouteContext) {
//   try {
//     const id = await context.params.id;

//     const deletedQuestion = await db.question.delete({
//       where: { id },
//     });

//     return NextResponse.json({
//       message: "Question deleted successfully",
//       deletedQuestion,
//     });
//   } catch (error) {
//     console.error("Failed to delete question:", error);
//     return NextResponse.json(
//       {
//         message: "Failed to delete question",
//         error: error instanceof Error ? error.message : "Unknown error occurred",
//       },
//       { status: 500 }
//     );
//   }
// }

// // Type for update request body
// interface UpdateQuestionData {
//   title?: string;
//   courseUnit?: string;
//   content?: string;
//   stars?: number;
//   course?: string;
//   courseId?: string;
//   userId?: string;
// }

// // PATCH - Update a question
// // export async function PATCH(request: NextRequest, context: RouteContext) {
// //   try {
// //     const id = await context.params.id;
// //     const data: UpdateQuestionData = await request.json();

// //     const updatedQuestion = await db.question.update({
// //       where: { id },
// //       data,
// //     });

// //     if (!updatedQuestion) {
// //       return NextResponse.json(
// //         { message: "Question not found" },
// //         { status: 404 }
// //       );
// //     }

// //     return NextResponse.json({
// //       message: "Question updated successfully",
// //       updatedQuestion,
// //     });
// //   } catch (error) {
// //     console.error("Failed to update question:", error);
// //     return NextResponse.json(
// //       {
// //         message: "Failed to update question",
// //         error: error instanceof Error ? error.message : "Unknown error occurred",
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }


// app/api/questions/[id]/route.ts
// import { db } from "@/prisma/db";
// import { NextRequest, NextResponse } from "next/server";

// interface RouteContext {
//   params: Promise<{ id: string }> | { id: string };
// }

// // GET - Fetch a single question
// export async function GET(request: NextRequest, context: RouteContext) {
//   try {
//     const resolvedParams = await context.params;
//     const id = resolvedParams.id;

//     const question = await db.question.findUnique({
//       where: { id },
//       include: {
//         user: true,
//         course: true,
//       },
//     });

//     if (!question) {
//       return NextResponse.json(
//         { message: "Question not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(question);
//   } catch (error) {
//     console.error("Error fetching question:", error);
//     return NextResponse.json(
//       {
//         message: "Failed to fetch question",
//         error: error instanceof Error ? error.message : "Unknown error occurred",
//       },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Remove a question
// export async function DELETE(request: NextRequest, context: RouteContext) {
//   try {
//     const resolvedParams = await context.params;
//     const id = resolvedParams.id;

//     const deletedQuestion = await db.question.delete({
//       where: { id },
//     });

//     return NextResponse.json({
//       message: "Question deleted successfully",
//       deletedQuestion,
//     });
//   } catch (error) {
//     console.error("Failed to delete question:", error);
//     return NextResponse.json(
//       {
//         message: "Failed to delete question",
//         error: error instanceof Error ? error.message : "Unknown error occurred",
//       },
//       { status: 500 }
//     );
//   }
// }

// // Type for update request body
// interface UpdateQuestionData {
//   title?: string;
//   courseUnit?: string;
//   content?: string;
//   stars?: number;
//   course?: string;
//   courseId?: string;
//   userId?: string;
// }

// // PATCH - Update a question
// // export async function PATCH(request: NextRequest, context: RouteContext) {
// //   try {
// //     const resolvedParams = await context.params;
// //     const id = resolvedParams.id;
// //     const data: UpdateQuestionData = await request.json();

// //     const updatedQuestion = await db.question.update({
// //       where: { id },
// //       data,
// //     });

// //     if (!updatedQuestion) {
// //       return NextResponse.json(
// //         { message: "Question not found" },
// //         { status: 404 }
// //       );
// //     }

// //     return NextResponse.json({
// //       message: "Question updated successfully",
// //       updatedQuestion,
// //     });
// //   } catch (error) {
// //     console.error("Failed to update question:", error);
// //     return NextResponse.json(
// //       {
// //         message: "Failed to update question",
// //         error: error instanceof Error ? error.message : "Unknown error occurred",
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }



import { db } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: { id: string }; // Correct type for `params`
}

// GET - Fetch a single question
export async function GET( request: NextRequest,{params}: {params: Promise<{ id: string }>}) {
  try {
    const { id } =await params; // Access `id` directly

    const question = await db.question.findUnique({
      where: { id },
      include: {
        user: true,
        course: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch question",
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove a question
// export async function DELETE(request: NextRequest, context: RouteContext) {
//   try {
//     const { id } = context.params; // Access `id` directly

//     const deletedQuestion = await db.question.delete({
//       where: { id },
//     });

//     return NextResponse.json({
//       message: "Question deleted successfully",
//       deletedQuestion,
//     });
//   } catch (error) {
//     console.error("Failed to delete question:", error);
//     return NextResponse.json(
//       {
//         message: "Failed to delete question",
//         error: error instanceof Error ? error.message : "Unknown error occurred",
//       },
//       { status: 500 }
//     );
//   }
// }

// // Type for update request body
// interface UpdateQuestionData {
//   title?: string;
//   courseUnit?: string;
//   content?: string;
//   stars?: number;
//   course?: string;
//   courseId?: string;
//   userId?: string;
// }
