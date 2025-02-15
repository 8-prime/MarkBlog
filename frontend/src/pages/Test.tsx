import { useState } from "react";
import { useBearStore } from "../state/AuthStore";
import { ArrowArcLeft } from "phosphor-react";
import { DeleteButton } from "../components/DeleteButton";

const Test = (): JSX.Element => {
    const [input, setInput] = useState<number>(0);
    const bears = useBearStore((store) => store.bears)
    const addBear = useBearStore((store) => store.addABear)
    const setBear = useBearStore((store) => store.setBear)
    const reset = useBearStore((store) => store.reset)

    const onDelete = () => {
        console.log("hi");
    }

    return (
        <div>hi</div>
    );
}

export default Test;