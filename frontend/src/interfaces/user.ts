interface UserInterface {
    id: string | null | undefined;
    email: string;
    roles?: string[];
    academicLevel?: string;
    sex?: string;
    birthdate?: string;
    createdAt?: string;
    updatedAt?: string;
    reviews?: number;
    views?: number;
}

export default UserInterface;