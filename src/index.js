import { intro, text, select, outro, confirm, multiselect, isCancel } from '@clack/prompts'
import { trytm } from '@bdsqqq/try'

import { getChangedFiles, getStagedFiles, gitAdd, gitCommit } from './git.js'
import { COMMIT_TYPES } from './commit-types.js'
import { exitProgram } from './utils.js'

import colors from 'picocolors'

intro(colors.inverse(`Asistant for the management of git repos by ${colors.yellow('@laindomJS')}`))

const [changedFiles, errorChangedFiles] = await trytm(getChangedFiles())
const [stagedFiles, errorStagedFiles] = await trytm(getStagedFiles())

if (errorChangedFiles ?? errorStagedFiles) {
  // TODO: Decidir si inicializar un repositorio de git o no
  outro(colors.red('Error: You not have a git repo'))
  process.exit(1)
}

// si se tienen archivos cambiados, dar la oportunidad de elegir cuales se deben de commitear
if (stagedFiles.length === 0 && changedFiles.length > 0) {
  const files = await multiselect({
    message: colors.cyan('Select the files for the commit:'),
    options: changedFiles.map(file => ({
      value: file,
      label: file
    }))
  })

  if (isCancel(files)) exitProgram()

  await gitAdd({ files })
}

// selecciona el tipo del commit entre los COMMIT_TYPES
const commitType = await select({
  message: colors.cyan('Select the type of commit'),
  options: Object.entries(COMMIT_TYPES).map(([key, value]) => ({
    value: key,
    label: `${value.emoji} ${key.padEnd(8, ' ')} - ${value.description}`
  }))
})

if (isCancel(commitType)) exitProgram()

// se recuerpa el mensaje del usuario
const commitMsg = await text({
  message: colors.cyan('Commit message:'),
  validate: (value) => {
    if (value === 0) {
      return colors.red('The message is empty!')
    }
    if (value > 60) {
      return colors.red('The message is to long')
    }
  }
})

if (isCancel(commitMsg)) exitProgram()

const { emoji, release } = COMMIT_TYPES[commitType]

// segun la selección del usuario, se recupera el valor booleano de breaking change
let breakingChange = false
if (release) {
  breakingChange = await confirm({
    initialValue: false,
    message: `${colors.cyan('Does the commit have any changes that might break compatibility?')} 
    ${colors.yellow('If the answer is yes, a commit will be created with the special type BREAKING CHANGE')}`
  })

  if (isCancel(breakingChange)) exitProgram()
}

// se crea el commit
let commit = `${emoji} ${commitType}: ${commitMsg}`
commit = breakingChange ? `${commit} [breaking change]` : commit

// se recupera si el usuario quiere continuar
const shouldContinue = await confirm({
  initialValue: true,
  message: `Do you want to create the commit with the following message?
  ${colors.green(colors.bold(commit))}
  ${colors.cyan('Sure?')}`
})

// si no se continua, se mantiene en suspenso
if (!shouldContinue) {
  outro(colors.yellow('No commit :C'))
  process.exit(0)
}

await gitCommit({ commit })

outro(
  colors.green('Created commit successfully :D!')
)

/*
TODOS:
1. Add a option to init a git repo
2. Add a option to add a remote repo
*/
