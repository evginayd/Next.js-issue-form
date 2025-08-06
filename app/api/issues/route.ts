import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createIssueSchema } from "../../validationSchemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("POST body:", body);

    const validation = createIssueSchema.safeParse(body);
    if (!validation.success) {
      console.log("Validation errors:", validation.error.flatten());
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      priority,
      assignedToId,
      dueDate,
      category,
      labels,
      createdById,
      status,
    } = validation.data;

    const userExists = await prisma.user.findUnique({
      where: { id: createdById },
    });
    if (!userExists) {
      console.log("User not found for createdById:", createdById);
      return NextResponse.json(
        { error: "Invalid createdById: User not found" },
        { status: 400 }
      );
    }

    if (assignedToId) {
      const assigneeExists = await prisma.user.findUnique({
        where: { id: assignedToId },
      });
      if (!assigneeExists) {
        console.log("Assignee not found for assignedToId:", assignedToId);
        return NextResponse.json(
          { error: "Invalid assignedToId: User not found" },
          { status: 400 }
        );
      }
    }

    // Validate dueDate format
    if (dueDate && isNaN(new Date(dueDate).getTime())) {
      console.log("Invalid dueDate:", dueDate);
      return NextResponse.json(
        { error: "Invalid dueDate format" },
        { status: 400 }
      );
    }

    const newIssue = await prisma.issue.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        status: status || "OPEN",
        assignedToId: assignedToId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        category: category || null,
        labels: labels || [],
        createdById,
      },
    });

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to create issue", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const issues = await prisma.issue.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        assignedTo: true, // istersen ilgili kullanıcı bilgilerini al
        createdBy: true,
      },
    });

    return NextResponse.json(issues, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch issues:", error);
    return NextResponse.json(
      { error: "Failed to fetch issues", details: String(error) },
      { status: 500 }
    );
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/db";
// import { createIssueSchema } from "../../validationSchemas";

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const validation = createIssueSchema.safeParse(body);
//     if (!validation.success) {
//       return NextResponse.json(
//         { error: "Invalid input", details: validation.error.format() },
//         { status: 400 }
//       );
//     }

//     const {
//       title,
//       description,
//       priority,
//       assignedToId,
//       dueDate,
//       category,
//       labels,
//       createdById,
//       status,
//     } = validation.data;

//     const userExists = await prisma.user.findUnique({
//       where: { id: createdById },
//     });
//     if (!userExists) {
//       return NextResponse.json(
//         { error: "Invalid createdById: User not found" },
//         { status: 400 }
//       );
//     }

//     if (assignedToId) {
//       const assigneeExists = await prisma.user.findUnique({
//         where: { id: assignedToId },
//       });
//       if (!assigneeExists) {
//         return NextResponse.json(
//           { error: "Invalid assignedToId: User not found" },
//           { status: 400 }
//         );
//       }
//     }

//     if (dueDate && isNaN(new Date(dueDate).getTime())) {
//       return NextResponse.json(
//         { error: "Invalid dueDate format" },
//         { status: 400 }
//       );
//     }

//     const newIssue = await prisma.issue.create({
//       data: {
//         title,
//         description,
//         priority: priority ?? "MEDIUM",
//         status: status ?? "OPEN",
//         assignedToId: assignedToId ?? null,
//         dueDate: dueDate ? new Date(dueDate) : null,
//         category: category ?? null,
//         labels: labels ?? [],
//         createdById,
//       },
//     });

//     return NextResponse.json(newIssue, { status: 201 });
//   } catch (error) {
//     console.error("POST error:", error);
//     return NextResponse.json(
//       { error: "Failed to create issue", details: error || String(error) },
//       { status: 500 }
//     );
//   }
// }
