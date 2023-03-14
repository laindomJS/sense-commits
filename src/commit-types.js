export const COMMIT_TYPES = {
  feat: {
    emoji: '🆕',
    description: 'Add new feature',
    release: true
  },
  fix: {
    emoji: '🛠 ',
    description: 'Submmit a fix bug',
    release: true
  },
  perf: {
    emoji: '⚡',
    description: 'Improve performance',
    release: true
  },
  refactor: {
    emoji: '✂ ',
    description: 'Add or update documentation',
    release: true
  },
  docs: {
    emoji: '📚',
    description: 'Add or update documentation',
    release: false
  },
  test: {
    emoji: '🧪',
    description: 'Add or update tests',
    release: false
  }
}
