import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { User, Post, Comment } from '~/types';

const openDb = async () => {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
};

export const getUserByUsername = async (username: string): Promise<User | undefined> => {
  const db = await openDb();
  return db.get('SELECT * FROM users WHERE username = ?', [username]);
};

export const addUser = async (username: string, password: string): Promise<User> => {
  const db = await openDb();
  const result = await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);

  return {
    id: result.lastID?.toString() ?? '',
    username,
    password
  }
};

export const getPosts = async (offset: number = 0, limit: number = 10): Promise<Post[]> => {
  const db = await openDb();
  return db.all('SELECT * FROM posts LIMIT ? OFFSET ?', [limit, offset]);
};

export const createPost = async (title: string, content: string): Promise<Post> => {
  const db = await openDb();
  const result = await db.run('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content]);

  const post = await db.get('SELECT * FROM posts WHERE id = ?', [result.lastID]);
  
  return {
    id: post.id.toString(),
    title: post.title,
    content: post.content,
    created_at: post.created_at,
  };
};

export const getComments = async (postId: string): Promise<Comment[]> => {
  const db = await openDb();
  return db.all('SELECT * FROM comments WHERE postId = ?', [postId]);
};

export const createComment = async (content: string, postId: string, userId: string): Promise<Comment> => {
  const db = await openDb();
  const result = await db.run('INSERT INTO comments (content, postId, userId) VALUES (?, ?, ?)', [content, postId, userId]);

  return {
    id: result.lastID?.toString() ?? '',
    postId: postId,
    userId: userId,
    content
  }
};

export const deleteComment = async (commentId: string): Promise<void> => {
  try {
    const numericCommentId = parseInt(commentId, 10);
    const db = await openDb();
    console.log(`Deleting comment with ID: ${numericCommentId}`);
    const result = await db.run('DELETE FROM comments WHERE id = ?', [numericCommentId]);
    if (result.changes === 0) {
      console.warn(`No rows affected. Comment ID ${numericCommentId} might not exist.`);
    } else {
      console.log(`Successfully deleted comment with ID: ${numericCommentId}`);
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error; // Propaga o erro para o handler de API
  }
};
