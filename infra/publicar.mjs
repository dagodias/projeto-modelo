/**
 * Publica no servidor o que já está no GitHub: pnpm publicar. Funciona no Mac, no Linux e no Windows.
 *
 * 1. Lê o infra/servidor.conf (só CHAVE=VALOR, sem executar nada) e confere os valores.
 * 2. Confere que não há mudança sem commit e que o main deste computador é o mesmo do GitHub.
 * 3. Chama no servidor a cópia instalada do atualizar (/usr/local/lib/<projeto>/atualizar.sh): ela faz o build numa
 *    pasta nova e só troca a versão com tudo pronto; se a nova não responder, volta sozinha para a anterior.
 * 4. Confere, pelo endereço público, a página inicial e a API (/api/saude).
 */
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { lerServidorConf } from './servidor-conf.mjs'

function parar(mensagem) {
  console.error(`\n${mensagem}`)
  process.exit(1)
}

function git(...argumentos) {
  return execFileSync('git', argumentos, { encoding: 'utf8' }).trim()
}

const CONF = 'infra/servidor.conf'
if (!existsSync(CONF)) {
  parar(
    `Falta o ${CONF}, com o apelido do servidor, o projeto e o domínio (o PUBLICACAO-DAGOBERTO.md cria).`,
  )
}
let conf
try {
  conf = lerServidorConf(readFileSync(CONF, 'utf8'))
} catch (erro) {
  parar(erro.message)
}
const { APELIDO, PROJETO, DOMINIO } = conf

if (git('status', '--porcelain'))
  parar('Há mudança sem commit. Faça o commit e o push antes de publicar.')
git('fetch', '-q', 'origin', 'main')
if (git('rev-parse', 'HEAD') !== git('rev-parse', 'origin/main')) {
  parar('O main deste computador está diferente do GitHub. Envie com git push antes de publicar.')
}

console.log(`Publicando a versão ${git('rev-parse', '--short', 'HEAD')} em ${DOMINIO}...`)
// Os valores já foram conferidos (só letras, números, ponto e hífen): nada aqui vira comando por engano.
const atualizar = spawnSync(
  'ssh',
  [APELIDO, 'sudo', `/usr/local/lib/${PROJETO}/atualizar.sh`, PROJETO],
  {
    stdio: 'inherit',
  },
)
if (atualizar.error) parar(`Não deu para rodar o ssh: ${atualizar.error.message}`)
if (atualizar.status === 255)
  parar(`Não deu para entrar no servidor (ssh ${APELIDO}). Confira a internet e o apelido.`)
if (atualizar.status === 3) {
  parar(
    'A versão nova não respondeu, e o servidor VOLTOU para a anterior: o site continua no ar com ela.\n' +
      'Veja o erro acima, conserte, faça o commit e publique de novo.',
  )
}
if (atualizar.status !== 0) {
  parar(
    'A publicação parou antes de trocar a versão: o site continua no ar com a de antes. O erro está acima.',
  )
}

async function responde(endereco) {
  try {
    const resposta = await fetch(endereco, { signal: AbortSignal.timeout(15_000) })
    return resposta.ok
  } catch {
    return false
  }
}
const pagina = await responde(`https://${DOMINIO}/`)
const api = await responde(`https://${DOMINIO}/api/saude`)
if (!pagina || !api) {
  parar(
    `O servidor publicou, mas pelo endereço público não ${!pagina ? 'abriu a página inicial' : 'respondeu a API'}.\n` +
      'Confira o cadeado e o DNS; o docs/publicar.md diz como ver os registros.',
  )
}
console.log(`\nNo ar: https://${DOMINIO} (a página e a API respondem)`)
