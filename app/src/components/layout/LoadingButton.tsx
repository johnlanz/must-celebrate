'use client'

import React from 'react'

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether the button is in its “loading” (in-flight) state */
  loading?: boolean
  /** Text to show when loading; if omitted, falls back to `children` */
  loadingText?: React.ReactNode
}

export default function LoadingButton({
  loading = false,
  loadingText,
  disabled,
  children,
  className = '',
  ...props
}: LoadingButtonProps) {
  // Combine any passed-in className with our defaults and a disabled style
  const baseClasses =
    'flex items-center justify-center bg-[#67a626] text-white py-2 px-4 rounded-md hover:bg-[#684CC4] transition'
  const disabledClasses = 'opacity-75 cursor-not-allowed'
  const combinedClasses = `${baseClasses} ${className} ${
    loading || disabled ? disabledClasses : ''
  }`

  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={combinedClasses}
    >
      {loading ? (
        <>
          {/* Spinner SVG */}
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>

          <span className="ml-2">
            {loadingText != null ? loadingText : children}
          </span>
        </>
      ) : (
        children
      )}
    </button>
  )
}