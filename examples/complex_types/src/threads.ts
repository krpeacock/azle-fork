import {
    Query,
    Update,
    nat32
} from 'azle';
import { Thread } from './candid_types';
import { getPostFromStatePost } from './posts';
import {
    state,
    StateThread,
    StateUser
} from './state';
import { getUserFromStateUser } from './users';

export function createThread(
    title: string,
    authorId: string,
    joinDepth: nat32
): Update<Thread> {
    const id = Object.keys(state.threads).length.toString();

    const stateThread = {
        id,
        authorId,
        postIds: [],
        title
    };
    const updatedStateAuthor = getUpdatedStateAuthor(authorId, stateThread.id);

    state.threads[id] = stateThread;
    state.users[authorId] = updatedStateAuthor;
    
    const thread = getThreadFromStateThread(stateThread, joinDepth);

    return thread;
}

export function getAllThreads(joinDepth: nat32): Query<Thread[]> {
    return Object
        .values(state.threads)
        .map((stateThread) => getThreadFromStateThread(stateThread, joinDepth));
}

export function getThreadFromStateThread(
    stateThread: StateThread,
    joinDepth: nat32
): Thread {
    const stateAuthor = state.users[stateThread.authorId];
    const author = getUserFromStateUser(stateAuthor, joinDepth);

    if (joinDepth === 0) {
        return {
            id: stateThread.id,
            author,
            posts: [],
            title: stateThread.title
        };
    }
    else {
        const posts = stateThread
            .postIds
            .map((postId) => state.posts[postId])
            .map((statePost) => getPostFromStatePost(statePost, joinDepth - 1));

        return {
            id: stateThread.id,
            author,
            posts,
            title: stateThread.title
        };
    }
}

function getUpdatedStateAuthor(authorId: string, threadId: string): StateUser {
    const stateAuthor = state.users[authorId];
    const updatedStateAuthor = {
        ...stateAuthor,
        threadIds: [...stateAuthor.threadIds, threadId]
    };

    return updatedStateAuthor;
}