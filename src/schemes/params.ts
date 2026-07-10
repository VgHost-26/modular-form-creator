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
  id: string
  basicInfo: BasicInfo
}
export interface UpdateResourceProjectDetailsParams {
  id: string
  projectDetails: ProjectDetails
}
 