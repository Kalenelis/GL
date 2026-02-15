export interface ConfigFile {
  id: string
  name: string
  type: "file" | "folder"
  /** Key = monitor profile ID, Value = source file/folder path for that monitor */
  sourcePaths: Record<string, string>
  targetPath: string
}

export interface MonitorProfile {
  id: string
  name: string
  resolution: string
  icon: "monitor" | "tv" | "projector" | "display"
}

export type FpsMethod = "auto" | "nvidia" | "rtss"

export interface Game {
  id: string
  name: string
  executablePath: string
  coverImage: string
  /** Key = monitor profile ID, Value = FPS lock for that monitor (null = unlimited) */
  fpsLocks: Record<string, number | null>
  /** Key = monitor profile ID, Value = method used to lock FPS */
  fpsMethods: Record<string, FpsMethod>
  configFiles: ConfigFile[]
  lastPlayed?: string
  totalPlaytime?: number
  favoriteMonitor?: string
}
