import { useState } from "react";

export interface Person {
    name: string;
}

export const Person = (props:Person) => {

    const [personBio, setPersonBio] = useState<string | null>(null);

    const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {

        setPersonBio(event.target.value);
    }

    return (
        <div>
            <p>
                {" "}
                {props.name} Bio: {!personBio ? "No Bio Available" : personBio}
            </p>
            <input onChange={handleChange} />
        </div>
    );

};
