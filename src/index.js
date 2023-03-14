import { intro, text, select, outro } from '@clack/prompts'
import { COMMIT_TYPES } from './commit-types.js'
import colors from 'picocolors'
import { getChangedFiles, getStagedFiles } from './git.js'
import { trytm } from '@bdsqqq/try'

intro(colors.inverse(`Asistente para la creación de commits! por ${colors.yellow('@laindomJS')}`))

const [changedFiles, errorChangedFiles] = await trytm(getChangedFiles())
const [stagedFiles, errorStagedFiles] = await trytm(getStagedFiles())

if (errorChangedFiles ?? errorStagedFiles) {
  outro(colors.red('Error: Comprueba si estás en un repositorio de Git'))
  process.exit(1)
}

console.log({ changedFiles, stagedFiles })

const commitType = await select({
  message: colors.cyan('Selecciona un tipo de commit'),
  options: Object.entries(COMMIT_TYPES).map(([key, value]) => ({
    value: key,
    title: `${value.description}`
  }))
})

console.log(commitType)

const commitMsg = await text({
  message: 'Introduce el mensaje del commit',
  placeholder: 'Add new feature'
})

console.log(commitMsg)
