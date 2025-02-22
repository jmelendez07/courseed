interface UserInterface {
    id: string | null | undefined;
    email: string;
    roles?: string[];
    createdAt?: string;
    updatedAt?: string;
    likes?: number;
    reviews?: number;
}

export default UserInterface;