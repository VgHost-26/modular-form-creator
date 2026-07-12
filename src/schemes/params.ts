import type { BasicInfo, ProjectDetails, Resource, ResourceStatus } from '.'

export interface GetResourcesParams {
  page: number
  pageSize: number
  status?: ResourceStatus
  name?: string
  sortOrder: 'desc' | 'asc'
}
export interface UpdateResourceBasicInfoParams {
  resourceId: number
  basicInfo: BasicInfo
}
export interface UpdateResourceProjectDetailsParams {
  resourceId: number
  projectDetails: ProjectDetails
}
export type UpdateResourceParams = Resource
