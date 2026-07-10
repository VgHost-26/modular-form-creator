import {
  useMutation,
  useQuery,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query'
import type {
  ResourceListResponse,
  ErrorResponse,
  Resource,
  ProvisioningResponse,
  CreateResourceInput,
} from '../schemes'
import axios from 'axios'
import type {
  GetResourcesParams,
  UpdateResourceBasicInfoParams,
  UpdateResourceParams,
  UpdateResourceProjectDetailsParams,
} from '../schemes/params'

export const useGetResources = (
  params: GetResourcesParams,
): UseQueryResult<ResourceListResponse, ErrorResponse> => {
  return useQuery({
    queryKey: ['resources', params],
    queryFn: async () => {
      const { data } = await axios.get<ResourceListResponse>('/api/resources', { params })
      return data
    },
  })
}

export const useGetResourceById = (
  resourceId: number,
): UseQueryResult<ResourceListResponse, ErrorResponse> => {
  return useQuery({
    queryKey: ['resources', resourceId],
    queryFn: async () => {
      const { data } = await axios.get<ResourceListResponse>(
        `/api/resources/${resourceId}`,
      )
      return data
    },
  })
}

export const useCreateResources = (
  params: CreateResourceInput,
): UseMutationResult<Resource, ErrorResponse> => {
  return useMutation({
    mutationKey: ['resources'],
    mutationFn: async () => {
      const { data } = await axios.post<Resource>('/api/resources', params)
      return data
    },
  })
}

export const useUpdateResource = (
  params: UpdateResourceParams,
): UseMutationResult<Resource, ErrorResponse> => {
  return useMutation({
    mutationKey: ['resources', params._id],
    mutationFn: async () => {
      const { data } = await axios.put<Resource>(`/api/resources/${params._id}`, params)
      return data
    },
  })
}

export const useDeleteResource = (
  resourceId: number,
): UseMutationResult<Resource, ErrorResponse> => {
  return useMutation({
    mutationKey: ['resources', resourceId],
    mutationFn: async () => {
      const { data } = await axios.delete<Resource>(`/api/resources/${resourceId}`)
      return data
    },
  })
}

export const useUpdateResourceBasicInfo = ({
  id,
  basicInfo,
}: UpdateResourceBasicInfoParams): UseMutationResult<Resource, ErrorResponse> => {
  return useMutation({
    mutationKey: ['resources', id, 'basicInfo'],
    mutationFn: async () => {
      const { data } = await axios.put<Resource>(
        `/api/resources/${id}/basic-info`,
        basicInfo,
      )
      return data
    },
  })
}
export const useUpdateResourceProjectDetails = ({
  id,
  projectDetails,
}: UpdateResourceProjectDetailsParams): UseMutationResult<Resource, ErrorResponse> => {
  return useMutation({
    mutationKey: ['resources', id, 'projectDetails'],
    mutationFn: async () => {
      const { data } = await axios.put<Resource>(
        `/api/resources/${id}/project-details`,
        projectDetails,
      )
      return data
    },
  })
}
export const useUpdateProvisioning = (
  resourceId: number,
): UseMutationResult<ProvisioningResponse, ErrorResponse> => {
  return useMutation({
    mutationKey: ['resources', resourceId, 'provisioning'],
    mutationFn: async () => {
      const { data } = await axios.post<ProvisioningResponse>(
        `/api/resources/${resourceId}/provisioning`,
      )
      return data
    },
  })
}
