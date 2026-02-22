# AI Partner-Matching Prototype: Implementation Plan

This document outlines the technical implementation plan for building the AI Partner-Matching Dashboard prototype for the Lilly Foundation Convening on February 13, 2026. This plan is designed to be executed in a new project directory to build the application architecture while waiting for the final dataset from Ascend Indiana.

## Core Objective
To build a functional, visually engaging prototype of an AI partner-matching tool that bridges the gap between abstract AI policy and practical workforce capability, demonstrating "AI Discernment" to an audience of higher-ed executives.

## Project Architecture & Stack
*   **Framework:** React (Next.js or Vite) with TypeScript for a robust, scalable foundation.
*   **Visualization:** `react-force-graph` or `D3.js` to recreate the interactive node-network mapping (modeled after Krystal Rawls' dashboard).
*   **Styling:** Tailwind CSS (or Vanilla CSS) for a clean, professional, corporate aesthetic.
*   **State Management:** React Context or Zustand for handling complex data relationships.

---

## Execution Phases

### Phase 1: Scaffold the Tech Stack & Environment
**Goal:** Initialize the project and install necessary dependencies.

1.  Initialize the project (e.g., `npx create-next-app@latest ai-partner-matching --typescript --tailwind --eslint`).
2.  Install visualization libraries (e.g., `npm install react-force-graph-2d d3`).
3.  Install UI component libraries if needed (e.g., `npm install lucide-react class-variance-authority clsx tailwind-merge` for shadcn/ui style components).
4.  Set up the basic folder structure (`/components`, `/data`, `/lib`, `/types`).

### Phase 2: Build the Data Schemas (The Architecture)
**Goal:** Define strict TypeScript interfaces based on the parameters required for the matching logic, establishing the structure before the real data arrives.

Create a `types/index.ts` file to define:
*   `InstitutionSchema`: (ID, Name, Region, Top Majors, Student Demographics, Type [R1, Liberal Arts, Community College])
*   `EmployerSchema`: (ID, Name, Industry, Hiring Needs, Location, Required Skills)
*   `IntermediarySchema`: (ID, Name, Focus Area, Available Programs [e.g., Apprenticeships])
*   `MatchSchema`: (SourceNode [Institution], TargetNode [Employer/Intermediary], MatchStrengthScore, AI_Reasoning)

### Phase 3: Develop the "Insight Engine" (The AI Integration)
**Goal:** Build the utility function that acts as the AI matching algorithm.

1.  Create a simulated matching engine (or a service to call an LLM API like OpenAI/Gemini if it's to be a true "Live Tool").
2.  The engine must take an `Institution` profile and an `Employer` profile, analyze the skills gap, and recommend a specific `Program` pathway (drawing from the Indiana Case Studies).
3.  Crucially, the engine must output the *reasoning* behind the match to demonstrate the "AI Discernment" concept emphasized in the session notes.

### Phase 4: Construct the UI/Dashboard
**Goal:** Build the visual components of the dashboard.

1.  **Left Panel (Data View):** Create data tables displaying labor market statistics and top companies (replicating the bottom-left of the reference dashboard).
2.  **Center Stage (Network Graph):** Implement the interactive D3.js or force-directed graph. 
    *   *Interaction:* When a user clicks an "Institution" node, the graph visually highlights the connections to the best "Employer" and "Community Solution" nodes.
3.  **Right Panel (AI Reasoning):** Create a detail pane that displays the AI's explanation for the match, highlighting the intersection of durable skills, local context, and technical needs.

### Phase 5: Data Ingestion Readiness
**Goal:** Ensure the application can easily accept the final data from Ascend Indiana.

1.  Create a simple utility or component to ingest CSV or JSON data matching the schemas defined in Phase 2.
2.  When Brad Rhorer delivers the Ascend dataset, process the file through this utility to populate the network graph dynamically.

---

## Immediate Next Steps (Upon Project Initialization)
1.  Run the scaffold commands (Phase 1).
2.  Define the TypeScript interfaces (Phase 2).
3.  Build a static, hardcoded version of the network graph to confirm the visualization library is working correctly before attempting dynamic matching.