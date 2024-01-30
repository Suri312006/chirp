import Head from "next/head";
import Image from "next/image";
import { createServerSideHelpers } from '@trpc/react-query/server';
import type { GetStaticProps, } from 'next';
import { db } from '~/server/db';
import { appRouter } from '~/server/api/root';
import superjson from 'superjson';
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { LoadingPage } from "~/components/loading";
dayjs.extend(relativeTime)
import type { NextPage } from "next";
import { PageLayout } from "~/components/customLayout";


export const ProfilePage: NextPage<{ username: string }> = ({ username }) => {

  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
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

      <PageLayout>
        <div className=" relative h-36  bg-slate-600">

          {/* the alt should have the name of the person's profile*/}
          <Image src={data.profilePicture}
            width={136}
            height={136}
            alt="profile image"
            className="absolute bottom-0 left-0 -mb-[68px] ml-4 rounded-full border-4 border-black"
          />

        </div>
        <div className="h-[64px]" />
        <div id='user info'className="p-4 text-2xl font-bold">
          {`@${data.username}`}
        </div>


        <div className="border-b border-slate-600 w-full" /> 
      </PageLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { db, currentUserId: null },
    transformer: superjson
  })

  const slug = context.params?.slug;

  if (typeof slug !== "string") {
    throw new Error("no slug")
  }

  const username = slug.replace("@", "")

  await ssg.profile.getUserByUsername.prefetch({ username })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username
    }
  }
}

export const getStaticPaths = () => {

  return { paths: [], fallback: "blocking" }
}

export default ProfilePage;
