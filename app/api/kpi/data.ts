// Simple in-memory stores for KPI drafts and final reports (dev/demo only)
// Use globalThis to ensure the same store is shared across serverless/module contexts during development
declare global {
	// eslint-disable-next-line no-var
	var __KPI_DRAFTS__: any[] | undefined
	// eslint-disable-next-line no-var
	var __FINAL_REPORTS__: any[] | undefined
}

export const kpiDrafts: any[] = globalThis.__KPI_DRAFTS__ ?? (globalThis.__KPI_DRAFTS__ = [])
export const finalReports: any[] = globalThis.__FINAL_REPORTS__ ?? (globalThis.__FINAL_REPORTS__ = [])

export {} // make this a module
