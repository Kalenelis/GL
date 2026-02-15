"use client"

import { useState } from "react"
import {
  Gamepad2,
  Library,
  Settings,
  Monitor,
  Tv,
  Projector,
  MonitorSmartphone,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { MonitorProfile } from "@/lib/types"

const monitorIcons = {
  monitor: Monitor,
  tv: Tv,
  projector: Projector,
  display: MonitorSmartphone,
}

const iconOptions: { value: MonitorProfile["icon"]; label: string; Icon: typeof Monitor }[] = [
  { value: "monitor", label: "Monitor", Icon: Monitor },
  { value: "tv", label: "TV", Icon: Tv },
  { value: "projector", label: "Projector", Icon: Projector },
  { value: "display", label: "Display", Icon: MonitorSmartphone },
]

interface LauncherSidebarProps {
  activeTab: "library" | "settings"
  onTabChange: (tab: "library" | "settings") => void
  collapsed: boolean
  onToggleCollapse: () => void
  monitors: MonitorProfile[]
  onSaveMonitors: (monitors: MonitorProfile[]) => void
}

export function LauncherSidebar({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  monitors,
  onSaveMonitors,
}: LauncherSidebarProps) {
  const [editingMonitorId, setEditingMonitorId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<MonitorProfile | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMonitor, setNewMonitor] = useState<MonitorProfile>({
    id: "",
    name: "",
    resolution: "",
    icon: "monitor",
  })

  const navItems = [
    { id: "library" as const, label: "Library", icon: Library },
    { id: "settings" as const, label: "Game Settings", icon: Settings },
  ]

  const startEditing = (mon: MonitorProfile) => {
    setEditingMonitorId(mon.id)
    setEditDraft({ ...mon })
    setShowAddForm(false)
  }

  const cancelEditing = () => {
    setEditingMonitorId(null)
    setEditDraft(null)
  }

  const saveEditing = () => {
    if (!editDraft) return
    const updated = monitors.map((m) => (m.id === editDraft.id ? editDraft : m))
    onSaveMonitors(updated)
    setEditingMonitorId(null)
    setEditDraft(null)
  }

  const deleteMonitor = (id: string) => {
    if (monitors.length <= 1) return
    onSaveMonitors(monitors.filter((m) => m.id !== id))
    if (editingMonitorId === id) cancelEditing()
  }

  const startAdd = () => {
    setShowAddForm(true)
    setEditingMonitorId(null)
    setEditDraft(null)
    setNewMonitor({
      id: `monitor-${Date.now()}`,
      name: "",
      resolution: "",
      icon: "monitor",
    })
  }

  const confirmAdd = () => {
    if (!newMonitor.name.trim()) return
    onSaveMonitors([...monitors, { ...newMonitor, name: newMonitor.name.trim(), resolution: newMonitor.resolution.trim() || "1920x1080" }])
    setShowAddForm(false)
  }

  const cancelAdd = () => {
    setShowAddForm(false)
  }

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-card transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Gamepad2 className="h-5 w-5 text-primary" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold tracking-wide text-foreground">
              GameVault
            </h1>
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
              Launcher
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="px-2 py-4">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                activeTab === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </div>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Monitor Management -- bottom left */}
      <div className="border-t border-border px-2 py-3">
        {!collapsed && (
          <div className="mb-2 flex items-center justify-between px-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Displays ({monitors.length})
            </p>
            <button
              onClick={startAdd}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
              title="Add monitor"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Add form */}
        {!collapsed && showAddForm && (
          <div className="mb-2 rounded-lg border border-primary/30 bg-primary/5 p-2.5">
            <input
              type="text"
              value={newMonitor.name}
              onChange={(e) => setNewMonitor((p) => ({ ...p, name: e.target.value }))}
              placeholder="Name"
              className="mb-1.5 h-7 w-full rounded-md border border-border bg-card px-2 text-[11px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
              autoFocus
            />
            <input
              type="text"
              value={newMonitor.resolution}
              onChange={(e) => setNewMonitor((p) => ({ ...p, resolution: e.target.value }))}
              placeholder="Resolution (e.g. 2560x1440)"
              className="mb-2 h-7 w-full rounded-md border border-border bg-card px-2 font-mono text-[11px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
            />
            <div className="mb-2 flex gap-1">
              {iconOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setNewMonitor((p) => ({ ...p, icon: opt.value }))}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-md border transition-colors",
                    newMonitor.icon === opt.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                  title={opt.label}
                >
                  <opt.Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={confirmAdd}
                disabled={!newMonitor.name.trim()}
                className="flex flex-1 items-center justify-center gap-1 rounded-md bg-primary py-1 text-[10px] font-semibold text-primary-foreground transition-colors disabled:opacity-40"
              >
                <Check className="h-3 w-3" />
                Add
              </button>
              <button
                onClick={cancelAdd}
                className="flex flex-1 items-center justify-center gap-1 rounded-md border border-border py-1 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Monitor list */}
        <div className="flex flex-col gap-1.5">
          {monitors.map((mon) => {
            const Icon = monitorIcons[mon.icon] ?? Monitor
            const isEditing = editingMonitorId === mon.id

            if (collapsed) {
              return (
                <div
                  key={mon.id}
                  className="flex items-center justify-center rounded-md bg-secondary/50 p-2"
                  title={`${mon.name} (${mon.resolution})`}
                >
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              )
            }

            if (isEditing && editDraft) {
              return (
                <div
                  key={mon.id}
                  className="rounded-lg border border-primary/30 bg-primary/5 p-2.5"
                >
                  <input
                    type="text"
                    value={editDraft.name}
                    onChange={(e) => setEditDraft((p) => p ? { ...p, name: e.target.value } : p)}
                    className="mb-1.5 h-7 w-full rounded-md border border-border bg-card px-2 text-[11px] text-foreground focus:border-primary focus:outline-none"
                  />
                  <input
                    type="text"
                    value={editDraft.resolution}
                    onChange={(e) => setEditDraft((p) => p ? { ...p, resolution: e.target.value } : p)}
                    className="mb-2 h-7 w-full rounded-md border border-border bg-card px-2 font-mono text-[11px] text-foreground focus:border-primary focus:outline-none"
                  />
                  <div className="mb-2 flex gap-1">
                    {iconOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setEditDraft((p) => p ? { ...p, icon: opt.value } : p)}
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-md border transition-colors",
                          editDraft.icon === opt.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:text-foreground"
                        )}
                        title={opt.label}
                      >
                        <opt.Icon className="h-3.5 w-3.5" />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={saveEditing}
                      className="flex flex-1 items-center justify-center gap-1 rounded-md bg-primary py-1 text-[10px] font-semibold text-primary-foreground"
                    >
                      <Save className="h-3 w-3" />
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="flex flex-1 items-center justify-center gap-1 rounded-md border border-border py-1 text-[10px] text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )
            }

            return (
              <div
                key={mon.id}
                className="group flex items-center gap-2.5 rounded-lg bg-secondary/50 px-2.5 py-2"
              >
                <Icon className="h-4 w-4 shrink-0 text-primary" />
                <div className="flex-1 overflow-hidden">
                  <p className="text-[11px] font-medium text-foreground truncate">
                    {mon.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{mon.resolution}</p>
                </div>
                <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => startEditing(mon)}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                    title="Edit"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  {monitors.length > 1 && (
                    <button
                      onClick={() => deleteMonitor(mon.id)}
                      className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-card hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>
    </aside>
  )
}
