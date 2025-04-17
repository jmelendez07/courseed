import CategoryInterface from "./category";

interface ProfileInterface {
    id: string;
    knowledgeLevel: string;
    availableHoursTime: number;
    platformPrefered: string;
    budget: number;
    createdAt: string;
    updatedAt: string;
    interest: CategoryInterface[];
}

export default ProfileInterface;