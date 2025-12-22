/**
 * Migration Service Unit Tests
 *
 * Since pdf-brain has migrated to LibSQL, the Migration service is now a stub.
 * These tests verify the stub behavior.
 */

import {describe, expect, test} from 'bun:test'
import {Effect} from 'effect'
import {Migration, MigrationLive, MigrationError} from './Migration.js'

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * Run a migration operation
 */
function runMigration<A, E>(
  effect: (
    migration: Effect.Effect.Success<typeof Migration>,
  ) => Effect.Effect<A, E, never>,
) {
  return Effect.runPromise(
    Effect.gen(function* () {
      const migration = yield* Migration
      return yield* effect(migration)
    }).pipe(Effect.provide(MigrationLive)),
  )
}

// ============================================================================
// Stub Behavior Tests
// ============================================================================

describe('Migration (LibSQL stub)', () => {
  test('checkMigrationNeeded always returns false', async () => {
    const result = await runMigration((m) =>
      m.checkMigrationNeeded('/any/path'),
    )
    expect(result).toBe(false)
  })

  test('getMigrationMessage returns info about LibSQL migration', async () => {
    const message = await runMigration((m) =>
      Effect.succeed(m.getMigrationMessage()),
    )
    expect(message).toContain('LibSQL')
    expect(message).toContain('re-ingest')
  })

  test('importFromDump fails with helpful error', async () => {
    const result = await Effect.runPromise(
      Effect.gen(function* () {
        const migration = yield* Migration
        return yield* Effect.either(
          migration.importFromDump('/dump.sql', '/db.db'),
        )
      }).pipe(Effect.provide(MigrationLive)),
    )

    expect(result._tag).toBe('Left')
    if (result._tag === 'Left') {
      expect(result.left).toBeInstanceOf(MigrationError)
      expect((result.left as MigrationError).reason).toContain('LibSQL')
    }
  })

  test('generateExportScript returns stub message', async () => {
    const script = await runMigration((m) =>
      Effect.succeed(m.generateExportScript('/db.db')),
    )
    expect(script).toContain('no longer supported')
    expect(script).toContain('LibSQL')
  })

  test('detectCorruptedArtifacts always returns empty array', async () => {
    const result = await runMigration((m) =>
      m.detectCorruptedArtifacts('/any/path'),
    )
    expect(result).toEqual([])
  })

  test('cleanupCorruptedArtifacts always returns empty array', async () => {
    const result = await runMigration((m) =>
      m.cleanupCorruptedArtifacts('/any/path'),
    )
    expect(result).toEqual([])
  })

  test('cleanupCorruptedArtifacts with deep flag returns empty array', async () => {
    const result = await runMigration((m) =>
      m.cleanupCorruptedArtifacts('/any/path', true),
    )
    expect(result).toEqual([])
  })
})
