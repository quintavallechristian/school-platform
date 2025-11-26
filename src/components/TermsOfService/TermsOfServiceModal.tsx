import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { TermsOfServiceContent } from './TermsOfServiceContent'

export function TermsOfServiceModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Termini e Condizioni</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-4">
          <TermsOfServiceContent />
        </div>
      </DialogContent>
    </Dialog>
  )
}
