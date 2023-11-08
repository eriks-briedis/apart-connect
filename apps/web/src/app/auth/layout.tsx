export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden border-t border-l border-r border-gray-400 px-3 py-10 bg-gray-200 flex justify-center items-center bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-green-300 via-blue-500 to-purple-600">
      <div className="w-full max-w-md bg-white shadow-lg rounded-md px-8 pt-6 pb-8 mb-4">
        <div className="text-4xl font-bold mb-6 text-center">
          <span className="text-purple-600">Apart</span>
          <span className="font-medium text-blue-500">Connect</span>
        </div>
        {children}
      </div>
    </div>
  )
}
