import type { BasicInfo, ProjectDetails, Resource } from '.'

export interface GetResourcesParams {
  page: number
  pageSize: number
  status?: 'draft' | 'completed'
  name?: string
  sortOrder: 'desc' | 'asc'
}

export type UpdateResourceParams = Resource
export interface UpdateResourceBasicInfoParams {
  resourceId: number
  basicInfo: BasicInfo
}
export interface UpdateResourceProjectDetailsParams {
  resourceId: number
  projectDetails: ProjectDetails
}
 