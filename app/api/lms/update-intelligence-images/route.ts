import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  const slug = "intelligence-cycle";
  const snap = await adminDb.collection("courses").where("slug", "==", slug).get();
  
  if (snap.empty) return NextResponse.json({ error: "not found" });
  
  const courseDoc = snap.docs[0];
  const courseData = courseDoc.data();
  
  const customContent = typeof courseData.customContent === "string" 
    ? JSON.parse(courseData.customContent) 
    : courseData.customContent;

  if (customContent && customContent.lessons && customContent.lessons.length > 0) {
    customContent.lessons[0].labeledGraphic = {
      imageUrl: "/thumbnails/intelligence_cycle_diagram.png",
      hotspots: [
        {
          id: "direction",
          title: "Direction & Planning",
          content: "Setting intelligence requirements and defining priorities.",
          x: 20,
          y: 20
        },
        {
          id: "collection",
          title: "Collection",
          content: "Gathering raw data from various sources.",
          x: 80,
          y: 20
        },
        {
          id: "processing",
          title: "Processing",
          content: "Converting raw data into a usable format.",
          x: 80,
          y: 80
        },
        {
          id: "analysis",
          title: "Analysis",
          content: "Evaluating and interpreting processed information.",
          x: 50,
          y: 90
        },
        {
          id: "dissemination",
          title: "Dissemination",
          content: "Delivering intelligence products to decision-makers.",
          x: 20,
          y: 80
        }
      ]
    };
  }

  await courseDoc.ref.update({
    imageUrl: "/thumbnails/intelligence_cycle.png",
    customContent: JSON.stringify(customContent)
  });

  return NextResponse.json({ success: true });
}
