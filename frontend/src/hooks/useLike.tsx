import APIS from "@/enums/apis";
import LikeInterface from "@/interfaces/like";
import axios from "axios";

function useLike() {
    const handleCreateLike = async (courseId: String): Promise<LikeInterface | null> => {
        try {
            const response = await axios.post(APIS.LIKE_CREATE, { courseId: courseId });
            return response.data;
        } catch (error) {
            return null;
        }
    }

    const handleDeleteLike = async (id: String): Promise<boolean> => {
        try {
            await axios.delete(APIS.LIKE_DELETE + id);
            return true;
        } catch (error) {
            return false;
        }
    }

    return {
        handleCreateLike,
        handleDeleteLike
    };
}

export default useLike;