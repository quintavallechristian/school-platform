import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PrivacyPolicyContent } from './PrivacyPolicyContent'

export function PrivacyPolicyModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-4">
          <PrivacyPolicyContent />
        </div>
      </DialogContent>
    </Dialog>
  )
}
