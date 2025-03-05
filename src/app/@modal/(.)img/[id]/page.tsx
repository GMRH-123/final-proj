import { getImage } from "~/server/queries";
import { Modal } from "./modal";
import FullPageImageView from "~/app/components/full-image-page";

export default async function PhotoModal({
    params,
}: {
    params: {
        id: string;
    };
}) {
    const photoId = await params.id;
    const idAsNumber = Number(photoId);
    if (Number.isNaN(idAsNumber)) throw new Error("Invalid photo ID");
    const image = await getImage(idAsNumber);
    
    return (
    <Modal>
        {/* <img src={image.url} alt={image.name}
                className="w-96" /> */}
                <FullPageImageView id={idAsNumber} />
    </Modal>
    );
  
}
