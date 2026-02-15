"use client"

import { useState, useCallback } from "react"
import { LauncherSidebar } from "@/components/launcher-sidebar"
import { GameLibrary } from "@/components/game-library"
import { GameSettings } from "@/components/game-settings"
import { LaunchModal } from "@/components/launch-modal"
import { demoGames, defaultMonitors } from "@/lib/game-store"
import type { Game, MonitorProfile } from "@/lib/types"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"library" | "settings">("library")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [games, setGames] = useState<Game[]>(demoGames)
  const [monitors, setMonitors] = useState<MonitorProfile[]>(defaultMonitors)
  const [selectedSettingsGame, setSelectedSettingsGame] = useState<string | null>(null)

  const [launchModal, setLaunchModal] = useState<{
    game: Game
    monitor: MonitorProfile
  } | null>(null)

  const handleLaunch = useCallback(
    (gameId: string, monitorId: string) => {
      const game = games.find((g) => g.id === gameId)
      const monitor = monitors.find((m) => m.id === monitorId)
      if (game && monitor) {
        setLaunchModal({ game, monitor })
      }
    },
    [games, monitors]
  )

  const handleEditFromLibrary = useCallback((gameId: string) => {
    setActiveTab("settings")
    setSelectedSettingsGame(gameId)
  }, [])

  const handleSaveGame = useCallback((updatedGame: Game) => {
    setGames((prev) =>
      prev.map((g) => (g.id === updatedGame.id ? updatedGame : g))
    )
  }, [])

  const handleDeleteGame = useCallback((gameId: string) => {
    setGames((prev) => prev.filter((g) => g.id !== gameId))
    setSelectedSettingsGame(null)
  }, [])

  const handleAddNewGame = useCallback(() => {
    const fpsLocks: Record<string, number | null> = {}
    const fpsMethods: Record<string, "auto" | "nvidia" | "rtss"> = {}
    monitors.forEach((m) => {
      fpsLocks[m.id] = null
      fpsMethods[m.id] = "auto"
    })
    const newGame: Game = {
      id: `game-${Date.now()}`,
      name: "New Game",
      executablePath: "",
      coverImage: "/images/game-1.jpg",
      fpsLocks,
      fpsMethods,
      configFiles: [],
    }
    setGames((prev) => [...prev, newGame])
    setSelectedSettingsGame(newGame.id)
  }, [monitors])

  const handleSaveMonitors = useCallback((updatedMonitors: MonitorProfile[]) => {
    setMonitors(updatedMonitors)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <LauncherSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
        monitors={monitors}
        onSaveMonitors={handleSaveMonitors}
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        {activeTab === "library" && (
          <GameLibrary
            games={games}
            monitors={monitors}
            onLaunch={handleLaunch}
            onEdit={handleEditFromLibrary}
          />
        )}
        {activeTab === "settings" && (
          <GameSettings
            games={games}
            monitors={monitors}
            onSave={handleSaveGame}
            onDelete={handleDeleteGame}
            onAddNew={handleAddNewGame}
            selectedGameId={selectedSettingsGame}
            onSelectGame={setSelectedSettingsGame}
          />
        )}
      </main>

      {launchModal && (
        <LaunchModal
          game={launchModal.game}
          monitor={launchModal.monitor}
          onClose={() => setLaunchModal(null)}
        />
      )}
    </div>
  )
}
