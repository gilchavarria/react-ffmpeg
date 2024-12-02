type GreetProps = { // type keyword is equal to an object -> GreetProps
    name: string // key - name and data type - string
    messageCount: number // key - messageCount and data type - number
    isLoggedIn: boolean // key - isLoggedIn and data type - boolean
}

export const ChildComponent = (props: GreetProps) => {
    return (
        <div>
            <h2>
                {
                    props.isLoggedIn ? `Welcome ${props.name}! You have ${props.messageCount} unread messages` : 'Welcome Guest'
                }
                
                
                
            </h2>
        </div>
    )
}