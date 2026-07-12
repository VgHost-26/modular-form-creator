import { useUpdateProvisioning } from '../../api'
import { Button } from '../../design-system'
import type { Resource } from '../../schemes'
import { checkResourceProgress } from '../../utils/helpers'

type Props = {
  resource: Resource
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ProvisionButton = ({ resource, onClick, ...props }: Props) => {
  const updateProvisioning = useUpdateProvisioning()
  const handleProvisionResource = (resourceId: number) => {
    updateProvisioning.mutate(resourceId)
  }
  return (
    <Button
      type="button"
      {...props}
      title={
        resource.status === 'completed'
          ? 'Provisioning already completed'
          : checkResourceProgress(resource) < 2
            ? 'Complete all modules before provisioning'
            : ''
      }
      state={
        resource.status === 'completed'
          ? 'locked'
          : checkResourceProgress(resource) < 2
            ? 'disabled'
            : 'normal'
      }
      onClick={(e) => {
        handleProvisionResource(resource.resourceId)

        if (onClick) {
          onClick(e)
        }
      }}
    >
      Provision
    </Button>
  )
}

export default ProvisionButton
