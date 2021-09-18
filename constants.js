export const milestones = [0, 1, 2, 3, 4, 5]

export const milestoneToPoints = (milestone) => {
  switch (milestone) {
    case 0: return 0
    case 1: return 1
    case 2: return 3
    case 3: return 6
    case 4: return 12
    case 5: return 20
    default: return 0
  }
}
