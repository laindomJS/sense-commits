import { intro, text, select, outro, confirm, multiselect } from '@clack/prompts'
import { COMMIT_TYPES } from './commit-types.js'
import colors from 'picocolors'
import { getChangedFiles, getStagedFiles, gitAdd, gitCommit } from './git.js'
import { trytm } from '@bdsqqq/try'

intro(colors.inverse(`Asistente para la creación de commits! por ${colors.yellow('@laindomJS')}`))

const [changedFiles, errorChangedFiles] = await trytm(getChangedFiles())
const [stagedFiles, errorStagedFiles] = await trytm(getStagedFiles())

if (errorChangedFiles ?? errorStagedFiles) {
  // TODO: Decidir si inicializar un repositorio de git o no
  outro(colors.red('Error: Comprueba si estás en un repositorio de Git'))
  process.exit(1)
}

console.log({ changedFiles, stagedFiles })

if (stagedFiles.length === 0 && changedFiles.length > 0) {
  const files = await multiselect({
    message: colors.cyan('Selecciona los ficheros que quieres añadir al commit:'),
    options: changedFiles.map(file => ({
      value: file,
      label: file
    }))
  })

  await gitAdd({ files })
}

// selecciona el tipo del commit entre los COMMIT_TYPES
const commitType = await select({
  message: colors.cyan('Selecciona un tipo de commit'),
  options: Object.entries(COMMIT_TYPES).map(([key, value]) => ({
    value: key,
    label: `${value.emoji} ${key.padEnd(6, ' ')} - ${value.description}`
  }))
})
const { emoji, release } = COMMIT_TYPES[commitType]

// se recuerpa el mensaje del usuario
const commitMsg = await text({
  message: colors.cyan('Introduce el mensaje del commit')
})

// segun la selección del usuario, se recupera el valor booleano de breaking change
let breakingChange = false
if (release) {
  breakingChange = await confirm({
    initialValue: false,
    message: `${colors.cyan('¿Tiene el commit algún cambio que pueda rompear la compatibilidad?')} ${colors.yellow('Si la respuesta es si, crea un commit del tipo BREAKING CHANGE')}`
  })
}

// se crea el commit
let commit = `${emoji} ${commitType}: ${commitMsg}`
commit = breakingChange ? `${commit} [breaking change]` : commit

// se recupera si el usuario quiere continuar
const shouldContinue = await confirm({
  initialValue: true,
  message: `¿Quieres crear el commit con el siguiente mensaje?
  ${colors.green(colors.bold(commit))}
  ${colors.cyan('¿Confirmas?')}`
})

// si no se continua, se mantiene en suspenso
if (!shouldContinue) {
  outro(colors.yellow('No se ha creado el commit'))
  process.exit(0)
}

await gitCommit({ commit })

outro(
  colors.green('Commit creado con éxito :D!')
)
