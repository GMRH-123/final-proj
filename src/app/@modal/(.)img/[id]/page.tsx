// src/app/@modal/(.)img\[id]/page.tsx

import { getImage } from "~/server/queries"
import { Modal } from "./modal"

export default async function PhotoModal({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const idAsNumber = Number(id)
    if (Number.isNaN(idAsNumber)) throw new Error("Invalid photo ID")
    const image = await getImage(idAsNumber)

    return (
        <Modal>
            <div className="flex flex-col overflow-hidden rounded-lg ">
                <div className="relative flex-1 overflow-hidden">
                    <div className="relative aspect-auto max-h-[80vh] w-full overflow-hidden">
                        <img src={image.url || "/placeholder.svg"} alt={image.name} className="h-full w-full " />
                    </div>
                </div>
                {image.caption && (
                    <div className="bg-background p-6 flex-col justify-between items-center w-full">
                        <p className="text-pretty text-lg rounded-lg bg-gray-100 py-2 px-3 w-full  text-gray-700 font-medium text-foreground">{image.caption}</p>
                        <p className="text-pretty  text-gray-600 italic font-medium text-foreground p-2 mt-2">
                            {`Uploaded: ${new Date(image.createdAt).toLocaleString()}`}
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    )
}

