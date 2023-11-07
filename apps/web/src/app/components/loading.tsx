import CircularProgress from '@mui/material/CircularProgress';

export function Loading() {
  return (
    <div className="flex items-center justify-center h-20">
      <CircularProgress />
    </div>
  )
}
