"use client"

import Image from "next/image"
import { Monitor, Tv, Projector, MonitorSmartphone, Play, Clock, Settings2 } from "lucide-react"
import type { Game, MonitorProfile } from "@/lib/types"

const monitorIcons = {
  monitor: Monitor,
  tv: Tv,
  projector: Projector,
  display: MonitorSmartphone,
}

interface GameCardProps {
  game: Game
  monitors: MonitorProfile[]
  onLaunch: (gameId: string, monitorId: string) => void
  onEdit: (gameId: string) => void
}

export function GameCard({ game, monitors, onLaunch, onEdit }: GameCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(14,165,233,0.08)]">
      {/* Cover Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={game.coverImage}
          alt={`${game.name} cover`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent opacity-60" />

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/70 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Launch on
          </p>
          <div className="flex flex-wrap justify-center gap-2 px-3">
            {monitors.map((mon, idx) => {
              const Icon = monitorIcons[mon.icon] ?? Monitor
              const fps = game.fpsLocks[mon.id]
              const method = game.fpsMethods?.[mon.id]
              const methodLabel = method === "nvidia" ? "Nvidia" : method === "rtss" ? "RTSS" : "Auto"
              return (
                <button
                  key={mon.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    onLaunch(game.id, mon.id)
                  }}
                  className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2.5 transition-all ${
                    idx === 0
                      ? "bg-primary text-primary-foreground hover:shadow-[0_0_16px_rgba(14,165,233,0.3)]"
                      : "border border-border bg-secondary text-foreground hover:border-primary/50 hover:bg-secondary/80"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-semibold max-w-[80px] truncate">{mon.name}</span>
                  </div>
                  {fps ? (
                    <span className={`font-mono text-[11px] ${idx === 0 ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {fps} FPS / {methodLabel}
                    </span>
                  ) : (
                    <span className={`text-[11px] ${idx === 0 ? "text-primary-foreground/60" : "text-muted-foreground/60"}`}>
                      Unlimited
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(game.id)
            }}
            className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span>Configure</span>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 p-3">
        <h3 className="text-sm font-semibold text-foreground leading-tight truncate">
          {game.name}
        </h3>
        <div className="flex items-center gap-3">
          {game.totalPlaytime !== undefined && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-[10px]">{game.totalPlaytime}h</span>
            </div>
          )}
          {game.configFiles.length > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Play className="h-3 w-3" />
              <span className="text-[10px]">
                {game.configFiles.length} config{game.configFiles.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
