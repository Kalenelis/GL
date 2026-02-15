"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  X,
  Monitor,
  Tv,
  Projector,
  MonitorSmartphone,
  FileText,
  Folder,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Gauge,
  Clock,
} from "lucide-react"
import type { Game, MonitorProfile } from "@/lib/types"

const monitorIcons = {
  monitor: Monitor,
  tv: Tv,
  projector: Projector,
  display: MonitorSmartphone,
}

interface LaunchModalProps {
  game: Game
  monitor: MonitorProfile
  onClose: () => void
}

type LaunchStep = "preview" | "swapping" | "launching" | "done"

export function LaunchModal({ game, monitor, onClose }: LaunchModalProps) {
  const [step, setStep] = useState<LaunchStep>("preview")

  const fps = game.fpsLocks[monitor.id] ?? null
  const fpsMethod = game.fpsMethods?.[monitor.id] ?? "auto"
  const methodLabel = fpsMethod === "nvidia" ? "Nvidia" : fpsMethod === "rtss" ? "RTSS" : "Auto"
  const Icon = monitorIcons[monitor.icon] ?? Monitor

  const handleLaunch = () => {
    setStep("swapping")
    setTimeout(() => {
      setStep("launching")
      setTimeout(() => {
        setStep("done")
      }, 1200)
    }, 1500)
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Game Header */}
        <div className="relative h-36 overflow-hidden rounded-t-2xl">
          <Image
            src={game.coverImage}
            alt={game.name}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
          <div className="absolute bottom-4 left-5">
            <h3 className="text-lg font-bold text-foreground">{game.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              {fps && (
                <span className="flex items-center gap-1 font-mono text-[10px] text-primary">
                  <Gauge className="h-3 w-3" />
                  {fps} FPS via {methodLabel}
                </span>
              )}
              {!fps && (
                <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                  <Gauge className="h-3 w-3" />
                  Unlimited
                </span>
              )}
              {game.totalPlaytime !== undefined && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {game.totalPlaytime}h played
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Monitor Info */}
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <Icon className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-foreground">
                Launching on {monitor.name}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {monitor.resolution}
                {fps ? ` / ${fps} FPS lock (${methodLabel})` : " / Unlimited FPS"}
              </p>
            </div>
          </div>

          {/* Config Files to Swap */}
          {game.configFiles.length > 0 && (
            <div className="mb-5">
              <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Configs to replace ({game.configFiles.length})
              </p>
              <div className="flex flex-col gap-2">
                {game.configFiles.map((cfg) => {
                  const sourcePath = cfg.sourcePaths[monitor.id] ?? ""
                  return (
                    <div
                      key={cfg.id}
                      className="flex items-center gap-2.5 rounded-lg border border-border bg-secondary/30 px-3 py-2.5"
                    >
                      {cfg.type === "folder" ? (
                        <Folder className="h-4 w-4 shrink-0 text-primary" />
                      ) : (
                        <FileText className="h-4 w-4 shrink-0 text-primary" />
                      )}
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-medium text-foreground truncate">
                          {cfg.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="max-w-[140px] truncate font-mono text-[9px] text-muted-foreground">
                            {sourcePath || "Not configured"}
                          </span>
                          <ArrowRight className="h-3 w-3 shrink-0 text-primary" />
                          <span className="max-w-[140px] truncate font-mono text-[9px] text-muted-foreground">
                            {cfg.targetPath}
                          </span>
                        </div>
                      </div>
                      {step === "done" && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                      )}
                      {step === "swapping" && (
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Status / Action */}
          {step === "preview" && (
            <button
              onClick={handleLaunch}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:shadow-[0_0_24px_rgba(14,165,233,0.3)]"
            >
              Launch Game
            </button>
          )}

          {step === "swapping" && (
            <div className="flex items-center justify-center gap-3 rounded-xl border border-border bg-secondary/50 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-xs font-medium text-foreground">
                Swapping config files...
              </span>
            </div>
          )}

          {step === "launching" && (
            <div className="flex items-center justify-center gap-3 rounded-xl border border-primary/30 bg-primary/10 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-xs font-medium text-primary">
                Starting {game.name}...
              </span>
            </div>
          )}

          {step === "done" && (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/5 py-4">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <p className="text-xs font-semibold text-green-400">
                Game launched successfully!
              </p>
              <p className="text-[10px] text-muted-foreground">
                Config files swapped for {monitor.name}
                {fps ? ` at ${fps} FPS (${methodLabel})` : ""}
              </p>
              <button
                onClick={onClose}
                className="mt-2 rounded-lg border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary/80"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
