type BatmanProps = { // object prop
    name: {
        first: string
        last: string
    }
}

export const Batman = (props: BatmanProps) => { // props anc specify type -> BatmanProps
    return (
        <div>
            {props.name.first} {props.name.last}
        </div>
    )
}