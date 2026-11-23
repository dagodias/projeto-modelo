/**
 * Lê o infra/servidor.conf: só linhas CHAVE=VALOR, sem executar nada (o arquivo é texto, não um script).
 * Aceita o fim de linha do Windows (CRLF), comentários com # e o valor entre aspas. Confere cada valor antes de ele
 * chegar a um comando: o apelido do SSH, o nome do projeto e o domínio.
 */

const REGRAS = {
  APELIDO: {
    formato: /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/,
    explica: 'o apelido do servidor no SSH (letras, números, ponto, hífen e sublinhado)',
  },
  PROJETO: {
    formato: /^[a-z][a-z0-9-]{1,30}$/,
    explica: 'o nome do projeto (só letras minúsculas, números e hífen, começando por letra)',
  },
  DOMINIO: {
    formato: /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/,
    explica: 'o domínio, em letras minúsculas, sem https:// e sem barra (meunegocio.com.br)',
  },
}

/**
 * @param {string} texto o conteúdo do servidor.conf
 * @returns {{ APELIDO: string, PROJETO: string, DOMINIO: string }}
 */
export function lerServidorConf(texto) {
  /** @type {Record<string, string>} */
  const valores = {}
  for (const [indice, crua] of texto.split(/\r?\n/).entries()) {
    const linha = crua.trim()
    if (!linha || linha.startsWith('#')) continue
    const achado = /^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/.exec(linha)
    if (!achado)
      throw new Error(`Linha ${indice + 1} do servidor.conf fora do formato CHAVE=VALOR: ${linha}`)
    const [, chave, bruto] = achado
    valores[chave] = bruto.replace(/^(["'])(.*)\1$/, '$2')
  }
  for (const [chave, regra] of Object.entries(REGRAS)) {
    const valor = valores[chave]
    if (!valor) throw new Error(`Falta ${chave} no servidor.conf: ${regra.explica}.`)
    if (!regra.formato.test(valor)) {
      throw new Error(`${chave} inválido no servidor.conf (${valor}): ${regra.explica}.`)
    }
  }
  return { APELIDO: valores.APELIDO, PROJETO: valores.PROJETO, DOMINIO: valores.DOMINIO }
}
