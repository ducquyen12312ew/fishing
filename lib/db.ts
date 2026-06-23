export function getFishImage(amount: number): string {
  if (amount <= 50) return 'fish1.png'
  if (amount <= 70) return 'fish2.png'
  if (amount <= 100) return Math.random() < 0.5 ? 'fish3.png' : 'fish4.png'
  if (amount <= 120) return 'fish5.png'
  if (amount <= 150) return 'fish6.png'
  if (amount <= 175) return 'fish7.png'
  return 'fish8.png'
}
