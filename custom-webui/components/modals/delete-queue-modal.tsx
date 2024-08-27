"use client"

import { useState } from 'react'
import axios from 'axios'
import { useModal } from '@/hooks/useModal'
import { useToast } from '../ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'

export default function DeleteQueueModal() {
  const [loading, setLoading] = useState(false)
  const { isOpen, type, onClose, data } = useModal()
  const { toast } = useToast()

  const isModalOpen = isOpen && type === "deleteQueue"

  const handleDelete = async () => {
    if (!data) return

    setLoading(true)
    try {
      await axios.delete(`/api/queue?name=${data.name}&partitionName=${data.partitionName}`)
      toast({
        title: `Queue ${data.name} deleted successfully`,
        description: "The queue has been removed from the configuration. If UI not changed, reload",
      })
    } catch (error) {
      toast({
        title: `Error deleting ${data.name}`,
        description: "Please check the configuration and try again.",
      })
    } finally {
      setLoading(false)
      onClose()
      window.location.reload()
    }
  }

  if (!data) return null

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete {data.name}?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="destructive"
            disabled={loading}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}