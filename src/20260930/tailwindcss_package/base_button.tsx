import { useState } from "react";

export default function BaseButton() {
    const [count, setCount] = useState<number>(0);
    const handleClick = () => {
        setCount(count + 1);
    }

    return (
        <button className="bg-blue-500 text-white p-2 rounded-md" onClick={handleClick}>
            Base Button
            {count} clicks
        </button>
    )
}