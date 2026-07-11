import type { Resource } from '../schemes'

export function arraysEqual(arr1: string[], arr2: string[]) {
  if (arr1.length !== arr2.length) return false
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false
  }
  return true
}

export function checkResourceProgress(resource: Resource) {
  if (!resource.basicInfo.email) return 0
  if (resource.basicInfo.email && !resource.projectDetails.projectName) return 1
  return 2
}
