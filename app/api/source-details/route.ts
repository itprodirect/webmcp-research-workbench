import { NextResponse } from "next/server";
import { getSourceDetails } from "@/src/domain/get-source-details";
import { SourceDetailsError } from "@/src/domain/source-details-error";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return errorResponse(
      new SourceDetailsError(
        "invalid_source_id",
        400,
        "Request body must be valid JSON.",
      ),
    );
  }

  try {
    const result = await getSourceDetails(input, { signal: request.signal });
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof SourceDetailsError) {
      return errorResponse(error);
    }
    return errorResponse(
      new SourceDetailsError(
        "provider_failure",
        500,
        "Source details failed unexpectedly.",
      ),
    );
  }
}

function errorResponse(error: SourceDetailsError) {
  return NextResponse.json(
    {
      error: {
        code: error.code,
        message: error.message,
        ...(error.provider ? { provider: error.provider } : {}),
      },
    },
    {
      status: error.httpStatus,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
