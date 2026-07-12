import type { BasicInfo, ProjectDetails, Resource } from '../schemes'

export function arraysEqual(arr1: string[], arr2: string[]) {
  if (arr1.length !== arr2.length) return false
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false
  }
  return true
}

export function isBasicInfoComplete(basicInfo: BasicInfo) {
  return (
    basicInfo.resourceName &&
    basicInfo.owner &&
    basicInfo.email &&
    basicInfo.description &&
    basicInfo.priority
  )
}

export function isProjectDetailsComplete(projectDetails: ProjectDetails) {
  return (
    projectDetails.projectName &&
    projectDetails.budget &&
    projectDetails.category &&
    projectDetails.options.length > 0
  )
}

export function checkResourceProgress(resource: Resource) {
  if (!isBasicInfoComplete(resource.basicInfo)) return 0
  if (
    isBasicInfoComplete(resource.basicInfo) &&
    !isProjectDetailsComplete(resource.projectDetails)
  )
    return 1
  return 2
}
