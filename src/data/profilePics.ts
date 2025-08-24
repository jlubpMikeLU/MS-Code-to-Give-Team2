/// <reference types="vite/client" />
export type ProfilePicMap = Record<string, string>

// Eagerly import all images under src/assets/profile_pic
const pics = import.meta.glob<string>('/src/assets/profile_pic/*.{png,jpg,jpeg}', {
  eager: true,
  import: 'default'
}) as Record<string, string>

function normalizeKey(filePath: string): string {
  const file = filePath.split('/').pop() || ''
  const name = file.replace(/\.(png|jpe?g)$/i, '')
  return name.toLowerCase()
}

const map: ProfilePicMap = Object.fromEntries(
  Object.entries(pics).map(([path, url]) => [normalizeKey(path), url])
)

const defaultKey = 'default'

export function getPic(key?: string): string {
  if (!key) return map[defaultKey] ?? ''
  const k = key.toLowerCase()
  return map[k] || map[defaultKey] || ''
}

export const profilePics: ProfilePicMap = map 