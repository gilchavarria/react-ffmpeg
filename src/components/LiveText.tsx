type LiveTextProps = {
    name: string
}

export const LiveText = (props: LiveTextProps) => {
    return (
        <div>
            <h2>Welcome {props.name}! You have 10 unread messages</h2>
        </div>
    )
}