import type { Game, MonitorProfile } from "./types"

export const defaultMonitors: MonitorProfile[] = [
  {
    id: "monitor-2k",
    name: "Monitor 2K",
    resolution: "2560x1440",
    icon: "monitor",
  },
  {
    id: "tv-4k",
    name: "TV 4K",
    resolution: "3840x2160",
    icon: "tv",
  },
]

export const demoGames: Game[] = [
  {
    id: "1",
    name: "Stellar Odyssey",
    executablePath: "C:\\Games\\StellarOdyssey\\game.exe",
    coverImage: "/images/game-1.jpg",
    fpsLocks: {
      "monitor-2k": 60,
      "tv-4k": 30,
    },
    fpsMethods: {
      "monitor-2k": "nvidia",
      "tv-4k": "rtss",
    },
    configFiles: [
      {
        id: "cfg-1",
        type: "file",
        name: "graphics.ini",
        sourcePaths: {
          "monitor-2k": "C:\\Configs\\StellarOdyssey\\2K\\graphics.ini",
          "tv-4k": "C:\\Configs\\StellarOdyssey\\TV\\graphics.ini",
        },
        targetPath: "C:\\Games\\StellarOdyssey\\config\\graphics.ini",
      },
      {
        id: "cfg-2",
        type: "folder",
        name: "settings folder",
        sourcePaths: {
          "monitor-2k": "C:\\Configs\\StellarOdyssey\\2K\\settings",
          "tv-4k": "C:\\Configs\\StellarOdyssey\\TV\\settings",
        },
        targetPath: "C:\\Games\\StellarOdyssey\\config\\settings",
      },
    ],
    lastPlayed: "2026-02-14",
    totalPlaytime: 124,
  },
  {
    id: "2",
    name: "Dragon's Siege",
    executablePath: "C:\\Games\\DragonsSiege\\launcher.exe",
    coverImage: "/images/game-2.jpg",
    fpsLocks: {
      "monitor-2k": null,
      "tv-4k": 60,
    },
    fpsMethods: {
      "monitor-2k": "auto",
      "tv-4k": "nvidia",
    },
    configFiles: [
      {
        id: "cfg-3",
        type: "file",
        name: "settings.xml",
        sourcePaths: {
          "monitor-2k": "C:\\Configs\\DragonsSiege\\2K\\settings.xml",
          "tv-4k": "C:\\Configs\\DragonsSiege\\TV\\settings.xml",
        },
        targetPath: "C:\\Games\\DragonsSiege\\data\\settings.xml",
      },
    ],
    lastPlayed: "2026-02-13",
    totalPlaytime: 87,
  },
  {
    id: "3",
    name: "Neon Drift",
    executablePath: "C:\\Games\\NeonDrift\\NeonDrift.exe",
    coverImage: "/images/game-3.jpg",
    fpsLocks: {
      "monitor-2k": 120,
      "tv-4k": 60,
    },
    fpsMethods: {
      "monitor-2k": "rtss",
      "tv-4k": "auto",
    },
    configFiles: [
      {
        id: "cfg-4",
        type: "file",
        name: "video.ini",
        sourcePaths: {
          "monitor-2k": "C:\\Configs\\NeonDrift\\2K\\video.ini",
          "tv-4k": "C:\\Configs\\NeonDrift\\TV\\video.ini",
        },
        targetPath: "C:\\Games\\NeonDrift\\config\\video.ini",
      },
    ],
    lastPlayed: "2026-02-12",
    totalPlaytime: 56,
  },
  {
    id: "4",
    name: "Wasteland Echo",
    executablePath: "C:\\Games\\WastelandEcho\\game.exe",
    coverImage: "/images/game-4.jpg",
    fpsLocks: {
      "monitor-2k": 60,
      "tv-4k": 30,
    },
    fpsMethods: {
      "monitor-2k": "nvidia",
      "tv-4k": "rtss",
    },
    configFiles: [
      {
        id: "cfg-5",
        type: "file",
        name: "renderer.cfg",
        sourcePaths: {
          "monitor-2k": "C:\\Configs\\WastelandEcho\\2K\\renderer.cfg",
          "tv-4k": "C:\\Configs\\WastelandEcho\\TV\\renderer.cfg",
        },
        targetPath: "C:\\Games\\WastelandEcho\\settings\\renderer.cfg",
      },
      {
        id: "cfg-6",
        type: "folder",
        name: "user_settings",
        sourcePaths: {
          "monitor-2k": "C:\\Configs\\WastelandEcho\\2K\\user_settings.ini",
          "tv-4k": "C:\\Configs\\WastelandEcho\\TV\\user_settings.ini",
        },
        targetPath: "C:\\Games\\WastelandEcho\\settings\\user_settings.ini",
      },
    ],
    lastPlayed: "2026-02-10",
    totalPlaytime: 203,
  },
]
