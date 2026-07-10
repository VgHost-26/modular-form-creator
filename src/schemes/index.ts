export type ResourceStatus = 'draft' | 'completed';

export type Priority = 'low' | 'medium' | 'high';

export interface BasicInfo {
  resourceName: string;
  owner: string;
  email: string;
  description: string;
  priority: Priority;
}

export interface ProjectDetails {
  projectName: string;
  budget: string;
  category: string;
  options: string[];
}

export interface Resource {
  _id: string;
  resourceId: number;
  name: string;
  status: ResourceStatus;
  basicInfo: BasicInfo;
  projectDetails: ProjectDetails;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ResourceListResponse {
  items: Resource[];
  pagination: Pagination;
}

export interface CreateResourceInput {
  resourceName: string;
}

export interface ErrorResponse {
  message: string;
  details: Record<string, unknown>;
}

export type ProvisioningSuccessResponse = Resource;

export interface ProvisioningAlreadyCompletedResponse {
  message: string;
  resource: Resource;
}

export type ProvisioningResponse =
  | ProvisioningSuccessResponse
  | ProvisioningAlreadyCompletedResponse;