import { GoogleLogin } from '@react-oauth/google'
import { Button } from '@/components/ui/button'

interface GoogleLoginButtonProps {
  onCredential: (credential: string) => void | Promise<void>
  onError?: () => void
  disabled?: boolean
  label: string
}

export default function GoogleLoginButton({
  onCredential,
  onError,
  disabled = false,
  label,
}: GoogleLoginButtonProps) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (!clientId) {
    return (
      <Button variant="outline" type="button" className="w-full" disabled>
        {label}
      </Button>
    )
  }

  return (
    <div className={disabled ? 'pointer-events-none opacity-50' : undefined}>
      <GoogleLogin
        onSuccess={(response) => {
          if (response.credential) void onCredential(response.credential)
          else onError?.()
        }}
        onError={onError}
        useOneTap={false}
        theme="outline"
        size="large"
        text="continue_with"
        width="100%"
      />
    </div>
  )
}
