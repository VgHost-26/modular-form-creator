import {
  useMutation,
  useQuery,
  type UseMutationResult,
  type UseQueryResult,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  ResourceListResponse,
  ErrorResponse,
  Resource,
  ProvisioningResponse,
  CreateResourceInput,
} from '../schemes'
import axios, { AxiosError } from 'axios'
import type {
  GetResourcesParams,
  UpdateResourceBasicInfoParams,
  UpdateResourceParams,
  UpdateResourceProjectDetailsParams,
} from '../schemes/params'
import { toast } from 'react-toastify'

export const useGetResources = (
  params: GetResourcesParams,
): UseQueryResult<ResourceListResponse, AxiosError<ErrorResponse>> => {
  return useQuery({
    queryKey: ['resourcesList', params],
    queryFn: async ({ signal }) => {
      const { data } = await axios.get<ResourceListResponse>('/api/resources', {
        params,
        signal,
      })
      return data
    },
  })
}

export const useGetResourceById = (
  resourceId: string | number,
): UseQueryResult<Resource, AxiosError<ErrorResponse>> => {
  return useQuery({
    queryKey: ['resource', resourceId],
    queryFn: async () => {
      const { data } = await axios.get<Resource>(`/api/resources/${resourceId}`)
      return data
    },
  })
}

export const useCreateResource = (): UseMutationResult<
  Resource,
  AxiosError<ErrorResponse>,
  CreateResourceInput
> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['resources'],
    mutationFn: async (params: CreateResourceInput) => {
      const { data } = await axios.post<Resource>('/api/resources', params)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resourcesList'] })
      toast.success('Resource created successfully.')
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || 'An error occurred while creating the resource.'
      toast.error(`Failed to create resource. ${errorMessage}`)
    },
  })
}

// Avaiable only when resource is completed
export const useUpdateResource = (): UseMutationResult<
  Resource,
  AxiosError<ErrorResponse>,
  UpdateResourceParams
> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateResource'],
    mutationFn: async (params: UpdateResourceParams) => {
      const { data } = await axios.put<Resource>(
        `/api/resources/${params.resourceId}`,
        params,
      )
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resource', variables.resourceId] })
      toast.success('Resource updated successfully.')
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || 'An error occurred while updating the resource.'
      toast.error(`Failed to update resource, ${errorMessage}`)
    },
  })
}

export const useDeleteResource = (): UseMutationResult<
  Resource,
  AxiosError<ErrorResponse>,
  number
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['deleteResources'],
    mutationFn: async (resourceId: number) => {
      const { data } = await axios.delete<Resource>(`/api/resources/${resourceId}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resourcesList'] })
      toast.success('Resource deleted successfully.')
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || 'An error occurred while deleting the resource.'
      toast.error(`Failed to delete resource. ${errorMessage}`)
    },
  })
}

// Avaiable only when resource is NOT completed
export const useUpdateResourceBasicInfo = (): UseMutationResult<
  Resource,
  AxiosError<ErrorResponse>,
  UpdateResourceBasicInfoParams
> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateResourceBasicInfo'],
    mutationFn: async ({ resourceId, basicInfo }: UpdateResourceBasicInfoParams) => {
      const { data } = await axios.patch<Resource>(
        `/api/resources/${resourceId}/basic-info`,
        basicInfo,
      )
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resource', variables.resourceId] })
      toast.success('Resource basic info updated successfully.')
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || 'An error occurred while updating the resource.'
      toast.error(`Failed to update resource, ${errorMessage}`)
    },
  })
}

// Avaiable only when resource is NOT completed
export const useUpdateResourceProjectDetails = (): UseMutationResult<
  Resource,
  AxiosError<ErrorResponse>,
  UpdateResourceProjectDetailsParams
> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateResourceProjectDetails'],
    mutationFn: async ({
      resourceId,
      projectDetails,
    }: UpdateResourceProjectDetailsParams) => {
      const { data } = await axios.patch<Resource>(
        `/api/resources/${resourceId}/project-details`,
        projectDetails,
      )
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resource', variables.resourceId] })
      toast.success('Resource project details updated successfully.')
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || 'An error occurred while updating the resource.'
      toast.error(`Failed to update resource, ${errorMessage}`)
    },
  })
}
export const useUpdateProvisioning = (): UseMutationResult<
  ProvisioningResponse,
  AxiosError<ErrorResponse>,
  number
> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['provisoning'],
    mutationFn: async (resourceId: number) => {
      const { data } = await axios.patch<ProvisioningResponse>(
        `/api/resources/${resourceId}/provisioning`,
      )
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resourcesList'] })
      queryClient.invalidateQueries({ queryKey: ['resource', variables] })
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || 'An error occurred while updating the resource.'
      toast.error(`Failed to update resource, ${errorMessage}`)
    },
  })
}
