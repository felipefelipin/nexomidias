import { useMemo, useState } from 'react'
import './Carteira.css'

type SaqueStatus = 'todos' | 'pendente' | 'aprovado' | 'rejeitado'
type OrdenarPor = 'data' | 'valor'
type Ordem = 'desc' | 'asc'

type SaqueRow = {
  id: string
  status: 'pendente' | 'aprovado' | 'rejeitado'
  created_at: string
  valor: number
}

function moneyBRL(v: number) {
  try {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  } catch {
    return `R$ ${v.toFixed(2)}`
  }
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return iso
  }
}

function Pill({ status }: { status: SaqueRow['status'] }) {
  const label =
    status === 'pendente' ? 'Pendente' :
    status === 'aprovado' ? 'Aprovado' :
    'Rejeitado'

  return (
    <span className={`nx-pill nx-pill--${status}`}>
      <span className="nx-pill__dot" aria-hidden="true" />
      {label}
    </span>
  )
}

function SkeletonHistory() {
  return (
    <div className="nx-skel" aria-hidden="true">
      <div className="nx-skelRow nx-skelRow--head">
        <div className="nx-skelLine nx-skelLine--sm" />
        <div className="nx-skelLine nx-skelLine--sm" />
        <div className="nx-skelLine nx-skelLine--sm" />
        <div className="nx-skelLine nx-skelLine--sm nx-skelLine--right" />
      </div>

      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="nx-skelRow">
          <div className="nx-skelLine" />
          <div className="nx-skelLine nx-skelLine--pill" />
          <div className="nx-skelLine" />
          <div className="nx-skelLine nx-skelLine--right" />
        </div>
      ))}
    </div>
  )
}

export default function Carteira() {
  // 🔌 plugar depois no Supabase/backend
  const saldoDisponivel = 0
  const totalSacado = 0
  const saldoMinimo = 50

  // ✅ exemplo: mantenho vazio como seu print
  const [saques] = useState<SaqueRow[]>([])

  // ✅ simula loading bonito (se quiser, troque pra true enquanto carrega do Supabase)
  const [loading] = useState(false)

  const [status, setStatus] = useState<SaqueStatus>('todos')
  const [ordenarPor, setOrdenarPor] = useState<OrdenarPor>('data')
  const [ordem, setOrdem] = useState<Ordem>('desc')

  const filtered = useMemo(() => {
    let list = [...saques]

    if (status !== 'todos') {
      list = list.filter((s) => s.status === status)
    }

    list.sort((a, b) => {
      const dir = ordem === 'asc' ? 1 : -1

      if (ordenarPor === 'valor') {
        return (a.valor - b.valor) * dir
      }

      const da = new Date(a.created_at).getTime()
      const db = new Date(b.created_at).getTime()
      return (da - db) * dir
    })

    return list
  }, [saques, status, ordenarPor, ordem])

  return (
    <section className="nx-wallet">
      <div className="nx-wallet__wrap">
        <header className="nx-wallet__header">
          <h1 className="nx-wallet__title">Carteira</h1>
          <p className="nx-wallet__subtitle">Acompanhe seus ganhos e histórico de saques</p>
        </header>

        {/* Top stats */}
        <div className="nx-wallet__stats">
          <article className="nx-stat nx-stat--accent">
            <div className="nx-stat__label">Saldo Disponível</div>
            <div className="nx-stat__value">{moneyBRL(saldoDisponivel)}</div>
            <div className="nx-stat__hint">Valor disponível para saque</div>
            <div className="nx-stat__glow" aria-hidden="true" />
          </article>

          <article className="nx-stat nx-stat--dark">
            <div className="nx-stat__label">Total Sacado</div>
            <div className="nx-stat__value">{moneyBRL(totalSacado)}</div>
            <div className="nx-stat__hint">Valor total já sacado</div>
          </article>
        </div>

        {/* Min badge */}
        <div className="nx-wallet__min">
          <span className="nx-minBadge">
            Saldo mínimo: <strong>{moneyBRL(saldoMinimo)}</strong>
          </span>
        </div>

        {/* History card */}
        <section className="nx-walletCard">
          <div className="nx-walletCard__head">
            <h2 className="nx-walletCard__title">Histórico de Saques</h2>

            <div className="nx-filters" aria-label="Filtros de histórico">
              <div className="nx-field">
                <label className="nx-field__label" htmlFor="status">Status</label>
                <select
                  id="status"
                  className="nx-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as SaqueStatus)}
                >
                  <option value="todos">Todos os status</option>
                  <option value="pendente">Pendente</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="rejeitado">Rejeitado</option>
                </select>
              </div>

              <div className="nx-field">
                <label className="nx-field__label" htmlFor="ordenar">Ordenar por</label>
                <select
                  id="ordenar"
                  className="nx-select"
                  value={ordenarPor}
                  onChange={(e) => setOrdenarPor(e.target.value as OrdenarPor)}
                >
                  <option value="data">Data</option>
                  <option value="valor">Valor</option>
                </select>
              </div>

              <div className="nx-field">
                <label className="nx-field__label" htmlFor="ordem">Ordem</label>
                <select
                  id="ordem"
                  className="nx-select"
                  value={ordem}
                  onChange={(e) => setOrdem(e.target.value as Ordem)}
                >
                  <option value="desc">Decrescente</option>
                  <option value="asc">Crescente</option>
                </select>
              </div>
            </div>
          </div>

          {/* Body */}
          {loading ? (
            <SkeletonHistory />
          ) : filtered.length === 0 ? (
            <div className="nx-empty">
              <div className="nx-empty__icon" aria-hidden="true">▦</div>
              <p className="nx-empty__title">Nenhum saque encontrado</p>
              <p className="nx-empty__text">
                Quando você solicitar um saque, ele vai aparecer aqui com o status e a data.
              </p>

              <div className="nx-emptyPreview" aria-hidden="true">
                <div className="nx-emptyPreview__card" />
                <div className="nx-emptyPreview__card" />
                <div className="nx-emptyPreview__card" />
              </div>
            </div>
          ) : (
            <div className="nx-table">
              <div className="nx-table__row nx-table__head">
                <div>ID</div>
                <div>Status</div>
                <div>Data</div>
                <div className="nx-table__right">Valor</div>
              </div>

              {filtered.map((s, idx) => (
                <div
                  key={s.id}
                  className="nx-table__row nx-appear"
                  style={{ animationDelay: `${Math.min(idx * 35, 240)}ms` }}
                >
                  <div className="nx-mono">{s.id.slice(0, 8)}…</div>
                  <div><Pill status={s.status} /></div>
                  <div>{formatDate(s.created_at)}</div>
                  <div className="nx-table__right nx-money">{moneyBRL(s.valor)}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  )
}