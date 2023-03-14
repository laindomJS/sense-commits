export const COMMIT_TYPES = {
  feat: {
    description: 'Add new feature',
    release: true
  },
  fix: {
    description: 'Submmit a fix bug',
    release: true
  },
  perf: {
    description: 'Improve performance',
    release: true
  },
  refactor: {
    description: 'Add or update documentation',
    release: true
  },
  docs: {
    description: 'Add or update documentation',
    release: false
  },
  test: {
    description: 'Add or update tests',
    release: false
  }
}
