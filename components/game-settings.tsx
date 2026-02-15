"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Plus,
  Trash2,
  Save,
  FolderOpen,
  FileText,
  Folder,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Gauge,
  Monitor,
  Tv,
  Projector,
  MonitorSmartphone,
} from "lucide-react"
import type { Game, ConfigFile, MonitorProfile, FpsMethod } from "@/lib/types"

const FPS_METHODS: { value: FpsMethod; label: string; desc: string }[] = [
  { value: "auto", label: "Auto", desc: "Game built-in" },
  { value: "nvidia", label: "Nvidia", desc: "NVCP limiter" },
  { value: "rtss", label: "RTSS", desc: "RivaTuner" },
]

const monitorIcons = {
  monitor: Monitor,
  tv: Tv,
  projector: Projector,
  display: MonitorSmartphone,
}

interface GameSettingsProps {
  games: Game[]
  monitors: MonitorProfile[]
  onSave: (game: Game) => void
  onDelete: (gameId: string) => void
  onAddNew: () => void
  selectedGameId: string | null
  onSelectGame: (gameId: string | null) => void
}

export function GameSettings({
  games,
  monitors,
  onSave,
  onDelete,
  onAddNew,
  selectedGameId,
  onSelectGame,
}: GameSettingsProps) {
  const selectedGame = games.find((g) => g.id === selectedGameId)

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Game Settings</h2>
          <p className="text-xs text-muted-foreground">
            Manage games and configure files for each monitor
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-all hover:shadow-[0_0_16px_rgba(14,165,233,0.3)]"
        >
          <Plus className="h-4 w-4" />
          Add Game
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Game List */}
        <div className="w-64 shrink-0 border-r border-border overflow-y-auto">
          <div className="p-3">
            <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-2">
              Games ({games.length})
            </p>
            <div className="flex flex-col gap-1">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => onSelectGame(game.id)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                    selectedGameId === game.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <div className="relative h-8 w-6 shrink-0 overflow-hidden rounded-sm">
                    <Image
                      src={game.coverImage}
                      alt={game.name}
                      fill
                      sizes="24px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-medium truncate">{game.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {game.configFiles.length} config{game.configFiles.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Panel */}
        <div className="flex-1 overflow-y-auto">
          {selectedGame ? (
            <GameEditPanel
              game={selectedGame}
              monitors={monitors}
              onSave={onSave}
              onDelete={onDelete}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <FileText className="mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm font-medium">Select a game to edit</p>
              <p className="text-xs text-muted-foreground/60">
                Or add a new game to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function GameEditPanel({
  game,
  monitors,
  onSave,
  onDelete,
}: {
  game: Game
  monitors: MonitorProfile[]
  onSave: (game: Game) => void
  onDelete: (gameId: string) => void
}) {
  const [editedGame, setEditedGame] = useState<Game>({ ...game })
  const [expandedConfigs, setExpandedConfigs] = useState<Set<string>>(new Set())
  const [hasChanges, setHasChanges] = useState(false)

  const updateField = <K extends keyof Game>(field: K, value: Game[K]) => {
    setEditedGame((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const updateFpsForMonitor = (monitorId: string, value: string) => {
    const trimmed = value.trim()
    const fps = trimmed === "" ? null : parseInt(trimmed)
    setEditedGame((prev) => ({
      ...prev,
      fpsLocks: {
        ...prev.fpsLocks,
        [monitorId]: trimmed === "" || isNaN(fps!) ? null : fps,
      },
    }))
    setHasChanges(true)
  }

  const updateFpsMethodForMonitor = (monitorId: string, method: FpsMethod) => {
    setEditedGame((prev) => ({
      ...prev,
      fpsMethods: {
        ...prev.fpsMethods,
        [monitorId]: method,
      },
    }))
    setHasChanges(true)
  }

  const toggleConfigExpand = (cfgId: string) => {
    setExpandedConfigs((prev) => {
      const next = new Set(prev)
      if (next.has(cfgId)) next.delete(cfgId)
      else next.add(cfgId)
      return next
    })
  }

  const updateConfigField = (
    cfgId: string,
    field: "name" | "targetPath" | "type",
    value: string
  ) => {
    setEditedGame((prev) => ({
      ...prev,
      configFiles: prev.configFiles.map((cf) =>
        cf.id === cfgId ? { ...cf, [field]: value } : cf
      ),
    }))
    setHasChanges(true)
  }

  const updateConfigSourcePath = (cfgId: string, monitorId: string, value: string) => {
    setEditedGame((prev) => ({
      ...prev,
      configFiles: prev.configFiles.map((cf) =>
        cf.id === cfgId
          ? { ...cf, sourcePaths: { ...cf.sourcePaths, [monitorId]: value } }
          : cf
      ),
    }))
    setHasChanges(true)
  }

  const addConfigFile = (type: "file" | "folder") => {
    const sourcePaths: Record<string, string> = {}
    monitors.forEach((m) => (sourcePaths[m.id] = ""))
    const newCfg: ConfigFile = {
      id: `cfg-new-${Date.now()}`,
      type,
      name: type === "file" ? "new_config.ini" : "new_folder",
      sourcePaths,
      targetPath: "",
    }
    setEditedGame((prev) => ({
      ...prev,
      configFiles: [...prev.configFiles, newCfg],
    }))
    setExpandedConfigs((prev) => new Set([...prev, newCfg.id]))
    setHasChanges(true)
  }

  const removeConfigFile = (cfgId: string) => {
    setEditedGame((prev) => ({
      ...prev,
      configFiles: prev.configFiles.filter((cf) => cf.id !== cfgId),
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    onSave(editedGame)
    setHasChanges(false)
  }

  return (
    <div className="p-6">
      {/* Save Bar */}
      {hasChanges && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
          <p className="text-xs text-primary">You have unsaved changes</p>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:shadow-[0_0_12px_rgba(14,165,233,0.3)]"
          >
            <Save className="h-3.5 w-3.5" />
            Save Changes
          </button>
        </div>
      )}

      {/* Basic Info */}
      <section className="mb-8">
        <h3 className="mb-4 text-sm font-bold text-foreground">General</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Cover Preview */}
          <div className="col-span-2 flex items-start gap-4">
            <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg border border-border">
              <Image
                src={editedGame.coverImage}
                alt={editedGame.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <div>
                <label className="mb-1 block text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Game Name
                </label>
                <input
                  type="text"
                  value={editedGame.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="h-9 w-full rounded-lg border border-border bg-secondary px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Cover Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editedGame.coverImage}
                    onChange={(e) => updateField("coverImage", e.target.value)}
                    className="h-9 flex-1 rounded-lg border border-border bg-secondary px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                  <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Browse
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Executable */}
          <div className="col-span-2">
            <label className="mb-1 block text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Executable Path
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={editedGame.executablePath}
                onChange={(e) => updateField("executablePath", e.target.value)}
                className="h-9 flex-1 rounded-lg border border-border bg-secondary px-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                placeholder="C:\Games\MyGame\game.exe"
              />
              <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                <FolderOpen className="h-3.5 w-3.5" />
                Browse
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Per-Monitor FPS Lock */}
      <section className="mb-8">
        <h3 className="mb-3 text-sm font-bold text-foreground">
          FPS Lock <span className="font-normal text-muted-foreground">(per monitor)</span>
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {monitors.map((mon) => {
            const Icon = monitorIcons[mon.icon] ?? Monitor
            const currentFps = editedGame.fpsLocks[mon.id] ?? null
            const currentMethod: FpsMethod = editedGame.fpsMethods?.[mon.id] ?? "auto"
            return (
              <div
                key={mon.id}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-secondary/30 px-3 py-2.5"
              >
                <Icon className="h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-foreground truncate leading-tight">{mon.name}</p>
                  <p className="text-[9px] text-muted-foreground">{mon.resolution}</p>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={currentFps ?? ""}
                  onChange={(e) => updateFpsForMonitor(mon.id, e.target.value)}
                  placeholder="--"
                  className="h-7 w-14 shrink-0 rounded-md border border-border bg-card px-1 text-center font-mono text-[11px] text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
                <div className="flex h-7 shrink-0 rounded-md border border-border bg-card overflow-hidden">
                  {FPS_METHODS.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => updateFpsMethodForMonitor(mon.id, m.value)}
                      title={m.desc}
                      className={`px-2 text-[10px] font-medium transition-colors ${
                        currentMethod === m.value
                          ? "bg-primary/15 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <p className="mt-1.5 text-[10px] text-muted-foreground/60">
          Leave empty for unlimited. Auto = game built-in, Nvidia = NVCP, RTSS = RivaTuner.
        </p>
      </section>

      {/* Config Files / Folders */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">
            Config Entries{" "}
            <span className="font-normal text-muted-foreground">
              ({editedGame.configFiles.length})
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => addConfigFile("file")}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <FileText className="h-3.5 w-3.5" />
              Add File
            </button>
            <button
              onClick={() => addConfigFile("folder")}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Folder className="h-3.5 w-3.5" />
              Add Folder
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {editedGame.configFiles.map((cfg) => {
            const isExpanded = expandedConfigs.has(cfg.id)
            const TypeIcon = cfg.type === "folder" ? Folder : FileText
            return (
              <div
                key={cfg.id}
                className="rounded-xl border border-border bg-secondary/30 overflow-hidden"
              >
                {/* Config Header */}
                <button
                  onClick={() => toggleConfigExpand(cfg.id)}
                  className="flex w-full items-center gap-3 px-4 py-3"
                >
                  <TypeIcon className="h-4 w-4 shrink-0 text-primary" />
                  <span className="flex-1 text-left text-xs font-medium text-foreground">
                    {cfg.name}
                  </span>
                  <span className="mr-1 rounded-md bg-secondary px-2 py-0.5 text-[9px] font-mono uppercase text-muted-foreground">
                    {cfg.type}
                  </span>
                  <span className="mr-2 text-[10px] text-muted-foreground">
                    {cfg.targetPath ? "Configured" : "Not configured"}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {/* Config Details */}
                {isExpanded && (
                  <div className="border-t border-border px-4 py-4">
                    <div className="flex flex-col gap-3">
                      {/* Type toggle + Name */}
                      <div className="flex gap-3">
                        <div className="shrink-0">
                          <label className="mb-1 block text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                            Type
                          </label>
                          <div className="flex h-9 rounded-lg border border-border bg-card overflow-hidden">
                            <button
                              onClick={() => updateConfigField(cfg.id, "type", "file")}
                              className={`flex items-center gap-1.5 px-3 text-xs transition-colors ${
                                cfg.type === "file"
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <FileText className="h-3.5 w-3.5" />
                              File
                            </button>
                            <button
                              onClick={() => updateConfigField(cfg.id, "type", "folder")}
                              className={`flex items-center gap-1.5 px-3 text-xs transition-colors ${
                                cfg.type === "folder"
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <Folder className="h-3.5 w-3.5" />
                              Folder
                            </button>
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="mb-1 block text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                            {cfg.type === "folder" ? "Folder Name" : "File Name"}
                          </label>
                          <input
                            type="text"
                            value={cfg.name}
                            onChange={(e) =>
                              updateConfigField(cfg.id, "name", e.target.value)
                            }
                            className="h-9 w-full rounded-lg border border-border bg-card px-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                          />
                        </div>
                      </div>

                      {/* Source paths per monitor */}
                      <div className="rounded-lg border border-border bg-card p-4">
                        <p className="mb-3 text-[10px] font-mono uppercase tracking-widest text-primary">
                          Source Paths (per monitor)
                        </p>
                        <div className="flex flex-col gap-3">
                          {monitors.map((mon) => {
                            const Icon = monitorIcons[mon.icon] ?? Monitor
                            return (
                              <div key={mon.id}>
                                <label className="mb-1 flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                                  <Icon className="h-3.5 w-3.5 text-primary" />
                                  {mon.name} ({mon.resolution})
                                </label>
                                <input
                                  type="text"
                                  value={cfg.sourcePaths[mon.id] ?? ""}
                                  onChange={(e) =>
                                    updateConfigSourcePath(cfg.id, mon.id, e.target.value)
                                  }
                                  className="h-9 w-full rounded-lg border border-border bg-secondary px-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                                  placeholder={
                                    cfg.type === "folder"
                                      ? `C:\\Configs\\Game\\${mon.name}\\settings`
                                      : `C:\\Configs\\Game\\${mon.name}\\config.ini`
                                  }
                                />
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>

                      {/* Target Path */}
                      <div>
                        <label className="mb-1 block text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                          Target Path ({cfg.type === "folder" ? "Game Folder Location" : "Game Config Location"})
                        </label>
                        <input
                          type="text"
                          value={cfg.targetPath}
                          onChange={(e) =>
                            updateConfigField(cfg.id, "targetPath", e.target.value)
                          }
                          className="h-9 w-full rounded-lg border border-border bg-secondary px-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                          placeholder={
                            cfg.type === "folder"
                              ? "C:\\Games\\MyGame\\config\\settings"
                              : "C:\\Games\\MyGame\\config\\config.ini"
                          }
                        />
                      </div>

                      {/* Remove */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeConfigFile(cfg.id)}
                          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-medium text-destructive transition-colors hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {editedGame.configFiles.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10">
            <FileText className="mb-2 h-8 w-8 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">No config entries added</p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => addConfigFile("file")}
                className="text-xs font-medium text-primary hover:underline"
              >
                Add a file
              </button>
              <span className="text-xs text-muted-foreground">or</span>
              <button
                onClick={() => addConfigFile("folder")}
                className="text-xs font-medium text-primary hover:underline"
              >
                Add a folder
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Danger Zone */}
      <section>
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-destructive">Delete Game</h4>
              <p className="text-[10px] text-muted-foreground">
                This will remove the game from your launcher
              </p>
            </div>
            <button
              onClick={() => onDelete(game.id)}
              className="flex items-center gap-1.5 rounded-lg bg-destructive/10 px-4 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
