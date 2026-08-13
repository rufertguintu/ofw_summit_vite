import { twMerge } from "tailwind-merge"

type ClassValue = string | undefined | null | boolean | Record<string, boolean>

export function cn(...inputs: ClassValue[]) {
  return twMerge(
    inputs
      .flat()
      .map(input => {
        if (typeof input === 'string') return input
        if (typeof input === 'object' && input !== null) {
          return Object.entries(input)
            .filter(([_, value]) => value)
            .map(([key]) => key)
            .join(' ')
        }
        return ''
      })
      .filter(Boolean)
      .join(' ')
  )
}
