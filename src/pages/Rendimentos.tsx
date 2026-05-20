import { useMemo, useState } from 'react'
import './Rendimentos.css'

type MetricCardProps = {
  title: string
  value: string
  hint?: string
  tone?: 'accent' | 'neutral'
}

function MetricCard({ title, value, hint, tone = 'neutral' }: MetricCardProps) {
  return (
    <article className={`nx-earnCard nx-earnCard--${tone}`}>
      <div className="nx-earnCard__bar" />
      <div className="nx-earnCard__content">
        <div className="nx-earnCard__title">{title}</div>
        <div className="nx-earnCard__value">{value}</div>
        {hint && <div className="nx-earnCard__hint">{hint}</div>}
      </div>
      <div className="nx-earnCard__glow" aria-hidden="true" />
    </article>
  )
}

export default function Rendimentos() {
  // 🔌 Plugar no backend depois
  const userName = 'felipe'

  const receitaMesAnterior = 0
  const receitaAnoAtual = 0
  const rendimentoTotal = 0
  const divisaoReceita = 50

  // 🔌 dados do gráfico (se vazio, mostra estado “sem dados”)
  const [series] = useState<number[]>([])

  const hasChartData = useMemo(() => series.some((v) => v > 0), [series])

  return (
    <section className="nx-earn">
      <div className="nx-earn__wrap">
        <header className="nx-earn__header">
          <h1 className="nx-earn__title">
            Bem-vindo de volta, {userName}! <span className="nx-earn__wave" aria-hidden="true">👋</span>
          </h1>
        </header>

        <div className="nx-earn__grid">
          <MetricCard
            title="Receita do mês anterior"
            value={`R$ ${receitaMesAnterior.toFixed(2).replace('.', ',')}`}
            hint="Últimos 30 dias"
            tone="accent"
          />
          <MetricCard
            title="Receita do ano atual"
            value={`R$ ${receitaAnoAtual.toFixed(2).replace('.', ',')}`}
            hint="Ano corrente"
          />
          <MetricCard
            title="Rendimento total"
            value={`R$ ${rendimentoTotal.toFixed(2).replace('.', ',')}`}
            hint="Acumulado"
          />
          <MetricCard
            title="Divisão da receita"
            value={`${divisaoReceita}%`}
            hint="Sua porcentagem"
          />
        </div>

        <section className="nx-chartCard">
          <div className="nx-chartCard__head">
            <div className="nx-chartCard__title">Evolução mensal</div>
            <div className="nx-chartCard__subtitle">Acompanhe sua receita ao longo do ano</div>
          </div>

          <div className="nx-chartCard__body">
            {/* ✅ Placeholder do gráfico (pluga depois) */}
            <div className="nx-chartShell" role="img" aria-label="Gráfico de evolução mensal">
              {hasChartData ? (
                <canvas className="nx-chartCanvas" />
              ) : (
                <div className="nx-chartEmpty">
                  <div className="nx-chartEmpty__icon" aria-hidden="true">▦</div>
                  <p className="nx-chartEmpty__title">Sem dados para exibir</p>
                  <p className="nx-chartEmpty__text">
                    Assim que houver receita registrada, você verá a evolução mensal aqui.
                  </p>
                </div>
              )}

              {/* grid decorativa (premium) */}
              <div className="nx-chartGrid" aria-hidden="true" />
            </div>
          </div>

          <div className="nx-chartCard__footer">
            <button className="nx-btn nx-btn--wide" type="button">
              <span className="nx-btn__icon" aria-hidden="true">📊</span>
              Relatório de Downloads
            </button>
          </div>
        </section>
      </div>
    </section>
  )
}