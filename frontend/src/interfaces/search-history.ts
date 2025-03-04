import UserInterface from "./user";

interface SearchHistoryInterface {
    id: string;
    search: string;
    user: UserInterface;
    createdAt: string;
}

export default SearchHistoryInterface;