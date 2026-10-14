import { useId, useRef, useState } from 'react'
import { UploadSimple, X, FileText } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { EmptyState } from './empty-state'
export function FileUpload({
  onChange,
  maxBytes = 5 * 1024 * 1024,
  label = 'Attach document',
  variant = 'dropzone',
  selectedName,
  accept = 'application/pdf,image/png,image/jpeg',
}: {
  onChange: (file: File | null) => void
  maxBytes?: number
  label?: string
  variant?: 'compact' | 'dropzone' | 'inline'
  selectedName?: string
  accept?: string
}) {
  const limit = `${Math.round(maxBytes / 1024 / 1024)} MB`,
    id = useId(),
    input = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null),
    [error, setError] = useState(''),
    [dragging, setDragging] = useState(false)
  const pick = (next: File | null) => {
    if (!next) return
    if (next.size > maxBytes || !accept.split(',').includes(next.type)) {
      setError(
        `Use ${accept.includes('application/pdf') ? 'PDF, PNG or JPG' : 'PNG or JPG'} up to ${limit}.`,
      )
      if (input.current) input.current.value = ''
      return
    }
    setError('')
    setFile(next)
    onChange(next)
  }
  const displayName = file?.name || selectedName
  const remove = () => {
    setFile(null)
    setError('')
    onChange(null)
    if (input.current) input.current.value = ''
  }
  return (
    <div
      className="ds-upload"
      data-variant={variant}
      data-dragging={dragging || undefined}
      onDragOver={
        variant !== 'compact'
          ? (e) => {
              e.preventDefault()
              setDragging(true)
            }
          : undefined
      }
      onDragLeave={() => setDragging(false)}
      onDrop={
        variant !== 'compact'
          ? (e) => {
              e.preventDefault()
              setDragging(false)
              pick(e.dataTransfer.files[0] ?? null)
            }
          : undefined
      }
    >
      {variant === 'compact' && (
        <label htmlFor={id} className="upload-label">
          {label}
        </label>
      )}
      <input
        tabIndex={variant !== 'compact' ? -1 : undefined}
        ref={input}
        id={id}
        type="file"
        className={variant !== 'compact' ? 'sr-only' : undefined}
        accept={accept}
        aria-label={label}
        aria-describedby={`${id}-help`}
        aria-invalid={!!error}
        onChange={(e) => pick(e.target.files?.[0] ?? null)}
      />
      {variant === 'inline' ? (
        <div className="upload-inline">
          <div>
            <strong className="type-ui">{displayName || label}</strong>
            <p className="type-caption">
              {displayName
                ? 'Document selected.'
                : 'Drop a file here or select from your device.'}
            </p>
          </div>
          <div className="upload-actions">
            <Button
              variant="outline"
              size="sm"
              onClick={() => input.current?.click()}
            >
              {displayName ? 'Replace' : 'Select file'}
            </Button>
            {displayName && (
              <Button variant="ghost" size="sm" onClick={remove}>
                Remove
              </Button>
            )}
          </div>
        </div>
      ) : variant === 'dropzone' ? (
        <EmptyState
          title={displayName || label}
          description={
            displayName
              ? 'Document attached to this request.'
              : 'Drop the file here or select it from your device.'
          }
          icon={
            displayName ? <FileText size={24} /> : <UploadSimple size={24} />
          }
          action={
            <div className="upload-actions">
              <Button variant="outline" onClick={() => input.current?.click()}>
                {displayName ? 'Replace file' : 'Select file'}
              </Button>
              {displayName && (
                <Button variant="ghost" onClick={remove}>
                  <X size={16} />
                  Remove
                </Button>
              )}
            </div>
          }
        />
      ) : (
        file && (
          <div className="upload-file">
            <span>{file.name}</span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Remove attachment"
              onClick={remove}
            >
              <X size={16} />
            </Button>
          </div>
        )
      )}
      <p
        id={`${id}-help`}
        className="type-caption"
        role={error ? 'alert' : undefined}
      >
        {error || `PDF, PNG or JPG · up to ${limit} · file stays local.`}
      </p>
    </div>
  )
}
