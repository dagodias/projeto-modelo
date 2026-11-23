/**
 * O $api: o único jeito de a frente chamar a API.
 * Na página montada no servidor, ele repassa o cookie de quem está visitando (useRequestFetch);
 * no navegador, é o $fetch de sempre.
 */
type Opcoes = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: Record<string, unknown>
  query?: Record<string, string | number | boolean>
}

type Buscar = <T>(url: string, opcoes?: Opcoes) => Promise<T>

export default defineNuxtPlugin(() => {
  const buscar = useRequestFetch() as unknown as Buscar

  function api<T>(caminho: string, opcoes: Opcoes = {}): Promise<T> {
    return buscar<T>(`/api${caminho}`, opcoes)
  }

  return { provide: { api } }
})
