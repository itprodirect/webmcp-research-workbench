import { NextResponse } from "next/server";
import { SearchSourcesError } from "@/src/domain/search-error";
import { searchSources } from "@/src/domain/search-sources";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return errorResponse(
      new SearchSourcesError("invalid_search_request", 400, "Request body must be valid JSON."),
    );
  }

  try {
    const result = await searchSources(input, { signal: request.signal });
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof SearchSourcesError) {
      return errorResponse(error);
    }
    return errorResponse(
      new SearchSourcesError("provider_failure", 500, "Search failed unexpectedly."),
    );
  }
}

function errorResponse(error: SearchSourcesError) {
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
