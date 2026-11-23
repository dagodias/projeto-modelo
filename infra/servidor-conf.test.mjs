/** O servidor.conf é lido como texto e conferido: nada dele é executado. Roda no pnpm test (node --test). */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { lerServidorConf } from './servidor-conf.mjs'

const certo = 'APELIDO=meu-projeto\nPROJETO=meu-projeto\nDOMINIO=meunegocio.com.br\n'

test('lê as três chaves', () => {
  assert.deepEqual(lerServidorConf(certo), {
    APELIDO: 'meu-projeto',
    PROJETO: 'meu-projeto',
    DOMINIO: 'meunegocio.com.br',
  })
})

test('aceita o fim de linha do Windows, comentários e aspas', () => {
  const texto =
    '# o servidor\r\nAPELIDO="meu-projeto"\r\nPROJETO = meu-projeto\r\nDOMINIO=\'meunegocio.com.br\'\r\n'
  assert.equal(lerServidorConf(texto).DOMINIO, 'meunegocio.com.br')
  assert.equal(lerServidorConf(texto).APELIDO, 'meu-projeto')
})

test('nada é executado: um comando no lugar do valor é recusado', () => {
  assert.throws(
    () => lerServidorConf(certo.replace('PROJETO=meu-projeto', 'PROJETO=$(rm -rf ~)')),
    /PROJETO inválido/,
  )
  assert.throws(
    () => lerServidorConf(certo.replace('PROJETO=meu-projeto', 'PROJETO=x; id')),
    /PROJETO inválido/,
  )
})

test('o apelido não pode virar opção do ssh', () => {
  assert.throws(
    () => lerServidorConf(certo.replace('APELIDO=meu-projeto', 'APELIDO=-oProxyCommand=id')),
    /APELIDO inválido/,
  )
})

test('o domínio vai sem https:// e sem barra', () => {
  assert.throws(
    () => lerServidorConf(certo.replace('meunegocio.com.br', 'https://meunegocio.com.br/')),
    /DOMINIO inválido/,
  )
})

test('avisa o que falta e a linha fora do formato', () => {
  assert.throws(
    () => lerServidorConf('APELIDO=meu-projeto\nPROJETO=meu-projeto\n'),
    /Falta DOMINIO/,
  )
  assert.throws(() => lerServidorConf(certo + 'export X\n'), /Linha 4/)
})
