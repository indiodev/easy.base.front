type TitleProps = {
    children?: any,
    className?: any,
}

export function Title({ children, className }: TitleProps) {
    return (
        <h3 className={`text-2xl border-b-2 border-gray-100 mb-2 font-medium ${className}`}>
            <span className="border-b-2 border-blue-500 px-1 pb-0.5">
                {children}
            </span>
        </h3>
    )
}