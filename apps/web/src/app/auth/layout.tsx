export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen rounded-t-lg overflow-hidden border-t border-l border-r border-gray-400 px-3 py-10 bg-gray-200 flex justify-center items-center bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-green-300 via-blue-500 to-purple-600">
      <div className="w-full max-w-md bg-white shadow-lg rounded-md px-8 pt-6 pb-8 mb-4">
        {children}
      </div>
    </div>
  )
}
