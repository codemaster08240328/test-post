import { useMemo, useState } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Input, Typography, Card, Pagination  } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { debounce } from '../helpers/util';

type TPost = {
  title: string;
  body: string;
  author: string;
}

type PropTypes = {
  posts: Array<TPost>;
  error: string;
};

const Home: NextPage<PropTypes> = ({ posts, error }) => {
  const [showSize, setShowSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');

  const filteredPosts = useMemo(() => {
    if (search) {
      return posts.filter(item => item.title.includes(search));
    }

    return posts
  }, [search, posts])

  const visiblePosts = useMemo(() => {
    return filteredPosts.reduce((acc: TPost[], item: TPost, index: number) => {
      if (index >= (currentPage - 1) * showSize && index < currentPage * showSize) {
        acc.push(item);
      }

      return acc;
    }, []);
  }, [showSize, currentPage, filteredPosts]);

  const handleSearch = debounce((v: string) => {
    setSearch(v);
  }, 500);

  return (
    <div className={styles.container}>
      <Head>
        <title>Posts</title>
        <meta name="body" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Typography.Title level={2} className={styles.title}>
          Posts
        </Typography.Title>
        <Input
          size="large"
          placeholder='Search Post by title'
          prefix={<SearchOutlined />}
          onChange={e => handleSearch(e.currentTarget.value)}
        />
        <div>
          <div className={styles.post_container}>
            {
              visiblePosts.map((item, index: number) => 
                <Card title={item.title} key={item.title + index.toString()}>
                  {item.body}
                  <br /><br />
                  <span className={styles.author}>
                    {item.author}
                  </span>
                </Card>
                )
            }
          </div>
          <div className={styles.pagination}> 
            <Pagination
              defaultCurrent={1}
              total={filteredPosts.length}
              onShowSizeChange={(_cur, size) => setShowSize(size)}
              onChange={v => setCurrentPage(v)}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export async function getStaticProps(_context: any) {
  let result: Array<TPost>;
  let error = '';
  try {
    const posts = await fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json());
    const users = await fetch('https://jsonplaceholder.typicode.com/users').then(res => res.json());
    
    result = posts.map((item: any) => {
      const post: TPost = {
        title: item.title,
        body: item.body,
        author: ''
      };

      const user = users.find((user_item: any) => user_item.id === item.userId);
      post.author = `${user.name}, ${user.username}`;

      return post;
    });
  } catch (e) {
    console.error(e)
    result = [];
    error = 'Server Error'
  }

  return {
    props: {
      posts: result,
      error
    }
  }
}

export default Home
