import Head from "next/head";
import { createServerSideHelpers } from '@trpc/react-query/server';
import type {GetStaticProps,} from 'next';
import { db } from '~/server/db';
import { appRouter } from '~/server/api/root';
import superjson from 'superjson';
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { LoadingPage} from "~/components/loading";
dayjs.extend(relativeTime)
import type { NextPage } from "next";





export const ProfilePage: NextPage<{username: string}> = ({username}) => {

  const {data, isLoading} = api.profile.getUserByUsername.useQuery({
    username
  })

  if (isLoading) return <LoadingPage />

  if (!data) return <div> 404 </div>


  return (
    <>
      <Head>
        <title>
          Chirp - {username}
        </title>
      </Head>

      <main className="flex justify-center h-screen">


      {data.username}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: {db, currentUserId: null},
    transformer: superjson
  })

  const slug = context.params?.slug;

  if (typeof slug !== "string") {
    throw new Error("no slug")
  }

  const username = slug.replace("@", "")

  await ssg.profile.getUserByUsername.prefetch({username})

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username
    }
  }
}

export const getStaticPaths= () => {

  return {paths: [], fallback: "blocking"}
}

export default ProfilePage;
