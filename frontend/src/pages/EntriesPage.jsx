import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:8000";

export default function JournalApp() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [error, setError] = useState("");
    const [creating, setCreating] = useState(false);

    const canCreate = useMemo(() => {
        return (
            title.trim().length > 0 && content.trim().length > 0 && !creating
        );
    }, [title, content, creating]);

    async function fetchEntries() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_BASE}/entries/`);
            if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
            const data = await res.json();
            setEntries(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e?.message || "Failed to load entries");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEntries();
    }, []);

    async function createEntry(e) {
        e.preventDefault();
        if (!canCreate) return;

        setCreating(true);
        setError("");
        try {
            const res = await fetch(`${API_BASE}/entries/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    content: content.trim(),
                }),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(
                    `Create failed: ${res.status}${text ? ` — ${text}` : ""}`,
                );
            }

            const created = await res.json().catch(() => null);
            if (created && (created.id || created._id)) {
                const normalized = {
                    ...created,
                    id: created.id ?? created._id,
                };
                setEntries((prev) => [normalized, ...prev]);
            } else {
                await fetchEntries();
            }

            setTitle("");
            setContent("");
        } catch (e2) {
            setError(e2?.message || "Failed to create entry");
        } finally {
            setCreating(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto max-w-3xl p-6 space-y-4">
                <header className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Journal
                    </h1>

                    <button
                        type="button"
                        onClick={fetchEntries}
                        disabled={loading}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium hover:bg-white/10 disabled:opacity-50"
                    >
                        Refresh
                    </button>
                </header>

                <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 shadow">
                    <h2 className="text-base font-semibold">New entry</h2>

                    <form onSubmit={createEntry} className="mt-3 space-y-3">
                        <label className="block text-sm text-slate-200/90">
                            <span className="mb-1 block">Title</span>
                            <input
                                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 outline-none focus:ring-2 focus:ring-white/15"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Today I learned..."
                            />
                        </label>

                        <label className="block text-sm text-slate-200/90">
                            <span className="mb-1 block">Content</span>
                            <textarea
                                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 outline-none focus:ring-2 focus:ring-white/15 resize-y"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write something…"
                                rows={5}
                            />
                        </label>

                        <div className="flex items-center gap-2">
                            <button
                                type="submit"
                                disabled={!canCreate}
                                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                            >
                                {creating ? "Creating…" : "Create"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setTitle("");
                                    setContent("");
                                }}
                                disabled={creating || (!title && !content)}
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 disabled:opacity-50"
                            >
                                Clear
                            </button>

                            <div className="ml-auto text-xs text-slate-300/60">
                                API:{" "}
                                <code className="rounded bg-white/5 px-1 py-0.5">
                                    {API_BASE}
                                </code>
                            </div>
                        </div>

                        {error ? (
                            <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-100 whitespace-pre-wrap">
                                {error}
                            </div>
                        ) : null}
                    </form>
                </section>

                <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 shadow">
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold">Entries</h2>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-200/80">
                            {entries.length}
                        </span>
                    </div>

                    <div className="mt-3">
                        {loading ? (
                            <div className="text-sm text-slate-300/70">
                                Loading…
                            </div>
                        ) : entries.length === 0 ? (
                            <div className="text-sm text-slate-300/70">
                                No entries yet.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {entries.map((e) => (
                                    <article
                                        key={e.id ?? e._id}
                                        className="rounded-2xl border border-white/10 bg-slate-950/60 p-3"
                                    >
                                        <div className="flex items-baseline justify-between gap-3">
                                            <h3 className="text-sm font-semibold">
                                                {e.title ?? "(untitled)"}
                                            </h3>
                                            <span className="text-[11px] text-slate-300/50 truncate max-w-[45%]">
                                                {e.id ?? e._id}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-100/85 whitespace-pre-wrap">
                                            {e.content ?? ""}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
