import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import 'react-quill/dist/quill.snow.css';

export function TextEditor({ value, onChange }: { value: string, onChange: (value: string) => void }) {
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), [])

  return (
    <ReactQuill theme="snow" value={value} onChange={onChange} />
  )
}
