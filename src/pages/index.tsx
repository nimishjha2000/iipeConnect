import { Stack } from "@chakra-ui/react";
import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import PageContent from '../components/Layout/PageContent'
import { auth, firestore } from "../firebase/clientApp";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import usePosts from '../hooks/usePosts';
import { useRecoilValue } from 'recoil';
import { communityState } from '../atoms/communitiesAtom';
import { Post, PostVote } from '../atoms/postsAtom';
import PostLoader from '../components/Posts/PostLoader';
import PostItem from "../components/Posts/PostItem";
import CreatePostLink from "../components/Community/CreatePostLink";
import useCommunityData from "../hooks/useCommunityData";
import Recommendations from "../components/Community/Recommendations";


const Home: NextPage = () => {

  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {setPostStateValue, postStateValue, onSelectPost, onDeletePost, onVote} = usePosts();
  //const communityStateValue = useRecoilValue(communityState);
  const { communityStateValue } = useCommunityData();
  
  const buildUserHomeFeed = async () => {
    setLoading(true);
    try {
      if (communityStateValue.mySnippets.length) {
        // get posts from users' communities
        const myCommunityIds = communityStateValue.mySnippets.map(
          (snippet) => snippet.communityId
        );
        const postQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", myCommunityIds),
          limit(10)
        );
        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPostStateValue((prev) => ({
          ...prev,
          posts: posts as Post[],
        }));
      } else {
        buildNoUserHomeFeed();
      }
    } catch (error) {
      console.log("buildUserHomeFeed error", error);
    }
    setLoading(false);
  };

  const buildNoUserHomeFeed = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(10)
      );

      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));

      // setPostState
    } catch (error) {
      console.log("buildNoUserHomeFeed error", error);
    }
    setLoading(false);
  };

  const getUserPostVotes = async() => {
    try {
      const postIds = postStateValue.posts.map((post) => post.id);
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("postId", "in", postIds)
      );
      const postVoteDocs = await getDocs(postVotesQuery);
      const postVotes = postVoteDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    } catch (error) {
      console.log("getUserPostVotes error", error);
    }
  };

  // useEffects
  useEffect(() => {
    if (communityStateValue.snippetsFetched) buildUserHomeFeed();
  }, [communityStateValue.snippetsFetched]);


  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed();
  }, [user, loadingUser]);

  useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes();

    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    };
  }, [user, postStateValue.posts]);




  return (
    <PageContent>

      <>
        <CreatePostLink />
        {/* PostFeed */}
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onSelectPost={onSelectPost}
                onDeletePost={onDeletePost}
                onVote={onVote}
                userVoteValue={
                  postStateValue.postVotes.find(
                    (item) => item.postId === post.id
                  )?.voteValue
                }
                userIsCreator={user?.uid === post.creatorId}
                homePage
              />
            ))}
          </Stack>
        )}

      </>

      <>
        {/* Reccomendation */}
        <Recommendations />
      </>

    </PageContent>
  );
}

export default Home
