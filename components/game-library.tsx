"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Search,
  Grid3X3,
  LayoutList,
  SlidersHorizontal,
  Monitor,
  Tv,
  Projector,
  MonitorSmartphone,
  Clock,
  Play,
  Settings2,
} from "lucide-react"
import { GameCard } from "@/components/game-card"
import type { Game, MonitorProfile } from "@/lib/types"

const monitorIcons = {
  monitor: Monitor,
  tv: Tv,
  projector: Projector,
  display: MonitorSmartphone,
}

interface GameLibraryProps {
  games: Game[]
  monitors: MonitorProfile[]
  onLaunch: (gameId: string, monitorId: string) => void
  onEdit: (gameId: string) => void
}

export function GameLibrary({ games, monitors, onLaunch, onEdit }: GameLibraryProps) {
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"name" | "recent" | "playtime">("recent")

  const filteredGames = games
    .filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "playtime") return (b.totalPlaytime ?? 0) - (a.totalPlaytime ?? 0)
      return (b.lastPlayed ?? "").localeCompare(a.lastPlayed ?? "")
    })

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Game Library</h2>
          <p className="text-xs text-muted-foreground">
            {games.length} game{games.length !== 1 ? "s" : ""} in your collection
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-56 rounded-lg border border-border bg-secondary pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary p-0.5">
            {(["recent", "name", "playtime"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`rounded-md px-2.5 py-1.5 text-[10px] font-medium capitalize transition-all ${
                  sortBy === s
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-border bg-secondary p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-md p-1.5 transition-all ${
                viewMode === "grid"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-md p-1.5 transition-all ${
                viewMode === "list"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutList className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                monitors={monitors}
                onLaunch={onLaunch}
                onEdit={onEdit}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredGames.map((game) => (
              <GameListItem
                key={game.id}
                game={game}
                monitors={monitors}
                onLaunch={onLaunch}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}

        {filteredGames.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <SlidersHorizontal className="mb-3 h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm font-medium text-muted-foreground">No games found</p>
            <p className="text-xs text-muted-foreground/60">
              Try adjusting your search or add a new game
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* List View Item */
function GameListItem({
  game,
  monitors,
  onLaunch,
  onEdit,
}: {
  game: Game
  monitors: MonitorProfile[]
  onLaunch: (gameId: string, monitorId: string) => void
  onEdit: (gameId: string) => void
}) {
  return (
    <div className="group flex items-center gap-4 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30">
      {/* Thumbnail */}
      <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md">
        <Image
          src={game.coverImage}
          alt={`${game.name} cover`}
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 overflow-hidden">
        <h4 className="text-sm font-semibold text-foreground truncate">{game.name}</h4>
        <div className="flex items-center gap-3 mt-0.5">
          {game.totalPlaytime !== undefined && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {game.totalPlaytime}h
            </span>
          )}
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Play className="h-3 w-3" />
            {game.configFiles.length} config{game.configFiles.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(game.id)}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Settings2 className="h-4 w-4" />
        </button>
        {monitors.map((mon, idx) => {
          const Icon = monitorIcons[mon.icon] ?? Monitor
          const fps = game.fpsLocks[mon.id]
          return (
            <button
              key={mon.id}
              onClick={() => onLaunch(game.id, mon.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                idx === 0
                  ? "bg-primary text-primary-foreground hover:shadow-[0_0_12px_rgba(14,165,233,0.3)]"
                  : "border border-border bg-secondary text-foreground hover:border-primary/40"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="max-w-[50px] truncate">{mon.name}</span>
              {fps && (
                <span className={`font-mono text-[9px] ${idx === 0 ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {fps}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
