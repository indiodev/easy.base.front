

type ContainerProps = {
    children?: any,
    className?: any,
}

export function Container({ children, className }: ContainerProps) {
    return (
        <div className={`bg-white rounded-xl shadow-sm p-4 ${className}`}>
            {children}
        </div>
    )
}