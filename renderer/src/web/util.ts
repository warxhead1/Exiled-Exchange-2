import { DateTime } from 'luxon'

export function fmtTime(millis: number): string {
  return DateTime.fromMillis(millis).toRelative({ style: 'long' }) ?? 'n/a'
} 