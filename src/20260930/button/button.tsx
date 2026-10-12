import { Profiler, memo, useCallback, useMemo, useState } from "react";

type CounterControlsProps = {
    count: number;
    onIncrement: () => void;
};

const MemoizedCounterControls = memo(function MemoizedCounterControls({
    count,
    onIncrement,
}: CounterControlsProps) {
    return (
        <button className="count-button" onClick={onIncrement}>
            count <strong>{count}</strong>
            <span aria-hidden="true">+</span>
        </button>
    );
});

function CompilerCounterControls({ count, onIncrement }: CounterControlsProps) {
    return (
        <button className="count-button" onClick={onIncrement}>
            count <strong>{count}</strong>
            <span aria-hidden="true">+</span>
        </button>
    );
}

function logProfile(id: string, phase: string, actualDuration: number) {
    console.info(`[${id}] ${phase}: ${actualDuration.toFixed(2)}ms`);
}

function ManualMemoExample() {
    "use no memo";

    const [count, setCount] = useState(0);
    const [parentUpdates, setParentUpdates] = useState(0);
    const squared = useMemo(() => count * count, [count]);
    const increment = useCallback(() => {
        setCount((current) => current + 1);
    }, []);
    const refreshParent = useCallback(() => {
        setParentUpdates((current) => current + 1);
    }, []);

    return (
        <article className="comparison-panel manual-panel">
            <header className="panel-header">
                <span className="panel-index">01 / MANUAL</span>
                <h2>手動メモ化</h2>
                <p>依存関係を指定して再利用する</p>
            </header>
            <div className="metric">
                <span>count²</span>
                <strong>{squared}</strong>
            </div>
            <Profiler id="Manual child" onRender={logProfile}>
                <MemoizedCounterControls count={count} onIncrement={increment} />
            </Profiler>
            <button className="refresh-button" onClick={refreshParent}>
                親だけ再描画 <span>{parentUpdates}</span>
            </button>
            <div className="api-list" aria-label="使用する API">
                <code>memo</code>
                <code>useMemo</code>
                <code>useCallback</code>
            </div>
        </article>
    );
}

function ReactCompilerExample() {
    const [count, setCount] = useState(0);
    const [parentUpdates, setParentUpdates] = useState(0);
    const squared = count * count;

    return (
        <article className="comparison-panel compiler-panel">
            <header className="panel-header">
                <span className="panel-index">02 / COMPILER</span>
                <h2>React Compiler</h2>
                <p>必要な値とコンポーネントを自動で最適化</p>
            </header>
            <div className="metric">
                <span>count²</span>
                <strong>{squared}</strong>
            </div>
            <Profiler id="Compiler child" onRender={logProfile}>
                <CompilerCounterControls
                    count={count}
                    onIncrement={() => setCount(count + 1)}
                />
            </Profiler>
            <button
                className="refresh-button"
                onClick={() => setParentUpdates(parentUpdates + 1)}
            >
                親だけ再描画 <span>{parentUpdates}</span>
            </button>
            <div className="api-list" aria-label="手動メモ化 API は不要">
                <code>useState</code>
                <code>通常の計算</code>
                <code>通常の関数</code>
            </div>
        </article>
    );
}

export default function Button() {
    return (
        <main className="comparison-page">
            <div className="page-heading">
                <span className="eyebrow">REACT PERFORMANCE</span>
                <h1>同じカウンター、2つの最適化</h1>
                <p>
                    「親だけ再描画」を押してからカウントを比べてください。
                    子の描画ログはブラウザーの Console に出ます。
                </p>
            </div>
            <section className="comparison-grid" aria-label="最適化方法の比較">
                <ManualMemoExample />
                <ReactCompilerExample />
            </section>
        </main>
    );
}