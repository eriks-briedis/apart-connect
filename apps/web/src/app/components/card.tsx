export interface CardProps {
  icon?: JSX.Element;
  title: JSX.Element | string;
  description?: string;
}

export function Card({ icon, title, description }: CardProps) {
  return (
    <div className="shadow rounded-md hover:bg-gray-100 h-full">
      <div className="w-100 h-40 bg-gray-300 rounded-t-md flex justify-center items-center">
        {icon}
      </div> {/* TODO: add image */}
      <div className="p-2">
        <h2 className="text-xl font-semibold">
          {title}
        </h2>
        {!!description && <p className="text-gray-500">{description}</p>}
      </div>
    </div>
  )
}
