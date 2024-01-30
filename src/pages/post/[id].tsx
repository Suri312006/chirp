
import Head from "next/head";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import type { NextPage } from "next";
import { PageLayout } from "~/components/customLayout";
dayjs.extend(relativeTime)

const SinglePostPage:NextPage = () => {
  return (
    <>
      <Head>
        <title>
          {/* should show post name lmao*/}
          Chirp - 
        </title>
      </Head>
      <PageLayout> 

      <main className="flex justify-center h-screen">
        Profile View
      </main>
      </PageLayout>
    </>
  );
}

export default SinglePostPage;
