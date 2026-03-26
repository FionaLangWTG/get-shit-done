/**
 * Core type definitions for GSD-1 PLAN.md structures.
 *
 * These types model the YAML frontmatter + XML task bodies
 * that make up a GSD plan file.
 */

// ─── Frontmatter types ───────────────────────────────────────────────────────

export interface MustHaveArtifact {
  path: string;
  provides: string;
  min_lines?: number;
  exports?: string[];
  contains?: string;
}

export interface MustHaveKeyLink {
  from: string;
  to: string;
  via: string;
  pattern?: string;
}

export interface MustHaves {
  truths: string[];
  artifacts: MustHaveArtifact[];
  key_links: MustHaveKeyLink[];
}

export interface UserSetupEnvVar {
  name: string;
  source: string;
}

export interface UserSetupDashboardConfig {
  task: string;
  location: string;
  details: string;
}

export interface UserSetupItem {
  service: string;
  why: string;
  env_vars?: UserSetupEnvVar[];
  dashboard_config?: UserSetupDashboardConfig[];
  local_dev?: string[];
}

export interface PlanFrontmatter {
  phase: string;
  plan: string;
  type: string;
  wave: number;
  depends_on: string[];
  files_modified: string[];
  autonomous: boolean;
  requirements: string[];
  user_setup?: UserSetupItem[];
  must_haves: MustHaves;
  [key: string]: unknown; // Allow additional fields
}

// ─── Task types ──────────────────────────────────────────────────────────────

export interface PlanTask {
  type: string;
  name: string;
  files: string[];
  read_first: string[];
  action: string;
  verify: string;
  acceptance_criteria: string[];
  done: string;
}

// ─── Parsed plan ─────────────────────────────────────────────────────────────

export interface ParsedPlan {
  frontmatter: PlanFrontmatter;
  objective: string;
  execution_context: string[];
  context_refs: string[];
  tasks: PlanTask[];
  raw: string;
}

// ─── Session & execution types ───────────────────────────────────────────────

/**
 * Options for configuring a single plan execution session.
 */
export interface SessionOptions {
  /** Maximum agentic turns before stopping. Default: 50. */
  maxTurns?: number;
  /** Maximum budget in USD. Default: 5.0. */
  maxBudgetUsd?: number;
  /** Model ID to use (e.g., 'claude-sonnet-4-6'). Falls back to config model_profile. */
  model?: string;
  /** Working directory for the session. */
  cwd?: string;
  /** Allowed tool names. Default: ['Read','Write','Edit','Bash','Grep','Glob']. */
  allowedTools?: string[];
}

/**
 * Usage statistics from a completed session.
 */
export interface SessionUsage {
  inputTokens: number;
  outputTokens: number;
  cacheReadInputTokens: number;
  cacheCreationInputTokens: number;
}

/**
 * Result of a plan execution session.
 */
export interface PlanResult {
  /** Whether the plan completed successfully. */
  success: boolean;
  /** Session UUID for audit trail. */
  sessionId: string;
  /** Total cost in USD. */
  totalCostUsd: number;
  /** Total wall-clock duration in milliseconds. */
  durationMs: number;
  /** Token usage breakdown. */
  usage: SessionUsage;
  /** Number of agentic turns used. */
  numTurns: number;
  /** Error details when success is false. */
  error?: {
    /** Error subtype from SDK result (e.g., 'error_max_turns', 'error_during_execution'). */
    subtype: string;
    /** Error messages. */
    messages: string[];
  };
}

/**
 * Options for creating a GSD instance.
 */
export interface GSDOptions {
  /** Root directory of the project. */
  projectDir: string;
  /** Path to gsd-tools.cjs. Falls back to ~/.claude/get-shit-done/bin/gsd-tools.cjs. */
  gsdToolsPath?: string;
  /** Model to use for execution sessions. */
  model?: string;
  /** Maximum budget per plan execution in USD. Default: 5.0. */
  maxBudgetUsd?: number;
  /** Maximum turns per plan execution. Default: 50. */
  maxTurns?: number;
}
