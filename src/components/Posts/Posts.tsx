import { Stack } from '@chakra-ui/react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Community } from '../../atoms/communitiesAtom';
import { Post } from '../../atoms/postsAtom';
import { auth, firestore } from '../../firebase/clientApp';
import usePosts from '../../hooks/usePosts';
import PostItem from './PostItem';
import PostLoader from './PostLoader';
import TabItem from './TabItem';

type PostsProps = {
    communityData: Community
    
};

const Posts:React.FC<PostsProps> = ({ communityData }) => {
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    const {postStateValue, setPostStateValue, onDeletePost, onVote, onSelectPost } = usePosts();

    const getPosts = async () => {
        try {
            setLoading(true);
            //get posts for this community
            const postsQuery = query(collection(firestore, "posts"), where("communityId", '==', communityData.id), orderBy("createdAt", "desc"));
            const postDocs = await getDocs(postsQuery);
            // store in post state
            const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setPostStateValue((prev) => ({
                ...prev,
                posts: posts as Post[],
                
            }));
            console.log('posts', posts);
            
        } catch (error: any) {
            console.log("getPosts error", error.message);
            
        }
        setLoading(false);

    };

    useEffect( () => {
        getPosts();
    }, [communityData]);
    
    return (
        <>
        {loading ? (
            <PostLoader />
        ):(
            <Stack>
                {postStateValue.posts.map((item) => (
                <PostItem
                  key={item.id}
                  post={item}
                  onVote={onVote}
                  onDeletePost={onDeletePost}
                  userVoteValue={postStateValue.postVotes.find((vote) => vote.postId === item.id)?.voteValue}
                  userIsCreator={user?.uid === item.creatorId}
                  onSelectPost={onSelectPost}
                />
                ))}

            </Stack>

        )}
            
        </>
    );
};
export default Posts;