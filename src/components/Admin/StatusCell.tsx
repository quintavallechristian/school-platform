'use client'

import React from 'react'

interface StatusCellProps {
  cellData: 'pending' | 'approved' | 'rejected'
}

export const StatusCell: React.FC<StatusCellProps> = ({ cellData }) => {
  const getStatusStyle = () => {
    switch (cellData) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusLabel = () => {
    switch (cellData) {
      case 'pending':
        return 'In attesa'
      case 'approved':
        return 'Approvato'
      case 'rejected':
        return 'Rifiutato'
      default:
        return cellData
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle()}`}>
      {getStatusLabel()}
    </span>
  )
}
