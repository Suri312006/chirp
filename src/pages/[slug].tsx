import Head from "next/head";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime)

export default function ProfilePage() {
  return (
    <>
      <Head>
        <title>
          What the fuck gang
        </title>
      </Head>

      <main className="flex justify-center h-screen">


        Profile View


      </main>
    </>
  );
}
