import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '~/types';

interface PostsState {
    isDescending: boolean;
    posts: Post[];
    page: number;
    loading: boolean;
    hasMore: boolean;
}

const initialState: PostsState = {
    isDescending: true,
    posts: [],
    page: 0,
    loading: false,
    hasMore: true,
};
  

const postsSlice = createSlice({
  name: 'POST_ORDERING',
  initialState,
  reducers: {
    setIsDescending(state, action: PayloadAction<boolean>) {
      state.isDescending = action.payload;
    },
    setPosts(state, action: PayloadAction<Post[]>) {
      state.posts = action.payload;
    },
    addPosts(state, action: PayloadAction<Post[]>) {
      state.posts.push(...action.payload);
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setHasMore(state, action: PayloadAction<boolean>) {
      state.hasMore = action.payload;
    },
  },
});

export const { setIsDescending, setPosts, addPosts, setPage, setLoading, setHasMore } = postsSlice.actions;
export default postsSlice.reducer;