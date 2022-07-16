import { atom } from "recoil";
import { Timestamp } from "firebase/firestore";

export interface Community {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: "public" | "restrictied" | "private";
  createdAt?: Timestamp;
  imageURL?: string;
}
export interface CommunitySnippet {
    communityId: string;
    isModerator?: boolean;
    imageURL?: string;
}
interface CommunitySate{
    mySnippets: CommunitySnippet[];
    currentCommunity?: Community;
    snippetsFetched: boolean,
}

const defaultCommunityState: CommunitySate = {
    mySnippets: [],
    snippetsFetched: false,
};

export const communityState = atom<CommunitySate> ({
    key: "communitiesState",
    default: defaultCommunityState,
});
