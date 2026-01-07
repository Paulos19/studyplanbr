import { NextRequest, NextResponse } from "next/server";
import { generateStudyPlan } from "@/services/ai-planner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Validação de Sessão
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const preferences = formData.get("preferences") as string;

    if (!file) {
      return NextResponse.json({ message: "Arquivo obrigatório" }, { status: 400 });
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Formato inválido. Apenas PDF ou Excel (.xlsx)." },
        { status: 400 }
      );
    }

    // Conversão de File para Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Chama o serviço de IA
    const plan = await generateStudyPlan(
      buffer, 
      file.type as any, 
      preferences
    );

    return NextResponse.json(plan, { status: 200 });

  } catch (error) {
    console.error("Erro na rota generate-plan:", error);
    return NextResponse.json(
      { message: "Erro ao processar arquivo" },
      { status: 500 }
    );
  }
}