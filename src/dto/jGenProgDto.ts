export class Result {
	constructor(
		public readonly patches: Patch[]
	) {}
}

export class Patch {
	constructor(
		public readonly VARIANT_ID: string,
		public readonly patchhunks: PatchChunk[]
	){}
}

export class PatchChunk {
	constructor(
		public readonly PATH: string,
		public readonly MODIFIED_FILE_PATH: string
	) {}
}
  