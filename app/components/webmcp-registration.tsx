"use client";

import { useEffect } from "react";
import { createWebMcpTools } from "@/src/client/webmcp-tools";
import { instrumentWebMcpTools } from "@/src/client/webmcp-activity";

type ModelContext = NonNullable<Document["modelContext"]>;

interface RegistrationState {
  modelContext: ModelContext;
  controller: AbortController;
  consumers: number;
  cleanupTimer: ReturnType<typeof setTimeout> | null;
}

let registration: RegistrationState | null = null;

export function WebMcpRegistration() {
  useEffect(() => {
    const modelContext = document.modelContext;
    if (!modelContext) {
      return;
    }
    return acquireRegistration(modelContext);
  }, []);

  return null;
}

function acquireRegistration(modelContext: ModelContext) {
  if (
    !registration ||
    registration.controller.signal.aborted ||
    registration.modelContext !== modelContext
  ) {
    registration?.controller.abort();
    registration = createRegistration(modelContext);
  }

  const current = registration;
  current.consumers += 1;
  if (current.cleanupTimer) {
    clearTimeout(current.cleanupTimer);
    current.cleanupTimer = null;
  }

  return () => {
    current.consumers -= 1;
    current.cleanupTimer = setTimeout(() => {
      if (current.consumers === 0) {
        current.controller.abort();
        if (registration === current) {
          registration = null;
        }
      }
    }, 0);
  };
}

function createRegistration(modelContext: ModelContext): RegistrationState {
  const controller = new AbortController();

  void Promise.all(
    instrumentWebMcpTools(createWebMcpTools()).map((tool) =>
      modelContext.registerTool(tool, { signal: controller.signal }),
    ),
  )
    .catch((error: unknown) => {
      if (!controller.signal.aborted) {
        console.error("WebMCP tool registration failed.", error);
      }
    });

  return {
    modelContext,
    controller,
    consumers: 0,
    cleanupTimer: null,
  };
}
