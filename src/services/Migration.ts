/**
 * Migration Service (Stub)
 *
 * This service previously handled migration from PGlite 0.2.x to 0.3.x.
 * Since pdf-brain has migrated to LibSQL, this is now a stub that reports
 * no migration is needed.
 *
 * If you have an old PGlite database, you'll need to re-ingest your documents.
 */

import {Effect, Context, Layer, Schema} from 'effect'

// ============================================================================
// Errors
// ============================================================================

export class MigrationError extends Schema.TaggedError<MigrationError>()(
  'MigrationError',
  {reason: Schema.String},
) {}

// ============================================================================
// Service Definition
// ============================================================================

export class Migration extends Context.Tag('Migration')<
  Migration,
  {
    /**
     * Check if database at given path needs migration.
     * Always returns false since we're now on LibSQL.
     */
    readonly checkMigrationNeeded: (
      dbPath: string,
    ) => Effect.Effect<boolean, MigrationError>

    /**
     * Get helpful message about the migration status.
     */
    readonly getMigrationMessage: () => string

    /**
     * Import SQL dump (no longer supported).
     */
    readonly importFromDump: (
      dumpFile: string,
      dbPath: string,
    ) => Effect.Effect<void, MigrationError>

    /**
     * Generate export script (no longer supported).
     */
    readonly generateExportScript: (dbPath: string) => string

    /**
     * Detect corrupted filesystem artifacts (no longer applicable).
     */
    readonly detectCorruptedArtifacts: (
      dbPath: string,
    ) => Effect.Effect<string[], MigrationError>

    /**
     * Remove corrupted filesystem artifacts (no longer applicable).
     */
    readonly cleanupCorruptedArtifacts: (
      dbPath: string,
      deep?: boolean,
    ) => Effect.Effect<string[], MigrationError>
  }
>() {}

// ============================================================================
// Implementation (Stub)
// ============================================================================

export const MigrationLive = Layer.succeed(
  Migration,
  Migration.of({
    checkMigrationNeeded: (_dbPath) =>
      // LibSQL doesn't need migration from PGlite
      Effect.succeed(false),

    getMigrationMessage: () => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  DATABASE MIGRATION INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

pdf-brain now uses LibSQL instead of PGlite.

If you had an existing PGlite database, you'll need to re-ingest your documents:

1. Delete your old library directory (or back it up first):
   rm -rf ~/Documents/.pdf-library

2. Re-add your PDFs:
   pdf-brain ingest /path/to/your/pdfs --enrich

The new LibSQL backend is faster and more reliable.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`,

    importFromDump: (_dumpFile, _dbPath) =>
      Effect.fail(
        new MigrationError({
          reason:
            'PGlite import is no longer supported. pdf-brain now uses LibSQL. Please re-ingest your documents.',
        }),
      ),

    generateExportScript: (_dbPath) =>
      `# PGlite export is no longer supported.
# pdf-brain now uses LibSQL.
# Please re-ingest your documents.`,

    detectCorruptedArtifacts: (_dbPath) =>
      // No PGlite artifacts to detect
      Effect.succeed([]),

    cleanupCorruptedArtifacts: (_dbPath, _deep) =>
      // No PGlite artifacts to clean
      Effect.succeed([]),
  }),
)
