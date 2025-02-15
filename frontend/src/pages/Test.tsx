import { useState } from "react";
import { useBearStore } from "../state/AuthStore";
import { ArrowArcLeft } from "phosphor-react";

const Test = (): JSX.Element => {
    const [input, setInput] = useState<number>(0);
    const bears = useBearStore((store) => store.bears)
    const addBear = useBearStore((store) => store.addABear)
    const setBear = useBearStore((store) => store.setBear)
    const reset = useBearStore((store) => store.reset)

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center gap-4 bg-neutral-700">
            <div className="flex flex-col bg-neutral-600 p-10 rounded-lg shadow-lg gap-3">
                <input value={input} onChange={e => setInput(+e.target.value)} type="number" className="bg-neutral-800 text-white rounded-lg p-3" />
                <button onClick={() => setBear(input)} className="cursor-pointer active:bg-gray-800 rounded-md bg-neutral-800 text-neutral-50 px-4 py-2 hover:bg-neutral-950 shadow-lg">Add {input} bears</button>
            </div>

            <button onClick={() => addBear()} className="cursor-pointer active:bg-gray-800 rounded-md bg-neutral-800 text-neutral-50 px-4 py-2 hover:bg-neutral-950 shadow-lg">Add Bears</button>
            <p className="text-neutral-50">🐻 You currently have {bears} bears.</p>

            <button onClick={reset} className="cursor-pointer flex flex-row gap-2 bg-neutral-800 px-4 py-2 rounded-lg text-white shadow-2xl">
                <ArrowArcLeft color="white" size={24} /> Reset
            </button>

        </div>
    );
}

export default Test;