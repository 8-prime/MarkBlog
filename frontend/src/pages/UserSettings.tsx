import { useEffect } from "react"
import { useBlogStore } from "../state/Store"
import ImageUploader from "../components/ImageUploader"
import { BasicButton } from "../components/BasicButton"

export const UserSettings = () => {
    const userSettings = useBlogStore((store) => store.userSettings)
    const fetchUserSettings = useBlogStore((store) => store.fetchUserInfo)
    const updateUserInfo = useBlogStore((store) => store.updateLocalUserInfo)
    const saveUserInfo = useBlogStore((store) => store.saveUserInfo)

    useEffect(() => {
        fetchUserSettings();
    }, [])

    const changeUserName = (newName: string) => {
        updateUserInfo({
            ...userSettings!,
            name: newName
        })
    }

    const changeDescription = (newDesc: string) => {
        updateUserInfo({
            ...userSettings!,
            description: newDesc
        })
    }

    const handleImageUpdate = (newImageUrl: string) => {
        updateUserInfo({
            ...userSettings!,
            imageUrl: newImageUrl
        })
    }


    return (
        <div className="col-span-9 space-y-6">
            <div className="flex flex-row justify-end items-center">
                <BasicButton onClick={() => saveUserInfo()}>
                    Save
                </BasicButton>
            </div>
            <label htmlFor="name">Name:</label>
            <input onChange={(e) => changeUserName(e.target.value)} type="text" id="name" className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500" />
            <label htmlFor="name">Description:</label>
            <input onChange={(e) => changeDescription(e.target.value)} type="text" id="description" className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500" />
            <div>
                {
                    userSettings?.imageUrl &&
                    <img src={userSettings?.imageUrl} alt="Article title" />
                }
                <ImageUploader onSelected={handleImageUpdate} />
            </div>
        </div>
    )
}