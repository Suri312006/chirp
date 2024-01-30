
import Head from "next/head";
import type { GetStaticProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import type { NextPage } from "next";
import { PageLayout } from "~/components/customLayout";
import { api } from "~/utils/api";
import PostView from "~/components/postview";
dayjs.extend(relativeTime)

const SinglePostPage:NextPage<{id: string}> = ({id }) => {
  const {data} = api.post.getById.useQuery({postId: id})

if (!data) {
    return <div> 404 </div>
  
}

  return (
    <>
      <Head>
        <title>
          {/* should show post name lmao*/}
        {  `Chirp - ${data.post.content} - @${data.author.username}`}
        </title>
      </Head>
      <PageLayout> 
        <PostView {...data} />
      </PageLayout>
    </>
  );
}
export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper() 
  const id = context.params?.id;

  if (typeof id !== "string") {
    throw new Error("no slug")
  }
  await ssg.post.getById.prefetch({  postId: id})

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id
    }
  }
}

export const getStaticPaths = () => {

  return { paths: [], fallback: "blocking" }
}
export default SinglePostPage;
