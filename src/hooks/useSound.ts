import { useSyncExternalStore } from 'react'
import { soundStore } from '../lib/audio'

export const useSound = () => useSyncExternalStore(soundStore.subscribe, soundStore.get, soundStore.get)
