import Head from "next/head";
import Link from "next/link";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  const user = useUser();
  // never want a user to connect to the database directly, use tRPC to do that
  // wait this is so clean than supabase bro omg
  const { data } = api.post.getAll.useQuery();

  console.log(data);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <div> {!user.isSignedIn && <SignInButton />}{!!user.isSignedIn && <SignOutButton />}
          </div>

          <div>
            {data?.map((post) => (<div key={post.id}> {post.content}</div>))}
          </div>


      </main>
    </>
  );
}
